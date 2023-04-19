<script lang="ts">
    import Button from '../../../components/Button.svelte';
    import ItemRoom from '../../../components/ItemRoom.svelte';
    import Message from '../../../components/Message.svelte';
    import Icon from '../../../components/Icon.svelte';

    import type {User} from '../../../types/user';
    import type {UserStats} from '../../../types/user';
    import type {Room} from '../../../types/room';
    import  {RoomType} from '../../../types/room';
    import  {UserRole} from '../../../types/room';
    import  {MessageRole} from '../../../types/room';
	import UserNotification from '../../../components/UserNotification.svelte';
	import UserStat from '../../../components/UserStat.svelte';
	import UserInfo from '../../../components/UserInfo.svelte';
	import ItemRoomUser from '../../../components/ItemRoomUser.svelte';

    import Pong from '../../../pong/classic/pong';

    import type { PageData } from './$types';
	import { onMount } from 'svelte';


    let search_value: string = "";

    let rooms : Array<Room> = [

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
                        image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_white_icon_156940.png'
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
                        image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_red_icon_156942.png'
                    }
                },
            ],
            messages: [
                {
                    id: 1,
                    room_id: 1,
                    user_id: 1,
                    message_type: MessageRole.MESSAGE,
                    content: 'Salut comment ça va ?',
                    created_at: new Date
                },
                {
                    id: 2,
                    room_id: 1,
                    user_id: 2,
                    message_type: MessageRole.MESSAGE,
                    content: 'Bien et toi ?',
                    created_at: new Date
                },
                {
                    id: 3,
                    room_id: 1,
                    user_id: 1,
                    message_type: MessageRole.MESSAGE,
                    content: 'Je fais tout pour préparer les templates...',
                    created_at: new Date
                },
                {
                    id: 2,
                    room_id: 1,
                    user_id: 2,
                    message_type: MessageRole.MESSAGE,
                    content: 'Ok, c\'est cool',
                    created_at: new Date
                },

            ],
        }
    ]

    let friends : Array<User> = [
		{ id: 1, name: 'Jacob Jones', image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_white_icon_156940.png' },
		{ id: 2, name: 'Leslie Alexander', image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_red_icon_156942.png' },
		{ id: 3, name: 'Eleanor Pena', image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_blue_icon_156941.png'},
        { id: 4, name: 'Wade Warren', image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_orange_icon_156939.png'},
        { id: 5, name: 'Kathryn Murphy', image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_pink_icon_156938.png'},
        { id: 6, name: 'Marvin McKinney', image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_green_icon_156937.png'},
    ];

    let user : User = { id: 1, name: 'Jacob Jones', image_url: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_white_icon_156940.png' };

    let userstats : UserStats = {
        played : 42,
        ratio: 84,
        level: 21
    }
    export let data: PageData;


	onMount(async () => {
        let pong : Pong = new Pong();
        pong.run();
	});


</script>


<div class="h-full container md:py-10 xl:py-20 mx-auto">

    <div class="h-full bg-color3 self-center md:border-4 border-black rounded p-1 pb-3 xl:p-8">

        <div class="md:flex h-full text-center align-middle m-1">

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">

                <div class="overflow-auto bg-color5 flex-grow rounded-xl">

                    <UserInfo user={user}></UserInfo>

                    <div>

                        <UserStat userstats={userstats}></UserStat>

                    </div>

                </div>

            </div>

            <div class="bg-color5 grow justify-around md:flex md:flex-col my-5 md:my-0 md:mx-5 xl:mx-8 overflow-auto rounded-xl">

                <canvas id="pong" width="800" height="500">
                </canvas >

                <div class="overflow-auto mt-3 flex-grow px-5">

                    {#each rooms as room}
                        <Message user={user} room={room}></Message>
                    {/each}

                </div>

                <div class="flex items-center border-1 p-8">

                    <input type="text" class="border border-white bg-color5 rounded-md w-full p-2 pr-12 focus:outline-none" />
                    <div class="relative">
                        <button class="-top-4 -left-10 absolute bg-color2 p-0 m-0 rounded-xl"><Icon icon="send" css="inline p-0 h-8 stroke-color2 fill-white"></Icon></button>
                    </div>

                </div>

            </div>

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">

                <UserNotification user={user}></UserNotification>

                <div class="overflow-auto mt-3 bg-color5 flex-grow rounded-xl">

                    <UserInfo user={user}></UserInfo>

                    <div>

                        <UserStat userstats={userstats}></UserStat>

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>


