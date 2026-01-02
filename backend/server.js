// sets up middleware
// connects to the db (mongodb)

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import analysisRoutes from "./routes/analysisRoutes.js";
import selfieRoutes from "./routes/selfieRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { insertFakeData } from "./controllers/analysisController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/analysis", analysisRoutes);
app.use("/api/selfie", selfieRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
	res.send("API is running");
});

const MONGO_URI =
	process.env.MONGO_URI || "mongodb://localhost:27017/wdm";

mongoose
	.connect(process.env.MONGO_URI, {
	})
	.then(() => {
		console.log(" MongoDB connected!");
	});

app.get("/test-seed", insertFakeData);

app.listen(3000, () => {
	console.log(` Server running at http://localhost:3000`);
});
