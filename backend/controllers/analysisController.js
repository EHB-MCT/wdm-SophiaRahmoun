//handles logic for routes (functions used by routes)

import Analysis from "../models/Analysis.js";
import { readFile } from "fs/promises";

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
		const { userId, emotion, lightLevel } = req.body;
		const newAnalysis = new Analysis({ userId, emotion, lightLevel });
		const saved = await newAnalysis.save();
		res.status(201).json(saved);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
