import { useState, useMemo } from 'react';
import { FiSearch, FiSliders, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { BsBookmark } from 'react-icons/bs';

const JOBS_DATA = [
    {
        id: 1,
        title: "Software Engineer, Machine Learning",
        location: "Sunnyvale, CA • 15 locations",
        domain: ["Advertising Technology", "Engineering"],
        technologies: ["React", "Python"],
        type: "Full time employment",
        tags: ["Multiple Locations", "Advertising Technology", "AI Infrastructure", "AI Research", "AR/VR", "Artificial Intelligence", "Data & Analytics"],
        featured: true
    },
    {
        id: 2,
        title: "Software Engineer, Infrastructure",
        location: "Sunnyvale, CA • 10 locations",
        domain: ["Software Engineering", "Engineering"],
        technologies: ["AWS", "Node.js"],
        type: "Full time employment",
        tags: ["Multiple Locations", "Software Engineering", "Engineering"],
        featured: true
    },
    {
        id: 3,
        title: "Product Design Engineer",
        location: "Sunnyvale, CA • 1 locations",
        domain: ["AR/VR", "Engineering"],
        technologies: ["Figma", "Prototyping"],
        type: "Full time employment",
        tags: ["Multiple Locations", "AR/VR", "Engineering", "Hardware"],
        featured: true
    },
    {
        id: 4,
        title: "Clients Solution Manager, Apps and Games, Greater China",
        location: "Hong Kong",
        domain: ["Sales & Marketing"],
        technologies: [],
        type: "Full time employment",
        tags: ["Hong Kong", "Sales & Marketing", "Sales"],
        featured: false
    },
    {
        id: 5,
        title: "ASIC Engineer, Design Verification",
        location: "Bangalore, India",
        domain: ["Infrastructure", "Engineering"],
        technologies: ["Verilog", "C++"],
        type: "Full time employment",
        tags: ["Bangalore, India", "Infrastructure", "Engineering", "Hardware"],
        featured: false
    },
    {
        id: 6,
        title: "Communications Manager",
        location: "New York, NY",
        domain: ["Communications & Public Policy"],
        technologies: [],
        type: "Full time employment",
        tags: ["New York, NY", "Communications & Public Policy", "Corporate Communications"],
        featured: false
    },
    {
        id: 7,
        title: "Finance and Business Operations Manager, Jobiffi",
        location: "Menlo Park, CA +1 locations",
        domain: ["Legal, Finance, Facilities & Admin", "Finance"],
        technologies: [],
        type: "Full time employment",
        tags: ["Multiple Locations", "Legal, Finance, Facilities & Admin", "Finance"],
        featured: false
    },

    {
        id: 8,
        title: "Frontend Developer (React)",
        location: "Remote • India",
        domain: ["Engineering"],
        technologies: ["React", "TypeScript", "Tailwind"],
        type: "Full time employment",
        tags: ["Remote", "Frontend", "Engineering"],
        featured: true
    },
    {
        id: 9,
        title: "Backend Developer (Node.js)",
        location: "Pune, India",
        domain: ["Engineering"],
        technologies: ["Node.js", "Express", "MongoDB"],
        type: "Full time employment",
        tags: ["Backend", "Engineering", "API Development"],
        featured: true
    },
    {
        id: 10,
        title: "DevOps Engineer",
        location: "Hyderabad, India",
        domain: ["Infrastructure", "Engineering"],
        technologies: ["AWS", "Docker", "Kubernetes"],
        type: "Full time employment",
        tags: ["DevOps", "Cloud", "Engineering"],
        featured: false
    },
    {
        id: 11,
        title: "Mobile App Developer (React Native)",
        location: "Remote",
        domain: ["Engineering"],
        technologies: ["React Native", "Firebase"],
        type: "Full time employment",
        tags: ["Mobile", "Cross Platform", "Engineering"],
        featured: true
    },
    {
        id: 12,
        title: "UI/UX Designer",
        location: "Bangalore, India",
        domain: ["Design"],
        technologies: ["Figma", "Adobe XD"],
        type: "Full time employment",
        tags: ["Design", "Product Design"],
        featured: false
    },
    {
        id: 13,
        title: "Data Analyst",
        location: "Mumbai, India",
        domain: ["Data & Analytics"],
        technologies: ["SQL", "Python", "Power BI"],
        type: "Full time employment",
        tags: ["Analytics", "Business Intelligence"],
        featured: false
    },
    {
        id: 14,
        title: "AI Research Engineer",
        location: "Remote • Global",
        domain: ["Artificial Intelligence"],
        technologies: ["Python", "PyTorch", "TensorFlow"],
        type: "Full time employment",
        tags: ["AI Research", "Machine Learning"],
        featured: true
    },
    {
        id: 15,
        title: "Product Manager",
        location: "Delhi, India",
        domain: ["Product"],
        technologies: [],
        type: "Full time employment",
        tags: ["Product Management", "Strategy"],
        featured: false
    },
    {
        id: 16,
        title: "Technical Recruiter",
        location: "Remote • India",
        domain: ["Human Resources"],
        technologies: [],
        type: "Full time employment",
        tags: ["Recruitment", "Talent Acquisition"],
        featured: false
    },
    {
        id: 17,
        title: "Content Marketing Specialist",
        location: "Remote",
        domain: ["Marketing"],
        technologies: ["SEO", "Google Analytics"],
        type: "Full time employment",
        tags: ["Content", "Marketing"],
        featured: false
    },
    {
        id: 18,
        title: "Cybersecurity Engineer",
        location: "Chennai, India",
        domain: ["Security", "Engineering"],
        technologies: ["SIEM", "Python"],
        type: "Full time employment",
        tags: ["Security", "Infrastructure"],
        featured: false
    },
    {
        id: 19,
        title: "QA Automation Engineer",
        location: "Ahmedabad, India",
        domain: ["Engineering"],
        technologies: ["Selenium", "Cypress"],
        type: "Full time employment",
        tags: ["QA", "Automation"],
        featured: false
    },
    {
        id: 20,
        title: "Cloud Solutions Architect",
        location: "Remote • US",
        domain: ["Cloud & Infrastructure"],
        technologies: ["AWS", "Azure"],
        type: "Full time employment",
        tags: ["Cloud", "Architecture"],
        featured: true
    },
    {
        id: 21,
        title: "Business Development Executive",
        location: "Jaipur, India",
        domain: ["Sales"],
        technologies: [],
        type: "Full time employment",
        tags: ["Sales", "Business Growth"],
        featured: false
    },
    {
        id: 22,
        title: "Customer Success Manager",
        location: "Remote",
        domain: ["Customer Experience"],
        technologies: ["CRM"],
        type: "Full time employment",
        tags: ["Customer Support", "Operations"],
        featured: false
    },
    {
        id: 23,
        title: "Graphic Designer",
        location: "Indore, India",
        domain: ["Design"],
        technologies: ["Photoshop", "Illustrator"],
        type: "Full time employment",
        tags: ["Creative", "Branding"],
        featured: false
    },
    {
        id: 24,
        title: "Blockchain Developer",
        location: "Remote • Global",
        domain: ["Engineering"],
        technologies: ["Solidity", "Web3.js"],
        type: "Full time employment",
        tags: ["Blockchain", "Web3"],
        featured: false
    },
    {
        id: 25,
        title: "HR Operations Executive",
        location: "Udaipur, India",
        domain: ["Human Resources"],
        technologies: [],
        type: "Full time employment",
        tags: ["HR", "Operations"],
        featured: false
    },
    {
        id: 26,
        title: "Intern - Software Development",
        location: "Remote • India",
        domain: ["Engineering"],
        technologies: ["JavaScript", "Git"],
        type: "Internship",
        tags: ["Internship", "Fresher Friendly"],
        featured: true
    },
    {
        id: 27,
        title: "Growth Hacker",
        location: "Remote",
        domain: ["Marketing"],
        technologies: ["SEO", "Paid Ads"],
        type: "Full time employment",
        tags: ["Growth", "Marketing"],
        featured: false
    },
    {
        id: 28,
        title: "System Administrator",
        location: "Noida, India",
        domain: ["IT Support"],
        technologies: ["Linux", "Networking"],
        type: "Full time employment",
        tags: ["IT", "Infrastructure"],
        featured: false
    },
    {
        id: 29,
        title: "Technical Support Engineer",
        location: "Remote • India",
        domain: ["Support"],
        technologies: ["Zendesk"],
        type: "Full time employment",
        tags: ["Support", "Customer Experience"],
        featured: false
    },
    {
        id: 30,
        title: "Chief Technology Officer (CTO)",
        location: "Remote • Global",
        domain: ["Leadership"],
        technologies: [],
        type: "Full time employment",
        tags: ["Executive", "Leadership"],
        featured: true
    }
];

const JobSearchSection = () => {
    const [query, setQuery] = useState("");
    const [showFilters, setShowFilters] = useState(true);
    const [sortBy, setSortBy] = useState("Relevance");

    const [isSortExpanded, setIsSortExpanded] = useState(true);
    const [isDomainExpanded, setIsDomainExpanded] = useState(true);
    const [isTypeExpanded, setIsTypeExpanded] = useState(true);
    const [isLocationExpanded, setIsLocationExpanded] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const JOBS_PER_PAGE = 10;

    // Filters State
    const [selectedDomain, setSelectedDomain] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [locationQuery, setLocationQuery] = useState("");

    // Derive filters dynamically from data
    const allDomain = useMemo(() => Array.from(new Set(JOBS_DATA.flatMap(job => job.domain).filter(Boolean))), []);
    const allTypes = useMemo(() => Array.from(new Set(JOBS_DATA.map(job => job.type).filter(Boolean))), []);

    const toggleTeam = (team: string) => {
        setSelectedDomain(prev => prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]);
        setCurrentPage(1);
    };

    const toggleType = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedDomain([]);
        setSelectedTypes([]);
        setLocationQuery("");
        setCurrentPage(1);
    };

    // Remove useEffect for pagination reset to avoid cascading renders

    // Filter Logic
    const filteredJobs = useMemo(() => {
        return JOBS_DATA.filter(job => {
            // Search Query
            if (query && !job.title.toLowerCase().includes(query.toLowerCase()) && !job.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) {
                return false;
            }
            // Domain
            if (selectedDomain.length > 0 && !selectedDomain.some(team => job.domain.includes(team))) return false;
            // Types
            if (selectedTypes.length > 0 && !selectedTypes.includes(job.type)) return false;
            // Location
            if (locationQuery && !job.location.toLowerCase().includes(locationQuery.toLowerCase())) return false;

            return true;
        });
    }, [query, selectedDomain, selectedTypes, locationQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
    const paginatedJobs = filteredJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

    const featuredJobs = paginatedJobs.filter(job => job.featured);
    const regularJobs = paginatedJobs.filter(job => !job.featured);

    const [activeTab, setActiveTab] = useState<'search' | 'ai'>('search');

    return (
        <div className="w-full bg-white pt-16 pb-24 border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* Unified Search Section */}
                <div className="w-full flex justify-center mb-16 mt-2">
                    <div className="w-full max-w-[850px] flex flex-col items-center bg-gray-50/50 rounded-[20px] p-6 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">

                        {/* Tab Switcher */}
                        <div className="flex bg-gray-100 rounded-full p-1 mb-8 w-full max-w-[400px]">
                            <button
                                onClick={() => setActiveTab('search')}
                                className={`bg-white flex-1 py-2.5 text-[14px] outline-none focus:outline-none focus:ring-0 font-semibold rounded-full transition-all ${activeTab === 'search' ? 'bg-blue-100 text-[#0122c5] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Keyword Search
                            </button>
                            <button
                                onClick={() => setActiveTab('ai')}
                                className={`bg-white flex-1 py-2.5 text-[14px] outline-none focus:outline-none focus:ring-0 font-semibold rounded-full transition-all ${activeTab === 'ai' ? 'bg-blue-100 text-[#0122c5] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                AI Resume Match
                            </button>
                        </div>

                        {/* Search Mode Content */}
                        {activeTab === 'search' ? (
                            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-2xl md:text-[28px] font-bold text-[#0122c5] mb-6 tracking-tight text-center">
                                    Search Jobiffi Careers</h2>
                                <div className="w-full max-w-[700px] relative">
                                    <input
                                        type="text"
                                        placeholder="Search by technology, team, location, or ref code"
                                        value={query}
                                        onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                                        className="text-black bg-white w-full h-[54px] pl-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 shadow-sm text-[15px] placeholder-gray-500"
                                    />
                                    <button className="bg-white absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0122c5] focus:outline-none focus:ring-0 outline-none border-none">
                                        <FiSearch size={22} />
                                    </button>
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
                                            <div className="w-full h-[50px] border border-gray-300 rounded-full flex items-center px-6 text-gray-400 text-[14px] bg-white group-hover:border-[#0122c5] transition-colors focus-within:outline-none focus-within:ring-0 shadow-sm">
                                                Choose your resume file...
                                            </div>
                                        </div>
                                        <button className="h-[50px] bg-[#0122c5] hover:bg-[#0c2445] text-white px-8 rounded-full text-[14px] font-semibold transition-colors whitespace-nowrap shadow-sm hover:shadow-md relative z-20 w-full sm:w-auto mt-2 sm:mt-0">
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
                < div id='filter-and-count' className="flex items-center justify-between py-4 border-b border-gray-200 mb-8" >
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="outline-none focus:outline-none focus:ring-0 bg-white flex items-center gap-2 text-[#0122c5] font-semibold text-[14px] hover:opacity-80 transition-opacity"
                    >
                        <FiSliders size={16} />
                        {showFilters ? 'Hide filters' : 'Show filters'}
                    </button>
                    <span className="text-[13px] text-gray-600 font-medium">{filteredJobs.length} Items</span>
                </div >

                <div className="bg-blue-50 p-5 rounded-2xl border-dotted border-2 border-gray-300 flex flex-col md:flex-row gap-10">
                    {/* Left Sidebar */}
                    {showFilters && (
                        <div className="w-full md:w-[280px] shrink-0 flex flex-col gap-4">

                            {/* Active Filters Summary */}
                            {(selectedDomain.length > 0 || selectedTypes.length > 0 || locationQuery.trim() !== "") && (
                                <div className="mb-2">
                                    <h3 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wider">Applied Filters</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDomain.map(team => (
                                            <span key={team} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0122c5]/10 text-[#0122c5] text-[12px] font-bold rounded-[6px] border border-[#0122c5]/20">
                                                {team}
                                                <button onClick={() => toggleTeam(team)} className="bg-white text-[#0122c5] hover:text-gray-600 focus:outline-none focus:ring-0 p-0 hover:bg-transparent">
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        {selectedTypes.map(type => (
                                            <span key={type} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0122c5]/10 text-[#0122c5] text-[12px] font-bold rounded-[6px] border border-[#0122c5]/20">
                                                {type}
                                                <button onClick={() => toggleType(type)} className="bg-white text-[#0122c5] hover:text-gray-600 focus:outline-none focus:ring-0 p-0 hover:bg-transparent">
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        {locationQuery.trim() !== "" && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0122c5]/10 text-[#0122c5] text-[12px] font-bold rounded-[6px] border border-[#0122c5]/20">
                                                <span className="font-normal text-gray-600">Location:</span> {locationQuery}
                                                <button onClick={() => { setLocationQuery(""); setCurrentPage(1); }} className="bg-white text-[#0122c5] hover:text-gray-600 focus:outline-none focus:ring-0 p-0 hover:bg-transparent">
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                    <hr className="border-gray-100 mt-6" />
                                </div>
                            )}

                            <div className="flex flex-col w-full">
                                {/* Sort by */}
                                <div className="py-5 border-b border-blue-100">
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
                                                    className="w-4 h-4 text-[#0122c5] border-blue-100 focus:outline-none focus:ring-0"
                                                />
                                                <span className="text-[14px] text-gray-800 font-medium group-hover:text-black">Relevance</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    checked={sortBy === 'Newest'}
                                                    onChange={() => setSortBy('Newest')}
                                                    className="w-4 h-4 text-[#0122c5] border-blue-100 focus:outline-none focus:ring-0"
                                                />
                                                <span className="text-[14px] text-gray-800 font-medium group-hover:text-black">Newest</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Domain */}
                                {allDomain.length > 0 && (
                                    <div className="py-5 border-b border-blue-100">
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
                                                            : 'font-medium border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-[#0122c5] hover:bg-white'
                                                            }`}
                                                    >
                                                        {team}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Employment type */}
                                {allTypes.length > 0 && (
                                    <div className="py-5 border-b border-blue-100">
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
                                                            className="outline-none focus:outline-none focus:ring-0 w-4 h-4 rounded-[3px] border-gray-300 text-[#0122c5]"
                                                        />
                                                        <span className="text-[13px] text-gray-700 font-medium group-hover:text-black">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Location */}
                                <div className="py-5 border-b border-blue-100">
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
                                                className="bg-white text-gray-500 w-full h-[40px] pl-9 pr-3 rounded border border-gray-300 text-[13px] focus:outline-none focus:ring-0 focus:border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 mt-4">
                                <button className="w-full py-2 bg-[#0122c5] text-white rounded-full text-[14px] font-semibold hover:bg-[#0c2445] transition-colors">
                                    Apply filters
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="w-full py-2 bg-white text-[#0122c5] border border-gray-200 rounded-full text-[14px] font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Clear filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Right Content - Jobs List */}
                    <div className="flex-1 flex flex-col gap-10">
                        {featuredJobs.length > 0 && (
                            <div>
                                <h2 className="text-[20px] text-[#0122c5] uppercase font-bold mb-6">Featured Jobs</h2>
                                <div className="flex flex-col gap-5">
                                    {featuredJobs.map(job => <JobCard key={job.id} job={job} />)}
                                </div>
                            </div>
                        )}

                        {regularJobs.length > 0 && (
                            <div>
                                <h2 className="text-[20px] text-[#0122c5] uppercase font-bold mb-6">{featuredJobs.length > 0 ? 'All Jobs' : 'Jobs'}</h2>
                                <div className="flex flex-col gap-5">
                                    {regularJobs.map(job => <JobCard key={job.id} job={job} />)}
                                </div>
                            </div>
                        )}

                        {filteredJobs.length === 0 && (
                            <div className="py-12 text-center text-gray-500">
                                No jobs found matching your criteria. Try adjusting your filters.
                            </div>
                        )}

                        {/* Pagination Footer */}
                        {filteredJobs.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-8 pt-8 text-[#0122c5]">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        document.getElementById('filter-and-count')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className={`p-0 outline-none focus:outline-none focus:ring-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'text-[#0122c5] bg-blue-50 hover:bg-[#0122c5] hover:text-white cursor-pointer'}`}>
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
                                                className={`p-0 bg-white outline-none focus:outline-none focus:ring-0 w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${currentPage === pageNum
                                                    ? 'text-[#0122c5] border border-[#0122c5]'
                                                    : 'text-gray-600 hover:bg-[#0122c5] hover:text-white'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                        document.getElementById('filter-and-count')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className={`p-0 outline-none focus:outline-none focus:ring-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'text-[#0122c5] bg-blue-50 hover:bg-[#0122c5] hover:text-white cursor-pointer'}`}>
                                    <FiChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
};

type JobType = typeof JOBS_DATA[0];

const JobCard = ({ job }: { job: JobType }) => {
    return (
        <div className="flex items-start justify-between group bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg focus-within:border-[#0122c5] focus-within:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex-1 pr-6">
                <h3 className="text-[16px] font-bold text-gray-900 mb-1 leading-tight cursor-pointer hover:underline">
                    {job.title}
                </h3>
                <div className="text-[13px] text-gray-600 mb-3 flex flex-wrap items-center gap-2">
                    <span>{job.location}</span>
                    <span className="text-gray-400 text-[10px]">•</span>
                    <span>{job.domain.join(', ')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-2.5 py-[3px] rounded-[4px] text-[11px] font-medium whitespace-nowrap">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-end justify-between self-stretch shrink-0 pl-4 gap-4">
                <button className="outline-none focus:outline-none focus:ring-0 text-gray-400 hover:text-[#0122c5] transition-colors p-2 rounded-full hover:bg-blue-50">
                    <BsBookmark size={20} />
                </button>
                <a href="#" className="inline-block bg-white text-[#0122c5] border border-[#0122c5] hover:bg-[#0122c5] hover:text-white text-[13px] font-semibold px-6 py-2 rounded-full transition-colors whitespace-nowrap shadow-sm hover:shadow-md">
                    Apply
                </a>
            </div>
        </div>
    );
};

export default JobSearchSection;
