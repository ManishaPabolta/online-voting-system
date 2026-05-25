import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("DB Connected");

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`
================================
Server Running: ${PORT}
================================
      `);
    });
  } catch (err) {
    console.log("Server Error:", err.message);
    process.exit(1);
  }
};

startServer();