<script lang="ts">
	import type { GameHistory, User } from "../types/user";
	import DateElement from "./DateElement.svelte";
	export let curUser : User;
	export let gamehistory : GameHistory[];
	export let portal : boolean = false;
	console.log(gamehistory);
</script>

{#if portal}
<div class="max-h-[15rem] masked-overflow overscroll-contain rounded-t-lg">
	<table class="min-w-full min-h-[30px] text-center text-sm font-light md:max-2xl:mt-0 mb-6">
		<thead class="border-b sticky top-0  font-medium border-neutral-500 rounded-lg bg-color5">
			<tr>
			<th scope="col" class="px-6 py-4">Players</th>
			<th scope="col" class="px-6 py-4">Score</th>
			<th scope="col" class="hidden sm:table-cell mobile-landscape:hidden px-6 py-4">Date</th>
			<th scope="col" class="hidden sm:table-cell mobile-landscape:hidden px-6 py-4">Result</th>
			</tr>
		</thead>
		{#each gamehistory as g, id}
			<tr class="border-b border-neutral-500			
				{(curUser.id == g.player_one_id && g.score_one > g.score_two) ||
				(curUser.id == g.player_two_id && g.score_one < g.score_two) ? 'text-process-green' : 'text-core-red'} {id % 2 ? 'bg-gray-700/75' : 'bg-color5/75'}">
				<td class=" px-6 py-2 font-medium">{g.player_one.name} vs {g.player_two.name}</td>
				<td class="whitespace-nowrap px-6 py-2 font-medium">{g.score_one} - {g.score_two}</td>
				<td class="whitespace-nowrap hidden sm:table-cell mobile-landscape:hidden px-6 py-2 font-medium"><DateElement created_at={new Date(g.created_at)}></DateElement> </td>
				{#if (curUser.id == g.player_one_id && g.score_one > g.score_two) ||
					(curUser.id == g.player_two_id && g.score_one < g.score_two)}
				<td class="hidden sm:table-cell mobile-landscape:hidden px-6 py-2 font-medium">Win</td>
				{:else}
				<td class="hidden sm:table-cell mobile-landscape:hidden whitespace-nowrap px-6 py-2 font-medium">Lose</td>
				{/if}
			</tr>
		{/each}
	</table>
</div>
{:else}
<div class="max-h-[15rem] masked-overflow overscroll-contain">
<table class="max-w-1/4 max-h-[30px] text-center text-xs font-light md:max-2xl:mt-0 mb-5">
	<thead class="font-medium sticky border-b-4 border-neutral-500 top-0 bg-color5 ">
		<tr>
		  <th scope="col" class="lg:px-6 py-4">Players</th>
		  <th scope="col" class="lg:px-6 py-4">Score</th>
		</tr>
	  </thead>
	  <tbody>
		{#each gamehistory as g}
			<tr class="border-b border-neutral-500 
				{(curUser.id == g.player_one_id && g.score_one > g.score_two) ||
				(curUser.id == g.player_two_id && g.score_one < g.score_two) ? 'text-process-green' : 'text-core-red'}">
				<td class=" lg:px-6 py-2 font-medium">{g.player_one.name} vs {g.player_two.name}</td>
				<td class="whitespace-nowrap lg:px-6 py-2 font-medium">{g.score_one} - {g.score_two}</td>
			</tr>
		{/each}
	</tbody>
</table>
</div>
{/if}