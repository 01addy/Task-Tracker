// src/jobs/reminder.job.js
import cron from "node-cron";
import Task from "../models/Task.model.js";

// Runs every 5 minutes
export const startReminderJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const lookAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const tasks = await Task.find({
        dueDate: { $ne: null, $gt: now, $lte: lookAhead },
        status: { $ne: "done" },
        reminderSent: false,
      });

      for (const task of tasks) {
        if (!task.dueDate) continue;

        const offsetMin = Number(task.reminderOffsetMinutes || 60);
        const reminderTime = new Date(
          task.dueDate.getTime() - offsetMin * 60 * 1000
        );

        if (reminderTime <= now) {
          task.reminderSent = true;
          await task.save();

          console.log(
            `[Reminder] Marked as sent for task ${task._id} (no email)`
          );
        }
      }
    } catch (err) {
      console.error("Reminder job error:", err);
    }
  });

  console.log("Reminder job scheduled: runs every 5 minutes (email disabled)");
};
