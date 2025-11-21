// sets up middleware
// connects to the db (mongodb)

import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

//app.use("/api/analysis", analysisRoutes);

app.get("/", (req, res) => {
	res.send("API is running");
});

app.listen(3000, () => {
	console.log(`✅ Server running at http://localhost:3000`);
});
