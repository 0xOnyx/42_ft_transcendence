<script lang="ts">
    import {createEventDispatcher} from "svelte";

    let password: string = "";
    let yes: boolean = true;

    const dispatch = createEventDispatcher();

    function changePassword()
    {
        dispatch("changePassword", password)
    }
    function close()
    {
        dispatch("close");
    }

</script>

<style>
    input:checked ~ .dot {
        transform: translateX(100%);
        background-color: #48bb78;
    }
</style>


<div class="z-100 absolute w-full px-4 min-h-screen md:flex md:items-center md:justify-center">
    <div class="bg-black opacity-75 w-full h-full absolute z-10 inset-0"></div>
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
        <div class="md:flex items-center">

            <!--            <div class="bg-white ">-->
            <!--                <div class="flex w-full text-center sm:ml-4 sm:mr-4 sm:mt-0 sm:text-left">-->
            <!--                    <div class="mt-3 mr-4  w-full">-->
            <!--                        <span class="block text-sm font-medium text-slate-700">This room required password to join !</span>-->
            <!--                        &lt;!&ndash; Using form state modifiers, the classes can be identical for every input &ndash;&gt;-->
            <!--                        <input bind:value={password} type="password" placeholder="Password room" class="text-slate-600 mt-5 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400-->
            <!--                                          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500-->
            <!--                                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none-->
            <!--                                          invalid:border-pink-500 invalid:text-pink-600-->
            <!--                                          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->


            <div class="mt-3">
                <!--                                    <input type="checkbox" class="accent-pink-500" checked>-->
                <!-- Toggle A -->
                <div class="flex items-center justify-center w-full">

                    <label
                        for="toogleA"
                        class="flex items-center cursor-pointer"
                    >
                        <!-- toggle -->
                        <div class="relative">
                            <!-- input -->
                            <input on:click={()=>{password = ""}} bind:checked={yes} id="toogleA" type="checkbox" class="sr-only" />
                            <!-- line -->
                            <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                            <!-- dot -->
                            <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                        </div>
                        <!-- label -->
                        <div class="ml-3 text-gray-700 font-medium text-sm">
                            {#if yes}
                                Private
                            {:else}
                                Public
                            {/if}
                        </div>
                    </label>

                </div>

                <!-- Using form state modifiers, the classes can be identical for every input -->
                <input disabled={!yes} bind:value={password} type="password" placeholder="password" class=" text-slate-600  mt-5  block w-40 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                                              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                                              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                                              invalid:border-pink-500 invalid:text-pink-600
                                              focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>
            </div>


        </div>
        <div class="text-center md:text-right mt-4 md:flex md:justify-end">
            <button disabled={yes && password.length <= 0} on:click={changePassword} class="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white block w-full md:inline-block md:w-auto px-4 py-3 md:py-2  rounded-lg font-semibold text-sm md:ml-2 md:order-2">
                Accept</button>
            <button on:click={close} class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-800 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1">Cancel</button>
        </div>
    </div>
</div>
