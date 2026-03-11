import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

// API to update user profile (phone and password)
const updateProfile = async (req, res) => {
    try {
        const { userId, phone, oldPassword, newPassword } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update phone if provided
        if (phone) {
            user.phone = phone;
        }

        // Update password if both old and new passwords are provided
        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Mật khẩu cũ không chính xác" });
            }
            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.json({ 
            success: true, 
            message: "Cập nhật thành công",
            userData: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { updateProfile };
