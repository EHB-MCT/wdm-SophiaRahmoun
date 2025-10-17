//handles logic for routes (functions used by routes)

import Analysis from "../models/Analysis.js";
import { readFile } from "fs/promises";

export const insertFakeData = async (req, res) => {
  try {
    const jsonData = await readFile(new URL("../data/fakeData.json", import.meta.url));
    const fakeData = JSON.parse(jsonData);

    await Analysis.deleteMany({});
    const inserted = await Analysis.insertMany(fakeData);
    res.json(inserted);
  } catch (err) {
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

