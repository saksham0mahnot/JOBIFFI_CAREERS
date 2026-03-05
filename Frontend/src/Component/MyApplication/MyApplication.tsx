import React, { useState, useEffect } from 'react';
import { FiUser, FiUploadCloud, FiBriefcase, FiMail, FiPhone, FiMapPin, FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyApplication: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'applications' | 'profile'>('applications');
    const [user, setUser] = useState<any>(null);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        skills: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setProfileData(prev => ({
                    ...prev,
                    name: parsedUser.name || '',
                    email: parsedUser.email || ''
                }));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally update the user profile via an API call
        toast.success("Profile saved successfully! (Mock)");

        // Update local storage user just for demo purposes
        if (user) {
            const updatedUser = { ...user, name: profileData.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    };

    // Mock Applications Data
    const mockApplications = [
        { id: 1, role: 'Frontend Developer', company: 'Google', status: 'Under Review', date: 'Oct 24, 2026' },
        { id: 2, role: 'React Engineer', company: 'Microsoft', status: 'Interview', date: 'Oct 12, 2026' },
        { id: 3, role: 'Full Stack Developer', company: 'Amazon', status: 'Applied', date: 'Oct 05, 2026' },
    ];

    return (
        <div className="w-full bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                        <div className="mb-6 px-4 py-2">
                            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm w-full outline-none focus:outline-none ${activeTab === 'applications' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <FiBriefcase size={18} />
                                My Applications
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm w-full outline-none focus:outline-none ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <FiUser size={18} />
                                My Profile
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'applications' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                                    <p className="text-gray-500 mt-1">Track and manage your job applications.</p>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
                                    {mockApplications.length} Total
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {mockApplications.map(app => (
                                    <div key={app.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xl font-bold text-blue-700">{app.company.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-0.5">{app.role}</h3>
                                                <p className="text-gray-500 font-medium text-sm">{app.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end md:gap-2 border-t md:border-none border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'Interview' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                            <span className="text-gray-400 text-xs font-medium">Applied: {app.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h2>
                            <p className="text-gray-500 mb-8">Manage your personal information and resume.</p>

                            <form onSubmit={handleProfileSave} className="flex flex-col gap-8">
                                {/* Profile Photo Section */}
                                <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden text-blue-700">
                                            {user && user.name ? <span className="text-3xl font-bold">{user.name.charAt(0)}</span> : <FiUser size={40} />}
                                        </div>
                                        <button type="button" className="absolute bottom-0 right-0 bg-white border border-gray-200 p-2 rounded-full text-gray-600 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-sm focus:outline-none">
                                            <FiCamera size={16} />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Profile Photo</h3>
                                        <p className="text-gray-500 text-sm mb-3">Upload a professional photo. Recommended size: 256x256px.</p>
                                        <div className="flex gap-3">
                                            <label className="bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                                                Upload New
                                                <input type="file" className="hidden" accept="image/*" />
                                            </label>
                                            <button type="button" className="text-red-500 font-medium text-sm hover:text-red-700 outline-none focus:outline-none px-2">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <FiUser size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={profileData.name}
                                                    onChange={handleProfileChange}
                                                    className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 bg-gray-50 focus:bg-white transition-all text-gray-800 text-[15px]"
                                                    placeholder="e.g. John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <FiMail size={18} />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleProfileChange}
                                                    className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 bg-gray-50 focus:bg-white transition-all text-gray-800 text-[15px]"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <FiPhone size={18} />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={profileData.phone}
                                                    onChange={handleProfileChange}
                                                    className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 bg-gray-50 focus:bg-white transition-all text-gray-800 text-[15px]"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Location</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <FiMapPin size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={profileData.location}
                                                    onChange={handleProfileChange}
                                                    className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 bg-gray-50 focus:bg-white transition-all text-gray-800 text-[15px]"
                                                    placeholder="San Francisco, CA"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Details</h3>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Key Skills <span className="text-gray-400 font-normal">(Comma separated)</span></label>
                                            <input
                                                type="text"
                                                name="skills"
                                                value={profileData.skills}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 h-[48px] rounded-xl border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 bg-gray-50 focus:bg-white transition-all text-gray-800 text-[15px]"
                                                placeholder="React, TypeScript, Node.js..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Upload */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Resume / CV</h3>
                                    <p className="text-gray-500 text-sm mb-4">Upload your most recent resume to stand out.</p>

                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-500 hover:bg-blue-50/50 transition-colors group text-center cursor-pointer">
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <FiUploadCloud size={28} />
                                        </div>
                                        <h4 className="text-gray-900 font-bold mb-1 group-hover:text-blue-700 transition-colors">Click to upload or drag and drop</h4>
                                        <p className="text-gray-500 text-sm">PDF, DOCX, or DOC (Max 5MB)</p>
                                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-gray-100 pt-6 mt-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md focus:outline-none"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyApplication;
