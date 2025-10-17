// sets up middleware
// connects to the db (mongodb)

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/analysis", analysisRoutes);

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(process.env.PORT, () =>
			console.log(`server running at http://localhost:${process.env.PORT}`)
		);
	})
	.catch((err) => console.error("mongoDB connection failed:", err));
