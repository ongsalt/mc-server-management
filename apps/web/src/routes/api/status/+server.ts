import { KEY } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import * as EC2 from "$lib/server/ec2";

export const GET: RequestHandler = async ({ cookies }) => {
    const key = cookies.get('key')
    if (key !== KEY) {
        throw redirect(302, '/auth')
    }

    const status = await EC2.getStatus()

    return new Response(JSON.stringify(status));
};

export const POST: RequestHandler = async ({ cookies, request }) => {
    const key = cookies.get('key')
    if (key !== KEY) {
        throw redirect(302, '/auth')
    }

    const body = await request.text()

    switch (body) {
        case "on":
            await EC2.start()
            return new Response("ok");
            break
        case "off":
            await EC2.stop()
            return new Response("ok");
            break
    }

    return new Response("fuckyou");
};