<script lang="ts">
    import Button from '../../../../components/Button.svelte';
    import ItemRoomDm from '../../../../components/ItemRoomDm.svelte';
    import MessageItem from '../../../../components/Message.svelte';
    import Icon from '../../../../components/Icon.svelte';
    import WarningAsk from '../../../../components/warningAsk.svelte'

    import type {User} from '../../../../types/user';
    import type {Friend} from '../../../../types/friend'
    import type {UserStats} from '../../../../types/user';
    import type {Messages, Rooms, RoomUser} from '../../../../types/room';
    import {MessageRole} from '../../../../types/room';
	import UserNotification from '../../../../components/UserNotificationDM.svelte';
	import UserStat from '../../../../components/UserStat.svelte';
	import UserInfo from '../../../../components/UserInfo.svelte';
    import ItemName from '../../../../components/Itemname.svelte'
    import { page } from "$app/stores";
    import {onMount} from "svelte";
    import {PUBLIC_API_URI} from "$env/static/public";
    import {goto, beforeNavigate} from "$app/navigation";
    import {io, Socket} from "socket.io-client";
    import RequestFriend from "../../../../components/RequestFriend.svelte";
    import DeleteFriend from "../../../../components/DeleteFriend.svelte";
    import BlockUser from "../../../../components/BlockUser.svelte";
	import NavBar from '../../../../components/NavBar.svelte';

    import userservice from '../../../../services/UserService';

    let id;

	const MAX_MESSAGE = 20
    let room_message: (Messages & {user: User})[]= [];
    let search_value: string = "";
    let message_value: string = "";
    let rooms :(Rooms & {user: RoomUser[]})[] = [];
    let current_room: (Rooms & {user: RoomUser[]});
    let current_room_user: User;
    let user : User;
    let friends : User[] = [];
    let socket: Socket;
    let connectedWs: Boolean = false;
    let iscurrentFriend: Boolean = false;
    let roomUserDm: RoomUser;
	let chatbox : HTMLDivElement;
    let unread_message: Number = 0;
    let error : string = ""

    let userstats : UserStats = {
        played : 42,
        ratio: 84,
        level: 21
    }
    let id_room: number;

    let loadValue = async ()=>{

        let res: Response;

        console.log("LOAD VALUE");

        if (!await userservice.isLogged())
            await goto("/");

        user = await userservice.getCurrentUser();

        res = await fetch(`${PUBLIC_API_URI}/user/friend`, {
            method: 'GET',
            credentials: 'include'
        });

        const friends_list: Friend[] = (await res.json()).friend;

        for (const item of friends_list) {
            try {
                let id =  item.friend_id === user.id ? item.user_id : item.friend_id
                if (item.accept_at == null)
                    continue;
                const res: Response = await fetch(`${PUBLIC_API_URI}/user/id/${id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const new_friend: User = (await res.json());
                friends = [...friends, new_friend];
            }
            catch (err)
            {
                console.error(err);
            }
        }

        if (rooms.length <= 0)
        {
            res = await fetch(`${PUBLIC_API_URI}/message/getAllDm`, {
                method: 'GET',
                credentials: 'include'
            })
            rooms = await res.json();
        }


        if ($page.params.id == "last")
		{
			if (!rooms || rooms.length <= 0)
				return ;
            id_room = rooms[0].id;
		}
        else
            id_room = Number($page.params.id);
        current_room = rooms.find((item: (Rooms & {user: RoomUser[]}))=>{return (item.id === id_room)}) as (Rooms & {user: RoomUser[]});
        if (!current_room && $page.params.id != "last")
        {
            await goto("/rooms/dms/last");
        }
        else if (current_room) {
            res = await fetch(`${PUBLIC_API_URI}/message/message/${id_room}?skip=0&take=${MAX_MESSAGE}`, {
                method: 'GET',
                credentials: 'include'
            })
            room_message = await res.json();
            roomUserDm = current_room?.user.find((element: RoomUser) => element.user_id != Number(user.id));
            res = await fetch(`${PUBLIC_API_URI}/user/id/${roomUserDm.user_id}`, {
                method: 'GET',
                credentials: 'include'
            });

            current_room_user = await res.json();

            const index = rooms.findIndex((item: (Rooms & { user: RoomUser[] })) => {
                return (item.id === id_room)
            })
            rooms[index].count_messages = 0;
        }
        else
            room_message = [];
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
        })

        socket.on("message", (data: {send_user_id: number, room_id: number, message: (Messages & {user: User}), message_type: string})=>{
            if (data.room_id === id_room)
                room_message.push(data.message);
            else
            {
                const index = rooms.findIndex((item: (Rooms & {user: RoomUser[]}))=>{return (item.id === data.room_id)})
                rooms[index].count_messages += 1;
            }
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

        socket.on("leftRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            rooms = rooms.filter(item=>{
                return item.id != room.id
            })
        })

        socket.on("NewFriend", (user: User)=>{
            friends = [...friends, user];
        })

        socket.on("LostFriend", (data: {id: number})=>{
            friends = friends.filter((item: User)=>{
                return (item.id != Number(data.id))
            })
        })

        socket.on("updateMessage", (message: (Messages & {user: User}))=>{
            console.log(message)
            console.log(room_message);
            const id = room_message.findIndex(item=>{return(item.id == message.id)});
            room_message[id] = message;
        })

        socket.on("exception", (data: {status: string, message: string})=>{
            error = data.message;
        });

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
        if (message_value.length <= 0)
            return ;
        socket.emit("message", {
            room_id: current_room.id,
            message: message_value,
            message_type: MessageRole.MESSAGE,
        })
		message_value = "";
    }


    let closeWarningLeftDm = false;
    let closeWarningBlockUser = false;
    let closeWarningUnbanUser = -1;

    async function acceptLeftDm()
    {
        await socket.emit("leftDm", {user_id: current_room_user.id})
        closeWarningLeftDm = false;
        room_message = [];
        await goto("/rooms/dms/last")
    }
    async function BlockUserEvent()
    {
        await socket.emit("blockUser", {
            user_id: current_room_user.id,
        });
        await goto("/rooms/dms/last")
        closeWarningBlockUser = false;
        room_message = [];
    }
    async function acceptUnbanUser()
    {
        await socket.emit("unblockUser", {
            user_id: closeWarningUnbanUser
        });
        await goto("/rooms/dms/last")
        closeWarningUnbanUser = -1;
    }

</script>

{#if error.length > 0}
    <div class="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-left sm:items-center sm:p-0">

                <div class="bg-red-100 border border-red-400 text-red-700 px-60 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Error !</strong>
                    <span class="block sm:inline">{error}</span>
                    <span on:click={()=>{error=""}} class="absolute top-0 bottom-0 right-0 px-4 py-3">
	    				<svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
					</span>
                </div>
            </div>
        </div>
    </div>
{/if}


{#if closeWarningLeftDm}
    <WarningAsk title="Delete direct message" message="You will lose all of your message with {current_room_user.name}. This action cannot be undone."
        buttonAccecpt={acceptLeftDm} buttonDecline={()=>{closeWarningLeftDm = false}}></WarningAsk>
{/if}
{#if closeWarningBlockUser}
    <WarningAsk title="Block user {current_room_user.name}" message="You block this user is lose all of your message with {current_room_user.name}. This action cannot be undone."
                buttonAccecpt={BlockUserEvent} buttonDecline={()=>{closeWarningBlockUser = false}}></WarningAsk>
{/if}
{#if closeWarningUnbanUser > 0}
    <WarningAsk title="Ublock user" message="Do you want to unban this user ?."
                buttonAccecpt={acceptUnbanUser} buttonDecline={()=>{closeWarningUnbanUser = -1}}></WarningAsk>
{/if}

<NavBar user={user} />


<div class="h-full container md:py-5 xl:py-10 mx-auto">

    <div class="h-[85%] bg-color3 self-center md:border-4 border-black rounded p-1 pb-3 xl:p-8">

        <div class="md:flex h-full text-center align-middle m-1">

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">


                <div class="mt-2 flex mb-5">

                    <div class="mt-2 md:w-1/2 md:pr-2"><Button width="w-full"  name="DM" url="/rooms/dms/last"></Button></div>
                    <div class="mt-2 md:w-1/2 md:pl-2"><Button width="w-full"  color="bg-color5 text-white border-2 border-color2" name="Channel" url="/rooms/channel/last"></Button></div>

                </div>


                <h2 class="text-left border-b-2 text-lg">DM list</h2>

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
                        {#if search.length <= 0}
                            <p>no user found :/</p>  <!-- CREATE THIS -->
                        {:else}
                            {#each search as user}
                                <ItemName requestBlock={()=>{closeWarningUnbanUser=user.id}} socket={socket} user={user}></ItemName>
                            {/each}
                        {/if}
                    {/if}
                </div>
            </div>

            <div class="bg-color5 grow justify-around md:flex md:flex-col my-5 md:my-0 md:mx-5 xl:mx-8 overflow-auto rounded-xl">


                <div bind:this={chatbox} class="overflow-x-hidden overflow-y-scroll scroll-smooth mt-3 flex-grow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

                    {#if connectedWs}
                        <MessageItem socket={socket} user={user} message={room_message}></MessageItem>
                    {:else}
                        <p>CONNECTING WS..</p>
                    {/if}

                </div>

                <div class="flex items-center border-1 p-8">

                    <input autofocus on:keydown={(e)=>{e.key === "Enter" && sendMessage()}} bind:value={message_value} type="text" class="border border-color2 bg-color5 rounded-md w-full p-2 pr-12 focus:outline-none" />
                    <div class="relative">
                        <button on:click={sendMessage} class="-top-4 -left-10 absolute bg-color2 p-0 m-0 rounded-xl"><Icon icon="send" css="inline p-0 h-8 stroke-color2 fill-white"></Icon></button>
                    </div>

                </div>

            </div>

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">

                {#if user}
                    <UserNotification openWarning={()=>{closeWarningLeftDm = true}} rooms={rooms} user={user}></UserNotification>
                {:else}
                    <p>LOADING..</p>
                {/if}



                <div class="overflow-auto mt-3 bg-color5 flex-grow  rounded-xl">
                    <div class="mt-20">
                        {#if rooms.length <= 0}
                            <p>NO DM</p>
                        {:else}
                            <UserInfo portal=false user={current_room_user}></UserInfo>

                            <div>
                                <UserStat userstats={current_room_user}></UserStat>
                            </div>


                            <div>
                                {#if !roomUserDm }
                                    <p>LOADING..</p>
                                {:else}
                                    {#if !friends.find(item => item.id === roomUserDm.user_id ) }
                                        <RequestFriend room={current_room} socket={socket} user={current_room_user}></RequestFriend>
                                    {:else}
                                        <DeleteFriend socket={socket} user={friends.find(item => item.id === roomUserDm.user_id )}></DeleteFriend>
                                    {/if}
                                    <BlockUser openWarning={()=>{closeWarningBlockUser = true}}></BlockUser>
                                {/if}
                            </div>

                        {/if}
                    </div>


                </div>

            </div>

        </div>

    </div>

</div>


