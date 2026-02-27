import mongoose from "mongoose";

const pushSubSchema = new mongoose.Schema({
  email:        { type: String, required: true, lowercase: true },
  subscription: { type: Object, required: true }, // { endpoint, keys: { p256dh, auth } }
  createdAt:    { type: Date, default: Date.now },
});

// One subscription per endpoint per user
pushSubSchema.index({ email: 1, "subscription.endpoint": 1 }, { unique: true });

export default mongoose.model("PushSubscription", pushSubSchema);