<script lang="ts">
    import {io, type Socket} from "socket.io-client";
    import type {User, UserStats} from '../../../types/user';
	import UserStat from '../../../components/UserStat.svelte';
	import UserInfo from '../../../components/UserInfo.svelte';
	import NavBar from '../../../components/NavBar.svelte';
    import Pong, { GameStatus } from "../../../pong/src/classic/pong";
	import PongBlackhole from "../../../pong/src/classic/pong.blackhole";
    import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import gameservice from "../../../services/GameService";
	import userservice from "../../../services/UserService";
	import { goto } from "$app/navigation";
	import { GameType, type Game } from "../../../types/game";
	import Icon from "../../../components/Icon.svelte";
	import { leftHanded } from "../../../services/Stores";
	import History from "../../../components/History.svelte";
	import type { GameHistory } from "../../../types/user";
	import { fade } from "svelte/transition";
	import IconButton from "../../../components/IconButton.svelte";

    let socket : Socket;
    let canvas : HTMLCanvasElement;

    let game : any;
    let user : User;
    let pong : Pong | undefined;
    let internal : any = null;

    let userstats_user1 : UserStats | undefined;
	let userstats_user2 : UserStats | undefined;

    let userOne : User;
    let userTwo : User;
	let historyOne : Boolean = false;
	let historyTwo : Boolean = false;
	let gamehistoryOne : GameHistory[] = [];
	let gamehistoryTwo : GameHistory[] = [];

	onMount(async () => {

        // check if user is logged
        if(! await userservice.isLogged())
            await goto("/");

        socket = io('/events', {
                path: "/gamews/"
        });

        user = await userservice.getCurrentUser();
        game = await gameservice.get(parseInt($page.params.id));

        if (game != null && user != null)
        {
            socket.emit("joinGame", {game_id: $page.params.id, user_id: user.id})

            socket.on("joinGame", async (game : Game) => {

                if (game.player_one_id === user.id) {
                    userOne = user;
                } else {
                    if (game.player_one_id) {
                        userOne = await userservice.getUser(game.player_one_id);
                    }
                }

                if (game.player_two_id === user.id) {
                    userTwo = user;
                } else {
                    if (game.player_two_id) {
                        userTwo = await userservice.getUser(game.player_two_id);
                    }
                }

				userstats_user1 = await userservice.getStats(userOne.id);
				userstats_user2 = await userservice.getStats(userTwo.id);
				gamehistoryOne = await userservice.getHistory(userOne.id);
				gamehistoryTwo = await userservice.getHistory(userTwo.id);


            });

            // console.log(game);

            if (game.map_type == GameType.CLASSIC) {
                pong = <Pong>(new Pong(800, 500, canvas.getContext('2d'), socket));
            }
            if (game.map_type == GameType.BLACKHOLE) {
                pong = <Pong>(new PongBlackhole(800, 500, canvas.getContext('2d'), socket));
            }

            if (pong)
            {
                if (game.player_one_id === user.id) {
                    pong.setPlayerController(0);
                }
                if (game.player_two_id === user.id) {
                    pong.setPlayerController(1);
                }

                pong.connectGame(parseInt($page.params.id));

                pong.run();

                pong.addChangeListener((pong : Pong) => {

                    if (pong.status == GameStatus.FINISHED) {
                        if (pong.controllers.space()) {
                            goto('/games');
                        }
                    }

                });

                socket.on('eventGame', (data : any) => {
                    pong?.setNetworkMessage(data);
                });

                user = await userservice.getCurrentUser();

            }

        }

	});

    onDestroy(async () => {

        if (pong)
        {
            if (pong.players[0].connected == false && pong.players[1].connected == false)
            {
                pong.stop();
            }
        }

        socket.emit("leaveGame", {game_id: $page.params.id});

        socket.close();

    });
	async function ReturnPortal() {
		await goto('/games');
	}

</script>

<div class="flex-col">
	{#if user}
		<NavBar user={user} />
	{/if}
	<div class="flex py-2 landscape:py-0 md:py-10 xl:py-10">
		<div class="h-[80vh] grow mobile-landscape:pb-2 mobile-landscape:h-screen w-full px-[5%] self-center py-1 grid overflow-auto">
			<div class="{$leftHanded ? 'mobile-landscape:pl-[3.75rem]' : 'mobile-landscape:pr-[3.75rem]'}">
				<div class="grid h-full text-center align-middle m-1">
					<div class="relative border-gray-700 screen shadow-lg shadow-black/50 bg-black/25 overflow-hidden grid rounded-3xl grid-rows-3 sm:grid-rows-1 sm:grid-cols-10 mb-5">
						<div class="absolute screen-overlay"></div>
						
						{#if !game}
						<div class="relative z-[100] self-center row-start-2 sm:row-start-1 sm:col-start-5 sm:col-span-2 flex flex-col text-lg space-y-2">
							<div>This game does not exist</div>
							<IconButton icon="left-arrow" title="Return" on:buttonClick={ReturnPortal} />
						</div>
						{/if}
						{#if userOne}
						<div id="userOne" class="relative row-start-1 sm:col-start-1 sm:row-start-1 sm:col-span-2 lg:flex lg:flex-col">
							<div class="overflow-auto bg-color5 sm:h-full pb-5 grid grid-cols-2 sm:grid-cols-1 sm:flex-grow rounded-2xl rounded-b-none sm:rounded-r-none">
								<div  class="mt-5 sm:mt-20 mobile-landscape:mt-10">
										<UserInfo user={userOne} />
								</div>
								<div class="mt-5">
									{#if userstats_user1}
										{#if historyOne}
										<div in:fade="{{ delay: 200, duration: 400 }}">
											{#if gamehistoryOne}
												<History curUser={userOne} gamehistory={gamehistoryOne} />
											{:else}
												<p>No games played</p>
											{/if}
											<div class="flex justify-center">
												<button on:click={()=> {historyOne = false}} class="flex gap-2"><Icon icon="left-arrow"/>Return</button>
											</div>
										</div>
										{:else}
										<UserStat userstats={userstats_user1} on:showHistory={() => {historyOne = true}}></UserStat>
										{/if}
									{/if}
								</div>
							</div>
						</div>
						{/if}

						<div class="relative m-auto items-center justify-center row-start-2 sm:row-start-1 sm:col-start-3 sm:col-span-6 -order-1 lg:order-none">
							<canvas class="relative w-full"
								bind:this={canvas}
								width={800}
								height={500}
							></canvas>
						</div>

						{#if userTwo}
							<div id="userTwo" class="relative self-end sm:self-stretch sm:self-autosm:col-start-9 sm:col-span-2 lg:flex lg:flex-col">
								<div class="overflow-auto bg-color5 pb-5 sm:h-full grid grid-cols-2 sm:grid-cols-1 sm:flex-grow rounded-2xl rounded-t-none sm:rounded-l-none">
									<div class="mt-5 sm:mt-20 mobile-landscape:mt-10">
											<UserInfo user={userTwo} />
									</div>
									<div class="mt-5">
										{#if userstats_user2}
											{#if historyTwo}
											<div in:fade="{{ delay: 200, duration: 400 }}">
												{#if gamehistoryTwo}
													<History curUser={userTwo} gamehistory={gamehistoryTwo} />
												{:else}
													<p>No games played</p>
												{/if}
												<div class="flex justify-center">
													<button on:click={()=> {historyTwo = false}} class="flex gap-2"><Icon icon="left-arrow"/>Return</button>
												</div>
											</div>
											{:else}
											<UserStat userstats={userstats_user2} on:showHistory={() => {historyTwo = true}}></UserStat>
											{/if}
										{/if}
									</div>
								</div>
							</div>
						{/if}

					</div>
				</div>
			</div>
		</div>
	</div>
</div>

