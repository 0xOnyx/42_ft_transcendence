<script lang="ts">
	import { leftHanded } from '../services/Stores';
	import Switch from './Switch.svelte';
	import type { User } from '../types/user';
	import PopUp from './Popup.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let user : User;

	let _openAuth : boolean = false;
	let _enableAuth : boolean = false;

	const updatePopUp = ( e : CustomEvent ) => {
		console.log(e.detail.text);
		if (e.detail.text === "auth") {
			_openAuth = !_openAuth;
		}
		if (e.detail.type === true) {
			_openAuth = !_openAuth;
		}
		if (e.detail.type === "close") {
			_enableAuth = !_enableAuth;
		}
		if (e.detail.type === "confirm") {
			_openAuth = false;
		}
	}

</script>


{#if _openAuth}
<PopUp id="auth" user={user} on:closePopUp={updatePopUp} on:confirmPopUp={updatePopUp} title="Two-factor authentication (2FA)" />
{/if}
<div class="flex flex-col gap-3 items-start">
	<div class="flex items-center justify-center gap-3 {$leftHanded ? 'text-process-green' : 'text-gray-300' }">
		<Switch bind:checked={$leftHanded} />
		<span class="text-xs">Left Handed </span>
	</div>
	<div class="flex items-center justify-center gap-3 {_enableAuth ? 'text-process-green' : 'text-gray-300' }">
		<Switch bind:checked={_enableAuth} on:inputChange={updatePopUp}/>
		<div class="flex flex-col items-start">
			<span class="text-xs">Two-factor</span>
			<span class="text-xs">authentication (2FA) </span>
		</div>
	</div>
</div>