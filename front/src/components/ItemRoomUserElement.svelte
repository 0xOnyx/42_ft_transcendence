<script lang="ts">

    import { imageUrl, getColor } from '../services/Utilities';
    import type {Rooms, RoomUser} from '../types/room';
    import type { User } from '../types/user';
    import { RoleUser } from '../types/user'
    import  userservice from '../services/UserService';
    import {onMount} from "svelte";
    import {Status} from '../types/user';
    import {createEventDispatcher} from "svelte";
	import Icon from './Icon.svelte';

    //bg-green-600
    export let user : RoomUser;
    let current_user: User;
    let color: string;

    onMount(async ()=>{
        current_user = await userservice.getUser(user.user_id)
    })

    const dispatch = createEventDispatcher()

    function clicker()
    {
        dispatch('clicker');
    }

    $: color = getColorBg(user);

    function getColorBg(user)
    {
        if (user.ban)
            return 'bg-transparent border-core-red text-core-red opacity-75 italic border-[3px]';
        else if (Date.parse(user.term_penalty) > Date.now())
            return 'bg-gray-400 border-gray-700 italic opacity-50';
		else if (user.role === RoleUser.ADMIN)
			return 'bg-thread-blue border-gold-200 text-gold-200'
        return 'bg-thread-blue border-white'
    }

</script>

{#if current_user}
    <div on:click={clicker} class="mx-2 cursor-pointer rounded-xl {color} border-2 p-1 flex items-center mt-1">

        <div class="mx-2 flex-shrink">

            <div class="w-[40px] h-[40px] bg-cover rounded-full mx-auto border-4 {getColor(current_user.online_status)}"
                 style="background-image: url( {imageUrl(current_user?.image_url)} )">
            </div>

        </div>

		{#if user.ban}
		<Icon icon="ban" width="28" height="28" />
		{:else if user.mute}
		<Icon icon="mute" width="28" height="28" />
		{:else if user.role === RoleUser.ADMIN}
		<Icon icon="crown" width="30" height="30" />
		{/if}

        <div class="{user.ban ? 'line-through' : ''} mx-2 flex-grow text-left truncate">
 
			{current_user?.name}
        </div>
        {#if current_user?.online_status && !user.ban && !user.mute}
            <div class="mx-2">
                <div class="h-4 w-4 rounded-full {getColor(current_user.online_status)}"></div>
            </div>
        {/if}

    </div>
{:else}
    <p>LOADING...</p>
{/if}
