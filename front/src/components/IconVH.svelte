<script lang="ts">
	export let icon : string = '';
    export let css : string = '';
	export let width : string = "24";
	export let height : string = "24";
	export let color : string = "currentColor";
</script>

{#if icon == "log"}
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} class={css}>
	<path fill={color} d="M12 13q-.425 0-.713-.288T11 12V4q0-.425.288-.713T12 3q.425 0 .713.288T13 4v8q0 .425-.288.713T12 13Zm0 8q-1.875 0-3.513-.713t-2.85-1.924q-1.212-1.213-1.924-2.85T3 12q0-1.725.625-3.3t1.8-2.85q.275-.3.7-.3t.725.3q.275.275.25.688t-.3.737q-.875.975-1.337 2.188T5 12q0 2.925 2.038 4.963T12 19q2.925 0 4.963-2.038T19 12q0-1.325-.475-2.563t-1.35-2.212q-.275-.3-.288-.7t.263-.675q.3-.3.725-.3t.7.3q1.175 1.275 1.8 2.85T21 12q0 1.875-.713 3.513t-1.924 2.85q-1.213 1.212-2.85 1.925T12 21Z" />
	</svg>
{:else if icon == "modify"}
	<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 14 14" class={css}>
		<g fill="none" stroke={color} stroke-linecap="round" stroke-linejoin="round">
			<path d="m7.5 9l-3 .54L5 6.5L10.73.79a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 0 1 0 1.42Z"/>
			<path d="M12 9.5v3a1 1 0 0 1-1 1H1.5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3"/>
		</g>
	</svg>
{/if}