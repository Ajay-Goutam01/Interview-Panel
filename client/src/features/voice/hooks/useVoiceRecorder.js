import { useCallback, useRef, useState } from "react";

const getSupportedMimeType = () => {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

  return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
};

const useVoiceRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioBlob(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Microphone recording is not supported in this browser.",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = getSupportedMimeType();

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blobType = mimeType || "audio/webm";

        const blob = new Blob(chunksRef.current, {
          type: blobType,
        });

        setAudioBlob(blob);

        stream.getTracks().forEach((track) => track.stop());

        streamRef.current = null;
        mediaRecorderRef.current = null;
        chunksRef.current = [];
      };

      recorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setIsRecording(false);

        stream.getTracks().forEach((track) => track.stop());

        streamRef.current = null;
        mediaRecorderRef.current = null;
      };

      recorder.start();

      setIsRecording(true);
    } catch (error) {
      console.error("VOICE RECORDING ERROR:", error);

      setError(
        error.name === "NotAllowedError"
          ? "Microphone permission was denied."
          : error.message || "Unable to access microphone.",
      );

      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    recorder.stop();
    setIsRecording(false);
  }, []);

  const resetRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    mediaRecorderRef.current = null;
    streamRef.current = null;
    chunksRef.current = [];

    setIsRecording(false);
    setAudioBlob(null);
    setError(null);
  }, []);

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  };
};

export default useVoiceRecorder;
