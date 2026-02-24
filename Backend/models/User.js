import mongoose from "mongoose";
import bcrypt    from "bcryptjs";

const userSchema = new mongoose.Schema({
  // Core identity
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, lowercase: true, unique: true, trim: true },
  password:     { type: String, default: null },   // null for Google-only accounts

  // Auth method
  authMethod:   { type: String, enum: ["google", "email"], default: "email" },

  // Google Calendar tokens (populated after OAuth connect)
  googleId:        { type: String, default: null },
  accessToken:     { type: String, default: null },
  refreshToken:    { type: String, default: null },
  tokenIssuedAt:   { type: Number, default: null },
  calendarLinked:  { type: Boolean, default: false },

  // Profile
  photo:        { type: String, default: null },

  createdAt:    { type: Date, default: Date.now },
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.checkPassword = function (plain) {
  if (!this.password) return false;
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
