import express from "express";
import { sendOTP, verifyOTPOnly, resetPassword } from "../controllers/forgotController.ts";

const forgotRouter = express.Router();

forgotRouter.post("/send-otp", sendOTP);
forgotRouter.post("/verify-otp-only", verifyOTPOnly);
forgotRouter.post("/reset-password", resetPassword);

export default forgotRouter;
