

<script lang="ts">
	import type { User } from "../types/user";
	import IconVh from "./IconVH.svelte";

    export let user : User | null;
</script>

<div>
	<div class="relative border:rad">
		<div class="w-[150px] h-[150px] bg-cover border-red border-5 border-solid rounded-full mx-auto"
			 style="background-image: url( {user?.image_url || `image/default.png`} )">
			 <div class="absolute inset-0 flex justify-center items-center"> 
				<button class="group bg-gray-300/0 hover:bg-gray-300/50 border-0 hover:border-4 w-[150px] h-[150px] rounded-full flex items-center justify-center transition-all">
					<IconVh icon="modify" width="64" height="64" css="scale-0 group-hover:scale-100 transition-all" />
				</button>
			</div>
		</div>
	</div>

    <div class="relative mt-5 border:rad">
		<h1 class=" flex justify-center items-center gap-2 text-lg">{user?.name || "loading.."}
				<button class="flex items-center justify-center border-white h-6 w-6 border rounded-full hover:scale-125 transition-all">
					<IconVh icon="modify" width="12" height="12"/>
				</button>
		</h1>
        <small>#{user?.oauth_42_login || "loading.."}</small>
    </div>
</div>
