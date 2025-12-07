// src/models/Otp.model.js
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  otpHash: { type: String, required: true },
  purpose: { type: String, enum: ["signup", "reset"], default: "signup" },
  expiresAt: { type: Date, required: true }, // removed index:true to avoid duplicate index warning
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// TTL index - documents expire after 'expiresAt' time
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", OtpSchema);
