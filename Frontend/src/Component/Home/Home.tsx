import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaPlay, FaPause } from 'react-icons/fa';
import outOfOfficeImage from '../../assets/outofoffice.svg';

const slides = [
    {
        id: 1,
        title: "Find Your\nDream Job",
        description: "Explore thousands of verified job opportunities tailored to your skills and experience. Whether you're a fresher, experienced professional, or student, Jobiffi helps you discover the right career path with confidence.",
        buttonText: "Browse Jobs",
        bgLight: "bg-gray-200",
        gradient: "from-[#FFE4E6] via-[#E0F2FE] to-[#D1FAE5]",
        orbs: ["bg-[#fbcfe8]", "bg-[#bbf7d0]", "bg-[#bae6fd]"]
    },
    {
        id: 2,
        title: "Build Your\nProfessional Profile",
        description: "Create a powerful profile that highlights your skills, achievements, and experience. Stand out to recruiters and increase your chances of getting shortlisted for your dream role.",
        buttonText: "Create Your Profile",
        bgLight: "bg-blue-900",
        gradient: "from-[#E0E7FF] via-[#F3E8FF] to-[#FAE8FF]",
        orbs: ["bg-[#c7d2fe]", "bg-[#e9d5ff]", "bg-[#f5d0fe]"]
    },
    {
        id: 3,
        title: "Apply Smart,\nGet Hired Faster",
        description: "Use smart filters and personalized recommendations to apply for jobs that truly match your skills. Track applications, manage interviews, and stay organized throughout your hiring journey.",
        buttonText: "Start Applying",
        bgLight: "bg-emerald-800",
        gradient: "from-[#FEF3C7] via-[#FFEDD5] to-[#FEE2E2]",
        orbs: ["bg-[#fde68a]", "bg-[#fed7aa]", "bg-[#fecaca]"]
    },
    {
        id: 4,
        title: "Grow With\nCareer Resources",
        description: "Access career tips, resume guidance, interview preparation resources, and industry insights. Jobiffi supports you beyond job search — helping you grow at every stage of your career.",
        buttonText: "Explore Resources",
        bgLight: "bg-indigo-200",
        gradient: "from-[#FCE7F3] via-[#EDE9FE] to-[#DBEAFE]",
        orbs: ["bg-[#f9a8d4]", "bg-[#c4b5fd]", "bg-[#93c5fd]"]
    }
];

const Home: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Auto-scroll the carousel every 5 seconds
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;

        if (isPlaying) {
            timer = setInterval(() => {
                nextSlide();
            }, 5000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [currentIndex, isPlaying]);

    const currentSlide = slides[currentIndex];

    const progressWidth = `${((currentIndex + 1) / slides.length) * 100}%`;

    const prevSlideData = slides[(currentIndex - 1 + slides.length) % slides.length];
    const nextSlideData = slides[(currentIndex + 1) % slides.length];

    return (
        <div className="w-full flex-1 flex flex-col bg-white overflow-hidden mt-4">
            {/* Carousel Area */}
            <div className="flex w-full items-stretch justify-center gap-4 px-4 h-[500px] md:h-[650px] mb-6">
                {/* Left Card Placeholder */}
                <div
                    onClick={prevSlide}
                    className={`hidden md:block w-12 lg:w-24 ${prevSlideData.bgLight} rounded-2xl md:rounded-3xl shrink-0 cursor-pointer transition-colors duration-500`}></div>
                {/* Main Active Card */}
                <div className={`flex-1 max-w-[1300px] bg-gradient-to-br ${currentSlide.gradient} rounded-2xl md:rounded-3xl p-8 md:p-20 flex flex-col justify-center relative overflow-hidden shadow-sm transition-all duration-700 ease-in-out`}>
                    {/* Soft glowing orbs for the mesh effect */}
                    <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[70%] ${currentSlide.orbs[0]} rounded-full mix-blend-multiply filter blur-[120px] opacity-70 transition-colors duration-700`}></div>
                    <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] ${currentSlide.orbs[1]} rounded-full mix-blend-multiply filter blur-[120px] opacity-70 transition-colors duration-700`}></div>
                    <div className={`absolute top-[20%] right-[20%] w-[40%] h-[40%] ${currentSlide.orbs[2]} rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-700`}></div>

                    <div className="relative z-10 max-w-2xl animate-fade-in" key={currentSlide.id}>
                        <h1 className="text-4xl md:text-[56px] font-semibold text-gray-900 leading-[1.1] mb-6 tracking-tight whitespace-pre-line">
                            {currentSlide.title}
                        </h1>
                        <p className="text-[16px] md:text-[18px] text-gray-700 mb-10 leading-relaxed font-medium max-w-xl">
                            {currentSlide.description}
                        </p>
                        <button className="px-6 py-2.5 rounded-full border border-blue-200 text-blue-700 font-semibold text-[15px] hover:bg-white/50 transition-colors bg-white/20 backdrop-blur-md">
                            {currentSlide.buttonText}
                        </button>
                    </div>
                </div>

                {/* Right Card Placeholder */}
                <div
                    onClick={nextSlide}
                    className={`hidden md:block w-12 lg:w-24 ${nextSlideData.bgLight} rounded-2xl md:rounded-3xl shrink-0 cursor-pointer transition-colors duration-500`}></div>
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center items-center gap-6 pb-12">
                <button
                    onClick={prevSlide}
                    className="bg-white w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm shrink-0 focus:outline-none">
                    <FiChevronLeft size={24} color="#0122c5" className="ml-[-2px] shrink-0 min-w-[24px]" />
                </button>

                <div className="flex items-center gap-4 px-5 py-2.5 rounded-full border border-gray-200 shadow-sm bg-white shrink-0">
                    <button onClick={togglePlay} className="bg-white hover:transition-opacity w-5 h-5 flex justify-center items-center shrink-0 border-none outline-none focus:outline-none">
                        {isPlaying ? (
                            <FaPause size={14} color="#0122c5" className="shrink-0 min-w-[14px]" />
                        ) : (
                            <FaPlay size={14} color="#0122c5" className="ml-[2px] shrink-0 min-w-[14px]" />
                        )}
                    </button>
                    <div className="w-32 md:w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden flex relative shrink-0">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#0122c5] rounded-full transition-all duration-300 ease-out"
                            style={{ width: progressWidth }}
                        ></div>
                    </div>
                </div>

                <button
                    onClick={nextSlide}
                    className="bg-white w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm shrink-0 focus:outline-none"
                >
                    <FiChevronRight size={24} color="#0122c5" className="mr-[-2px] shrink-0 min-w-[24px]" />
                </button>
            </div>

            {/* adding a banner */}
            <div className="w-full h-[300px] md:h-[400px] flex justify-center items-center mb-12 px-4">
                <img src={outOfOfficeImage} alt="out of office" className="h-[75%] max-w-full object-contain" />
            </div>

            {/* Intelligent Career Match Section */}
            <div className="w-full flex justify-center pb-24 mt-4 bg-white">
                <div className="w-full max-w-[850px] flex flex-col items-center px-6">
                    <h2 className="text-2xl md:text-[28px] font-bold text-[#0122c5] mb-3 tracking-tight">
                        AI-Powered Job Match
                    </h2>
                    <p className="text-[15px] md:text-[16px] text-gray-600 mb-8 text-center font-medium max-w-2xl">
                        Upload your resume and let Jobiffi connect you with the best matching opportunities.
                    </p>

                    <div className="w-full flex flex-col items-start max-w-[700px]">
                        <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4 items-stretch">
                            <div className="flex-1 relative group w-full">
                                <input
                                    type="file"
                                    title="Upload Resume"
                                    className="absolute inset-0 w-full h-full border border-gray-200 rounded-full opacity-0 cursor-pointer z-10"
                                    accept=".doc,.docx,.pdf,.txt"
                                />
                                <div className="w-full h-[46px] border border-gray-200 rounded-full flex items-center px-4 text-gray-400 text-[14px] bg-white group-hover:border-gray-300 transition-colors">
                                    Please upload file
                                </div>
                                {/* Desktop description text aligned strictly beneath the input */}
                            </div>
                            <button className="h-[46px] bg-[#0122c5] hover:bg-[#0c2445] text-white px-8 md:px-10 rounded-full text-[14px] md:text-[15px] transition-colors whitespace-nowrap w-full md:w-auto mt-2 md:mt-0 shadow-sm relative z-20">
                                Upload File
                            </button>

                        </div>
                        <p className="text-[11px] md:text-[12px] text-gray-500 mt-2 text-left hidden md:block tracking-tight">
                            For best results, upload *.doc/*.docx/*.pdf/*.txt format files only (File size should be {"<"} 2MB)
                        </p>
                        {/* Mobile description text placed beneath the whole layout stack */}
                        <p className="text-[11px] text-gray-500 mt-2 text-center w-full md:hidden tracking-tight">
                            For best results, upload *.doc/*.docx/*.pdf/*.txt format files only (File size should be {"<"} 2MB)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
