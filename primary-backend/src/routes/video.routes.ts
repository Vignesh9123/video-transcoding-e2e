import express from 'express'
const router = express.Router()
import { getPresignedUrl, getVideoStatusBulk, getVideoStatus } from '../controllers/video.controller'
router.post("/get-presigned-url", getPresignedUrl)
router.get("/get-video-status/:videoId", getVideoStatus)
router.post("/get-video-status/bulk", getVideoStatusBulk)
export default router