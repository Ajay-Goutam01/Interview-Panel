import {
  uploadResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  processResume,
} from "../services/resume.service.js";

import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const uploadResumeController = asyncHandler(async (req, res) => {
  const resume = await uploadResume(req.user._id, req.file);

  return res.status(201).json(
    new ApiResponse(201, "Resume uploaded successfully", {
      resume,
    }),
  );
});

export const getResumesController = asyncHandler(async (req, res) => {
  const resumes = await getUserResumes(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, "Resumes fetched successfully", {
      resumes,
    }),
  );
});

export const getResumeController = asyncHandler(async (req, res) => {
  const resume = await getResumeById(req.user._id, req.params.id);

  return res.status(200).json(
    new ApiResponse(200, "Resume fetched successfully", {
      resume,
    }),
  );
});

export const deleteResumeController = asyncHandler(async (req, res) => {
  await deleteResume(req.user._id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Resume deleted successfully"));
});
export const processResumeController = asyncHandler(async (req, res) => {
  const resume = await processResume(req.user._id, req.params.id);

  return res.status(200).json(
    new ApiResponse(200, "Resume processed successfully", {
      resume,
    }),
  );
});
