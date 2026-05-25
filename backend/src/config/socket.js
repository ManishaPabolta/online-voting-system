import { Server } from "socket.io";

import voteSocket from "../sockets/voteSocket.js";

import notificationSocket from "../sockets/notificationSocket.js";

import supportSocket from "../sockets/supportSocket.js";

let io;

export const initSocket = (
  server
) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  voteSocket();

  notificationSocket();

  supportSocket();

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized"
    );
  }

  return io;
};