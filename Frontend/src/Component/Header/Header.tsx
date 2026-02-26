import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import AuthModal from '../Auth/AuthModal';

const Header: React.FC = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register' | 'employer'>('login');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const openAuthModal = (mode: 'login' | 'register' | 'employer') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
        setIsMobileMenuOpen(false); // Make sure to close mobile menu if it's open
    };

    return (
        <>
            <header className="w-full bg-white shadow-sm font-sans border-b border-gray-200 px-4 sm:px-8 py-3 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between relative w-full">
                    {/* LEFT – Logo */}
                    <div className="flex ml-20 items-center translate-x-[30%]">
                        <a href="/">
                            <img src={logo} alt="Jobiffi Logo" className="h-12 w-auto" />
                        </a>
                    </div>


                    {/* Right Section: Desktop Nav, Auth & Employer Login */}
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="https://jobiffi.com/about-us" target="_blank" rel="noopener noreferrer" className="text-gray-600 font-medium text-[15px] hover:text-blue-600 transition-colors">About Us</a>
                            <a href="#jobs" className="text-gray-600 font-medium text-[15px] hover:text-blue-600 transition-colors">Jobs</a>
                            <a href="#jobiffi-blogs" className="text-gray-600 font-medium text-[15px] hover:text-blue-600 transition-colors">Jobiffi Blogs</a>
                        </nav>

                        <div className="hidden md:block w-[1px] h-[24px] bg-gray-200 mx-1"></div>

                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={() => openAuthModal('login')}
                                className="bg-white m-0 !text-blue-700 font-semibold text-[15px] border border-blue-700 px-5 py-2 !rounded-full hover:!bg-blue-800 hover:!border-blue-800 hover:!text-white transition-colors focus:outline-none focus:ring-0 outline-none shadow-none">
                                Login
                            </button>
                            <button
                                onClick={() => openAuthModal('register')}
                                className="bg-blue-700 m-0 border border-blue-700 text-white hover:text-white px-5 py-2 !rounded-full font-semibold text-[15px] transition-colors hover:!bg-blue-800 hover:!border-blue-800 focus:outline-none focus:ring-0 outline-none shadow-none">
                                Register
                            </button>

                            <div className="hidden md:block w-[1px] h-[24px] bg-gray-200 mx-1"></div>

                            <button
                                onClick={() => openAuthModal('employer')}
                                className="hidden md:flex text-gray-600 bg-transparent p-0 border-none m-0 shadow-none font-semibold text-[15px] hover:text-blue-600 transition-colors whitespace-nowrap outline-none focus:outline-none focus:ring-0">
                                Employer Login
                            </button>
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            className="md:hidden flex items-center justify-center text-[#0122c5] p-1 focus:outline-none focus:ring-0 bg-transparent border-none outline-none hover:bg-blue-50 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 top-[63px] bg-white z-40 transition-all duration-300 transform md:hidden ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col h-full overflow-y-auto pb-8">
                    <nav className="flex flex-col border-b border-gray-100 pt-2 pb-4">
                        <a href="https://jobiffi.com/about-us" onClick={() => setIsMobileMenuOpen(false)} target="_blank" rel="noopener noreferrer" className="text-gray-800 font-semibold text-[16px] py-4 px-6 hover:bg-gray-50 hover:text-[#0122c5] transition-colors">About Us</a>
                        <a href="#contact-us" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-semibold text-[16px] py-4 px-6 hover:bg-gray-50 hover:text-[#0122c5] transition-colors">Contact Us</a>
                        <a href="#jobs" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-semibold text-[16px] py-4 px-6 hover:bg-gray-50 hover:text-[#0122c5] transition-colors">Jobs</a>
                    </nav>

                    <div className="flex flex-col gap-4 p-6 mt-2">
                        <button
                            onClick={() => openAuthModal('login')}
                            className="w-full flex items-center justify-center bg-white text-blue-700 font-bold text-[16px] border border-blue-700 py-3.5 rounded-full hover:bg-blue-50 transition-colors focus:outline-none shadow-sm">
                            Login
                        </button>
                        <button
                            onClick={() => openAuthModal('register')}
                            className="w-full flex items-center justify-center bg-blue-700 text-white font-bold text-[16px] py-3.5 rounded-full hover:bg-blue-800 transition-colors focus:outline-none shadow-sm">
                            Register
                        </button>
                        <button
                            onClick={() => openAuthModal('employer')}
                            className="w-full flex items-center justify-center mt-3 text-gray-600 font-semibold text-[16px] hover:text-blue-700 transition-colors focus:outline-none bg-transparent border-none">
                            Employer Login
                        </button>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
};

export default Header;
