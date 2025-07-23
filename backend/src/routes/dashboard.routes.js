import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/:channelId/stats', verifyJWT, getChannelStats);

router.get('/:channelId/videos', verifyJWT, getChannelVideos);

export default router; 