import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiFacebook,
    FiTwitter,
    FiLinkedin,
    FiMapPin,
    FiBriefcase,
    FiClock,
    FiGlobe,
    FiCalendar,
    FiArrowLeft
} from 'react-icons/fi';
import api from '../../api/serverApi';
import toast from 'react-hot-toast';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    jobType: string;
    createdAt: string;
    domain?: string;
    refCode?: string;
    salary?: string;
}

const JobDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [uploading, setUploading] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const res = await api.get(`/jobs/${id}`);
            setJob(res.data);
        } catch (error) {
            console.error('Failed to fetch job details:', error);
            toast.error('Job not found');
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = () => {
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const submitApplication = async (e: React.FormEvent) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            toast.error('Please login to apply');
            return;
        }
        if (user.role === 'employee') {
            toast.error('Employees cannot apply for jobs');
            return;
        }

        if (!resumeFile) {
            toast.error('Please upload your resume');
            return;
        }

        setUploading(true);

        try {
            // Cloudinary Upload Configuration
            const timestamp = Math.round((new Date()).getTime() / 1000).toString();
            const apiSecret = 'bNLSA5MAAUAnxyVwF1H06IXEsPY';
            const apiKey = '562228693977864';
            const cloudName = 'drkakxopk';

            // Generate SHA-1 Signature for secure local upload
            const signatureString = `timestamp=${timestamp}${apiSecret}`;
            const encoder = new TextEncoder();
            const data = encoder.encode(signatureString);
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Upload via Cloudinary REST API
            const formData = new FormData();
            formData.append('file', resumeFile);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.error?.message || 'Failed to upload resume to Cloudinary');
            }

            const resumeUrl = uploadData.secure_url;

            await api.post(`/applications/${id}`, {
                resume: resumeUrl,
                coverLetter: 'Interested in this role'
            });

            toast.success('Successfully applied!');
            setShowForm(false);
            setResumeFile(null);
            setFileName("");
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || 'Failed to apply');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid PDF or DOC/DOCX file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size exceeds 2MB limit');
                return;
            }
            setResumeFile(file);
            setFileName(file.name);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);

        if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return 'Today';
    };

    if (loading) {
        return <div className="min-h-screen py-20 text-center text-gray-500 animate-pulse">Loading job...</div>;
    }

    if (!job) return null;

    return (
        <div className="w-full min-h-screen bg-[#f8f9fa] pt-0">
            {/* Upper Banner Section */}
            <div
                className="text-white pt-24 pb-28 px-6 relative overflow-hidden"
                style={{ background: 'radial-gradient(circle at top left, #1740b3 0%, #00146E 40%, #000A3D 70%, #000000 100%)' }}
            >
                <div className="max-w-[1200px] mx-auto relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium"
                    >
                        <FiArrowLeft size={16} /> Back to jobs
                    </button>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                        <div className="flex-1">
                            {job.domain && (
                                <span className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-[13px] font-bold uppercase tracking-wider mb-5 border border-white/30 backdrop-blur-sm">
                                    {job.domain}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold leading-tight mb-5">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[15px] font-medium text-white/90">
                                <span className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                                    <FiBriefcase size={16} /> {job.company}
                                </span>
                                <span className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                                    <FiMapPin size={16} /> {job.location}
                                </span>
                                <span className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                                    <FiClock size={16} /> {job.jobType}
                                </span>
                                <span className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                                    <FiCalendar size={16} /> Posted {formatTimeAgo(job.createdAt)}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start lg:items-end gap-4 mt-8 lg:mt-0 w-full lg:w-auto">
                            <button
                                onClick={handleApplyClick}
                                className="w-full lg:w-auto bg-white text-[#0122c5] hover:bg-gray-100 font-bold py-3.5 px-10 rounded-full transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] outline-none focus:outline-none flex justify-center items-center gap-2 text-[15px] transform hover:-translate-y-0.5 border border-white"
                            >
                                Apply Now
                            </button>
                            <div className="flex items-center justify-center lg:justify-end gap-3 text-white/90 w-full lg:w-auto mt-2">
                                <span className="text-[13px] font-medium mr-1">Share:</span>
                                <button className="p-2 border border-white/20 rounded-full hover:bg-white/20 hover:border-transparent transition-colors shadow-sm"><FiFacebook size={16} /></button>
                                <button className="p-2 border border-white/20 rounded-full hover:bg-white/20 hover:border-transparent transition-colors shadow-sm"><FiTwitter size={16} /></button>
                                <button className="p-2 border border-white/20 rounded-full hover:bg-white/20 hover:border-transparent transition-colors shadow-sm"><FiLinkedin size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative background shape */}
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-[#00d2ff]/20 to-transparent rounded-full blur-3xl opacity-40"></div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1200px] mx-auto px-6 -mt-12 relative z-20 pb-24">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Job Description & Form */}
                    <div className="flex-1 flex flex-col gap-8">
                        <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-sm border border-gray-100">
                            <h2 className="text-[22px] font-bold text-gray-900 mb-6 flex items-center gap-3">
                                Job Description
                            </h2>
                            <div className="w-12 h-1 bg-[#0122c5] mb-8 rounded-full"></div>

                            <div className="text-[15px] leading-[1.8] text-gray-600 whitespace-pre-wrap font-regular">
                                {job.description}
                            </div>
                        </div>

                        {/* Application Form Card */}
                        {showForm && (
                            <div ref={formRef} className="bg-white rounded-[20px] p-8 md:p-10 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <h2 className="text-[22px] font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
                                    Applying to {job.title}
                                </h2>
                                <form onSubmit={submitApplication} className="flex flex-col gap-6">
                                    {/* Upload Resume */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Upload Resume *</label>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex">
                                                <input type="text" className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-[14px] bg-gray-50 text-gray-500 outline-none" placeholder="Choose Resume..." value={fileName} readOnly />
                                                <label className="bg-[#0c2445] text-white px-6 py-2 rounded-r-md cursor-pointer hover:bg-[#0122c5] transition-colors text-[14px] font-semibold flex items-center justify-center whitespace-nowrap">
                                                    Choose File
                                                    <input type="file" className="hidden" accept=".doc,.docx,.pdf" required={!resumeFile} onChange={handleFileChange} />
                                                </label>
                                            </div>
                                            <p className="text-[12px] text-gray-400 mt-1">doc, docx, pdf file max size 2MB</p>
                                        </div>
                                    </div>

                                    {/* First Name */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">First Name *</label>
                                        <input type="text" required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white" placeholder="First Name*" />
                                    </div>

                                    {/* Last Name */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Last Name *</label>
                                        <input type="text" required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white" placeholder="Last Name*" />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Email *</label>
                                        <input type="email" required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white" placeholder="Email*" />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Phone Number *</label>
                                        <input type="tel" required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white" placeholder="Phone Number*" />
                                    </div>

                                    {/* Gender */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Gender *</label>
                                        <select required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white text-gray-700">
                                            <option value="">Gender*</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Total Experience */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Total Experience (in years) *</label>
                                        <select required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white text-gray-700">
                                            <option value="">Total Experience (in years)*</option>
                                            {[...Array(20)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                                            <option value="20+">20+</option>
                                        </select>
                                    </div>

                                    {/* Current Location */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Current Location *</label>
                                        <input type="text" required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white" placeholder="Current Location*" />
                                    </div>

                                    {/* Jobiffi Fulltime */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Have you worked as a full time employee with Jobiffi? *</label>
                                        <select required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white text-gray-700">
                                            <option value="">Have you worked as a full time employee with Jobiffi?*</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>

                                    {/* Highest Qualification */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Highest Qualification *</label>
                                        <select required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white text-gray-700">
                                            <option value="">Highest Qualification*</option>
                                            <option value="bachelors">Bachelor's Degree</option>
                                            <option value="masters">Master's Degree</option>
                                            <option value="phd">PhD</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Year of Passing */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pb-5">
                                        <label className="text-[14px] font-medium text-gray-700 w-full sm:w-[220px]">Year Of Passing *</label>
                                        <select required className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#0122c5] bg-gray-50 focus:bg-white text-gray-700">
                                            <option value="">Year Of Passing*</option>
                                            {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i + 2).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex justify-center mt-6">
                                        <button disabled={uploading} type="submit" className="bg-[#0c2445] hover:bg-[#0122c5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-14 rounded-md transition-colors font-semibold outline-none focus:outline-none w-auto shadow-sm tracking-wide text-[15px]">
                                            {uploading ? 'Uploading Resume & Submitting...' : 'Submit'}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Job Overview Sidebar */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 sticky top-28">
                            <h3 className="text-[20px] font-bold text-gray-900 mb-6">
                                Job Overview
                            </h3>

                            <div className="flex flex-col gap-6">
                                {job.domain && (
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-[#0122c5] flex items-center justify-center shrink-0 group-hover:bg-[#0122c5] group-hover:text-white transition-colors duration-300">
                                            <FiGlobe size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] text-gray-500 font-medium mb-1 line-height-1">Domain</p>
                                            <p className="text-[15px] text-gray-900 font-bold">{job.domain}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-[#0122c5] flex items-center justify-center shrink-0 group-hover:bg-[#0122c5] group-hover:text-white transition-colors duration-300">
                                        <FiMapPin size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 font-medium mb-1">Location</p>
                                        <p className="text-[15px] text-gray-900 font-bold">{job.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-[#0122c5] flex items-center justify-center shrink-0 group-hover:bg-[#0122c5] group-hover:text-white transition-colors duration-300">
                                        <FiBriefcase size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 font-medium mb-1">Job Title</p>
                                        <p className="text-[15px] text-gray-900 font-bold">{job.title}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-[#0122c5] flex items-center justify-center shrink-0 group-hover:bg-[#0122c5] group-hover:text-white transition-colors duration-300">
                                        <FiBriefcase size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 font-medium mb-1">Company</p>
                                        <p className="text-[15px] text-gray-900 font-bold">{job.company}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-[#0122c5] flex items-center justify-center shrink-0 group-hover:bg-[#0122c5] group-hover:text-white transition-colors duration-300">
                                        <FiClock size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 font-medium mb-1">Employment Type</p>
                                        <p className="text-[15px] text-gray-900 font-bold">{job.jobType}</p>
                                    </div>
                                </div>
                            </div>

                            {!showForm && (
                                <button
                                    onClick={handleApplyClick}
                                    className="w-full mt-10 bg-[#0122c5] hover:bg-[#0c2445] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-1 outline-none focus:outline-none flex justify-center items-center gap-2 text-[15px]"
                                >
                                    Apply For This Job
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
