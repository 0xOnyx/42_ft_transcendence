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

                        <div class="mt-5"><Button width="w-52" name="Change Username" url="/"></Button></div>
                        <div class="mt-2"><Button width="w-52" name="Change Avatar" url="/"></Button></div>
                    </div>

                </div>

                <div class="flex items-center">

                    <div class="grow">

                        <div class="mt-5">
                            <UserStat userstats={userstats}></UserStat>
                        </div>

                        <div class="mt-12"><Button width="w-52" name="New Game" url="/"></Button></div>

                        <div class="md:flex justify-center mt-5">

                            <div class="m-2"><Button width="w-28" name="DM" url="/rooms/dms"></Button></div>
                            <div class="m-2"><Button width="w-28" name="Channel" url="/rooms/channel"></Button></div>

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





