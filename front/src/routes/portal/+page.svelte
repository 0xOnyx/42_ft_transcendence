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
    import Popup_modify_username from "../../components/Popup_modify_username.svelte";
    import Popup_modify_picture from "../../components/Popup_modify_picture.svelte";

    interface UserStats {
        played: number,
        ratio: number,
        level: number,
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
        level: 21
    }

    async function searchUser()
    {
        if (search_value.length <= 0)
            return ;
        const res: Response = await fetch(`${PUBLIC_API_URI}/user/search?skip=0&take=10&element=name&value=${search_value}`, {
            method: 'GET',
            credentials: 'include'
        });
        search = await res.json();
        search = search.filter((item: User)=>{return (item.id != user.id)})
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
            try {
                let id =  item.friend_id === user.id ? item.user_id : item.friend_id
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
        })

        socket.on("FriendStatusUdpate", (data: {id: number, status: Status})=>{
            const index = friends.findIndex((element: User)=> element.id == data.id)
            friends[index].online_status = data.status;
        })

    })

    let openUpdate: boolean = false;
    let openFile: boolean = false;

    const closeUpdate = () => {
        openUpdate = false;
    }

    const closeFile = ()=>{
        openFile = false;
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
            openUpdate = false;
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

<div class="h-full container md:py-10 xl:py-20 mx-auto">

    <div class="h-full bg-color3 self-center md:border-4 border-black rounded p-1 pb-3 xl:p-8">

        <div class="md:flex h-full text-center align-middle m-1">

            <div class="bg-color5 grow justify-around lg:flex mr-2 xl:mr-8 overflow-auto p-5 rounded-xl">

                <div class="flex items-center">

                    <div class="grow">
                        <UserInfo user={user}></UserInfo>

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

                        {#if openUpdate}
                            <Popup_modify_username updateUser={updateUser} close={closeUpdate} title="Modify username" placeholder="Username"></Popup_modify_username>
                        {/if}
                        {#if openFile}
                            <Popup_modify_picture close={closeFile} title="Modify profile picture"></Popup_modify_picture>
                        {/if}

                        <div class="mt-5" disabled='{connectedWs}'  on:click={()=>{openUpdate = true }} ><Button width="w-45" color={connectedWs ? 'bg-color2': 'bg-neutral-600'} name={connectedWs ? "Change Username": "Loading.."}></Button></div>
                        <div class="mt-7" disabled='{connectedWs}' on:click={()=>{openFile = true}}> <Button width="w-45" color={connectedWs ? 'bg-color2': 'bg-neutral-600'} name={connectedWs ? "Change Avatar": "Loading.."}></Button></div>
                    </div>

                </div>

                <div class="flex items-center">

                    <div class="grow">

                        <div class="mt-5">
                            <UserStat userstats={userstats}></UserStat>
                        </div>

                        <div class="mt-12"><Button width="w-52" name="New Game" url="/"></Button></div>

                        <div class="md:flex justify-center mt-5">

                            <div class="m-2"><Button width="w-28" name="DM" url="/rooms/dms/last"></Button></div>
                            <div class="m-2"><Button width="w-28" name="Channel" url="/rooms/channel/last"></Button></div>

                        </div>

                    </div>

                </div>

            </div>
            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">

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
                                <ItemName io={socket} user={friend}></ItemName>
                            {/each}
                        {/if}
                    {:else}
                        {#if  search.length <= 0}
                            <p>no user found :/</p>  <!-- CREATE THIS -->
                        {:else}
                            {#each search as user}
                                <ItemName io={socket} user={user}></ItemName>
                            {/each}
                        {/if}
                    {/if}
                </div>

            </div>

        </div>

    </div>

</div>





