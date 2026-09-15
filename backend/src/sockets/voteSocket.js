import { getIO } from "../config/socket.js";

const voteSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    console.log(`Vote socket connected: ${socket.id}`);

    socket.on("join-election", (electionId) => {
      if (!electionId) {
        return;
      }

      const roomName = `election:${String(electionId)}`;

      socket.join(roomName);

      console.log(
        `Socket ${socket.id} joined election room: ${roomName}`
      );
    });

    socket.on("vote-casted", (data) => {
      if (!data?.electionId) {
        return;
      }

      const roomName = `election:${String(data.electionId)}`;

      io.to(roomName).emit("vote-update", {
        message: "New vote received",
        data: {
          electionId: data.electionId,
          castAt: data.castAt || new Date(),
        },
      });
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `Vote socket disconnected: ${socket.id} | Reason: ${reason}`
      );
    });
  });
};

export default voteSocket;