import express from "express";
import { createOrg, admitToOrg} from "../controllers/org.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/create", authMiddleware, createOrg);
router.get("/admit", authMiddleware, admitToOrg);

export default router;