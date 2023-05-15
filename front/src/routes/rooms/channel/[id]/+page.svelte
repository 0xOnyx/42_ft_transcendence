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
    import { goto, beforeNavigate } from "$app/navigation";
    import { io, Socket } from "socket.io-client";
    import NavBar from '../../../../components/NavBar.svelte';
    import ItemRoomUserElement from '../../../../components/ItemRoomUserElement.svelte'

    import userservice from '../../../../services/UserService';
    import PopUpCreateDm from "../../../../components/PopUpCreateDm.svelte";
    import PopUpAskPassword from "../../../../components/PopUpAskPassword.svelte";
    import PopUpAskTime from "../../../../components/PopUpAskTime.svelte";

	import RoomList from '../../../../components/RoomList/RoomList.svelte';

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
    let chatbox : HTMLDivElement;
    let unread_message: Number = 0;
    let error : string = ""

    let id_room: number;

    let loadValue = async ()=>{

        let res: Response;

        if (!await userservice.isLogged()) {
            await goto("/");}

		const urlSegments = $page.url.toString().split('/');
		console.log(urlSegments);

		if (urlSegments.length < 5 || !(urlSegments[3] === 'rooms' && urlSegments[4] === 'channel')) {
			console.log($page.url.toString());
			return;
		}
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

        console.log("CURRENT VALUE")

        if (rooms.length <= 0)
        {
            console.log("REFETCH");
            res = await fetch(`${PUBLIC_API_URI}/message/rooms`, {
                method: 'GET',
                credentials: 'include'
            })
            rooms = await res.json();
        }
        console.log(rooms);
        console.log(current_room_id);
        if ($page.params.id == "last")
        {
            if (!rooms || rooms.length <= 0) {
                current_room_id = -1;
                console.log("RETURN")
                console.log(current_room_id)
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
            // roomUserDm = current_room?.user.find((element: RoomUser) => element.user_id != Number(user.id));
            // res = await fetch(`${PUBLIC_API_URI}/user/id/${roomUserDm.user_id}`, {
            //     method: 'GET',
            //     credentials: 'include'
            // });
            //
            // current_room_user = await res.json();

            const index = rooms.findIndex((item: (Rooms & { user: RoomUser[] })) => {
                return (item.id === id_room)
            })
            rooms[index].count_messages = 0;
        }
        else
            room_message = [];
        if (chatbox)
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
                if (index >= 0)
                    rooms[index].count_messages += 1;
            }
            if (room_message.length > MAX_MESSAGE)
                room_message.shift();
            room_message = room_message;
        })


        socket.on("updateRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            let index: number;
            console.log("NEW UPDATE ROOM")
            console.log(room);
            if ((index = rooms.findIndex(item => item.id === room.id)) == -1)
                rooms.push(room);
            else
                rooms[index] = room;
            rooms = rooms;
            console.log(rooms);
        })

        socket.on("leftRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            console.log("left room");
            const room_id_current = rooms[current_room_id].id;
            rooms = rooms.filter(item=>{
                return item.id != room.id
            })
            if (room.id === room_id_current)
                room_message = [];
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
    let closeRequestPassword = -1;

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

    async function joinChannel(password)
    {
        socket.emit("joinRoomPublic", {room_id: closeRequestPassword, password: password}, async (room)=>{
            if (room)
            {
                closeRequestPassword = -1;
                search_value = "";
                await goto(`/rooms/channel/${room.id}`)
            }
        })
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
		console.log("event received");
		closePopupCreateRoom = true;
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

{#if closeRequestPassword > 0}
    <PopUpAskPassword joinChannel={joinChannel} close={()=>{closeRequestPassword = -1}}></PopUpAskPassword>
{/if}



<div class="flex-col">
	<NavBar user={user} />

	<div class="flex py-2 landscape:py-0 md:py-10 xl:py-10">

		<div class="h-[80vh] grow sm:h-screen mobile-landscape:h-screen w-full px-[5%] self-center py-1 grid overflow-hidden">

			<div class="flex h-full sm:max-h-[85%] text-center align-middle m-1">
				<div id="RoomList" class="grow w-1/4">
				<RoomList 
					dmList={false}
					user={user}
					socket={socket}
					friends={friends}
					connectedWs={connectedWs}
					rooms={rooms}
					id_room={id_room}/>
				</div>
				<div class="screen border-gray-700 shadow-lg shadow-black/50 bg-black/25 grow md:flex md:flex-col my-5 md:my-0 md:mx-5 xl:mx-8 overflow-auto rounded-xl w-1/2">
					<div class="screen-overlay"></div>
					<div bind:this={chatbox} class="relative overflow-x-hidden overflow-y-scroll scroll-smooth mt-3 flex-grow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

						{#if connectedWs}
							<MessageItem socket={socket} user={user} message={room_message}></MessageItem>
						{:else}
							<p>CONNECTING WS..</p>
						{/if}

					</div>

					<div class="relative flex items-center border-1 p-8">

						<input disabled={rooms.length <= 0} autofocus on:keydown={(e)=>{e.key === "Enter" && sendMessage()}} bind:value={message_value} type="text" class="disabled:border-zinc-500  border-2 border-gray-700 bg-gray-500/75 rounded-md w-full p-2 pr-12 focus:outline-none" />
						<div class="relative">
							<button disabled={rooms.length <= 0} on:click={sendMessage} class="-top-4 -left-10 absolute disabled:bg-zinc-500 p-0 m-0 rounded-full"><Icon icon="send" css="inlinep-0 h-8 {rooms.length <= 0 ? 'stroke-zinc-500' : 'stroke-white' }  fill-gray-700"></Icon></button>
						</div>

					</div>

				</div>

				<div class="w-1/4 md:flex md:flex-col">

					{#if user}
						<UserNotification openWarning={()=>{closeWarningLeftChannel = true}} rooms={rooms} user={user}></UserNotification>
					{:else}
						<p>LOADING..</p>
					{/if}



					<div class="overflow-auto mt-3 bg-color5 flex-grow  rounded-xl">
						{#if current_room_id >= 0 }
							<div class="mt-10">
								{#if currentRoomUserSelect}
									<button on:click={()=>{currentRoomUserSelect = null}}  class="bg-color2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
										↩️ RETURN
									</button>
								{:else if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === user.id)}
									<ButtonElement title="Password room" on:clicker={()=>{closePassworRoom = true}}></ButtonElement>
									<ButtonElementWarning title="Delete room" on:clicker={()=>{closeDeleteRoom = true}}></ButtonElementWarning>
								{/if}
							</div>
						{/if}

						<div class="mt-20">

							{#if current_room_id >= 0}

								{#if currentRoomUserSelect}

									<UserInfo user={currentRoomUserSelect}></UserInfo>

									<div>
										<UserStat userstats={currentRoomUserSelect}></UserStat>
									</div>

									<div>
										{#if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === user.id)
										&& rooms[current_room_id]?.owner_id !== currentRoomUserSelect.id  && currentRoomUserSelect.id !== user.id}
											{#if !rooms[current_room_id]?.user.find(element =>element.user_id === currentRoomUserSelect.id).ban}
												<ButtonElement title="Kick" on:clicker={()=>{closeKickUser = true}}></ButtonElement>
												<ButtonElement title="BanUser" on:clicker={()=>{closeBanUser = true}}></ButtonElement>
												{#if rooms[current_room_id]?.user.find(element => element.role === RoleUser.ADMIN && element.user_id === currentRoomUserSelect.id)}
													<ButtonElement title="UnsetAdmin" on:clicker={()=>{closeUnsetAdmin = true}}></ButtonElement>
												{:else}
													<ButtonElement title="SetAdmin" on:clicker={()=>{closeSetAdmin = true}}></ButtonElement>
												{/if}
												<ButtonElement title="MuteUser" on:clicker={()=>{closeMuteUser = true}}></ButtonElement>
											{:else}
												<ButtonElement title="Unban" on:clicker={()=>{closeUnBanUser = true}}></ButtonElement>
											{/if}
										{/if}
									</div>
								{:else if !rooms[current_room_id]?.user}
									<p>NO USER IN ROOMS</p>
								{:else if rooms[current_room_id]?.user.length > 0}
									{#each rooms[current_room_id]?.user as user}
										<ItemRoomUserElement on:clicker={async ()=>{currentRoomUserSelect = await userservice.getUser(user.user_id)}} user={user}></ItemRoomUserElement>
									{/each}
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
