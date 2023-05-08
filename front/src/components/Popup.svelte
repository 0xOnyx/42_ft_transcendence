<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";
	import { loop_guard } from "svelte/internal";

	import { fade, fly } from "svelte/transition";

	import { createEventDispatcher } from 'svelte';
	import UserSettings from "./UserSettings.svelte";
	import type { User } from "../types/user";
	import OTP from "./OTP.svelte";

	const dispatch = createEventDispatcher();

    export let title : string = 'Modale Title';
	export let description : string = 'Modale description';
    export let placeholder : string = 'Placeholder';
	export let user : User;

    let fileinput: HTMLInputElement;
    let files: string;

	export let id : string = "";
	let value: string = "";

	function closePopUp ( trigger : string) {
		dispatch('closePopUp', {
			text: trigger,
			type: "close"
		});
	}

	function  confirmPopUp ( value : string ) {
		console.log("hello there");
		
		dispatch('confirmPopUp', {
			text: value,
			type: "confirm"
		});
	}

	function updateValue( e : CustomEvent) {
		value = e.detail.text;
	}

</script>



<div class="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!--
      Background backdrop, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div transition:fade class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

    <div transition:fly="{{y:200, duration:600}}" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div on:blur class="relative border-2 border-gray-600 overflow-hidden rounded-md bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
				<h3 class="px-4 py-2 rounded-b-lg text-base font-semibold leading-6 text-black dark:text-gray-300" id="modal-title">{title}</h3>
				<div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						{#if title === "Modify profile picture"}
							<form id="image_update" action="{`${PUBLIC_API_URI}/user/me/image`}" method="post" enctype="multipart/form-data">
								<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
									<div class="mt-2 flex flex-col">
										<button class="rounded-2xl py-1 px-3 bg-color5" on:click={()=>{fileinput.click();}}>
											{#if files && files[0]}
											<div class="text-white truncate">{files[0].name}</div>
											{:else}
												<span>Upload Image</span>
											{/if}
										</button>
										<label for="image" class="text-black text-xs">Choose file to upload</label>
										<input id="image" name="image" bind:files bind:this={fileinput} style="display:none" accept="image/png" multiple='false' required class="w-full rounded-2xl py-1 px-3 bg-color5" type="file" />

									</div>
								</div>
							</form>
						{:else if title === "Modify username"}
							<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
								<div class="mt-2">
									<div class="relative">
										
										<input 
											id="UpdateUsername"
											on:keyup={(e)=>{(e.keyCode === 13) && updateUser(value)}}
											class="w-full peer rounded-t-md border-b-[3px] border-gray-600 py-1 px-3 bg-gray-300 text-gray-900 placeholder:text-transparent focus:outline-none focus:border-process-green" 
											type="text" 
											bind:value={value}
											placeholder="New username" />
										<label for="UpdateUsername" class="absolute py-1 px-2 peer-placeholder-shown:left-1 peer-placeholder-shown:-top-0.5 peer-placeholder-shown:text-lg transition-transform-colors duration-300 ease-out text-2xs text-process-green transform -translate-y-full peer-placeholder-shown:translate-y-0 -left-2 peer-placeholder-shown:text-gray-900/25">New username</label>
									</div>
								</div>
							</div>
						{:else if id === "auth"}
						<div class="mt-3 flex flex-col gap-4 items-center text-center sm:ml-4 sm:mt-0 sm:text-left">
							<div class="mt-2 bg-white h-40 w-40 text-black flex grow items-center justify-center">
								QR CODE
							</div>
							<OTP on:inputValueChange={updateValue} />
						</div>
						{:else if description != "Modale description"}
							<div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
								<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
								</svg>
							</div>
							<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
								<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{title}</h3>
								<div class="mt-2">

									<p class="text-sm text-gray-500">{description}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
                <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {#if title === "Modify profile picture"}
						<button  on:click={() => { closePopUp(id) }} type="submit" form="image_update" class="inline-flex w-full justify-center rounded-md bg-process-green/50 px-3 py-2 text-sm font-semibold text-white dark:text-gray-900 shadow-sm hover:bg-thread-blue/80 sm:ml-3 sm:w-auto">Confirm</button>
                    {:else if title === "Modify username"}
						<button on:click={() => { confirmPopUp(value) }} disabled='{value.length <= 0}' type="button" class="inline-flex w-full justify-center rounded-md {value.length <= 0 ? 'bg-process-green/50' : 'bg-process-green hover:bg-process-green/80'} px-3 py-2 text-sm font-semibold text-white dark:text-gray-900 shadow-sm  sm:ml-3 sm:w-auto">Confirm</button>
					{:else if id === "auth"}
						<button on:click={() => { confirmPopUp(value) }} disabled='{value.length != 6}' type="button" class="inline-flex w-full justify-center rounded-md {value.length != 6 ? 'bg-process-green/50' : 'bg-process-green hover:bg-process-green/80'} px-3 py-2 text-sm font-semibold text-white dark:text-gray-900 shadow-sm  sm:ml-3 sm:w-auto">Confirm</button>
					{/if}
					<button on:click={() => { closePopUp(id) }} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-core-red shadow-sm ring-2 ring-inset ring-core-red hover:ring-4 sm:mt-0 sm:w-auto transition-all">Cancel</button>
				</div>


            </div>
        </div>
    </div>
</div>
