// src/services/otp.service.js
import bcrypt from "bcryptjs";
import Otp from "../models/Otp.model.js";
import { sendOtpEmail } from "./email.service.js";

const OTP_LENGTH = 6;
const OTP_EXPIRE_MIN = 10;
const SALT_ROUNDS = 10;
const MAX_ATTEMPTS = 5;
const RESEND_LIMIT_PER_HOUR = 3;

const genNumericOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createAndSendOtp = async (email, purpose = "signup") => {
  // check resend limit count
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await Otp.countDocuments({ email, purpose, createdAt: { $gte: since } });
  if (recentCount >= RESEND_LIMIT_PER_HOUR) {
    return { ok: false, error: "Too many OTP requests. Try again later." };
  }

  const otp = genNumericOtp();
  const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + OTP_EXPIRE_MIN * 60 * 1000);


  await Otp.deleteMany({ email, purpose });

  await Otp.create({ email, otpHash, purpose, expiresAt });

  const res = await sendOtpEmail(email, otp, OTP_EXPIRE_MIN);
  if (!res.ok) return { ok: false, error: res.error };

  return { ok: true };
};

export const verifyOtpAndConsume = async (email, otpProvided, purpose = "signup") => {
  const otpDoc = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });
  if (!otpDoc) return { ok: false, error: "OTP not found or expired" };

  // check expiry
  if (otpDoc.expiresAt.getTime() < Date.now()) {
    await Otp.deleteOne({ _id: otpDoc._id });
    return { ok: false, error: "OTP expired" };
  }

  const match = await bcrypt.compare(otpProvided, otpDoc.otpHash);
  if (!match) {
    otpDoc.attempts = (otpDoc.attempts || 0) + 1;
    await otpDoc.save();
    if (otpDoc.attempts >= MAX_ATTEMPTS) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return { ok: false, error: "Too many failed attempts. Request a new OTP." };
    }
    return { ok: false, error: "Invalid OTP" };
  }

  
  await Otp.deleteOne({ _id: otpDoc._id });
  return { ok: true };
};
