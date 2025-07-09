import { Request, Response } from "express";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config, prisma } from "../config";
export const getPresignedUrl = async(req: Request, res: Response) => {
    try {
        const {name} = req.body
        const {id} = req.user
        const video = await prisma.video.create({
            data:{
                name,
                userId: id
            }
        })
        const s3Client = new S3Client({
            region: config.AWS_REGION,
            credentials: {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY
            }
        })
        const command = new PutObjectCommand({
            Bucket: config.S3_UPLOAD_BUCKET_NAME,
            Key: video.id
        })
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 60          
        })
        res.status(200).json({
            key: video.id,
            signedUrl,
            message: 'Successfully generated presigned URL',
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to generate presigned URL',
            success: false
        })
    }
}

export const getUserVideos = async(req: Request, res: Response)=>{
    try {
        const userId = req.user?.id!;
        const videos = await prisma.video.findMany({
            where: {
                userId
            },
            orderBy: [{
                createdAt: 'desc'
            },{
                name: 'asc'
            }
            ]
        })

        res.status(200).json({
            data: videos,
            success: true,
            message:"Videos fetched successfully"
        })
        
    } catch (error: any) {
        console.log("Error", error);
        res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
        })
    }
}

export const getVideoStatus = async(req: Request, res: Response)=>{
    try {
        const userId = req.user?.id
        const videoId = req.params.videoId
        console.log('User id ', userId)
        console.log('Video id ', videoId)
        if(!videoId){
            console.log("Theres no video Id");
            res.status(400).json({
                success:false,
                message:"Please provide Video Id"
            })
            return
        }
        const video = await prisma.video.findUnique({
            where:{
                id: videoId
            }
        })
        
        if(!video){
            console.log("Theres no video with this id");
            res.status(400).json({
                success:false,
                message:"Please provide correct video Id"
            })
            return
        }
    
        if(video.userId.toString() !== userId?.toString()){
            console.log("This video doesn't belong to this user");
            res.status(403).json({
                success:false,
                message:"This video doesn't belong to this user"
            })
            return
        }
    
        const status = video.status 
        const progress = video.progress || 0
    
        res.status(200).json({
            success: true,
            data:{
                videoId,
                status,
                progress
            },
            message:"Status fetched successfully"
        })
    } catch (error:any) {
        console.log("Error", error);
        res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
        })
    }

}
    
export const getVideoStatusBulk = async(req: Request, res: Response)=>{
    try {
        const userId = req.user?.id
        const videos = []
        const {videoIds}:{videoIds: string[]} = req.body
        for(let videoId of videoIds){
            const video = await prisma.video.findUnique({
                where:{id: videoId}
            })
            if(video){
                if(video.userId.toString() === userId?.toString())
                    videos.push(video)
            }
        }
        const responseVideos:{
            status: string,
            progress: number,
            videoId: string
        }[] = []
        for(let video of videos){
            const obj = {
                status: video.status,
                progress: video.progress || 0,
                videoId: video.id
            }
            responseVideos.push(obj)
        }
    
        res.status(200).json({
            success: true,
            data: responseVideos,
            message:"Statuses fetched successfully"
        })
    } catch (error:any) {
        console.log("Error", error);
        res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
        })
    }

    
    
}

export const getVideoURL = async(req: Request, res: Response)=>{
    try {
        const userId = req.user?.id
        const videoId = req.params.videoId
        if(!videoId){
            console.log("Theres no video Id");
            res.status(400).json({
                success:false,
                message:"Please provide Video Id"
            })
            return
        }
        
        const video = await prisma.video.findUnique({
            where:{
                id: videoId
            }
        })
        if(!video){
            console.log("Theres no video with this id");
            res.status(400).json({
                success:false,
                message:"Please provide correct video Id"
            })
            return
        }
    
        if(video.userId.toString() !== userId?.toString()){
            console.log("This video doesn't belong to this user");
            res.status(403).json({
                success:false,
                message:"This video doesn't belong to this user"
            })
            return
        }
        const url = video.url
        res.status(200).json({
            success: true,
            data: url,
            message:"URL fetched successfully"
        })
    } catch (error:any) {
        console.log("Error", error);
        res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
        })
    }

}