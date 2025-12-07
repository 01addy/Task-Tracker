import { body, param, query } from "express-validator";

export const createTaskValidator = [
  body("title")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("title must be 1-200 characters"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 2000 })
    .withMessage("description max 2000 characters"),
  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("dueDate must be a valid ISO8601 date-time string"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("priority must be one of: low, medium, high"),
  body("status")
    .optional()
    .isIn(["todo", "inprogress", "done"])
    .withMessage("status must be one of: todo, inprogress, done"),
  body("reminderOffsetMinutes")
    .optional()
    .isInt({ min: 0, max: 60 * 24 * 30 }) // up to 30 days in minutes
    .withMessage("reminderOffsetMinutes must be an integer (minutes)"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("tags must be an array of strings"),
  body("tags.*")
    .optional()
    .isString()
    .withMessage("each tag must be a string")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("tag max 50 chars"),
  body("project")
    .optional({ nullable: true })
    .isString()
    .withMessage("project must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("project max 200 chars"),
];

export const updateTaskValidator = [
  param("id").isMongoId().withMessage("task id must be a valid Mongo id"),
  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 1, max: 200 })
    .withMessage("title must be 1-200 characters"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 2000 })
    .withMessage("description max 2000 characters"),
  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("dueDate must be a valid ISO8601 date-time string"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("priority must be one of: low, medium, high"),
  body("status")
    .optional()
    .isIn(["todo", "inprogress", "done"])
    .withMessage("status must be one of: todo, inprogress, done"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("completed must be boolean"),
  body("reminderOffsetMinutes")
    .optional()
    .isInt({ min: 0, max: 60 * 24 * 30 })
    .withMessage("reminderOffsetMinutes must be an integer (minutes)"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("tags must be an array of strings"),
  body("tags.*")
    .optional()
    .isString()
    .withMessage("each tag must be a string")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("tag max 50 chars"),
  body("project")
    .optional({ nullable: true })
    .isString()
    .withMessage("project must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("project max 200 chars"),
];

export const listTasksValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100"),
  query("status").optional().isIn(["todo", "inprogress", "done"]).withMessage("invalid status"),
  query("q").optional().isString().trim().isLength({ max: 200 }).withMessage("q too long"),
];
