import Interview from "../models/interview.model.js";
import Resume from "../models/resume.model.js";
import ApiError from "../utils/apiError.js";
import {
  generateFirstQuestion,
  generateFollowUpQuestion,
} from "./interview-question.service.js";
import { evaluateAnswer } from "./answer-evaluation.service.js";
import {
  shouldSwitchAgent,
  moveToNextAgent,
  completeInterviewIfFinished,
} from "./interview-orchestrator.service.js";

import { generateFinalEvaluation } from "./final-evaluation.service.js";

export const createInterview = async (userId, data = {}) => {
  const {
    resumeId,
    interviewType = "full",
    difficulty = "medium",
    language = "hinglish",
  } = data;

  // Resume ID required
  if (!resumeId) {
    throw new ApiError(400, "Resume ID is required");
  }

  // Find user's resume
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  // Resume must be processed before interview
  if (resume.status !== "processed") {
    throw new ApiError(
      400,
      "Resume must be processed before starting an interview",
    );
  }

  // Default agents for full interview
  let agents;

  if (interviewType === "hr") {
    agents = ["hr"];
  } else if (interviewType === "technical") {
    agents = ["technical"];
  } else if (interviewType === "behavioral") {
    agents = ["hr", "hiring_manager"];
  } else {
    agents = ["hr", "technical", "hiring_manager"];
  }

  const interview = await Interview.create({
    user: userId,
    resume: resumeId,
    interviewType,
    difficulty,
    language,
    agents,
    status: "created",
  });

  return interview;
};
export const startInterview = async (userId, interviewId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (interview.status === "completed") {
    throw new ApiError(400, "Interview has already been completed");
  }

  if (interview.status === "active") {
    throw new ApiError(400, "Interview is already active");
  }

  const resume = await Resume.findOne({
    _id: interview.resume,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (resume.status !== "processed") {
    throw new ApiError(
      400,
      "Resume must be processed before starting interview",
    );
  }

  interview.currentAgent = interview.agents[0];

  const question = await generateFirstQuestion({
    resume,
    interview,
  });

  interview.currentQuestion = question;

  interview.conversation.push({
    speaker: "ai",
    agent: interview.currentAgent,
    text: question,
    language: interview.language,
    questionType: "initial",
  });

  interview.status = "active";
  interview.startedAt = new Date();

  await interview.save();

  return interview;
};

export const submitAnswer = async (userId, interviewId, answer) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (interview.status !== "active") {
    throw new ApiError(400, "Interview is not active");
  }

  if (!answer || !answer.trim()) {
    throw new ApiError(400, "Answer cannot be empty");
  }

  const question = interview.currentQuestion;

  if (!question) {
    throw new ApiError(400, "No active question found");
  }

  const evaluation = await evaluateAnswer({
    interview,
    question,
    answer,
  });

  // Save candidate answer with per-turn evaluation
  interview.conversation.push({
    speaker: "candidate",
    agent: interview.currentAgent,
    text: answer.trim(),
    language: interview.language,

    evaluation: {
      score: evaluation.score,
      quality: evaluation.quality,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      missingPoints: evaluation.missingPoints,
      feedback: evaluation.feedback,
    },
  });

  let nextQuestion = null;

  // 1. Follow-up if requested and agent limit not reached
  if (evaluation.shouldFollowUp && !shouldSwitchAgent(interview)) {
    nextQuestion = await generateFollowUpQuestion({
      interview,
      question,
      answer,
      evaluation,
    });

    interview.currentQuestion = nextQuestion;

    interview.conversation.push({
      speaker: "ai",
      agent: interview.currentAgent,
      text: nextQuestion,
      language: interview.language,
      questionType: "follow_up",
    });
  } else if (!shouldSwitchAgent(interview)) {
    // 2. Current agent continues asking initial questions until limit reached
    const resume = await Resume.findById(interview.resume);

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    nextQuestion = await generateFirstQuestion({
      resume,
      interview,
    });

    interview.currentQuestion = nextQuestion;

    interview.conversation.push({
      speaker: "ai",
      agent: interview.currentAgent,
      text: nextQuestion,
      language: interview.language,
      questionType: "initial",
    });
  } else {
    // 3. Current agent reached limit, move to next agent or complete
    interview.currentQuestion = null;
    const nextAgent = moveToNextAgent(interview);

    if (nextAgent) {
      const resume = await Resume.findById(interview.resume);

      if (!resume) {
        throw new ApiError(404, "Resume not found");
      }

      nextQuestion = await generateFirstQuestion({
        resume,
        interview,
      });

      interview.currentQuestion = nextQuestion;

      interview.conversation.push({
        speaker: "ai",
        agent: nextAgent,
        text: nextQuestion,
        language: interview.language,
        questionType: "initial",
      });
    } else {
      const resume = await Resume.findById(interview.resume);

      if (!resume) {
        throw new ApiError(404, "Resume not found");
      }

      const finalEvaluation = await generateFinalEvaluation({
        interview,
        resume,
      });

      interview.score = {
        overall: finalEvaluation.overall,
        technical: finalEvaluation.technical,
        communication: finalEvaluation.communication,
        problemSolving: finalEvaluation.problemSolving,
        confidence: finalEvaluation.confidence,
        strengths: finalEvaluation.strengths,
        weaknesses: finalEvaluation.weaknesses,
        recommendations: finalEvaluation.recommendations,
        hiringRecommendation: finalEvaluation.hiringRecommendation,
      };

      interview.currentAgent = null;
      interview.currentQuestion = null;
      interview.status = "completed";
      interview.completedAt = new Date();
    }
  }

  await interview.save();

  return {
    evaluation,
    nextQuestion,
    interview,
  };
};
export const getInterviewById = async (userId, interviewId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  }).populate({
    path: "resume",
    select: "originalFileName fileType status parsedData aiAnalysis",
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  return interview;
};

export const getUserInterviews = async (userId) => {
  const interviews = await Interview.find({
    user: userId,
  })
    .populate({
      path: "resume",
      select: "originalFileName fileType status",
    })
    .sort({ createdAt: -1 });

  return interviews;
};
