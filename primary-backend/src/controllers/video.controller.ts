import { Request, Response } from "express";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config, prisma, prisma10MinsTTL } from "../config";
import { generateToken } from "../utils";
export const getPresignedUrl = async (req: Request, res: Response) => {
    try {
        const { name, isPublic, selectedResolutions } = req.body
        const { id } = req.user
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if (!user?.organization) throw new Error('User is not part of any organization')
        const video = await prisma.video.create({
            data: {
                name,
                userId: id,
                organization: user?.organization,
                isPublic: user.roleInOrg == "OWNER" ? isPublic: false,
                variants: selectedResolutions.length > 0 ? selectedResolutions : ['360p', '480p', '720p']
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
        console.log(error)
        res.status(500).json({
            message: 'Failed to generate presigned URL',
            success: false
        })
    }
}

export const getUserVideos = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id!;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if (!user?.organization) throw new Error('User is not part of any organization')
        if (user.roleInOrg == "OWNER") {
            const videos = await prisma.video.findMany({
                where: {
                    organization: user.organization
                },
                orderBy: [{
                    createdAt: 'desc'
                }, {
                    name: 'asc'
                }
                ],
                include: {
                    User: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                // cacheStrategy: prisma10MinsTTL
            })
            res.status(200).json({
                data: videos,
                success: true,
                message: "Videos fetched successfully"
            })
        }
        else if (user.roleInOrg == "EDITOR") {
            const videos = await prisma.video.findMany({
                where: {
                    userId: userId
                },
                orderBy: [{
                    createdAt: 'desc'
                }, {
                    name: 'asc'
                }
                ],
                // cacheStrategy: prisma10MinsTTL
            })
            res.status(200).json({
                data: videos,
                success: true,
                message: "Videos fetched successfully"
            })
        }
        else {
            const videos = await prisma.video.findMany({
                where: {
                    organization: user.organization,
                    isPublic: true
                },
                orderBy: [{
                    createdAt: 'desc'
                }, {
                    name: 'asc'
                }
                ],
                include: {
                    User: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                // cacheStrategy: prisma10MinsTTL
            })
            res.status(200).json({
                data: videos,
                success: true,
                message: "Videos fetched successfully"
            })
        }
    } catch (error: any) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const getVideoStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const videoId = req.params.videoId
        console.log('User id ', userId)
        console.log('Video id ', videoId)
        if (!videoId) {
            console.log("Theres no video Id");
            res.status(400).json({
                success: false,
                message: "Please provide Video Id"
            })
            return
        }
        const video = await prisma.video.findUnique({
            where: {
                id: videoId
            }
        })

        if (!video) {
            console.log("Theres no video with this id");
            res.status(400).json({
                success: false,
                message: "Please provide correct video Id"
            })
            return
        }

        if (video.userId.toString() !== userId?.toString()) {
            console.log("This video doesn't belong to this user");
            res.status(403).json({
                success: false,
                message: "This video doesn't belong to this user"
            })
            return
        }

        const status = video.status
        const progress = video.progress || 0

        res.status(200).json({
            success: true,
            data: {
                videoId,
                status,
                progress
            },
            message: "Status fetched successfully"
        })
    } catch (error: any) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }

}

export const deleteVideo = async (req: Request, res: Response) => {
    const videoId = req.params.videoId
    try {
        const video = await prisma.video.findUnique({
            where: {
                id: videoId
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if (!video) {
            console.log("Theres no video with this id");
            res.status(400).json({
                success: false,
                message: "Please provide correct video Id"
            })
            return
        }
        if (video.userId.toString() !== req.user?.id?.toString()) {
            console.log("This video doesn't belong to this user");
            res.status(403).json({
                success: false,
                message: "This video doesn't belong to this user"
            })
            return
        }
        await prisma.video.delete({
            where: {
                id: videoId
            }
        })
        res.status(200).json({
            success: true,
            message: "Video deleted successfully"
        })
    } catch (error: any) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const getVideoStatusBulk = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const videos = []
        const { videoIds }: { videoIds: string[] } = req.body
        for (let videoId of videoIds) {
            const video = await prisma.video.findUnique({
                where: { id: videoId },
                // cacheStrategy: prisma10MinsTTL
            })
            if (video) {
                if (video.userId.toString() === userId?.toString())
                    videos.push(video)
            }
        }
        const responseVideos: {
            status: string,
            progress: number,
            videoId: string
        }[] = []
        for (let video of videos) {
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
            message: "Statuses fetched successfully"
        })
    } catch (error: any) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }



}

export const getVideoURL = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const videoId = req.params.videoId
        if (!videoId) {
            console.log("Theres no video Id");
            res.status(400).json({
                success: false,
                message: "Please provide Video Id"
            })
            return
        }

        const video = await prisma.video.findUnique({
            where: {
                id: videoId
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if (!video) {
            console.log("Theres no video with this id");
            res.status(400).json({
                success: false,
                message: "Please provide correct video Id"
            })
            return
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if (!user) {
            console.log("Theres no user with this id");
            res.status(400).json({
                success: false,
                message: "Please provide correct user Id"
            })
            return
        }
        if (!video.url) {
            console.log("Theres no url for this video");
            res.status(400).json({
                success: false,
                message: "Please provide correct video Id"
            })
            return
        }
        if (user.organization != video.organization) {
            console.log("This video doesn't belong to this user");
            res.status(403).json({
                success: false,
                message: "This video doesn't belong to this user"
            })
            return
        }
        const streamUrl = `${req.protocol}://${req.headers.host}/api/stream`
        if (user.roleInOrg == "OWNER") {
            const token = generateToken({ videoId: video.id, userId: user.id })
            if(!token) throw new Error("Internal Server Error");
            const url = streamUrl+"?token="+token
            res.status(200).json({
                success: true,
                data: url,
                message: "URL fetched successfully"
            })
            return
        }
        if (user.roleInOrg == "EDITOR") {
            if (video.userId.toString() !== userId?.toString()) {
                console.log("This video doesn't belong to this user");
                res.status(403).json({
                    success: false,
                    message: "This video doesn't belong to this user"
                })
                return
            }
            const token = generateToken({ videoId: video.id, userId: user.id })
            if(!token) throw new Error("Internal Server Error");
            const url = streamUrl+"?token="+token
            res.status(200).json({
                success: true,
                data: url,
                message: "URL fetched successfully"
            })
            return
        }
        if (user.roleInOrg == "VIEWER") {
            if (!video.isPublic) {
                console.log("This video is not public");
                res.status(403).json({
                    success: false,
                    message: "This video is not public"
                })
                return
            }
            const token = generateToken({ videoId: video.id, userId: user.id })
            if(!token) throw new Error("Internal Server Error");
            const url = streamUrl+"?token="+token
            res.status(200).json({
                success: true,
                data: url,
                message: "URL fetched successfully"
            })
            return
        }
        throw new Error('User is not part of any organization')
    } catch (error: any) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }

}

export const toggleVideoVisibility = async(req: Request, res: Response)=>{
    try {
        const videoId = req.params.videoId;
        const userId = req.user.id
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if(!user) throw new Error("No user with that ID")
        if(user.roleInOrg != "OWNER") throw new Error("Unauthorized");
        const video = await prisma.video.findUnique({
            where:{
                id: videoId
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if(!video) throw new Error("No video with that ID")
        if(user.organization != video.organization) throw new Error("Unauthorized");
        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                isPublic: !video.isPublic
            }
        })
        res.status(200).json({
            success: true,
            message: "Video visibility toggled successfully"
        })
        return
    } catch (error: any) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const updateVideoStatus = async(req: Request, res: Response)=>{
    try {
        const {videoId, status} = req.body;
        const userId = req.user.id
        
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if(!user) throw new Error("No user with that ID")
        
        const video = await prisma.video.findUnique({
            where:{
                id: videoId
            },
            // cacheStrategy: prisma10MinsTTL
        })
        if(!video) throw new Error("No video with that ID")
        if(user.organization != video.organization || (user.roleInOrg != "OWNER" && user.roleInOrg != "EDITOR")) throw new Error("Unauthorized");
        if(user.roleInOrg == "EDITOR" && user.id != video.userId) throw new Error("Unauthorized");
        if(status != "FAILED"){ // We only allow updating status to "FAILED" coz that's the only use case right now
            res.status(400).json({
                success: false,
                message: "Please provide correct status"
            })
            return
        }
        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                status
            }
        })
        res.status(200).json({
            success: true,
            message: "Video status updated successfully"
        })
        return
    } catch (error: any) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}