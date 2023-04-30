<script lang="ts">
    import {onMount} from "svelte";
    import type { PageData } from './$types';

    import NavBar from '../../components/NavBar.svelte';
    import Icon from '../../components/Icon.svelte';
    import type {User} from '../../types/user';

    import  userservice from '../../services/UserService';
	import Button from "../../components/Button.svelte";
	import Checkbox from "../../components/Checkbox.svelte";
	import ItemName from "../../components/Itemname.svelte";

    let user : User;
    let search_value : string = '';
    let friends : Array<User> = new Array;
    let search : Array<User> = new Array;
    let closeWarningUnbanUser = -1;

    onMount(async () => {

        user = await userservice.getCurrentUser();
        friends = await userservice.getFriends();

        async function test() {

            console.log(await userservice.isLogged());

            console.log(await userservice.isLogged());
        }

        test();

    });

    function alertme(event : CustomEvent)
    {
        alert(event.detail.checked);
    }

    async function searchUser()
    {
        search = await userservice.searchUser(search_value);
    }

</script>


<NavBar user={user} />

<div class="h-full py-7 md:py-10 xl:py-10">

    <div class="lg:h-[85%] mx-[2%] self-center py-1">

        <div class="grid lg:grid-cols-12 h-full text-center align-middle m-1">

            <div class="relative lg:col-start-2 lg:col-span-10 screen shadow-lg shadow-black/50 bg-black/25 lg:overflow-auto rounded-3xl">
				<div class="absolute screen-overlay"></div>
                <div class="h-full lg:flex lg:flex-row">

                    <div class="relative lg:flex lg:w-1/3 mx-5">

						<div class="lg:flex lg:flex-col grow my-10 lg:ml-10 bg-thread-blue">
							<h2 class="mt-10">Join server</h2>
                            <div class="lg:grow m-5 bg-color5">

                                les trucs

                            </div>
                            <div class="p-5">

                                <button class="bg-color2 border-2 border-color2 px-8 py-1 w-full rounded-md inline-block text-black">
                                    <Checkbox disable={true}></Checkbox> Join</button>

                            </div>
						</div>

					</div>

					<div class="relative lg:flex lg:w-2/3 mx-5">

						<div class="lg:flex lg:flex-col grow my-10 lg:mr-10 bg-thread-blue">
                            <h2 class="mt-10">New game</h2>
                            <div class="lg:grow m-5">

                                <div>

                                    <h2 class="flex space-x-2 text-left border-b-2 text-lg">
                                        <Icon icon="friends" />
                                        <span>Friends list</span>
                                    </h2>

                                    <div class="mt-2">
                                        <input class="w-full rounded-2xl py-1 px-3 bg-color5 focus:outline-none" type="text" bind:value={search_value} placeholder="Search" on:keyup={searchUser}>
                                    </div>

                                    <div class="overflow-auto mt-3">
                                        {#if search_value.length <= 0}
                                            {#if friends.length <= 0}
                                                <p>NO FRIEND</p>  <!-- CREATE THIS -->
                                            {:else}
                                                {#each friends as friend}
                                                    <ItemName requestBlock={()=>{closeWarningUnbanUser=friend.id}} user={friend}></ItemName>
                                                {/each}
                                            {/if}
                                        {:else}
                                            {#if  search.length <= 0}
                                                <p>no user found :/</p>  <!-- CREATE THIS -->
                                            {:else}
                                                {#each search as user}
                                                    <ItemName requestBlock={()=>{closeWarningUnbanUser=user.id}} user={user}></ItemName>
                                                {/each}
                                            {/if}
                                        {/if}
                                    </div>
                                </div>



                            </div>
                            <div class="p-5">


                                <button class="bg-color2 border-2 border-color2 px-8 py-1 w-full rounded-md inline-block text-black">Start</button>

                            </div>


						</div>

					</div>


				</div>
            </div>

        </div>

    </div>

</div>
