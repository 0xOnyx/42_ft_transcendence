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
	import { leftHanded } from "../../services/Stores";

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

            let user_two_id : undefined | number;

            if (userSelection) {
                user_two_id = userSelection.id;
            }

            let game_id : number | null = await gameservice.create(gameType.id, user.id, user_two_id);

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

            // console.log('gotoGame', data);

            if (data.user_id == user.id)
                goto("/games/" + data.game_id);

        });

        user = await userservice.getCurrentUser();
        friends = await userservice.getFriends();

        async function test() {
            // console.log(await userservice.isLogged());
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

{#if !hidePopup}
    <Popup on:closePopUp={() => { hidePopup = true }} title="Error" description="Please select a game type" ></Popup>
{/if}

<div class="flex-col">
	{#if user}
		<NavBar user={user} />
	{/if}
	<div class="flex landscape:py-0 md:py-10 xl:py-10">
		<div class="h-[80vh] grow  mobile-landscape:pb-2 mobile-landscape:h-screen w-full px-[5%] self-center grid overflow-visible">
			<div class="{$leftHanded ? 'mobile-landscape:pl-[3.75rem]' : 'mobile-landscape:pr-[3.75rem]'}">
				<div class="screen border-gray-700 shadow-lg shadow-black/50 bg-black/25 grow md:flex md:flex-col md:my-0 md:mx-5 xl:mx-8 mobile-landscape:m-1 overflow-auto rounded-xl ">
					<div class="screen-overlay"></div>
					<div class="relative grid mobile-landscape:grid-cols-3 lg:grid-cols-3">

						<div id="matchmaking" class="flex flex-col items-center ">
							<h2 class="mt-3 text-md sm:text-xl">Matchmaking</h2>
							<div id="joinBox" class="lg:grow text-xs md:text-xs xl:text-sm mx-5 my-3 bg-gray-700 lg:max-h-12 rounded-xl flex">
								<div class="p-3 text-center flex justiy-center items-center space-x-2">
									{#if join}
										<Icon icon="load" /><span>Waiting for a game...</span>
									{:else}
										Press join to enter matchmaking queue
									{/if}
								</div>
							</div>
							<div class="flex justify-center w-full">
								<button  on:click={joinMatchmakingGame} class="bg-gray-700/75 border-2 border-thread-blue shadow-thread-blue/50 shadow-lg hover:-translate-y-1 px-8 py-0.5 w-1/2 sm:w-1/3 md:w-1/2 mobile-landscape:w-1/2 rounded-lg items-center justify-center flex transition-all duration-200">
									<div class="flex items-center"><Checkbox disable={true} checked={join}></Checkbox></div>
									<div class="flex-grow m-1">Join</div>
								</button>
							</div>
						</div>

						<div class=" mobile-landscape:hidden lg:hidden border-b-2 border-gray-700 mx-4 sm:mx-10 mt-5"></div>

						<div id="customGame" class="flex flex-col items-center mobile-landscape:h-[22rem] overflow-auto overscroll-contain mobile-landscape:col-span-2 lg:col-span-2">
							<h2 class="mt-3 text-md sm:text-xl">New Custom Game</h2>
							<div id="newgameBox" class="sm:h-80 lg:h-[30rem] mobile-landscape:max-h-80 grow mx-5 mt-3 bg-gray-700 overflow-auto rounded-xl grid sm:grid-cols-2">

								<div class="p-4 pb-0 pt-2 flex flex-col">
									<h2 class="flex space-x-2 text-left min-h-[20px] items-center text-sm">
										<Icon icon="game" />
										<span>Game type</span>
									</h2>
									<div class="border-t-2 pt-2 mt-2 overflow-auto">
										<GamesType on:change={(event) => { gameType = event.detail.gameType }}></GamesType>
									</div>
								</div>

								<div class="p-4 pt-2 flex h-full flex-col">

									<h2 class="flex space-x-2 text-left min-h-[20px] items-center text-sm">
										<Icon icon="friends" />
										<span>Friends (optional)</span>
									</h2>

									<div id="search" class="border-t-2 py-3 mt-2 pb-5 masked-overflow overscroll-contain">
                                        {#if friends.length <= 0}
                                            <p>NO FRIEND</p>  <!-- CREATE THIS -->
                                        {:else}
                                            {#each friends as friend}
                                                {#key refresh}
                                                    <ItemName user={friend} on:userClicked={selectUser} checkbox={true} checked={isSelectedUser(friend)}></ItemName>
                                                {/key}
                                            {/each}
                                        {/if}
									</div>
								</div>
							</div>

							<div class="px-5 py-4">
								<button on:click={startGame} class="border-2 {gameType && gameType.id ==="BLACKHOLE" ? 'border-orange-500 shadow-orange-500/50 text-orange-500 bg-color5' : 'border-thread-blue shadow-thread-blue/50 bg-gray-700/75'} {gameType ? 'text-xs lg:text-lg px-4 lg:px-8' : 'text-lg px-8'} shadow-lg hover:-translate-y-1 py-1 w-full rounded-md items-center flex transition-all duration-200 justify-center">Start {#if gameType} {gameType.name} {#if userSelection} with {userSelection.name} {:else} with someone {/if} {/if}</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
