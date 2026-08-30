import openai from "../config/openai.js";
import ApiError from "../utils/apiError.js";

export const transcribeAudio = async (audioData, originalname = "audio.webm") => {
  if (!audioData) {
    throw new ApiError(400, "Audio file is required");
  }

  try {
    let fileInput;

    if (Buffer.isBuffer(audioData)) {
      fileInput = await openai.toFile(audioData, originalname);
    } else {
      fileInput = await openai.toFile(audioData);
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fileInput,
      model: process.env.OPENAI_TRANSCRIPTION_MODEL || "whisper-1",
      response_format: "text",
    });

    const text =
      typeof transcription === "string" ? transcription : transcription?.text;

    if (!text?.trim()) {
      throw new ApiError(400, "Could not understand the audio");
    }

    return text.trim();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, `Failed to transcribe audio: ${error.message}`);
  }
};

export const generateSpeech = async ({ text, voice = "alloy" }) => {
  if (!text?.trim()) {
    throw new ApiError(400, "Text is required for speech generation");
  }

  const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  const selectedVoice = validVoices.includes(voice) ? voice : "alloy";

  try {
    const speech = await openai.audio.speech.create({
      model: process.env.OPENAI_TTS_MODEL || "tts-1",
      voice: selectedVoice,
      input: text.trim(),
      response_format: "mp3",
    });

    return speech;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, `Failed to generate speech: ${error.message}`);
  }
};
