import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    async default({ request, cookies }) {
        const form = await request.formData()
        const key = form.get('key')

        if (typeof key != 'string') {
            return
        }
        
        cookies.set('key', key, {
            path: '/'
        })

        throw redirect(302, '/')
    }
};