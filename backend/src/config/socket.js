import { Server } from "socket.io";

let io = null;

// ======================================================
// ALLOWED SOCKET ORIGINS
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://online-voting-system-phi-beige.vercel.app",
  "https://online-voting-system-git-main-manishapaboltas-projects.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Remove duplicate origins
const uniqueOrigins = [...new Set(allowedOrigins)];

// ======================================================
// INITIALIZE SOCKET.IO
// ======================================================

export const initSocket = (server) => {
  if (!server) {
    throw new Error(
      "HTTP server is required to initialize Socket.IO."
    );
  }

  if (io) {
    console.warn("Socket.IO is already initialized.");
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow requests without an Origin header
        // such as server-to-server requests.
        if (!origin) {
          return callback(null, true);
        }

        if (uniqueOrigins.includes(origin)) {
          return callback(null, true);
        }

        console.error(
          `Socket.IO CORS blocked origin: ${origin}`
        );

        return callback(
          new Error(`Socket.IO CORS blocked origin: ${origin}`)
        );
      },

      methods: ["GET", "POST"],

      credentials: true,
    },

    transports: ["websocket", "polling"],

    pingTimeout: 20000,
    pingInterval: 25000,
  });

  // ====================================================
  // SOCKET CONNECTION
  // ====================================================

  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.id}`
    );

    // --------------------------------------------------
    // Join user-specific room
    // --------------------------------------------------

    socket.on("join-user-room", (userId) => {
      if (!userId) {
        return;
      }

      const roomName = `user:${String(userId)}`;

      socket.join(roomName);

      console.log(
        `Socket ${socket.id} joined ${roomName}`
      );
    });

    // --------------------------------------------------
    // Join election-specific room
    // --------------------------------------------------

    socket.on("join-election-room", (electionId) => {
      if (!electionId) {
        return;
      }

      const roomName = `election:${String(electionId)}`;

      socket.join(roomName);

      console.log(
        `Socket ${socket.id} joined ${roomName}`
      );
    });

    // --------------------------------------------------
    // Leave election room
    // --------------------------------------------------

    socket.on("leave-election-room", (electionId) => {
      if (!electionId) {
        return;
      }

      const roomName = `election:${String(electionId)}`;

      socket.leave(roomName);

      console.log(
        `Socket ${socket.id} left ${roomName}`
      );
    });

    // --------------------------------------------------
    // Disconnect
    // --------------------------------------------------

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected: ${socket.id} | Reason: ${reason}`
      );
    });

    // --------------------------------------------------
    // Socket error
    // --------------------------------------------------

    socket.on("error", (error) => {
      console.error(
        `Socket error [${socket.id}]:`,
        error.message || error
      );
    });
  });

  console.log("Socket.IO initialized successfully.");

  return io;
};

// ======================================================
// GET SOCKET INSTANCE
// ======================================================

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized. Call initSocket(server) first."
    );
  }

  return io;
};

// ======================================================
// SAFE SOCKET CHECK
// ======================================================

export const isSocketInitialized = () => {
  return io !== null;
};