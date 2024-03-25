import { KEY } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getStatus, start, stop } from "$lib/server/ec2";
import { verifySession } from "$lib/server/auth";

export const GET: RequestHandler = async ({ cookies }) => {
    verifySession(cookies)    

    const status = await getStatus()

    return new Response(JSON.stringify(status));
};

export const POST: RequestHandler = async ({ cookies, request }) => {
    verifySession(cookies)    

    const body = await request.text()

    switch (body) {
        case "on":
            await start()
            return new Response("ok");
        case "off":
            await stop()
            return new Response("ok");
    }

    return new Response("fuckyou");
};