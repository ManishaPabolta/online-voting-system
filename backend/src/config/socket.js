import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://online-voting-system-phi-beige.vercel.app",
        "https://online-voting-system-git-main-manishapaboltas-projects.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  });
};

export const getIO = () => io;