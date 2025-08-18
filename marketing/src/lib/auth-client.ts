import { createAuthClient } from "better-auth/react"
import { oneTapClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    baseURL: "http://localhost:4000",
    plugins: [oneTapClient({
        clientId: '301535184385-og64ctgefuv1efefvsmjoue7hdabuask.apps.googleusercontent.com',
        
    })]
})