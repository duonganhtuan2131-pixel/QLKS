import express from "express";
import { registerUser } from "../controllers/Register.ts";

const registerRouter = express.Router();

registerRouter.post("/", registerUser);

export default registerRouter;
