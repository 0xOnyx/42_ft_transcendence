<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";

	import OTP from "../../components/OTP.svelte";

    import {goto} from "$app/navigation";

	let value : string = '';

	function updateValue( e : CustomEvent) {
		value = e.detail.text;
	}

    let formBody = null;
    let error: string = ""
    async function sendToken()
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/auth/totp`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(new FormData(formBody)),
        })
        if (res.status == 200)
            await goto("/portal")
        else
            error = "bad code";
    }

</script>

{#if error.length > 0}
    <div class="relative z-[300]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-left sm:items-center sm:p-0">

                <div class="bg-red-100 border border-red-400 text-red-700 px-60 py-3 rounded relative" role="alert">
                    <strong class="font-bold">ERROR !</strong>
                    <span class="block sm:inline">{error}</span>
                    <span on:click={()=>{error=""}} class="absolute top-0 bottom-0 right-0 px-4 py-3">
					<svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
				</span>
                </div>
            </div>
        </div>
    </div>
{/if}

<div class="flex-col">

	<div class="flex py-2 landscape:py-0 md:py-10 xl:py-10">

		<div class="h-[80vh] grow sm:h-screen mobile-landscape:h-screen w-full px-[5%] self-center py-1 grid overflow-hidden">
                <div class="flex flex-col sm:flex-row sm:max-h-[85%] gap-4 sm:grid-cols-3 text-center align-middle m-1">
                    <form bind:this={formBody} class="info-user screen grow h-1/2 sm:h-full sm:w-2/3 mobile-landscape:w-1/2 overflow-hidden flex shadow-lg shadow-black/50 bg-black/25 rounded-3xl mobile-landscape:col-span-1 sm:col-span-2">
                        <div class="screen-overlay"></div>
                        <div class="grow flex flex-col items-center justify-center m-auto">
                            <div class="relative justify-center">
                                <h1 class="text-2xl">Enter OTP to log in:</h1>
                            </div>
                            <div class="relative gap-3 flex flex-col p-3 grow m-auto justify-center items-center">
                                <OTP on:inputValueChange={updateValue} />
                            </div>
                            <input type="text" name="code" bind:value={value} class="hidden"/>
                            <div class="flex relative items-center justify-center flex-row-reverse">
                                <button
                                        on:click={sendToken}
                                        disabled='{value.length != 6}'
                                        type="button"
                                        class="confirm-btn inline-flex w-full justify-center rounded-md {value.length != 6 ? 'bg-[#529167]' : 'bg-process-green hover:bg-process-green/80'} px-3 py-2 text-sm font-semibold text-white dark:text-gray-900 shadow-sm  sm:ml-3 sm:w-auto">Confirm</button>
                                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-core-red shadow-sm ring-2 ring-inset ring-core-red hover:ring-4 sm:mt-0 sm:w-auto transition-all" on:click={()=>{goto("/")}}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
		</div>

		</div>
		</div>
	</div>
</div>