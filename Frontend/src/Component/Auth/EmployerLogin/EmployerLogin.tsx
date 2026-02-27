import React, { useState } from 'react';
import api from '../../../api/serverApi';
import toast from 'react-hot-toast';

const EmployerLogin: React.FC = () => {
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
            const response = await api.post('/auth/login-recruiter', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Employer Logged in successfully!');
            window.location.href = '/employee/dashboard';
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Employer Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 pt-10 flex flex-col items-center">
            <h2 className="text-[28px] font-bold text-center text-[#0122c5] mb-2 tracking-tight">
                Employer Access
            </h2>
            <p className="text-center text-gray-500 text-[15px] mb-8 font-medium">
                Log in to manage your job listings and applications.
            </p>

            <form onSubmit={onSubmit} className="w-full flex flex-col gap-4 text-left">
                <div>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="w-full px-4 h-[50px] rounded-[12px] border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0122c5] transition-all bg-gray-50 focus:bg-white text-[15px] text-gray-900 shadow-sm"
                        placeholder="Employer email address"
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
                        placeholder="Employer password"
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
                    {loading ? 'Accessing...' : 'Employer Log In'}
                </button>
            </form>
        </div>
    );
};

export default EmployerLogin;
