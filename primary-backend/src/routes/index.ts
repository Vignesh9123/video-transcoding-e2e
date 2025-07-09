import express from 'express'
import videoRouter from './video.routes'
import authRouter from './auth.routes'
import orgRoutes from './org.routes'
const router = express.Router()

router.use('/video', videoRouter);
router.use('/auth', authRouter);
router.use('/org', orgRoutes);


export default router
