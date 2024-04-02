<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Switch } from "./ui/switch";

    export let title: string
    export let description: string
    export let description2: string = ""
    export let checked: boolean
    export let disabled: boolean
    
    const dispatch = createEventDispatcher()

</script>

<div class="bg-background rounded-2xl flex justify-between items-center border">
    <div class="p-3">
        <h3 class="font-bold">{title}</h3>
        <p>
            {description}
            <span class="opacity-60"> {description2} </span>
        </p>
    </div>

    <Switch
        {checked}
        {disabled}
        class="mr-3"
        on:click={() => dispatch('click')}
    />
</div>