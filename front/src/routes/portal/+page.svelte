<script lang="ts">
    import type { PageData } from './$types';
    import Button from '../../components/Button.svelte';
    import ItemName from '../../components/Itemname.svelte';

	let friends = [
		{ id: 1, name: 'Jacob Jones' },
		{ id: 2, name: 'Leslie Alexander' },
		{ id: 3, name: 'Eleanor Pena' },
        { id: 4, name: 'Wade Warren' },
        { id: 5, name: 'Kathryn Murphy' },
        { id: 6, name: 'Marvin McKinney' }
	];

    export let data: PageData;
</script>

<svelte:head>
    <script>
        window.jdenticon_config = {
            hues: [207],
            lightness: {
                color: [0.84, 0.84],
                grayscale: [0.84, 0.84]
            },
            saturation: {
                color: 0.48,
                grayscale: 0.48
            },
            backColor: "#383683"
        };
    </script>
</svelte:head>

<div class="grid grow items-center container bg-color3 sm:m-20 sm:border-4 border-black rounded p-2 sm:p-10">
    <div class="sm:flex grow text-center align-middle m-5 h-full">

        <div class="bg-color5 grow grid grid-cols-2 grid-rows-1">

            <div class="flex items-center">

                <div class="grow">

                    <div class=""><svg class="rounded-full mx-auto bg-color3" width="100" height="100" data-jdenticon-value="icon"></svg></div>
                    <div class="mt-5">
                        <h1 class="text-lg">Marvin McKinney</h1>
                        <small>#mmckinne</small>
                    </div>
                    <div class="mt-5"><Button name="Change Username" url="/"></Button></div>
                    <div class="mt-2"><Button name="Change Avatar" url="/"></Button></div>
                    <div class="mt-2"><Button name="Logout" url="/"></Button></div>

                </div>

            </div>

            <div class="flex items-center">

                <div class="grow">



                </div>

            </div>

        </div>

        <div class="sm:w-1/4">

            <div class="mx-5">

                <h2>Friends lists</h2>

                <div class="mt-2">
                    <a class="w-full bg-color2 px-8 py-2 rounded-md inline-block" href="">Add Friend</a>
                </div>

                <div class="mt-2">
                    <input class="w-full rounded-2xl py-1 px-3 bg-color5" type="text" placeholder="Search">
                </div>

                <div class="overflow-auto mt-3">

                    <div class="rounded-xl bg-color5 p-5 flex items-center mt-1">

                        <div class="mx-2">
                            <svg class="rounded-full mx-auto bg-color3" width="50" height="50" data-jdenticon-value="icon"></svg>
                        </div>
                        <div class="mx-2">
                            Jacob Jones
                        </div>
                        <div class="mx-2">
                            online
                        </div>

                    </div>

                    {#each friends as friend, i}

                        <ItemName name={friend.name}></ItemName>

                    {/each}

                </div>

            </div>

        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/jdenticon@3.2.0/dist/jdenticon.min.js" async
    integrity="sha384-yBhgDqxM50qJV5JPdayci8wCfooqvhFYbIKhv0hTtLvfeeyJMJCscRfFNKIxt43M" crossorigin="anonymous">
    </script>

</div>






