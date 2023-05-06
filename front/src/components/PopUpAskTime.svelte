<script lang="ts">
    import {createEventDispatcher} from "svelte";

    let time: number = 1;

    const dispatch = createEventDispatcher();

    function setMuteTime()
    {
        dispatch("timeSelect", time)
    }
    function close()
    {
        dispatch("close");
    }

</script>



<div class="z-100 absolute w-full px-4 min-h-screen md:flex md:items-center md:justify-center">
    <div class="bg-black opacity-75 w-full h-full absolute z-10 inset-0"></div>
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
        <div class="md:flex items-center">

                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">

                    <div class="flex w-full text-center sm:ml-4 sm:mr-4 sm:mt-0 sm:text-left">
                        <div class="mt-3 mr-4  w-full">
                            <span class="block text-sm font-medium text-slate-700">Select number of hour the user is block !</span>
                            <!-- Using form state modifiers, the classes can be identical for every input -->
                            <input min="0" max="24" bind:value={time} type="number" placeholder="Time hours mute user" class="text-slate-600 mt-5 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                                              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                                              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                                              invalid:border-pink-500 invalid:text-pink-600
                                              focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>
                        </div>
                    </div>

                </div>

        </div>
        <div class="text-center md:text-right mt-4 md:flex md:justify-end">
            <button disabled={time <= 0} on:click={setMuteTime} class="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white block w-full md:inline-block md:w-auto px-4 py-3 md:py-2  rounded-lg font-semibold text-sm md:ml-2 md:order-2">
                Accept</button>
            <button on:click={close} class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-800 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1">Cancel</button>
        </div>
    </div>
</div>
