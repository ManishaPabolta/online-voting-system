import { getIO } from "../config/socket.js";

const notificationSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    console.log(
      "Notification Socket Connected:",
      socket.id
    );

    socket.on(
      "join-user-room",
      (userId) => {
        socket.join(userId);

        console.log(
          `User joined personal room: ${userId}`
        );
      }
    );

    socket.on(
      "send-notification",
      (data) => {
        io.to(data.userId).emit(
          "receive-notification",
          {
            title: data.title,
            message:
              data.message,
          }
        );
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          "Notification Socket Disconnected:",
          socket.id
        );
      }
    );
  });
};

export default notificationSocket;