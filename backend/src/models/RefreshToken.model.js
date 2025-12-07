// src/models/RefreshToken.model.js
import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  jti: { type: String, required: true, index: true }, // token id
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("RefreshToken", RefreshTokenSchema);
