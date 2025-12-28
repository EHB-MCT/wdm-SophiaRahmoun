import express from "express";
import { upload } from "../middleware/upload.js";
import { analyzeSelfie } from "../controllers/selfieController.js";

const router = express.Router();

router.post("/analyze", upload.single("image"), analyzeSelfie);

export default router;