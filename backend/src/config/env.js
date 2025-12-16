// src/config/env.js
import dotenv from "dotenv";
dotenv.config();

/**
 * Required environment variables
 */
const required = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required ENV var: ${key}`);
    process.exit(1);
  }
});

export default {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT || 4000),

  mongoUri: process.env.MONGODB_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.ACCESS_TOKEN_TTL || "15m",
    refreshTtl: process.env.REFRESH_TOKEN_TTL || "7d",
  },
};
