<script lang="ts">
	import Icon from "./Icon.svelte";
	import { createEventDispatcher } from "svelte";

	export let name : string = 'Button name';
	export let url : string = '';
    export let color : string = 'bg-color2 border-2 border-color2';
    export let width : string = '';
    export let padding : string = 'px-8 py-1';
	export let rounded : string = 'rounded-md';
	export let icon : string = '';
	export let text_color : string = 'text-black';

	const dispatch = createEventDispatcher();

	function clicked() {
		dispatch("cliked");
	}
</script>

    {#if url.length > 0}
        <a class="{color} {padding} {width} {rounded} inline-block {text_color}" href={url} >{name}</a>
    {:else}
        <button on:click={clicked} class="{color} {padding} {width} {rounded} flex justify-center gap-2 items-center {text_color}" ><Icon icon={icon} />{name}</button>
    {/if}
