<script lang="ts">
    // https://stackoverflow.com/questions/74974066/visible-non-interactive-elements-with-an-onclick-event-must-be-accompanied-by

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
	export let checked : boolean = false;
    export let disable : boolean = false;

    function toggle()
    {
        if(!disable) {
            checked = !checked;
            onChange();
        }
    }
    function keyToggle(event : KeyboardEvent)
    {
        if(!disable) {
            if(event.key === " "){
                checked = !checked;
                onChange();
            }
        }
    }
    function onChange()
    {
		dispatch('change', {
			"checked": checked
		});
    }
</script>

<div role="checkbox" aria-checked="true" tabindex="0" class="w-5 h-5 bg-white inline-block rounded-md p-1" on:click={toggle} on:keyup={keyToggle}>
    {#if checked}
    <div class="bg-color3 h-full w-full rounded-sm"></div>
    {/if}
</div>
