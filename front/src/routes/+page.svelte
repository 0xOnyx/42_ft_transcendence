<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";


    onMount(async () => {
        const res: Response = await fetch(`${PUBLIC_API_URI}/auth/islogged`, {
            method: 'GET',
            credentials: 'include'
        });
        load = await res.json();
        if (load)
            await goto("/portal")
        else
            load = true
    });

    let load = false

</script>

    <div class="h-full flex-grow flex flex-col justify-center">
        <div class="text-center mb-5">

            <h1 class="uppercase text-4xl">Transcendence <br> <small class="italic">Pong</small></h1>

            {#if load}
                <div class="mt-20">
                    <a class="bg-color2 px-8 md:px-40 py-2 rounded rounded-2xl inline-block text-2xl" href={`${PUBLIC_API_URI}/auth`}>Log In</a>
                </div>
            {:else}
                <p>loading...</p>
            {/if}

        </div>

    </div>


