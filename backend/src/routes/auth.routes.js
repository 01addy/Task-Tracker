// src/routes/auth.routes.js
import express from "express";
import rateLimit from "express-rate-limit";
import {
  sendOtp,
  verifyOtp,
  login,
  refresh,
  logout,
  me,                 
} from "../controllers/auth.controller.js";
import { sendOtpValidator, verifyOtpValidator, loginValidator, refreshValidator } from "../validators/auth.validator.js";

const router = express.Router();


const sendOtpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { ok: false, error: "Too many requests, try again later" },
});

const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { ok: false, error: "Too many attempts, try again later" },
});

router.post("/send-otp", sendOtpLimiter, sendOtpValidator, sendOtp);
router.post("/verify-otp", verifyOtpLimiter, verifyOtpValidator, verifyOtpValidator, verifyOtp);
router.post("/login", loginValidator, login);
router.post("/refresh", refreshValidator, refresh);
router.post("/logout", refreshValidator, logout);


router.get("/me", me);

export default router;
