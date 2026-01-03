import mongoose from "mongoose";

const selfieAnalysisSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    ref: "User",
  },
  imageUrl: {
    type: String,
    required: false, 
  },
  faceDetected: {
    type: Boolean,
    required: true,
  },
  estimatedAge: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["male", "female", "unknown"],
  },
  dominantEmotion: {
    type: String,
    enum: ["happy", "sad", "angry", "fearful", "disgusted", "surprised", "neutral", "anxious", "unknown"],
  },
  brightness: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  backgroundClutter: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  // Enhanced behavioral and metadata fields
  ip: {
    type: String,
  },
  location: {
    country: String,
    city: String,
  },
  device: {
    platform: String,
    os: String,
    browser: String,
  },
  deviceInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  interactionDuration: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for better query performance
selfieAnalysisSchema.index({ uid: 1, createdAt: -1 });
selfieAnalysisSchema.index({ dominantEmotion: 1 });
selfieAnalysisSchema.index({ estimatedAge: 1 });

export default mongoose.model("SelfieAnalysis", selfieAnalysisSchema);