import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { Server } from "socket.io";

/* =========================================================
   PORT
========================================================= */

const PORT = Number(process.env.PORT) || 5000;

/* =========================================================
   HTTP SERVER
========================================================= */

const server = http.createServer(app);

/* =========================================================
   SOCKET.IO
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://online-voting-system-phi-beige.vercel.app",
  "https://online-voting-system-git-main-manishapaboltas-projects.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },

  transports: ["websocket", "polling"],
});

/* =========================================================
   SOCKET EVENTS
========================================================= */

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  /* -------------------------------------------------------
     USER ROOM
  ------------------------------------------------------- */

  socket.on("join-user-room", (userId) => {
    if (!userId) return;

    const room = `user:${userId}`;

    socket.join(room);

    console.log(
      `User ${userId} joined room ${room}`
    );
  });

  /* -------------------------------------------------------
     SUPPORT ROOM
  ------------------------------------------------------- */

  socket.on("join-support-room", (roomId) => {
    if (!roomId) return;

    const room = `support:${roomId}`;

    socket.join(room);

    console.log(
      `Socket ${socket.id} joined support room ${room}`
    );
  });

  /* -------------------------------------------------------
     ELECTION ROOM
  ------------------------------------------------------- */

  socket.on("join-election", (electionId) => {
    if (!electionId) return;

    const room = `election:${electionId}`;

    socket.join(room);

    console.log(
      `Socket ${socket.id} joined election room ${room}`
    );
  });

  /* -------------------------------------------------------
     DISCONNECT
  ------------------------------------------------------- */

  socket.on("disconnect", (reason) => {
    console.log(
      `Socket disconnected: ${socket.id} | ${reason}`
    );
  });
});

/* =========================================================
   START SERVER
========================================================= */

server.listen(PORT, () => {
  console.log("====================================");
  console.log("ONLINE VOTING SYSTEM BACKEND");
  console.log("====================================");
  console.log(
    `Environment : ${process.env.NODE_ENV || "development"}`
  );
  console.log(`Server Port : ${PORT}`);
  console.log(
    `API URL     : http://localhost:${PORT}`
  );
  console.log(
    `Uploads     : http://localhost:${PORT}/uploads`
  );
  console.log(
    `Swagger     : http://localhost:${PORT}/api-docs`
  );
  console.log(
    `Socket.IO   : http://localhost:${PORT}`
  );
  console.log("====================================");
});

/* =========================================================
   GRACEFUL SHUTDOWN
========================================================= */

const shutdown = (signal) => {
  console.log(
    `\n${signal} received. Shutting down server...`
  );

  server.close(() => {
    console.log("Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

/* =========================================================
   UNHANDLED ERRORS
========================================================= */

process.on("unhandledRejection", (error) => {
  console.error(
    "UNHANDLED REJECTION:",
    error
  );
});

process.on("uncaughtException", (error) => {
  console.error(
    "UNCAUGHT EXCEPTION:",
    error
  );
});