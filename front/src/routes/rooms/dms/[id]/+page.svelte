<script lang="ts">
    import Button from '../../../../components/Button.svelte';
    import ItemRoomDm from '../../../../components/ItemRoomDm.svelte';
    import MessageItem from '../../../../components/Message.svelte';
    import Icon from '../../../../components/Icon.svelte';

    import type { PageData } from '../../dms/$types';

    import type {User} from '../../../../types/user';
    import type {UserStats} from '../../../../types/user';
    import type {Messages, Rooms, RoomUser} from '../../../../types/room';
    import {MessageRole} from '../../../../types/room';
	import UserNotification from '../../../../components/UserNotification.svelte';
	import UserStat from '../../../../components/UserStat.svelte';
	import UserInfo from '../../../../components/UserInfo.svelte';
    import ItemName from '../../../../components/Itemname.svelte'
    import { page } from "$app/stores";
    import {onMount} from "svelte";
    import {PUBLIC_API_URI} from "$env/static/public";
    import {goto, beforeNavigate} from "$app/navigation";
    import {io, Socket} from "socket.io-client";
    let id;

	const MAX_MESSAGE = 20
    let room_message: (Messages & {user: User})[]= [];
    let search_value: string = "";
    let message_value: string = "";
    let rooms :(Rooms & {user: RoomUser[]})[] = [];
    let current_room: (Rooms & {user: RoomUser[]});
    let current_room_user: User;
    let user : User;
    let socket: Socket;
    let connectedWs: Boolean = false;
	let chatbox : HTMLDivElement;

    let userstats : UserStats = {
        played : 42,
        ratio: 84,
        level: 21
    }
    let id_room: number;

    let loadValue = async ()=>{
        console.log("LOAD VALUE");
        let res: Response = await fetch(`${PUBLIC_API_URI}/auth/islogged`, {
            method: 'GET',
            credentials: 'include'
        })
        res = await res.json();
        if (!res)
            await goto("/");

        res = await fetch(`${PUBLIC_API_URI}/user/id/me`, {
            method: 'GET',
            credentials: 'include'
        })

        user = await res.json();

        res = await fetch(`${PUBLIC_API_URI}/message/getAllDm`, {
            method: 'GET',
            credentials: 'include'
        })
        rooms = await res.json();


        if ($page.params.id == "last")
		{
			if (!rooms || rooms.length <= 0)
				return ;
            id_room = rooms[0].id;
		}
        else
            id_room = Number($page.params.id);
        res = await fetch(`${PUBLIC_API_URI}/message/message/${id_room}?skip=0&take=${MAX_MESSAGE}`, {
            method: 'GET',
            credentials: 'include'
        })
        room_message = await res.json();
        current_room = rooms.find((item: (Rooms & {user: RoomUser[]}))=>{return (item.id === id_room)})
        let roomUserDm: RoomUser = current_room?.user.find((element: RoomUser) => element.user_id != Number(user.id));
        res = await fetch(`${PUBLIC_API_URI}/user/id/${roomUserDm.user_id}`, {
            method: 'GET',
            credentials: 'include'
        });

        current_room_user = await res.json();
        console.log(id_room);
		chatbox.scrollTop = chatbox.scrollHeight;

    }



    beforeNavigate(loadValue)
    onMount(async ()=>{
		
        loadValue();


        socket = io('/events', {
            path: "/ws/"
        });

        socket.on("connection", (data) => {
            connectedWs = true;
			console.log("CONNECTED");
        })

        socket.on("message", (data: {send_user_id: number, room_id: number, message: (Messages & {user: User}), message_type: string})=>{
            console.log(data);
            room_message.push(data.message);
            if (room_message.length > MAX_MESSAGE)
                room_message.shift();
            room_message = room_message;
        })


        socket.on("updateRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            let index: number;
            if ((index = rooms.findIndex((item: (Rooms & {user: RoomUser[]}) ) => {item.id === room.id})) == -1)
                rooms.push(room);
            else
                room[index] = room;
            rooms = rooms;
        })


    })

    let search : User[] = [];
    async function searchUser()
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/user/search?skip=0&take=10&element=name&value=${search_value}`, {
            method: 'GET',
            credentials: 'include'
        });
        search = await res.json();
        search = search.filter((item: User)=>{return (item.id != user.id)})
    }

    async function sendMessage()
    {
        socket.emit("message", {
            room_id: current_room.id,
            message: message_value,
            message_type: MessageRole.MESSAGE,
        })
    }


</script>


<div class="h-full container md:py-10 xl:py-20 mx-auto">

    <div class="h-full bg-color3 self-center md:border-4 border-black rounded p-1 pb-3 xl:p-8">

        <div class="md:flex h-full text-center align-middle m-1">

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">


                <div class="mt-2 flex mb-5">

                    <div class="mt-2 md:w-1/2 md:pr-2"><Button width="w-full"  name="DM" url="/rooms/dms/last"></Button></div>
                    <div class="mt-2 md:w-1/2 md:pl-2"><Button width="w-full"  color="bg-color5 text-white border-2 border-color2" name="Channel" url="/rooms/channel/last"></Button></div>

                </div>


                <h2 class="text-left border-b-2 text-lg">MD lists</h2>

                <div class="mt-2">

                    <input class="w-full rounded-2xl py-1 px-3 bg-color5 focus:outline-none" type="text" bind:value={search_value} placeholder="Search" on:keyup={searchUser}>

                </div>

                <div class="overflow-auto mt-3">

                    {#if search_value.length <= 0}
                        {#if !connectedWs}
                            <p>Loading..</p>
                        {:else}
                            {#if rooms.length <= 0}
                                <p>NO DM</p>  <!-- CREATE THIS -->
                            {:else}
                                {#each rooms as room}
                                    <ItemRoomDm current={room.id === id_room} user={user} room={room}></ItemRoomDm>
                                {/each}
                            {/if}
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

            <div class="bg-color5 grow justify-around md:flex md:flex-col my-5 md:my-0 md:mx-5 xl:mx-8 overflow-auto rounded-xl">

                <div bind:this={chatbox} class="overflow-auto mt-3 flex-grow">

                    {#if connectedWs}
                        <MessageItem io={io} user={user} message={room_message}></MessageItem>
                    {:else}
                        <p>CONNECTING WS..</p>
                    {/if}

                </div>

                <div class="flex items-center border-1 p-8">

                    <input  bind:value={message_value} type="text" class="border border-color2 bg-color5 rounded-md w-full p-2 pr-12 focus:outline-none" />
                    <div class="relative">
                        <button on:click={sendMessage} class="-top-4 -left-10 absolute bg-color2 p-0 m-0 rounded-xl"><Icon icon="send" css="inline p-0 h-8 stroke-color2 fill-white"></Icon></button>
                    </div>

                </div>

            </div>

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">

                {#if user}
                    <UserNotification user={user}></UserNotification>
                {:else}
                    <p>LOADING..</p>
                {/if}



                <div class="overflow-auto mt-3 bg-color5 flex-grow  rounded-xl">
                    <div class="mt-20">
                        <UserInfo user={current_room_user}></UserInfo>

                        <div>
                            <UserStat userstats={current_room_user}></UserStat>
                        </div>


                        <div>
<!--                            <RequestFriend user={current_room_user}></RequestFriend>-->
                        </div>


                    </div>


                </div>

            </div>

        </div>

    </div>

</div>


