<script lang="ts">
	import type { GameHistory, User } from "../types/user";
	import DateElement from "./DateElement.svelte";
	export let curUser : User;
	export let gamehistory : GameHistory[];
</script>
<table class="w-full">
	{#each gamehistory as g}
		<tr>
			<td>{g.player_one.name} vs {g.player_two.name}</td>
			<td>{g.score_one} - {g.score_two}</td>
			<td><DateElement created_at={new Date(g.created_at)}></DateElement> </td>
			{#if (curUser.id == g.player_one_id && g.score_one > g.score_two) ||
				(curUser.id == g.player_two_id && g.score_one < g.score_two)}
			<td>Win</td>
			{:else}
			<td>Lose</td>
			{/if}
		</tr>
	{/each}
</table>