// src/services/token.service.js
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessTtl });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshTtl });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.accessSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwt.refreshSecret);
};
