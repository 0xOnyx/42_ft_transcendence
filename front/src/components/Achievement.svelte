<script lang="ts">
	import type { UserStats } from "../types/user";
	import Badge from "./Badge.svelte";

    export let userstats : UserStats;
</script>


<div class="flex max-w-xl mx-auto items-center gap-2">
	<div class="flex justify-center grow">	
		<div class="achievement_badge">
			{#if userstats.win >= 100}
				<Badge badge="win" current={userstats.win} level="legend"/>
			{:else if userstats.win >= 50}
				<Badge badge="win" current={userstats.win} level="gold"/>
			{:else if userstats.win >= 20}
				<Badge badge="win" current={userstats.win} level="silver"/>
			{:else if userstats.win >= 10}
				<Badge badge="win" current={userstats.win} level="bronze"/>
			{/if}
		</div>
		<div class="achievement_badge">
			{#if userstats.played >= 100}
				<Badge badge="played" current={userstats.played} level="legend" />
			{:else if userstats.played >= 50}
				<Badge badge="played" current={userstats.played} level="gold" />
			{:else if userstats.played >= 20}
				<Badge badge="played" current={userstats.played} level="silver"/>
			{:else if userstats.played >= 10}
				<Badge badge="played" current={userstats.played} level="bronze" />
			{/if}
		</div>
	</div>
</div>


<!-- To see all 
<div class="grid grid-cols-2 items-center justify-center m-10">
	<div class="flex items-center justify-center space-x-10">
		<Badge badge="win" level="legend"/>
		<Badge badge="win" level="gold"/>
		<Badge badge="win" level="silver"/>
		<Badge badge="win" level="bronze"/>
	</div>
	<div class="flex items-center justify-center space-x-10">
		<Badge badge="played" level="legend" />
		<Badge badge="played" level="gold" />
		<Badge badge="played" level="silver"/>
		<Badge badge="played" level="bronze" />
	</div>
</div>
<!---->