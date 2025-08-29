import { Request, Response } from "express";
import { prisma, prisma10MinsTTL } from "../config";
import { generateToken } from "../utils";
export const currentUser = async(req: Request, res: Response) => {
    try{
        const userId = req.user.id
        if(!userId) throw new Error("Unauthorized");
        const user = await prisma.user.findUnique({ 
            where: { id: userId }, 
            cacheStrategy: prisma10MinsTTL
        });
        if(!user) throw new Error("Error while fetching user");
        const token = generateToken({id:user.id}); // this is Required as i am using this in ws auth
        res.status(200).json({ user, token });
        return
    }
    catch(error:any){
        res.status(500).json({ error: error?.message || "Internal server error" });
        return
    }
}