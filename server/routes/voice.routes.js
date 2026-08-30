import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import audioUpload from "../middlewares/audioUpload.middleware.js";

import {
  transcribeVoice,
  textToSpeech,
  submitVoiceAnswer,
} from "../controllers/voice.controller.js";
import {
  startVoiceSession,
  getVoiceSessionController,
  stopVoiceSession,
} from "../controllers/voice-session.controller.js";

const router = express.Router();

router.post(
  "/transcribe",
  authMiddleware,
  audioUpload.single("audio"),
  transcribeVoice,
);
router.post(
  "/interviews/:id/answer",
  authMiddleware,
  audioUpload.single("audio"),
  submitVoiceAnswer,
);

router.post("/speech", authMiddleware, textToSpeech);
router.post("/interviews/:id/session", authMiddleware, startVoiceSession);

router.get(
  "/interviews/:id/session",
  authMiddleware,
  getVoiceSessionController,
);

router.delete("/interviews/:id/session", authMiddleware, stopVoiceSession);

export default router;
