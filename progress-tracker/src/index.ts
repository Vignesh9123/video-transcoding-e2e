import {WebSocketServer, WebSocket} from 'ws'
import RedisClient from 'ioredis'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()
const wss = new WebSocketServer({ port: 9090 })
const subscribers:Map<string,Set<WebSocket>> = new Map<string,Set<WebSocket>>();
const redis = new RedisClient(process.env.REDIS_URL!)

redis.on('connect', () => console.log("CONNECTED TO REDIS DB"))
redis.psubscribe('video-progress*', (err , content)=>{
    if(err){
        console.log("error", err)
        return
    }
    console.log("SUBSCRIBED TO CHANNEL COUNT", content)
})

redis.on('pmessage', (_, channel, message)=>{
    console.log("MESSAGE", channel, message)
    const videoId = channel.split(":")?.[1]
    if(!videoId) return
    if(!subscribers.has(videoId)) return
    subscribers.get(videoId)?.forEach(ws => {
        if(ws.readyState === WebSocket.OPEN){
        const messageJson = JSON.parse(message.toString())
        const msg = {
            videoId,
            progress: messageJson.progress,
            status: messageJson.status
        }
        ws.send(JSON.stringify(msg))
        }
    })
})


wss.on('connection', (ws:WebSocket, req) => {
    try {
        const reqUrl = new URL(req?.url!, `http://${req.headers.host}`);
        const token = reqUrl.searchParams.get("token");
    
        if (!token) {
          ws.close(4001, "Token missing");
          return;
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (ws as any).user = decoded; // TODO: find a better way 

      } catch (err) {
        ws.close(4002, "Invalid token");
      }
    ws.on('message', (message) => {
        try {
            const messageJson = JSON.parse(message.toString())
            if(messageJson.type === "SUBSCRIBE"){
                const {videoId} = messageJson
                if(!subscribers.has(videoId)){
                    subscribers.set(videoId, new Set())
                }
                subscribers.get(videoId)?.add(ws)
            }

            if(messageJson.type === "UNSUBSCRIBE"){
                const {videoId} = messageJson
                if(subscribers.has(videoId)){
                    if(!subscribers.get(videoId)?.has(ws)) return
                    subscribers.get(videoId)?.delete(ws)
                    if(subscribers.get(videoId)?.size === 0){
                        subscribers.delete(videoId)
                    }
                }
            }
        } catch (error) {
            console.log("error", error)
            ws.close()
        }
    })
    ws.on('close', () => {
        for (const [videoId, sockets] of subscribers.entries()) {
            const filtered = Array.from(sockets).filter(sock => sock !== ws);
            if (filtered.length > 0) {
                subscribers.set(videoId, new Set(filtered));
            } else {
                subscribers.delete(videoId);
            }
        }
    });
})

