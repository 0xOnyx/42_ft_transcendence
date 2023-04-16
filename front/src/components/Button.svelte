<script lang="ts">
	export let name : string = 'Button name';
	export let url : string = '';
    export let color : string = 'bg-color2 border-2 border-color2';
    export let width : string = '';
</script>

<a class="{color} px-8 py-1 {width} rounded-md inline-block text-black" href={url}>{name}</a>
