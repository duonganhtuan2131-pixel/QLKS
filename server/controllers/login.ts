import { Request, Response } from "express";
import userModel from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpModel from "../models/otpModel.ts";

// Hàm để tạo JWT (JSON Web Token)
const createToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

// API để đăng nhập người dùng
const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, message: "User doesn't exist" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password || '');

        if (isMatch) {
            const token = createToken(String(user._id));
            res.json({
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
                },

                message: "Login successful"
            });
        } else {
            res.status(401).json({ success: false, message: "Sai thông tin: Tên đăng nhập hoặc mật khẩu sai" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};


// API để đăng nhập bằng mã OTP (Email)
const loginWithOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ success: false, message: "Email và OTP là bắt buộc" });
            return;
        }

        const otpData = await otpModel.findOne({ email, otp });

        if (!otpData) {
            res.status(400).json({ success: false, message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
            return;
        }

        // OTP hợp lệ, sau đó xóa mã này khỏi DB
        await otpModel.deleteOne({ _id: otpData._id });

        // Tìm hoặc tạo người dùng mới dựa trên email
        let user = await userModel.findOne({ email });

        if (!user) {
            // Đăng ký người dùng mới thông qua Xác thực Email (Google)
            user = new userModel({
                full_name: email.split('@')[0], // Tên mặc định lấy từ email
                email,
                avatar: "", 
            });
            await user.save();
        }

        const token = createToken(String(user._id));

        res.json({
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
            },

            message: "Đăng nhập thành công"
        });

    } catch (error) {
        console.error("Login OTP Error:", error);
        res.status(500).json({ success: false, message: "Đăng nhập thất bại: " + (error as Error).message });
    }
};


export { loginUser, loginWithOTP, createToken };
