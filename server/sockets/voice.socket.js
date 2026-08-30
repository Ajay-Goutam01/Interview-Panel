import Interview from "../models/interview.model.js";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import {
  getVoiceSession,
  updateVoiceSessionActivity,
  endVoiceSession,
} from "../services/voice-session.service.js";

const parseCookieToken = (cookieString) => {
  if (!cookieString) return null;
  const match = cookieString.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const registerVoiceSocket = (io) => {
  // Socket.IO Authentication Middleware
  io.use(async (socket, next) => {
    try {
      let token =
        socket.handshake.auth?.token ||
        parseCookieToken(socket.handshake.headers?.cookie);

      if (!token && socket.handshake.headers?.authorization?.startsWith("Bearer ")) {
        token = socket.handshake.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(new Error("Authentication token required for voice connection"));
      }

      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (err) {
        return next(new Error("Invalid or expired authentication token"));
      }

      if (!decoded?.userId) {
        return next(new Error("Invalid token payload"));
      }

      const user = await User.findById(decoded.userId).select("-password -googleId");

      if (!user) {
        return next(new Error("User not found or revoked"));
      }

      if (!user.isActive) {
        return next(new Error("User account is inactive"));
      }

      socket.user = user;
      socket.userId = user._id.toString();

      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🎙️ Voice socket connected: ${socket.id} (User: ${socket.userId})`);

    socket.on("voice:join", async (data) => {
      try {
        const { interviewId } = data || {};
        const userId = socket.userId;

        if (!interviewId) {
          socket.emit("voice:error", {
            message: "Interview ID is required",
          });
          return;
        }

        const interview = await Interview.findOne({
          _id: interviewId,
          user: userId,
        });

        if (!interview) {
          socket.emit("voice:error", {
            message: "Interview not found or unauthorized",
          });
          return;
        }

        if (interview.status !== "active") {
          socket.emit("voice:error", {
            message: "Interview is not active",
          });
          return;
        }

        const session = getVoiceSession({
          userId,
          interviewId,
        });

        if (!session) {
          socket.emit("voice:error", {
            message: "Voice session not initialized. Start session first via API.",
          });
          return;
        }

        socket.join(session.sessionId);

        socket.interviewId = interviewId.toString();
        socket.voiceSessionId = session.sessionId;

        updateVoiceSessionActivity(session);

        socket.emit("voice:joined", {
          sessionId: session.sessionId,
          interviewId,
          currentAgent: interview.currentAgent,
          currentQuestion: interview.currentQuestion,
        });

        console.log(`🎙️ Voice session joined: ${session.sessionId}`);
      } catch (error) {
        console.error("Voice join error:", error.message);

        socket.emit("voice:error", {
          message: "Failed to join voice session",
        });
      }
    });

    socket.on("voice:leave", async () => {
      try {
        if (socket.userId && socket.interviewId) {
          endVoiceSession({
            userId: socket.userId,
            interviewId: socket.interviewId,
          });
        }

        if (socket.voiceSessionId) {
          socket.leave(socket.voiceSessionId);
        }

        socket.disconnect(true);
      } catch (error) {
        console.error("Voice leave error:", error.message);
      }
    });

    socket.on("voice:interrupt", () => {
      if (!socket.voiceSessionId) {
        return;
      }

      socket.to(socket.voiceSessionId).emit("voice:interrupted");
    });

    socket.on("disconnect", () => {
      console.log(`🎙️ Voice socket disconnected: ${socket.id}`);
    });

    socket.on("voice:audio", async (audioData) => {
      try {
        if (!socket.voiceSessionId) {
          socket.emit("voice:error", {
            message: "Voice session is not active",
          });
          return;
        }

        if (!audioData) {
          socket.emit("voice:error", {
            message: "Audio data is missing",
          });
          return;
        }

        const session = getVoiceSession({
          userId: socket.userId,
          interviewId: socket.interviewId,
        });

        if (!session) {
          socket.emit("voice:error", {
            message: "Voice session not found",
          });
          return;
        }

        updateVoiceSessionActivity(session);

        socket.emit("voice:audio_received", {
          success: true,
        });
      } catch (error) {
        console.error("Voice audio error:", error.message);

        socket.emit("voice:error", {
          message: "Failed to process audio",
        });
      }
    });
  });
};
