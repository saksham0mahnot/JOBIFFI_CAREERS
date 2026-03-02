import { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiSliders, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiX, FiMapPin } from 'react-icons/fi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import api from '../../api/serverApi';
import toast from 'react-hot-toast';

interface Job {
    _id: string;
    title: string;
    location: string;
    company?: string;
    jobType: string;
    description?: string;
    refCode?: string;
    featured?: boolean;
}

const JobSearchSection = () => {
    // API State
    const [jobs, setJobs] = useState<Job[]>([]);
    const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'keyword' | 'ai'>('keyword');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter layout toggles
    const [showFilters, setShowFilters] = useState(true);
    const [sortBy, setSortBy] = useState("Relevance");
    const [isSortExpanded, setIsSortExpanded] = useState(true);
    const [isDomainExpanded, setIsDomainExpanded] = useState(true);
    const [isTypeExpanded, setIsTypeExpanded] = useState(true);
    const [isLocationExpanded, setIsLocationExpanded] = useState(true);

    // Filter values
    const [selectedDomain, setSelectedDomain] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [locationQuery, setLocationQuery] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({
        domain: [] as string[],
        types: [] as string[],
        location: ""
    });

    // Hardcoded lists from original Figma / Repo for UI accuracy
    const allDomain = [
        "Advertising Technology", "Engineering", "Software Engineering", "AR/VR",
        "Sales & Marketing", "Infrastructure", "Communications & Public Policy",
        "Legal, Finance, Facilities & Admin", "Finance", "Design", "Data & Analytics",
        "Artificial Intelligence", "Product", "Human Resources", "Marketing",
        "Security", "Cloud & Infrastructure", "Sales", "Customer Experience",
        "IT Support", "Support", "Leadership"
    ];
    const allTypes = ["Full time employment", "Part-time", "Internship", "Contract"];

    useEffect(() => {
        fetchJobs();
        fetchSavedJobs();
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

    const fetchSavedJobs = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id || user.role !== 'candidate') return;

        try {
            const res = await api.get('/saved-jobs');
            setSavedJobIds(res.data.map((job: any) => job._id));
        } catch (error) {
            console.error('Failed to fetch saved jobs');
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

    const handleToggleSave = async (jobId: string) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            toast.error('Please login to save jobs');
            return;
        }
        if (user.role === 'employee') {
            toast.error('Only candidates can save jobs');
            return;
        }

        try {
            const res = await api.post(`/saved-jobs/toggle/${jobId}`);
            if (res.data.saved) {
                setSavedJobIds((prev: string[]) => [...prev, jobId]);
                toast.success('Job saved!');
            } else {
                setSavedJobIds((prev: string[]) => prev.filter((id: string) => id !== jobId));
                toast.success('Job removed');
            }
        } catch (error) {
            toast.error('Failed to save job');
        }
    };

    const toggleTeam = (team: string) => {
        setSelectedDomain((prev: string[]) => prev.includes(team) ? prev.filter((t: string) => t !== team) : [...prev, team]);
    };

    const toggleType = (type: string) => {
        setSelectedTypes((prev: string[]) => prev.includes(type) ? prev.filter((t: string) => t !== type) : [...prev, type]);
    };

    const applyFilters = () => {
        setAppliedFilters({
            domain: selectedDomain,
            types: selectedTypes,
            location: locationQuery
        });
        setCurrentPage(1);
        toast.success('Filters applied');
    };

    const clearFilters = () => {
        setSelectedDomain([]);
        setSelectedTypes([]);
        setLocationQuery("");
        setAppliedFilters({
            domain: [],
            types: [],
            location: ""
        });
        setCurrentPage(1);
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter((job: Job) => {
            const matchesSearch = !searchQuery ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.refCode?.toLowerCase().includes(searchQuery.toLowerCase());

            // Map API 'Full-time' to UI 'Full time employment' for logic mapping if needed
            const jobTypeMatch = job.jobType === 'Full-time' ? 'Full time employment' : job.jobType;
            const matchesType = appliedFilters.types.length === 0 ||
                appliedFilters.types.includes(jobTypeMatch) || appliedFilters.types.includes(job.jobType);

            const matchesLocation = !appliedFilters.location ||
                job.location.toLowerCase().includes(appliedFilters.location.toLowerCase());

            // Since DB doesn't have explicit domains yet, we just check against title/description string matches loosely
            const matchesDomain = appliedFilters.domain.length === 0 ||
                appliedFilters.domain.some((d: string) => job.title.toLowerCase().includes(d.toLowerCase()) || job.description?.toLowerCase().includes(d.toLowerCase()));

            return matchesSearch && matchesType && matchesLocation && matchesDomain;
        });
    }, [jobs, searchQuery, appliedFilters]);

    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
    const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const featuredJobs = currentJobs.filter((job: Job) => job.featured);
    const regularJobs = currentJobs.filter((job: Job) => !job.featured);

    return (
        <div className="w-full bg-white pt-16 pb-24 border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* TOP SEARCH UI */}
                <div className="w-full flex justify-center mb-16 mt-2">
                    <div className="w-full max-w-[850px] flex flex-col items-center bg-white rounded-[20px] p-6 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                        {/* Tab Switcher */}
                        <div className="flex bg-gray-50 border border-gray-100 rounded-full p-1 mb-8 w-full max-w-[400px]">
                            <button
                                onClick={() => setActiveTab('keyword')}
                                className={`flex-1 py-2.5 text-[14px] outline-none focus:outline-none focus:ring-0 font-semibold rounded-full transition-all ${activeTab === 'keyword' ? 'bg-white text-[#0122c5] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Keyword Search
                            </button>
                            <button
                                onClick={() => setActiveTab('ai')}
                                className={`flex-1 py-2.5 text-[14px] outline-none focus:outline-none focus:ring-0 font-semibold rounded-full transition-all ${activeTab === 'ai' ? 'bg-white text-[#0122c5] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                AI Resume Match
                            </button>
                        </div>

                        {/* Search Mode Content */}
                        {activeTab === 'keyword' ? (
                            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-2xl md:text-[28px] font-bold text-[#0122c5] mb-6 tracking-tight text-center">
                                    Search Jobiffi Careers
                                </h2>
                                <div className="w-full max-w-[700px] relative">
                                    <input
                                        type="text"
                                        placeholder="Search by technology, team, location, or ref code"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        className="text-black bg-white w-full h-[54px] pl-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-400 shadow-sm text-[15px] placeholder-gray-400"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
                                        <FiSearch size={20} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-2xl md:text-[28px] font-bold mb-3 tracking-tight text-[#0122c5] text-center">
                                    AI-Powered Job Match
                                </h2>
                                <p className="text-[14px] md:text-[15px] text-gray-600 mb-6 text-center font-medium max-w-xl">
                                    Upload your resume and let Jobiffi connect you with the best matching opportunities.
                                </p>
                                <div className="w-full flex flex-col items-center max-w-[600px]">
                                    <div className="w-full flex flex-col sm:flex-row gap-3 items-stretch">
                                        <div className="flex-1 relative group w-full">
                                            <input
                                                type="file"
                                                title="Upload Resume"
                                                className="absolute inset-0 w-full h-full border border-gray-200 rounded-full opacity-0 cursor-pointer z-10"
                                                accept=".doc,.docx,.pdf,.txt"
                                            />
                                            <div className="w-full h-[54px] border border-gray-300 rounded-full flex items-center px-6 text-gray-400 text-[14px] bg-white group-hover:border-[#0122c5] transition-colors focus-within:outline-none focus-within:ring-0 shadow-sm">
                                                Choose your resume file...
                                            </div>
                                        </div>
                                        <button className="h-[54px] bg-[#0122c5] hover:bg-[#0c2445] text-white px-8 rounded-full text-[14px] font-bold transition-colors whitespace-nowrap shadow-sm hover:shadow-md relative z-20 w-full sm:w-auto mt-2 sm:mt-0">
                                            Match Me
                                        </button>
                                    </div>
                                    <p className="text-[11px] md:text-[12px] text-gray-500 mt-4 text-center tracking-tight">
                                        Supported formats: .doc, .docx, .pdf, .txt (Max size: 2MB)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter and Count Header */}
                <div id='filter-and-count' className="flex items-center justify-between py-4 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="outline-none focus:outline-none focus:ring-0 bg-white flex items-center gap-2 text-[#0122c5] font-semibold text-[14px] hover:opacity-80 transition-opacity"
                    >
                        <FiSliders size={16} />
                        {showFilters ? 'Hide filters' : 'Show filters'}
                    </button>
                    <span className="text-[13px] text-gray-600 font-medium">{filteredJobs.length} Items</span>
                </div>

                {/* Restored Split Layout with Blue Background Sidebar */}
                <div className="bg-blue-50 p-5 rounded-2xl border-dotted border-2 border-gray-300 flex flex-col md:flex-row gap-10">

                    {/* Left Sidebar Filters */}
                    {showFilters && (
                        <div className="w-full md:w-[280px] shrink-0 flex flex-col gap-4">

                            {/* Applied Filters Status */}
                            {(selectedDomain.length > 0 || selectedTypes.length > 0 || locationQuery.trim() !== "") && (
                                <div className="mb-2">
                                    <h3 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wider">Applied Filters</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDomain.map(team => (
                                            <span key={team} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0122c5]/10 text-[#0122c5] text-[12px] font-bold rounded-[6px] border border-[#0122c5]/20">
                                                {team}
                                                <button onClick={() => toggleTeam(team)} className="bg-transparent text-[#0122c5] hover:text-gray-600 focus:outline-none focus:ring-0 p-0 hover:bg-transparent">
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        {selectedTypes.map(type => (
                                            <span key={type} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0122c5]/10 text-[#0122c5] text-[12px] font-bold rounded-[6px] border border-[#0122c5]/20">
                                                {type}
                                                <button onClick={() => toggleType(type)} className="bg-transparent text-[#0122c5] hover:text-gray-600 focus:outline-none focus:ring-0 p-0 hover:bg-transparent">
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        {locationQuery.trim() !== "" && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0122c5]/10 text-[#0122c5] text-[12px] font-bold rounded-[6px] border border-[#0122c5]/20">
                                                <span className="font-normal text-gray-600">Location:</span> {locationQuery}
                                                <button onClick={() => { setLocationQuery(""); setCurrentPage(1); }} className="bg-transparent text-[#0122c5] hover:text-gray-600 focus:outline-none focus:ring-0 p-0 hover:bg-transparent">
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                    <hr className="border-blue-100 mt-6" />
                                </div>
                            )}

                            <div className="flex flex-col w-full">
                                {/* Sort by */}
                                <div className="py-5 border-b border-blue-100 mb-2">
                                    <button
                                        onClick={() => setIsSortExpanded(!isSortExpanded)}
                                        className="w-full bg-transparent border-none outline-none focus:outline-none p-0 flex items-center justify-between cursor-pointer group"
                                    >
                                        <h3 className="text-[15px] font-bold text-gray-800">Sort by</h3>
                                        {isSortExpanded ? <FiChevronUp className="text-gray-600 transition-transform group-hover:text-black" size={20} /> : <FiChevronDown className="text-gray-600 transition-transform group-hover:text-black" size={20} />}
                                    </button>
                                    {isSortExpanded && (
                                        <div className="flex flex-col gap-3 mt-5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    checked={sortBy === 'Relevance'}
                                                    onChange={() => setSortBy('Relevance')}
                                                    className="w-4 h-4 text-[#0122c5] border-gray-300 focus:ring-[#0122c5]"
                                                />
                                                <span className="text-[14px] text-gray-800 font-medium group-hover:text-black">Relevance</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    checked={sortBy === 'Newest'}
                                                    onChange={() => setSortBy('Newest')}
                                                    className="w-4 h-4 text-[#0122c5] border-gray-300 focus:ring-[#0122c5]"
                                                />
                                                <span className="text-[14px] text-gray-800 font-medium group-hover:text-black">Newest</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Domain */}
                                <div className="py-5 border-b border-blue-100 mb-2">
                                    <button
                                        onClick={() => setIsDomainExpanded(!isDomainExpanded)}
                                        className="w-full bg-transparent border-none outline-none focus:outline-none p-0 flex items-center justify-between cursor-pointer group"
                                    >
                                        <h3 className="text-[15px] font-bold text-gray-800">Domain</h3>
                                        {isDomainExpanded ? <FiChevronUp className="text-gray-600 transition-transform group-hover:text-black" size={20} /> : <FiChevronDown className="text-gray-600 transition-transform group-hover:text-black" size={20} />}
                                    </button>
                                    {isDomainExpanded && (
                                        <div className="flex flex-wrap gap-2 mt-5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {allDomain.map(team => (
                                                <button
                                                    key={team}
                                                    onClick={() => toggleTeam(team)}
                                                    className={`px-3 py-1.5 rounded-[4px] text-[12px] focus:outline-none transition-colors ${selectedDomain.includes(team)
                                                        ? 'bg-[#0122c5] text-white font-bold shadow-none border-none outline-none'
                                                        : 'font-medium border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-[#0122c5]'
                                                        }`}
                                                >
                                                    {team}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Employment type */}
                                <div className="py-5 border-b border-blue-100 mb-2">
                                    <button
                                        onClick={() => setIsTypeExpanded(!isTypeExpanded)}
                                        className="w-full bg-transparent border-none outline-none focus:outline-none p-0 flex items-center justify-between cursor-pointer group"
                                    >
                                        <h3 className="text-[15px] font-bold text-gray-800">Employment type</h3>
                                        {isTypeExpanded ? <FiChevronUp className="text-gray-600 transition-transform group-hover:text-black" size={20} /> : <FiChevronDown className="text-gray-600 transition-transform group-hover:text-black" size={20} />}
                                    </button>
                                    {isTypeExpanded && (
                                        <div className="flex flex-col gap-3 mt-5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {allTypes.map(type => (
                                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTypes.includes(type)}
                                                        onChange={() => toggleType(type)}
                                                        className="w-4 h-4 rounded-[3px] border-gray-300 text-[#0122c5] focus:ring-[#0122c5]"
                                                    />
                                                    <span className="text-[13px] text-gray-700 font-medium group-hover:text-black">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="py-5 border-b border-blue-100 mb-2">
                                    <button
                                        onClick={() => setIsLocationExpanded(!isLocationExpanded)}
                                        className="w-full bg-transparent border-none outline-none focus:outline-none p-0 flex items-center justify-between cursor-pointer group"
                                    >
                                        <h3 className="text-[15px] font-bold text-gray-800">Location</h3>
                                        {isLocationExpanded ? <FiChevronUp className="text-gray-600 transition-transform group-hover:text-black" size={20} /> : <FiChevronDown className="text-gray-600 transition-transform group-hover:text-black" size={20} />}
                                    </button>
                                    {isLocationExpanded && (
                                        <div className="relative mt-5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Search location"
                                                value={locationQuery}
                                                onChange={(e) => { setLocationQuery(e.target.value); setCurrentPage(1); }}
                                                className="bg-white text-gray-800 w-full h-[40px] pl-9 pr-3 rounded border border-gray-300 text-[13px] focus:outline-none focus:ring-0 focus:border-[#0122c5]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 mt-4">
                                <button onClick={applyFilters} className="w-full py-2 bg-[#0122c5] text-white rounded-full text-[14px] font-semibold hover:bg-[#0c2445] transition-colors border-none outline-none focus:outline-none">
                                    Apply filters
                                </button>
                                <button onClick={clearFilters} className="w-full py-2 bg-white text-[#0122c5] border border-transparent rounded-full text-[14px] font-semibold hover:bg-gray-50 transition-colors">
                                    Clear filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Right Content - Jobs List */}
                    <div className="flex-1 flex flex-col gap-10">
                        {loading && <div className="py-20 text-center text-gray-500 animate-pulse">Loading job opportunities...</div>}

                        {!loading && featuredJobs.length > 0 && (
                            <div>
                                <h2 className="text-[20px] text-[#0122c5] uppercase font-bold mb-6">Featured Jobs</h2>
                                <div className="flex flex-col gap-5">
                                    {featuredJobs.map(job => (
                                        <JobCard
                                            key={job._id}
                                            job={job}
                                            handleApply={handleApply}
                                            isSaved={savedJobIds.includes(job._id)}
                                            onToggleSave={() => handleToggleSave(job._id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && regularJobs.length > 0 && (
                            <div>
                                <h2 className="text-[20px] text-[#0122c5] uppercase font-bold mb-6">{featuredJobs.length > 0 ? 'All Jobs' : 'Jobs'}</h2>
                                <div className="flex flex-col gap-5">
                                    {regularJobs.map(job => (
                                        <JobCard
                                            key={job._id}
                                            job={job}
                                            handleApply={handleApply}
                                            isSaved={savedJobIds.includes(job._id)}
                                            onToggleSave={() => handleToggleSave(job._id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && filteredJobs.length === 0 && (
                            <div className="py-12 bg-white/50 rounded-[20px] flex flex-col items-center justify-center border border-dashed border-gray-300">
                                <p className="text-lg font-bold text-gray-400 mb-2">No jobs matched your filters.</p>
                                <button onClick={clearFilters} className="text-[#0122c5] font-semibold hover:underline">Reset Filters</button>
                            </div>
                        )}

                        {/* Pagination Footer */}
                        {filteredJobs.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-8 pt-8 text-[#0122c5]">
                                <button
                                    onClick={() => {
                                        setCurrentPage((prev: number) => Math.max(prev - 1, 1));
                                        document.getElementById('filter-and-count')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className={`p-0 outline-none focus:outline-none focus:ring-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200' : 'text-[#0122c5] bg-white border border-gray-300 hover:bg-[#0122c5] hover:border-[#0122c5] hover:text-white cursor-pointer'}`}>
                                    <FiChevronLeft size={20} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }).map((_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => {
                                                    setCurrentPage(pageNum);
                                                    document.getElementById('filter-and-count')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className={`p-0 outline-none focus:outline-none focus:ring-0 w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${currentPage === pageNum
                                                    ? 'bg-[#0122c5] text-white border border-[#0122c5]'
                                                    : 'bg-white text-gray-600 border border-gray-300 hover:border-[#0122c5] hover:text-[#0122c5]'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage((prev: number) => Math.min(prev + 1, totalPages));
                                        document.getElementById('filter-and-count')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className={`p-0 outline-none focus:outline-none focus:ring-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200' : 'text-[#0122c5] bg-white border border-gray-300 hover:bg-[#0122c5] hover:border-[#0122c5] hover:text-white cursor-pointer'}`}>
                                    <FiChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface JobCardProps {
    job: any;
    handleApply: (id: string) => void;
    isSaved: boolean;
    onToggleSave: () => void;
}

const JobCard = ({ job, handleApply, isSaved, onToggleSave }: JobCardProps) => {
    return (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between group bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg focus-within:border-[#0122c5] focus-within:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex-1 lg:pr-6 mb-4 lg:mb-0 w-full">
                <h3 className="text-[17px] font-bold text-gray-900 mb-1.5 leading-tight cursor-pointer hover:underline">
                    {job.title}
                </h3>
                <div className="text-[13px] text-gray-600 flex flex-wrap items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 font-medium"><FiMapPin size={14} />{job.location}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-semibold text-gray-800">{job.company || 'Jobiffi HR'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1 rounded-[6px] text-[11px] font-bold tracking-wide uppercase">
                        {job.jobType}
                    </span>
                    {job.refCode && (
                        <span className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1 rounded-[6px] text-[11px] font-bold tracking-wide uppercase">
                            REF: {job.refCode}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center lg:flex-col lg:items-end w-full lg:w-auto justify-between lg:justify-between self-stretch shrink-0 lg:pl-4 gap-4 mt-2 lg:mt-0">
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
                    className={`outline-none focus:outline-none focus:ring-0 transition-colors p-2 rounded-full hover:bg-blue-50 ${isSaved ? 'text-[#0122c5]' : 'text-gray-300'}`}
                >
                    {isSaved ? <BsBookmarkFill size={20} /> : <BsBookmark size={20} />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleApply(job._id); }}
                    className="bg-white text-[#0122c5] border-2 border-[#0122c5] hover:bg-[#0122c5] hover:text-white text-[13px] font-bold px-8 py-2 rounded-full transition-colors whitespace-nowrap shadow-sm hover:shadow-md outline-none focus:outline-none"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default JobSearchSection;

