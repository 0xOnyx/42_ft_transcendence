<script lang="ts">
    import type { LayoutData } from './$types';

    export let data: LayoutData;
</script>

<div class="grow items-center container bg-color3 my-20 mx-5 sm:border-4 border-black rounded relative">
    <slot />
</div>



