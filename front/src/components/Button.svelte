<script lang="ts">
	export let name : string = 'Button name';
	export let url : string = '';
    export let color : string = 'bg-color2 border-2 border-color2';
    export let width : string = '';
    export let padding : string = 'px-8 py-1';
	export let rounded : string = 'rounded-md';
</script>

    {#if url.length > 0}
        <a class="{color} {padding} {width} {rounded} inline-block text-black" href={url} >{name}</a>
    {:else}
        <button class="{color} {padding} {width} {rounded} inline-block text-black" >{name}</button>
    {/if}
