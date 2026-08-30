import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createInterviewController , startInterviewController, submitAnswerController,getInterviewController,getUserInterviewsController} from "../controllers/interview.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getUserInterviewsController);

router.get("/:id", getInterviewController);

router.post("/", createInterviewController);

router.post("/:id/start", startInterviewController);

router.post("/:id/answer", submitAnswerController);

export default router;
