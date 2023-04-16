<script lang="ts">
	export let name : string = 'Button name';
	export let url : string = '';
    export let color : string = 'bg-color2 border-2 border-color2';
    export let width : string = '';
    export let padding : string = 'px-8 py-1';
</script>

<a class="{color} {padding} {width} rounded-md inline-block text-black" href={url}>{name}</a>
