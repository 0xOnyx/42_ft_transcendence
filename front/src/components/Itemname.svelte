<script lang="ts">

    import type {User} from '../types/user';
    import {Status} from '../types/user';
    import {PUBLIC_API_URI} from "$env/static/public";
    import {goto} from "$app/navigation"
    import {Socket} from "socket.io-client";
	import { imageUrl } from '../services/Utilities';
	import { createEventDispatcher } from 'svelte';
	import Checkbox from './Checkbox.svelte';

	const dispatch = createEventDispatcher();

    //bg-green-600
    export let user : User;
    export let checkbox : boolean = false;
    export let checked : boolean = false;

	async function handleClick() {
		dispatch('userClicked', user )
	}

    function getColor(status: Status)
    {
        if (status == Status.OFFLINE)
            return "bg-zinc-600";
        else if (status == Status.HIDDEN)
            return "bg-rose-600";
        else if (status == Status.ONLINE)
            return "bg-green-600";
    }
</script>

<button on:click={handleClick} class="cursor-pointer rounded-xl bg-color5 p-5 flex items-center mt-1 w-full">

    <div class="mx-2 flex-shrink">
        <div class="w-[40px] h-[40px] bg-cover  rounded-full mx-auto"
             style="background-image: url( {imageUrl(user?.image_url)} )">
        </div>

    </div>

    <div class="mx-2 flex-grow text-left">
        {user.name}
    </div>
    {#if user?.online_status}
        <div class="mx-2">
            <div class="h-4 w-4 rounded-full {getColor(user.online_status)}"></div>
        </div>
    {/if}

    {#if checkbox}
    <Checkbox disable={true} bind:checked={checked}></Checkbox>
    {/if}

</button>
