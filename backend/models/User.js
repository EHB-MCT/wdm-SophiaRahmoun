import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  deviceInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  selfieCount: {
    type: Number,
    default: 0,
  },
  // Analytics fields
  dominantEmotion: {
    type: String,
    enum: ["happy", "sad", "angry", "fearful", "disgusted", "surprised", "neutral", "unknown"],
  },
  averageAge: {
    type: Number,
  },
  averageBrightness: {
    type: Number,
    min: 0,
    max: 1,
  },
});

// Index for better query performance
userSchema.index({ uid: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model("User", userSchema);