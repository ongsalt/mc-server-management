<script lang="ts">
    import type { EC2Status } from "$lib/server/ec2";
    import { createEventDispatcher } from "svelte";
    import Switch2 from "./Switch2.svelte";

    export let ec2: EC2Status;

    let statusChanging = false

    const dispatch = createEventDispatcher();
    const onDone = () => {
        statusChanging = false
        dispatch("change")
    };

    let checked = ec2.ipv4 !== undefined;

    function toggleIPv4() {
        checked = !checked;
        statusChanging = true

        fetch("/api/use-ipv4", {
            method: "post",
            body: checked ? "on" : "off",
        })
            .then((res) => res.text())
            .then(console.log)
            .then(onDone);
    }
</script>

<Switch2
    {checked}
    disabled={statusChanging}
    on:click={toggleIPv4}
    title="ใช้ IPv4 ด้วย"
    description="ทำให้คนที่ไม่มี IPv6 เล่นได้"
/>
