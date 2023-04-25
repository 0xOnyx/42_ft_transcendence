<script lang="ts">
    import Button from "./Button.svelte";
    import {Socket} from "socket.io-client";
    import type {User} from "../types/user";

    export let socket: Socket;
    export let user: User;
    async function BlockUser()
    {
        console.log("OK")

        socket.emit("blockUser", {
            user_id: user.id,
        })
    }

</script>

<div on:click={BlockUser} class="mt-12"><Button width="w-52" name="Block User" ></Button></div>
