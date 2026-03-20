import { Request, Response } from "express";
import userModel from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import imagekit from "../config/imagekit.ts";



// API để lấy tất cả người dùng (Cho Admin)
const allUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await userModel.find({}).select("-password");
        res.json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// Phân quyền
// API để cập nhật quyền (vai trò) của người dùng
const changeRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, role } = req.body;
        await userModel.findByIdAndUpdate(userId, { role });
        res.json({ success: true, message: "Cập nhật vai trò thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// API dành cho Admin để cập nhật mật khẩu của bất kỳ người dùng nào
const adminUpdatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            res.status(400).json({ success: false, message: "Mật khẩu phải ít nhất 6 ký tự" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ success: true, message: "Cập nhật mật khẩu thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// API dành cho Admin để tạo người dùng mới trực tiếp
const adminCreateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, phone, password, role, balance } = req.body;


        if (!full_name || !email || !password) {
            res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc: tên, email và mật khẩu." });
            return;
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            res.status(400).json({ success: false, message: "Email đã được sử dụng" });
            return;
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let avatarUrl = "";
        if (req.file) {
            try {
                const uploadResponse = await imagekit.upload({
                    file: req.file.buffer.toString("base64"),
                    fileName: `admin_created_${email}_${Date.now()}`,
                    folder: "/users",
                });
                avatarUrl = uploadResponse.url;
            } catch (imageError) {
                console.error("Avatar Upload Error:", imageError);
                res.status(400).json({ success: false, message: "Lỗi tải ảnh đại diện: " + (imageError as Error).message });
                return;
            }
        }


        const newUser = new userModel({
            full_name,
            email,
            phone,
            password: hashedPassword,
            role: role || 'customer',
            avatar: avatarUrl,
            balance: balance ? Number(balance) : 0,
            totalRecharged: req.body.totalRecharged ? Number(req.body.totalRecharged) : 0
        });



        await newUser.save();
        res.status(201).json({ success: true, message: "Tạo tài khoản thành công" });
    } catch (error) {
        console.error("Admin Create User Error:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống: " + (error as Error).message });
    }
};


// API dành cho Admin để cập nhật thông tin người dùng
const adminUpdateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, id, full_name, email, phone, role, balance } = req.body;

        const targetId = userId || id;

        if (!targetId) {
            res.status(400).json({ success: false, message: "Thiếu ID người dùng" });
            return;
        }

        const user = await userModel.findById(targetId);
        if (!user) {
            res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
            return;
        }



        // Kiểm tra xem email đã được sử dụng bởi người dùng khác chưa
        const existingUser = await userModel.findOne({ email, _id: { $ne: targetId } });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Email đã được sử dụng bởi người dùng khác" });
            return;
        }

        const updateData: Record<string, any> = { full_name, email, phone };
        if (role) updateData.role = role;
        if (balance !== undefined) updateData.balance = Number(balance);
        if (req.body.totalRecharged !== undefined) updateData.totalRecharged = Number(req.body.totalRecharged);



        if (req.file) {
            try {
                const uploadResponse = await imagekit.upload({
                    file: req.file.buffer.toString("base64"),
                    fileName: `admin_updated_${targetId}_${Date.now()}`,
                    folder: "/users",
                });
                updateData.avatar = uploadResponse.url;
            } catch (imageError) {
                console.error("Avatar Update Error:", imageError);
                res.status(400).json({ success: false, message: "Lỗi cập nhật ảnh đại diện: " + (imageError as Error).message });
                return;
            }
        }


        await userModel.findByIdAndUpdate(targetId, updateData);

        res.json({ success: true, message: "Cập nhật thông tin thành công" });
    } catch (error) {
        console.error("Admin Update User Error:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống: " + (error as Error).message });
    }
};


// API dành cho Admin để xóa người dùng
const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        
        // Tìm người dùng để kiểm tra sự tồn tại
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
            return;
        }

        await userModel.findByIdAndDelete(userId);
        res.json({ success: true, message: "Xóa người dùng thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// API để lấy thông tin một người dùng cụ thể
const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
            return;
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};


export { allUsers, changeRole, adminUpdatePassword, adminCreateUser, adminUpdateUser, deleteUser, getUser };
