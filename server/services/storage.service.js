import { Readable } from "stream";
import imagekit from "../config/imagekit.js";
import ApiError from "../utils/apiError.js";

export const uploadFile = async ({
  fileBuffer,
  fileName,
  folder = "/resumes",
}) => {
  try {
    if (!fileBuffer) {
      throw new ApiError(400, "File buffer is missing");
    }

    if (!fileName) {
      throw new ApiError(400, "File name is missing");
    }

    // Convert Multer Buffer into a readable stream
    // ImageKit Node SDK v7.11.0 handles the stream correctly.
    const fileStream = Readable.from(fileBuffer);

    const response = await imagekit.files.upload({
      file: fileStream,
      fileName,
      folder,
    });

    return {
      fileId: response.fileId,
      fileUrl: response.url,
      filePath: response.filePath,
    };
  } catch (error) {
    console.error("IMAGEKIT UPLOAD ERROR:", error);
    console.error("IMAGEKIT MESSAGE:", error.message);
    console.error("IMAGEKIT RESPONSE:", error.error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, `File upload failed: ${error.message}`);
  }
};

export const downloadFile = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== "string") {
    throw new ApiError(400, "Invalid file URL");
  }

  // Basic URL validation
  try {
    const parsedUrl = new URL(fileUrl);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    throw new ApiError(400, "Invalid file URL format");
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download file from ImageKit: HTTP ${response.status}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return Buffer.from(arrayBuffer);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, `File download failed: ${error.message}`);
  }
};

export const deleteStorageFile = async (fileId) => {
  if (!fileId) {
    return;
  }

  try {
    await imagekit.files.delete(fileId);
  } catch (error) {
    // Storage deletion failure should not break the main operation
    console.error(
      `Warning: Failed to delete file ${fileId} from storage:`,
      error.message,
    );
  }
};
