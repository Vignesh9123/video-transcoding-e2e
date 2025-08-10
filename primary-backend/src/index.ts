import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config'
import dotenv from 'dotenv'
import { auth } from './lib/auth'
import {fromNodeHeaders, toNodeHandler} from 'better-auth/node'
const app = express()
app.set('trust proxy', true)
dotenv.config()

app.use(cors(
    {
        origin: ['http://localhost:8080', 'https://hlsjs.video-dev.org', 'https://livepush.io', 'https://video-transcoding-e2e.vercel.app', 'http://localhost:3000'],
        credentials: true,
    }
))
app.all("/api/auth/*splat", toNodeHandler(auth)); 
app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res) => {
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
