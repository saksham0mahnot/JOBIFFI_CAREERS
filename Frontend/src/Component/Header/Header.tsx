import React from 'react';
import logo from '../../assets/logo.png';

const Header: React.FC = () => {
    return (
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
                    <a href="#login" className="text-blue-700 font-semibold text-[15px] border border-blue-700 px-5 py-2 rounded-full hover:bg-blue-800 hover:text-white">
                        Login
                    </a>
                    <a href="#register" className="bg-blue-700 text-white hover:text-white px-5 py-2 rounded-full font-semibold text-[15px] transition-colors hover:bg-blue-800">
                        Register
                    </a>

                    <div className="hidden md:block w-[1px] h-[24px] bg-gray-200 mx-1"></div>

                    <a href="#employer-login" className="hidden md:flex text-gray-600 font-semibold text-[15px] hover:text-blue-600 transition-colors whitespace-nowrap">
                        Employer Login
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
