import {
    registerUser,
    loginUser
} from "../services/auth.service.js";

import {generateToken} from "../utils/jwt.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);
    const token = generateToken(user._id);
    res.cookie("token",token ,cookieOptions);

    return res.status(201).json(
        ApiResponse(201, "User registered successfully", { user})
    );
});

export const login = asyncHandler(async (req, res) => {
    const user = await loginUser(req.body);
    const token = generateToken(user._id);
    res.cookie("token",token ,cookieOptions);
    res.status(200).json(
        new ApiResponse(200,"Login Successful",{user})
    )}
);

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token",cookieOptions);

    return res
    .status(200)
    .json(new ApiResponse(200, "Logout successful", null));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200,"Current user fetched !",{
            user: req.user;
        })
    );
});