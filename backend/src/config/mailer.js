import nodemailer from "nodemailer";
import env from "./env.js";

const smtpConfigured =
  Boolean(env.smtp && env.smtp.host && env.smtp.user && env.smtp.pass && env.smtp.from) &&
  env.smtp.host !== "";

let transporter = null;

if (smtpConfigured) {
  const isGmail = env.smtp.host && env.smtp.host.includes("gmail");

  const transportOptions = {
    host: env.smtp.host,
    port: env.smtp.port || 587,
    secure: !!env.smtp.secure,
    auth: env.smtp.user && env.smtp.pass ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: { rejectUnauthorized: false },
  };

  if (isGmail) transportOptions.service = "gmail";

  if (process.env.NODE_ENV !== "production") {
    transportOptions.logger = true;
    transportOptions.debug = true;
  }

  transporter = nodemailer.createTransport(transportOptions);

  
  transporter
    .verify()
    .then(() => console.log("Mailer Verified Successfully"))
    .catch((err) => {
      console.error("Mailer Verification Failed (SMTP):", err?.message || err);
      console.error("Continuing without mailer verification. Nodemailer will attempt sends on demand if used.");
    });
} else {
  console.log("SMTP not configured; nodemailer transporter will not be created. Using API provider (SendGrid) if available.");
}

export { transporter };
export default transporter;
