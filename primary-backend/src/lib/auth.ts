import { betterAuth } from "better-auth";
import {prismaAdapter} from 'better-auth/adapters/prisma'
import { prisma } from "../config";
import {oneTap} from 'better-auth/plugins'
export const auth = betterAuth({
  database: prismaAdapter(prisma,{
    provider:"postgresql",
  }),
  plugins: [oneTap()],
  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID || ''),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET || ''),
      redirectURI: 'http://localhost:4000/api/auth/callback/google',   
    },
    github: {
      clientId: String(process.env.GITHUB_CLIENT_ID || ''),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET || ''),
      redirectURI: 'http://localhost:4000/api/auth/callback/github',
    },
  },
});