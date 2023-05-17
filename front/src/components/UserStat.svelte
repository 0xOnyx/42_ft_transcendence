
<script lang="ts">
	import type { UserStats } from "../types/user";
	import Icon from "./Icon.svelte";
	import LeagueBadge from "./LeagueBadge.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
    export let userstats : UserStats;

	function showHistory() {
		dispatch("showHistory");
	}
</script>


<div class="flex flex-col gap-2 text-sm mobile-landscape:text-sm sm:text-base">

	<p class="">Game played : <span>{userstats?.played || "No data"}</span></p>

	<p class="">Win ratio : <span>{userstats?.ratio == null ?  "No data" : userstats?.ratio + "%"}</span></p>

	<p class="">Rank : <span>{userstats?.level || "No data"}</span></p>

	<div class="flex justify-center hover:scale-110 transition-all duration-200">
		<button on:click={showHistory} class="flex gap-2"><span>Player History</span><Icon icon="history"/></button>
	</div>

	<div class="flex justify-center">
		<LeagueBadge league={userstats?.league || "gold"} /> <!-- remove '|| "gold"' once userstats.league ok -->
	</div>

</div>
