<script lang="ts">
	import Icon from "./Icon.svelte";

	export let league : string = "copper";
</script>

{#if league === "copper"} 
	<div class="flex items-center gap-1.5">
		<Icon icon="cup" color="#b87333" height="20" width="20" />
		<div class="text-md copper-league bg-clip-text text-transparent">Copper League</div>
	</div>
{:else if league === "silver"}
	<div class="flex items-center gap-1.5">
		<Icon icon="cup" color="#aaa9ad" height="20" width="20" />
		<div class="text-md silver-league bg-clip-text text-transparent">Silver League</div>
	</div>
{:else if league === "gold"}
	<div class="flex items-center gap-1.5">
		<Icon icon="cup" color="#d4af37" height="20" width="20" />
		<div class="text-md gold-league bg-clip-text text-transparent">Gold League</div>
	</div>
{/if}