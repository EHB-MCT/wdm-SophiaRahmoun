import User from "../models/User.js";
import SelfieAnalysis from "../models/SelfieAnalysis.js";
import Event from "../models/Event.js";
import { validateAnalysisData, sanitizeAnalysisData } from "../utils/validation.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const analyzeSelfie = async (req, res) => {
  try {
    // Handle both JSON and multipart data
    const analysisData = req.body;
    
    // Validate incoming analysis data
    const validation = validateAnalysisData(analysisData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: "Invalid analysis data", 
        details: validation.errors 
      });
    }
    
    // Sanitize data
    const sanitizedData = sanitizeAnalysisData(analysisData);
    
    let user;
    if (sanitizedData.uid) {
      user = await User.findOne({ uid: sanitizedData.uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.lastSeen = new Date();
    } else {
      // Create new user if no UID provided
      const newUid = uuidv4();
      user = new User({ uid: newUid });
      sanitizedData.uid = newUid;
    }

    // Handle image upload if present
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${path.basename(req.file.path)}`;
    }

    // Create selfie analysis record with received data
    const analysis = new SelfieAnalysis({
      uid: user.uid,
      imageUrl,
      faceDetected: sanitizedData.faceDetected,
      estimatedAge: sanitizedData.estimatedAge,
      gender: sanitizedData.gender,
      dominantEmotion: sanitizedData.dominantEmotion,
      brightness: sanitizedData.brightness,
      backgroundClutter: sanitizedData.backgroundClutter,
      // Behavioral data
      deviceInfo: sanitizedData.deviceInfo || {},
      interactionDuration: sanitizedData.interactionDuration,
      timestamp: new Date(sanitizedData.timestamp || Date.now()),
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
          faceDetected: sanitizedData.faceDetected,
          emotion: sanitizedData.dominantEmotion,
          brightness: sanitizedData.brightness,
        },
      }),
    ]);

    // Update user selfie count
    user.selfieCount = await SelfieAnalysis.countDocuments({ uid: user.uid });
    await user.save();

    console.log(`✅ Analysis saved for user ${user.uid}:`, {
      faceDetected: sanitizedData.faceDetected,
      emotion: sanitizedData.dominantEmotion,
      brightness: sanitizedData.brightness,
    });

    res.json({
      uid: user.uid,
      analysis: {
        id: analysis._id,
        faceDetected: analysis.faceDetected,
        estimatedAge: analysis.estimatedAge,
        gender: analysis.gender,
        dominantEmotion: analysis.dominantEmotion,
        brightness: analysis.brightness,
        backgroundClutter: analysis.backgroundClutter,
      },
      message: "Analysis saved successfully",
    });
  } catch (error) {
    console.error("❌ Selfie analysis save error:", error);
    res.status(500).json({ error: "Failed to save analysis" });
  }
};

export const recordEvent = async (req, res) => {
  try {
    const { uid, type, data } = req.body;
    
    if (!uid || !type) {
      return res.status(400).json({ error: "UID and event type are required" });
    }

    const event = new Event({
      uid,
      type,
      data: data || {},
      timestamp: new Date(),
    });

    await event.save();
    
    console.log(`📊 Event recorded: ${type} for user ${uid}`);
    
    res.json({ 
      success: true, 
      eventId: event._id,
      message: "Event recorded successfully"
    });
  } catch (error) {
    console.error("❌ Event recording error:", error);
    res.status(500).json({ error: "Failed to record event" });
  }
};