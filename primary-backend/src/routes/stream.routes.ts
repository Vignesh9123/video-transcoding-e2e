import { Router } from "express";
const router = Router();
import { stream } from "../controllers/stream.controller";

router.get("/", stream);

export default router;