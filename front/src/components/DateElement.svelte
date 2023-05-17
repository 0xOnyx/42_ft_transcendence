<script lang="ts">
    //bg-green-600
    export let created_at : Date;

    function format2(value : string) : string
    {
        if(value.length < 2)
            return '0' + value;
        else
            return value;
    }

</script>

{format2(created_at?.getDate().toString())}.{format2((created_at?.getMonth() + 1).toString())}.{created_at?.getFullYear()}
{format2(created_at?.getHours().toString())}:{format2(created_at?.getMinutes().toString())}
