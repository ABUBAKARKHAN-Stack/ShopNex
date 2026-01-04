import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/index';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model';
import { JwtUpdtedPayload } from '../types/main.types';
import asyncHandler from 'express-async-handler';
import { env } from '../config/env';



const authCheck = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    //! Check if JWT_SECRET is defined
    if (!env.JWT_SECRET) {
        throw new Error("❌ JWT_SECRET is missing from environment variables!");
    }

    //* Extract token from cookies or authorization header
    const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];
    if (!token) throw new ApiError(401, "Unauthorized: No token provided");

    //* Verify and decode JWT
    const decodedToken = jwt.verify(token, env.JWT_SECRET) as JwtUpdtedPayload;

    //* Fetch user from DB
    const user = await userModel.findById(decodedToken.userId);
    if (!user) throw new ApiError(401, "Unauthorized: User not found");

    //* Store user in response locals
    res.locals.user = user;
    next();
})

export default authCheck;
