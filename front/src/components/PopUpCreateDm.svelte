<script lang="ts">
	import Switch from "./Switch.svelte";
	import { fade } from "svelte/transition";
	
    export let close: Function;
    export let createRoom: Function;
    let room_name: string = "";
    let password: string = "";
    let yes: boolean = false;


</script>

<style>
    input:checked ~ .dot {
        transform: translateX(100%);
        background-color: #48bb78;
    }
</style>



<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 bottom-1/3 sm:bottom-0 mobile-landscape:bottom-0  overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <div class="relative bg-gray-700 transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">

                            <div class="grid grid-cols-2 justify-between w-full text-center sm:ml-4 sm:mr-4 sm:mt-0 sm:text-left">


                                <div class="">
                                    <span class=" block text-sm text-left font-medium text-gray-200 mb-10">New Room</span>
                                    <!-- Using form state modifiers, the classes can be identical for every input -->
									<div class="relative mt-3 mr-2">
										<input	id="RoomName"
												on:keyup={(e)=>{(e.keyCode === 13)}}
												class="w-full peer rounded-t-md border-b-[3px] border-gray-600 py-1 px-3 bg-gray-300 text-gray-900 placeholder:text-transparent focus:outline-none focus:border-process-green"
												type="text"
												bind:value={room_name}
												placeholder="Room name" />
										<label for="RoomName" class="absolute py-1 px-2 peer-placeholder-shown:left-1 peer-placeholder-shown:-top-0.5 peer-placeholder-shown:text-lg transition-transform-colors duration-300 ease-out text-2xs text-process-green transform -translate-y-full peer-placeholder-shown:translate-y-0 -left-2 peer-placeholder-shown:text-gray-900/25">Room name</label>
									</div>
                                </div>
                                <div class="mt-5">
<!--                                    <input type="checkbox" class="accent-pink-500" checked>-->
                                            <!-- Toggle A -->
                                            <div class="flex items-center justify-center w-full">

                                                <label
                                                    for="toogleA"
                                                    class="flex items-center cursor-pointer"
                                                >
                                                    <!-- toggle -->
													<Switch bind:checked={yes} />
                                                    <!-- label -->
                                                    <div class="ml-3 text-gray-200 font-medium text-sm">
                                                        {#if yes}
                                                            Private
                                                        {:else}
                                                           Public
                                                        {/if}
                                                    </div>
                                                </label>

                                            </div>
								

                                        <!-- Using form state modifiers, the classes can be identical for every input -->
										{#if yes}
										<div transition:fade class="relative ml-2 mt-5">
											<input	disabled={!yes}
													id="UpdatePassword"
													on:keyup={(e)=>{(e.keyCode === 13)}}
													class="w-full peer rounded-t-md border-b-[3px] border-gray-600 py-1 px-3 bg-gray-300 text-gray-900 placeholder:text-transparent focus:outline-none focus:border-process-green"
													type="password"
													bind:value={password}
													placeholder="Password" />
											<label for="UpdatePassword" class="absolute py-1 px-2 peer-placeholder-shown:left-1 peer-placeholder-shown:-top-0.5 peer-placeholder-shown:text-lg transition-transform-colors duration-300 ease-out text-2xs text-process-green transform -translate-y-full peer-placeholder-shown:translate-y-0 -left-2 peer-placeholder-shown:text-gray-900/25">Password</label>
										</div>
										{/if}
                                </div>

<!--                                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Create room</h3>-->
<!--                                <div class="mt-2">-->
<!--                                    <input class="w-full rounded-2xl py-1 px-3 bg-color5" type="text" bind:value={value} placeholder="Name of the room" />-->
<!--                                </div>-->
<!--                                <div class="mt-2">-->
<!--                                    <input class="w-full rounded-2xl py-1 px-3 bg-color5" type="text" bind:value={value} placeholder="Name of the room" />-->
<!--                                </div>-->

                            </div>

                    </div>
                </div>
                <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mb-2">
                    <button on:click={()=>{createRoom(room_name, password)}} disabled='{room_name.length <= 0 || yes && password.length <= 0}' type="button" class="inline-flex w-full justify-center rounded-md disabled:bg-white/50 disabled:italic disabled:text-gray-200/50 disabled:border-gray-200/50 disabled:hover:translate-y-0 border-[3px]  bg-transparent hover:-translate-y-1 transition-all duration-200 text-process-green border-process-green shadow-lg shadow-process-green/50 px-3 py-2 text-sm font-semibold sm:ml-3 sm:w-auto">Confirm</button>
                    <button on:click={close()} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold hover:-translate-y-1 transition-all duration-200 border-[3px] border-core-red shadow-lg text-core-red shadow-core-red/50 sm:mt-0 sm:w-auto">Cancel</button>
                </div>


            </div>
        </div>
    </div>
</div>
