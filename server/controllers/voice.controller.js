import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import { transcribeAudio, generateSpeech } from "../services/voice.service.js";

import { submitAnswer } from "../services/interview.service.js";

const getSpeechLanguage = (language) => {
  if (language === "hindi") {
    return "hi-IN";
  }

  if (language === "hinglish") {
    return "hi-IN";
  }

  return "en-IN";
};

export const transcribeVoice = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Audio file is required");
  }

  const transcript = await transcribeAudio(
    req.file.buffer,
    req.file.originalname,
  );

  return res.status(200).json(
    new ApiResponse(200, "Audio transcribed successfully", {
      transcript,
    }),
  );
});

export const textToSpeech = asyncHandler(async (req, res) => {
  const { text, languageCode = "en-IN", speaker = "shubh" } = req.body;

  if (!text?.trim()) {
    throw new ApiError(400, "Text is required");
  }

  const audioBuffer = await generateSpeech({
    text,
    languageCode,
    speaker,
  });

  res.set({
    "Content-Type": "audio/mpeg",
    "Content-Length": audioBuffer.length,
    "Cache-Control": "no-cache",
  });

  return res.send(audioBuffer);
});

export const submitVoiceAnswer = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Audio file is required");
  }

  const { id } = req.params;

  // 1. Voice → Text
  const transcript = await transcribeAudio(
    req.file.buffer,
    req.file.originalname,
  );

  if (!transcript?.trim()) {
    throw new ApiError(400, "Could not understand the audio");
  }

  // 2. Existing Interview Engine
  const result = await submitAnswer(req.user._id, id, transcript);

  let audioBuffer = null;

  // 3. Next Question → Sarvam TTS
  if (result.nextQuestion) {
    const languageCode = getSpeechLanguage(result.interview?.language);

    audioBuffer = await generateSpeech({
      text: result.nextQuestion,
      languageCode,
      speaker: "shubh",
    });
  }

  return res.status(200).json(
    new ApiResponse(200, "Voice answer processed successfully", {
      transcript,
      evaluation: result.evaluation,
      nextQuestion: result.nextQuestion,
      interview: result.interview,

      // Actual audio
      audio: audioBuffer ? audioBuffer.toString("base64") : null,

      hasAudio: Boolean(audioBuffer),
    }),
  );
});
