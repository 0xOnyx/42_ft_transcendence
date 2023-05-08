<script lang="ts">

	import Icon from "./Icon.svelte";
	import ItemName from "./Itemname.svelte";
	import type { User } from "../types/user";

	import { createEventDispatcher } from 'svelte';
	import { fly, slide } from "svelte/transition";
	import type { Socket } from "socket.io-client";
	
	let blockedList : boolean = false;

	let search_value: string = "";

	export let user : User;
	export let search : User[] = [];
    export let friends : User[] = [];
	export let socket: Socket ;


	const dispatch = createEventDispatcher();

	function searchUser ( User : string) {
		dispatch('search', {
			text : User
		});
	}

</script>

<div class="relative flex flex-col h-2/3 sm:h-full grow sm:w-1/3 mobile-landscape:w-1/2 overflow-hidden">
	<div class="">
		<div class="flex items-center justify-between border-b-2 ">
			<button id="friend-list" on:click={ () => { blockedList = !blockedList}}>
				<h2 class="flex items-center space-x-2 sm:space-x-1 md:space-x-2 text-left whitespace-nowrap {blockedList ? "text-sm sm:text-2xs md:text-xs lg:text-sm opacity-50" : "text-lg sm:text-xs md:text-md lg:text-lg opacity-100"}">
					<Icon icon="friends" />
					<span>Friends list</span>
				</h2>
			</button>
			<button id="blocked-list" on:click={ () => { blockedList = !blockedList}}>
				<h2 class="flex items-center space-x-2 sm:space-x-1 md:space-x-2 text-right whitespace-nowrap {blockedList ? "text-lg sm:text-xs md:text-md lg:text-lg opacity-100" : "text-sm sm:text-2xs md:text-xs lg:text-sm opacity-50"}">
					
					<span>Blocked Users</span>
					<Icon icon="user-block" />
				</h2>
			</button>
		</div>
	</div>

	<div class="mt-2">
		<input class="w-full z-30 rounded-2xl py-1 px-3 bg-color5" autofocus type="text" bind:value={search_value} placeholder="Search" on:keyup={searchUser(search_value)}>
	</div>

	<div class="h-[95%] masked-overflow overscroll-contain">

		<div class="flex pt-5">
			{#if !blockedList}
			<div in:fly="{{ x: -200, delay: 500, duration: 400 }}" out:fly="{{ x: -200, duration: 400 }}" class="flex-grow max-h-full overflow-auto overscroll-contain ">
				{#if search_value.length <= 0}
					{#if friends.length <= 0}
						<p class="pt-5">NO FRIEND</p>  <!-- CREATE THIS -->
					{:else}
						<div transition:slide class="">
							{#each friends as friend}
									<ItemName requestBlock={()=>{closeWarningUnbanUser=friend.id}} io={socket} user={friend}></ItemName>
							{/each}
						</div>
					{/if}
				{:else}
					{#if  search.length <= 0}
						<p>no user found :/</p>  <!-- CREATE THIS -->
					{:else}
						<div transition:slide class="">
							{#each search as user}
								<ItemName requestBlock={()=>{closeWarningUnbanUser=user.id}} io={socket} user={user}></ItemName>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
			{:else}
			<div in:fly="{{ x: 200, delay: 500, duration: 400 }}" out:fly="{{ x: 200, duration: 400 }}" class="flex-grow max-h-full overflow-auto overscroll-contain ">
				{#if search_value.length <= 0}
					{#if friends.length <= 0}
						<p>NO BLOCKED USER</p>  <!-- CREATE THIS -->
					{:else}
						<div transition:slide class="">
							{#each friends as friend}
									<ItemName requestBlock={()=>{closeWarningUnbanUser=friend.id}} io={socket} user={friend}></ItemName>
							{/each}
						</div>
					{/if}
				{:else}
					{#if  search.length <= 0}
						<p>no user found :/</p>  <!-- CREATE THIS -->
					{:else}
						<div transition:slide class="">
							{#each search as user}
								<ItemName requestBlock={()=>{closeWarningUnbanUser=user.id}} io={socket} user={user}></ItemName>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
			{/if}
		</div>
	</div>
</div>