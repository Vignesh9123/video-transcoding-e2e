import { createAuthClient } from "better-auth/react"
import { oneTapClient } from "better-auth/client/plugins"
import { NEXT_PUBLIC_PRIMARY_BACKEND_URL } from "@/config"
export const authClient = createAuthClient({
    baseURL: NEXT_PUBLIC_PRIMARY_BACKEND_URL,
    plugins: [oneTapClient({
        clientId: '301535184385-og64ctgefuv1efefvsmjoue7hdabuask.apps.googleusercontent.com',
        
    })]
})