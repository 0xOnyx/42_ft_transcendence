<script lang="ts">

    import type {Rooms, RoomUser} from "../types/room";
    import {goto} from "$app/navigation"
    import {Socket} from "socket.io-client";

    //bg-green-600
    export let all_channels: Rooms[];
    export let channel : Rooms;
    export let io: Socket;
    export let requestPassword: Function;



    async function getRoom()
    {
        console.log(all_channels);
        if (all_channels.find(item=>item.id == channel.id))
            await goto(`/rooms/channel/${channel.id}`);
        else
        {
            if (channel.password && channel.password.length > 0)
            {
                requestPassword(channel.id);
            }
            else {
                io.emit("joinRoomPublic", {room_id: channel.id}, (rooms) => {
                    if (rooms)
                        goto(`/rooms/channel/${rooms.id}`);
                })
            }
        }
    }
</script>

<div on:click={getRoom} class="cursor-pointer rounded-xl bg-color5 p-5 flex items-center mt-1">

    <div class="mx-2 flex-shrink">
        <div class="w-[40px] h-[40px] bg-cover  rounded-full mx-auto"
             style="background-image: url( /{'image/group.png'} )">
        </div>

    </div>

    <div class="mx-2 flex-grow text-left">
        {channel?.name || "loading.."}
        {channel.password ? "🔒" : ""}
    </div>


</div>
