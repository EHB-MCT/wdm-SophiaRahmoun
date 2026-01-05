import express from "express";
import { upload } from "../middleware/upload.js";
import { analyzeSelfie } from "../controllers/selfieController.js";
import { recordEvent } from "../controllers/eventController.js";

const router = express.Router();

router.post("/analyze", upload.single("image"), analyzeSelfie);
router.post("/event", recordEvent);

export default router;