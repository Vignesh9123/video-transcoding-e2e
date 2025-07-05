import express from "express";
import { currentUser, googleLogin, logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/google-login", googleLogin);
router.get("/current-user", authMiddleware, currentUser);
router.get("/logout", authMiddleware, logout);

export default router;