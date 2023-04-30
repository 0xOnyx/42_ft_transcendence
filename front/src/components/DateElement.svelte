<script lang="ts">
    //bg-green-600
    export let created_at : Date;

</script>

{created_at?.getDate()}.{created_at?.getMonth()}.{created_at?.getFullYear()}
{created_at?.getHours()}:{created_at?.getMinutes()}
