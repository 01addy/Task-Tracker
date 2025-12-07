// src/validators/auth.validator.js
import { body } from "express-validator";

export const sendOtpValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
];

export const verifyOtpValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("otp").isLength({ min: 4 }).withMessage("OTP required"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password required"),
];

export const refreshValidator = [
  body("refreshToken").isString().notEmpty().withMessage("refreshToken required"),
];
