<script lang="ts">
	import type { User } from "../types/user";
	import Icon from "./Icon.svelte";
    import type {Rooms, RoomUser} from "../types/room";

    export let openWarning: Function;
    export let user : User;
    export let rooms: (Rooms & {user: RoomUser[]})[];

    $: total = rooms.reduce((accumulator, currentValue) => accumulator + currentValue.count_messages, 0);


</script>

<div class="flex bg-color5 rounded-xl items-center">

    <div class="relative">
		<span class="sr-only">Notifications</span>

        {#if total > 0}
            <div class="absolute inline-flex items-center justify-center min-w-60 h-6 text-xs px-1 font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -left-1 dark:border-gray-900">{total}</div>
        {/if}
        <Icon icon="bell" css="inline m-3 h-8 stroke-2 stroke-white fill-none"></Icon>

    </div>

        <div class="w-8 h-8 bg-cover  rounded-full mx-auto"
             style="background-image: url( /{user?.image_url || 'image/default.png'} )">
        </div>
    <div class="flex-grow text-left px-2">
           {user?.name || "LOADING.."}
    </div>

    {#if rooms.length > 0}
        <a on:click={openWarning} class="cursor-pointer">
            <Icon icon="exit" css="inline m-3 h-8 stroke-none fill-white"></Icon>
        </a>
    {/if}

</div>
