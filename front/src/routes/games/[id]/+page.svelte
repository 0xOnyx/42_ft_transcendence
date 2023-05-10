<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";
    import {io, type Socket} from "socket.io-client";
    import type {User, UserStats} from '../../../types/user';
	import UserStat from '../../../components/UserStat.svelte';
	import UserInfo from '../../../components/UserInfo.svelte';
	import NavBar from '../../../components/NavBar.svelte';
    import Pong from "../../../pong/src/classic/pong";
    import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import type { NetMessage } from "../../../pong/src/classic/message";
	import gameservice from "../../../services/GameService";
	

    let socket : Socket;
    let canvas : HTMLCanvasElement;

    let game : any;
    let user : User = { id: 1, name: 'Jacob Jones', image_url: 'image/default.png' };

    let userstats : UserStats = {
        played : 42,
        win: 5,
        ratio: 84,
        league: '',
        level: 21
    }

	onMount(async () => {

        let game = await gameservice.get($page.params.id);

        socket = io('/events', {
                path: "/gamews/"
        });

        socket.emit("joinGame", {game_id: $page.params.id})

        let pong : Pong = (new Pong(800, 500, canvas.getContext('2d'))).setSocket(socket);
        pong.init();
        
        socket.on('game_' + <string>$page.params.id, (netMessage : NetMessage) => {
            console.log(netMessage);
            pong.setNetworkMessage(netMessage);
        });
        
        setTimeout(() => pong.gameLoop(), 1000 / 60);
        
	});

    onDestroy(async () => {

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

                                <UserInfo portal={true} user={user} />

                            </div>

                            <div>

                                <UserStat userstats={userstats}></UserStat>

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

                            <div class="mt-20">

                                <UserInfo portal={true} user={user} />

                            </div>

                            <div>

                                <UserStat userstats={userstats}></UserStat>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>


