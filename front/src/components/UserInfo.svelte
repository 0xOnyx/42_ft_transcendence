

<script lang="ts">
	import type { User } from "../types/user";

    export let user : User | null;
</script>

<div>
    <div class="border:rad">
        <div class="w-[150px] h-[150px] bg-cover  rounded-full mx-auto"
             style="background-image: url( /{user?.image_url ? `${user?.image_url}?${Date.now()}` : `image/default.png`} )">
        </div>
    </div>

    <div class="mt-5">
        <h1 class="text-lg">{user?.name || "loading.."}</h1>
        <small>#{user?.oauth_42_login || "loading.."}</small>
    </div>
</div>
