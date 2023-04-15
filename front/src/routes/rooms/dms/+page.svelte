<script lang="ts">
    import Button from '../../../components/Button.svelte';
    import ItemRoom from '../../../components/Itemroom.svelte';
    import Message from '../../../components/message.svelte';

    import type { PageData } from '../dms/$types';

    import type {User} from '../../../types/user';
    import type {Room} from '../../../types/room';
    import  {RoomType} from '../../../types/room';
    import  {UserRole} from '../../../types/room';
    import  {MessageRole} from '../../../types/room';


    let search_value: string = "";

    let rooms : Array<Room> = [

        {
            id: 1,
            owner_id: 1,
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
            mesages: [
                {
                    id: 1,
                    room_id: 1,
                    user_id: 1,
                    message_type: MessageRole.MESSAGE,
                    content: 'Salut comment ça va ?',
                    created_at: new Date
                }
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
    let user : User;


    export let data: PageData;

</script>


<div class="h-full container md:py-10 xl:py-20 mx-auto">

    <div class="h-full bg-color3 self-center md:border-4 border-black rounded p-1 pb-3 xl:p-8">

        <div class="md:flex h-full text-center align-middle m-1">

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">


                <div class="mt-2 flex mb-5">

                    <div class="mt-2 flex-auto"><Button width="w-full" name="DM" url="/"></Button></div>
                    <div class="mt-2 px-2 flex-auto"><Button width="w-full" name="Private" url="/"></Button></div>
                    <div class="mt-2 flex-auto"><Button width="w-full" name="Public" url="/"></Button></div>

                </div>

                <div class="mt-2 flex mb-5">

                    <div class="mt-2 flex-grow"><Button width="w-full" name="new DM" url="/"></Button></div>

                </div>

                <h2 class="text-left border-b-2 text-lg">MD lists</h2>

                <div class="mt-2">

                    <input class="w-full rounded-2xl py-1 px-3 bg-color5" type="text" bind:value={search_value} placeholder="Search" on:keyup={searchUser}>

                </div>

                <div class="overflow-auto mt-3">

                    {#each rooms as room}
                        <ItemRoom room={room}></ItemRoom>
                    {/each}

                </div>

            </div>

            <div class="bg-color5 grow justify-around md:flex md:flex-col mx-5 xl:mx-8 overflow-auto">

                <div class="overflow-auto mt-3 flex-grow">

                    {#each rooms as room}
                        <Message room={room}></Message>
                    {/each}

                </div>

                <div class="flex items-center border-1 p-8">

                    <input type="text" class="border-2 bg-color5 rounded-md w-full p-2" />

                </div>

            </div>

            <div class="md:w-1/3 lg:w-1/4 md:flex md:flex-col">

                <h2 class="text-left border-b-2 text-lg">Friends lists</h2>

                <div class="mt-2">

                    <input class="w-full rounded-2xl py-1 px-3 bg-color5" type="text" bind:value={search_value} placeholder="Search" on:keyup={searchUser}>

                </div>

                <div class="overflow-auto mt-3 bg-color5 flex-grow">

                </div>

            </div>

        </div>

    </div>

</div>


