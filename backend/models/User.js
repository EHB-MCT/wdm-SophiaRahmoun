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
    type: Object,
    default: {},
  },
  selfieCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("User", userSchema);