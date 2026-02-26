import React from 'react';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-[#f3f2ef] pt-6 pb-6 px-4 flex justify-center items-center font-sans mt-auto border-t border-gray-200">
            <div className="flex flex-col items-center w-full max-w-[1000px]">
                {/* Top Section */}
                <div className="text-[#0a66c2] text-[13px] font-semibold mb-2">
                    <img src={logo} alt="Jobiffi Logo" className="h-[24px] object-contain ml-1" />
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-[#dce6f1] mb-4 max-w-[600px]"></div>

                {/* Link Links */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
                    <a href="https://jobiffi.com/about-us" className="no-underline text-[#5E5E5E] text-[12px] font-medium transition-all duration-200 hover:text-[#0a66c2]">About</a>
                    <a href="https://jobiffi.com/privacy-policy" className="no-underline text-[#5E5E5E] text-[12px] font-medium transition-all duration-200 hover:text-[#0a66c2]">Privacy Policy</a>
                    <a href="https://jobiffi.com/terms-conditions" className="no-underline text-[#5E5E5E] text-[12px] font-medium transition-all duration-200 hover:text-[#0a66c2]">Terms & conditions</a>
                    <a href="#Help Center" className="no-underline text-[#5E5E5E] text-[12px] font-medium transition-all duration-200 hover:text-[#0a66c2]">Help Center</a>
                    <a href="#Contact Us" className="no-underline text-[#5E5E5E] text-[12px] font-medium transition-all duration-200 hover:text-[#0a66c2]">Contact Us</a>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="text-[#5E5E5E] text-[12px] font-normal ml-1">© Jobiffi Corporation 2026</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
