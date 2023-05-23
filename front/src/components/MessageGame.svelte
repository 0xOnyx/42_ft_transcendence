<script lang="ts">
    import type {Messages} from "../types/room";
    import type {User} from "../types/user";
    import DateElement from "./DateElement.svelte";
    import Button from "./Button.svelte"
    import { imageUrl } from "../services/Utilities";
    import { goto } from "$app/navigation";

    export let current_message: (Messages & {user: User});
    export let user: User

    async function acceptGame()
    {
        //console.log(current_message.content);
        await goto(`/games/${current_message.content}`)
    }
    // console.log(current_message)

</script>

{#if isNaN(current_message.content)}
    {#if user.id === current_message.user_id}

        <div class="flex-grow">

            <div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right flex">
                <div class="flex-1">This game is finished</div>
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
                 style="background-image: url( {imageUrl(user?.image_url)} )">
            </div>

        </div>

    {:else}

        <div class="ml-3 mt-3">



            <div class="w-10 h-10 bg-cover  rounded-full mx-auto"
                 style="background-image: url( {imageUrl(current_message?.user.image_url)} )">
            </div>
        </div>

        <div class="flex-grow">

            <div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right flex">
                <div class="flex-1">This game is finished</div>
                <!-- {current_message.content} -->

                <!-- <div on:click={acceptFriend} class="flex-none mx-5"><Button name="Accept" width="w-45"></Button></div> -->
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
                <div class="flex-1">You sent an invite</div>
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
                 style="background-image: url( {imageUrl(user?.image_url)} )">
            </div>

        </div>

    {:else}

        <div class="ml-3 mt-3">



            <div class="w-10 h-10 bg-cover  rounded-full mx-auto"
                 style="background-image: url( {imageUrl(current_message?.user.image_url)} )">
            </div>
        </div>

        <div class="flex-grow">

            <div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right flex">
                <div class="flex-1">You received an invitation to play a game</div>
                <!-- {current_message.content} -->

                <div on:click={acceptGame} class="flex-none mx-5"><Button name="Accept" width="w-45"></Button></div>
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
{/if}
