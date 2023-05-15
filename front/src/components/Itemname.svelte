<script lang="ts">

    import type {User} from '../types/user';
    import {Status} from '../types/user';
    import {PUBLIC_API_URI} from "$env/static/public";
    import {goto} from "$app/navigation"
    import {Socket} from "socket.io-client";
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    //bg-green-600
    export let user : User;

	async function handleClick() {
		dispatch('userClicked', {
			id: user.id
		})
	}

    function getColor(status: Status)
    {
        if (status == Status.OFFLINE)
            return "border-zinc-600";
        else if (status == Status.HIDDEN)
            return "border-rose-600";
        else if (status == Status.ONLINE)
            return "border-green-600 text-green-600";
    }
</script>

<div on:click={handleClick} class="cursor-pointer rounded-xl bg-color5 p-5 flex items-center mt-1">

    <div class="mx-2 flex-shrink">
        <div class="w-[40px] h-[40px] bg-cover rounded-full mx-auto border-4 {getColor(user.online_status)}"
             style="background-image: url( /{user?.image_url || `image/default.png`} )">
        </div>

    </div>

    <div class="mx-2 flex-grow text-left truncate {getColor(user.online_status)}">
        {user.name}
    </div>

</div>
