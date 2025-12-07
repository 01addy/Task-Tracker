// src/services/email.service.js
import transporter from "../config/mailer.js";
import EmailLog from "../models/EmailLog.model.js";
import env from "../config/env.js";

const sendMail = async ({ to, subject, text, html, type = "other", meta = {} }) => {
  try {
    const info = await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      text,
      html,
    });

    await EmailLog.create({
      to,
      subject,
      type,
      messageId: info.messageId,
      meta,
    });

    return { ok: true, info };
  } catch (err) {
    await EmailLog.create({
      to,
      subject,
      type,
      error: err.message,
      meta,
    });
    return { ok: false, error: err.message };
  }
};

export const sendOtpEmail = async (email, otp, minutes = 10) => {
  const subject = "Your TaskTracker OTP";
  const text = `Your OTP is ${otp}. It expires in ${minutes} minutes. If you didn't request this, ignore the email.`;
  const html = `<p>Your OTP is <b>${otp}</b>.</p><p>This code expires in ${minutes} minutes.</p>`;
  return sendMail({ to: email, subject, text, html, type: "otp" });
};

export const sendWelcomeEmail = async (email, name) => {
  const subject = `Welcome to TaskTracker, ${name || ""}`;
  const text = `Welcome ${name || ""}! Get started by creating your first task.`;
  const html = `<h3>Welcome ${name || ""}!</h3><p>Get started by creating your first task.</p>`;
  return sendMail({ to: email, subject, text, html, type: "welcome" });
};

export const sendTaskCreatedEmail = async (email, task) => {
  const subject = `New Task Created: ${task.title}`;
  const text = `Task "${task.title}" created. Due: ${task.dueDate || "N/A"}`;
  const html = `<p>Task "<b>${task.title}</b>" created.</p><p>Due: ${task.dueDate || "N/A"}</p>`;
  return sendMail({ to: email, subject, text, html, type: "task", meta: { taskId: task._id } });
};

export const sendTaskReminderEmail = async (email, task) => {
  const subject = `Reminder: ${task.title} due soon`;
  const text = `Reminder: Task "${task.title}" is due at ${task.dueDate}`;
  const html = `<p>Reminder: Task "<b>${task.title}</b>" is due at ${task.dueDate}.</p>`;
  return sendMail({ to: email, subject, text, html, type: "reminder", meta: { taskId: task._id } });
};

export default {
  sendOtpEmail,
  sendWelcomeEmail,
  sendTaskCreatedEmail,
  sendTaskReminderEmail,
};
