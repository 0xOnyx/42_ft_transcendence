<script lang="ts">
	export let name : string = 'Button name';
	export let url : string = '';
</script>

<a class="bg-color2 px-8 py-2 rounded-md inline-block text-black" href={url}>{name}</a>
