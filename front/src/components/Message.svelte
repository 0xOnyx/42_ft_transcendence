<script lang="ts">

    import type { Room, RoomUser } from '../types/room';
	import type { User } from '../types/user';

    //bg-green-600
    export let room : Room;
    export let user : User;

    function getUserId(userId : number) : User | undefined
    {
        let ret : RoomUser | null = null;


        room.users?.forEach(u => {
            if (u.user_id == userId) {
                ret = u;
            }
        });
        if (ret != null)
            return ret?.user || undefined;
        else
            return undefined;
    }

</script>


{#if room.messages}
    {#each room.messages as message}

        <div class="flex mt-3">

            {#if user.id == message.user_id}

                <div class="flex-grow">

                    <div class="rounded-md mx-3 bg-color6 p-5 mt-1 text-right">

                        {message.content}

                    </div>

                    <div class="text-right pr-5">
                        {message.created_at?.getDate()}.{message.created_at?.getMonth()}.{message.created_at?.getFullYear()}
                        {message.created_at?.getHours()}:{message.created_at?.getMinutes()}
                    </div>

                </div>

                <div class="mr-3 mt-3">

                    {#if user.image_url}
                        <img class="h-10 rounded-full bg-color2" src={user.image_url} alt="logo">
                    {/if}

                </div>

            {:else}

                <div class="ml-3 mt-3">

                    {#if user.image_url}
                        <img class="h-10 rounded-full bg-color2" src={getUserId(message.user_id)?.image_url} alt="logo">
                    {/if}

                </div>

                <div class="flex-grow">

                    <div class="rounded-md border mx-3 border-color2 text-left p-5 mt-1">

                        {message.content}

                    </div>

                    <div class="text-right pr-5">
                        {message.created_at?.getDate()}.{message.created_at?.getMonth()}.{message.created_at?.getFullYear()}
                        {message.created_at?.getHours()}:{message.created_at?.getMinutes()}
                    </div>
                </div>

            {/if}

        </div>

    {/each}
{/if}
