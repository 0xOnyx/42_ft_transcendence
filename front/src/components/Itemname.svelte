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
            return "border-zinc-600";
        else if (status == Status.HIDDEN)
            return "border-rose-600";
        else if (status == Status.ONLINE)
            return "border-green-600 text-green-600";
    }
</script>

<button on:click={handleClick} class="cursor-pointer rounded-xl bg-color5 {checkbox ? 'p-3 text-sm' : 'p-5 text-md'} flex items-center mt-1 w-full">

    <div class="mx-2 flex-shrink">

        <div class="{checkbox ? 'w-[30px] h-[30px]' :'w-[40px] h-[40px]'} bg-cover rounded-full mx-auto border-4 {getColor(user.online_status)}"
             style="background-image: url( {imageUrl(user?.image_url)} )">

        </div>

    </div>

    <div class="{checkbox ? 'px-1': 'mx-2'} flex-grow text-left truncate {getColor(user.online_status)}">
        {user.name}
    </div>

    {#if checkbox}
	<div class="items-center mt-1">
		<Checkbox disable={true} bind:checked={checked}/>
	</div>
    {/if}

</button>
