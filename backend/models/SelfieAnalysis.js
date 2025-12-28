import mongoose from "mongoose";

const selfieAnalysisSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    ref: "User",
  },
  imageUrl: {
    type: String,
    required: true,
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
    enum: ["happy", "sad", "angry", "fearful", "disgusted", "surprised", "neutral", "unknown"],
  },
  brightness: {
    type: Number,
    required: true,
  },
  backgroundClutter: {
    type: Number,
    required: true,
  },
  speculativeBMI: {
    type: Number,
  },
  speculativeSocialClass: {
    type: String,
    enum: ["low", "medium", "high"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SelfieAnalysis", selfieAnalysisSchema);