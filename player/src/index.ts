import express from 'express'
import { env } from './config'
import fs from 'fs/promises'
import path from 'path'

const app = express()

app.get('/:videoId', async(req, res) => {
    const {videoId} = req.params
    const fc = await fs.readFile(path.join(__dirname, 'files', 'player.html'))
    const dynamicfc = fc.toString().replace("{{M3U8_URL}}", `${env.BUCKET_URL}/${videoId}/master.m3u8`)
    res.contentType('html')
    res.send(dynamicfc)
})
app.get('/sample/:videoId', async(req, res) => {
    const { videoId } = req.params
    const fc = await fs.readFile(path.join(__dirname, 'files', 'player-sample.html'))
    const dynamicfc = fc.toString()
    .replace("{{M3U8_URL}}", `${env.BUCKET_URL}/${videoId}/master.m3u8`)
    .replace("{{MAIN_APP_URL}}", env.MAIN_APP_URL)
    .replace("{{ANALYTICS_URL}}", env.ANALYTICS_URL)
    .replace("{{VIDEO_ID}}", videoId)
    res.contentType('html')
    res.send(dynamicfc)
})
app.listen(env.PORT, ()=>{
    console.log(`Server is running on port ${env.PORT}`)
})
