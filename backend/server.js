// sets up middleware
// connects to the db (mongodb)

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes.js";
import { insertFakeData } from "./controllers/analysisController.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/analysis", analysisRoutes);

app.get("/", (req, res) => {
	res.send("API is running");
});

mongoose
	.connect(process.env.MONGO_URI, {
	})
	.then(() => {
		console.log(" MongoDB connected!");
	});

app.get("/test-seed", insertFakeData);

app.listen(3000, () => {
	console.log(`✅ Server running at http://localhost:3000`);
});
