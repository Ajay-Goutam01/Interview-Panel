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

export const updateProfile = async (userId, data) => {
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

  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (field === "name" || field === "phone" || field === "bio") {
        updateData[field === "bio" ? "profile.bio" : field] =
          data[field].trim();
      } else {
        updateData[`profile.${field}`] = data[field];
      }
    }
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  for (const [key, value] of Object.entries(updateData)) {
    const [parent, child] = key.split(".");

    if (child) {
      user[parent][child] = value;
    } else {
      user[parent] = value;
    }
  }

  user.profileCompletion = calculateProfileCompletion(user);

  await user.save();

  return user;
};