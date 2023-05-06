<script lang="ts">
    import Button from "./Button.svelte";
    import {Socket} from "socket.io-client";
    import type {User} from "../types/user";

    export let socket: Socket;
    export let user: User;
    async function DeleteInvite()
    {
        socket.emit("deleteFriend", {
            user_id: user.id,
        })
    }

</script>

<div  on:click={DeleteInvite} class="mt-12"><Button width="w-52" name="Remove Friend" ></Button></div>
