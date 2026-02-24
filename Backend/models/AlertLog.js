import mongoose from "mongoose";

const alertLogSchema = new mongoose.Schema({
  email:    { type: String, required: true, lowercase: true },
  eventId:  { type: String, required: true },
  interval: { type: Number, required: true },  // minutes before (60, 30, 15)
  sentAt:   { type: Date, default: Date.now },
});

// Unique per user+event+interval so we never send twice
alertLogSchema.index({ email: 1, eventId: 1, interval: 1 }, { unique: true });

export default mongoose.model("AlertLog", alertLogSchema);
