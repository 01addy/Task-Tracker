// src/routes/auth.routes.js
import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
  refreshValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh", refreshValidator, refresh);
router.post("/logout", refreshValidator, logout);
router.get("/me", me);

export default router;
