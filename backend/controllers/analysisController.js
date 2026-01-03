import Analysis from "../models/Analysis.js";
import {
	estimateGender,
	estimateEmotion,
} from "../services/analysisHeuristics.js";
import {
	validateAnalysisData,
	sanitizeAnalysisData,
} from "../utils/analysisValidation.js";

export const insertFakeData = async (req, res) => {
	console.log("📥 POST /api/analysis/seed called (fallback version)");
	try {
		await Analysis.deleteMany({});

		const inserted = await Analysis.insertMany([
			{
				userId: "U001",
				emotion: "happy",
				lightLevel: "low",
			},
			{
				userId: "U002",
				emotion: "sad",
				lightLevel: "high",
			},
		]);

		res.json(inserted);
	} catch (err) {
		console.error("❌ insert failed:", err);
		res.status(500).json({ error: err.message });
	}
};

export const getAllAnalysis = async (req, res) => {
	try {
		const data = await Analysis.find();
		res.json(data);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to fetch data." });
	}
};

export const createAnalysis = async (req, res) => {
	try {
		const { isValid, errors } = validateAnalysisData(req.body);
		if (!isValid) {
			return res.status(400).json({ errors });
		}

		const sanitizedData = sanitizeAnalysisData(req.body);

		const {
			uid,
			faceDetected,
			estimatedAge,
			brightness,
			backgroundClutter,
			interactionDuration,
			deviceInfo,
		} = sanitizedData;

		const gender = estimateGender({
			brightness,
			backgroundClutter,
			interactionDuration,
			deviceInfo,
		});

		const dominantEmotion = estimateEmotion({
			brightness,
			interactionDuration,
			hour: sanitizedData.hour,
			retakeCount: sanitizedData.retakeCount,
		});
		const ip =
			req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

		const locationHint = {
			ip,
			country: req.headers["cf-ipcountry"] || "unknown",
		};

		const userAgent = req.headers["user-agent"] || "unknown";

		const analysis = new Analysis({
			uid,
			faceDetected,
			estimatedAge,
			gender,
			dominantEmotion,
			brightness,
			backgroundClutter,
			interactionDuration,
			deviceInfo: {
				...sanitizedData.deviceInfo,
				ip,
				locationHint,
				userAgent,
			},
		});

		const savedAnalysis = await analysis.save();

		res.status(201).json({
			success: true,
			analysis: {
				id: savedAnalysis._id,
				faceDetected: savedAnalysis.faceDetected,
				estimatedAge: savedAnalysis.estimatedAge,
				gender: savedAnalysis.gender,
				dominantEmotion: savedAnalysis.dominantEmotion,
				brightness: savedAnalysis.brightness,
				backgroundClutter: savedAnalysis.backgroundClutter,
				deviceInfo: savedAnalysis.deviceInfo,
				interactionDuration: savedAnalysis.interactionDuration,
				timestamp: savedAnalysis.timestamp,
			},
		});
	} catch (err) {
		console.error("❌ createAnalysis failed:", err);
		res.status(500).json({ error: err.message });
	}
};
