<script lang="ts">
    import type { EC2Status } from "$lib/server/ec2";
    import { createEventDispatcher } from "svelte";
    import Switch from "./ui/switch/switch.svelte";

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

<div class="bg-background rounded-2xl p-3 border flex justify-between items-center">
    <div>
        <h3 class="font-bold">ใช้ IPv4 ด้วย</h3>
        <p class="opacity-70">ทำให้คนที่ไม่มี IPv6 เล่นได้</p>
    </div>

    <Switch
        {checked}
        disabled={statusChanging}
        on:click={toggleIPv4}
    />
</div>
