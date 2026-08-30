/**
 * Extracts text from OpenAI response object (supports responses.create and chat.completions.create)
 */
export const extractAIText = (response) => {
  if (!response) return "";
  if (typeof response === "string") return response.trim();
  if (response.output_text) return response.output_text.trim();
  if (response.choices?.[0]?.message?.content) {
    return response.choices[0].message.content.trim();
  }
  if (Array.isArray(response.output) && response.output[0]?.content?.[0]?.text) {
    return response.output[0].content[0].text.trim();
  }
  return "";
};

/**
 * Safely extracts and parses JSON returned by OpenAI models.
 * Strips markdown formatting (e.g. ```json ... ```) and handles edge cases.
 */
export const parseAIJson = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("AI returned empty or non-string response");
  }

  let cleaned = rawText.trim();

  // Remove markdown code block if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Find the first { or [ and the last } or ]
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let startIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace !== -1) {
      cleaned = cleaned.substring(startIdx, lastBrace + 1);
    }
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    const lastBracket = cleaned.lastIndexOf("]");
    if (lastBracket !== -1) {
      cleaned = cleaned.substring(startIdx, lastBracket + 1);
    }
  }

  return JSON.parse(cleaned);
};
