
<script lang="ts">
	import type { UserStats } from "../types/user";
	import LeagueBadge from "./LeagueBadge.svelte";

    export let userstats : UserStats;
</script>


<div class="flex flex-col gap-2 text-sm mobile-landscape:text-sm sm:text-base">

	<p class="">Game played : <span>{userstats?.played || "No data"}</span></p>

	<p class="">Win ratio : <span>{userstats?.ratio || "No data"}%</span></p>

	<p class="">Rank : <span>{userstats?.level || "No data"}</span></p>

	<div class="flex justify-center">
		<LeagueBadge league={userstats?.league || "gold"} /> <!-- remove '|| "gold"' once userstats.league ok -->
	</div>

</div>
