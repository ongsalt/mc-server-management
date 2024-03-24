<script lang="ts">
    import { enhance } from "$app/forms";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import type { getStatus } from "$lib/server/ec2";
    import { onDestroy } from "svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    let ec2 = data.ec2;
    let checked = ec2.status === "running" || ec2.status === "pending";

    $: statusText = ec2.status.toUpperCase();
    $: statusChanging =
        ec2.status === "shutting-down" ||
        ec2.status === "stopping" ||
        ec2.status === "pending";

    function toggleServerStatus() {
        checked = !checked;
        statusChanging = true;

        if (checked) {
            console.log("turn on");
        } else {
            console.log("turn off");
        }

        fetch("/api/status", {
            method: "post",
            body: checked ? "on" : "off",
        })
            .then((res) => res.text())
            .then(console.log)
            .then(fetchServerStatus);
    }

    let id = setInterval(fetchServerStatus, 2000);
    onDestroy(() => clearInterval(id));
    async function fetchServerStatus() {
        const res = await fetch("/api/status", {
            method: "GET",
        });

        const updatedResult = (await res.json()) as Awaited<
            ReturnType<typeof getStatus>
        >;
        ec2 = updatedResult;
        checked = ec2.status === "running" || ec2.status === "pending"
    }
</script>

<main class="p-6 space-y-4 max-w-xl mx-auto">
    <div class="flex justify-between items-center my-6">
        <h1 class="text-3xl font-semibold">Server management</h1>
        <form action="?/logout" method="post" use:enhance>
            <button
                class="p-2 bg-black/5 hover:bg-black/10 rounded-full"
                type="submit"
            >
                <img
                    src="/icon/icons8-logout-96.png"
                    class="w-6"
                    alt="logouts"
                />
            </button>
        </form>
    </div>
    <div class="bg-white rounded-2xl flex justify-between items-center border">
        <div class="p-3">
            <h3 class="font-bold">Status</h3>
            <p>
                {statusText}
                {#if statusChanging}
                    <span class="opacity-60"> It's take about 1 minute </span>
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

    <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h3 class="font-bold mb-2">Server Address</h3>
        <div class="flex gap-4 flex-wrap">
            <div>
                <span
                    class="text-sm font-medium bg-sky-500/15 text-sky-600 p-1 rounded-md select-none"
                >
                    IPv4
                </span>
                <span>{ec2.ipv4 ?? "Unavailable"}</span>
            </div>
            <div>
                <span
                    class="text-sm font-medium bg-green-500/15 text-green-600 p-1 rounded-md select-none"
                >
                    IPv6
                </span>
                <span>{ec2.ipv6 ?? "Unavailable"}</span>
            </div>
            <div>
                <span
                    class="text-sm font-medium bg-yellow-500/15 text-yellow-600 p-1 rounded-md select-none"
                >
                    Domain
                </span>
                <span>fabric.ongsa.lt</span>
            </div>
        </div>
    </div>

    <!-- <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h3 class="font-bold mb-2">Whitelist</h3>
        <button> Add my IP </button>
    </div> -->

    <!-- <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h3 class="font-bold mb-2">Console</h3>
        <div
            class="bg-slate-900 border rounded-md text-white font-mono border-white/20"
        >
            <div class="p-2">
                <p><span class="text-white/70"> [{dateText}] </span> Test</p>
                <p>Test</p>
            </div>
            <div class="border-t border-t-white/20 flex gap-1 items-center">
                <span class="pl-2"> > </span>
                <input
                    type="text"
                    class="bg-transparent flex-1 focus:outline-none p-1"
                />
            </div>
        </div>
    </div> -->
</main>
