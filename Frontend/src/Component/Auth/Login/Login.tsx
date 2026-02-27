import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import api from '../../../api/serverApi';
import toast from 'react-hot-toast';

interface LoginProps {
    onToggleMode: (mode: 'register' | 'employer') => void;
}

const Login: React.FC<LoginProps> = ({ onToggleMode }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { email, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login-candidate', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Logged in successfully!');

            const user = response.data.user;
            if (user.role === 'employee') {
                window.location.href = '/employee/dashboard';
            } else {
                window.location.reload(); // Home for candidates
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Employer Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 pt-10 flex flex-col items-center">
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 rounded-full p-1 w-full max-w-[400px] mb-8">
                <button
                    onClick={() => { }} // Already on login
                    className="bg-blue-100 text-[#0122c5] shadow-sm flex-1 py-2.5 text-[14px] outline-none focus:outline-none focus:ring-0 font-semibold rounded-full transition-all"
                >
                    Log In
                </button>
                <button
                    onClick={() => onToggleMode('register')}
                    className="bg-transparent text-gray-500 hover:text-gray-700 flex-1 py-2.5 text-[14px] outline-none focus:outline-none focus:ring-0 font-semibold rounded-full transition-all"
                >
                    Register
                </button>
            </div>

            <h2 className="text-[28px] font-bold text-center text-[#0122c5] mb-2 tracking-tight">
                Welcome Back!
            </h2>
            <p className="text-center text-gray-500 text-[15px] mb-8 font-medium">
                Please log in to continue your journey.
            </p>

            <div className="w-full flex flex-col gap-3 mb-6">
                <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-0 text-[15px]">
                    <FcGoogle size={22} />
                    Continue with Google
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-[#0A66C2] border border-transparent hover:bg-[#004182] text-white font-semibold py-3 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-0 text-[15px] hover:border-transparent">
                    <FaLinkedin size={22} />
                    Continue with LinkedIn
                </button>
            </div>

            <div className="w-full flex items-center gap-4 mb-6">
                <div className="flex-1 h-[1px] bg-gray-200"></div>
                <span className="text-gray-400 text-[13px] font-bold uppercase tracking-wider">Or</span>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            <form onSubmit={onSubmit} className="w-full flex flex-col gap-4 text-left">
                <div>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="w-full px-4 h-[50px] rounded-[12px] border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0122c5] transition-all bg-gray-50 focus:bg-white text-[15px] text-gray-900 shadow-sm"
                        placeholder="Enter your email address"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1.5 ml-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className="w-full px-4 h-[50px] rounded-[12px] border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0122c5] transition-all bg-gray-50 focus:bg-white text-[15px] text-gray-900 shadow-sm"
                        placeholder="Enter your password"
                        disabled={loading}
                    />
                </div>

                <div className="flex justify-end mt-1">
                    <button type="button" className="text-[14px] font-semibold text-[#0122c5] hover:text-[#0c2445] hover:underline bg-transparent p-0 border-none outline-none focus:outline-none hover:border-transparent transition-colors">
                        Forgot password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[54px] bg-[#0122c5] border border-transparent hover:bg-[#0c2445] hover:border-transparent text-white font-bold rounded-full transition-colors mt-2 text-[15px] shadow-md focus:outline-none focus:ring-0 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    );
};

export default Login;
