<script lang="ts">
	import { leftHanded } from '../services/Stores';
	import Switch from './Switch.svelte';
	import type { User, Authenticators } from '../types/user';
	import PopUp from './Popup.svelte';
    import {createEventDispatcher, onMount} from 'svelte';
    import {PUBLIC_API_URI} from "$env/static/public";

	const dispatch = createEventDispatcher();

	export let user : (User & { auth?: Authenticators });

	let _openAuth : boolean = false;
	let _enableAuth : boolean = !!(user.auth);
    let secret: string;
    let key : string;
    let error: string = "";

    async function getKeyTotp()
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/auth/GenerateTotp`, {
            method: 'GET',
            credentials: 'include'
        });
        if (res.status == 200)
        {
            key = await res.text();
            secret = `otpauth://totp/transcendence?secret=${key}&period=30`;
            console.log(key)
        }
    }

	const updatePopUp = async ( e : CustomEvent ) => {
		console.log(e.detail.text);
        console.log(e.detail.type);
		if (e.detail.text === "auth") {
			_openAuth = !_openAuth;
		}
		if (e.detail.type === true) {
            getKeyTotp();
			_openAuth = !_openAuth;
		}
        if (e.detail.type === false) {
            const res = await fetch(`${PUBLIC_API_URI}/auth/removeTotp`)
            _enableAuth = res.status != 200;
        }
		if (e.detail.type === "close") {
			_enableAuth = !_enableAuth;
		}
		if (e.detail.type === "confirm") {
            const res = await fetch(`${PUBLIC_API_URI}/auth/ValideTotp?code=${e.detail.text}&token=${key}`);
            if (res.status == 200)
            {
                console.log(await res.text());
			    _openAuth = false;
            }
            else
            {
                error = (await res.json()).message;
            }

		}
	}
</script>

{#if error.length > 0}
    <div class="relative z-[300]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-left sm:items-center sm:p-0">

                <div class="bg-red-100 border border-red-400 text-red-700 px-60 py-3 rounded relative" role="alert">
                    <strong class="font-bold">ERROR SERVER !</strong>
                    <span class="block sm:inline">{error}</span>
                    <span on:click={()=>{error=""}} class="absolute top-0 bottom-0 right-0 px-4 py-3">
					<svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
				</span>
                </div>
            </div>
        </div>
    </div>
{/if}


{#if _openAuth && secret}
<PopUp id="auth" user={user} secret={secret} on:closePopUp={updatePopUp} on:confirmPopUp={updatePopUp} title="Two-factor authentication (2FA)" />
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
