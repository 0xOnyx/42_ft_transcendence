<script lang="ts">
	import Checkbox from "./Checkbox.svelte";
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    export let gametype : string = "classic";
    export let disable : boolean = false;
    let refresh : boolean = false;

    let games : Array<any> = [];

    onMount(async () => {
        games = [
            {
                "id": "classic",
                "name" : "Classic pong",
                "checked" : false
            },
            {
                "id": "classic",
                "name" : "robot pong",
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
            gametype = game.id;
        else
            gametype = "";
		dispatch('change', {
			"gametype": game.id
		});
        console.log(games);
        refresh = !refresh;
    }
</script>


{#each games as game}

    <div class="flex rounded-lg bg-color5 mb-4" on:click={() => select(game)} on:keypress={(event) => keySelect(event, game)}>

        <div class="flex items-center mx-3">
            <div class="bg-white w-8 h-8">

            </div>
        </div>

        <div class="flex-grow p-4 text-left">
            {game.name}
        </div>

        <div class="flex items-center mx-3">
            {#key refresh} <!-- little hack to force refresh component -->
                <Checkbox disable={true} bind:checked={game.checked}></Checkbox>
            {/key}
        </div>

    </div>

{/each}


