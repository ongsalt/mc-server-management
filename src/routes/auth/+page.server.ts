import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { KEY } from "$env/static/private";

export const actions: Actions = {
    async default({ request, cookies }) {
        const form = await request.formData()
        const key = form.get('key')

        if (typeof key != 'string') {
            return
        }

        if (key != KEY) {
            return {
                message: "wrong mf"
            }
        }
        
        cookies.set('key', key, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30 // 1 Month in second
        })

        throw redirect(302, '/')
    }
};