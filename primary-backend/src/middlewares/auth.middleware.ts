import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils";
import { User } from "../types";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token) throw new Error("Unauthorized");
        const decoded = verifyToken(token) as { id: string };
        req.user = decoded as User;
        next();
    }
    catch(error:any){
        res.status(401).json({ error: error?.message || "Unauthorized" });
        return
    }
}