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


            });

            console.log(game);

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

</script>

<div class="flex-col">
	{#if user}
		<NavBar user={user} />
	{/if}
	<div class="flex py-2 landscape:py-0 md:py-10 xl:py-10">
		<div class="h-[80vh] grow mobile-landscape:pb-2 mobile-landscape:h-screen w-full px-[5%] self-center py-1 grid overflow-auto">
			<div class="{$leftHanded ? 'mobile-landscape:pl-[3.75rem]' : 'mobile-landscape:pr-[3.75rem]'}">
				<div class="grid h-full text-center align-middle m-1">
					<div class="relative border-gray-700 screen shadow-lg shadow-black/50 bg-black/25 overflow-hidden rounded-3xl grid grid-rows-3 sm:grid-rows-1 sm:grid-cols-10 mb-5">
						<div class="absolute screen-overlay"></div>
						
						<div id="userOne" class="relative row-start-1 sm:col-start-1 sm:row-start-1 sm:col-span-2 lg:flex lg:flex-col">
							<div class="overflow-auto bg-color5 sm:h-full pb-5 grid grid-cols-2 sm:grid-cols-1 sm:flex-grow rounded-2xl rounded-b-none sm:rounded-r-none">
								<div  class="mt-5 sm:mt-20 mobile-landscape:mt-10">
									{#if userOne}
										<UserInfo user={userOne} />
									{/if}
								</div>
								<div class="mt-5">
									{#if userstats_user1}
										<UserStat userstats={userstats_user1}></UserStat>
									{/if}
								</div>
							</div>
						</div>

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
											<UserStat userstats={userstats_user2}></UserStat>
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

