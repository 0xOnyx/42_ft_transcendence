<script lang="ts">
    import {PUBLIC_API_URI} from "$env/static/public";
</script>

<form action="{`${PUBLIC_API_URI}/auth/dev/login`}" method="post">

        <label for="username"><b>Username</b></label>
        <input id="username" class="text-black" type="text" placeholder="Enter Username" name="username" required>

        <label class="hidden" for="current-password">Password</label>
        <input  class="hidden" value="not use only for dev" id="current-password" name="password" type="password" autocomplete="current-password" required />

        <button type="submit">Login</button>
</form>


