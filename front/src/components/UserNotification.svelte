<script lang="ts">
	import type { User } from "../types/user";
	import Icon from "./Icon.svelte";

    export let user : User;
</script>

<div class="flex bg-color5 rounded-xl items-center">

    <div class="">

        <Icon icon="bell" css="inline m-3 h-8 stroke-2 stroke-white fill-none"></Icon>

    </div>

        <div class="w-8 h-8 bg-cover  rounded-full mx-auto"
             style="background-image: url( /{user?.image_url || 'image/default.png'} )">
        </div>
    <div class="flex-grow text-left px-2">
           {user?.name || "LOADING.."}
    </div>

    <a href="/api/auth/logout">

        <Icon icon="exit" css="inline m-3 h-8 stroke-none fill-white"></Icon>

    </a>

</div>
