<script lang="ts">
	import type { User } from "../types/user";
	import Icon from "./Icon.svelte";
	

    export let user : User;
	let totalDM : number = 3;
	let totalCHAN : number = 5;
	let total : number = totalDM + totalCHAN;
</script>

<!-- Nav Bar goes here -->
<nav class="relative flex bg-gradient-to-b from-black/25 to-transparent">
	<div class="items-center py-3 grow">
		<div class="nav-bar">
<!-- Logo Transcendance-->
			<li class="relative inline-block">
				<a href="/portal">
					<h1 class=" bg-black uppercase blur-sm opacity-50 text-3xl text-transparent py-4 px-1 inset-y-1.5 inset-x-0.75 font-bold bg-clip-text absolute italic">Transcendence</h1>
					<h1 class="relative uppercase text-3xl py-4 px-1 text-center font-bold bg-gradient-to-tr from-process-green from-25% to-thread-blue to-75% bg-clip-text text-transparent italic">Transcendence</h1>
				</a>
			</li>
<!-- menu -->
			<li class="flex items-center">
				<div class="flex items-center space-x-3">
					<a class="hover:scale-110 transition-all flex items-center space-x-2" href="/portal">
						<div class="w-8 h-8 bg-cover rounded-full mx-auto"style="background-image: url( /{user?.image_url || 'image/default.png'} )"></div>
						<div class="hidden md:flex flex-grow text-left">
							{user?.name || "LOADING.."}
						</div>
					</a>
					<div class="relative group flex-col justify-center space-y-2 overflow-x-visible">
						<div class="relative flex justify-end items-end">
							<button class="relative hover:scale-125"><Icon icon="chat" css="inline " height="30" width="30" /></button>
							{#if total > 0}
								<div class="absolute inline-flex justify-center items-center -bottom-1.5 -right-1.5 min-w-60 h-5 text-2xs px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{total > 99 ? "99+" : total}</div>
							{/if}
						</div>
						<div class="absolute -translate-x-[35%] z-20 scale-0 group-hover:scale-100 flex flex-col duration-300 origin-top overflow-hidden text-xs">
							<div class="bg-black/50 rounded-lg overflow-auto">
								<a class="flex items-center justify-center w-24 hover:bg-white/25 hover:scale-110 transition-all" href="/rooms/dms/last">
									<span class="m-1.5">DM</span> 
									{#if totalDM > 0}
										<div class="inline-flex items-center justify-center min-w-60 h-5 text-2xs px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{totalDM > 99 ? "99+" : totalDM}</div>
									{/if}
								</a>
								<a class="flex items-center justify-center hover:bg-white/25 hover:scale-110 transition-all" href="/rooms/channel/last">
									<span class="m-1.5" >CHAN</span> 
									{#if totalCHAN > 0}
										<div class="inline-flex items-center justify-center min-w-60 h-5 text-2xs px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">{totalCHAN > 99 ? "99+" : totalCHAN}</div>
									{/if}
								</a>
							</div>
						</div>
					</div>
					<a class="hover:scale-125 transition-all" href="/api/auth/logout"><Icon icon="log" css="inline " height="30" width="30" /></a>
				</div>
				<!-- scrolling menu
				<div class="group flex-col items-center justify-center md:hidden transition-all duration-300 bg-black/50 rounded-full">
					<button class="p-2"><Icon icon="menu" css="inline " height="30" width="30" /></button>
					<div class="absolute p-2 space-y-2 z-20 scale-0 group-hover:scale-100 flex flex-col duration-300 origin-top bg-black/25 rounded-full">
						<a class="hover:scale-125 transition-all w-8 h-8 bg-cover rounded-full mx-auto"style="background-image: url( /{user?.image_url || 'image/default.png'} )" href="/portal" />
						<a class="hover:scale-110 transition-all" href="/rooms/dms/last"><Icon icon="chat" css="inline " height="30" width="30" /></a>
						<button class="hover:scale-125 transition-all"><Icon icon="friends" css="inline " height="30" width="30" /></button>
						<a class="hover:scale-125 transition-all" href="/api/auth/logout"><Icon icon="log" css="inline " height="30" width="30" /></a>
					</div>
				</div>
				-->
			</li>
		</div>
	</div>
</nav>