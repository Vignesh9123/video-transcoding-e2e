import { betterAuth } from "better-auth";
import {prismaAdapter} from 'better-auth/adapters/prisma'
import { config, prisma } from "../config";
import {oneTap} from 'better-auth/plugins'


export const auth = betterAuth({
  database: prismaAdapter(prisma,{
    provider:"postgresql",
  }),
  advanced:{
    crossSubDomainCookies:{
      enabled: true
    },
    defaultCookieAttributes: {
        sameSite: "none", //TODO: This is only because currently I host FE on vercel's domain
        secure: true,
        partitioned: true // New browser standards will mandate this for foreign cookies
      }
  },
  plugins: [oneTap()],
  trustedOrigins: config.TRUSTED_ORIGINS,
  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID || ''),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET || ''),
      redirectURI: `${config.API_URL}/api/auth/callback/google`,   
    },
    github: {
      clientId: String(process.env.GITHUB_CLIENT_ID || ''),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET || ''),
      redirectURI: `${config.API_URL}/api/auth/callback/github`,
    },
  },
});