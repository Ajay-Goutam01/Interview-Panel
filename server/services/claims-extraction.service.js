import openai from "../config/openai.js";
import ApiError from "../utils/apiError.js";
import { extractAIText, parseAIJson } from "../utils/aiParser.js";

const VALID_CLAIM_TYPES = [
  "achievement",
  "performance",
  "technical",
  "leadership",
  "experience",
  "education",
  "other",
];

export const extractClaimsWithAI = async (resumeText) => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new ApiError(
      400,
      "Resume does not contain enough readable text"
    );
  }

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",

      input: [
        {
          role: "system",
          content: `
You are an expert resume claim extraction system.

Your job is to identify claims made by the candidate
that could reasonably be challenged or verified during an interview.

Focus especially on:

- Numerical achievements
- Performance improvements
- Percentages
- Revenue or cost impact
- Scale claims
- Leadership claims
- Technical ownership
- Optimization claims
- Awards
- Certifications
- Project impact
- Team size
- User/customer numbers
- Deployment or production claims

Do NOT invent claims.

Return ONLY valid JSON.

Use this structure:

{
  "claims": [
    {
      "text": "",
      "type": "",
      "metric": null,
      "context": null,
      "confidence": 0,
      "verificationRequired": false
    }
  ]
}

Allowed types:
achievement, performance, technical, leadership, experience, education, other

confidence must be between 0 and 1.
verificationRequired should be true when the claim should reasonably be challenged during an interview.
          `,
        },
        {
          role: "user",
          content: resumeText,
        },
      ],
    });

    const result = extractAIText(response);

    if (!result) {
      throw new Error("AI returned an empty response");
    }

    const parsedResult = parseAIJson(result);
    const rawClaims = Array.isArray(parsedResult.claims) ? parsedResult.claims : [];

    const validatedClaims = rawClaims
      .filter((c) => c && typeof c.text === "string" && c.text.trim().length > 0)
      .map((c) => ({
        text: c.text.trim(),
        type: VALID_CLAIM_TYPES.includes(c.type) ? c.type : "other",
        metric: c.metric ? String(c.metric).trim() : null,
        context: c.context ? String(c.context).trim() : null,
        confidence: typeof c.confidence === "number" ? Math.max(0, Math.min(1, c.confidence)) : 0.8,
        verificationRequired: Boolean(c.verificationRequired),
      }));

    return validatedClaims;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Failed to extract claims from resume: ${error.message}`
    );
  }
};