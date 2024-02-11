import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";



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

        return next(new ErrorHandler("Failed to upload Resume"))
    }
});



export const employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }

    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });

    res.status(200).json({
        success: true,
        applications,
    })
});


export const jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(
            new ErrorHandler("Employer not allowed to access this resource.", 400)
        );
    }

    const { _id } = req.user;

    const applications = await Application.find({ "applicationID.user": _id });

    res.status(200).json({
        success: true,
        applications,
    });
  }
);


export const jobseekerDeleteApplication = catchAsyncErrors( async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(
            new ErrorHandler("Employer not allowed to access this resource.", 400)
        );
    }

    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
        return next(new ErrorHandler("Application not found!", 404))
    }

    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application Deleted!",
    });
});
