import User from "../models/User.js";
import SelfieAnalysis from "../models/SelfieAnalysis.js";
import Event from "../models/Event.js";
import { analyzeFace } from "../services/faceAnalysis.js";
import { calculateImageMetrics } from "../services/imageMetrics.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const analyzeSelfie = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const { uid } = req.body;
    let user;

    if (uid) {
      user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.lastSeen = new Date();
    } else {
      const newUid = uuidv4();
      user = new User({ uid: newUid });
    }

    const imagePath = req.file.path;
    
    // Perform face analysis
    const faceAnalysis = await analyzeFace(imagePath);
    
    // Calculate image metrics
    const imageMetrics = await calculateImageMetrics(imagePath);
    
    // Create selfie analysis record
    const analysis = new SelfieAnalysis({
      uid: user.uid,
      imageUrl: `/uploads/${path.basename(imagePath)}`,
      ...faceAnalysis,
      ...imageMetrics,
    });
    
    // Save all records
    await Promise.all([
      user.save(),
      analysis.save(),
      Event.create({
        uid: user.uid,
        type: "selfie_upload",
        data: { analysisId: analysis._id },
      }),
      Event.create({
        uid: user.uid,
        type: "analysis_complete",
        data: { 
          faceDetected: faceAnalysis.faceDetected,
          emotion: faceAnalysis.dominantEmotion,
          brightness: imageMetrics.brightness,
        },
      }),
    ]);

    // Update user selfie count
    user.selfieCount = await SelfieAnalysis.countDocuments({ uid: user.uid });
    await user.save();

    res.json({
      uid: user.uid,
      analysis: {
        faceDetected: faceAnalysis.faceDetected,
        estimatedAge: faceAnalysis.estimatedAge,
        gender: faceAnalysis.gender,
        dominantEmotion: faceAnalysis.dominantEmotion,
        brightness: imageMetrics.brightness,
        backgroundClutter: imageMetrics.backgroundClutter,
        speculativeBMI: imageMetrics.speculativeBMI,
        speculativeSocialClass: imageMetrics.speculativeSocialClass,
      },
    });
  } catch (error) {
    console.error("Selfie analysis error:", error);
    res.status(500).json({ error: error.message });
  }
};