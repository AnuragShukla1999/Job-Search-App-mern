import express from 'express';
import { getUser, login, logout, register } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncError.js';


const router = express.Router();

router.post("/register", catchAsyncErrors(register));
router.post("/login", login);
router.get("logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);


export default router;