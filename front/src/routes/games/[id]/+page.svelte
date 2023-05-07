<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";
    import {io, Socket} from "socket.io-client";

    import {Status, type User} from '../../../types/user';
    import type {UserStats} from '../../../types/user';
    import {MessageRole, type Messages, type Rooms} from '../../../types/room';
    import  {UserRole, RoomType} from '../../../types/room';
	import UserStat from '../../../components/UserStat.svelte';
	import UserInfo from '../../../components/UserInfo.svelte';
	import NavBar from '../../../components/NavBar.svelte';

    import Pong from "../../../../../pong/src/classic/pong";

    import type { PageData } from './$types';
	import { onMount } from 'svelte';

    let socket : Socket = io('/events', {
            path: "/api/gamews/"
    });
    let canvas : HTMLCanvasElement;
    let search_value: string = "";
    let connectedWs: Boolean = true;
    let room_message: (Messages & {user: User})[]= [
        {
            "id": 1,
            "room_id": 40,
            "user_id": 1,
            "message_type": MessageRole.MESSAGE,
            "content": "asdf",
            "created_at": "2023-04-18T14:50:05.942Z",
            "user": {
                "id": 1,
                "name": "jer",
                "email": "jerdos-s@student.42lausanne.ch",
                "first_name": "Jérémy",
                "last_name": "Dos santos",
                "image_url": "image/jerdos-s.png",
                "oauth_42_login": "jerdos-s",
                "oauth_42_id": 116337,
                "last_login": "2023-04-17T15:44:38.719Z",
                "online_status": Status.ONLINE
            }
        },
        {
            "id": 2,
            "room_id": 40,
            "user_id": 1,
            "message_type": MessageRole.MESSAGE,
            "content": "asdf",
            "created_at": "2023-04-18T14:50:06.709Z",
            "user": {
                "id": 1,
                "name": "jer",
                "email": "jerdos-s@student.42lausanne.ch",
                "first_name": "Jérémy",
                "last_name": "Dos santos",
                "image_url": "image/jerdos-s.png",
                "oauth_42_login": "jerdos-s",
                "oauth_42_id": 116337,
                "last_login": "2023-04-17T15:44:38.719Z",
                "online_status": Status.ONLINE
            }
        },
    ];


    let rooms : Array<Rooms> = [

        {
            id: 1,
            owner_id: 1,
            name: "Room 1",
            type: RoomType.SINGLE_CHAT,
            last_message_id: 4,
            count_messages: 2,
            users: [
                {
                    id: 1,
                    room_id: 1,
                    user_id: 1,
                    role: UserRole.ADMIN,
                    user: {
                        id: 1,
                        name: 'Jacob Jones',
                        image_url: 'image/default.png'
                    }
                },
        		{
                    id: 2,
                    room_id: 1,
                    user_id: 2,
                    role: UserRole.USER,
                    user: {
                        id: 2,
                        name: 'Leslie Alexander',
                        image_url: 'image/default.png'
                    }
                },
            ],

        }
    ]

    let user : User = { id: 1, name: 'Jacob Jones', image_url: 'image/default.png' };

    let userstats : UserStats = {
        played : 42,
        win: 5,
        ratio: 84,
        league: '',
        level: 21
    }

	onMount(async () => {

        socket = io('/events', {
                path: "/api/gamews/"
        });

        let pong : Pong = new Pong(800, 500, canvas.getContext('2d'));
        pong.run();

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


