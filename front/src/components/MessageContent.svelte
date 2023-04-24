<script lang="ts">
    import type {Messages} from "../types/room";
    import type {User} from "../types/user";
    import DateElement from "./DateElement.svelte";

    export let current_message: (Messages & {user: User});
    export let user: User;
</script>


{#if user.id === current_message.user_id}

    <div class="flex-grow">

        <div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right">

            {current_message.content}

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

        <div class="rounded-md border mx-3 border-color2 text-left p-5 mt-1">

            {current_message.content}

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
