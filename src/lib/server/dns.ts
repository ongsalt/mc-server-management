import { env } from "$env/dynamic/private"

export async function updateDnsRecord(ip: string) {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records/${env.CLOUDFLARE_RECORD_ID}`, {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + env.CLOUDFLARE_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: ip,
            name: "fabric",
            proxied: false,
            type: "A",
            comment: "Fabric server on AWS",
            ttl: 60,
        })
    })
    const data = await res.json()
    console.log(data)
}