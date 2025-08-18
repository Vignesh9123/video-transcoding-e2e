// import { app } from "../config/firebase-admin";
// import { Request, Response } from "express";
// import { prisma, prisma10MinsTTL } from "../config";
// import { generateToken } from "../utils";
// export const googleLogin = async (req: Request, res: Response) => {

//     try {
//         const { idtoken }: { idtoken: string } = req.body;
//         if (!idtoken) throw new Error("Missing required fields");
//         const decodedToken = await app.auth().verifyIdToken(idtoken)
//         const { name, email } = decodedToken
//         let user = await prisma.user.findUnique({ where: { email, loginType: "google" }, cacheStrategy: prisma10MinsTTL});
//         if (user) {
//             const token = generateToken({id:user.id});
//             res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
//             res.status(200).json({ user, token });
//             return
//         }
//         if (!name || !email) throw new Error("Missing required fields");
//         user = await prisma.user.create({ data: { name, email, loginType: "google" } });
//         if (!user) throw new Error("Error while signing up");
//         const token = generateToken({id:user.id});
//         res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
//         res.status(200).json({ user, token });
//         return
//     }
//     catch (error: any) {
//         res.status(500).json({ error: error?.message || "Internal server error" });
//         return
//     }
// }

// export const currentUser = async (req: Request, res: Response) => {
//     try{
//         const userId = req.user?.id;
//         const user = await prisma.user.findUnique({ where: { id: userId } , cacheStrategy: prisma10MinsTTL});
//         if(!user) throw new Error("Error while fetching user");
//         const token = generateToken({id:user.id});
//         res.status(200).json({ user, token });
//         return
//     }
//     catch(error:any){
//         res.status(500).json({ error: error?.message || "Internal server error" });
//         return
//     }
// }

// export const logout = async (req: Request, res: Response) => {
//     try{
//         res.clearCookie("token", { httpOnly: true , sameSite: "none", secure: true });
//         res.status(200).json({ message: "Logout successful" });
//         return
//     }
//     catch(error:any){
//         res.status(500).json({ error: error?.message || "Internal server error" });
//         return
//     }
// }
