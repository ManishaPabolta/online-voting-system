

import { io } from "socket.io-client";

const socket = io("https://online-voting-system-6i81.onrender.com", {
  withCredentials: true,
});
export default socket;