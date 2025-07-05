import express from 'express'
import videoRouter from './video.routes'
import authRouter from './auth.routes'
const router = express.Router()

router.use('/video', videoRouter);
router.use('/auth', authRouter);

export default router
