<script lang="ts">
	import type { User } from '../types/user';
    import type {Messages} from "../types/room";
    import {MessageRole} from '../types/room'
    import MessageContent from "./MessageContent.svelte";
    import MessageInvite from "./MessageInvite.svelte";
    import MessageGame from "./MessageGame.svelte";
    import {Socket} from "socket.io-client";
	import { afterUpdate, onMount, tick } from 'svelte';

    //bg-green-600
    export let user : User;
    export let socket: Socket;
    export let message:  (Messages & {user: User})[];

	let lastMessage : HTMLDivElement;
	let firstMessage : HTMLDivElement;
	let scrollContainer : HTMLDivElement;

	async function scrollToLastMessage() {
		scrollContainer.scrollTop = scrollContainer.scrollHeight
    }

	onMount( () => {
		scrollToLastMessage();
	});

	afterUpdate( () => { 
		scrollToLastMessage();
	});

</script>

<style>
	.scroll-container {
        overflow-x: hidden;
        overflow-y: auto;
        scroll-behavior: smooth;
        height: 100%;
    }
</style>

{#if message.length <= 0}
    <p class="pt-4">NO MESSAGE</p>
{:else}
	<div class="scroll-container masked-overflow" bind:this={scrollContainer}>
    {#each message as current_message, i}

        <div class="flex mt-3 pt-3">
            {#if current_message.message_type === MessageRole.MESSAGE}
                <MessageContent current_message={current_message} user={user}></MessageContent>
            {:else if current_message.message_type === MessageRole.ADD_FRIEND}
                <MessageInvite current_message={current_message} user={user} socket={socket}></MessageInvite>
            {:else if current_message.message_type === MessageRole.INVITE_GAME}
                <MessageGame current_message={current_message} user={user}></MessageGame>
            {/if}
        </div>
		{#if i === 0}
			<div bind:this={firstMessage} class=""></div>
		{:else if i === message.length - 1}
			<div bind:this={lastMessage} class="pb-4 md:pb-6"></div>
		{/if}

    {/each}
	</div>
{/if}
