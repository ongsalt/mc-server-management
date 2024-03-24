<script lang="ts">
    import { enhance } from "$app/forms";
    import Switch from "$lib/components/ui/switch/switch.svelte";

    const dateText = new Date().toISOString();

    let checked = false;
    let statusText = "Running";
    let statusText2 = ""
    let statusChanging = false;

    function toggleServerStatus() {
        checked = !checked;
        statusChanging = true;
        statusText = checked ? "Stopping" : "Starting";
        statusText2 = "It's usually take about half a minute." 

        setTimeout(() => {
            statusChanging = false;
            statusText = checked ? "Stopped" : "Running";
            statusText2 = ""
        }, 3000);

        // console.log("sdjfhugjyg")
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
            <p>{statusText} <span class="opacity-60"> {statusText2} </span></p>
        </div>

        <Switch
            checked
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
                <span>192.168.0.1</span>
            </div>
            <div>
                <span
                    class="text-sm font-medium bg-green-500/15 text-green-600 p-1 rounded-md select-none"
                >
                    IPv6
                </span>
                <span>2406:da18:766:d7b0:268c:7e02:4405:a92</span>
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

    <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h3 class="font-bold mb-2">Whitelist</h3>
        <button> Add my IP </button>
    </div>

    <div class="bg-white rounded-2xl p-3 flex-1 border">
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
    </div>
</main>
