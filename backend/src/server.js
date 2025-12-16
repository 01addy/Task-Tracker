// src/server.js
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { startReminderJob } from "./jobs/reminder.job.js";

const startServer = async () => {
  await connectDB();

  // Start cron jobs
  startReminderJob();

  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
  });
};

startServer();
