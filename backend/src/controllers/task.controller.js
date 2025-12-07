import Task from "../models/Task.model.js";
import { sendTaskCreatedEmail } from "../services/email.service.js";
import { parseIncomingDateAsUTC, toISTString } from "../utils/datetime.js";
import { Parser } from "json2csv";


function attachISTFields(taskDoc) {
  if (!taskDoc) return taskDoc;
  const t = typeof taskDoc.toObject === "function" ? taskDoc.toObject() : { ...taskDoc };
  t.dueDateIST = toISTString(t.dueDate, { includeOffsetIso: true });
  t.dueDateDisplay = toISTString(t.dueDate);
  t.createdAtIST = toISTString(t.createdAt, { includeOffsetIso: true });
  t.updatedAtIST = toISTString(t.updatedAt, { includeOffsetIso: true });
  
  t.tags = t.tags || [];
  t.project = t.project || "";
  t.completed = !!t.completed;
  return t;
}

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, reminderOffsetMinutes, tags, project } = req.body;
    if (!title) return res.status(400).json({ ok: false, error: "title required" });

    
    const dueDateUtc = dueDate ? parseIncomingDateAsUTC(dueDate) : null;
    if (dueDate && !dueDateUtc) {
      return res.status(400).json({ ok: false, error: "Invalid dueDate format. Use ISO or 'yyyy-MM-dd HH:mm'." });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description: description || "",
      dueDate: dueDateUtc,
      priority: priority || "low",
      reminderOffsetMinutes: Number(reminderOffsetMinutes) || 60,
      tags: Array.isArray(tags) ? tags.slice(0, 20) : [], // limit tags
      project: project ? String(project).trim() : "",
      completed: false,
      createdBy: req.user._id,
    });

    // send task-created email
    sendTaskCreatedEmail(req.user.email, task).catch((e) => console.error("Task email error", e));

    const taskObj = attachISTFields(task);
    return res.status(201).json({ ok: true, task: taskObj });
  } catch (err) {
    console.error("createTask error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};



export const listTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, q } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (q) {
      
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter).sort({ dueDate: 1 }).skip(skip).limit(Number(limit));

    const tasksWithIST = tasks.map((t) => attachISTFields(t));
    return res.json({ ok: true, total, page: Number(page), limit: Number(limit), tasks: tasksWithIST });
  } catch (err) {
    console.error("listTasks error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ ok: false, error: "Not found" });
    const taskObj = attachISTFields(task);
    return res.json({ ok: true, task: taskObj });
  } catch (err) {
    console.error("getTask error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };
    updates.updatedBy = req.user._id;

    if (updates.dueDate) {
      const dueDateUtc = parseIncomingDateAsUTC(updates.dueDate);
      if (!dueDateUtc) {
        return res.status(400).json({ ok: false, error: "Invalid dueDate format. Use ISO or 'yyyy-MM-dd HH:mm'." });
      }
      updates.dueDate = dueDateUtc;
    }

    
    if (updates.tags && !Array.isArray(updates.tags)) {
      
      if (typeof updates.tags === "string") {
        updates.tags = updates.tags.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        updates.tags = [];
      }
    }

    if (updates.project && typeof updates.project !== "string") {
      updates.project = String(updates.project);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true }
    );
    if (!task) return res.status(404).json({ ok: false, error: "Not found" });

    const taskObj = attachISTFields(task);
    return res.json({ ok: true, task: taskObj });
  } catch (err) {
    console.error("updateTask error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ ok: false, error: "Not found" });
    return res.json({ ok: true, message: "Deleted" });
  } catch (err) {
    console.error("deleteTask error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};


export const exportTasksCsv = async (req, res) => {
  try {
    const tasksRaw = await Task.find({ userId: req.user._id }).lean();
    const tasks = tasksRaw.map((t) => ({
      ...t,
      dueDate: toISTString(t.dueDate, { includeOffsetIso: true }),
      createdAt: toISTString(t.createdAt, { includeOffsetIso: true }),
    }));

    const fields = ["_id", "title", "description", "dueDate", "priority", "status", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(tasks);
    res.header("Content-Type", "text/csv");
    res.attachment("tasks.csv");
    return res.send(csv);
  } catch (err) {
    console.error("exportTasksCsv error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
