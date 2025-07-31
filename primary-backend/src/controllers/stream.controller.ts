import { Request, Response } from "express";
import { verifyToken } from "../utils";
import { prisma, prisma10MinsTTL } from "../config";

export const stream = async(req: Request, res: Response)=>{
    try {
        const {token} = req.query
        if(!token) throw new Error("Missing required fields");
        const decoded = verifyToken(token as string)
        if(!decoded) throw new Error("Unauthorized");
        const {videoId, userId}:{videoId: string, userId: string} = decoded as {videoId: string, userId: string}
        if(!videoId || !userId) throw new Error("Unauthorized");
        const video = await prisma.video.findUnique({where:{id:videoId}, include:{User:true, Organization:true}, cacheStrategy: prisma10MinsTTL})
        if(!video) throw new Error("Unauthorized");
        if(!video.url) throw new Error("Not Available");
        if(video.status !== "COMPLETED") throw new Error("Not Available");
        const user = await prisma.user.findUnique({where:{id:userId}, include:{Organization:true}, cacheStrategy: prisma10MinsTTL})
        if(user?.roleInOrg == "OWNER"){
            if(user.organization !== video.organization) throw new Error("Unauthorized");
           
            res.status(200).redirect(video.url)
              return
        }
        else if(user?.roleInOrg == "EDITOR"){
            if(user.organization !== video.organization) throw new Error("Unauthorized");
            if(user.id !== video.userId) throw new Error("Unauthorized");
            res.status(200).redirect(video.url)
        }
        else if(user?.roleInOrg == "VIEWER"){
            if(user.organization !== video.organization) throw new Error("Unauthorized");
            if(!video.isPublic) throw new Error("Unauthorized");
            res.status(200).redirect(video.url)
        }
        else{
            throw new Error("Unauthorized");
        }
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error?.message || "Internal server error" });
        
    }
}