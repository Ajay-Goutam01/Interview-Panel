import express from "express";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import { updateProfileValidation } from "../validations/user.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getUserProfile);

router.patch("/profile", updateProfileValidation, updateUserProfile);

export default router;
