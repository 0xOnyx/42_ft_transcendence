<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Icon from "./Icon.svelte";

	const dispatch = createEventDispatcher();

	export let color : string = 'bg-gray-700 border-gray-200 text-gray-200';
	export let icon : string = '';
	export let icon_size : string = '24';
	export let title : string = '';
	export let shadow : string = '';

	function buttonClick() {
		dispatch('buttonClick');
	}
</script>

<div class="flex justify-center">
	<button	on:click={buttonClick}
			class="flex justify-center w-1/2 md:w-full sm:mx-2 {color} {shadow} py-2 px-3 rounded-xl border-2 group hover:-translate-y-1 transition-all duration-200"> 
			<div class="flex gap-2 md:gap-1 lg:gap-2 items-center group-hover:scale-110 transition-all duration-200 {title.length > 11 ? "text-sm md:text-2xs lg:text-xs" : "text-sm"}">
				<Icon icon={icon} width={icon_size} height={icon_size}/>
				<span class="text-ellipsis">{title}</span>
			</div>
	</button>
</div>