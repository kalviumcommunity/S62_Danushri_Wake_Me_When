import mongoose from "mongoose";

const userSettingSchema = new mongoose.Schema({
  email:           { type: String, required: true, lowercase: true, unique: true },

  // Work schedule
  workStart:       { type: Number, default: 9 },   // hour 0-23
  workEnd:         { type: Number, default: 17 },

  // Filters
  includeWeekends: { type: Boolean, default: false },
  onlyIfInToList:  { type: Boolean, default: false },
  alertRange:      { type: Number,  default: 3, min: 1, max: 8 },

  // AI keyword detection
  keywords:        { type: [String], default: ["urgent", "attention", "important", "high importance", "critical"] },

  // Email alerts
  emailEnabled:    { type: Boolean, default: false },
  emailAddress:    { type: String,  default: "" },

  // Alert timeline (minutes before meeting)
  alertIntervals:  { type: [Number], default: [60, 30, 15] },
});

export default mongoose.model("UserSetting", userSettingSchema);
