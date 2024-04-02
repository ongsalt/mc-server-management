import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getStatus } from "$lib/server/ec2";
import { removeSession, verifySession } from "$lib/server/auth";

export const ssr = false

export const load: PageServerLoad = async ({ cookies }) => {
    verifySession(cookies)    
};

export const actions: Actions = {
    logout({ cookies }) {
        removeSession(cookies)
    },
    async status({ cookies }) {
        verifySession(cookies)    

        return {
            ec2: await getStatus()
        }    
    }
};