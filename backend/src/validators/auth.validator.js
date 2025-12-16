// src/validators/auth.validator.js
import { body } from "express-validator";

export const registerValidator = [
  body("name").optional().isString(),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password required"),
];

export const refreshValidator = [
  body("refreshToken").optional().isString(),
];
