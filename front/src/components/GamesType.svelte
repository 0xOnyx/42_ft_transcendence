<script lang="ts">
	import type { GameTypeSelection } from "../types/game";
	import Checkbox from "./Checkbox.svelte";
    import { createEventDispatcher, onMount } from 'svelte';
	import Icon from "./Icon.svelte";

    const dispatch = createEventDispatcher();

    export let gametype : GameTypeSelection | null = null;
    export let disable : boolean = false;
    let refresh : boolean = false;

    let games : Array<any> = [];

    onMount(async () => {
        games = [
            {
                "id": "CLASSIC",
                "name" : "Classic pong",
                "checked" : false
            },
            {
                "id": "BLACKHOLE",
                "name" : "Blackhole pong",
                "checked" : false
            }

        ];
    });

    function select(g: any)
    {
        if(!disable) {

            games.forEach(game => {
                if(g !== game)
                    game.checked = false;
            });
            g.checked = !g.checked;
            onChange(g);

        }
    }
    function keySelect(event : KeyboardEvent, g: any)
    {
        if(!disable) {
            if(event.key === " "){
                select(g);
            }
        }
    }
    function onChange(game : any)
    {
        if(game.checked)
            gametype = game;
        else
            gametype = null;

		dispatch('change', {
			"gameType": gametype
		});

        refresh = !refresh;
    }
</script>


{#each games as game}

    <div class="flex rounded-lg bg-color5 hover:-translate-y-1 shadow-md border-2 m-2 {game.id === "BLACKHOLE" ? 'border-orange-500 shadow-orange-500/50 text-orange-500' : 'shadow-white/50'} mb-4 items-center space-x-1 cursor-pointer transition-all duration-300" on:click={() => select(game)} on:keypress={(event) => keySelect(event, game)}>

		<div class="pl-3">
			{#if game.id === "CLASSIC"}
		
				<Icon icon="game" />
			{:else if game.id === "BLACKHOLE"}
				<Icon icon="blackhole" />
			{/if}
		</div>

        <div class="flex-grow py-4 text-xs text-left">
            {game.name}
        </div>

        <div class="flex items-center pr-3">
            {#key refresh} <!-- little hack to force refresh component -->
                <Checkbox disable={true} bind:checked={game.checked}></Checkbox>
            {/key}
        </div>

    </div>

{/each}


