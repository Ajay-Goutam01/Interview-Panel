import Resume from "../models/resume.model.js";
import ApiError from "../utils/apiError.js";
import {
  uploadFile,
  downloadFile,
  deleteStorageFile,
} from "./storage.service.js";
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
  console.log("\n========================================");
  console.log("🚀 RESUME PROCESSING STARTED");
  console.log("Resume ID:", resumeId);
  console.log("User ID:", userId);
  console.log("========================================");

  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    console.log("❌ Resume not found");
    throw new ApiError(404, "Resume not found");
  }

  console.log("✅ Resume found");
  console.log("File URL:", resume.fileUrl);
  console.log("File type:", resume.fileType);
  console.log("Current status:", resume.status);

  if (resume.status === "processing") {
    console.log("⚠️ Resume is already processing");
    throw new ApiError(409, "Resume is already being processed");
  }

  resume.status = "processing";
  await resume.save();

  console.log("🔄 Status changed to processing");

  try {
    // ============================================
    // 1. DOWNLOAD
    // ============================================

    console.log("\n📥 STEP 1: Downloading resume from ImageKit...");

    const fileBuffer = await downloadFile(resume.fileUrl);

    console.log("✅ Resume downloaded");
    console.log("Buffer size:", fileBuffer?.length);

    // ============================================
    // 2. TEXT EXTRACTION
    // ============================================

    console.log("\n📄 STEP 2: Extracting text...");

    const extractedText = await extractTextFromFile(
      fileBuffer,
      resume.fileType,
    );

    console.log("✅ Text extraction completed");
    console.log("Extracted text length:", extractedText?.length);

    if (!extractedText) {
      throw new Error("No readable text found in resume");
    }

    // ============================================
    // 3. RESUME PARSING
    // ============================================

    console.log("\n🤖 STEP 3: Parsing resume with AI...");

    const parsedData = await parseResumeWithAI(extractedText);

    console.log("✅ Resume parsing completed");
    console.log("Parsed data:", JSON.stringify(parsedData, null, 2));

    // ============================================
    // 4. CLAIM EXTRACTION
    // ============================================

    console.log("\n🔍 STEP 4: Extracting claims with AI...");

    const claims = await extractClaimsWithAI(extractedText);

    console.log("✅ Claims extraction completed");
    console.log("Claims:", JSON.stringify(claims, null, 2));

    // ============================================
    // 5. AI ANALYSIS
    // ============================================

    console.log("\n🧠 STEP 5: Running AI resume analysis...");

    const aiAnalysis = await analyzeResumeWithAI({
      parsedData,
      claims,
    });

    console.log("✅ AI analysis completed");
    console.log("AI analysis:", JSON.stringify(aiAnalysis, null, 2));

    // ============================================
    // 6. SAVE RESULT
    // ============================================

    console.log("\n💾 STEP 6: Saving processed resume...");

    resume.extractedText = extractedText;
    resume.parsedData = parsedData;
    resume.claims = claims;

    resume.aiAnalysis = {
      ...aiAnalysis,
      analyzedAt: new Date(),
    };

    resume.status = "processed";

    await resume.save();

    console.log("✅ Resume saved successfully");
    console.log("🎉 RESUME PROCESSING COMPLETED");
    console.log("========================================\n");

    return resume;
  } catch (error) {
    console.error("\n❌ RESUME PROCESSING FAILED");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);
    console.error("Error stack:", error.stack);
    console.error("========================================\n");

    resume.status = "failed";
    await resume.save();

    throw error;
  }
};
