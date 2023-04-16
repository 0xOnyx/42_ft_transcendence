<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";

    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {io, Socket} from "socket.io-client";

    interface UserStats {
        played: number,
        ratio: number,
        level: number,
    }

    let Status: {
        ONLINE: 'ONLINE',
        OFFLINE: 'OFFLINE',
        HIDDEN: 'HIDDEN'
    };
    type Status = (typeof Status)[keyof typeof Status]
    type User =
        {
            id: number,
            name?: string,
            email?: string,
            first_name?: string,
            last_name?: string,
            image_url?: string,
            oauth_42_login?: string,
            oauth_42_id?: number,
            last_login?: Date,
            online_status?: Status,
        }
    type Friend = {
        id: number
        user_id: number
        friend_id: number
        request_at: Date
        accept_at: Date | null
    }

    type Rooms = {
        id: number
        owner_id: number
        type: TypeRoom
        password: string | null
        last_message_id: number
        count_messages: number
    }

    type RoomUser = {
        id: number
        room_id: number
        user_id: number
        role: RoleUser
        ban: boolean
        mute: boolean
        term_penalty: Date
        last_message_read_id: number | null
        count_read_messages: number
    }



    let search_value: string = "";
    let search : User[] = [];
    let friends : User[] = [];
    let rooms: Rooms[] = [];
    let roomsUser: RoomUser[] = [];
    let user : User;
    let connectedWs: Boolean = false;
    let socket: Socket ;



    async function searchUser()
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/user/search?skip=0&take=10&element=name&value=${search_value}`, {
            method: 'GET',
            credentials: 'include'
        });
        search = await res.json();
    }
    onMount(async () => {

        let res: Response = await fetch(`${PUBLIC_API_URI}/auth/islogged`, {
            method: 'GET',
            credentials: 'include'
        });
        res = await res.json();
        if (!res)
            await goto("/")

        res = await fetch(`${PUBLIC_API_URI}/user/friend`, {
            method: 'GET',
            credentials: 'include'
        });

        const friends_list: Friend[] = (await res.json()).friend;


        res = await fetch(`${PUBLIC_API_URI}/user/id/me`, {
            method: 'GET',
            credentials: 'include'
        });
        user = await res.json();

        for (const item of friends_list) {
            try {
                let id =  item.friend_id === user.id ? item.user_id : item.friend_id
                const res: Response = await fetch(`${PUBLIC_API_URI}/user/id/${id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const new_friend: User = (await res.json());
                friends.push(new_friend)
            }
            catch (err)
            {
                console.error(err);
            }
        }

        res = await fetch(`${PUBLIC_API_URI}/message/rooms`, {
            method: 'GET',
            credentials: 'include'
        });
        rooms = await res.json();


        socket = io('/events', {
            path: "/ws/"
        });

        socket.on("connection", (data) => {
            connectedWs = true;
        })


        socket.on("FriendStatusUdpate", (data: {id: number, status: Status})=>{
            const index = friends.findIndex((element: Friend)=> element.id == data.id)
            friends[index].online_status = data.status;
        })

    })


    let error : string = ""

    //export let data: PageData;

</script>

<svelte:head>
    <script>
        window.jdenticon_config = {
            hues: [207],
            lightness: {
                color: [0.84, 0.84],
                grayscale: [0.84, 0.84]
            },
            saturation: {
                color: 0.48,
                grayscale: 0.48
            },
            backColor: "#383683"
        };
    </script>
</svelte:head>

<div class="h-full container md:py-10 xl:py-20 mx-auto">

    <div class="h-full bg-color3 self-center md:border-4 border-black rounded p-1 pb-3 xl:p-8">

        <div class="md:flex h-full text-center align-middle m-1">

            <div class="bg-color5 grow justify-around lg:flex mr-2 xl:mr-8 overflow-auto p-5">

            </div>
        </div>

    </div>

</div>





