import express from 'express'
const router = express.Router()
import { getPresignedUrl, getVideoStatusBulk, getVideoStatus, getUserVideos, getVideoURL, deleteVideo } from '../controllers/video.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
router.post("/get-presigned-url", authMiddleware,getPresignedUrl)
router.get("/get-video-url/:videoId",  authMiddleware,getVideoURL)
router.get("/get-videos",  authMiddleware,getUserVideos)
router.delete("/delete-video/:videoId",  authMiddleware,deleteVideo)
router.get("/get-video-status/:videoId",  authMiddleware,getVideoStatus)
router.post("/get-video-status/bulk",  authMiddleware,getVideoStatusBulk)
export default router