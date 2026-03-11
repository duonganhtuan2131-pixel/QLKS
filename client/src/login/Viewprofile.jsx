import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewProfile = () => {
    const backendUrl = "http://localhost:3000";
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form states
    const [phone, setPhone] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
            setPhone(parsedUser.phone || '');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (newPassword && newPassword !== confirmNewPassword) {
            toast.error("Mật khẩu mới không khớp!");
            return;
        }

        try {
            const payload = {
                userId: userData.id,
                phone: phone,
                oldPassword: oldPassword,
                newPassword: newPassword
            };

            const response = await axios.post(`${backendUrl}/api/user/update-profile`, payload);
            
            if (response.data.success) {
                toast.success(response.data.message);
                const updatedUser = { ...userData, ...response.data.userData };
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                setUserData(updatedUser);
                setIsEditing(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi cập nhật hồ sơ");
        }
    };

    if (!userData) return null;

    return (
        <div 
            className="bg-black font-sans antialiased min-h-screen flex items-center justify-center bg-image-overlay py-10"
            style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${assets.regImage})` 
            }}
        >
            <main className="w-full max-w-lg px-4">
                <div className="glass-card rounded-2xl p-8 md:p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <img 
                                src={assets.userIcon} 
                                alt="profile" 
                                className="h-24 w-24 rounded-full border-4 border-white/20 mx-auto mb-4"
                            />
                            <div className="absolute bottom-4 right-0 bg-green-500 h-6 w-6 rounded-full border-4 border-black"></div>
                        </div>
                        <h1 className="text-3xl font-semibold text-white mb-1">{userData.full_name}</h1>
                        <p className="text-gray-400 text-sm uppercase tracking-widest">{userData.role === 'hotelOwner' ? 'Chủ khách sạn' : 'Khách hàng'}</p>
                    </div>

                    {!isEditing ? (
                        /* VIEW MODE */
                        <div className="space-y-6">
                            <div className="border-b border-white/10 pb-4">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Họ và tên</label>
                                <p className="text-white text-lg mt-1">{userData.full_name}</p>
                            </div>

                            <div className="border-b border-white/10 pb-4">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Địa chỉ Email</label>
                                <p className="text-white text-lg mt-1">{userData.email}</p>
                            </div>

                            <div className="border-b border-white/10 pb-4">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Số điện thoại</label>
                                <p className="text-white text-lg mt-1">{userData.phone || 'Chưa cập nhật'}</p>
                            </div>
                            
                            <div className="pt-4 flex gap-4">
                                <button 
                                    onClick={() => navigate('/')}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                                >
                                    Quay lại trang chủ
                                </button>
                                <button 
                                    className="flex-1 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 shadow-lg"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Chỉnh sửa hồ sơ
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* EDIT MODE */
                        <form onSubmit={handleUpdate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Số điện thoại</label>
                                <input 
                                    type="tel"
                                    className="glass-input w-full px-4 py-3 rounded-lg text-sm"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại mới"
                                />
                            </div>

                            <div className="pt-2 border-t border-white/10">
                                <p className="text-sm text-gray-400 mb-4 italic">Thay đổi mật khẩu (Để trống nếu không muốn đổi)</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Mật khẩu hiện tại</label>
                                        <input 
                                            type="password"
                                            className="glass-input w-full px-4 py-3 rounded-lg text-xs"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Nhập mật khẩu cũ nếu muốn đổi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Mật khẩu mới</label>
                                        <input 
                                            type="password"
                                            className="glass-input w-full px-4 py-3 rounded-lg text-xs"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Xác nhận mật khẩu mới</label>
                                        <input 
                                            type="password"
                                            className="glass-input w-full px-4 py-3 rounded-lg text-xs"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            placeholder="Gõ lại mật khẩu mới"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-2 bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition shadow-lg"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ViewProfile;
