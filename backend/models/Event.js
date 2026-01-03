import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    ref: "User",
  },
  type: {
    type: String,
    required: true,
   // enum: ["navigation", "click", "selfie_upload", "analysis_complete"],
  },
  data: {
    type: Object,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Event", eventSchema);