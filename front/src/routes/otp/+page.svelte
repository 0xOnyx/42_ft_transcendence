<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";

	import OTP from "../../components/OTP.svelte";

    import {onMount} from "svelte";

	let value : string = '';

	function updateValue( e : CustomEvent) {
		value = e.detail.text;
	}

    onMount(async () => {

        let res: Response;

		async function submitOTP() {
			const body = JSON.stringify({ otp: value });
    		try {
      			res = await fetch(`${PUBLIC_API_URI}/auth/2fa`, {
        			method: "POST",
        			headers: {
          				"Content-Type": "application/json",
        			},
        			body,
      			});
      			const data = await res.json();
      			console.log(data);
    		} catch (err) {
      			console.error(err);
   	 		}
  		}
		
		const confirmBtn = document.querySelector(".confirm-btn");
  		confirmBtn.addEventListener("click", submitOTP);
    });
    //export let data: PageData;
</script>


<div class="flex-col">

	<div class="flex py-2 landscape:py-0 md:py-10 xl:py-10">

		<div class="h-[80vh] grow sm:h-screen mobile-landscape:h-screen w-full px-[5%] self-center py-1 grid overflow-hidden">
			
			<div class="flex flex-col sm:flex-row sm:max-h-[85%] gap-4 sm:grid-cols-3 text-center align-middle m-1">

				<div class="info-user screen grow h-1/2 sm:h-full sm:w-2/3 mobile-landscape:w-1/2 overflow-hidden flex shadow-lg shadow-black/50 bg-black/25 rounded-3xl mobile-landscape:col-span-1 sm:col-span-2">
					<div class="screen-overlay"></div>
					<div class="grow flex flex-col items-center justify-center m-auto">
						<div class="relative justify-center">
							<h1 class="text-2xl">Enter OTP to log in:</h1>
						</div>
						<div class="relative gap-3 flex flex-col p-3 grow m-auto justify-center items-center">
							<OTP on:inputValueChange={updateValue} />
						</div>
						<div class="flex relative items-center justify-center flex-row-reverse">
							<button
									disabled='{value.length != 6}' 
									type="button" 
									class="confirm-btn inline-flex w-full justify-center rounded-md {value.length != 6 ? 'bg-[#529167]' : 'bg-process-green hover:bg-process-green/80'} px-3 py-2 text-sm font-semibold text-white dark:text-gray-900 shadow-sm  sm:ml-3 sm:w-auto">Confirm</button>
							<button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-core-red shadow-sm ring-2 ring-inset ring-core-red hover:ring-4 sm:mt-0 sm:w-auto transition-all" onclick="window.location.href = '/'">Cancel</button>
						</div>

				</div>
				</div>
			</div>
		</div>

	</div>
</div>





