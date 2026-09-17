import "dotenv/config";

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";

import { registerVoiceSocket } from "./sockets/voice.socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

registerVoiceSocket(io);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed", error);
    process.exit(1);
  }
};

startServer();

export { io };
