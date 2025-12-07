// src/config/mailer.js
import nodemailer from "nodemailer";
import env from "./env.js";

export const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.secure,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

transporter.verify()
  .then(() => console.log("Mailer Verified Successfully"))
  .catch((err) => {
    console.error("Mailer Verification Failed:", err.message);
  });


export default transporter;
