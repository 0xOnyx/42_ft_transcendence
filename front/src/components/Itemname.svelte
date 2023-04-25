<script lang="ts">

    import type {User} from '../types/user';
    import type {Rooms, RoomUser} from "../types/room";
    import {Status} from '../types/user';
    import {PUBLIC_API_URI} from "$env/static/public";
    import {goto} from "$app/navigation"
    import {Socket} from "socket.io-client";

    //bg-green-600
    export let user : User;
    export let io: Socket;

    function getColor(status: Status)
    {
        if (status == Status.OFFLINE)
            return "bg-zinc-600";
        else if (status == Status.HIDDEN)
            return "bg-rose-600";
        else if (status == Status.ONLINE)
            return "bg-green-600";
    }

    async function getRoom()
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/message/getDmUser/${user.id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log(res.status)
        let rooms: (Rooms & { user: RoomUser[] }) | undefined;
        if (res.status == 204)
        {
            io.emit("createDm", {user_id: user.id}, (rooms) => {
                console.log(rooms)
                if (rooms)
                    goto(`/rooms/dms/${rooms.id}`);
            })
        }
        if (res.status == 200) {
            rooms = await res.json();
            if (rooms)
                await goto(`/rooms/dms/${rooms.id}`);

        }
    }
</script>

<div on:click={getRoom} class="cursor-pointer rounded-xl bg-color5 p-5 flex items-center mt-1">

    <div class="mx-2 flex-shrink">
        <div class="w-[40px] h-[40px] bg-cover  rounded-full mx-auto"
             style="background-image: url( /{user?.image_url || `image/default.png`} )">
        </div>

    </div>

    <div class="mx-2 flex-grow text-left">
        {user.name}
    </div>
    {#if user?.online_status}
        <div class="mx-2">
            <div class="h-4 w-4 rounded-full {getColor(user.online_status)}"></div>
        </div>
    {/if}

</div>
