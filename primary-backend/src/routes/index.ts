import express from 'express'
import videoRouter from './video.routes'
import orgRoutes from './org.routes'
import streamRoutes from './stream.routes'
import userRoutes from './user.routes'
const router = express.Router()

router.use('/video', videoRouter);
router.use('/org', orgRoutes);
router.use('/stream', streamRoutes);
router.use('/user', userRoutes);


export default router
