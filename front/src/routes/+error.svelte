<script lang="ts">
    import { page } from '$app/stores';
    import Icon from '../components/Icon.svelte';
</script>

<div class="h-full flex-grow flex flex-col justify-center">
    <div class="text-center mb-5">

        <p class="text-center"><Icon icon="bug" css="inline w-24 stroke-none fill-white"></Icon></p>

        <h1 class="uppercase text-4xl mt-5">{$page.status}</h1>
        <p class="uppercase text-2xl">
            {$page.error?.message}
        </p>

    </div>

</div>
