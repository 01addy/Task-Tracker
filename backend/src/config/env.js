// src/config/env.js
import dotenv from "dotenv";
dotenv.config();

const required = [
  "MONGODB_URI",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
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
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.ACCESS_TOKEN_TTL || "15m",
    refreshTtl: process.env.REFRESH_TOKEN_TTL || "7d",
  },
};
