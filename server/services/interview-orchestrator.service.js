import ApiError from "../utils/apiError.js";

const AGENT_LIMITS = {
  hr: 4,
  technical: 6,
  hiring_manager: 4,
};

export const getAgentInitialQuestionCount = (interview, agent) => {
  return interview.conversation.filter(
    (message) =>
      message.speaker === "ai" &&
      message.agent === agent &&
      message.questionType === "initial",
  ).length;
};

export const shouldSwitchAgent = (interview) => {
  const currentAgent = interview.currentAgent;

  if (!currentAgent) {
    return true;
  }

  const limit = AGENT_LIMITS[currentAgent];

  if (!limit) {
    throw new ApiError(500, `Invalid interview agent: ${currentAgent}`);
  }

  const questionCount = getAgentInitialQuestionCount(interview, currentAgent);

  return questionCount >= limit;
};

export const getNextAgent = (interview) => {
  const currentIndex = interview.agents.indexOf(interview.currentAgent);

  if (currentIndex === -1) {
    return interview.agents[0] || null;
  }

  const nextIndex = currentIndex + 1;

  if (nextIndex >= interview.agents.length) {
    return null;
  }

  return interview.agents[nextIndex];
};

export const moveToNextAgent = (interview) => {
  const nextAgent = getNextAgent(interview);

  if (!nextAgent) {
    interview.currentAgent = null;
    return null;
  }

  interview.currentAgent = nextAgent;

  return nextAgent;
};

export const completeInterviewIfFinished = (interview) => {
  if (interview.currentAgent !== null) {
    return false;
  }

  interview.status = "completed";
  interview.currentQuestion = null;
  interview.completedAt = new Date();

  return true;
};
