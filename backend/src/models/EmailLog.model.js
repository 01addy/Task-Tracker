// src/models/EmailLog.model.js
import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String },
  type: { type: String, enum: ["otp", "welcome", "task", "reminder", "other"], default: "other" },
  messageId: { type: String },
  error: { type: String },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("EmailLog", EmailLogSchema);
