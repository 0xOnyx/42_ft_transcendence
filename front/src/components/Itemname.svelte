<script lang="ts">
    let Status = {
        ONLINE: 'ONLINE',
        OFFLINE: 'OFFLINE',
        HIDDEN: 'HIDDEN'
    };
    type Status = (typeof Status)[keyof typeof Status]
    interface User
    {
        id: number,
        name?: string,
        email?: string,
        first_name?: string,
        last_name?: string,
        image_url?: string,
        oauth_42_login?: string,
        oauth_42_id?: number,
        last_login?: Date,
        online_status?: Status,
    }
    //bg-green-600
    export let user : User;

    function getColor(status: Status)
    {
        if (status == Status.OFFLINE)
            return "bg-zinc-600";
        else if (status == Status.HIDDEN)
            return "bg-rose-600";
        else if (status == Status.ONLINE)
            return "bg-green-600";
    }
</script>

<div class="rounded-xl bg-color5 p-5 flex items-center mt-1">

    <div class="mx-2 flex-shrink">
        <div class="w-[40px] h-[40px] bg-cover  rounded-full mx-auto"
             style="background-image: url( {user?.image_url || `image/default.png`} )">
        </div>

    </div>

    <div class="mx-2 flex-grow text-left">
        {user.name}
    </div>
    {#if user?.online_status}
        <div class="mx-2">
            <div class="h-4 w-4 rounded-full {getColor(user.online_status)}"></div>
        </div>
    {/if}

</div>
