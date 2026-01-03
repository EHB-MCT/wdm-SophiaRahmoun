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