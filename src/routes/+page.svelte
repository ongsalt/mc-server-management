<script lang="ts">
    import { enhance } from "$app/forms";
    import type { getStatus } from "$lib/server/ec2";
    import { onDestroy } from "svelte";
    import type { PageData } from "./$types";
    import ServerSwitch from "$lib/components/ServerSwitch.svelte";
    import IPv4Switch from "$lib/components/IPv4Switch.svelte";
    import { slide } from "svelte/transition";

    export let data: PageData;
    let ec2 = data.ec2;

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

    <ServerSwitch {ec2} on:change={fetchServerStatus} />
    {#if ec2.status === "running"}
        <div transition:slide={{ axis: "y" }}>
            <IPv4Switch {ec2} on:change={fetchServerStatus} />
        </div>
    {/if}
    <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h3 class="font-bold mb-2">ที่อยู่เซิร์ฟเวอร์</h3>
        <div class="flex gap-4 flex-wrap">
            <div>
                <span
                    class="text-sm font-medium bg-sky-500/15 text-sky-600 p-1 rounded-md select-none"
                >
                    IPv4
                </span>
                <span>{ec2.ipv4 ?? "ไม่มี"}</span>
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

    <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h3 class="font-bold mb-2">โน๊ต</h3>
        <p>
            เนื่องจาก IPv4 มันแพง(ส่วน IPv6 ฟรี) ถ้าจะ AFK ฟาร์มทิ้งไว้ก็ใช้
            IPv6 เถอะนะ
        </p>
        <p>วิธี: ออกเซิฟ -> ปิด "ใช้ IPv4 ด้วย" -> เปิด Cloudflare warp</p>
        <p class="text-red-500">อย่าปิด IPv4 ถ้ามีคนอื่นอยู่ในเซิฟ</p>
    </div>

    <!-- <div class="bg-white rounded-2xl p-3 flex-1 border">
        <h3 class="font-bold mb-2">ค่าใช้จ่าย</h3>
        <p> ค่าคอม คิดเฉพาะตอนเปิดเซิฟ ฟรีจนถึงธันวาคม 2024 (t4g.small) </p>
        <p> IPv4 คิดเฉพาะตอนเปิดเซิฟ ชั่วโมงละ 0.18 บาท ซึ่งแพงชิบหายถ้าเปิดเซิฟทิ้งไว้ทั้งเดือน (ส่วน IPv6 ฟรี)</p>
        <p> ค่าที่เก็บข้อมูล อันนี้ต้องจ่ายตลอดเวลาที่เราเซฟข้อมูลเกมไว้ 3.50 บาทต่อ Gb ต่อเดือน เราใช้ 8 Gb ก็เดือนละ 28 บาท </p>
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
