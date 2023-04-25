<script lang="ts">
    import type {Messages} from "../types/room";
    import type {User} from "../types/user";
    import DateElement from "./DateElement.svelte";
	import Button from "./Button.svelte"
    import {Socket} from "socket.io-client";

    export let current_message: (Messages & {user: User});
    export let user: User;
    export let socket: Socket

    async function acceptFriend()
    {
        console.log("acceptFriend");
        socket.emit("acceptFriend", {id: Number(current_message.content), message_id: current_message.id, room_id: current_message.room_id})
    }

</script>

{#if current_message.content === "Accepted"}
	{#if user.id === current_message.user_id}

	<div class="flex-grow">

		<div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right flex">
			<div class="flex-1">They accepted the friend request</div>
			<!-- {current_message.content} -->
		</div>

		<div class="text-right pr-5">
			{#if current_message.create_at}
				<DateElement created_at={new Date(current_message.create_at)}></DateElement>
			{:else}
				loading..
			{/if}
		</div>

	</div>

	<div class="mr-3 mt-3">



		<div class="w-10 h-10 bg-cover  rounded-full mx-auto"
			style="background-image: url( /{user?.image_url || 'image/default.png'} )">
		</div>

	</div>

	{:else}

	<div class="ml-3 mt-3">



		<div class="w-10 h-10 bg-cover  rounded-full mx-auto"
			style="background-image: url( /{current_message?.user.image_url || 'image/default.png'} )">
		</div>
	</div>

	<div class="flex-grow">

		<div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right flex">
			<div class="flex-1">You accepted the friend request</div>
			<!-- {current_message.content} -->

			<div on:click={acceptFriend} class="flex-none mx-5"><Button name="Accept" width="w-45"></Button></div>
			<!-- <div class="flex-none mx-5"><Button name="Decline" width="w-45"></Button></div> -->

		</div>

		<div class="text-right pr-5">
			{#if current_message.create_at}
				<DateElement created_at={new Date(current_message.create_at)}></DateElement>
			{:else}
				loading..
			{/if}
		</div>

	</div>
	{/if}
{:else}
    {#if user.id === current_message.user_id}

        <div class="flex-grow">

            <div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right flex">
                <div class="flex-1">You sent a friend request</div>
                <!-- {current_message.content} -->
            </div>

            <div class="text-right pr-5">
                {#if current_message.create_at}
                    <DateElement created_at={new Date(current_message.create_at)}></DateElement>
                {:else}
                    loading..
                {/if}
            </div>

        </div>

        <div class="mr-3 mt-3">



            <div class="w-10 h-10 bg-cover  rounded-full mx-auto"
                 style="background-image: url( /{user?.image_url || 'image/default.png'} )">
            </div>

        </div>

    {:else}

        <div class="ml-3 mt-3">



            <div class="w-10 h-10 bg-cover  rounded-full mx-auto"
                 style="background-image: url( /{current_message?.user.image_url || 'image/default.png'} )">
            </div>
        </div>

        <div class="flex-grow">

            <div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right flex">
                <div class="flex-1">You received a friend request</div>
                <!-- {current_message.content} -->

                <div on:click={acceptFriend} class="flex-none mx-5"><Button name="Accept" width="w-45"></Button></div>
                <div class="flex-none mx-5"><Button name="Decline" width="w-45"></Button></div>

            </div>

            <div class="text-right pr-5">
                {#if current_message.create_at}
                    <DateElement created_at={new Date(current_message.create_at)}></DateElement>
                {:else}
                    loading..
                {/if}
            </div>

        </div>
    {/if}
{/if}
