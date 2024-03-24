<script>
    import { enhance } from "$app/forms";
</script>

<p>Please login mf</p>
<form method="post" use:enhance>
    <input type="text" name="key" />
    <button type="submit"> Done </button>
</form>
