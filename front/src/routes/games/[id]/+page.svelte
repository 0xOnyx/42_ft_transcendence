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

<NavBar user={user} />


<div class="h-full py-7 lg:py-10 xl:py-10">

    <div class="lg:h-[85%] mx-[2%] self-center py-1">

        <div class="grid lg:grid-cols-12 h-full text-center align-middle m-1">

            <div class="relative lg:col-start-2 lg:col-span-10 screen shadow-lg shadow-black/50 bg-black/25 lg:overflow-auto rounded-3xl">
				<div class="absolute screen-overlay"></div>
                <div class="h-full flex flex-col lg:flex-row">


                    <div class="lg:w-1/4 lg:flex lg:flex-col">

                        <div class="overflow-auto bg-color5 flex-grow rounded-xl">

                            <div  class="mt-20">

                                <UserInfo portal={true} user={userOne} />

                            </div>

                            <div>
								{#if userstats_user1}
								
	                                <UserStat userstats={userstats_user1}></UserStat>
								{/if}

                            </div>

                        </div>

                    </div>

                    <div class=" grow justify-around lg:flex lg:flex-col my-5 lg:my-0 lg:mx-5 xl:mx-8 overflow-auto rounded-xl -order-1 lg:order-none">

                        <canvas class="w-full"
                            bind:this={canvas}
                            width={800}
                            height={500}
                        ></canvas>

                    </div>

                    <div class="lg:w-1/4 lg:flex lg:flex-col">


                        <div class="overflow-auto bg-color5 flex-grow rounded-xl">

                            {#if userTwo}
                                <div class="mt-20">

                                    <UserInfo portal={true} user={userTwo} />

                                </div>

                                <div>

									{#if userstats_user2}						
	                                	<UserStat userstats={userstats_user2}></UserStat>
									{/if}


                                </div>

                            {/if}
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>


