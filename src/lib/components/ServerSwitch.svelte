<script lang="ts">
    import type { EC2Status } from "$lib/server/ec2";
    import { createEventDispatcher } from "svelte";
    import Switch from "./ui/switch/switch.svelte";
    import { statusDisplayText } from "$lib/localization";


    export let ec2: EC2Status;
    $: checked = ec2.status === "running" || ec2.status === "pending";

    $: statusText = ec2.status;
    $: statusChanging =
        ec2.status === "shutting-down" ||
        ec2.status === "stopping" ||
        ec2.status === "pending";

    const dispatch = createEventDispatcher()

    const onDone = () => dispatch("change")

    function toggleServerStatus() {
        checked = !checked;
        statusChanging = true;

        // if (checked) {
        //     console.log("turn on");
        // } else {
        //     console.log("turn off");
        // }

        fetch("/api/status", {
            method: "post",
            body: checked ? "on" : "off",
        })
            .then((res) => res.text())
            .then(console.log)
            .then(onDone);
    }

</script>

<div class="bg-background rounded-2xl flex justify-between items-center border">
    <div class="p-3">
        <h3 class="font-bold">สถานะ</h3>
        <p>
            {statusDisplayText[statusText]}
            {#if statusChanging}
                <span class="opacity-60"> น่าจะประมาณ 2 นาที </span>
            {/if}
        </p>
    </div>

    <Switch
        {checked}
        class="mr-3"
        disabled={statusChanging}
        on:click={toggleServerStatus}
    />
</div>