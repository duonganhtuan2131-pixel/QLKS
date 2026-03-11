import express from "express";
import { registerUser, loginUser, allUsers, changeRole, adminUpdatePassword, adminCreateUser, adminUpdateUser, deleteUser } from "../controllers/userController.js";
import { updateProfile } from "../controllers/updateUserController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/update-profile", updateProfile);
userRouter.get("/all-users", allUsers);
userRouter.post("/change-role", changeRole);
userRouter.post("/admin-update-password", adminUpdatePassword);
userRouter.post("/admin-create-user", adminCreateUser);
userRouter.post("/admin-update-user", adminUpdateUser);
userRouter.post("/delete-user", deleteUser);

export default userRouter;
