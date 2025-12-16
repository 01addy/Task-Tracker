// src/routes/task.routes.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import {
  createTaskValidator,
  updateTaskValidator,
  listTasksValidator,
} from "../validators/task.validator.js";
import { validationResult } from "express-validator";

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mapped = errors.array().map((e) => ({ field: e.param, msg: e.msg }));
    return res.status(400).json({ ok: false, errors: mapped });
  }
  return next();
};

router.use(authMiddleware);

// Create
router.post("/", createTaskValidator, handleValidation, createTask);

// List
router.get("/", listTasksValidator, handleValidation, listTasks);

// Get single
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ ok: false, error: "Invalid task id" });
  }
  return getTask(req, res, next);
});

// Update
router.put("/:id", updateTaskValidator, handleValidation, updateTask);

// Delete
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ ok: false, error: "Invalid task id" });
  }
  return deleteTask(req, res, next);
});

export default router;
