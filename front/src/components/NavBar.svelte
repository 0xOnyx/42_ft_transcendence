<script lang="ts">
	import type { User } from "../types/user";
	import Switch from './Switch.svelte';
	import Icon from "./Icon.svelte";
	import { imageUrl } from "../services/Utilities";
	import { leftHanded } from "../services/Stores";

    export let user : User;
	let totalDM : number = 3;
	let totalCHAN : number = 5;

	let scale : boolean = false;

	function handleClick() {
		scale = !scale;
	}



</script>

<!-- Mobile Navigation bar-->
<div class="absolute h-full w-full flex items-end mobile-landscape:items-center {$leftHanded ? 'justify-start' : 'justify-end'} sm:hidden mobile-landscape:flex">
	<div class="bg-gradient-to-t from-black/25 to-transparent grid grid-cols-3 w-full h-20 mobile-landscape:grid-cols-1 mobile-landscape:grid-rows-6 mobile-landscape:w-20 mobile-landscape:h-full mobile-landscape:bg-gradient-to-l {$leftHanded ? 'mobile-landscape:from-transparent mobile-landscape:to-black/25' : ''}">
		<a class="hidden mobile-landscape:flex items-center" href="/portal">
			<div class="w-8 h-8 bg-cover rounded-full mx-auto"style="background-image: url( {imageUrl(user?.image_url)} )"></div>
		</a>
		<a class=" hover:scale-110 transition-all flex flex-col justify-center items-center" href="/games">
			<Icon icon="game" height="40" width="40" />
			<span class="text-2xs">Game</span>
		</a>
		<a class=" relative hover:scale-125 flex flex-col items-center justify-center" href="/rooms/dms/last">
			<div class="relative">
				<Icon icon="chat" css="inline relative" height="30" width="30" />
				{#if totalDM > 0}
					<div class="absolute inline-flex items-center justify-center min-w-60 h-5 text-2xs -top-2 -right-2.5 px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{totalDM > 99 ? "99+" : totalCHAN}</div>
				{/if}
			</div>
			<span class="text-2xs">Direct</span>
			<span class="text-2xs">Messages</span>
		</a>
		<a class=" relative hover:scale-125 flex flex-col items-center justify-center" href="/rooms/channel/last">
			<div class="relative">
				<Icon icon="chatrooms" css="inline relative" height="30" width="30" />
				{#if totalCHAN > 0}
					<div class="absolute inline-flex items-center justify-center min-w-60 h-5 text-2xs -top-2 -right-2.5 px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{totalCHAN > 99 ? "99+" : totalCHAN}</div>
				{/if}
			</div>
			<span class="text-2xs">Chatrooms</span>

		</a>
		<a class="hidden mobile-landscape:flex mobile-landscape:row-start-6 items-center justify-center"  href="/api/auth/logout"><Icon icon="log" height="30" width="30" css="inline " /></a>
	</div>
</div>

<!-- Top navigation bar-->
<nav class="relative flex bg-gradient-to-b from-black/25 to-transparent mobile-landscape:hidden">
	<div class="items-center py-3 grow">
		<div class="nav-bar">
<!-- Logo Transcendance-->
			<li class="relative flex space-x-5">
				<a href="/portal">
					<h1 class=" bg-black uppercase blur-sm opacity-50 text-xl sm:text-3xl text-transparent py-4 px-1 inset-y-1.5 inset-x-0.75 font-bold bg-clip-text absolute italic">Transcendence</h1>
					<h1 class="relative uppercase text-xl sm:text-3xl py-4 px-1 text-center font-bold bg-gradient-to-tr from-process-green from-25% to-thread-blue to-75% bg-clip-text text-transparent italic">Transcendence</h1>
				</a>

			<!-- Primary Menu-->
				<div class="hidden sm:flex items-center">
					<div class="flex items-end lg:items-center space-x-8 lg:space-x-10 grow">
						<!-- New Game-->
						<a class="hover:scale-110 grow transition-all flex flex-col justify-center items-center" href="/portal">
							<span class="lg:hidden">
								<Icon icon="game" height="40" width="40" />
							</span>
							<span class="text-2xs lg:text-lg">Game</span>
						</a>

						<a class="relative flex flex-col lg:flex-row items-center justify-center hover:scale-110 transition-all space-x-1" href="/rooms/dms/last">
								<span class="relative lg:hidden">
									<Icon icon="chat" css="inline relative" height="30" width="30" />
									{#if totalDM > 0}
										<div class="absolute inline-flex items-center justify-center min-w-60 h-5 text-2xs -top-2 -right-2.5 px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{totalDM > 99 ? "99+" : totalDM}</div>
									{/if}
								</span>
								<span class="text-2xs lg:text-lg">Direct Message</span> 
								{#if totalDM > 0}
									<div class="hidden lg:inline-flex items-center justify-center min-w-60 h-5 text-2xs -top-0.5 px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{totalDM > 99 ? "99+" : totalDM}</div>
								{/if}

						</a>
						<a class="relative flex flex-col lg:flex-row items-center justify-center hover:scale-110 transition-all space-x-1" href="/rooms/channel/last">
							<span class="relative lg:hidden">
								<Icon icon="chatrooms" css="inline relative" height="30" width="30" />
								{#if totalCHAN > 0}
									<div class="absolute inline-flex items-center justify-center min-w-60 h-5 text-2xs -top-2 -right-2.5 px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{totalCHAN > 99 ? "99+" : totalCHAN}</div>
								{/if}
							</span>
							<span class="text-2xs lg:text-lg">Chatrooms</span> 
							{#if totalCHAN > 0}
								<div class="hidden lg:inline-flex items-center justify-center min-w-60 h-5 text-2xs -top-0.5 px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{totalCHAN > 99 ? "99+" : totalCHAN}</div>
							{/if}
						</a>
					</div>
				</div>

			</li>

<!-- User settings -->
			<li class="relative flex items-center justify-center mobile-landscape:hidden">
				<div class="flex flex-col items-center group">
					<button class="flex relative items-center justify-center" on:click={handleClick}>
						<div class="w-8 h-8 bg-cover rounded-full mx-auto"style="background-image: url( {imageUrl(user?.image_url)} )"></div>
						<div class="hidden pl-1 md:flex flex-grow text-left">
							{user?.name || "LOADING.."}
						</div>
					</button>
					<div class="absolute flex flex-col justify-center translate-y-9 group-hover:scale-100 {scale ? 'scale-100' : 'scale-0'} transition-all origin-top space-y-2">
						<a class="flex items-center space-x-1"  href="/portal">
							<Icon icon="settings" height="20" width="20" />
							<span class="hidden md:flex text-left text-sm">Profile</span>
						</a>
						<a class="flex items-center space-x-1"  href="/api/auth/logout">
							<Icon icon="log" height="20" width="20" />
							<span class="hidden md:flex text-left text-sm">Log out</span>
						</a>
					</div>
				</div>
			</li>

		</div>
	</div>
</nav>
