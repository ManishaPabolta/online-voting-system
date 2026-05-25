import { Server } from "socket.io";

import voteSocket from "../sockets/voteSocket.js";
import notificationSocket from "../sockets/notificationSocket.js";
import supportSocket from "../sockets/supportSocket.js";

let io;

export const initSocket = (server) => {
 io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://online-voting-system-git-main-manishapaboltas-projects.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

  voteSocket();
  notificationSocket();
  supportSocket();

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};