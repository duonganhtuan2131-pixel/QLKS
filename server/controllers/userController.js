import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to generate JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// API to register user
const registerUser = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        // Checking if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating new user
        const newUser = new userModel({
            full_name,
            email,
            phone,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            token,
            userData: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            message: "Registration successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({
                success: true,
                token,
                userData: {
                    id: user._id,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                message: "Login successful"
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get all users (Admin only ideally, but keeping it simple)
const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password");
        res.json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Phân quyền
// API to update user role
const changeRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        await userModel.findByIdAndUpdate(userId, { role });
        res.json({ success: true, message: "Cập nhật vai trò thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API for Admin to update any user's password
const adminUpdatePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Mật khẩu phải ít nhất 6 ký tự" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ success: true, message: "Cập nhật mật khẩu thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API for Admin to create a new user
const adminCreateUser = async (req, res) => {
    try {
        const { full_name, email, phone, password, role } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            full_name,
            email,
            phone,
            password: hashedPassword,
            role: role || 'customer'
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Tạo tài khoản thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API for Admin to update user info
const adminUpdateUser = async (req, res) => {
    try {
        const { userId, full_name, email, phone } = req.body;

        // Check if email is already taken by another user
        const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email đã được sử dụng bởi người dùng khác" });
        }

        await userModel.findByIdAndUpdate(userId, { full_name, email, phone });
        res.json({ success: true, message: "Cập nhật thông tin thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API for Admin to delete a user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Find user to check exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }

        await userModel.findByIdAndDelete(userId);
        res.json({ success: true, message: "Xóa người dùng thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, allUsers, changeRole, adminUpdatePassword, adminCreateUser, adminUpdateUser, deleteUser };
