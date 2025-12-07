import nodemailer from "nodemailer";
import env from "./env.js";

const isGmail = env.smtp.host && env.smtp.host.includes("gmail");

const transportOptions = {
  host: env.smtp.host || undefined,
  port: env.smtp.port || 587,
  secure: env.smtp.secure || false,
  auth: env.smtp.user && env.smtp.pass ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: {
    
    rejectUnauthorized: false,
  },
};


if (isGmail) {
  transportOptions.service = "gmail";
  
}

if (process.env.NODE_ENV !== "production") {
  transportOptions.logger = true;
  transportOptions.debug = true;
}

export const transporter = nodemailer.createTransport(transportOptions);


transporter
  .verify()
  .then(() => console.log("Mailer Verified Successfully"))
  .catch((err) => {
    console.error("Mailer Verification Failed:", err?.message || err);
    console.error("Continuing without mailer verification to avoid crashing the app. Mail sends will be attempted on demand.");
  });

export default transporter;
