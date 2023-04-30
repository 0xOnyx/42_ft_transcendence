<script lang="ts">

    import { imageUrl } from '../services/Utilities';
import type {Room, RoomUser} from '../types/room';
	import type { User } from '../types/user';

    //bg-green-600
    export let room : Room;
    export let user : User;

</script>

{#if room.users}
    {#each room.users as u}
        {#if u.user}

        <div class="rounded-xl bg-color5 p-5 flex items-center mt-1">

            <div class="mx-2 flex-shrink">


                    <div class="w-[40px] h-[40px] bg-cover  rounded-full mx-auto"
                        style="background-image: url( {imageUrl(u.user?.image_url)} )">
                    </div>


            </div>

            <div class="mx-2 flex-grow text-left">
                {u.user?.name}
            </div>

        </div>

        {/if}
    {/each}
{/if}
