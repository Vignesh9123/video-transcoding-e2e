import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { User } from "../types";
import { fromNodeHeaders } from "better-auth/node";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
          });
        if(!session) throw new Error("Unauthorized");
        const user = {id: session.user.id}
        req.user = user
        next();
    }
    catch(error:any){
        res.status(401).json({ error: error?.message || "Unauthorized" });
        return
    }
}