import express from "express";
import { loginUser, loginWithOTP } from "../controllers/login.ts";
import { sendOTP } from "../controllers/forgotController.ts";

const loginRouter = express.Router();

loginRouter.post("/", loginUser);
loginRouter.post("/send-otp", sendOTP);
loginRouter.post("/verify-otp", loginWithOTP);

export default loginRouter;
