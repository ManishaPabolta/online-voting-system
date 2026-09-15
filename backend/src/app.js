import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json" with { type: "json" };

/* =========================================================
   MIDDLEWARE
========================================================= */

import rateLimitMiddleware from "./middleware/rateLimitMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

/* =========================================================
   ROUTES
========================================================= */

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import votingRoutes from "./routes/votingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

/* =========================================================
   TRUST PROXY
   Required for correct client IP behind Render/proxy.
========================================================= */

app.set("trust proxy", 1);

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",

  // Current deployed frontend
  "https://online-voting-system-phi-beige.vercel.app",

  // Existing Vercel deployment
  "https://online-voting-system-git-main-manishapaboltas-projects.vercel.app",

  // Optional environment-based frontend URL
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
       * Requests from Postman, server-to-server requests,
       * health checks, etc. may not contain an Origin header.
       */
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(`CORS blocked for origin: ${origin}`);

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
  })
);

/* =========================================================
   SECURITY HEADERS
========================================================= */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/* =========================================================
   LOGGING
========================================================= */

app.use(morgan("dev"));

/* =========================================================
   BODY PARSERS
========================================================= */

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

/* =========================================================
   COOKIE PARSER
========================================================= */

app.use(cookieParser());

/* =========================================================
   GLOBAL RATE LIMIT
========================================================= */

app.use(rateLimitMiddleware);

/* =========================================================
   STATIC UPLOADS
========================================================= */

app.use(
  "/uploads",
  express.static("src/uploads", {
    maxAge: "1h",
  })
);

/* =========================================================
   HEALTH / HOME ROUTE
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Online Voting System API Running Successfully",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   API HEALTH CHECK
========================================================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   SWAGGER API DOCUMENTATION
========================================================= */

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
  })
);

/* =========================================================
   AUTH ROUTES
   /api/auth/*
========================================================= */

app.use(
  "/api/auth",
  authRoutes
);

/* =========================================================
   USER ROUTES
   /api/users/*
========================================================= */

app.use(
  "/api/users",
  userRoutes
);

/* =========================================================
   PROFILE ROUTES
   /api/profile/*
========================================================= */

app.use(
  "/api/profile",
  profileRoutes
);

/* =========================================================
   ELECTION ROUTES
   /api/elections/*
========================================================= */

app.use(
  "/api/elections",
  electionRoutes
);

/* =========================================================
   CANDIDATE ROUTES
   /api/candidates/*
========================================================= */

app.use(
  "/api/candidates",
  candidateRoutes
);

/* =========================================================
   VOTING ROUTES
   /api/vote/*
========================================================= */

app.use(
  "/api/vote",
  votingRoutes
);

/* =========================================================
   NOTIFICATION ROUTES
   /api/notifications/*
========================================================= */

app.use(
  "/api/notifications",
  notificationRoutes
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    method: req.method,
    path: req.originalUrl,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(errorMiddleware);

export default app;