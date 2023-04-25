<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";

    import Button from '../../components/Button.svelte';
    import ItemName from '../../components/Itemname.svelte';

    import type {User, Status, UserStats} from '../../types/user';
    import type {Friend} from '../../types/friend';

    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {io, Socket} from "socket.io-client";
	import UserStat from "../../components/UserStat.svelte";
	import UserInfo from "../../components/UserInfo.svelte";
    import Popup from "../../components/Popup.svelte";
	import NavBar from "../../components/NavBar.svelte";

    interface UserStats {
        played: number,
        ratio: number,
        level: number,
		league: string
    }

    let Status: {
        ONLINE: 'ONLINE',
        OFFLINE: 'OFFLINE',
        HIDDEN: 'HIDDEN'
    };
    type Status = (typeof Status)[keyof typeof Status]

    type Friend = {
        id: number
        user_id: number
        friend_id: number
        request_at: Date
        accept_at: Date | null
    }



    let search_value: string = "";
    let search : User[] = [];
    let friends : User[] = [];
    let user : User;
    let connectedWs: Boolean = false;
    let socket: Socket ;


    let userstats : UserStats = {
        played : 42,
        ratio: 84,
        level: 21,
		league: "gold"
    }


    async function searchUser()
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/user/search?skip=0&take=10&element=name&value=${search_value}`, {
            method: 'GET',
            credentials: 'include'
        });
        search = await res.json();
    }
    onMount(async () => {

        let res: Response = await fetch(`${PUBLIC_API_URI}/auth/islogged`, {
            method: 'GET',
            credentials: 'include'
        });
        res = await res.json();
        if (!res)
            await goto("/")

        res = await fetch(`${PUBLIC_API_URI}/user/friend`, {
            method: 'GET',
            credentials: 'include'
        });

        const friends_list: Friend[] = (await res.json()).friend;


        res = await fetch(`${PUBLIC_API_URI}/user/id/me`, {
            method: 'GET',
            credentials: 'include'
        });
        user = await res.json();

        for (const item of friends_list) {
            let id = item.friend_id === user.id ? item.user_id : item.friend_id;
            try {
                if (item.accept_at == null)
                    continue;
                const res: Response = await fetch(`${PUBLIC_API_URI}/user/id/${id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const new_friend: User = (await res.json());
                friends.push(new_friend)
            }
            catch (err)
            {
                console.error(err);
            }
        }


        socket = io('/events', {
            path: "/ws/"
        });

        socket.on("connection", (data) => {
            connectedWs = true;
            console.log("CONNECTION OK");
        })

        socket.on("FriendStatusUdpate", (data: {id: number, status: Status})=>{
            const index = friends.findIndex((element: Friend)=> element.id == data.id)
            friends[index].online_status = data.status;
        })

        socket.on("NewFriend", (user: User)=>{
            console.log("NEW FRIEND ")
            console.log(user);
            friends = [...friends, user];
        })

        socket.on("LostFriend", (data: {id: number})=>{
            friends = friends.filter((item: User)=>{
                return (item.id != Number(data.id))
            })
        })
    })

    let _openUpdate: boolean = false;
    let _openFile: boolean = false;

	const updatePopUp = ( _popup : string ) => {
		if (_popup === "update") {
			_openUpdate = !_openUpdate;
		} else if ( _popup === "file" ) {
			_openFile = !_openFile;
		}
	}

    let error : string = ""
    async function updateUser(value)
    {
        if (value.level <= 0)
            return ;
        const res: Response = await fetch(`${PUBLIC_API_URI}/user/me`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: value})
        });
        if (res.status != 201)
        {
            error = (await res.json()).message;
            return ;
        }
        else
        {
            user = await res.json();
            _openUpdate = false;
        }
    }


    //export let data: PageData;
</script>

<svelte:head>
    <script>
        window.jdenticon_config = {
            hues: [207],
            lightness: {
                color: [0.84, 0.84],
                grayscale: [0.84, 0.84]
            },
            saturation: {
                color: 0.48,
                grayscale: 0.48
            },
            backColor: "#383683"
        };
    </script>
</svelte:head>

<NavBar user={user} />

<div class="h-full md:py-5 xl:py-10">

    <div class="h-[85%] mx-[2%] self-center py-1">

        <div class="md:flex h-full text-center align-middle m-1 space-x-5 ">

            <div class="relative screen grow shadow-lg shadow-black/50 bg-black/25 justify-around overflow-auto lg:flex rounded-3xl">
				<div class="absolute screen-overlay"></div>
                <div class="my-5">
					<div class="flex items-center ">

						<div class="grow m-5">
							<UserInfo portal=true user={user} update={updatePopUp} />

							{#if error.length > 0}
								<div class="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
									<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
									<div class="fixed inset-0 overflow-y-auto">
										<div class="flex min-h-full items-center justify-center p-4 text-left sm:items-center sm:p-0">

											<div class="bg-red-100 border border-red-400 text-red-700 px-60 py-3 rounded relative" role="alert">
												<strong class="font-bold">ERROR SERVER !</strong>
												<span class="block sm:inline">{error}</span>
												<span on:click={()=>{error=""}} class="absolute top-0 bottom-0 right-0 px-4 py-3">
													<svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
												</span>
											</div>
										</div>
									</div>
								</div>
							{/if}

							{#if _openUpdate}
								<PopUp updateUser={updateUser} close={updatePopUp} title="Modify username" placeholder="Username" />
							{/if}
							{#if _openFile}
								<PopUp close={updatePopUp} title="Modify profile picture" />
							{/if}
						</div>

					</div>

					<div class="relative flex items-center">

						<div class="grow">

							<div class="mt-5">
								<UserStat userstats={userstats}></UserStat>
							</div>

							<div on:click={()=>{updatePopUp("newGame")}}  class="mt-5"><Button color="bg-process-green border-2 border-black hover:border-process-green hover:bg-transparent hover:rounded-xl hover:text-process-green hover:scale-105 transition-all" width="w-52" name="New Game" /></div>

							<div class="md:flex justify-center">

								<div class="m-2">
									<Button rounded="rounded-l-md hover:rounded-l-xl" color="bg-thread-blue border-2 border-black hover:bg-transparent hover:text-thread-blue hover:border-thread-blue hover:scale-105 transition-all" width="w-23" name="DM" url="/rooms/dms/last" />
									<Button rounded="rounded-r-md hover:rounded-r-xl" color="bg-thread-blue border-2 border-black hover:bg-transparent hover:text-thread-blue hover:border-thread-blue hover:scale-105 transition-all" width="w-23" padding="px-4 py-1" name="Channel" url="/rooms/channel/last"/>
								</div>

							</div>
						</div>
					</div>
				</div>
            </div>

            <div class="hidden md:w-1/3 lg:w-1/4 md:flex md:flex-col">

                <h2 class="text-left border-b-2 text-lg">Friends lists</h2>



                <div class="mt-2">
                    <input class="w-full rounded-2xl py-1 px-3 bg-color5 focus:outline-none" type="text" bind:value={search_value} placeholder="Search" on:keyup={searchUser}>
                </div>

                <div class="overflow-auto mt-3">
                    {#if search_value.length <= 0}
                        {#if friends.length <= 0}
                            <p>NO FRIEND</p>  <!-- CREATE THIS -->
                        {:else}
                            {#each friends as friend}
                                <ItemName user={friend}></ItemName>
                            {/each}
                        {/if}
                    {:else}
                        {#if  search.length <= 0}
                            <p>no user found :/</p>  <!-- CREATE THIS -->
                        {:else}
                            {#each search as user}
                                <ItemName user={user}></ItemName>
                            {/each}
                        {/if}
                    {/if}
                </div>

            </div>

        </div>

    </div>

</div>





