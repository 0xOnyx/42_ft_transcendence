<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
	import IconVh from "../components/IconVH.svelte";


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

			<div class="relative inline-block">
				<h1 class=" bg-black uppercase blur-sm opacity-50 text-7xl text-transparent p-4 inset-y-1.5 inset-x-0.75 font-bold bg-clip-text absolute italic">Transcendence</h1>
				<h1 class="uppercase main-title relative italic">Transcendence</h1>
			</div>

            {#if load}
              <div class="mt-20">
                    <div class="relative inline-block group">
						<div class="absolute inset-0 h-22 w-22 blur-lg bg-gradient-to-r from-white from-90% to-black  animate-pulse-slow animate-spin-slow inline-block rounded-full animate-halo-idle group-hover:scale-110 transition-all duration-300">
						</div>
						<a class="flex items-center justify-center login-button rounded-full content-center group-hover:login-hover transition-all duration-300" href={`${PUBLIC_API_URI}/auth`}>
							<IconVh icon="log" width="64" height="64" />
						</a>
                	</div>
				</div>
            {:else}
                <p>loading...</p>
            {/if}

        </div>

    </div>


