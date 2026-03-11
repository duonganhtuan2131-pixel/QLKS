import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const SidebarAdmin = () => {
    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
            {/* Brand Logo Section */}
            <div className="p-8 flex items-center space-x-3">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="bg-gray-900 p-2 rounded-xl group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-gray-200">
                        <span className="text-white font-black text-sm tracking-tighter">QS</span>
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight group-hover:text-[#FDBB14] transition-colors">QuickStay</span>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 mt-2 space-y-1.5 overflow-y-auto">
                <div className="pb-3">
                    <span className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tổng quan</span>
                </div>
                
                <NavLink 
                    to="/owner" 
                    end
                    className={({ isActive }) => 
                        `flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                            isActive 
                            ? 'bg-[#FDBB14] text-gray-900 font-bold shadow-lg shadow-[#FDBB14]/20 scale-[1.02]' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span className="text-sm">Dashboard</span>
                </NavLink>

                <NavLink 
                    to="/owner/user" 
                    className={({ isActive }) => 
                        `flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                            isActive 
                            ? 'bg-[#FDBB14] text-gray-900 font-bold shadow-lg shadow-[#FDBB14]/20 scale-[1.02]' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <span className="text-sm">Quản lý người dùng</span>
                </NavLink>

                <div className="pt-8 pb-3">
                    <span className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Khách sạn</span>
                </div>

                <NavLink 
                    to="/owner/rooms" 
                    className={({ isActive }) => 
                        `flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                            isActive 
                            ? 'bg-[#FDBB14] text-gray-900 font-bold shadow-lg shadow-[#FDBB14]/20 scale-[1.02]' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className="text-sm">Quản lý phòng</span>
                </NavLink>
            </nav>

            {/* User Profile / Logout Section */}
            <div className="p-4 mt-auto border-t border-gray-50">
                <Link 
                    to="/" 
                    className="flex items-center px-4 py-3.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group"
                >
                    <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span className="text-sm font-semibold">Về Trang chủ</span>
                </Link>
            </div>
        </aside>
    );
};

export default SidebarAdmin;

