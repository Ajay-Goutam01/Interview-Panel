import express from "express";

import {
  uploadResumeController,
  getResumesController,
  getResumeController,
  deleteResumeController,
  processResumeController
} from "../controllers/resume.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", upload.single("resume"), uploadResumeController);

router.get("/", getResumesController);

router.post(
  "/:id/process",
  processResumeController
);

router.get("/:id", getResumeController);

router.delete("/:id", deleteResumeController);

export default router;
