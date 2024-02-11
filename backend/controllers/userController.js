import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, phone, password, role } = req.body;

        if (!name || !email || !phone || !password || !role) {
            return next(new ErrorHandler("Please fill full form!"));
        }

        const isEmail = await User.findOne({ email });

        if (isEmail) {
            return next(new ErrorHandler("Email already registered!"));
        }

        const user = await User.create({
            name, email, phone, password, role,
        });

        sendToken(user, 201, res, "User Registered!");
    } catch (error) {
        next(error);
    }
});



// export const login = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const { email, password, role } = req.body;

//         if (!email || !password || !role) {
//             return next(new ErrorHandler("Please provide email, password and role."));
//         }

//         const user = await User.findOne({ email }).select("+password");

//         if (!user) {
//             return next(new ErrorHandler("Invalid Email or Password.", 400));
//         }

//         const isPasswordMatched = await user.comparePassword(password);

//         if (!isPasswordMatched) {
//             return next(new ErrorHandler("Invalid Email Or Password.", 400));
//         }

//         if (user.role !== role) {
//             return next(
//                 new ErrorHandler(`User with provided email and ${role} not found!`, 404)
//             );
//         }

//         sendToken(user, 201, res, "User Logged In!");
//     } catch (error) {
//         next(error)
//     }
// });







export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: "Please provide email, password, and role." });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password." });
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password." });
        }

        if (user.role !== role) {
            return res.status(404).json({ success: false, message: `User with provided email and ${role} not found.` });
        }

        sendToken(user, 201, res, "User Logged In!");
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};







export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(201)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Logged Out Successfully."
        });
});



export const getUser = catchAsyncErrors((req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});