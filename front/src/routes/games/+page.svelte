<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import NavBar from '../../components/NavBar.svelte';
    import Icon from '../../components/Icon.svelte';
    import type {User} from '../../types/user';
    import userservice from '../../services/UserService';
	import Checkbox from "../../components/Checkbox.svelte";
	import ItemName from "../../components/Itemname.svelte";
	import GamesType from "../../components/GamesType.svelte";
	import gameservice from "../../services/GameService";
	import { goto } from "$app/navigation";
	import { Socket, io } from "socket.io-client";
	import Popup from "../../components/Popup.svelte";
	import type { GameTypeSelection } from "../../types/game";

    let socket : Socket;
    let user : User;
    let search_value : string = '';
    let friends : Array<User> = new Array;
    let search : Array<User> = new Array;
    let join : boolean = false;
    let hidePopup : boolean = true;
    let gameType : GameTypeSelection | null = null;
    let userSelection : User | null = null;
    let refresh : boolean = false;

    async function searchUser()
    {
        search = await userservice.searchUser(search_value);
    }

    async function startGame()
    {
        if (gameType == null) {

            hidePopup = false;

        } else {

            let game_id : number | null = await gameservice.create(user.id);

            if(game_id) {
                goto("/games/" + game_id);
            }

        }

    }

    function selectUser(event: CustomEvent)
    {
        if (!userSelection) {
            userSelection = event.detail;
        } else {
            if (userSelection.id == event.detail.id)
                userSelection = null;
            else
                userSelection = event.detail;
        }
        refresh = !refresh;
    }

    function isSelectedUser(user : User) : boolean
    {
        if(userSelection && userSelection.id == user.id) {
            return true;
        }
        else {
            return false;
        }

    }

    function joinMatchmakingGame()
    {
        join = !join;

        if (join) {
            socket.emit("joinMatchmakingGame", {user_id: user.id});
        } else {
            socket.emit("leaveMatchmakingGame", {user_id: user.id});
        }

    }

	onMount(async () => {

        // check if user is logged
        if(! await userservice.isLogged())
            await goto("/");

        socket = io('/events', {
                path: "/gamews/"
        });

        socket.on('gotoGame', (data : any) => {

            console.log('gotoGame', data);

            if (data.user_id == user.id)
                goto("/games/" + data.game_id);

        });

        user = await userservice.getCurrentUser();
        friends = await userservice.getFriends();

        async function test() {
            console.log(await userservice.isLogged());
        }

        test();

    });

    onDestroy(async () => {

        if (join) {
            socket.emit("leaveMatchmakingGame", {user_id: user.id});
        }

        socket.close();

    });

</script>


<NavBar user={user} />

{#if !hidePopup}
    <Popup on:closePopUp={() => { hidePopup = true }} title="Error" description="Please select a game type" ></Popup>
{/if}

<div class="h-full py-7 md:py-10 xl:py-10">

    <div class="lg:h-[85%] mx-[2%] self-center py-1">

        <div class="grid lg:grid-cols-12 h-full text-center align-middle m-1">

            <div class="relative lg:col-start-2 lg:col-span-10 screen shadow-lg shadow-black/50 bg-black/25 lg:overflow-auto rounded-3xl">
				<div class="absolute screen-overlay"></div>
                <div class="h-full lg:flex lg:flex-row">

                    <div class="relative lg:flex lg:w-1/3 mx-5">

						<div class="lg:flex lg:flex-col grow my-10 lg:ml-10 bg-thread-blue  rounded-xl">
							<h2 class="mt-10">Join server</h2>
                            <div class="lg:grow m-5 bg-color5 rounded-xl">

                                <div class="p-5">
                                    {#if join}

                                        Wait for a game...

                                    {:else}

                                        Press the button join to wait a game in matchmaking

                                    {/if}

                                </div>

                            </div>
                            <div class="p-5">

                                <button  on:click={joinMatchmakingGame} class="bg-color2 border-2 border-color2 px-8 py-1 w-full rounded-md text-black flex">
                                    <div class="flex items-center"><Checkbox disable={true} checked={join}></Checkbox></div>
                                    <div class="flex-grow">Join</div>
                                </button>

                            </div>
						</div>

					</div>

					<div class="relative lg:flex lg:w-2/3 mx-5">

						<div class="lg:flex lg:flex-col grow my-10 lg:mr-10 bg-thread-blue rounded-xl">
                            <h2 class="mt-10">New game</h2>
                            <div class="lg:grow m-5 grid grid-cols-2">

                                <div class="p-4 flex flex-col">

                                    <h2 class="flex space-x-2 text-left border-b-2 text-lg">
                                        <Icon icon="friends" />
                                        <span>Game type</span>
                                    </h2>

                                    <div class="mt-2 overflow-auto">
                                        <GamesType on:change={(event) => { gameType = event.detail.gameType }}></GamesType>
                                    </div>

                                </div>

                                <div class="p-4 flex flex-col">

                                    <h2 class="flex space-x-2 text-left border-b-2 text-lg">
                                        <Icon icon="friends" />
                                        <span>Friends (optional)</span>
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
                                                    {#key refresh}
                                                        <ItemName user={friend} on:userClicked={selectUser} checkbox={true} checked={isSelectedUser(friend)}></ItemName>
                                                    {/key}
                                                {/each}
                                            {/if}
                                        {:else}
                                            {#if  search.length <= 0}
                                                <p>no user found :/</p>  <!-- CREATE THIS -->
                                            {:else}
                                                {#each search as user}
                                                    {#key refresh}
                                                        <ItemName user={user} on:userClicked={selectUser} checkbox={true} checked={isSelectedUser(user)}></ItemName>
                                                    {/key}
                                                {/each}
                                            {/if}
                                        {/if}
                                    </div>
                                </div>

                            </div>

                            <div class="p-5">

                                <button on:click={startGame} class="bg-color2 border-2 border-color2 px-8 py-1 w-full rounded-md inline-block text-black">Start {#if gameType} {gameType.name} {#if userSelection} with {userSelection.name} {:else} with someone {/if} {/if}</button>

                            </div>


						</div>

					</div>


				</div>
            </div>

        </div>

    </div>

</div>
