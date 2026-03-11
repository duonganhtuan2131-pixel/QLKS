import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const backendUrl = "http://localhost:3000"; // Dynamic URL would be better
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/login`, formData);

            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.userData));
                navigate('/');
                window.location.reload();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập");
        }
    };

    return (
        <div 
            className="bg-black font-sans antialiased min-h-screen flex items-center justify-center bg-image-overlay"
            style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${assets.regImage})` 
            }}
        >
            <main className="w-full max-w-md px-4 py-12">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <svg className="h-10 w-10 text-white mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"></path>
                        </svg>
                        <span className="text-3xl font-bold text-white tracking-tight">QuickStay</span>
                    </div>
                </header>

                <div className="glass-card rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-semibold text-white mb-2">Đăng nhập</h1>
                        <p className="text-gray-300 text-sm">Chào mừng bạn trở lại</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="email">Email</label>
                            <input 
                                className="glass-input w-full px-4 py-3 rounded-lg text-sm" 
                                id="email" 
                                name="email" 
                                placeholder="example@gmail.com" 
                                required 
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-sm font-medium text-gray-200" htmlFor="password">Mật khẩu</label>
                                <a href="#" className="text-xs text-gray-400 hover:text-white">Quên mật khẩu?</a>
                            </div>
                            <input 
                                className="glass-input w-full px-4 py-3 rounded-lg text-sm" 
                                id="password" 
                                name="password" 
                                placeholder="••••••••" 
                                required 
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="pt-2">
                            <button className="w-full bg-white text-black font-bold py-3.5 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 shadow-lg text-base" type="submit">
                                Đăng nhập
                            </button>
                        </div>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-transparent text-gray-400">Hoặc</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center px-4 py-2.5 glass-card rounded-lg hover:bg-white/10 transition">
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.14-1.94 4.18-1.22 1.22-3.12 2.54-6.38 2.54-5.12 0-9.28-4.14-9.28-9.28s4.16-9.28 9.28-9.28c2.8 0 4.94 1.1 6.46 2.54l2.36-2.36C18.6 1.16 15.82 0 12.48 0 5.86 0 .5 5.36.5 12s5.36 12 11.98 12c3.54 0 6.22-1.16 8.32-3.32 2.16-2.16 2.84-5.22 2.84-7.66 0-.52-.04-1.02-.12-1.52H12.48z" fill="#EA4335"></path>
                            </svg>
                            <span className="text-white text-sm font-medium">Google</span>
                        </button>
                        <button className="flex items-center justify-center px-4 py-2.5 glass-card rounded-lg hover:bg-white/10 transition">
                            <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                            </svg>
                            <span className="text-white text-sm font-medium">Facebook</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-gray-400">
                            Bạn chưa có tài khoản? 
                            <Link className="text-white font-semibold hover:underline" to="/register"> Đăng ký ngay</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
