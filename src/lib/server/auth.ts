import { KEY } from "$env/static/private"
import { redirect, type Cookies } from "@sveltejs/kit"

export function verifySession(cookies: Cookies) {
    const key = cookies.get('key')
    if (key !== KEY) {
        throw redirect(302, '/auth')
    }
}

export function removeSession(cookies: Cookies) {
    cookies.delete('key', {
        path: '/'
    })
    throw redirect(302, '/auth')
}