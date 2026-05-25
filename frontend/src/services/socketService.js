import io from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL
);

export const connectSocket =
  () => {
    socket.connect();
  };

export const disconnectSocket =
  () => {
    socket.disconnect();
  };

export const sendMessage =
  (event, data) => {
    socket.emit(
      event,
      data
    );
  };

export const receiveMessage =
  (event, callback) => {
    socket.on(
      event,
      callback
    );
  };

export default socket;