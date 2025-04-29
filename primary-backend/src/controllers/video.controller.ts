import { Request, Response } from "express";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config";
export const getPresignedUrl = async(req: Request, res: Response) => {
    try {
        const {key} = req.body
        const s3Client = new S3Client({
            region: config.AWS_REGION,
            credentials: {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY
            }
        })
        const command = new PutObjectCommand({
            Bucket: config.S3_UPLOAD_BUCKET_NAME,
            Key: key
        })
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 60
        })
        res.status(200).json({
            signedUrl,
            message: 'Successfully generated presigned URL',
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to generate presigned URL',
            success: false
        })
    }
}
    