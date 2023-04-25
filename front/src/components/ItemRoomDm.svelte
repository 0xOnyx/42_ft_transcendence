<script lang="ts">

    import type {Rooms, RoomUser} from '../types/room';
	import type { User } from '../types/user';
    import {PUBLIC_API_URI} from "$env/static/public";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    //bg-green-600
    export let room : (Rooms & {user: RoomUser[]});
    export let user : User;
    export let current: boolean;

    let roomUserDm: RoomUser = room?.user.find((element: RoomUser) => element.user_id != Number(user.id));
    let userDm: User;

    onMount(async ()=>{
        let res: Response = await fetch(`${PUBLIC_API_URI}/user/id/${roomUserDm.user_id}`, {
            method: 'GET',
            credentials: 'include'
        });
        userDm = await res.json();
    })

    async function getRoom()
    {
        await goto(`/rooms/dms/${room.id}`);
    }



</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={getRoom} class="border-color2  border-2 cursor-pointer rounded-xl {current ? 'bg-color2' : 'bg-color5'} p-5 flex items-center mt-1">

    <div class="mx-2 flex-shrink">
        <div class="w-[40px] h-[40px] bg-cover  rounded-full mx-auto"
             style="background-image: url( /{userDm?.image_url || 'image/default.png'} )">
        </div>
    </div>

    <div class="mx-2 flex-grow text-left">
        {userDm?.name || "loading.."}
    </div>
	{#if room.count_messages}
  <span class="sr-only">Notifications</span>
  <span class="inline-flex items-center justify-center px-2 mw-6 h-6 ml-2 text-xs font-bold text-white bg-red-500 rounded-full">
    {room.count_messages}0
  </span>
  {/if}
</div>
