// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  return res.json({ ok: true, message: "Server running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

export default app;
