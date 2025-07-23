import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public endpoints
router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);

// Authenticated endpoints
router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  publishAVideo
);

router.patch(
  "/:videoId",
  verifyJWT,
  upload.fields([
    { name: "thumbnail", maxCount: 1 }
  ]),
  updateVideo
);

router.delete("/:videoId", verifyJWT, deleteVideo);
router.patch("/:videoId/toggle-publish", verifyJWT, togglePublishStatus);

export default router; 