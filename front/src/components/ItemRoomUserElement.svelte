<script lang="ts">

    import { imageUrl } from '../services/Utilities';
    import type {Rooms, RoomUser} from '../types/room';
    import type { User } from '../types/user';
    import { RoleUser } from '../types/user'
    import  userservice from '../services/UserService';
    import {onMount} from "svelte";
    import {Status} from '../types/user';
    import {createEventDispatcher} from "svelte";

    //bg-green-600
    export let user : RoomUser;
    let current_user: User;

    onMount(async ()=>{
        current_user = await userservice.getUser(user.user_id)
    })

    function getColor(status: Status)
    {
        if (status == Status.OFFLINE)
            return "bg-zinc-600";
        else if (status == Status.HIDDEN)
            return "bg-rose-600";
        else if (status == Status.ONLINE)
            return "bg-green-600";
    }

    const dispatch = createEventDispatcher()

    function clicker()
    {
        dispatch('clicker');
    }

</script>

{#if current_user}
    <div on:click={clicker} class="mx-1.5 cursor-pointer rounded-xl bg-color2  border-color2  border-2  p-5 flex items-center mt-1">

        <div class="mx-2 flex-shrink">

            <div class="w-[40px] h-[40px] bg-cover  rounded-full mx-auto"
                 style="background-image: url( {imageUrl(current_user?.image_url)} )">
            </div>

        </div>

        <div class="mx-2 flex-grow text-left">
            {current_user?.name}
            {user.role === RoleUser.ADMIN ? "👑" : ""}
        </div>
        {#if current_user?.online_status}
            <div class="mx-2">
                <div class="h-4 w-4 rounded-full {getColor(current_user.online_status)}"></div>
            </div>
        {/if}

    </div>
{:else}
    <p>LOADING...</p>
{/if}
