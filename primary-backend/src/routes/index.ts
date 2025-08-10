import express from 'express'
import videoRouter from './video.routes'
import authRouter from './auth.routes'
import orgRoutes from './org.routes'
import streamRoutes from './stream.routes'

const router = express.Router()

router.use('/video', videoRouter);
// router.use('/auth', authRouter); // TODO: remove 
router.use('/org', orgRoutes);
router.use('/stream', streamRoutes);


export default router
