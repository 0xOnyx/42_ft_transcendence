<script lang="ts">
    import Button from '../../../../components/Button.svelte';
    import ItemRoomDm from '../../../../components/ItemRoomDm.svelte';
    import MessageItem from '../../../../components/Message.svelte';
    import Icon from '../../../../components/Icon.svelte';
    import WarningAsk from '../../../../components/warningAsk.svelte'

    import type {User} from '../../../../types/user';
    import type {Friend} from '../../../../types/friend'
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
	import { fly, fade } from 'svelte/transition';

    import userservice from '../../../../services/UserService';
	import RoomList from '../../../../components/RoomList/RoomList.svelte';
	import IconButton from '../../../../components/IconButton.svelte';
	import { getRoom } from '../../../../services/Utilities';
	import { imageUrl } from '../../../../services/Utilities';
	import { afterUpdate } from 'svelte';
	import { leftHanded } from '../../../../services/Stores';
	import PopUpAskPassword from '../../../../components/PopUpAskPassword.svelte';

    let id;

	let history : boolean = false;
    interface UserStats {
        played: number,
		win: number,
		losses : number,
        ratio: number,
        level: number,
		league: string
    }

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
    let roomUserDm: RoomUser;
	let chatbox : HTMLDivElement;
    let error : string = ""
	let user_state_room_user : UserStats | undefined = undefined;

    let id_room: number;
    let refresh: boolean = false;

    let loadValue = async ()=>{
        refresh = !refresh;
		console.log("DM: LOAD START")
        let res: Response;

		_showCurrentRoom = true;
		_showAllRooms = false;
		_showRoomUser = false;

        if (!await userservice.isLogged())
            await goto("/");

        user = await userservice.getCurrentUser();
		console.log("DM: User obtained: ", user);

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

		const urlSegments = $page.url.toString().split('/');

		if (urlSegments.length < 5 || !(urlSegments[3] === 'rooms' && urlSegments[4] === 'dms')) {
			return;
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
        console.log("DM: CURRENT ROOM:", current_room);
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


			user_state_room_user = await userservice.getStats(current_room_user.id);

            const index = rooms.findIndex((item: (Rooms & { user: RoomUser[] })) => {
                return (item.id === id_room)
            })
            rooms[index].count_messages = 0;
        }
        else
            room_message = [];

    }

    beforeNavigate(loadValue)
    onMount(async ()=>{

        loadValue();
		console.log("DM Page - User: ", user);

        socket = io('/events', {
            path: "/ws/"
        });

        socket.on("connection", (data) => {
            connectedWs = true;
        })

        socket.on("message", (data: {send_user_id: number, room_id: number, message: (Messages & {user: User}), message_type: string})=>{
            console.log(data);
            if (data.room_id === id_room)
                room_message.push(data.message);
            else
            {
                const index = rooms.findIndex((item: (Rooms & {user: RoomUser[]}))=>{return (item.id === data.room_id)})
                if (index >= 0)
                    rooms[index].count_messages += 1;
            }
            if (room_message.length > MAX_MESSAGE)
                room_message.shift();
            room_message = room_message;
        })


        socket.on("updateRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            let index: number;
            if ((index = rooms.findIndex(item => item.id === room.id)) == -1)
                rooms.push(room);
            else
                rooms[index] = room;
            rooms = rooms;
            refresh = !refresh;
        })

        socket.on("leftRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            rooms = rooms.filter(item=>{
                return item.id != room.id
            })
            refresh = !refresh;
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
            const id = room_message.findIndex(item=>{return(item.id == message.id)});
            room_message[id] = message;
            refresh = !refresh;
        })

        socket.on("exception", (data: {status: string, message: string})=>{
            console.log("EXCEPION");
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


	let _showAllRooms : Boolean = false;
	let _showCurrentRoom : Boolean = true;
	let _showRoomUser : Boolean = false;

    let closeWarningLeftDm : Boolean = false;
    let closeWarningBlockUser : Boolean  = false;
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

	async function DeleteInvite()
    {
		let del = friends.find(item => item.id === roomUserDm.user_id )
        socket.emit("deleteFriend", {
            user_id: del?.id,
        })
    }

	async function createInvite()
    {

        socket.emit("message", {
            room_id: current_room.id,
            message: "",
            message_type: MessageRole.ADD_FRIEND,
        })
    }

	function itemClicked( e : CustomEvent) {
		console.log("dispatch received");
		const id : number = e.detail.id;
		console.log("itemClicked:", id);
		getRoom(id, socket);
	}

</script>

{#if error.length > 0}
    <div class="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-left sm:items-center sm:p-0">

                <div class="bg-red-100 border border-red-400 text-red-700 px-20 md:px-60 text-center py-3 rounded relative" role="alert">
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
    <WarningAsk title="Delete direct message" message="All your messages with {current_room_user.name} will be lost. This action cannot be undone."
        buttonAccecpt={acceptLeftDm} buttonDecline={()=>{closeWarningLeftDm = false}}></WarningAsk>
{/if}
{#if closeWarningBlockUser}
    <WarningAsk title="Block user {current_room_user.name}" message="All your messages with {current_room_user.name} will be lost. This action cannot be undone."
                buttonAccecpt={BlockUserEvent} buttonDecline={()=>{closeWarningBlockUser = false}}></WarningAsk>
{/if}
{#if closeWarningUnbanUser > 0}
    <WarningAsk title="Unblock user" message="Do you want to unblock this user ?"
                buttonAccecpt={acceptUnbanUser} buttonDecline={()=>{closeWarningUnbanUser = -1}}></WarningAsk>
{/if}


{#key refresh}
<div class="flex-col">
	{#if user && current_room}
	<NavBar user={user} current_channel={current_room?.id || -1}/>
	{/if}
	
	<div class="flex py-2 landscape:py-0 md:pt-2 xl:pt-10">
	
		<div class="h-[80vh] md:h-screen md:pb-[7rem] lg:pb-0 grow mobile-landscape:h-screen mobile-landscape:pb-0 w-full px-[5%] self-center py-1 grid overflow-hidden">

			<!-- Mobile Version-->
			<div class="relative flex md:hidden h-full sm:max-h-[90vh] text-center align-middle m-1 overflow-hidden">
				{#if _showAllRooms == true}
				<div in:fly="{{ x: -200, delay:200, duration: 400 }}" out:fly="{{ x: -200, duration: 400 }}" class="flex-col grow relative">
					<div class="flex justify-end pb-4">
						<button on:click={() => {_showAllRooms = false; _showCurrentRoom = true;}} class="flex items-center gap-2">Back<Icon icon="right-arrow"/></button>
					</div>
					<div id="RoomList" class="flex-grow h-[90%]">
						{#if user}
							<RoomList
							dmList={true}
							user={user}
							socket={socket}
							friends={friends}
							connectedWs={connectedWs}
							id_room={id_room}
							on:userClicked={itemClicked}
							on:requestPassword={() => {console.log("coucou ter");}}/>
						{:else}
							<p>LOADING..</p>
						{/if}
					</div>
				</div>
				{:else if _showCurrentRoom == true}
					<div in:fly="{{ y: 200, delay: 500, duration: 400 }}" out:fly="{{ y:200, duration: 200 }}" class="flex-col grow relative h-[90%]">
		
						<div id="CurrenrRoom" class="screen border-gray-700 shadow-lg shadow-black/50 bg-black/25 grow flex flex-col my-5 md:my-0 md:mx-5 mx-4 xl:mx-8 overflow-auto rounded-xl h-full">
							<div class="screen-overlay"></div>
							<div class="grid grid-cols-3 relative items-center py-3 bg-black/50 border-b-2 border-gray-700">
									<button on:click={() => {_showAllRooms=true; _showCurrentRoom=false;}} class="flex items-center gap-1 justify-start pl-2 text-sm"><Icon icon="left-arrow" width="20" height="20"/><Icon icon="chat" width="20" height="20"/></button>
								{#if current_room_user}
									<div class="text-md md:text-xl italic truncate">{current_room_user?.name}</div>
								{/if}
									<button on:click={() => {_showCurrentRoom=false; _showRoomUser=true;}} class="flex items-end justify-end text-sm pl-4">		
										<span class="w-[40px] h-[40px] mobile-landscape:w-[20px] mobile-landscape:h-[20px] sm:w-[20px] sm:h-[20px] bg-cover rounded-full mx-2"
										style="background-image: url( {imageUrl(current_room_user?.image_url)} )"></button>
							</div>
							<div bind:this={chatbox} class="relative mt-3 flex-grow overflow-x-hidden overflow-y-scroll">

								{#if connectedWs}
									<MessageItem socket={socket} user={user} message={room_message}></MessageItem>
								{:else}
									<p>CONNECTING WS..</p>
								{/if}

							</div>

							<div id="message-input" class="relative flex items-center bottom-0 border-1 p-8">

								<input disabled={rooms.length <= 0} on:keydown={(e)=>{e.key === "Enter" && sendMessage()}} bind:value={message_value} type="text" class="disabled:border-zinc-500  border-2 border-gray-700 bg-gray-500/75 rounded-md w-full p-2 pr-12 focus:outline-none" />
								<div class="relative">
									<button disabled={rooms.length <= 0} on:click={sendMessage} class="-top-4 -left-10 absolute disabled:bg-zinc-500 p-0 m-0 rounded-full"><Icon icon="send" css="inlinep-0 h-8 {rooms.length <= 0 ? 'stroke-zinc-500' : 'stroke-black' }  fill-thread-blue"></Icon></button>
								</div>

							</div>

						</div>
					</div>
				{:else if _showRoomUser == true}
				<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x:200, duration: 200 }}" class="flex-col grow relative h-[90%]">
					<div class="flex justify-start pb-4">
						<button on:click={() => {_showRoomUser = false; _showCurrentRoom = true;}} class="flex items-center gap-2"><Icon icon="left-arrow"/>Back</button>
					</div>
					<div class="overflow-auto mt-2 bg-color5 flex-grow h-full rounded-xl shadow-lg shadow-black mx-4">
						<div class="mt-20">
							{#if rooms.length <= 0}
								<p>NO DM</p>
							{:else}
								<UserInfo user={current_room_user}></UserInfo>
	
								<div>
									{#if user_state_room_user}
										<UserStat userstats={user_state_room_user}></UserStat>
									{/if}
								</div>
	
	
								<div class="flex flex-col gap-2 mt-5">
									{#if !roomUserDm }
										<p>LOADING..</p>
									{:else}
										{#if !friends.find(item => item.id === roomUserDm.user_id ) }
											<IconButton on:buttonClick={createInvite} icon="addUser" icon_size="30" color="text-process-green border-process-green bg-transparent" shadow="shadow-md shadow-process-green/50" title="Send friend request"/>
										{:else}
											<IconButton on:buttonClick={DeleteInvite} icon="banUser" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Remove friend"/>
										{/if}
										<IconButton on:buttonClick={()=>{closeWarningBlockUser = true}} icon="banUser" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Block User"/>
									{/if}
								</div>
	
							{/if}
						</div>
					</div>
				</div>
				{/if}

			</div>


<!-- Computer Version-->
<div class="relative hidden md:grid md:grid-cols-4 max-h-full sm:max-h-full pb-10 mobile-landscape:max-h-full mobile-landscape:pb-2 text-center align-middle m-1 overflow-hidden {$leftHanded ? 'mobile-landscape:pl-[3.75rem]' : 'mobile-landscape:pr-[3.75rem]'} overscroll-none">
	<div class="md:flex md:flex-col h-screen md:pb-[9rem] lg:pb-[8rem] mobile-landscape:pb-9">
	<div id="RoomList" class="grow">
		{#if user}
			<RoomList
				dmList={true}
				user={user}
				socket={socket}
				friends={friends}
				connectedWs={connectedWs}
				id_room={id_room}
				on:userClicked={itemClicked}/>
		{:else}
			<p>LOADING..</p>
		{/if}
		</div>
</div>
	<div class="md:flex md:flex-col col-span-2 h-screen md:pb-[9rem] lg:pb-[8rem] mobile-landscape:pb-9 ">
	<div id="CurrenrRoom" class="screen border-gray-700 shadow-lg shadow-black/50 bg-black/25 grow md:flex md:flex-col my-5  md:my-0 md:mx-5 xl:mx-8 overflow-auto rounded-xl">
		<div class="screen-overlay"></div>
		<div bind:this={chatbox} class="relative overflow-x-hidden overflow-y-scroll scroll-smooth mt-3 flex-grow">

			{#if connectedWs}
				<MessageItem socket={socket} user={user} message={room_message}></MessageItem>
			{:else}
				<p>CONNECTING WS..</p>
			{/if}

		</div>

		<div class="relative flex items-center border-1 p-8 pt-1">

			<input disabled={rooms.length <= 0} on:keydown={(e)=>{e.key === "Enter" && sendMessage()}} bind:value={message_value} type="text" class="disabled:border-zinc-500  border-2 border-gray-700 bg-gray-500/75 rounded-md w-full p-2 pr-12 focus:outline-none" />
			<div class="relative">
				<button disabled={rooms.length <= 0} on:click={sendMessage} class="-top-4 -left-10 absolute disabled:bg-zinc-500 p-0 m-0 rounded-full"><Icon icon="send" css="inlinep-0 h-8 {rooms.length <= 0 ? 'stroke-zinc-500' : 'stroke-black' }  fill-thread-blue"/></button>
			</div>

		</div>

	</div>
</div>

	<div id="RoomUsers" class="md:flex md:flex-col h-screen md:pb-[9rem] lg:pb-[8rem] mobile-landscape:pb-9">
		<div class="overflow-auto bg-color5 flex-grow h-full rounded-xl shadow-lg shadow-black mx-4">
			<div class="mt-5">
				{#if rooms.length <= 0}
				<p>NO DM</p>
			{:else}
				<UserInfo user={current_room_user}></UserInfo>

				<div>
					{#if user_state_room_user}
						<UserStat userstats={user_state_room_user}></UserStat>
					{/if}
				</div>


				<div class="flex flex-col gap-2 mt-5">
					{#if !roomUserDm }
						<p>LOADING..</p>
					{:else}
						{#if !friends.find(item => item.id === roomUserDm.user_id ) }
							<IconButton on:buttonClick={createInvite} icon="addUser" icon_size="30" color="text-process-green border-process-green bg-transparent" shadow="shadow-md shadow-process-green/50" title="Send friend request"/>
						{:else}
							<IconButton on:buttonClick={DeleteInvite} icon="banUser" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Remove friend"/>
						{/if}
						<IconButton on:buttonClick={()=>{closeWarningBlockUser = true}} icon="banUser" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Block User"/>
					{/if}
				</div>

			{/if}
			</div>
		</div>
	</div>
	</div>
	</div>

    </div>
</div>
{/key}

