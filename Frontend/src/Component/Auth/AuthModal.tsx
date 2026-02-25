import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);

    // Sync state if initial mode changes while open (optional, but good practice)
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'register' : 'login');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 bg-gray-100/50 hover:bg-gray-100 rounded-full transition-colors z-10 border-none outline-none focus:outline-none focus:ring-0"
                >
                    <FiX size={20} />
                </button>

                <div className="p-8 pt-10">
                    <h2 className="text-[28px] font-bold text-center text-[#0122c5] mb-2 tracking-tight">
                        {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
                    </h2>
                    <p className="text-center text-gray-500 text-[15px] mb-8 font-medium">
                        {mode === 'login'
                            ? 'Please log in to continue your journey.'
                            : 'Join Jobiffi and find your dream job today.'}
                    </p>

                    <div className="flex flex-col gap-3 mb-6">
                        <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-0 text-[15px]">
                            <FcGoogle size={22} />
                            Continue with Google
                        </button>
                        <button className="w-full flex items-center justify-center gap-3 bg-[#0A66C2] border border-transparent hover:bg-[#004182] text-white font-semibold py-3 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-0 text-[15px] hover:border-transparent">
                            <FaLinkedin size={22} />
                            Continue with LinkedIn
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                        <span className="text-gray-400 text-[13px] font-bold uppercase tracking-wider">Or</span>
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                    </div>

                    <form className="flex flex-col gap-4 text-left">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-[14px] font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 h-[50px] rounded-[12px] border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0122c5] transition-all bg-gray-50 focus:bg-white text-[15px] text-gray-900 shadow-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-[14px] font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 h-[50px] rounded-[12px] border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0122c5] transition-all bg-gray-50 focus:bg-white text-[15px] text-gray-900 shadow-sm"
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-gray-700 mb-1.5 ml-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 h-[50px] rounded-[12px] border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0122c5] transition-all bg-gray-50 focus:bg-white text-[15px] text-gray-900 shadow-sm"
                                placeholder="Enter your password"
                            />
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-end mt-1">
                                <button type="button" className="text-[14px] font-semibold text-[#0122c5] hover:text-[#0c2445] hover:underline bg-transparent p-0 border-none outline-none focus:outline-none hover:border-transparent transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            className="w-full h-[54px] bg-[#0122c5] border border-transparent hover:bg-[#0c2445] hover:border-transparent text-white font-bold rounded-full transition-colors mt-2 text-[15px] shadow-md focus:outline-none focus:ring-0"
                        >
                            {mode === 'login' ? 'Log In' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-[15px] text-gray-600 font-medium">
                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="font-bold text-[#0122c5] hover:text-[#0c2445] hover:underline bg-transparent p-0 border-none outline-none focus:outline-none hover:border-transparent transition-colors"
                        >
                            {mode === 'login' ? 'Register here' : 'Log in here'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
