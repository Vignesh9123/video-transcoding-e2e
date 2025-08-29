import { Router } from "express";
import { currentUser } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.get('/current-user', authMiddleware, currentUser)

export default router