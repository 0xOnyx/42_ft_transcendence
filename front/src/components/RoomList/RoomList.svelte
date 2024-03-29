<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";
	import Icon from "../Icon.svelte";
	import ItemName from "../Itemname.svelte";
	import type { User } from "../../types/user";
	import type { Rooms, RoomUser } from "../../types/room";
	import ItemRoomChannel from "../ItemRoomChannel.svelte";
	import ItemNameChannel from "../ItemNameChannel.svelte";
	import ItemRoomDm from "../ItemRoomDm.svelte";
	import Button from "../Button.svelte";

	import { createEventDispatcher, onMount } from 'svelte';
	import { beforeNavigate, goto } from "$app/navigation";
	import { fly, slide } from "svelte/transition";
	import type { Socket } from "socket.io-client";
	import { getRoom } from "../../services/Utilities";
	import WarningAsk from "../warningAsk.svelte";

	import DmList from "./DmList.svelte";
	import ChannelList from "./ChannelList.svelte";

	import PopUpCreateDm from "../PopUpCreateDm.svelte";
	import IconButton from "../IconButton.svelte";
	import PopUpAskPassword from "../PopUpAskPassword.svelte";
	
	export let dmList : boolean = true;
	export let fromDM : Boolean = true;

	let search_value: string = "";

	interface Search {
		rooms: Rooms[];
		users: User[];
	}
	let search : Search = { 
		rooms : [],
		users : []
	};

    async function searchRoom()
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/message/search/room?skip=0&take=8&element=name&value=${search_value}`, {
            method: 'GET',
            credentials: 'include'
        });
        search.rooms = await res.json();
    }

	async function searchUser()
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/user/search?skip=0&take=10&element=name&value=${search_value}`, {
            method: 'GET',
            credentials: 'include'
        });
        search.users = await res.json();
        search.users = search.users.filter((item: User)=>{return (item.id != user.id)})
    }

	export let user : User;
    export let friends : User[] = [];
	export let locked : User[] = [];
	export let socket: Socket ;
	export let connectedWs : Boolean;
	export let rooms : (Rooms & {user: RoomUser[]})[] = [];
	export let id_room : Number;

	let closePopupCreateRoom = false;
	let closeRequestPassword = -1;

	const dispatch = createEventDispatcher();

	function requestUnblock( e : CustomEvent ) {
		dispatch('unblock', {
			id: e.detail.id
		});
	}

	function handleCreateRoom() {
		closePopupCreateRoom = true;
	}

	let closeWarningUnblockUser = -1;


	async function acceptUnblockUser()
    {
		const id : number = closeWarningUnblockUser;
		// console.log(id);
        await socket.emit("unblockUser", {
            user_id: closeWarningUnblockUser
        });
        closeWarningUnblockUser = -1;
		getRoom(id, socket);
	}

	async function itemClicked( e : CustomEvent) {
		const id : number = e.detail.id;
		// console.log("itemClicked:", id);
		const unblockedUser = await getRoom(id, socket);
		if (!unblockedUser) {
			closeWarningUnblockUser = id;
		}
	}

	async function createRoom(room_name: string, password: string)
    {
        let data: {name: string, password?: string} = {name: room_name};
        if (password.length > 0)
            data.password = password;
        await socket.emit("createRoomPublic", data, (data)=>{
			// console.log("Emit data: ", data);
            goto(`/rooms/channel/${data}`);
        })
        closePopupCreateRoom = false;
    }

	function unblockUser(e : CustomEvent) {
		closeWarningUnblockUser = e.detail.user_id;
	}


	async function joinChannel(password : string)
    {
		// console.log("emit id: ", closeRequestPassword);
        socket.emit("joinRoomPublic", {room_id: closeRequestPassword, password: password}, async (room)=>{
            // console.log("Room: ", room);
			if (room)
            {
                closeRequestPassword = -1;
                search_value = "";
				// console.log("ROOM ID ", room.id);
                await goto(`/rooms/channel/${room.id}`)
            }
        })
    }

	function passwordNeeded(e : CustomEvent) {
		// console.log("PASSWORD for ", e.detail.id);
		closeRequestPassword = e.detail.id;
	}

</script>

{#if closeWarningUnblockUser > 0}
    <WarningAsk title="Unblock user" 
				message="Do you want to unblock this user ?."
                buttonAccecpt={acceptUnblockUser} 
				buttonDecline={()=>{closeWarningUnblockUser = -1}}
				on:unblockUser={unblockUser}></WarningAsk>
{/if}

{#if closePopupCreateRoom}
    <PopUpCreateDm createRoom={createRoom} close={()=>{closePopupCreateRoom = false}}/>
{/if}
{#if closeRequestPassword > 0}
    <PopUpAskPassword joinChannel={joinChannel} close={()=>{closeRequestPassword = -1}}></PopUpAskPassword>
{/if}

<div class="relative flex flex-col h-screen pb-[15rem] md:pb-[9rem] lg:pb-[8rem] mobile-landscape:pb-9 grow overflow-hidden">
	<div class="">
		<div class="flex items-center justify-between border-b-2 ">
			<button id="dm-list" on:click={ () => { dmList = true}}>
				<h2 class="flex items-center space-x-2 sm:space-x-1 md:space-x-2 text-left whitespace-nowrap {dmList ? "text-lg sm:text-xs md:text-md lg:text-lg opacity-100" : "text-sm sm:text-2xs md:text-xs lg:text-sm opacity-50"}">
					<Icon icon="chat" />
					<span>DMs</span>
				</h2>
			</button>
			<button id="blocked-list" on:click={ () => { dmList = false}}>
				<h2 class="flex items-center space-x-2 sm:space-x-1 md:space-x-2 text-right whitespace-nowrap {dmList ? "text-sm sm:text-2xs md:text-xs lg:text-sm opacity-50" : "text-lg sm:text-xs md:text-md lg:text-lg opacity-100"}">
					<span>Rooms</span>
					<Icon icon="chatrooms" />
				</h2>
			</button>
		</div>
	</div>

	<div class="mt-2">
		<input class="w-[95%] z-30 rounded-2xl py-1 px-3 bg-color5 focus:outline-none focus:shadow-lg focus:border-[1px] focus-border-white focus:shadow-thread-blue" type="text" bind:value={search_value} placeholder={dmList ? "Search user" : "Search room"} on:keyup={dmList ? searchUser() : searchRoom()}>
	</div>

	<div class="h-full overflow-auto overscroll-contain masked-overflow">

		<div class="flex pt-5 overflow-auto pb-6">
			{#if dmList}
			<div in:fly="{{ x: -200, delay: 500, duration: 400 }}" out:fly="{{ x: -200, duration: 400 }}" class="flex-grow max-h-full overflow-auto pl-4 overscroll-contain">
				{#if user && socket}
				<DmList bind:search_value={search_value}
						search={search.users}
						id_room={id_room}
						user={user}
						socket={socket}
						DMPage={fromDM}
						on:userClicked={itemClicked}/>
				{:else}
					<p>CONNECTING..</p>	
				{/if}	
			</div>
			{:else}
			<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x: 200, duration: 400 }}" class="flex-grow max-h-full overflow-auto pl-4 overscroll-contain">
				{#if user && socket}
				<ChannelList bind:search_value={search_value}
					search={search.rooms}
					id_room={id_room}
					user={user}
					socket={socket}
					connectedWs={connectedWs}
					DMPage={fromDM}
					on:requestPassword={passwordNeeded}/>
				{/if}
			</div>
			{/if}
		</div>
	</div>
	{#if !dmList}
	<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x: 200, duration: 400 }}" class="px-4" on:click={handleCreateRoom} >
		<IconButton color="bg-thread-blue/75 border-gray-700 text-gray-700 shadow-md shadow-black/50 mb-2" icon="new-chat" icon_size="20" title="New Channel"/>
	</div>
	{/if}
</div>