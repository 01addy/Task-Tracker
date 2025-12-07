// src/config/db.js
import mongoose from "mongoose";
import env from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.error(error);
    process.exit(1);
  }
};
