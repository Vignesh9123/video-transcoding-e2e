import express from "express";
import { createOrg, admitToOrg, getOrganizationData, getOrganizationMembers, removeFromOrg, updateRole} from "../controllers/org.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/create", authMiddleware, createOrg);
router.post("/admit", authMiddleware, admitToOrg);
router.get("/data/:orgId", authMiddleware, getOrganizationData);
router.get("/members/:orgId", authMiddleware, getOrganizationMembers);
router.post("/remove", authMiddleware, removeFromOrg);
router.post("/update-role", authMiddleware, updateRole);


export default router;