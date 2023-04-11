<script lang="ts">
    export let name : string = '';
</script>

<div class="rounded-xl bg-color5 p-5 flex items-center mt-1">

    <div class="mx-2 flex-shrink">
        <svg class="rounded-full mx-auto bg-color3" width="40" height="40" data-jdenticon-value="icon"></svg>
    </div>
    <div class="mx-2 flex-grow text-left">
        {name}
    </div>
    <div class="mx-2">
        <div class="h-4 w-4 rounded-full bg-green-600"></div>
    </div>

</div>
