import { getIO } from "../config/socket.js";

const voteSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    console.log(
      "Vote Socket Connected:",
      socket.id
    );

    socket.on(
      "join-election",
      (electionId) => {
        socket.join(electionId);

        console.log(
          `User joined election room: ${electionId}`
        );
      }
    );

    socket.on(
      "vote-casted",
      (data) => {
        io.to(data.electionId).emit(
          "vote-update",
          {
            message:
              "New vote received",
            data,
          }
        );
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          "Vote Socket Disconnected:",
          socket.id
        );
      }
    );
  });
};

export default voteSocket;