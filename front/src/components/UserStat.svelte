
<script lang="ts">
	import type { UserStats } from "../types/user";

    export let userstats : UserStats;
</script>


<div>

    <p>Statistics</p>

    <p class="mt-5">Game played : <span>{userstats.played}</span></p>

    <p>Win ratio : <span>{userstats.ratio}%</span></p>

    <p>Rank : <span>{userstats.level}</span></p>

    <div class="mt-5 py-2 inline-block bg-yellow-400 rounded-full w-52 text-black">Gold League</div>

</div>
