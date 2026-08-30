import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import Interview from "../models/interview.model.js";

import {
  createVoiceSession,
  getVoiceSession,
  endVoiceSession,
} from "../services/voice-session.service.js";

export const startVoiceSession = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const interview = await Interview.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (interview.status !== "active") {
    throw new ApiError(400, "Interview is not active");
  }

  const existingSession = getVoiceSession({
    userId: req.user._id,
    interviewId: id,
  });

  if (existingSession) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Voice session already active", { session: existingSession }),
      );
  }

  const session = createVoiceSession({
    userId: req.user._id,
    interviewId: id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Voice session started", { session }));
});

export const getVoiceSessionController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = getVoiceSession({
    userId: req.user._id,
    interviewId: id,
  });

  if (!session) {
    throw new ApiError(404, "Voice session not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Voice session fetched successfully", { session }));
});

export const stopVoiceSession = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = endVoiceSession({
    userId: req.user._id,
    interviewId: id,
  });

  if (!session) {
    throw new ApiError(404, "Voice session not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Voice session ended", { session }));
});
