import openai from "../config/openai.js";
import ApiError from "../utils/apiError.js";
import { extractAIText, parseAIJson } from "../utils/aiParser.js";

export const parseResumeWithAI = async (resumeText) => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new ApiError(400, "Resume does not contain enough readable text");
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",

      messages: [
        {
          role: "system",
          content: `
You are an expert resume parser.

Extract information from the resume and return ONLY valid JSON.

Do not invent information.
If a field is not present, return null or an empty array.

The JSON must follow this structure:

{
  "summary": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "achievements": [],
  "certifications": []
}

Education objects:
{
  "degree": "",
  "institution": "",
  "field": "",
  "startYear": null,
  "endYear": null,
  "grade": ""
}

Experience objects:
{
  "company": "",
  "position": "",
  "startDate": null,
  "endDate": null,
  "description": "",
  "technologies": []
}

Project objects:
{
  "name": "",
  "description": "",
  "technologies": [],
  "url": null
}

Certification objects:
{
  "name": "",
  "issuer": "",
  "issueDate": null
}
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

    const parsed = parseAIJson(result);

    return {
      summary: parsed.summary || null,

      skills: Array.isArray(parsed.skills) ? parsed.skills : [],

      education: Array.isArray(parsed.education) ? parsed.education : [],

      experience: Array.isArray(parsed.experience) ? parsed.experience : [],

      projects: Array.isArray(parsed.projects) ? parsed.projects : [],

      achievements: Array.isArray(parsed.achievements)
        ? parsed.achievements
        : [],

      certifications: Array.isArray(parsed.certifications)
        ? parsed.certifications
        : [],
    };
  } catch (error) {
    console.error("RESUME AI PARSER ERROR:", error);
    console.error("MESSAGE:", error.message);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Failed to parse resume using AI: ${error.message}`,
    );
  }
};
