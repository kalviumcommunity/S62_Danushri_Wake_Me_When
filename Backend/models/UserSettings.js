import mongoose from "mongoose";

const userSettingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  alertRange: {
    type: Number,
    default: 3
  }
});

export default mongoose.model("UserSetting", userSettingSchema);
