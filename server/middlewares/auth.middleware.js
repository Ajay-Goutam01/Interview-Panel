import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
    throw new ApiError(401, "Authentication token is missing");
    }
    let decoded;

    try{
    decoded = verifyToken(token);
    }catch(err){
        throw new ApiError(401, "Invalid authentication token");
    }

    const user = await User.findById(decoded.userId);
    
    if(!user){
        throw new ApiError(401,"Invalid authentication token");

    }

    if(!user.active){
        throw new ApiError (403,"Your account is inactive. Please contact support.");
    }
    
    req.user = user;
    next();

});

export default authMiddleware;

