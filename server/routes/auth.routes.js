import express from "express";

import {register,login,logout,getCurrentUser} from "../controllers/auth.controller.js";

import {registerValidation, loginValidation} from "../validations/auth.validation.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidation, register); 
authRouter.post("/login", loginValidation, login);
authRouter.post("/logout", logout);
authRouter.get("/me",authMiddleware,getCurrentUser);

export default authRouter;

