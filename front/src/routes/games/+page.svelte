<script lang="ts">
    import {onMount} from "svelte";
    import type { PageData } from './$types';

    import NavBar from '../../components/NavBar.svelte';
    import Icon from '../../components/Icon.svelte';
    import type {User} from '../../types/user';

    import  userservice from '../../services/UserService';
	import Button from "../../components/Button.svelte";

    let user : User;

    onMount(async () => {

        user = await userservice.getCurrentUser();


        async function test() {

            console.log(await userservice.isLogged());

            userservice.test();

            console.log(await userservice.isLogged());        
        }

        test();

    });


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
                                    <div class="w-5 h-5 bg-white inline-block rounded-md p-1"><div class="bg-color3 h-full w-full rounded-sm"></div></div> Join</button>

                            </div>
						</div>

					</div>

					<div class="relative lg:flex lg:w-2/3 mx-5">

						<div class="lg:flex lg:flex-col grow my-10 lg:mr-10 bg-thread-blue">
                            <h2 class="mt-10">New game</h2>
                            <div class="lg:grow m-5 bg-color5">

                                les trucs

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
