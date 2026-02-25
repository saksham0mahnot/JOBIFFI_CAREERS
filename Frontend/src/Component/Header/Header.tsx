import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import AuthModal from '../Auth/AuthModal';

const Header: React.FC = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    const openAuthModal = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    return (
        <>
            <header className="w-full bg-white py-3 px-6 flex justify-between items-center shadow-sm font-sans border-b border-gray-200 sticky top-0 z-50">
                {/* Left Section: Logo */}
                <div className="flex items-center">
                    <a href="/" className="inline-flex items-center gap-2">
                        <img src={logo} alt="Jobiffi Logo" className="h-[38px] object-contain" />
                        <span className="text-[#0122c5] font-bold text-[20px]">Careers</span>
                    </a>
                </div>

                {/* Right Section: Nav, Auth & Employer Login */}
                <div className="flex items-center gap-8">
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="https://jobiffi.com/about-us" target="_blank" rel="noopener noreferrer" className="text-gray-600 font-medium text-[15px] hover:text-blue-600 transition-colors">About Us</a>
                        <a href="#contact-us" className="text-gray-600 font-medium text-[15px] hover:text-blue-600 transition-colors">Contact Us</a>
                        <a href="#jobs" className="text-gray-600 font-medium text-[15px] hover:text-blue-600 transition-colors">Jobs</a>
                    </nav>

                    <div className="hidden md:block w-[1px] h-[24px] bg-gray-200 mx-1"></div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => openAuthModal('login')}
                            className="text-white md:bg-white bg-white m-0 !text-blue-700 font-semibold text-[15px] border border-blue-700 px-5 py-2 !rounded-full hover:!bg-blue-800 hover:!border-blue-800 hover:!text-white transition-colors focus:outline-none focus:ring-0 outline-none shadow-none">
                            Login
                        </button>
                        <button
                            onClick={() => openAuthModal('register')}
                            className="bg-blue-700 m-0 border border-blue-700 text-white hover:text-white px-5 py-2 !rounded-full font-semibold text-[15px] transition-colors hover:!bg-blue-800 hover:!border-blue-800 focus:outline-none focus:ring-0 outline-none shadow-none">
                            Register
                        </button>

                        <div className="hidden md:block w-[1px] h-[24px] bg-gray-200 mx-1"></div>

                        <a href="#employer-login" className="hidden md:flex text-gray-600 font-semibold text-[15px] hover:text-blue-600 transition-colors whitespace-nowrap">
                            Employer Login
                        </a>
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
};

export default Header;
