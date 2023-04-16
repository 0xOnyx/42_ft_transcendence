<script lang="ts">
	export let name : string = 'Button name';
	export let url : string = '';
    export let color : string = 'bg-color2';
    export let width : string = '';
</script>

    {#if url.length > 0}
        <a class="{color} px-8 py-2 {width} rounded-md inline-block text-black" href={url} >{name}</a>
    {:else}
        <button class="{color} px-8 py-2 {width} rounded-md inline-block text-black" >{name}</button>
    {/if}
