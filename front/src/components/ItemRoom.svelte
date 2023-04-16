<script lang="ts">

    import type {Room, RoomUser} from '../types/room';
	import type { User } from '../types/user';

    //bg-green-600
    export let room : Room;
    export let user : User;

</script>


<div class="rounded-xl bg-color5 p-5 flex items-center mt-1">

    <div class="mx-2 flex-shrink">

        {room.name}

    </div>

</div>

