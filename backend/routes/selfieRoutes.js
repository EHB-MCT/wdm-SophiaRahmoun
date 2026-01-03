import express from "express";
import { upload } from "../middleware/upload.js";
import { analyzeSelfie } from "../controllers/selfieController.js";

const router = express.Router();

<<<<<<< Updated upstream
router.post("/analyze", upload.single("image"), analyzeSelfie);
=======
router.post("/analyze", (req, res, next) => {
  console.log(' ROUTE HIT: /api/selfie/analyze');
  next();
}, upload.single("image"), analyzeSelfie);

router.post("/event", (req, res, next) => {
  console.log('🔥 ROUTE HIT: /api/selfie/event');
  next();
}, recordEvent);
>>>>>>> Stashed changes

export default router;