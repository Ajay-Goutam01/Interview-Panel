import { getProfile, updateProfile } from "../services/user.service.js";

import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", {
      user,
    }),
  );
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user._id, req.body);

  return res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", {
      user,
    }),
  );
});
