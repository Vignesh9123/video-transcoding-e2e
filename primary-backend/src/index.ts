import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config'
import dotenv from 'dotenv'
const app = express()
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-8',
	legacyHeaders: false, 
	ipv6Subnet: 56, 
    handler: (req, res, next) => {
        res.status(429).json({ message: 'Too many requests' })
    }
})
app.set('trust proxy', true)
dotenv.config()

app.use(cors(
    {
        origin: ['http://localhost:8080', 'https://hlsjs.video-dev.org', 'https://livepush.io', 'https://video-transcoding-e2e.vercel.app'],
        credentials: true,
    }
))
app.use(cookieParser())
app.use(express.json())
app.use(limiter)

app.get("/", (req, res) => {
    console.log('ip',req.ip)
    console.log('headers',req.headers['x-forwarded-for'])
    res.send('I am waiting')
})
app.get('/health', (req, res) => {
    res.send('OK')
})

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})

import indexRouter from './routes'
app.use('/api', indexRouter)
