<script lang="ts">
	import type { User } from '../types/user';
    import type {Messages} from "../types/room";
    import {MessageRole} from '../types/room'
    import MessageContent from "./MessageContent.svelte";
    import MessageInvite from "./MessageInvite.svelte";
    import MessageGame from "./MessageGame.svelte";
    import {Socket} from "socket.io-client";

    //bg-green-600
    export let user : User;
    export let socket: Socket;
    export let message:  (Messages & {user: User})[];

</script>

{#if message.length <= 0}
    <p>NO MESSAGE</p>
{:else}
    {#each message as current_message}

        <div class="flex mt-3">
            {#if current_message.message_type === MessageRole.MESSAGE}
                <MessageContent current_message={current_message} user={user}></MessageContent>
            {:else if current_message.message_type === MessageRole.ADD_FRIEND}
                <MessageInvite current_message={current_message} user={user} socket={socket}></MessageInvite>
            {:else if current_message.message_type === MessageRole.INVITE_GAME}
                <MessageGame current_message={current_message} user={user}></MessageGame>
            {/if}
        </div>

    {/each}
    {/if}
