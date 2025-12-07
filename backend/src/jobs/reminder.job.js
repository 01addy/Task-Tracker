// src/jobs/reminder.job.js
import cron from "node-cron";
import Task from "../models/Task.model.js";
import { sendTaskReminderEmail } from "../services/email.service.js";

// Runs every 5 minutes 

export const startReminderJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();

      
      const lookAhead = new Date(now.getTime() + 1000 * 60 * 60 * 24); 

      const tasks = await Task.find({
        dueDate: { $ne: null, $gt: now, $lte: lookAhead },
        status: { $ne: "done" },
        reminderSent: false,
      }).populate("userId");

      for (const task of tasks) {
        if (!task.dueDate || !task.userId) continue;

        const offsetMin = Number(task.reminderOffsetMinutes || 60);
        const reminderTime = new Date(task.dueDate.getTime() - offsetMin * 60 * 1000);

        if (reminderTime <= now) {
          try {
            await sendTaskReminderEmail(task.userId.email, task);
            task.reminderSent = true;
            await task.save();
            console.log(`[Reminder] Sent for task ${task._id} to ${task.userId.email}`);
          } catch (err) {
            console.error(`[Reminder] Failed to send for task ${task._id}:`, err.message || err);
          }
        }
      }
    } catch (err) {
      console.error("Reminder job error:", err);
    }
  });

  console.log("Reminder job scheduled: runs every 5 minutes");
};
