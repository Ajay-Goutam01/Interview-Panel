import openai from "../config/openai.js";
import ApiError from "../utils/apiError.js";
import { extractAIText, parseAIJson } from "../utils/aiParser.js";

export const analyzeResumeWithAI = async (arg1, arg2) => {
  // Support both ({ parsedData, claims }) and (parsedData, claims)
  let parsedData;
  let claims;

  if (arg1 && typeof arg1 === "object" && "parsedData" in arg1) {
    parsedData = arg1.parsedData;
    claims = arg1.claims;
  } else {
    parsedData = arg1;
    claims = arg2;
  }

  if (!parsedData) {
    throw new ApiError(400, "Parsed resume data is required");
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",

      messages: [
        {
          role: "system",
          content: `
You are an expert technical recruiter and resume evaluator.

Analyze the candidate's structured resume data and identified resume claims.

Evaluate the resume based on:
1. Technical strength
2. Experience quality
3. Project quality
4. Skills relevance
5. Achievement impact
6. Career progression
7. Clarity and specificity
8. Interview readiness

Do not invent information.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "recommendations": []
}

Rules:
- overallScore must be a number between 0 and 100.
- strengths must contain concise observations.
- weaknesses must identify genuine weaknesses.
- missingSkills should contain skills that would improve the profile.
- recommendations should be actionable.
          `,
        },

        {
          role: "user",
          content: JSON.stringify({
            parsedData,
            claims: claims || [],
          }),
        },
      ],
    });

    const result = extractAIText(response);

    if (!result) {
      throw new Error("AI returned an empty response");
    }

    const analysis = parseAIJson(result);

    const score =
      typeof analysis.overallScore === "number"
        ? Math.max(0, Math.min(100, Math.round(analysis.overallScore)))
        : 70;

    return {
      overallScore: score,

      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],

      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],

      missingSkills: Array.isArray(analysis.missingSkills)
        ? analysis.missingSkills
        : [],

      recommendations: Array.isArray(analysis.recommendations)
        ? analysis.recommendations
        : [],
    };
  } catch (error) {
    console.error("AI RESUME ANALYSIS ERROR:", error);
    console.error("MESSAGE:", error.message);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, `Failed to analyze resume: ${error.message}`);
  }
};
