<script lang="ts">
	import {PUBLIC_API_URI} from "$env/static/public";
	import ItemRoomChannel from "../ItemRoomChannel.svelte";
	import ItemNameChannel from "../ItemNameChannel.svelte";
	import { slide } from "svelte/transition";
	import { onMount } from "svelte";

	import type { Rooms, RoomUser } from "../../types/room";
	import type { User } from "../../types/user";
	import type { Socket } from "socket.io-client";
	import { beforeNavigate, goto } from "$app/navigation";
	import { load } from "../../routes/games/[id]/+page";
	import { loop_guard } from "svelte/internal";

	let rooms :(Rooms & {user: RoomUser[]})[] = [];
	let current_rooms_length = 0;

	export let search_value : string = '';
	export let search : Rooms[] = [];
	export let id_room : Number;
	export let user : User;
	export let socket : Socket;
	export let connectedWs : Boolean;
	export let DMPage : Boolean;

	let loadValue = async () => {
		let res : Response;

		if (rooms.length <= current_rooms_length)
		{
			console.log("REFETCH child");
			res = await fetch(`${PUBLIC_API_URI}/message/rooms`, {
				method: 'GET',
				credentials: 'include'
			})
			rooms = await res.json();
		}
		rooms = rooms.filter((item: (Rooms & {user: RoomUser[]}))=>{return (
			!(item.user.find(element=>element.user_id == user.id).ban)
		)})
		rooms.sort((a,b) => (b.id) - (a.id));
		console.log(rooms);
		current_rooms_length = rooms.length;
	}

	beforeNavigate(loadValue);
	onMount(async () => {
		loadValue();

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
            rooms = rooms.filter(item=>{
                return item.id != room.id
            })
			goto('/rooms/channel/last');
        })

	})
</script>

<div class="flex-grow">
	{#if search_value.length <= 0}
		{#if !connectedWs}
			<p>Loading..</p>
		{:else}
			{#if rooms.length <= 0}
				<p>NO CHANNEL</p>  <!-- CREATE THIS -->
			{:else}
				{#each rooms.sort((a,b) => {    if (b.messages && b.messages.length > 0 && a.messages && a.messages.length > 0) {
					return b.messages[0].id - a.messages[0].id;
				}
				return 0;}) as room}
					<ItemRoomChannel current={room.id === id_room && !DMPage} room={room}></ItemRoomChannel>
				{/each}
			{/if}
		{/if}
	{:else}
		{#if search.length <= 0}
			<p>no channel found :/</p>  <!-- CREATE THIS -->
		{:else}
			{#each search as room}
				<ItemNameChannel all_channels={rooms} on:requestPassword io={socket} channel={room} />
			{/each}
		{/if}
	{/if}
</div>