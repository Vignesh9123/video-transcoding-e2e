import { prisma, prisma10MinsTTL } from "../config";
import { Request, Response } from "express";
export const createOrg = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) throw new Error("Missing required fields");
        const org = await prisma.organization.create({ data: { name } });
        if (!org) throw new Error("Error while creating organization");
        const userId = req.user?.id;
        if (!userId) throw new Error("Error while creating organization");
        await prisma.user.update({
            where: { id: userId },
            data: { organization: org.id, roleInOrg:"OWNER" },
        });
        res.status(200).json({ org });
        return;
    } catch (error: any) {
        res.status(500).json({ error: error?.message || "Internal server error" });
        return;
    }
};

export const admitToOrg = async (req: Request, res: Response) => {
    try {
        const { email, role } = req.body;
        if (!email) throw new Error("Missing required fields");
        const user = await prisma.user.findUnique({ where: { id: req.user.id } , cacheStrategy: prisma10MinsTTL});
        if (!user) throw new Error("User not found");
        if(!user.organization) throw new Error("User is not part of any organization");
        const org = await prisma.organization.findUnique({ where: { id: user.organization } , cacheStrategy: prisma10MinsTTL});
        if (!org) throw new Error("Organization not found");
        if(user.roleInOrg !== "OWNER") throw new Error("User is not an owner of the organization");
        const userToAdmit = await prisma.user.findUnique({ where: { email } , cacheStrategy: prisma10MinsTTL});
        if (!userToAdmit) throw new Error("User not found");
        await prisma.user.update({
            where: { id: userToAdmit.id },
            data: { organization: org.id, roleInOrg: role == "editor"? "EDITOR" : "VIEWER" },
        });
        res.status(200).json({ message: "User admitted to organization" });
        return;
        
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error?.message || "Internal server error" });
        return;
    }
}

export const getOrganizationData = async (req: Request, res: Response) => {
    try {
        const  orgId = req.params.orgId;
        if(!orgId) throw new Error("Missing required fields");
        const org = await prisma.organization.findUnique({ where: { id: orgId }, include:{
            _count:{
                select: {
                    users: true
                }
            }
        } , cacheStrategy: prisma10MinsTTL});
        if (!org) throw new Error("Organization not found");
        res.status(200).json({ ...org, userCount: org._count.users });
        return

    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error?.message || "Internal server error" });
        return;
    }
}


export const getOrganizationMembers = async(req: Request, res: Response)=>{
    try {
        const orgId = req.params.orgId;
        const userId = req.user.id;
        if(!userId) throw new Error("Unauthorized");
        const user = await prisma.user.findUnique({ where: { id: userId } , cacheStrategy: prisma10MinsTTL});
        if (!user) throw new Error("User not found");
        if(user.roleInOrg !== "OWNER") throw new Error("Unauthorized");
        if(!orgId) throw new Error("Missing required fields");
        const org = await prisma.organization.findUnique({ where: { id: orgId }, include:{users:true}, cacheStrategy: prisma10MinsTTL});
        if (!org) throw new Error("Organization not found");
        res.status(200).json({ users: org.users });
        return
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error?.message || "Internal server error" });
        return;
    }
}

export const removeFromOrg = async(req: Request, res: Response)=>{
    try {
        const {userId, orgId} = req.body;
        const currentUserId = req.user.id;
        if(!currentUserId) throw new Error("Unauthorized");
        const attemptingUser = await prisma.user.findFirst({
            where: {
              AND: [
                { id: currentUserId },
                { organization: orgId },
              ],
            },
          });
        if (!attemptingUser) throw new Error("User not found");
        if(attemptingUser.roleInOrg !== "OWNER") throw new Error("Unauthorized");
        if(!userId) throw new Error("Missing required fields");
        const user = await prisma.user.findUnique({ where: { id: userId } , cacheStrategy: prisma10MinsTTL});
        if (!user) throw new Error("User not found");
        if(!orgId) throw new Error("Missing required fields");
        const org = await prisma.organization.findUnique({ where: { id: orgId }, include:{users:true}, cacheStrategy: prisma10MinsTTL});
        if (!org) throw new Error("Organization not found");
        if(user.organization !== orgId) throw new Error("Unauthorized");
        await prisma.user.update({ where: { id: userId }, data: { organization: null } });
        res.status(200).json({ message: "User removed from organization" });
        return
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error?.message || "Internal server error" });
        return;
    }
}

export const updateRole = async(req: Request, res: Response)=>{
    try {
        const {userId, orgId, role} = req.body;
        const currentUserId = req.user.id;
        if(!currentUserId) throw new Error("Unauthorized");
        const attemptingUser = await prisma.user.findFirst({
            where: {
              AND: [
                { id: currentUserId },
                { organization: orgId },
              ],
            },
          cacheStrategy: prisma10MinsTTL});
        if (!attemptingUser) throw new Error("User not found");
        if(attemptingUser.roleInOrg !== "OWNER") throw new Error("Unauthorized");
        if(!userId) throw new Error("Missing required fields");
        const user = await prisma.user.findUnique({ where: { id: userId }, cacheStrategy: prisma10MinsTTL});
        if (!user) throw new Error("User not found");
        if(!orgId) throw new Error("Missing required fields");
        const org = await prisma.organization.findUnique({ where: { id: orgId }, cacheStrategy: prisma10MinsTTL});
        if (!org) throw new Error("Organization not found");
        if(user.organization !== orgId) throw new Error("Unauthorized");
        await prisma.user.update({ where: { id: userId }, data: { roleInOrg: role } });
        res.status(200).json({ message: "User role updated" });
        return
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error?.message || "Internal server error" });
        return;
    }
}