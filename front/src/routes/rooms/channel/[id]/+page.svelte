<script lang="ts">
    import Button from '../../../../components/Button.svelte';
    import ButtonElement from '../../../../components/ButtonElement.svelte';
    import ButtonElementWarning from  '../../../../components/ButtonElementWarning.svelte';
    import ItemRoomChannel from '../../../../components/ItemRoomChannel.svelte';
    import MessageItem from '../../../../components/Message.svelte';
    import Icon from '../../../../components/Icon.svelte';
    import WarningAsk from '../../../../components/warningAsk.svelte'
    import PopUpAskPasswordChange from '../../../../components/PopUpAskPasswordChange.svelte';

    import type { User } from '../../../../types/user';
    import type { Friend } from '../../../../types/friend'
    import { RoleUser } from '../../../../types/user'
    import type {Messages, Rooms, RoomUser} from '../../../../types/room';
    import { MessageRole } from '../../../../types/room';
    import UserNotification from '../../../../components/UserNotificationDM.svelte';
    import UserStat from '../../../../components/UserStat.svelte';
    import UserInfo from '../../../../components/UserInfo.svelte';
    import ItemNameChannel from '../../../../components/ItemNameChannel.svelte'
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { PUBLIC_API_URI } from "$env/static/public";
    import { goto, beforeNavigate, invalidateAll } from "$app/navigation";
    import { io, Socket } from "socket.io-client";
    import NavBar from '../../../../components/NavBar.svelte';
    import ItemRoomUserElement from '../../../../components/ItemRoomUserElement.svelte';
	import { fade, fly } from 'svelte/transition';

    import userservice from '../../../../services/UserService';
    import PopUpCreateDm from "../../../../components/PopUpCreateDm.svelte";
    import PopUpAskPassword from "../../../../components/PopUpAskPassword.svelte";
    import PopUpAskTime from "../../../../components/PopUpAskTime.svelte";

	import RoomList from '../../../../components/RoomList/RoomList.svelte';

	import { leftHanded } from '../../../../services/Stores';
	import IconButton from '../../../../components/IconButton.svelte';
	import History from '../../../../components/History.svelte';
	import type { GameHistory } from '../../../../types/user';

    let id;

    const MAX_MESSAGE = 20
    let room_message: (Messages & {user: User})[]= [];
    let search_value: string = "";
    let message_value: string = "";
    let rooms :(Rooms & {user: RoomUser[]})[] = [];
    let current_room_id: Number = -1;
    let current_room_user: User;
    let user : User;
    let friends : User[] = [];
    let socket: Socket;
    let connectedWs: Boolean = false;
    let iscurrentFriend: Boolean = false;
    let currentRoomUserSelect: User;
	let gamehistory : GameHistory[] = [];
    let chatbox : HTMLDivElement;
    let unread_message: Number = 0;
    let error : string = ""
    let refresh : boolean = false;

    let id_room: number;

	let _showAllRooms : Boolean = false;
	let _showCurrentRoom : Boolean = true;
	let _showRoomUsers : Boolean = false;
    let locked : User[] = [];
	let history : Boolean = false;

    let loadValue = async ()=>{
        refresh = !refresh;
        // console.log("CHANNEL: LOAD START");
        let res: Response;

        currentRoomUserSelect = null;
		_showCurrentRoom = true;
		_showAllRooms = false;
		_showRoomUsers = false;

        if (!await userservice.isLogged()) {
            await goto("/");}

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

		const urlSegments = $page.url.toString().split('/');

		if (urlSegments.length < 5 || !(urlSegments[3] === 'rooms' && urlSegments[4] === 'channel')) {
			return;
		}

            // console.log("REFETCH CHANNEL MESSAGE");
            res = await fetch(`${PUBLIC_API_URI}/message/rooms`, {
                method: 'GET',
                credentials: 'include'
            })
            rooms = await res.json();
        if ($page.params.id == "last")
        {
            if (!rooms || rooms.length <= 0) {
                current_room_id = -1;
                return;
            }
            id_room = rooms[0].id;
        }
        else
            id_room = Number($page.params.id);
        rooms = rooms.filter((item: (Rooms & {user: RoomUser[]}))=>{return (
            !(item.user.find(element=>element.user_id == user.id).ban)
        )})
        current_room_id = rooms.findIndex((item: (Rooms & {user: RoomUser[]}))=>{return (item.id === id_room)});

        // console.log("CHANNEL ID ROOM +> ", current_room_id);

        if (current_room_id == -1 && $page.params.id != "last")
        {
            await goto("/rooms/channel/last");
        }
        else if (current_room_id != -1) {
            res = await fetch(`${PUBLIC_API_URI}/message/message/${id_room}?skip=0&take=${MAX_MESSAGE}`, {
                method: 'GET',
                credentials: 'include'
            })
            room_message = await res.json();
            locked = await userservice.getBlockedUsers();
            room_message = room_message.map(item=>{
                if (locked.some(element => element.id == item.user.id))
                    item.content = "blocked user";
                return item;
            });

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


        socket = io('/events', {
            path: "/ws/"
        });

        socket.on("connection", (data) => {
            connectedWs = true;
        })

        socket.on("message", async (data: {send_user_id: number, room_id: number, message: (Messages & {user: User}), message_type: string})=>{
            if (data.message.user.id != user.id)
            {
                let res: Response = await fetch(`${PUBLIC_API_URI}/user/isBlockedByMe/${data.message.user.id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                let status = await res.json();
                // console.log(status);
                if (status) {
                    data.message.content = "blocked user";
                }
            }
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
            // console.log("NEW UPDATE ROOM")
            // console.log(room);
            if ((index = rooms.findIndex(item => item.id === room.id)) == -1)
                rooms.push(room);
            else
                rooms[index] = room;
            rooms = rooms;
            // console.log(rooms);
            refresh = !refresh;
            invalidateAll();
        })

        socket.on("leftRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            // console.log("left room");
            if (rooms)
                return ;
            const room_id_current = rooms[current_room_id].id;
            rooms = rooms.filter(item=>{
                return item.id != room.id
            })
            if (room.id === room_id_current)
                room_message = [];
            refresh = !refresh;
            invalidateAll();
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
        })

        socket.on("exception", (data: {status: string, message: string})=>{
            error = data.message;
        });

    })

    async function sendMessage()
    {
        if (message_value.length <= 0)
            return ;
        socket.emit("message", {
            room_id: rooms[current_room_id].id,
            message: message_value,
            message_type: MessageRole.MESSAGE,
        })
        message_value = "";
    }



    let closeWarningLeftChannel = false;
    let closeWarningBlockUser = false;
    let closeWarningUnbanUser = -1;
    let closePopupCreateRoom = false;

    let closeKickUser = false;
    let closeBanUser = false;
    let closeSetAdmin = false;
    let closePassworRoom = false;
    let closeDeleteRoom = false
    let closeMuteUser = false;
    let closeUnsetAdmin = false;
    let closeUnBanUser = false;

    async function acceptLeftChannel()
    {
        await socket.emit("leftRoomPublic", {room_id: id_room})
        closeWarningLeftChannel = false;
        room_message = [];
        current_room_id = -1;
        await goto("/rooms/channel/last")
    }
    async function BlockUserEvent()
    {
        await socket.emit("blockUser", {
            user_id: current_room_user.id,
        });
        await goto("/rooms/channel/last")
        closeWarningBlockUser = false;
        room_message = [];
    }
    async function acceptUnbanUser()
    {
        await socket.emit("unblockUser", {
            user_id: closeWarningUnbanUser
        });
        await goto("/rooms/channel/last")
        closeWarningUnbanUser = -1;
    }

    async function createRoom(room_name: string, password: string)
    {
        let data: {name: string, password?: string} = {name: room_name};
        if (password.length > 0)
            data.password = password;
        await socket.emit("createRoomPublic", data, (data)=>{
            goto(`/rooms/channel/${data}`);
        })
        closePopupCreateRoom = false;
    }

    async function changePassword(event)
    {
        socket.emit("updateRoomPublic", {room_id: rooms[current_room_id].id, password: event.detail});
        closePassworRoom = false;
    }

    async function deleteRoom()
    {
        socket.emit("deleteRoomPublic", {room_id: rooms[current_room_id].id})
        closeDeleteRoom = false;
        await goto('/rooms/channel/last');
    }

    async function kickUser()
    {
        await socket.emit("kickUser", {room_id: rooms[current_room_id].id, user_id: currentRoomUserSelect.id});
        closeKickUser = false;
        currentRoomUserSelect = null;
    }

    async function banUser()
    {
        await socket.emit("banUserChannel", {room_id: rooms[current_room_id].id, user_id: currentRoomUserSelect.id})
        closeBanUser = false;
        currentRoomUserSelect = null;
    }
    async function unbanUser()
    {
        await socket.emit("unbanUserChannel", {room_id: rooms[current_room_id].id, user_id: currentRoomUserSelect.id});
        closeUnBanUser = false;
        currentRoomUserSelect = null;
    }

    async function setAdmin()
    {
        await socket.emit("setUserRole", {room_id: rooms[current_room_id].id, user_id: currentRoomUserSelect.id, role: RoleUser.ADMIN});
        closeSetAdmin = false;
        currentRoomUserSelect = null;
    }

    async function setUnsetAdmin()
    {
        await socket.emit("setUserRole", {room_id: rooms[current_room_id].id, user_id: currentRoomUserSelect.id, role: RoleUser.USER});
        closeUnsetAdmin = false;
        currentRoomUserSelect = null;
    }

    async function setMuteTime(event)
    {
        await socket.emit("muteUser", {room_id: rooms[current_room_id].id, user_id: currentRoomUserSelect.id, number_hours: event.detail})
        closeMuteUser = false;
        currentRoomUserSelect = null;
    }

	function handleRoomCreation() {
		// console.log("event received");
		closePopupCreateRoom = true;
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

{#if closePassworRoom}
    <PopUpAskPasswordChange on:changePassword={changePassword} on:close={()=>{closePassworRoom = false}}></PopUpAskPasswordChange>
{/if}

{#if closeDeleteRoom}
    <WarningAsk title="Delete this room ?" message="You will lose all of your message in the {rooms[current_room_id].name}. This action cannot be undone."
                buttonAccecpt={deleteRoom} buttonDecline={()=>{closeDeleteRoom = false}}></WarningAsk>
{/if}

{#if closeKickUser}
    <WarningAsk title="Kick user ?" message="If your kick {currentRoomUserSelect.name}. This action cannot be undone."
                buttonAccecpt={kickUser} buttonDecline={()=>{closeKickUser = false}}></WarningAsk>
{/if}
{#if closeBanUser}
    <WarningAsk title="Ban user ?" message="If your ban {currentRoomUserSelect.name}. This action cannot be undone."
                buttonAccecpt={banUser} buttonDecline={()=>{closeBanUser = false}}></WarningAsk>
{/if}
{#if closeSetAdmin}
    <WarningAsk title="Set admin user ?" message="If your set admin {currentRoomUserSelect.name}. he will have all the rights."
                buttonAccecpt={setAdmin} buttonDecline={()=>{closeSetAdmin = false}}></WarningAsk>
{/if}
{#if closeUnsetAdmin}
    <WarningAsk title="Set admin user ?" message="If your unset admin {currentRoomUserSelect.name}. he will lose all these rights."
                buttonAccecpt={setUnsetAdmin} buttonDecline={()=>{closeUnsetAdmin = false}}></WarningAsk>
{/if}
{#if closeMuteUser}
    <PopUpAskTime on:timeSelect={setMuteTime} on:close={()=>{closeMuteUser = false}}></PopUpAskTime>
{/if}

{#if closeUnBanUser}
    <WarningAsk title="Unban user ?" message="If your unban this {currentRoomUserSelect.name}. he will get access to this room."
                buttonAccecpt={unbanUser} buttonDecline={()=>{closeUnBanUser = false}}></WarningAsk>
{/if}

{#if closeWarningLeftChannel}
    <WarningAsk title="Leave channel ?" message="You will lose all of your message with {rooms[current_room_id].name}. This action cannot be undone."
                buttonAccecpt={acceptLeftChannel} buttonDecline={()=>{closeWarningLeftChannel = false}}></WarningAsk>
{/if}
{#if closeWarningBlockUser}
    <WarningAsk title="Block user {current_room_user.name}" message="You block this user is lose all of your message with {current_room_user.name}. This action cannot be undone."
                buttonAccecpt={BlockUserEvent} buttonDecline={()=>{closeWarningBlockUser = false}}></WarningAsk>
{/if}
{#if closeWarningUnbanUser > 0}
    <WarningAsk title="Ublock user" message="Do you want to unban this user ?."
                buttonAccecpt={acceptUnbanUser} buttonDecline={()=>{closeWarningUnbanUser = -1}}></WarningAsk>
{/if}


{#key refresh}
<div class="flex-col">
	{#if user && rooms}
		<NavBar user={user} current_channel={rooms[current_room_id]?.id || -1}/>
	{/if}

	<div class="flex py-2 landscape:py-0 md:pt-2 xl:pt-10">

		<div class="h-[80vh] md:h-screen md:pb-[7rem] lg:pb-0 grow mobile-landscape:h-screen mobile-landscape:pb-0 w-full px-[5%] self-center py-1 grid overflow-hidden">


			<!-- Mobile Version-->
			<div class="relative flex md:hidden h-screen pb-[15rem] text-center align-middle m-1 overflow-hidden">
				{#if _showAllRooms == true}
				<div in:fly="{{ x: -200, delay:200, duration: 400 }}" out:fly="{{ x: -200, duration: 400 }}" class="flex-col grow relative">
					<div class="flex justify-end pb-4">
						<button on:click={() => {_showAllRooms = false; _showCurrentRoom = true;}} class="flex items-center gap-2">Back<Icon icon="right-arrow"/></button>
					</div>
					<div id="RoomList" class="flex-grow h-[90%]">
                        {#if user && socket}
						<RoomList
							dmList={false}
							fromDM={false}
							user={user}
							socket={socket}
							friends={friends}
							connectedWs={connectedWs}
							rooms={rooms}
							id_room={id_room}/>
                        {/if}
					</div>
				</div>
				{:else if _showCurrentRoom == true}
					<div in:fly="{{ y: 200, delay: 500, duration: 400 }}" out:fly="{{ y:200, duration: 200 }}" class="flex-col grow relative h-full">

						<div id="CurrenrRoom" class="screen border-gray-700 shadow-lg shadow-black/50 bg-black/25 grow flex flex-col my-5 md:my-0 md:mx-5 mx-4 xl:mx-8 overflow-auto rounded-xl h-full">
							<div class="screen-overlay"></div>
							<div class="grid grid-cols-3 relative py-3 bg-black/50 border-b-2 border-gray-700">
								<button on:click={() => {_showAllRooms=true; _showCurrentRoom=false;}} class="flex items-center gap-1 justify-start pl-2 text-sm"><Icon icon="left-arrow" width="20" height="20"/><Icon icon="chatrooms" width="20" height="20"/></button>
								<div class="text-xl italic truncate ">{rooms[current_room_id]?.name}</div>
								<button on:click={() => {_showCurrentRoom=false; _showRoomUsers=true;}} class="flex items-center justify-end gap-1 text-sm pr-2"><Icon icon="friends" width="20" height="20"/><Icon icon="right-arrow" width="20" height="20" /></button>
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
				{:else if _showRoomUsers == true}
				<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x:200, duration: 200 }}" class="flex-col grow relative h-full pb-5">
					<div class="flex justify-start pb-4">
						<button on:click={() => {_showRoomUsers = false; _showCurrentRoom = true;}} class="flex items-center gap-2"><Icon icon="left-arrow"/>Back</button>
					</div>
					<div id="RoomUsers" class="md:flex md:flex-col h-full grow mb-10">

					<div class="overflow-auto mt-2 bg-color5 flex-grow h-full rounded-xl shadow-lg shadow-black mx-4">
						<div class="flex items-center justify-end m-2">
							<button on:click={()=>{closeWarningLeftChannel = true}} class="cursor-pointer flex text-sm gap-1 items-center">
								Leave Room<Icon icon="exit" width="30" height="30" css="inline stroke-none fill-white"></Icon>
							</button>
						</div>
						{#if current_room_id >= 0 }
							<div class="mt-2 self-center">
								{#if currentRoomUserSelect}
									<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x:200, duration: 200 }}" class="justify-center flex">
										<button on:click={()=>{currentRoomUserSelect = null}}  class="hover:scale-110 text-white font-bold py-2 px-4 mx-2 rounded flex gap-2">
											<Icon icon="left-arrow"/> <span>RETURN</span>
										</button>
									</div>
								{:else if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === user.id)}
								<div in:fly="{{ x: -200, delay: 500, duration: 400 }}" out:fly="{{ x: -200, duration: 200 }}" class="flex-col justify-center items-center w-full space-y-2">
									<IconButton on:buttonClick={()=>{closePassworRoom = true}} icon="lock" icon_size="20" shadow="shadow-md shadow-gray-200/50" title="Password settings"/>
									<IconButton on:buttonClick={()=>{closeDeleteRoom = true}} icon="delete" icon_size="28" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Delete room"/>
								</div>
								{/if}
							</div>
						{/if}


                    <div id="roomUsers" class="mt-5">

                        {#if current_room_id >= 0}

                            {#if currentRoomUserSelect}
							<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x:200, duration: 200 }}">
									<UserInfo user={currentRoomUserSelect}></UserInfo>

									<div>
										{#if history}
										<div in:fade="{{ delay: 200, duration: 400 }}">
											{#if gamehistory}
												<History portal={true} curUser={currentRoomUserSelect} gamehistory={gamehistory} />
											{:else}
												<p>No games played</p>
											{/if}
											<div class="flex justify-center">
												<button on:click={()=> {history = false}} class="flex gap-2"><Icon icon="left-arrow"/>Return</button>
											</div>
										</div>
										{:else}
										<UserStat userstats={currentRoomUserSelect} on:showHistory={() => {history = true}}></UserStat>
										{/if}
									</div>

									<div class="flex-col mt-4 space-y-2">
										{#if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === user.id)
										&& rooms[current_room_id]?.owner_id !== currentRoomUserSelect.id  && currentRoomUserSelect.id !== user.id}
											{#if !rooms[current_room_id]?.user.find(element =>element.user_id === currentRoomUserSelect.id).ban}
											{#if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === currentRoomUserSelect.id)}
												<IconButton on:buttonClick={()=>{closeUnsetAdmin = true}} icon="crown" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Unset Admin"/>
											{:else}
												<IconButton on:buttonClick={()=>{closeSetAdmin = true}} icon="crown" shadow="shadow-md shadow-gray-200/50" title="Set Admin"/>
											{/if}
												<IconButton on:buttonClick={()=>{closeKickUser = true}} icon="banUser" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Kick User"/>
												<IconButton on:buttonClick={()=>{closeBanUser = true}} icon="banUser" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Ban User"/>

												<IconButton on:buttonClick={()=>{closeMuteUser = true}} icon="mute" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Mute User"/>
											{:else}
												<IconButton on:buttonClick={()=>{closeUnBanUser = true}} icon="addUser" color="text-process-green border-process-green bg-transparent" shadow="shadow-md shadow-process-green/50" title="Unban User"/>
											{/if}
										{/if}
									</div>
								</div>
								{:else if !rooms[current_room_id]?.user}
									<p>NO USER IN ROOMS</p>
								{:else if rooms[current_room_id]?.user.length > 0}
								 <div in:fly="{{ x: -200, delay: 500, duration: 400 }}" out:fly="{{ x:-200, duration: 200 }}">
									{#each rooms[current_room_id]?.user as user}
										<ItemRoomUserElement on:clicker={async ()=>{currentRoomUserSelect = await userservice.getUser(user.user_id); gamehistory = await userservice.getHistory(currentRoomUserSelect.id);}} user={user}></ItemRoomUserElement>
									{/each}
								</div>
								{/if}
							{:else}
								<p>NO CHANNEL SELECT</p>
							{/if}
						</div>


					</div>


				</div>
				</div>
				{/if}

			</div>

			<!-- Computer Version-->
			<div class="relative hidden md:grid md:grid-cols-4 max-h-full sm:max-h-full pb-10 mobile-landscape:max-h-full mobile-landscape:pb-2 text-center align-middle m-1 overflow-hidden {$leftHanded ? 'mobile-landscape:pl-[3.75rem]' : 'mobile-landscape:pr-[3.75rem]'} overscroll-none">
				<div class="md:flex md:flex-col max-h-screen md:pb-[9rem] lg:pb-[8rem] mobile-landscape:pb-9">
				<div id="RoomList" class="grow">

						<RoomList
							dmList={false}
							fromDM={false}
							user={user}
							socket={socket}
							friends={friends}
							connectedWs={connectedWs}
							rooms={rooms}
							id_room={id_room}/>

				</div>


			</div>
				<div class="md:flex md:flex-col col-span-2 h-screen md:pb-[9rem] lg:pb-[8rem] mobile-landscape:pb-9 ">
				<div id="CurrenrRoom" class="screen border-gray-700 shadow-lg shadow-black/50 bg-black/25 grow md:flex md:flex-col my-5  md:my-0 md:mx-5 xl:mx-8 overflow-auto rounded-xl">
					<div class="screen-overlay"></div>
					<div bind:this={chatbox} class="relative overflow-x-hidden scroll-smooth mt-3 flex-grow">

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

					<div class="overflow-auto bg-color5 flex-grow h-full rounded-xl shadow-lg shadow-black mr-4">
						<div class="flex items-center justify-end m-2">
							<button on:click={()=>{closeWarningLeftChannel = true}} class="cursor-pointer flex text-sm gap-1 items-center">
								Leave Room<Icon icon="exit" width="30" height="30" css="inline stroke-none fill-white"></Icon>
							</button>
						</div>
						{#if current_room_id >= 0 }
							<div class="mt-2 self-center">
								{#if currentRoomUserSelect}
									<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x:200, duration: 200 }}" class="justify-center flex">
										<button on:click={()=>{currentRoomUserSelect = null}}  class="hover:scale-110 text-white font-bold py-2 px-4 mx-2 mobile-landscape:text-xs items-center rounded flex gap-2">
											<Icon icon="left-arrow"/> <span>RETURN</span>
										</button>
									</div>
								{:else if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === user.id)}
								<div in:fly="{{ x: -200, delay: 500, duration: 400 }}" out:fly="{{ x: -200, duration: 200 }}" class="flex-col justify-center items-center w-full space-y-2">
										<IconButton on:buttonClick={()=>{closePassworRoom = true}} icon="lock" icon_size="20" shadow="shadow-md shadow-gray-200/50" title="Password settings"/>
										<IconButton on:buttonClick={()=>{closeDeleteRoom = true}} icon="delete" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Delete room"/>
								</div>
								{/if}
							</div>
						{/if}


                    <div id="roomUsers" class="mt-5 mobile-landscape:mt-1 overflow-auto">

                        {#if current_room_id >= 0}

                            {#if currentRoomUserSelect}
							<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x:200, duration: 200 }}">
									<UserInfo user={currentRoomUserSelect}></UserInfo>

									<div>
										{#if history}
										<div in:fade="{{ delay: 200, duration: 400 }}">
											{#if gamehistory}
												<History curUser={currentRoomUserSelect} gamehistory={gamehistory} />
											{:else}
												<p>No games played</p>
											{/if}
											<div class="flex justify-center">
												<button on:click={()=> {history = false}} class="flex gap-2"><Icon icon="left-arrow"/>Return</button>
											</div>
										</div>
										{:else}
										<UserStat userstats={currentRoomUserSelect} on:showHistory={() => {history = true}}></UserStat>
										{/if}
									</div>

									<div class="flex-col mt-4 mobile-landscape:mt-1 space-y-2 overflow-visible">
										{#if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === user.id)
										&& rooms[current_room_id]?.owner_id !== currentRoomUserSelect.id  && currentRoomUserSelect.id !== user.id}
											{#if !rooms[current_room_id]?.user.find(element =>element.user_id === currentRoomUserSelect.id).ban}
											{#if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === currentRoomUserSelect.id)}
												<IconButton on:buttonClick={()=>{closeUnsetAdmin = true}} icon="crown" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Unset Admin"/>
											{:else}
												<IconButton on:buttonClick={()=>{closeSetAdmin = true}} icon="crown" shadow="shadow-md shadow-gray-200/50" title="Set Admin"/>
											{/if}
												<IconButton on:buttonClick={()=>{closeKickUser = true}} icon="banUser" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Kick User"/>
												<IconButton on:buttonClick={()=>{closeBanUser = true}} icon="banUser" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Ban User"/>

												<IconButton on:buttonClick={()=>{closeMuteUser = true}} icon="mute" color="text-core-red border-core-red bg-transparent" shadow="shadow-md shadow-core-red/50" title="Mute User"/>
											{:else}
												<IconButton on:buttonClick={()=>{closeUnBanUser = true}} icon="addUser" color="text-process-green border-process-green bg-transparent" shadow="shadow-md shadow-process-green/50" title="Unban User"/>
											{/if}
										{/if}
									</div>
								</div>
								{:else if !rooms[current_room_id]?.user}
									<p>NO USER IN ROOMS</p>
								{:else if rooms[current_room_id]?.user.length > 0}
								 <div in:fly="{{ x: -200, delay: 500, duration: 400 }}" out:fly="{{ x:-200, duration: 200 }}">
									{#each rooms[current_room_id]?.user as user}
										<ItemRoomUserElement on:clicker={async ()=>{currentRoomUserSelect = await userservice.getUser(user.user_id); gamehistory = await userservice.getHistory(currentRoomUserSelect.id);}} user={user}></ItemRoomUserElement>
									{/each}
								</div>
								{/if}
							{:else}
								<p>NO CHANNEL SELECT</p>
							{/if}
						</div>
					</div>

				</div>

			</div>

		</div>

	</div>
</div>
{/key}
