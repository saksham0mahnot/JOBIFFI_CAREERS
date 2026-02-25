import React from 'react';

const EmployerLogin: React.FC = () => {
    return (
        <div className="p-8 pt-10">
            <h2 className="text-[28px] font-bold text-center text-[#0122c5] mb-2 tracking-tight">
                Employer Portal
            </h2>
            <p className="text-center text-gray-500 text-[15px] mb-8 font-medium">
                Log in to manage your job postings and candidates.
            </p>

            <form className="flex flex-col gap-4 text-left">
                <div>
                    <label className="block text-[14px] font-bold text-gray-700 mb-1.5 ml-1">Work Email</label>
                    <input
                        type="email"
                        className="w-full px-4 h-[50px] rounded-[12px] border border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0122c5] transition-all bg-gray-50 focus:bg-white text-[15px] text-gray-900 shadow-sm"
                        placeholder="Enter your work email"
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

                <div className="flex justify-end mt-1">
                    <button type="button" className="text-[14px] font-semibold text-[#0122c5] hover:text-[#0c2445] hover:underline bg-transparent p-0 border-none outline-none focus:outline-none hover:border-transparent transition-colors">
                        Forgot password?
                    </button>
                </div>

                <button
                    type="button"
                    className="w-full h-[54px] bg-[#0122c5] border border-transparent hover:bg-[#0c2445] hover:border-transparent text-white font-bold rounded-full transition-colors mt-2 text-[15px] shadow-md focus:outline-none focus:ring-0"
                >
                    Log In to Dashboard
                </button>
            </form>
        </div>
    );
};

export default EmployerLogin;
