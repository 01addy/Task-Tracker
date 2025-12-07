// src/validators/auth.validator.js
import { body } from "express-validator";

export const sendOtpValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  // optional purpose check could be added
];

export const verifyOtpValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("otp").isLength({ min: 4 }).withMessage("OTP required"),
  // password only required for signup or reset when provided
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password required"),
];

export const refreshValidator = [
  body("refreshToken").isString().notEmpty().withMessage("refreshToken required"),
];
