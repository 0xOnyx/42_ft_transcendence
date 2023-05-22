<script lang="ts">

    import type {Rooms, RoomUser} from '../types/room';
    import {PUBLIC_API_URI} from "$env/static/public";
    import {createEventDispatcher, onMount} from "svelte";
    import {goto} from "$app/navigation";

	const dispatch = createEventDispatcher();

    //bg-green-600
    export let room : (Rooms & {user: RoomUser[]});
    export let current: boolean;



    async function getRoom()
    {
		if (room.password) {
			dispatch('requestPassword', {
				id: room.id
			})
		} else {
        	await goto(`/rooms/channel/${room.id}`);
		}
    }



</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={getRoom} class="border-gray-700 border-[3px] cursor-pointer rounded-xl {current ? 'bg-color2' : 'bg-gray-400 opacity-50 italic'} p-5 flex items-center self-center mt-1 transition-all duration-200">

    <!--<div class="mx-2 flex-shrink">
        <div class="w-[40px] h-[40px] bg-cover rounded-full mx-auto"
             style="background-image: url( /{'image/group.png'} )">
        </div>
    </div>-->

    <div class="mx-2 flex-grow text-center truncate ">
		{room.password ? "🔒" : ""}
		{room?.name || "loading.."}
    </div>

    {#if room.count_messages}
        <span class="sr-only">Notifications</span>
        <span class="inline-flex items-center justify-center px-2 mw-6 h-6 ml-2 text-xs font-bold text-white bg-red-500 rounded-full">
        {room.count_messages}
      </span>
    {/if}
</div>
