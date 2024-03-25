<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    export let form: ActionData
</script>

<main class="mx-auto max-w-sm mt-6">
    <h1 class="text-xl">{ form?.message ??  "Enter key mf"}</h1>
    <form method="post" use:enhance>
        <input class="border rounded p-1" type="text" name="key" placeholder="Key"/>
        <button type="submit" class="border p-1 px-2 rounded bg-blue-500/10 hover:bg-blue-500/15 text-blue-500"> Ok </button>
    </form>
</main>
