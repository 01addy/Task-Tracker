// src/models/User.model.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
