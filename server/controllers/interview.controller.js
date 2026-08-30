import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import {
  createInterview,
  startInterview,
  submitAnswer,
  getInterviewById,
  getUserInterviews,
} from "../services/interview.service.js";

export const createInterviewController = asyncHandler(async (req, res) => {
  const interview = await createInterview(req.user._id, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Interview created successfully", { interview }));
});

export const startInterviewController = asyncHandler(async (req, res) => {
  const interview = await startInterview(req.user._id, req.params.id);

  return res.status(200).json(
    new ApiResponse(200, "Interview started successfully", {
      interview,
    }),
  );
});

export const submitAnswerController = asyncHandler(async (req, res) => {
  const { answer } = req.body;

  const result = await submitAnswer(req.user._id, req.params.id, answer);

  return res
    .status(200)
    .json(new ApiResponse(200, "Answer submitted successfully", result));
});

export const getInterviewController = asyncHandler(async (req, res) => {
  const interview = await getInterviewById(req.user._id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Interview fetched successfully", { interview }));
});

export const getUserInterviewsController = asyncHandler(
  async (req, res) => {
    const interviews = await getUserInterviews(
      req.user._id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Interview history fetched successfully",
        { interviews }
      )
    );
  }
);