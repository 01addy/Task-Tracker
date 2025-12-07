import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";        // <-- added
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { transporter } from "./config/mailer.js";

const app = express();

// security headers
app.use(helmet());

// ---- CORS: allow credentials and explicit origin ----
// Set CLIENT_ORIGIN to your frontend origin, e.g. http://localhost:3000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_ORIGIN,   // must be a specific origin when credentials are used
    credentials: true,       // allow cookies/credentials
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  })
);

// JSON body parser
app.use(express.json());
// cookie parser (needs to come before routes so req.cookies is available)
app.use(cookieParser());
app.use(morgan("dev"));

// default health check
app.get("/health", (req, res) => res.json({ ok: true, message: "Server running" }));

// dev-only convenience mail check
app.get("/test-mail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER,
      subject: "Test mail from TaskTracker",
      text: "This is a test email from TaskTracker server.",
    });
    res.json({ ok: true, info });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * Mount your API routes under /api to match frontend calls like:
 *   http://localhost:4000/api/auth/...
 */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// global error handler
app.use(errorHandler);

export default app;
