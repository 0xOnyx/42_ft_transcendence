<script lang="ts">

    export let message: String;
    export let buttonAccecpt: Function;
    export let buttonDecline: Function;
    export let title: String;
</script>


<div class="z-100 absolute w-full px-4 min-h-screen md:flex md:items-center md:justify-center">
    <div class="bg-black opacity-75 w-full h-full absolute z-10 inset-0"></div>
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
        <div class="md:flex items-center">

            <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <p class="font-bold text-gray-700">{title}</p>
                <p class="text-sm text-gray-600 mt-1">{message}
                </p>
            </div>
        </div>
        <div class="text-center md:text-right mt-4 md:flex md:justify-end">
            <button on:click={buttonAccecpt} class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2">
                Accept</button>
            <button on:click={buttonDecline} class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-800 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1">Cancel</button>
        </div>
    </div>
</div>
