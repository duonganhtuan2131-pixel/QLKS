import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserAdmin = () => {
    const backendUrl = "http://localhost:3000";
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal state for password update
    const [showPassModal, setShowPassModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordVisible, setShowPasswordVisible] = useState(false); // Trạng thái ẩn/hiện mật khẩu mới

    // Modal state for adding user
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer'
    });

    // Modal state for editing user info
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUserForm, setEditUserForm] = useState({
        userId: '',
        full_name: '',
        email: '',
        phone: ''
    });

    // Modal state for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const roles = [
        { value: 'customer', label: 'Khách hàng' },
        { value: 'staff', label: 'Nhân viên' },
        { value: 'admin', label: 'Quản trị viên' },
        { value: 'hotelOwner', label: 'Chủ khách sạn' }
    ];

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/all-users`);
            if (response.data.success) {
                setUsers(Array.isArray(response.data.users) ? response.data.users : []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = Array.isArray(users) ? [...users] : [];
        if (searchTerm) {
            result = result.filter(user =>
                user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        switch (sortBy) {
            case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            case 'oldest': result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
            case 'name-az': result.sort((a, b) => a.full_name.localeCompare(b.full_name)); break;
            case 'name-za': result.sort((a, b) => b.full_name.localeCompare(a.full_name)); break;
            default: break;
        }
        setFilteredUsers(result);
        setCurrentPage(1); // Reset to first page on search/sort
    }, [searchTerm, sortBy, users]);

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleChangeRole = async (userId, newRole) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/change-role`, { userId, role: newRole });
            if (response.data.success) {
                toast.success(response.data.message);
                const currentUser = JSON.parse(localStorage.getItem('userData'));
                if (currentUser && currentUser.id === userId) {
                    localStorage.setItem('userData', JSON.stringify({ ...currentUser, role: newRole }));
                    window.location.reload();
                }
                fetchUsers();
            }
        } catch (error) {
            toast.error("Lỗi cập nhật vai trò");
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) return toast.warn("Mật khẩu ít nhất 6 ký tự");
        try {
            const response = await axios.post(`${backendUrl}/api/user/admin-update-password`, { userId: selectedUser._id, newPassword });
            if (response.data.success) {
                toast.success("Đã đổi mật khẩu cho " + selectedUser.full_name);
                setShowPassModal(false);
                setNewPassword('');
                setSelectedUser(null);
                fetchUsers(); // Refresh the list to ensure synchronization
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi cập nhật mật khẩu");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/admin-create-user`, newUserForm);
            if (response.data.success) {
                toast.success(response.data.message);
                setShowAddModal(false);
                setNewUserForm({ full_name: '', email: '', phone: '', password: '', role: 'customer' });
                fetchUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi tạo người dùng");
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/admin-update-user`, editUserForm);
            if (response.data.success) {
                toast.success(response.data.message);
                setShowEditModal(false);

                const currentUser = JSON.parse(localStorage.getItem('userData'));
                if (currentUser && currentUser.id === editUserForm.userId) {
                    const updatedUser = { ...currentUser, full_name: editUserForm.full_name, email: editUserForm.email, phone: editUserForm.phone };
                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                    window.location.reload();
                }

                fetchUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi cập nhật thông tin");
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/delete-user`, { userId: userToDelete._id });
            if (response.data.success) {
                toast.success(response.data.message);
                setShowDeleteModal(false);

                // If deleted self (should ideally be blocked by backend but handling for safety)
                const currentUser = JSON.parse(localStorage.getItem('userData'));
                if (currentUser && currentUser.id === userToDelete._id) {
                    localStorage.clear();
                    window.location.href = '/login';
                }

                fetchUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi xóa người dùng");
        }
    };

    const openEditModal = (user) => {
        setEditUserForm({
            userId: user._id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone || ''
        });
        setShowEditModal(true);
    };

    return (
        <div className="p-8 bg-gray-50/30 min-h-screen font-sans">
            {/* Password Update Modal */}
            {showPassModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-[999] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-1">Đổi mật khẩu</h2>
                                <p className="text-sm text-gray-400 font-medium">Bảo mật tài khoản cho <span className="text-[#FDBB14]">{selectedUser.full_name}</span></p>
                            </div>
                            <button onClick={() => { setShowPassModal(false); setNewPassword(''); setShowPasswordVisible(false); }} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="space-y-6 mb-8">
                            {/* Current Password (Informational/Masked) */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu hiện tại</label>
                                <div className="relative group opacity-60">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input 
                                        type="password" 
                                        readOnly 
                                        className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-transparent rounded-2xl outline-none cursor-not-allowed font-black" 
                                        value="********" 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">Đã mã hóa an toàn</span>
                                </div>
                            </div>

                            {/* New Password Input */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu mới</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FDBB14] transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input 
                                        type={showPasswordVisible ? "text" : "password"}  
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all placeholder:text-gray-300 shadow-inner" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        placeholder="Nhập ít nhất 6 ký tự" 
                                        autoComplete="new-password"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPasswordVisible(!showPasswordVisible)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                                    >
                                        {showPasswordVisible ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.411m0 0L21 21m-2.102-2.102L12 12m4.839-4.839A9.99 9.99 0 0012 5c-4.478 0-8.268 2.943-9.542 7a10.025 10.025 0 004.132 5.411m0 0L4 4" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => { setShowPassModal(false); setNewPassword(''); setShowPasswordVisible(false); }} className="flex-1 px-4 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 font-bold text-gray-500 transition-all">Hủy bỏ</button>
                            <button onClick={handleUpdatePassword} className="flex-1 px-4 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 font-black shadow-xl shadow-gray-200 transition-all active:scale-95">Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-[999] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl border border-gray-100 overflow-y-auto max-h-[95vh] scale-100 animate-in zoom-in-95 duration-400">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                                    <div className="p-3 bg-[#FDBB14] rounded-2xl text-white shadow-lg shadow-[#FDBB14]/20">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                    </div>
                                    Thành viên mới
                                </h2>
                                <p className="mt-2 text-gray-400 font-medium ml-1">Đăng ký tài khoản mới vào hệ thống</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Họ và tên đầy đủ</label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FDBB14] transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </span>
                                    <input required type="text" className="w-full pl-14 pr-4 py-4.5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all placeholder:text-gray-300 shadow-inner" value={newUserForm.full_name} onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })} placeholder="VD: Nguyễn Văn A" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Địa chỉ Email</label>
                                <input required type="email" className="w-full px-6 py-4.5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all placeholder:text-gray-300 shadow-inner" value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} placeholder="example@gmail.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Số điện thoại</label>
                                <input required type="text" className="w-full px-6 py-4.5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all placeholder:text-gray-300 shadow-inner" value={newUserForm.phone} onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })} placeholder="034XXXXXXX" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Mật khẩu</label>
                                <input required type="password" className="w-full px-6 py-4.5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all placeholder:text-gray-300 shadow-inner" value={newUserForm.password} onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })} placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Vai trò</label>
                                <select className="w-full px-6 py-4.5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all appearance-none cursor-pointer font-bold text-gray-700 shadow-inner" value={newUserForm.role} onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}>
                                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2 flex gap-4 pt-10">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-8 py-4.5 border-2 border-gray-100 rounded-[1.25rem] hover:bg-gray-50 font-black text-gray-400 transition-all uppercase tracking-widest text-sm">Hủy</button>
                                <button type="submit" className="flex-[1.5] px-8 py-4.5 bg-gray-900 text-white rounded-[1.25rem] hover:bg-black font-black shadow-2xl transition-all active:scale-[0.98] uppercase tracking-widest text-sm">Tạo thẻ thành viên</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-[999] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-10 w-full max-w-xl shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Cập nhật hồ sơ</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Họ và tên</label>
                                <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all shadow-inner" value={editUserForm.full_name} onChange={(e) => setEditUserForm({ ...editUserForm, full_name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <input required type="email" className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all shadow-inner" value={editUserForm.email} onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Số điện thoại</label>
                                <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#FDBB14] rounded-2xl outline-none transition-all shadow-inner" value={editUserForm.phone} onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })} />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-6 py-4 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 font-bold transition-all">Quay lại</button>
                                <button type="submit" className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black font-black shadow-xl transition-all">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-[999] p-4 text-center animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Xác nhận xóa?</h2>
                        <p className="text-gray-400 font-medium mb-10 leading-relaxed">Dữ liệu của hội viên <span className="font-bold text-gray-900">{userToDelete.full_name}</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest text-xs">Hủy</button>
                            <button onClick={handleDeleteUser} className="flex-1 px-4 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all uppercase tracking-widest text-xs">Xóa ngay</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1600px] mx-auto">
                {/* Header Title & Actions */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-[900] text-gray-900 tracking-tight">Hồ sơ người dùng</h1>
                            <div className="px-3 py-1 bg-[#FDBB14]/10 rounded-full">
                                <span className="text-xs font-black text-[#FDBB14] uppercase tracking-widest">Admin</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                            <p className="text-sm font-medium text-gray-400">Hệ thống đang hoạt động ổn định và bảo mật</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="relative group flex-1 md:w-80">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FDBB14] transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <input type="text" placeholder="Tìm tên, email..." className="w-full pl-14 pr-6 py-4 bg-white border border-transparent focus:border-[#FDBB14] rounded-2xl shadow-sm outline-none text-sm transition-all placeholder:text-gray-300 font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="relative group">
                            <select className="appearance-none pl-6 pr-12 py-4 bg-white border border-transparent rounded-2xl shadow-sm outline-none text-sm font-bold text-gray-600 cursor-pointer focus:border-[#FDBB14] transition-all" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">Mới nhất ▲</option>
                                <option value="oldest">Cũ nhất ▼</option>
                                <option value="name-az">Tên A → Z</option>
                                <option value="name-za">Tên Z → A</option>
                            </select>
                            <svg className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                        </div>

                        <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-[#FDBB14] text-gray-900 rounded-2xl font-black shadow-xl shadow-[#FDBB14]/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            <span className="uppercase tracking-wider text-xs">Thành viên mới</span>
                        </button>
                    </div>
                </header>

                {/* Main Table Container */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50/50 overflow-hidden mb-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
                                    <th className="px-10 py-7">Danh tính & Liên hệ</th>
                                    <th className="px-8 py-7">Phân quyền</th>
                                    <th className="px-8 py-7 text-center">Nội bộ</th>
                                    <th className="px-10 py-7 text-right">Tùy chọn</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50/50">
                                {!loading && currentItems.map((user) => (
                                    <tr key={user._id} className="group hover:bg-gray-50/30 transition-all duration-300">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FDBB14] to-yellow-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#FDBB14]/20 capitalize group-hover:rotate-6 transition-transform duration-500">
                                                        {user.full_name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg leading-tight transition-colors group-hover:text-[#FDBB14]">{user.full_name}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                            {user.email}
                                                        </span>
                                                        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                            {user.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl border uppercase tracking-wider ${user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    user.role === 'staff' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                        user.role === 'hotelOwner' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {roles.find(r => r.value === user.role)?.label}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <select value={user.role} onChange={(e) => handleChangeRole(user._id, e.target.value)} className="text-xs font-bold bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2 outline-none hover:bg-white hover:border-[#FDBB14] transition-all cursor-pointer">
                                                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <button onClick={() => openEditModal(user)} className="p-3 bg-blue-50 text-blue-500 rounded-2xl hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all duration-300" title="Chỉnh sửa">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => { setSelectedUser(user); setShowPassModal(true); setNewPassword(''); setShowPasswordVisible(false); }} className="p-3 bg-amber-50 text-amber-500 rounded-2xl hover:bg-amber-500 hover:text-white hover:shadow-lg transition-all duration-300" title="Đổi mật khẩu">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 11-7.743-5.743L11 5l-1 1-1 1h2a2 2 0 012 2v1a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h3l1-1 1-1" /></svg>
                                                </button>
                                                <button onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white hover:shadow-lg transition-all duration-300" title="Xóa">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Phân trang  */}
                {!loading && filteredUsers.length > itemsPerPage && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50/50">
                        <p className="text-sm font-bold text-gray-400">
                            Hiển thị <span className="text-gray-900">{indexOfFirstItem + 1}</span> - <span className="text-gray-900">{Math.min(indexOfLastItem, filteredUsers.length)}</span> trên <span className="text-gray-900">{filteredUsers.length}</span> hội viên
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`p-3 rounded-xl border transition-all ${currentPage === 1 ? 'border-gray-50 text-gray-200 cursor-not-allowed' : 'border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-[#FDBB14]'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`w-11 h-11 rounded-xl font-black text-sm transition-all ${currentPage === i + 1
                                                ? 'bg-[#FDBB14] text-gray-900 shadow-lg shadow-[#FDBB14]/20 scale-110'
                                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`p-3 rounded-xl border transition-all ${currentPage === totalPages ? 'border-gray-50 text-gray-200 cursor-not-allowed' : 'border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-[#FDBB14]'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                )}
                {filteredUsers.length === 0 && !loading && <div className="py-24 text-center text-gray-300 font-bold italic"><p>Không tìm thấy cộng tác viên phù hợp.</p></div>}
            </div>
        </div>
    );
};

export default UserAdmin;
