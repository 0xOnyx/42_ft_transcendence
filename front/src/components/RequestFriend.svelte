<script lang="ts">
    import Button from "./Button.svelte";
    import {Socket} from "socket.io-client";
    import type {User} from "../types/user";
    import type {Rooms} from "../types/room"
    import {MessageRole} from "../types/room";

    export let socket: Socket;
    export let user: User;
    export let room: Rooms
    async function createInvite()
    {
        console.log("OK")

        socket.emit("message", {
            room_id: room.id,
            message: "",
            message_type: MessageRole.ADD_FRIEND,
        })
    }

</script>

<div  on:click={createInvite} class="mt-12"><Button width="w-52" name="Send Friend Request" ></Button></div>
