import express, { application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './middlewares/error.js';


import userRouter from './routes/userRoutes.js';
import jobRouter from './routes/jobRoutes.js';
import applicationRouter from './routes/applicationRoutes.js';


const app = express();
dotenv.config();


app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        method: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);


app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);


dbConnection();


app.use(errorMiddleware);

export default app;