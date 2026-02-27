import React, { useState, useEffect } from 'react';
import api from '../../api/serverApi';
import toast from 'react-hot-toast';
import { FiPlus, FiBriefcase, FiFileText, FiLogOut, FiCheck, FiX } from 'react-icons/fi';

const EmployeeDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'post' | 'applications'>('jobs');
    const [myJobs, setMyJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state for posting a job
    const [jobForm, setJobForm] = useState({
        title: '',
        company: 'Jobiffi',
        location: '',
        description: '',
        salary: '',
        jobType: 'Full-time',
        refCode: ''
    });

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const res = await api.get('/jobs/my');
            setMyJobs(res.data);
        } catch (error) {
            toast.error('Failed to fetch your jobs');
        }
    };

    const fetchApplications = async (jobId: string) => {
        setLoading(true);
        try {
            const res = await api.get(`/applications/job/${jobId}`);
            setApplications(res.data);
            setActiveTab('applications');
        } catch (error) {
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/jobs', jobForm);
            toast.success('Job posted successfully!');
            setJobForm({
                title: '',
                company: 'Jobiffi',
                location: '',
                description: '',
                salary: '',
                jobType: 'Full-time',
                refCode: ''
            });
            fetchMyJobs();
            setActiveTab('jobs');
        } catch (error) {
            toast.error('Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (appId: string, status: string) => {
        try {
            await api.put(`/applications/${appId}/status`, { status });
            toast.success(`Application ${status}`);
            // Refresh applications for the current view
            const currentJobId = applications[0]?.job;
            if (currentJobId) fetchApplications(currentJobId);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#0122c5]">Employee Hub</h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Management</p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeTab === 'jobs' ? 'bg-[#0122c5] text-white shadow-md font-bold' : 'text-gray-500 hover:bg-blue-50 hover:text-[#0122c5]'}`}
                    >
                        <FiBriefcase className={activeTab === 'jobs' ? 'text-white' : ''} /> My Postings
                    </button>
                    <button
                        onClick={() => setActiveTab('post')}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeTab === 'post' ? 'bg-[#0122c5] text-white shadow-md font-bold' : 'text-gray-500 hover:bg-blue-50 hover:text-[#0122c5]'}`}
                    >
                        <FiPlus className={activeTab === 'post' ? 'text-white' : ''} /> Post New Job
                    </button>
                    <div className="mt-auto border-t border-gray-100 pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
                        >
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {activeTab === 'jobs' && 'Managed Jobs'}
                            {activeTab === 'post' && 'Create Job Posting'}
                            {activeTab === 'applications' && 'Job Applications'}
                        </h1>
                        <p className="text-gray-500 mt-1">Manage Jobiffi internal career opportunities</p>
                    </div>
                </header>

                {/* Content Area */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
                    {activeTab === 'jobs' && (
                        <div className="p-6">
                            {myJobs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                                    <FiBriefcase size={48} className="mb-4 opacity-20" />
                                    <p>You haven't posted any jobs yet.</p>
                                    <button
                                        onClick={() => setActiveTab('post')}
                                        className="mt-6 bg-[#0122c5] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-800 transition-all active:scale-95"
                                    >
                                        Post your first job
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {myJobs.map(job => (
                                        <div key={job._id} className="p-5 border border-gray-100 rounded-2xl hover:border-blue-200 transition-all flex justify-between items-center group">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                                <p className="text-sm text-gray-500">{job.location} • {job.jobType}</p>
                                            </div>
                                            <button
                                                onClick={() => fetchApplications(job._id)}
                                                className="bg-[#0122c5] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-blue-800 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                            >
                                                View Applications
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'post' && (
                        <form onSubmit={handlePostJob} className="p-8 max-w-2xl">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0122c5] outline-none transition-all"
                                        placeholder="e.g. Senior Frontend Engineer"
                                        value={jobForm.title}
                                        onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0122c5] outline-none transition-all"
                                        placeholder="e.g. Remote, Worldwide"
                                        value={jobForm.location}
                                        onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0122c5] outline-none transition-all"
                                        value={jobForm.jobType}
                                        onChange={e => setJobForm({ ...jobForm, jobType: e.target.value })}
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Reference Code (Ref Code)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0122c5] outline-none transition-all"
                                        placeholder="e.g. JOB-1234 (Optional)"
                                        value={jobForm.refCode}
                                        onChange={e => setJobForm({ ...jobForm, refCode: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows={6} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0122c5] outline-none transition-all resize-none"
                                        placeholder="Outline the responsibilities and requirements..."
                                        value={jobForm.description}
                                        onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-[#0122c5] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Posting...' : 'Launch Job Posting'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'applications' && (
                        <div className="p-6">
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className="mb-6 text-sm text-[#0122c5] font-bold hover:underline flex items-center gap-2"
                            >
                                ← Back to My Postings
                            </button>

                            {applications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                                    <FiFileText size={48} className="mb-4 opacity-20" />
                                    <p>No applications received for this job yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="px-4 py-4 font-bold">Applicant</th>
                                                <th className="px-4 py-4 font-bold">Status</th>
                                                <th className="px-4 py-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {applications.map(app => (
                                                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-5">
                                                        <div className="font-bold text-gray-900">{app.applicant?.name}</div>
                                                        <div className="text-xs text-gray-500">{app.applicant?.email}</div>
                                                    </td>
                                                    <td className="px-4 py-5">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-5 text-right flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                                            title="Accept"
                                                        >
                                                            <FiCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                            title="Reject"
                                                        >
                                                            <FiX />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
