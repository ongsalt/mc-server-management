import type { RequestHandler } from "./$types";
import { toggleIpv4 } from "$lib/server/ec2";
import { verifySession } from "$lib/server/auth";
import type { Config } from "@sveltejs/adapter-vercel";

export const POST: RequestHandler = async ({ cookies, request }) => {
    verifySession(cookies)

    const body = await request.text()

    const isBodyOn = body === "on" 
    const isBodyOff = body === "off"

    if (isBodyOn || isBodyOff) {
        const res = await toggleIpv4(isBodyOn)
        return new Response(res);
    }

    return new Response("fuckyou");
};