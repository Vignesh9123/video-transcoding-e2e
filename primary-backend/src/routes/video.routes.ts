import express from 'express'
const router = express.Router()
import { getPresignedUrl } from '../controllers/video.controller'
router.post("/get-presigned-url", getPresignedUrl)
export default router