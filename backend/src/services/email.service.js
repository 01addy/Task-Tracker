// src/services/email.service.js
import EmailLog from "../models/EmailLog.model.js";
import env from "../config/env.js";

let sendWithSendGrid = false;
let sgMail;

if (process.env.SENDGRID_API_KEY) {
  try {
    sgMail = await import("@sendgrid/mail").then(m => m.default);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sendWithSendGrid = true;
    console.log("SendGrid mail enabled");
  } catch (e) {
    console.error("Failed to load @sendgrid/mail:", e);
    sendWithSendGrid = false;
  }
}

import transporter from "../config/mailer.js"; // fallback nodemailer transporter if needed

const buildMsg = ({ to, subject, text, html, from }) => {
  return {
    to,
    from: from || process.env.EMAIL_FROM || env.smtp.from,
    subject,
    text,
    html,
  };
};

const sendMailViaSendGrid = async ({ to, subject, text, html, type = "other", meta = {} }) => {
  const msg = buildMsg({ to, subject, text, html });
  try {
    // send (returns promise)
    const res = await sgMail.send(msg);
    // log asynchronously
    EmailLog.create({
      to,
      subject,
      type,
      messageId: (res && res[0] && res[0].headers && res[0].headers["x-message-id"]) || null,
      meta,
    }).catch(e => console.error("EmailLog create error:", e));
    return { ok: true, info: res };
  } catch (err) {
    EmailLog.create({
      to,
      subject,
      type,
      error: err?.message || String(err),
      meta,
    }).catch(e => console.error("EmailLog create error:", e));
    return { ok: false, error: err?.message || String(err) };
  }
};

const sendMailViaNodemailer = async ({ to, subject, text, html, type = "other", meta = {} }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || env.smtp.from,
      to,
      subject,
      text,
      html,
    });
    EmailLog.create({
      to,
      subject,
      type,
      messageId: info.messageId,
      meta,
    }).catch((e) => console.error("EmailLog create error:", e));
    return { ok: true, info };
  } catch (err) {
    EmailLog.create({
      to,
      subject,
      type,
      error: err?.message || String(err),
      meta,
    }).catch((e) => console.error("EmailLog create error:", e));
    return { ok: false, error: err?.message || String(err) };
  }
};

const sendMail = async (opts) => {
  if (sendWithSendGrid && sgMail) {
    return sendMailViaSendGrid(opts);
  }
  return sendMailViaNodemailer(opts);
};

export const sendOtpEmail = async (email, otp, minutes = 10) => {
  const subject = "Your TaskTracker OTP";
  const text = `Your OTP is ${otp}. It expires in ${minutes} minutes. If you didn't request this, ignore the email.`;
  const html = `<p>Your OTP is <b>${otp}</b>.</p><p>This code expires in ${minutes} minutes.</p>`;
  // fire-and-forget in caller; here we return the promise result
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
