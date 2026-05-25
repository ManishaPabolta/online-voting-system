import { io } from "socket.io-client";

const socket = io(
  "https://online-voting-system-6i81.onrender.com",
  {
    transports: ["websocket", "polling"],
    withCredentials: true,
  }
);

export default socket;