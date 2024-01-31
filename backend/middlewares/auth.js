import { User } from "../models/userSchema";
import { catchAsyncErrors } from "./catchAsyncError";
import ErrorHandler from "./error";
import jwt from 'jsonwebtoken';




export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("User Not Authorized", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
});