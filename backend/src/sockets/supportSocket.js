import { getIO } from "../config/socket.js";

const supportSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    console.log(
      "Support Socket Connected:",
      socket.id
    );

    socket.on(
      "join-support-room",
      (roomId) => {
        socket.join(roomId);

        console.log(
          `Joined support room: ${roomId}`
        );
      }
    );

    socket.on(
      "support-message",
      (data) => {
        io.to(data.roomId).emit(
          "receive-support-message",
          {
            sender:
              data.sender,
            message:
              data.message,
            createdAt:
              new Date(),
          }
        );
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          "Support Socket Disconnected:",
          socket.id
        );
      }
    );
  });
};

export default supportSocket;