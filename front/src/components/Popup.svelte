<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";
	import { loop_guard } from "svelte/internal";

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let title : string = 'Modale Title';
	export let description : string = 'Modale description';
    export let placeholder : string = 'Placeholder';

    let fileinput: HTMLInputElement;
    let files: string;

	export let id : string = "";
	let value: string = "";

	function closePopUp ( trigger : string) {
		dispatch('closePopUp', {
			text: trigger
		});
	}

	function  confirmPopUp ( value : string ) {
		dispatch('confirmPopUp', {
			text: value
		});
	}

</script>



<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!--
      Background backdrop, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
				<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						{#if title === "Modify profile picture"}
							<form id="image_update" action="{`${PUBLIC_API_URI}/user/me/image`}" method="post" enctype="multipart/form-data">
								<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
									<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{title}</h3>
									<div class="mt-2">
										<button class="rounded-2xl py-1 px-3 bg-color5" on:click={()=>{fileinput.click();}}>Upload Image</button>
										<label for="image">Choose file to upload</label>
										<input id="image" name="image" bind:files bind:this={fileinput} style="display:none" accept="image/png" multiple='false' required class="w-full rounded-2xl py-1 px-3 bg-color5" type="file" />
										{#if files && files[0]}
											<div class="text-gray-900 text-black">{files[0].name}</div>
										{/if}
									</div>
								</div>
							</form>
						{:else if title === "Modify username"}
							<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
								<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{title}</h3>
								<div class="mt-2">
									<input on:keyup={(e)=>{(e.keyCode === 13) && updateUser(value)}} class="w-full rounded-2xl py-1 px-3 bg-color5" type="text" bind:value={value} placeholder={placeholder} />
								</div>
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
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {#if title === "Modify profile picture"}
						<button  on:click={() => { closePopUp(id) }} type="submit" form="image_update" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Confirm</button>
                    {:else if title === "Modify username"}
						<button on:click={() => { confirmPopUp(value) }} disabled='{value.length <= 0}' type="button" class="inline-flex w-full justify-center rounded-md {value.length <= 0 ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-500'} px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto">Confirm</button>
					{/if}
					<button on:click={() => { closePopUp(id) }} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
				</div>


            </div>
        </div>
    </div>
</div>
