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
    import PopUp from "../../components/Popup.svelte";
	import NavBar from "../../components/NavBar.svelte";
	import Icon from "../../components/Icon.svelte";
	import Achievement from "../../components/Achievement.svelte";
	import userservice from "../../services/UserService";
    import WarningAsk from '../../components/warningAsk.svelte'

    interface UserStats {
        played: number,
		win: number,
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

	let leftHanded : boolean = false;


    let userstats : UserStats = {
        played : 42,
		win: 19,
		ratio: 84,
        level: 21,
		league: "gold"
    }

	$: userstats.ratio = Math.round(userstats.win / userstats.played * 100);

    async function searchUser()
    {
        search = await userservice.searchUser(search_value);
    }

    onMount(async () => {

        let res: Response;

        if(! await userservice.isLogged())
            await goto("/");

        user = await userservice.getCurrentUser();
        friends = await userservice.getFriends();

        socket = io('/events', {
            path: "/ws/"
        });

        socket.on("connection", (data) => {
            connectedWs = true;
        })

        socket.on("FriendStatusUdpate", (data: {id: number, status: Status})=>{
            const index = friends.findIndex((element: Friend)=> element.id == data.id)
            friends[index].online_status = data.status;
        })

        socket.on("NewFriend", (user: User)=>{
            friends = [...friends, user];
        })

        socket.on("LostFriend", (data: {id: number})=>{
            friends = friends.filter((item: User)=>{
                return (item.id != Number(data.id))
            })
        })

        socket.on("exception", (data: {status: string, message: string})=>{
            error = data.message;
        });

    })

    let _openUpdate: boolean = false;
    let _openFile: boolean = false;

	const updatePopUp = ( e : CustomEvent ) => {
		if (e.detail.text === "update") {
			_openUpdate = !_openUpdate;
		} else if ( e.detail.text === "file" ) {
			_openFile = !_openFile;
		}
	}

    let error : string = ""
    async function updateUser(e : CustomEvent)
    {
		let value = e.detail.text;
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
    let closeWarningUnbanUser = -1;
    async function acceptUnbanUser()
    {
        await socket.emit("unblockUser", {
            user_id: closeWarningUnbanUser
        });
        closeWarningUnbanUser = -1;
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

{#if closeWarningUnbanUser > 0}
    <WarningAsk title="Ublock user" message="Do you want to unban this user ?."
                buttonAccecpt={acceptUnbanUser} buttonDecline={()=>{closeWarningUnbanUser = -1}}></WarningAsk>
{/if}

<NavBar user={user} bind:leftHanded={leftHanded}/>

<div class="h-full py-7 landscape:py-0 md:py-10 xl:py-10">

    <div class="sm:h-[85%] w-full px-[2%] self-center py-1 grid">

        <div class="grid mobile-landscape:grid-cols-2 gap-4 {leftHanded ? 'mobile-landscape:pl-[3.75rem]' : 'mobile-landscape:pr-[3.75rem]'} sm:grid-cols-3 h-full text-center align-middle m-1">

            <div class="relative info-user screen shadow-lg shadow-black/50 bg-black/25 overflow-auto rounded-3xl mobile-landscape:col-span-1 sm:col-span-2">
				<div class="absolute screen-overlay"></div>
                <div class="py-[3%] gap-y-3 h-full grid grid-cols-2 grid-rows-2 mobile-landscape:grid-cols-2 mobile-landscape:grid-rows-2 sm:grid-rows-none sm:grid-cols-1">
					<div class="relative col-start-1 row-start-1 self-end sm:self-end">
						<UserInfo portal=true user={user} on:updateUserInfo={updatePopUp} />

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
							<PopUp id="update" on:confirmPopUp={updateUser} on:closePopUp={updatePopUp} title="Modify username" placeholder="Username" />
						{/if}
						{#if _openFile}
							<PopUp id="file" on:closePopUp={updatePopUp} title="Modify profile picture" />
						{/if}
					</div>

					<div class="relative self-end sm:self-center col-start-2 row-start-1 mobile-landscape:col-start-2 mobile-landscape:row-start-1 sm:col-start-1 sm:row-start-2">
						<UserStat userstats={userstats} />
					</div>

					<div class="relative col-start-1 col-span-2 row-start-2 mobile-landscape:col-span-2 mobile-landscape:row-start-2 sm:row-start-3 sm:col-span-1 self-center mobile-landscape:self-center sm:self-start">
							<Achievement userstats={userstats} />
					</div>

				</div>
			</div>

            <div class="">

                <h2 class="flex space-x-2 text-left border-b-2 text-lg">
					<Icon icon="friends" />
					<span>Friends list</span>
				</h2>



                <div class="mt-2">
                    <input class="w-full rounded-2xl py-1 px-3 bg-color5 focus:outline-none" type="text" bind:value={search_value} placeholder="Search" on:keyup={searchUser}>
                </div>

                <div class="overflow-auto mt-3">
                    {#if search_value.length <= 0}
                        {#if friends.length <= 0}
                            <p>NO FRIEND</p>  <!-- CREATE THIS -->
                        {:else}
                            {#each friends as friend}
                                <ItemName requestBlock={()=>{closeWarningUnbanUser=friend.id}} io={socket} user={friend}></ItemName>
                            {/each}
                        {/if}
                    {:else}
                        {#if  search.length <= 0}
                            <p>no user found :/</p>  <!-- CREATE THIS -->
                        {:else}
                            {#each search as user}
                                <ItemName requestBlock={()=>{closeWarningUnbanUser=user.id}} io={socket} user={user}></ItemName>
                            {/each}
                        {/if}
                    {/if}
                </div>

            </div>

        </div>

    </div>

</div>





