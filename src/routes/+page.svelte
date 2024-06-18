<script lang="ts">
    import { enhance } from "$app/forms";
    import type { EC2Status } from "$lib/server/ec2";
    import { onDestroy } from "svelte";
    import ServerSwitch from "$lib/components/ServerSwitch.svelte";
    import IPv4Switch from "$lib/components/IPv4Switch.svelte";
    import { fade, slide } from "svelte/transition";
    import Switch2 from "$lib/components/Switch2.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    let ec2: EC2Status | undefined = undefined;

    data.ec2.then((it) => (ec2 = it));

    let id = setInterval(updateServerStatus, 2000);

    onDestroy(() => clearInterval(id));

    async function fetchServerStatus() {
        const res = await fetch("/api/status", {
            method: "GET",
        });

        const updatedResult = (await res.json()) as EC2Status;
        return updatedResult;
    }

    async function updateServerStatus() {
        ec2 = await fetchServerStatus();
    }
</script>

<main class="p-6 space-y-4 max-w-xl mx-auto">
    <div class="flex justify-between items-center h-12 my-6">
        <h1 class="text-3xl font-semibold">Server management</h1>
        <form action="?/logout" method="post" use:enhance>
            <button
                class="p-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition"
                type="submit"
            >
                <img
                    src="/icon/icons8-logout-96.png"
                    class="w-6 h-6 dark:invert"
                    alt="logouts"
                />
            </button>
        </form>
    </div>

    <div class="relative">
        <div
            class="space-y-4 transition-all"
            class:blur-sm={!ec2}
            class:blur-0={ec2}
        >
            {#if ec2}
                <ServerSwitch {ec2} on:change={updateServerStatus} />
                <IPv4Switch {ec2} on:change={updateServerStatus} />
            {:else}
                <Switch2
                    checked={true}
                    title="สถานะ"
                    description="เปิด"
                    disabled={false}
                />
                <Switch2
                    checked={false}
                    title="ใช้ IPv4 ด้วย"
                    description="ทำให้คนที่ไม่มี IPv6 เล่นได้"
                    disabled={false}
                />
            {/if}
        </div>
        {#if !ec2}
            <div
                class="inset-0 absolute flex items-center justify-center"
                transition:fade={{ duration: 250 }}
            >
                <div class="p-2 border rounded-lg bg-background">
                    <h2 class="text-md">กำลังโหลด</h2>
                </div>
            </div>
        {/if}
    </div>

    <div class="bg-background rounded-2xl p-3 flex-1 border">
        <h2 class="font-bold mb-2">ที่อยู่เซิร์ฟเวอร์</h2>
        <div class="flex gap-4 flex-wrap">
            <div>
                <span
                    class="text-sm font-medium bg-blue-500/10 text-blue-600 p-1 rounded-md select-none"
                >
                    IPv4
                </span>
                <span
                    >{ec2 === undefined
                        ? "กำลังโหลด"
                        : ec2?.ipv4 ?? "ไม่มี"}</span
                >
            </div>
            <div>
                <span
                    class="text-sm font-medium bg-green-500/10 text-green-600 p-1 rounded-md select-none"
                >
                    IPv6
                </span>
                <span
                    >{ec2 === undefined
                        ? "กำลังโหลด"
                        : ec2?.ipv6 ?? "ไม่มี"}</span
                >
            </div>
            <div>
                <span
                    class="text-sm font-medium bg-yellow-500/10 text-yellow-500 p-1 rounded-md select-none"
                >
                    IPv4 Domain
                </span>
                <span>fabric.ongsa.lt</span>
            </div>

            <div>
                <span
                    class="text-sm font-medium bg-rose-500/10 text-rose-600 p-1 rounded-md select-none"
                >
                    IPv6 Domain
                </span>
                <span>fabric6.ongsa.lt</span>
            </div>
        </div>
    </div>

    <div class="bg-background rounded-2xl p-3 flex-1 border">
        <h2 class="font-bold mb-2">โน๊ต</h2>
        <p>
            เนื่องจาก IPv4 มันแพง(IPv6 ฟรี) ถ้าจะ AFK ฟาร์มทิ้งไว้ก็ใช้ IPv6
            เถอะนะ
        </p>

        <p>
            วิธี: ออกเซิฟ -> ปิด "ใช้ IPv4 ด้วย" -> เปิด Cloudflare warp ->
            เข้าเซิฟโดยใช้ IPv6 Domain
        </p>
        <p class="text-red-500">อย่าปิด IPv4 ถ้ามีคนอื่นอยู่ในเซิฟ</p>
        <p class="text-yellow-500">
            ค่าเซิฟส่วนใหญ่มาจาก IPv4 นี่แหละถ้าปิดไว้ไม่ต้องปิดเซิฟก็ได้
        </p>
    </div>

    <!-- <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h2 class="font-bold mb-2">ค่าใช้จ่าย</h2>
        <p> ค่าคอม คิดเฉพาะตอนเปิดเซิฟ ฟรีจนถึงธันวาคม 2024 (t4g.small) </p>
        <p> IPv4 คิดเฉพาะตอนเปิดเซิฟ ชั่วโมงละ 0.18 บาท ซึ่งแพงชิบหายถ้าเปิดเซิฟทิ้งไว้ทั้งเดือน (ส่วน IPv6 ฟรี)</p>
        <p> ค่าที่เก็บข้อมูล อันนี้ต้องจ่ายตลอดเวลาที่เราเซฟข้อมูลเกมไว้ 3.50 บาทต่อ Gb ต่อเดือน เราใช้ 8 Gb ก็เดือนละ 28 บาท </p>
    </div> -->

    <!-- <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h2 class="font-bold mb-2">Console</h2>
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
