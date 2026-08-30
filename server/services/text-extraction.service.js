import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import ApiError from "../utils/apiError.js";

export const extractTextFromFile = async (buffer, fileType) => {
  if (!buffer) {
    throw new ApiError(400, "File data is missing");
  }

  try {
    if (fileType === "pdf") {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      const text = data?.text?.trim() || "";

      if (!text) {
        throw new ApiError(400, "Could not extract text from PDF. It may be scanned or empty.");
      }

      return text;
    }

    if (fileType === "docx" || fileType === "doc") {
      const result = await mammoth.extractRawText({
        buffer,
      });

      const text = result?.value?.trim() || "";

      if (!text) {
        throw new ApiError(400, "Could not extract text from document. It may be empty.");
      }

      return text;
    }

    throw new ApiError(
      400,
      "Text extraction is not supported for this file type"
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Failed to extract text from resume: ${error.message}`
    );
  }
};