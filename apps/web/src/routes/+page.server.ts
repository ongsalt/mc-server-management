import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { KEY } from "$env/static/private";
import { getStatus } from "$lib/server/ec2";

export const ssr = false

export const load: PageServerLoad = async ({ cookies }) => {
    const key = cookies.get('key')
    if (key !== KEY) {
        throw redirect(302, '/auth')
    }

    return {
        ec2: await getStatus()
    }
};

export const actions: Actions = {
    logout({ cookies }) {
        cookies.delete('key', {
            path: '/'
        })
        redirect(302, '/auth')
    },
    async status({ cookies }) {
        const key = cookies.get('key')
        if (key !== KEY) {
            throw redirect(302, '/auth')
        }
    
        return {
            ec2: await getStatus()
        }    
    }
};