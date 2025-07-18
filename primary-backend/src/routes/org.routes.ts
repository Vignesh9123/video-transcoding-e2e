import express from "express";
import { createOrg, admitToOrg, getOrganizationData, getOrganizationMembers} from "../controllers/org.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/create", authMiddleware, createOrg);
router.post("/admit", authMiddleware, admitToOrg);
router.get("/data/:orgId", authMiddleware, getOrganizationData);
router.get("/members/:orgId", authMiddleware, getOrganizationMembers);


export default router;