import { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BsBookmark } from 'react-icons/bs';
import api from '../../api/serverApi';
import toast from 'react-hot-toast';

const JobSearchSection = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'keyword' | 'ai'>('keyword');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId: string) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            toast.error('Please login to apply');
            return;
        }
        if (user.role === 'employee') {
            toast.error('Employees cannot apply for jobs');
            return;
        }

        try {
            await api.post(`/applications/${jobId}`, {
                resume: 'Link to resume in user profile',
                coverLetter: 'Interested in this role'
            });
            toast.success('Successfully applied!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        }
    };

    const filteredJobs = useMemo(() => {
        if (!searchQuery) return jobs;
        return jobs.filter(job =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.jobType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.refCode?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [jobs, searchQuery]);

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <section className="bg-white min-h-screen py-12 px-6 lg:px-24">
            {/* RESTORED SEARCH UI */}
            <div className="max-w-4xl mx-auto mb-16 bg-white border border-gray-100 rounded-[40px] p-12 shadow-sm flex flex-col items-center">
                {/* Tabs */}
                <div className="bg-gray-100 p-1.5 rounded-full flex gap-1 mb-8">
                    <button
                        onClick={() => setActiveTab('keyword')}
                        className={`px-8 py-2.5 rounded-full transition-all text-sm font-bold ${activeTab === 'keyword' ? 'bg-white text-[#0122c5] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Keyword Search
                    </button>
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`px-8 py-2.5 rounded-full transition-all text-sm font-bold ${activeTab === 'ai' ? 'bg-white text-[#0122c5] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        AI Resume Match
                    </button>
                </div>

                <h2 className="text-[32px] font-extrabold text-[#0122c5] mb-8 text-center">Search Jobiffi Careers</h2>

                {/* Search Bar */}
                <div className="w-full relative group">
                    <input
                        type="text"
                        placeholder="Search by technology, team, location, or ref code"
                        className="w-full h-[64px] pl-8 pr-16 bg-white border border-gray-200 rounded-full text-[17px] focus:border-[#0122c5] outline-none transition-all shadow-sm focus:shadow-md font-medium placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0122c5] transition-colors cursor-pointer">
                        <FiSearch size={24} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="p-20 text-center text-gray-400 animate-pulse">Gathering newest opportunities...</div>
            ) : (
                <>
                    {/* Results Grid */}
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {currentJobs.length > 0 ? (
                            currentJobs.map((job) => (
                                <div key={job._id} className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:border-blue-50 transition-all group relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <BsBookmark size={22} className="text-gray-400 cursor-pointer hover:text-[#0122c5]" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-[#0122c5] mb-2 pr-8">{job.title}</h3>
                                    <p className="text-gray-500 font-bold mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span> {job.location}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{job.jobType}</span>
                                    </div>
                                    <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                                        <button
                                            onClick={() => handleApply(job._id)}
                                            className="bg-[#0122c5] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-800 transition-all shadow-md active:scale-95"
                                        >
                                            Quick Apply
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-gray-400">
                                <p className="text-xl font-medium">No matches found for "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery("")} className="mt-4 text-[#0122c5] font-bold hover:underline">Clear search</button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex justify-center items-center gap-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-3 rounded-full border border-gray-200 text-gray-400 hover:text-[#0122c5] hover:border-[#0122c5] disabled:opacity-30 transition-all"
                            >
                                <FiChevronLeft size={24} />
                            </button>
                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-full font-bold transition-all ${currentPage === i + 1 ? 'bg-[#0122c5] text-white shadow-md' : 'text-gray-400 hover:text-[#0122c5]'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 rounded-full border border-gray-200 text-gray-400 hover:text-[#0122c5] hover:border-[#0122c5] disabled:opacity-30 transition-all"
                            >
                                <FiChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default JobSearchSection;
