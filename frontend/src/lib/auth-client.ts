import { createAuthClient } from "better-auth/react"
import { oneTapClient } from "better-auth/client/plugins"
import { PRIMARY_BACKEND_URL } from "@/constants"
export const authClient = createAuthClient({
    baseURL: PRIMARY_BACKEND_URL,
    plugins: [oneTapClient({
        clientId: '301535184385-og64ctgefuv1efefvsmjoue7hdabuask.apps.googleusercontent.com'
    })]
})