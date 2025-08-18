import dotenv from 'dotenv'
dotenv.config()
import { PrismaClient, VideoStatus } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

export const config = {
    PORT: Number(process.env.PORT || 4000),
    JWT_SECRET: String(process.env.JWT_SECRET || 'secret'),
    JWT_EXPIRATION: String(process.env.JWT_EXPIRATION || '1d'),
    AWS_REGION: String(process.env.AWS_REGION || 'us-east-1'),
    AWS_ACCESS_KEY_ID: String(process.env.AWS_ACCESS_KEY_ID || ''),
    AWS_SECRET_ACCESS_KEY: String(process.env.AWS_SECRET_ACCESS_KEY || ''),
    S3_UPLOAD_BUCKET_NAME: String(process.env.S3_UPLOAD_BUCKET_NAME || ''),
    VideoStatusEnum: VideoStatus,
    FIREBASE_PROJECT_ID: String(process.env.FIREBASE_PROJECT_ID || ''),
}

export const prisma = new PrismaClient()
// .$extends(withAccelerate()) // TODO: Uncomment this line when merging to main

export const prisma10MinsTTL = {
    ttl: 60
} 