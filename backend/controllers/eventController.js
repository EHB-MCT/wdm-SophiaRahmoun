import Event from "../models/Event.js";

export const recordEvent = async (req, res) => {
  try {
    const { uid, type, target, metadata } = req.body;

    if (!uid || !type) {
      return res.status(400).json({ error: "uid and type are required" });
    }

    const event = await Event.create({
      uid,
      type,
      target,
      metadata,
      timestamp: new Date()
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Event error:", err);
    res.status(500).json({ error: "Failed to record event" });
  }
};