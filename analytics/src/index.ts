import { clickhouseClient, PORT } from './config'
import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors({
  origin: '*'
}))

app.post('/add-view', async (req, res) => {
  try {
    const { videoId } = req.body;
    await clickhouseClient.insert({
      table: 'video_views',
      values: [{ video_id: videoId }],
      format: 'JSONEachRow',
      columns: ['video_id']
    })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

app.get('/get-views/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    if(!videoId) return res.sendStatus(411);
    const views = await clickhouseClient.query({
      query: `SELECT sum(views) as views FROM "video_view_counts" WHERE video_id = {videoId:String};`,
      query_params:{
        videoId
      }
    })
    const response = await views.json();
    console.log('response', response)
    res.sendStatus(200);
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

