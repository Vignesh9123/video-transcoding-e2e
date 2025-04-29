import express from 'express'
import videoRouter from './video.routes'
const router = express.Router()

router.use('/video', videoRouter)

export default router
