<script lang="ts">
    import {onMount} from "svelte";
    import type { PageData } from './$types';

    import NavBar from '../../components/NavBar.svelte';
    import Icon from '../../components/Icon.svelte';
    import type {User} from '../../types/user';

    import  userservice from '../../services/UserService';

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

    <div class="sm:h-[85%] mx-[2%] self-center py-1">

        <div class="grid sm:grid-cols-3 h-full text-center align-middle m-1">

            <div class="relative sm:col-span-2 screen shadow-lg shadow-black/50 bg-black/25 overflow-auto rounded-3xl">
				<div class="absolute screen-overlay"></div>
                <div class="h-full grid grid-cols-2 sm:grid-cols-1">

					<div class="flex items-center my-2.5 sm:items-end sm:mb-2.5">

						<div class="grow">
							
						</div>

					</div>

					<div class="relative flex content-center items-center justify-center my-2.5 sm:items-start">

						<div class="grow">

						</div>
					</div>
				</div>
            </div>

            <div class="mt-5 ml-[2%] sm:ml-5 sm:mt-0 md:flex md:flex-col">

                <h2 class="flex space-x-2 text-left border-b-2 text-lg"><Icon icon="friends" /> <span>Friends list</span></h2>



                <div class="mt-2">


                </div>

                <div class="overflow-auto mt-3">

                </div>

            </div>

        </div>

    </div>

</div>
