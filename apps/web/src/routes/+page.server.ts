import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { KEY } from "$env/static/private";

export const load: PageServerLoad = ({ cookies }) => {
    const key = cookies.get('key')
    if (key !== KEY) {
        throw redirect(302, '/auth')
    }
};

export const actions: Actions = {
    logout({ cookies }) {
        cookies.delete('key', {
            path: '/'
        })
        redirect(302, '/auth')
    }
};