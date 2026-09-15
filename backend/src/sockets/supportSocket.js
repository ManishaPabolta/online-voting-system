import { getIO } from "../config/socket.js";

const supportSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    console.log(`Support socket connected: ${socket.id}`);

    socket.on("join-support-room", (roomId) => {
      if (!roomId) {
        return;
      }

      const roomName = `support:${String(roomId)}`;

      socket.join(roomName);

      console.log(
        `Socket ${socket.id} joined support room: ${roomName}`
      );
    });

    socket.on("support-message", (data) => {
      if (!data?.roomId || !data?.message) {
        return;
      }

      const roomName = `support:${String(data.roomId)}`;

      io.to(roomName).emit("receive-support-message", {
        sender: data.sender || null,
        message: String(data.message),
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `Support socket disconnected: ${socket.id} | Reason: ${reason}`
      );
    });
  });
};

export default supportSocket;