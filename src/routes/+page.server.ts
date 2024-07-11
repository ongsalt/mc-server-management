import type { Actions, PageServerLoad } from "./$types";
import { getStatus } from "$lib/server/ec2";
import { removeSession, verifySession } from "$lib/server/auth";
import { SERVER_IPV4_DOMAIN, SERVER_IPV6_DOMAIN } from "$env/static/private";

export const ssr = true

export const load: PageServerLoad = async ({ cookies }) => {
    verifySession(cookies)    
    
    return {
        ipv4: SERVER_IPV4_DOMAIN,
        ipv6: SERVER_IPV6_DOMAIN,
        ec2: getStatus()
    }
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