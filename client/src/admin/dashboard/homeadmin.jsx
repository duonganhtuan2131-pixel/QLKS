import React from 'react';

const HomeAdmin = () => {
    return (
        <div className="p-8 bg-gray-50/30 min-h-screen font-sans">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-12 space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-[900] text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
                        <div className="px-3 py-1 bg-[#FDBB14]/10 rounded-full">
                            <span className="text-xs font-black text-[#FDBB14] uppercase tracking-widest">Dashboard</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-400 ml-1">Chào mừng quay trở lại. Đây là tình hình kinh doanh của bạn hôm nay.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Stat Cards */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+15.2%</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng doanh thu</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">12.5M<span className="text-sm font-bold text-gray-400 ml-1">VNĐ</span></h3>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <span className="text-xs font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">48 lượt</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Lượt đặt phòng</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">48<span className="text-sm font-bold text-gray-400 ml-2">Check-in</span></h3>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">15/50</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phòng trống</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">30<span className="text-sm font-bold text-gray-400 ml-2">% hiệu suất</span></h3>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 rounded-2xl text-purple-500 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                            </div>
                            <span className="text-xs font-black text-purple-500 bg-purple-50 px-2 py-1 rounded-lg">4.8/5.0</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Đánh giá mới</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">128<span className="text-sm font-bold text-gray-400 ml-2">Phản hồi</span></h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50/50">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Xu hướng doanh thu</h2>
                            <button className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-500 transition-all">Tải báo cáo ↓</button>
                        </div>
                        <div className="h-[400px] bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <svg className="w-12 h-12 text-[#FDBB14] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-900 font-black text-lg">Biểu đồ đang tải...</p>
                                <p className="text-gray-400 font-medium text-sm">Hệ thống đang đồng bộ dữ liệu thực tế</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50/50 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Hoạt động mới</h2>
                            <div className="space-y-6">
                                {[
                                    { id: 1, title: 'Đặt phòng mới', desc: 'QS-2901 • 12 phút trước', user: 'Nguyễn Văn A', color: 'bg-emerald-500' },
                                    { id: 2, title: 'Thanh toán thành công', desc: 'VN-Pay • 25 phút trước', user: 'Trần Thị B', color: 'bg-indigo-500' },
                                    { id: 3, title: 'Hủy đặt phòng', desc: 'Lý do: Đổi lịch • 1 giờ trước', user: 'Lê Văn C', color: 'bg-rose-500' },
                                    { id: 4, title: 'Đánh giá 5 sao', desc: 'Tuyệt vời! • 3 giờ trước', user: 'Phạm Thị D', color: 'bg-amber-500' },
                                ].map((activity) => (
                                    <div key={activity.id} className="flex gap-4 group cursor-pointer">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-gray-400 group-hover:bg-[#FDBB14] group-hover:text-white transition-all">
                                                {activity.user.charAt(0)}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${activity.color} rounded-full border-2 border-white`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-gray-900 group-hover:text-[#FDBB14] transition-colors">{activity.title}</p>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{activity.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98]">Xem tất cả</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default HomeAdmin;
