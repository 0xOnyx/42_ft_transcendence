<script lang="ts">
    import Button from "./Button.svelte";

    export let openWarning: Function;


</script>

<div on:click={openWarning} class="mt-12"><Button width="w-52" name="Block User" ></Button></div>
