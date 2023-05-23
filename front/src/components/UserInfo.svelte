

<script lang="ts">
	import { imageUrl } from "../services/Utilities";
	import type { User } from "../types/user";
	import Icon from "./Icon.svelte";

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let user : User | null;
	export let portal : boolean = false;

    // console.log(user);
	function handleClick( trigger : string ) {
		dispatch('updateUserInfo', {
			text: trigger
		});
	}

</script>
{#if portal}
<div>
	<div class="relative border:rad">
		<div class="relative w-[75px] h-[75px] mobile-landscape:w-[75px] mobile-landscape:h-[75px] sm:w-[150px] sm:h-[150px] bg-cover rounded-full mx-auto"
			 style="background-image: url( {imageUrl(user?.image_url)} )">
			<div class="hidden mobile-landscape:hidden absolute inset-0 sm:flex justify-center items-center">
				<button on:click={() => { handleClick("file") }} class="group bg-gray-300/0 hover:bg-gray-300/50 border-0 hover:border-4 w-[150px] h-[150px] rounded-full flex items-center justify-center transition-all">
					<Icon icon="modify" width="64" height="64" css="scale-0 group-hover:scale-100 transition-all" />
				</button>
			</div>
			<div class="absolute -bottom-1 -right-1 sm:hidden mobile-landscape:flex">
				<button on:click={() => { handleClick("file") }} class="flex items-center justify-center border-gray-600 bg-white/75 h-6 w-6 border rounded-full hover:scale-125 transition-all">
					<Icon icon="modify" width="12" height="12" color="rgb(75, 85, 99)"/>
				</button>
			</div>
		</div>
	</div>

    <div class="relative mt-2">
		<h1 class="flex justify-center items-center text-sm mobile-landscape:text-sm sm:text-lg">{user?.name || "loading.."}
			<button on:click={() => { handleClick("update") }} class="flex items-center justify-center h-6 w-6 rounded-full hover:scale-125 transition-all">
				<Icon icon="settings" width="18" height="18" />
			</button>
		</h1>
        <small class="flex items-center justify-center text-2xs mobile-landscape:text-2xs sm:text-sm">#{user?.oauth_42_login || "loading.."}</small>
    </div>
</div>
{:else}
<div>
	<div class="relative border:rad">
		<div class="relative w-[100px] h-[100px] mobile-landscape:w-[50px] mobile-landscape:h-[50px] sm:w-[75px] sm:h-[75px] lg:w-[150px] lg:h-[150px] bg-cover rounded-full mx-auto"
			 style="background-image: url( {imageUrl(user?.image_url)} )">
		</div>
	</div>

    <div class="relative mt-2">
		<h1 class="flex justify-center items-center text-md md:text-sm mobile-landscape:text-sm lg:text-lg">{user?.name || "loading.."}
		</h1>
        <small class="flex items-center justify-center text-xs md:text-2xs mobile-landscape:text-2xs lg:text-sm">#{user?.oauth_42_login || "loading.."}</small>
    </div>
</div>
{/if}
