import express from "express";
import User from "../models/User.js";
import SelfieAnalysis from "../models/SelfieAnalysis.js";
import Event from "../models/Event.js";

const router = express.Router();

// Get all users with basic stats
router.get("/users", async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "selfieanalyses",
          localField: "uid",
          foreignField: "uid",
          as: "selfies",
        },
      },
      {
        $addFields: {
          selfieCount: { $size: "$selfies" },
          lastEmotion: { $arrayElemAt: ["$selfies.dominantEmotion", -1] },
          lastAnalysisDate: { $max: "$selfies.createdAt" },
        },
      },
      {
        $project: {
          uid: 1,
          createdAt: 1,
          lastSeen: 1,
          selfieCount: 1,
          lastEmotion: 1,
          lastAnalysisDate: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user detail with all analyses
router.get("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const analyses = await SelfieAnalysis.find({ uid }).sort({ createdAt: -1 });
    const events = await Event.find({ uid }).sort({ timestamp: -1 }).limit(50);

    res.json({
      user,
      analyses,
      events,
    });
  } catch (error) {
    console.error("Get user detail error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get analytics data
router.get("/analytics", async (req, res) => {
  try {
    const { ageRange, emotion, dateRange } = req.query;
    
    let matchStage = {};
    
    // Age range filter
    if (ageRange) {
      const [min, max] = ageRange.split("-").map(Number);
      matchStage.estimatedAge = { $gte: min, $lte: max };
    }
    
    // Emotion filter
    if (emotion) {
      matchStage.dominantEmotion = emotion;
    }
    
    // Date range filter
    if (dateRange) {
      const days = parseInt(dateRange);
      matchStage.createdAt = { 
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
      };
    }

    const analytics = await SelfieAnalysis.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAnalyses: { $sum: 1 },
          avgAge: { $avg: "$estimatedAge" },
          emotionCounts: {
            $push: "$dominantEmotion",
          },
          genderCounts: {
            $push: "$gender",
          },
          avgBrightness: { $avg: "$brightness" },
          avgClutter: { $avg: "$backgroundClutter" },
        },
      },
    ]);

    if (analytics.length === 0) {
      return res.json({
        totalAnalyses: 0,
        avgAge: 0,
        emotionBreakdown: {},
        genderBreakdown: {},
        avgBrightness: 0,
        avgClutter: 0,
      });
    }

    const data = analytics[0];
    const emotionBreakdown = data.emotionCounts.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});
    
    const genderBreakdown = data.genderCounts.reduce((acc, gender) => {
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalAnalyses: data.totalAnalyses,
      avgAge: Math.round(data.avgAge * 10) / 10,
      emotionBreakdown,
      genderBreakdown,
      avgBrightness: Math.round(data.avgBrightness * 100) / 100,
      avgClutter: Math.round(data.avgClutter * 100) / 100,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;