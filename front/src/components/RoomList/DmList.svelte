<script lang="ts">
	import {PUBLIC_API_URI} from "$env/static/public";
	import ItemName from "../Itemname.svelte";
	import ItemRoomDm from "../ItemRoomDm.svelte";
	import { slide } from "svelte/transition";
	import { onMount } from "svelte";

	import type { Rooms, RoomUser } from "../../types/room";
	import type { User } from "../../types/user";
	import type { Socket } from "socket.io-client";

	let rooms :(Rooms & {user: RoomUser[]})[] = [];

	export let search_value : string = '';
	export let search : User[] = [];
	export let id_room : Number;
	export let user : User;
	export let socket : Socket;
	export let DMPage : boolean;

	let loadValue = async () => {
		let res : Response;

		if (rooms.length <= 0)
		{
			res = await fetch(`${PUBLIC_API_URI}/message/getAllDm`, {
				method: 'GET',
				credentials: 'include'
			})
			rooms = await res.json();
		}
	}

	onMount(async () => {
		loadValue();


        socket.on("updateRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            let index: number;
            if ((index = rooms.findIndex(item => item.id === room.id)) == -1)
                rooms.push(room);
            else
                rooms[index] = room;
            rooms = rooms;
        })

        socket.on("leftRoom", (room: (Rooms & {user: RoomUser[]})) =>{
            rooms = rooms.filter(item=>{
                return item.id != room.id
            })
        })

	})
</script>

{#if search_value.length <= 0}
	{#if rooms.length <= 0}
		<p class="pt-5">NO FRIEND</p>  <!-- CREATE THIS -->
	{:else}
		<div transition:slide class="">
			{#each rooms as room}
				<ItemRoomDm current={room.id === id_room && DMPage} user={user} room={room}/>
			{/each}
		</div>
	{/if}
{:else}
	{#if  search.length <= 0}
		<p>no user found :/</p>  <!-- CREATE THIS -->
	{:else}
		<div transition:slide class="">
			{#each search as user}
				<ItemName on:userClicked user={user}></ItemName>
			{/each}
		</div>
	{/if}
{/if}