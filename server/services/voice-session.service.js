import ApiError from "../utils/apiError.js";

const activeSessions = new Map();

export const createVoiceSession = ({ userId, interviewId }) => {
  if (!userId || !interviewId) {
    throw new ApiError(400, "User ID and interview ID are required");
  }

  const sessionId = `${userId}-${interviewId}`;

  const session = {
    sessionId,
    userId: userId.toString(),
    interviewId: interviewId.toString(),
    status: "active",
    startedAt: new Date(),
    lastActivityAt: new Date(),
  };

  activeSessions.set(sessionId, session);

  return session;
};

export const getVoiceSession = ({ userId, interviewId }) => {
  const sessionId = `${userId}-${interviewId}`;

  return activeSessions.get(sessionId) || null;
};

export const updateVoiceSessionActivity = (session) => {
  if (!session) {
    return;
  }

  session.lastActivityAt = new Date();

  activeSessions.set(session.sessionId, session);
};

export const endVoiceSession = ({ userId, interviewId }) => {
  const sessionId = `${userId}-${interviewId}`;

  const session = activeSessions.get(sessionId);

  if (!session) {
    return null;
  }

  session.status = "ended";
  session.endedAt = new Date();

  activeSessions.delete(sessionId);

  return session;
};
