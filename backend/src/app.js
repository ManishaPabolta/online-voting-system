import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json" with { type: "json" };

import rateLimitMiddleware from "./middleware/rateLimitMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import votingRoutes from "./routes/votingRoutes.js"; // ✅ IMPORTANT
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://online-voting-system-git-main-manishapaboltas-projects.vercel.app",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimitMiddleware);

// static
app.use("/uploads", express.static("src/uploads"));

// health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

// docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ROUTES (🔥 FIXED PREFIXES)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

// elections
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);

// ✅ IMPORTANT FIX (this was your 404 issue)
app.use("/api/vote", votingRoutes);

// others
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(errorMiddleware);

export default app;