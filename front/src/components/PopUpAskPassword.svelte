<script lang="ts">


    export let close: Function;
    export let joinChannel: Function;
    let password: string = "";



</script>


<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">

                        <div class="flex w-full text-center sm:ml-4 sm:mr-4 sm:mt-0 sm:text-left">
                                <div class="mt-3 mr-4  w-full">
                                    <span class="block text-sm font-medium text-slate-700">This room required password to join !</span>
                                    <!-- Using form state modifiers, the classes can be identical for every input -->
                                    <input bind:value={password} type="password" placeholder="Password room" class="text-slate-600 mt-5 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                                              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                                              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                                              invalid:border-pink-500 invalid:text-pink-600
                                              focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>
                                </div>
                        </div>

                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button on:click={()=>{joinChannel(password)}} disabled='{password.length <= 0}' type="button" class="inline-flex w-full justify-center rounded-md {password.length <= 0 ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-500'} px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto">Join Channel</button>
                    <button on:click={close()} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                </div>


            </div>
        </div>
    </div>
</div>
