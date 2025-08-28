import {config} from 'dotenv'
config()

export const env = {
    PORT: Number(process.env.PORT || 5050),
    BUCKET_URL: String(process.env.BUCKET_URL || ''),
}