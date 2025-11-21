import express from "express";
import {
	getAllAnalysis,
	insertFakeData,
	createAnalysis,
} from "../controllers/analysisController.js";

const router = express.Router();

router.get("/", getAllAnalysis);
router.post("/seed", insertFakeData);
router.post("/", createAnalysis);

export default router;
