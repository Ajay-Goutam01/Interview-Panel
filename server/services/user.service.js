import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

const calculateProfileCompletion = (user) => {
  const fields = [
    Boolean(user.name),
    Boolean(user.phone),
    Boolean(user.profile?.bio),
    Boolean(user.profile?.education?.length),
    Boolean(user.profile?.experienceLevel),
    Boolean(user.profile?.targetRoles?.length),
    Boolean(user.profile?.skills?.length),
    Boolean(user.profile?.preferredDifficulty),
  ];

  const completedFields = fields.filter(Boolean).length;

  return Math.round((completedFields / fields.length) * 100);
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password -googleId");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateProfile = async (userId, data = {}) => {
  const allowedFields = [
    "name",
    "phone",
    "bio",
    "education",
    "experienceLevel",
    "targetRoles",
    "skills",
    "preferredDifficulty",
  ];

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.profile) {
    user.profile = {};
  }

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      const val = typeof data[field] === "string" ? data[field].trim() : data[field];

      if (field === "name" || field === "phone") {
        user[field] = val;
      } else if (field === "bio") {
        user.profile.bio = val;
      } else {
        user.profile[field] = val;
      }
    }
  }

  user.profileCompletion = calculateProfileCompletion(user);

  await user.save();

  const sanitizedUser = await User.findById(userId).select("-password -googleId");

  return sanitizedUser;
};