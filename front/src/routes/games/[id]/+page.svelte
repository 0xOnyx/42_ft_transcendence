<script lang="ts">
    import Message from '../../../components/Message.svelte';
    import Icon from '../../../components/Icon.svelte';

    import {Status, type User} from '../../../types/user';
    import type {UserStats} from '../../../types/user';
    import {MessageRole, type Messages, type Rooms} from '../../../types/room';
    import  {UserRole, RoomType} from '../../../types/room';
	import UserNotification from '../../../components/UserNotification.svelte';
	import UserStat from '../../../components/UserStat.svelte';
	import UserInfo from '../../../components/UserInfo.svelte';
	import NavBar from '../../../components/NavBar.svelte';

    import Pong from '../../../pong/classic/pong';

    import type { PageData } from './$types';
	import { onMount } from 'svelte';


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
        ratio: 84,
        league: '',
        level: 21
    }


	onMount(async () => {
        let pong : Pong = new Pong();
        pong.run();
	});

    let _openUpdate : boolean = false; 
    let _openFile : boolean = false; 

	const updatePopUp = ( _popup : string ) => {
		if (_popup === "update") {
			_openUpdate = !_openUpdate;
		} else if ( _popup === "file" ) {
			_openFile = !_openFile;
		}
	}


</script>

<NavBar user={user} />

<div class="h-[85%] container md:py-10 xl:py-20 mx-auto">

    <div class="h-full bg-color3 self-center md:border-4 border-black rounded p-1 pb-3 xl:p-8">

        <div class="md:flex h-full text-center align-middle m-1">

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">

                <div class="overflow-auto bg-color5 flex-grow rounded-xl">

                    <div  class="mt-20">

                        <UserInfo portal=true user={user} update={updatePopUp} />

                    </div>

                    <div>

                        <UserStat userstats={userstats}></UserStat>

                    </div>

                </div>

            </div>

            <div class="bg-color5 grow justify-around md:flex md:flex-col my-5 md:my-0 md:mx-5 xl:mx-8 overflow-auto rounded-xl">

                <canvas class="w-full" id="pong" width="800" height="500">
                </canvas >

            </div>

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">


                <div class="overflow-auto mt-3 bg-color5 flex-grow rounded-xl">

                    <div class="mt-20">
                        
                        <UserInfo portal=true user={user} update={updatePopUp} />
                        
                    </div>

                    <div>

                        <UserStat userstats={userstats}></UserStat>

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>


