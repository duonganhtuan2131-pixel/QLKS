import { Request, Response } from "express";
import userModel from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import { createToken } from "./login.ts";

// API để đăng ký người dùng mới
const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, phone, password } = req.body;

        // Kiểm tra xem người dùng đã tồn tại chưa
        const exists = await userModel.findOne({ email });
        if (exists) {
            res.status(400).json({ success: false, message: "User already exists with this email" });
            return;
        }

        // Mã hóa mật khẩu người dùng
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = new userModel({
            full_name,
            email,
            phone,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(String(user._id));

        res.status(201).json({
            success: true,
            token,
            userData: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                balance: user.balance,
                totalRecharged: user.totalRecharged
            }
,
            message: "Registration successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export { registerUser };
