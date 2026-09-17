import { File } from "node:buffer";
import { SarvamAIClient } from "sarvamai";
import ApiError from "../utils/apiError.js";

const sarvam = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

export const transcribeAudio = async (
  audioData,
  originalname = "audio.webm",
) => {
  if (!audioData) {
    throw new ApiError(400, "Audio file is required");
  }

  try {
    const audioFile = new File([audioData], originalname, {
      type: "audio/webm",
    });

    const response = await sarvam.speechToText.transcribe({
      file: audioFile,
      model: process.env.SARVAM_STT_MODEL || "saaras:v4",
      language_code: "unknown",
    });

    const text = response?.transcript;

    if (!text?.trim()) {
      throw new ApiError(400, "Could not understand the audio");
    }

    return text.trim();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("SARVAM STT ERROR:", error);
    console.error("MESSAGE:", error.message);

    throw new ApiError(500, `Failed to transcribe audio: ${error.message}`);
  }
};

export const generateSpeech = async ({
  text,
  languageCode = "en-IN",
  speaker = "shubh",
}) => {
  if (!text?.trim()) {
    throw new ApiError(400, "Text is required for speech generation");
  }

  try {
    const response = await sarvam.textToSpeech.convert({
      text: text.trim(),
      model: process.env.SARVAM_TTS_MODEL || "bulbul:v3",
      language_code: languageCode,
      speaker,
      output_audio_codec: "mp3",
    });

    const base64Audio = response?.audios?.[0];

    if (!base64Audio) {
      throw new Error("Sarvam returned empty audio");
    }

    return Buffer.from(base64Audio, "base64");
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("SARVAM TTS ERROR:", error);
    console.error("MESSAGE:", error.message);

    throw new ApiError(500, `Failed to generate speech: ${error.message}`);
  }
};
