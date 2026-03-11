import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
// import { useClerk, useUser, UserButton } from '@clerk/react';

const BookIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0 0 2h12m0 0H7a2 2 0 0 1 0-4v4" />
    </svg>
)

const Navbar = () => {
    const navLinks = [
        { name: 'Trang chủ', path: '/' },
        { name: 'Phòng', path: '/rooms' },
        { name: 'Liên hệ', path: '/' },
        { name: 'Giới thiệu', path: '/' },
    ];


    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [token, setToken] = React.useState(localStorage.getItem('token')); 
    const [userData, setUserData] = React.useState(localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null);

    const navigate = useNavigate()
    const location = useLocation()

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setToken(null);
        navigate('/login');
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <Link to='/'>
                <img src={assets.logo} alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <NavLink key={i} to={link.path} className={({ isActive }) => `group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"} ${isActive ? "font-semibold" : ""}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </NavLink>
                ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <img src={assets.searchIcon} alt="search" className={`${isScrolled && "invert"} h-7 transition-all duration-500`} />

                {token ?
                    (<div className='relative group ml-4 flex flex-col items-center'>
                        <img 
                            src={assets.userIcon} 
                            alt="profile" 
                            className="h-10 w-10 rounded-full cursor-pointer border border-gray-300 transition-all" 
                        />
                        {userData && (
                            <span className={`text-[10px] mt-1 font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                                {userData.full_name.split(' ').pop()}
                            </span>
                        )}
                        {/* Dropdown Menu */}
                        <div className='absolute right-0 top-full pt-3 hidden group-hover:block z-50'>
                            <div className='bg-white shadow-xl rounded-lg border border-gray-100 py-2 min-w-[150px]'>
                                <button 
                                    onClick={() => navigate('/profile')}
                                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                    Thông tin cá nhân
                                </button>
                                {userData && userData.role === 'hotelOwner' && (
                                    <button 
                                        onClick={() => navigate('/owner')}
                                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-l-4 border-[#EAB308]'
                                    >
                                        Quản lý khách sạn
                                    </button>
                                )}
                                {userData && userData.role === 'admin' && (
                                    <button 
                                        onClick={() => navigate('/owner')}
                                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-l-4 border-blue-500'
                                    >
                                        Quản lý hệ thống
                                    </button>
                                )}
                                <button 
                                    onClick={() => navigate('/my-bookings')}
                                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                    My Bookings
                                </button>
                                <hr className='my-1 border-gray-100' />
                                <button 
                                    onClick={logout}
                                    className='w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors'
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>)
                    :
                    (<button onClick={() => navigate('/login')} className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
                        Login
                    </button>)
                }

                {/* Clerk User Button (Commented)
                {user ?
                    (<UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label='My Bookings' labelIcon={<BookIcon />}
                                onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>)
                    :
                    (<button onClick={openSignIn} className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
                        Login
                    </button>)
                } 
                */}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {token &&
                    <div className='flex flex-col items-center gap-1'>
                        <img 
                            onClick={logout} 
                            src={assets.userIcon} 
                            alt="profile" 
                            className="h-8 w-8 rounded-full border border-gray-300"
                        />
                        {userData && (
                            <span className="text-[9px] font-medium text-gray-700">
                                {userData.full_name.split(' ').pop()}
                            </span>
                        )}
                    </div>
                }
                {/* Clerk Mobile Button (Commented)
                {user &&
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label='My Bookings' labelIcon={<BookIcon />}
                                onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                }
                */}
                <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="menu" className={`${isScrolled && "invert"} h-4`} />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close-menu" className="h-6" />
                </button>

                {navLinks.map((link, i) => (
                    <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </Link>
                ))}

                {token && (userData?.role === 'hotelOwner' || userData?.role === 'admin') && 
                    <button className="border px-4 py-1 text-sm font-light 
                    rounded-full cursor-pointer transition-all" onClick={() => navigate('/owner')}>
                        {userData.role === 'admin' ? 'Quản lý hệ thống' : 'Dashboard'}
                    </button>
                }

                {!token && <button onClick={() => navigate('/login')} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                    Login
                </button>}

                {/* Clerk Mobile Login (Commented)
                {!user && <button onClick={openSignIn} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                    Login
                </button>}
                */}
            </div>
        </nav>
    );
}

export default Navbar
