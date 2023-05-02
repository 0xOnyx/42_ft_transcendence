<script lang="ts">
    import Button from "./Button.svelte";
    import {createEventDispatcher} from "svelte";

    export let title: String;

    const dispatch = createEventDispatcher()

    function clicker()
    {
        dispatch('clicker')
    }

</script>

<div on:click={clicker} class="mt-5">
    <Button width="w-52" name={title} ></Button>
</div>
