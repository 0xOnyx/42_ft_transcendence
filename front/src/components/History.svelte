<script lang="ts">
	import type { GameHistory, User } from "../types/user";
	import DateElement from "./DateElement.svelte";
	export let curUser : User;
	export let gamehistory : GameHistory[];
</script>
<table class="min-w-full text-center text-sm font-light sm:mt-8 md:max-2xl:mt-0">
	<thead class="border-b font-medium dark:border-neutral-500">
		<tr>
		  <th scope="col" class="px-6 py-4">Players</th>
		  <th scope="col" class="px-6 py-4">Score</th>
		  <th scope="col" class="px-6 py-4">Date</th>
		  <th scope="col" class="px-6 py-4">Result</th>
		</tr>
	  </thead>
	{#each gamehistory as g}
		<tr class="border-b dark:border-neutral-500">
			<td class=" px-6 py-2 font-medium">{g.player_one.name} vs {g.player_two.name}</td>
			<td class="whitespace-nowrap px-6 py-2 font-medium">{g.score_one} - {g.score_two}</td>
			<td class="whitespace-nowrap px-6 py-2 font-medium"><DateElement created_at={new Date(g.created_at)}></DateElement> </td>
			{#if (curUser.id == g.player_one_id && g.score_one > g.score_two) ||
				(curUser.id == g.player_two_id && g.score_one < g.score_two)}
			<td class="px-6 py-2 font-medium">Win</td>
			{:else}
			<td class="whitespace-nowrap px-6 py-2 font-medium">Lose</td>
			{/if}
		</tr>
	{/each}
</table>