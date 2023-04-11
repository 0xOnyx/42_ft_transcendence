<script lang="ts">
    import type { PageData } from './$types';
    import Button from '../../components/Button.svelte';
    import ItemName from '../../components/Itemname.svelte';

    interface UserStats {
        played: number,
        ratio: number,
        level: number,
    }
    interface User {
        id: number,
        name: string,
        login?: string,
    }

    let user : User = {
        id: 1,
        name: 'Marvin McKinney',
        login: 'mmckinne'
    }

    let userstats : UserStats = {
        played : 42,
        ratio: 84,
        level: 21
    }

    var connected : Array<User> = [
		{ id: 1, name: 'Jacob Jones' },
		{ id: 2, name: 'Leslie Alexander' },
		{ id: 3, name: 'Eleanor Pena' },
        { id: 4, name: 'Wade Warren' },
        { id: 5, name: 'Kathryn Murphy' },
        { id: 6, name: 'Marvin McKinney' }
	];

    var search_value : string = '';

	var search : Array<Object> = connected;

    function filter()
    {
        console.log(search);
        search = connected.filter((f) => {
            return f.name.toLowerCase().includes(search_value.toLowerCase());
        });
    }

    //export let data: PageData;
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
    <script src="https://cdn.jsdelivr.net/npm/jdenticon@3.2.0/dist/jdenticon.min.js" async
    integrity="sha384-yBhgDqxM50qJV5JPdayci8wCfooqvhFYbIKhv0hTtLvfeeyJMJCscRfFNKIxt43M" crossorigin="anonymous">
    </script>
</svelte:head>

<div class="h-full container md:py-10 xl:py-20 mx-auto">

    <div class="h-full bg-color3 self-center md:border-4 border-black rounded p-1 pb-3 xl:p-8">

        <div class="md:flex h-full text-center align-middle m-1">

            <div class="bg-color5 grow justify-around lg:flex mr-2 xl:mr-8 overflow-auto p-5">

                <div class="flex items-center">

                    <div class="grow">

                        <div class=""><svg class="rounded-full mx-auto bg-color3" width="100" height="100" data-jdenticon-value="icon"></svg></div>
                        <div class="mt-5">
                            <h1 class="text-lg">{user.name}</h1>
                            <small>#{user.login}</small>
                        </div>
                        <div class="mt-5"><Button width="w-52" name="Change Username" url="/"></Button></div>
                        <div class="mt-2"><Button width="w-52" name="Change Avatar" url="/"></Button></div>
                        <div class="mt-2"><Button width="w-52" name="Logout" url="/"></Button></div>

                    </div>

                </div>

                <div class="flex items-center">

                    <div class="grow">

                        <div class="mt-5">
                            <p>Statistics</p>

                            <p class="mt-5">Game played : <span>{userstats.played}</span></p>

                            <p>Win ratio : <span>{userstats.ratio}%</span></p>

                            <p>Rank : <span>{userstats.level}</span></p>

                        </div>

                        <div class="mt-5"><Button width="w-52" name="Gold League" color="bg-yellow-400"  url="/"></Button></div>

                        <div class="mt-12"><Button width="w-52" name="New Game" url="/"></Button></div>


                        <div class="md:flex justify-center mt-5">

                            <div class="m-2"><Button width="w-28" name="DM" url="/"></Button></div>
                            <div class="m-2"><Button width="w-28" name="Private" url="/"></Button></div>
                            <div class="m-2"><Button width="w-28" name="Public" url="/"></Button></div>

                        </div>

                    </div>

                </div>

            </div>

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">

                <h2 class="text-left border-b-2 text-lg">Friends lists</h2>

                <div class="mt-2">
                    <a class="w-full bg-color2 px-8 py-2 rounded-md inline-block" href="">Add Friend</a>
                </div>

                <div class="mt-2">
                    <input class="w-full rounded-2xl py-1 px-3 bg-color5" type="text" bind:value={search_value} placeholder="Search" on:keyup={filter}>
                </div>

                <div class="overflow-auto mt-3">

                    {#each search as friend, i}

                        <ItemName name={friend.name}></ItemName>

                    {/each}

                </div>

            </div>

        </div>

    </div>

</div>





