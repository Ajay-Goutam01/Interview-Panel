import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Navbar from "../../../components/layout/Navbar";

import interviewService from "../services/interview.service";
import VoiceRecorder from "../../voice/components/VoiceRecorder";
import voiceService from "../../voice/services/voice.service";

const InterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fetchInterview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await interviewService.getInterview(id);

      const data = response.data?.interview || response.data;

      setInterview(data);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load interview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const handleStart = async () => {
    setStarting(true);
    setError("");

    try {
      const response = await interviewService.startInterview(id);

      const data = response.data?.interview || response.data;

      setInterview(data);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to start interview.");
    } finally {
      setStarting(false);
    }
  };

  const handleSubmitAnswer = async (event) => {
    event.preventDefault();

    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }

    setSubmitting(true);
    setError("");
    setEvaluation(null);
    setVoiceTranscript("");

    try {
      const response = await interviewService.submitAnswer(id, {
        answer: answer.trim(),
      });

      const data = response.data || {};

      setEvaluation(data.evaluation || null);

      if (data.interview) {
        setInterview(data.interview);
      }

      setAnswer("");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to submit your answer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const playAIQuestion = (base64Audio) => {
    if (!base64Audio) return;

    try {
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);

      setIsSpeaking(true);

      audio.onended = () => {
        setIsSpeaking(false);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        console.error("AI AUDIO PLAYBACK ERROR");
      };

      audio.play().catch((error) => {
        setIsSpeaking(false);
        console.error("AI AUDIO PLAY ERROR:", error);
      });
    } catch (error) {
      setIsSpeaking(false);
      console.error("AI AUDIO ERROR:", error);
    }
  };

  const handleVoiceAnswer = async (audioBlob) => {
    if (!audioBlob || !id) return;

    setSubmitting(true);
    setError("");
    setEvaluation(null);
    setVoiceTranscript("");

    try {
      const response = await voiceService.submitVoiceAnswer(id, audioBlob);

      const data = response?.data;

      if (!data) {
        throw new Error("Invalid voice answer response.");
      }

      if (data.transcript) {
        setVoiceTranscript(data.transcript);
      }

      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }

      if (data.interview) {
        setInterview(data.interview);
      }
      if (data.audio) {
        playAIQuestion(data.audio);
      }
    } catch (error) {
      console.error("VOICE ANSWER ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to process voice answer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-4xl px-6 py-12">
          <Card className="p-10 text-center">
            <p className="text-sm text-gray-500">Loading interview...</p>
          </Card>
        </main>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-4xl px-6 py-12">
          <Card className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <Button
              className="mt-5"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  const isCreated = interview.status === "created";
  const isActive = interview.status === "active";
  const isCompleted = interview.status === "completed";

  const conversation = Array.isArray(interview.conversation)
    ? interview.conversation
    : [];

  const currentAgent = interview.currentAgent;

  const agentName = {
    hr: "HR Interviewer",
    technical: "Technical Interviewer",
    hiring_manager: "Hiring Manager",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                AI Interview
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                {interview.interviewType === "full"
                  ? "Full Interview"
                  : `${interview.interviewType} Interview`}
              </h1>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                  {interview.difficulty}
                </span>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium capitalize text-purple-700">
                  {interview.language}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                  {interview.status}
                </span>
              </div>
            </div>

            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              Exit
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Start Interview */}
          {isCreated && (
            <Card className="mt-6 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-3xl">
                🎤
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                Ready for your interview?
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                The AI interviewer will ask personalized questions based on your
                processed resume, skills and claims.
              </p>

              <Button className="mt-6" loading={starting} onClick={handleStart}>
                Start Interview
              </Button>
            </Card>
          )}

          {/* Active Interview */}
          {isActive && (
            <>
              {/* Current Agent */}
              <Card className="mt-6 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                    🤖
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Current Interviewer
                    </p>

                    <h2 className="text-sm font-semibold text-gray-900">
                      {agentName[currentAgent] || "AI Interviewer"}
                    </h2>
                  </div>
                </div>
              </Card>

              {/* Conversation */}
              <Card className="mt-6 p-6">
                <div className="space-y-5">
                  {conversation.map((message, index) => (
                    <div
                      key={message._id || index}
                      className={
                        message.speaker === "ai"
                          ? "flex justify-start"
                          : "flex justify-end"
                      }
                    >
                      <div
                        className={
                          message.speaker === "ai"
                            ? "max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3"
                            : "max-w-[85%] rounded-2xl rounded-tr-sm bg-purple-600 px-4 py-3 text-white"
                        }
                      >
                        <p className="mb-1 text-xs font-medium opacity-60">
                          {message.speaker === "ai"
                            ? agentName[message.agent] || "AI Interviewer"
                            : "You"}
                        </p>

                        <p className="text-sm leading-6">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Answer */}
              <Card className="mt-6 p-6">
                <form onSubmit={handleSubmitAnswer}>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Your Answer
                  </label>

                  <textarea
                    id="answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    disabled={submitting}
                    rows={6}
                    placeholder="Type your answer here..."
                    className="mt-3 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                  <div className="mt-4 flex justify-end">
                    <Button
                      type="submit"
                      loading={submitting}
                      disabled={!answer.trim() || submitting}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </form>

                {/* Voice Recorder */}
                <VoiceRecorder
                  onRecordingComplete={handleVoiceAnswer}
                  disabled={submitting}
                />

                {/* Voice Transcript */}
                {voiceTranscript && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Voice Transcript
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {voiceTranscript}
                    </p>
                  </div>
                )}
              </Card>

              {/* Latest Evaluation */}
              {evaluation && (
                <Card className="mt-6 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      AI Feedback
                    </h2>

                    <span className="text-2xl font-bold text-purple-600">
                      {evaluation.score ?? 0}/100
                    </span>
                  </div>

                  {evaluation.quality && (
                    <p className="mt-2 text-sm capitalize text-gray-500">
                      Quality: {evaluation.quality}
                    </p>
                  )}

                  {evaluation.feedback && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                      <p className="text-sm leading-6 text-gray-700">
                        {evaluation.feedback}
                      </p>
                    </div>
                  )}

                  {evaluation.strengths?.length > 0 && (
                    <div className="mt-5">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Strengths
                      </h3>

                      <ul className="mt-2 space-y-2">
                        {evaluation.strengths.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            ✓ {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.weaknesses?.length > 0 && (
                    <div className="mt-5">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Areas to Improve
                      </h3>

                      <ul className="mt-2 space-y-2">
                        {evaluation.weaknesses.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

          {/* Completed */}
          {isCompleted && (
            <Card className="mt-6 p-8">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                  ✓
                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                  Interview Completed
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Your AI interview has been completed successfully.
                </p>
              </div>

              {/* Scores */}
              {interview.score && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <ScoreCard label="Overall" value={interview.score.overall} />

                  <ScoreCard
                    label="Technical"
                    value={interview.score.technical}
                  />

                  <ScoreCard
                    label="Communication"
                    value={interview.score.communication}
                  />

                  <ScoreCard
                    label="Problem Solving"
                    value={interview.score.problemSolving}
                  />
                </div>
              )}

              {/* Strengths */}
              {interview.score?.strengths?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Strengths
                  </h3>

                  <div className="mt-3 space-y-2">
                    {interview.score.strengths.map((item, index) => (
                      <p
                        key={index}
                        className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
                      >
                        ✓ {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses */}
              {interview.score?.weaknesses?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Areas to Improve
                  </h3>

                  <div className="mt-3 space-y-2">
                    {interview.score.weaknesses.map((item, index) => (
                      <p
                        key={index}
                        className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800"
                      >
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {interview.score?.recommendations?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recommendations
                  </h3>

                  <div className="mt-3 space-y-2">
                    {interview.score.recommendations.map((item, index) => (
                      <p
                        key={index}
                        className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiring Recommendation */}
              {interview.score?.hiringRecommendation && (
                <div className="mt-6 rounded-xl bg-purple-50 p-5 text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-purple-500">
                    Hiring Recommendation
                  </p>

                  <p className="mt-2 text-lg font-bold capitalize text-purple-800">
                    {interview.score.hiringRecommendation.replace("_", " ")}
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

const ScoreCard = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-gray-200 p-5 text-center">
      <p className="text-xs font-medium text-gray-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {typeof value === "number" ? value : "--"}
      </p>

      <p className="text-xs text-gray-400">/100</p>
    </div>
  );
};

export default InterviewPage;
