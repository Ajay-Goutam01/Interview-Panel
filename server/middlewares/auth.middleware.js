import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Authentication token is missing");
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Authentication token has expired");
    }
    throw new ApiError(401, "Invalid authentication token");
  }

  if (!decoded?.userId) {
    throw new ApiError(401, "Invalid token payload");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User not found or token revoked");
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account is inactive. Please contact support.",
    );
  }

  req.user = user;

  next();
});

export default authMiddleware;
