import {WebSocketServer, WebSocket} from 'ws'
import RedisClient from 'ioredis'

const wss = new WebSocketServer({ port: 9090 })
const subscribers:Map<string,Set<WebSocket>> = new Map<string,Set<WebSocket>>();
const redis = new RedisClient()
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
            ws.send(message)
        }
    })
})


wss.on('connection', (ws:WebSocket) => {
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

