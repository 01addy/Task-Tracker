import { validationResult } from "express-validator";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { createAndSendOtp, verifyOtpAndConsume } from "../services/otp.service.js";
import { sendWelcomeEmail } from "../services/email.service.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } from "../services/token.service.js";
import RefreshToken from "../models/RefreshToken.model.js";
import crypto from "crypto";

const SALT_ROUNDS = 10;
const REFRESH_COOKIE_NAME = "tt_refresh";

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

export const sendOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

    const { email, purpose } = req.body;
    const normalized = email.toLowerCase().trim();
    const r = await createAndSendOtp(normalized, purpose || "signup");
    if (!r.ok) return res.status(429).json({ ok: false, error: r.error });

    return res.json({ ok: true, message: "OTP sent if email is valid" });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

    const { email, otp, password, name, purpose } = req.body;
    const normalized = email.toLowerCase().trim();
    const flow = purpose || "signup";

    const v = await verifyOtpAndConsume(normalized, otp, flow);
    if (!v.ok) return res.status(400).json({ ok: false, error: v.error });

    if (flow === "signup") {
      // create user if not exists
      const existing = await User.findOne({ email: normalized });
      if (existing) return res.status(409).json({ ok: false, error: "User already exists" });
      if (!password) return res.status(400).json({ ok: false, error: "password required for signup" });

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await User.create({
        name: name || "",
        email: normalized,
        passwordHash,
        isVerified: true,
      });

      // send welcome mail async
      sendWelcomeEmail(user.email, user.name).catch((e) => console.error("Welcome email error", e));

      
      const refreshJti = crypto.randomBytes(16).toString("hex");
      const refreshToken = signRefreshToken({ sub: user._id.toString(), email: user.email, jti: refreshJti });

      // store refresh token jti with expiry
      const refreshTtlSeconds = parseTtlToSeconds(process.env.REFRESH_TOKEN_TTL || process.env.REFRESH_TTL || "7d");
      await RefreshToken.create({
        jti: refreshJti,
        userId: user._id,
        expiresAt: new Date(Date.now() + refreshTtlSeconds * 1000),
      });

      const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });

      
      setRefreshCookie(res, refreshToken, refreshTtlSeconds);

      return res.status(201).json({
        ok: true,
        user: { id: user._id, name: user.name, email: user.email },
        accessToken,
      });
    }

    if (flow === "reset") {
      // set new password
      if (!password) return res.status(400).json({ ok: false, error: "password required for reset" });
      const user = await User.findOne({ email: normalized });
      if (!user) return res.status(404).json({ ok: false, error: "User not found" });
      user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      await user.save();
      
      sendWelcomeEmail(user.email, user.name).catch(() => {});
      return res.json({ ok: true, message: "Password reset successful" });
    }

    return res.json({ ok: true, message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, error: "email and password required" });

    const normalized = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalized });
    if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    // generate tokens and persist refresh jti
    const refreshJti = crypto.randomBytes(16).toString("hex");
    const refreshToken = signRefreshToken({ sub: user._id.toString(), email: user.email, jti: refreshJti });
    const refreshTtlSeconds = parseTtlToSeconds(process.env.REFRESH_TOKEN_TTL || process.env.REFRESH_TTL || "7d");
    await RefreshToken.create({
      jti: refreshJti,
      userId: user._id,
      expiresAt: new Date(Date.now() + refreshTtlSeconds * 1000),
    });

    const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });

    
    setRefreshCookie(res, refreshToken, refreshTtlSeconds);

    
    return res.json({ ok: true, accessToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

    // accept refresh token from body
    const providedToken = req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];
    if (!providedToken) return res.status(400).json({ ok: false, error: "refreshToken required" });

    
    let payload;
    try {
      payload = verifyRefreshToken(providedToken);
    } catch (err) {
      return res.status(401).json({ ok: false, error: "Invalid refresh token" });
    }

    const jti = payload.jti;
    const userId = payload.sub;
    if (!jti || !userId) return res.status(401).json({ ok: false, error: "Invalid refresh token" });

    
    const stored = await RefreshToken.findOne({ jti, userId });
    if (!stored) return res.status(401).json({ ok: false, error: "Refresh token revoked or not found" });

    
    await RefreshToken.deleteOne({ _id: stored._id });

    const refreshJti = crypto.randomBytes(16).toString("hex");
    const newRefreshToken = signRefreshToken({ sub: userId, email: payload.email, jti: refreshJti });
    const refreshTtlSeconds = parseTtlToSeconds(process.env.REFRESH_TOKEN_TTL || process.env.REFRESH_TTL || "7d");
    await RefreshToken.create({
      jti: refreshJti,
      userId,
      expiresAt: new Date(Date.now() + refreshTtlSeconds * 1000),
    });

    const accessToken = signAccessToken({ sub: userId, email: payload.email });

    
    setRefreshCookie(res, newRefreshToken, refreshTtlSeconds);

    return res.json({ ok: true, accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    
    const providedToken = req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];
    if (!providedToken) {
      
      res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
      return res.status(400).json({ ok: false, error: "refreshToken required" });
    }

    
    let payload;
    try {
      payload = verifyRefreshToken(providedToken);
    } catch (err) {
      
      res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
      return res.status(400).json({ ok: false, error: "Invalid token" });
    }

    const jti = payload.jti;
    if (!jti) {
      res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
      return res.status(400).json({ ok: false, error: "Invalid token" });
    }

    await RefreshToken.deleteOne({ jti });

    // clear cookie on logout
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });

    return res.json({ ok: true, message: "Logged out" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

// NEW: get current user from access token
export const me = async (req, res) => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ ok: false, error: "Missing Authorization header" });

    const token = authHeader.slice("Bearer ".length);
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({ ok: false, error: "Invalid access token" });
    }

    const userId = payload.sub;
    if (!userId) return res.status(401).json({ ok: false, error: "Invalid token payload" });

    const user = await User.findById(userId).select("name email");
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });

    return res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
