import openai from "../config/openai.js";
import ApiError from "../utils/apiError.js";
import { extractAIText, parseAIJson } from "../utils/aiParser.js";

const VALID_QUALITIES = ["weak", "average", "good", "excellent"];

export const evaluateAnswer = async ({ interview, question, answer }) => {
  if (!question) {
    throw new ApiError(400, "Question is required");
  }

  if (!answer || answer.trim().length === 0) {
    throw new ApiError(400, "Answer cannot be empty");
  }

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",

      input: [
        {
          role: "system",
          content: `
You are an expert interviewer evaluating a candidate's answer.

Evaluate the answer against the interview question.

Consider:
- Correctness
- Technical depth
- Relevance
- Clarity
- Specificity
- Confidence
- Ownership
- Communication quality

The candidate may answer in Hindi, English, or Hinglish.
Understand the meaning without penalizing language mixing.

Do not judge grammar harshly.

Return ONLY valid JSON.

Use exactly this structure:
{
  "score": 0,
  "quality": "weak",
  "strengths": [],
  "weaknesses": [],
  "missingPoints": [],
  "shouldFollowUp": true,
  "followUpReason": "",
  "feedback": ""
}

Rules:
score must be a number between 0 and 100.
quality must be one of: weak, average, good, excellent
shouldFollowUp should be true when:
- the answer is vague
- the answer contains an unsupported claim
- important details are missing
- deeper technical reasoning is needed
- the interviewer should challenge the candidate
          `,
        },

        {
          role: "user",
          content: JSON.stringify({
            question,
            answer: answer.trim(),
            interviewType: interview?.interviewType,
            difficulty: interview?.difficulty,
            currentAgent: interview?.currentAgent,
          }),
        },
      ],
    });

    const result = extractAIText(response);

    if (!result) {
      throw new Error("AI returned an empty evaluation");
    }

    const evaluation = parseAIJson(result);

    const score = typeof evaluation.score === "number"
      ? Math.max(0, Math.min(100, Math.round(evaluation.score)))
      : 60;

    const quality = VALID_QUALITIES.includes(evaluation.quality)
      ? evaluation.quality
      : score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "average" : "weak";

    return {
      score,
      quality,
      strengths: Array.isArray(evaluation.strengths) ? evaluation.strengths : [],
      weaknesses: Array.isArray(evaluation.weaknesses) ? evaluation.weaknesses : [],
      missingPoints: Array.isArray(evaluation.missingPoints) ? evaluation.missingPoints : [],
      shouldFollowUp: Boolean(evaluation.shouldFollowUp),
      followUpReason: evaluation.followUpReason || "",
      feedback: evaluation.feedback || "",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, `Failed to evaluate answer: ${error.message}`);
  }
};
