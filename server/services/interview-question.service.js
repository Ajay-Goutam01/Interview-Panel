import openai from "../config/openai.js";
import ApiError from "../utils/apiError.js";
import { getAgentInstructions } from "./agent-prompt.service.js";
import { extractAIText } from "../utils/aiParser.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

export const generateFirstQuestion = async ({ resume, interview }) => {
  if (!resume?.parsedData) {
    throw new ApiError(400, "Resume analysis is not available");
  }

  const agentInstructions = getAgentInstructions(interview.currentAgent);

  try {
    const response = await openai.chat.completions.create({
      model: GEMINI_MODEL,

      messages: [
        {
          role: "system",
          content: `
${agentInstructions}

You are conducting the first question of this interview section.

Generate ONE interview question.

Rules:
- Base the question on the candidate's resume.
- Do not invent information.
- Ask only ONE question.
- Keep it conversational and realistic.
- Respect the selected language.
- If language is Hinglish, naturally mix Hindi and English.
- Do not mention that you are an AI.
- Do not provide the answer.
- Do not ask multiple questions.

Interview type:
${interview.interviewType}

Difficulty:
${interview.difficulty}

Language:
${interview.language}
          `,
        },

        {
          role: "user",
          content: JSON.stringify({
            resume: resume.parsedData,
            claims: resume.claims || [],
          }),
        },
      ],
    });

    const question = extractAIText(response);

    if (!question) {
      throw new Error("AI returned an empty question");
    }

    return question;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Interview question generation error:", error);

    throw new ApiError(
      500,
      `Failed to generate interview question: ${error.message}`,
    );
  }
};

export const generateFollowUpQuestion = async ({
  interview,
  question,
  answer,
  evaluation,
}) => {
  try {
    const response = await openai.chat.completions.create({
      model: GEMINI_MODEL,

      messages: [
        {
          role: "system",
          content: `
You are conducting a realistic job interview.

Generate ONE follow-up question based on:
- The previous question
- Candidate's answer
- AI evaluation
- Current interviewer
- Interview difficulty

The follow-up must directly continue the conversation.

Rules:
- Do not repeat the previous question.
- Do not ask multiple questions.
- If the candidate made a claim, challenge it when appropriate.
- If the answer is vague, ask for specifics.
- If technical details are missing, probe deeper.
- If the answer is strong, increase the difficulty naturally.
- Understand Hindi, English and Hinglish.
- If language is Hinglish, respond naturally in Hinglish.
- Do not mention that you are an AI.
- Return ONLY the question text.
          `,
        },

        {
          role: "user",
          content: JSON.stringify({
            previousQuestion: question,
            candidateAnswer: answer,
            evaluation,
            currentAgent: interview.currentAgent,
            difficulty: interview.difficulty,
            language: interview.language,
          }),
        },
      ],
    });

    const followUpQuestion = extractAIText(response);

    if (!followUpQuestion) {
      throw new Error("AI returned an empty follow-up question");
    }

    return followUpQuestion;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Follow-up question generation error:", error);

    throw new ApiError(
      500,
      `Failed to generate follow-up question: ${error.message}`,
    );
  }
};
