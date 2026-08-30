import Resume from "../models/resume.model.js";
import ApiError from "../utils/apiError.js";
import { uploadFile, downloadFile, deleteStorageFile } from "./storage.service.js";
import { extractTextFromFile } from "./text-extraction.service.js";
import { parseResumeWithAI } from "./resume-parser.service.js";
import { extractClaimsWithAI } from "./claims-extraction.service.js";
import { analyzeResumeWithAI } from "./ai-analysis.service.js";

export const uploadResume = async (userId, file) => {
  if (!file) {
    throw new ApiError(400, "Resume file is required");
  }

  const fileName = `${Date.now()}-${file.originalname}`;

  const uploadedFile = await uploadFile({
    fileBuffer: file.buffer,
    fileName,
    folder: "/resumes",
  });

  const fileType =
    file.mimetype === "application/pdf"
      ? "pdf"
      : file.mimetype === "application/msword"
        ? "doc"
        : "docx";

  const resume = await Resume.create({
    user: userId,
    originalFileName: file.originalname,
    fileId: uploadedFile.fileId,
    fileUrl: uploadedFile.fileUrl,
    fileType,
    fileSize: file.size,
    status: "uploaded",
  });

  return resume;
};

export const getUserResumes = async (userId) => {
  return await Resume.find({
    user: userId,
  })
    .select("-extractedText -parsedData -claims -aiAnalysis")
    .sort({ createdAt: -1 });
};

export const getResumeById = async (userId, resumeId) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return resume;
};

export const deleteResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (resume.fileId) {
    await deleteStorageFile(resume.fileId);
  }

  await resume.deleteOne();

  return true;
};

export const processResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (resume.status === "processing") {
    throw new ApiError(409, "Resume is already being processed");
  }

  resume.status = "processing";
  await resume.save();

  try {
    const fileBuffer = await downloadFile(resume.fileUrl);

    const extractedText = await extractTextFromFile(
      fileBuffer,
      resume.fileType,
    );

    if (!extractedText) {
      throw new Error("No readable text found in resume");
    }

    // AI Resume Parsing
    const parsedData = await parseResumeWithAI(extractedText);

    // AI Claim Extraction
    const claims = await extractClaimsWithAI(extractedText);

    // AI Analysis
    const aiAnalysis = await analyzeResumeWithAI({ parsedData, claims });

    resume.extractedText = extractedText;
    resume.parsedData = parsedData;
    resume.claims = claims;
    resume.aiAnalysis = {
      ...aiAnalysis,
      analyzedAt: new Date(),
    };
    resume.status = "processed";

    await resume.save();

    return resume;
  } catch (error) {
    resume.status = "failed";
    await resume.save();

    throw error;
  }
};
