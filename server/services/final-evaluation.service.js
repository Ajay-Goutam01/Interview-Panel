import openai from "../config/openai.js";
import ApiError from "../utils/apiError.js";
import { extractAIText, parseAIJson } from "../utils/aiParser.js";

const VALID_HIRING_RECOMMENDATIONS = [
  "strong_hire",
  "hire",
  "consider",
  "no_hire",
];

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const clampScore = (score, fallback = 70) => {
  if (typeof score !== "number" || isNaN(score)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

export const generateFinalEvaluation = async ({ interview, resume }) => {
  if (!interview?.conversation?.length) {
    throw new ApiError(400, "Interview conversation is empty");
  }

  try {
    const response = await openai.chat.completions.create({
      model: GEMINI_MODEL,

      messages: [
        {
          role: "system",
          content: `
You are a senior hiring evaluator.

Evaluate the candidate based on the complete interview conversation and the candidate's resume.

Evaluate:
1. Technical knowledge
2. Communication
3. Problem solving
4. Confidence
5. Ownership
6. Practical experience
7. Overall interview performance

Do not invent information.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overall": 0,
  "technical": 0,
  "communication": 0,
  "problemSolving": 0,
  "confidence": 0,
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "hiringRecommendation": "consider"
}

Rules:
- All scores must be numbers between 0 and 100.
- hiringRecommendation must be one of:
  "strong_hire",
  "hire",
  "consider",
  "no_hire"
          `,
        },

        {
          role: "user",
          content: JSON.stringify({
            resume: resume?.parsedData,
            claims: resume?.claims || [],
            conversation: interview.conversation,
          }),
        },
      ],
    });

    const result = extractAIText(response);

    if (!result) {
      throw new Error("AI returned an empty final evaluation");
    }

    const evaluation = parseAIJson(result);

    const overall = clampScore(evaluation.overall, 70);

    const technical = clampScore(evaluation.technical, overall);

    const communication = clampScore(evaluation.communication, overall);

    const problemSolving = clampScore(evaluation.problemSolving, overall);

    const confidence = clampScore(evaluation.confidence, overall);

    const hiringRecommendation = VALID_HIRING_RECOMMENDATIONS.includes(
      evaluation.hiringRecommendation,
    )
      ? evaluation.hiringRecommendation
      : overall >= 85
        ? "strong_hire"
        : overall >= 70
          ? "hire"
          : overall >= 50
            ? "consider"
            : "no_hire";

    return {
      overall,
      technical,
      communication,
      problemSolving,
      confidence,

      strengths: Array.isArray(evaluation.strengths)
        ? evaluation.strengths
        : [],

      weaknesses: Array.isArray(evaluation.weaknesses)
        ? evaluation.weaknesses
        : [],

      recommendations: Array.isArray(evaluation.recommendations)
        ? evaluation.recommendations
        : [],

      hiringRecommendation,
    };
  } catch (error) {
    console.error("AI FINAL EVALUATION ERROR:", error);
    console.error("MESSAGE:", error.message);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Failed to generate final evaluation: ${error.message}`,
    );
  }
};
