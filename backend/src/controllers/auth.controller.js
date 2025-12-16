// src/controllers/auth.controller.js
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.model.js";
import RefreshToken from "../models/RefreshToken.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "../services/token.service.js";

const SALT_ROUNDS = 10;
const REFRESH_COOKIE_NAME = "tt_refresh";

/* ---------------- helpers ---------------- */

function parseTtlToSeconds(ttl) {
  if (!ttl) return 7 * 24 * 3600;
  if (typeof ttl === "number") return ttl;

  const num = parseInt(ttl.slice(0, -1), 10);
  const unit = ttl.slice(-1);

  if (unit === "m") return num * 60;
  if (unit === "h") return num * 3600;
  if (unit === "d") return num * 24 * 3600;
  if (unit === "s") return num;

  return 7 * 24 * 3600;
}

function setRefreshCookie(res, token, ttlSeconds) {
  const secure = process.env.NODE_ENV === "production";
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: ttlSeconds * 1000,
    path: "/api/auth",
  });
}

/* ---------------- controllers ---------------- */

// REGISTER
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ ok: false, errors: errors.array() });

    const { name, email, password } = req.body;

    const normalized = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalized });
    if (existing)
      return res.status(409).json({ ok: false, error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email: normalized,
      passwordHash,
    });

    const refreshJti = crypto.randomBytes(16).toString("hex");
    const refreshToken = signRefreshToken({
      sub: user._id.toString(),
      email: user.email,
      jti: refreshJti,
    });

    const refreshTtlSeconds = parseTtlToSeconds(
      process.env.REFRESH_TOKEN_TTL || "7d"
    );

    await RefreshToken.create({
      jti: refreshJti,
      userId: user._id,
      expiresAt: new Date(Date.now() + refreshTtlSeconds * 1000),
    });

    const accessToken = signAccessToken({
      sub: user._id.toString(),
      email: user.email,
    });

    setRefreshCookie(res, refreshToken, refreshTtlSeconds);

    return res.status(201).json({
      ok: true,
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ ok: false, errors: errors.array() });

    const { email, password } = req.body;
    const normalized = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalized });
    if (!user)
      return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const refreshJti = crypto.randomBytes(16).toString("hex");
    const refreshToken = signRefreshToken({
      sub: user._id.toString(),
      email: user.email,
      jti: refreshJti,
    });

    const refreshTtlSeconds = parseTtlToSeconds(
      process.env.REFRESH_TOKEN_TTL || "7d"
    );

    await RefreshToken.create({
      jti: refreshJti,
      userId: user._id,
      expiresAt: new Date(Date.now() + refreshTtlSeconds * 1000),
    });

    const accessToken = signAccessToken({
      sub: user._id.toString(),
      email: user.email,
    });

    setRefreshCookie(res, refreshToken, refreshTtlSeconds);

    return res.json({
      ok: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// REFRESH
export const refresh = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ ok: false, errors: errors.array() });

    const providedToken =
      req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];
    if (!providedToken)
      return res.status(400).json({ ok: false, error: "refreshToken required" });

    let payload;
    try {
      payload = verifyRefreshToken(providedToken);
    } catch {
      return res.status(401).json({ ok: false, error: "Invalid refresh token" });
    }

    const stored = await RefreshToken.findOne({
      jti: payload.jti,
      userId: payload.sub,
    });
    if (!stored)
      return res
        .status(401)
        .json({ ok: false, error: "Refresh token revoked" });

    await RefreshToken.deleteOne({ _id: stored._id });

    const newJti = crypto.randomBytes(16).toString("hex");
    const newRefreshToken = signRefreshToken({
      sub: payload.sub,
      email: payload.email,
      jti: newJti,
    });

    const refreshTtlSeconds = parseTtlToSeconds(
      process.env.REFRESH_TOKEN_TTL || "7d"
    );

    await RefreshToken.create({
      jti: newJti,
      userId: payload.sub,
      expiresAt: new Date(Date.now() + refreshTtlSeconds * 1000),
    });

    const accessToken = signAccessToken({
      sub: payload.sub,
      email: payload.email,
    });

    setRefreshCookie(res, newRefreshToken, refreshTtlSeconds);

    return res.json({ ok: true, accessToken });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const providedToken =
      req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];

    if (providedToken) {
      try {
        const payload = verifyRefreshToken(providedToken);
        await RefreshToken.deleteOne({ jti: payload.jti });
      } catch {}
    }

    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
    return res.json({ ok: true, message: "Logged out" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// ME
export const me = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ ok: false, error: "Unauthorized" });

    const token = auth.slice(7);
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return res.status(401).json({ ok: false, error: "Invalid token" });
    }

    const user = await User.findById(payload.sub).select("name email");
    if (!user)
      return res.status(404).json({ ok: false, error: "User not found" });

    return res.json({
      ok: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
