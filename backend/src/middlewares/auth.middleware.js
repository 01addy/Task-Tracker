// src/middleware/auth.middleware.js
import { verifyAccessToken } from "../services/token.service.js";
import User from "../models/User.model.js";

export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ ok: false, error: "Unauthorized" });

  const token = auth.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-passwordHash");
    if (!user) return res.status(401).json({ ok: false, error: "Unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid or expired token" });
  }
};
