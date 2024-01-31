import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../middlewares/error";



export const postApplication = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employer") {
        return next(
            new ErrorHandler("Employer not allowed to access this resource.", 400)
        );
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Resume File Required!", 400));
    }

    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/webp"];

    if (!allowedFormats.includes(resume.mimetypes)) {
        return next(new ErrorHandler("Invalid file type. Please upload a PNG file.", 400))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
        );

        return next (new ErrorHandler("Failed to upload Resume"))
    }
});



export const employerGetAllApplications = catchAsyncErrors( () => {} );


export const jobseekerGetAllApplications = catchAsyncErrors( () => {} )


export const jobseekerDeleteApplication = catchAsyncErrors( () => {} )
