import { Request, Response } from "express";
import userModel from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import sendMail from "../utils/sendMail.ts";
import otpModel from "../models/otpModel.ts";

// API để gửi mã OTP đến Google Email (Dùng chung cho Quên mật khẩu, Đăng ký, Đăng nhập OTP)
const sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, checkExist } = req.body;

        if (!email) {
            res.status(400).json({ success: false, message: "Email là bắt buộc" });
            return;
        }

        if (checkExist) {
            const exists = await userModel.findOne({ email });
            if (exists) {
                res.status(400).json({ success: false, message: "Email này đã tồn tại, vui lòng sử dụng email khác." });
                return;
            }
        }

        // Tạo mã OTP ngẫu nhiên gồm 6 chữ số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu OTP vào DB với thời gian hết hạn là 5 phút
        await otpModel.findOneAndUpdate(
            { email },
            { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
            { upsert: true, returnDocument: 'after' }
        );

        // Gửi Email chứa mã OTP
        try {
            await sendMail(
                email,
                "Mã xác thực từ QuickStay",
                `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`
            );
        } catch (mailError) {
            console.error("Nodemailer Detail Error:", mailError);
            throw new Error("Lỗi dịch vụ gửi mail (SMTP): " + (mailError as Error).message);
        }

        res.json({ success: true, message: "Mã OTP đã được gửi đến email của bạn" });

    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ success: false, message: "Không thể gửi OTP: " + (error as Error).message });
    }
};

// API chỉ để xác thực OTP (dùng cho tính năng Quên mật khẩu)
const verifyOTPOnly = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const otpData = await otpModel.findOne({ email, otp });

        if (!otpData) {
            res.status(400).json({ success: false, message: "Mã OTP không đúng hoặc đã hết hạn" });
            return;
        }

        res.json({ success: true, message: "Mã OTP hợp lệ" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// API để đặt lại mật khẩu sau khi đã xác thực OTP thành công
const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;

        // Xác thực lại OTP một lần nữa để bảo mật
        const otpData = await otpModel.findOne({ email, otp });
        if (!otpData) {
            res.status(400).json({ success: false, message: "Phiên làm việc hết hạn, vui lòng gửi lại OTP" });
            return;
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
            return;
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
        await otpModel.deleteOne({ _id: otpData._id });

        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export { sendOTP, verifyOTPOnly, resetPassword };
