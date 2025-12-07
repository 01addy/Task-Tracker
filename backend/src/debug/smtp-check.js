// src/debug/smtp-check.js
import net from "net";
import env from "../config/env.js";

export const smtpTcpCheck = (req, res) => {
  const host = env.smtp.host || process.env.SMTP_HOST;
  const port = env.smtp.port || Number(process.env.SMTP_PORT || 587);
  const timeoutMs = 8000;

  const socket = new net.Socket();
  let done = false;

  socket.setTimeout(timeoutMs);

  socket.once("connect", () => {
    done = true;
    socket.destroy();
    return res.json({ ok: true, host, port, msg: "TCP connect OK" });
  });

  socket.once("timeout", () => {
    if (done) return;
    done = true;
    socket.destroy();
    return res.status(504).json({ ok: false, error: "TCP connect timeout" });
  });

  socket.once("error", (err) => {
    if (done) return;
    done = true;
    socket.destroy();
    return res.status(502).json({ ok: false, error: err.message });
  });

  socket.connect(port, host);
};
