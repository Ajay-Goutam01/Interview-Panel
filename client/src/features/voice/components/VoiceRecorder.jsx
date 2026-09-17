import { useState } from "react";
import useVoiceRecorder from "../hooks/useVoiceRecorder";

const VoiceRecorder = ({ onRecordingComplete, disabled = false }) => {
  const {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  const [submitting, setSubmitting] = useState(false);

  const handleStart = async () => {
    if (disabled || submitting) return;

    resetRecording();
    await startRecording();
  };

  const handleStop = () => {
    if (!isRecording) return;

    stopRecording();
  };

  const handleSubmit = async () => {
    if (!audioBlob || submitting) return;

    try {
      setSubmitting(true);

      await onRecordingComplete(audioBlob);

      resetRecording();
    } catch (error) {
      console.error("VOICE ANSWER ERROR:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Voice Answer</h3>

        <p className="mt-1 text-sm text-gray-500">
          Record your answer using your microphone.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={handleStart}
            disabled={disabled || submitting}
            className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="rounded-lg bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            ⏹️ Stop Recording
          </button>
        )}

        {audioBlob && !isRecording && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || submitting}
            className="rounded-lg bg-purple-500 px-5 py-2.5 font-medium text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Submit Voice Answer"}
          </button>
        )}

        {audioBlob && !isRecording && !submitting && (
          <button
            type="button"
            onClick={resetRecording}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Record Again
          </button>
        )}
      </div>

      {isRecording && (
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-500">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
          Recording in progress...
        </div>
      )}

      {audioBlob && !isRecording && !submitting && (
        <p className="mt-4 text-sm text-green-600">
          Recording ready. Submit it when you're ready.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;
