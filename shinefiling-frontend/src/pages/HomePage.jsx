import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight, Check, Play, Building, Shield, Zap, CheckCircle,
    Users, Clock, Globe, Briefcase, FileText, Layout,
    ChevronDown, Star, Award, Mail, Lock, Phone,
    TrendingUp, FileCheck, Headphones, User, Lightbulb, PenTool, MessageCircle, Plane, Link2, Camera, MoreVertical, Search
} from 'lucide-react';
import { getApprovedTestimonials } from '../api';
import AuthContext from '../context/AuthContext';
import { getDashboardPath } from '../utils/permissions';
import SEOHead from '../components/SEOHead';

import heroBg from '../assets/hero-bg-final.png';
import servicesBg from '../assets/services-bg.png';
import HeroAnimation from '../components/HeroAnimation';

import heroBgReal from '../assets/hero-bg-office.png'; // Updated Background Image
import heroBgProfessional from '../assets/hero-bg-professional.png';
import ProfessionalBackground from '../components/ProfessionalBackground';
import HeroIsometricBackground from '../components/HeroIsometricBackground';
import FloatingIconsAnimation from '../components/FloatingIconsAnimation';
import Marquee from '../components/Marquee';
import AnimatedCounter from '../components/AnimatedCounter';
import { SERVICE_DATA } from '../data/services';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
};

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getApprovedTestimonials();
                if (data && Array.isArray(data)) {
                    setTestimonials(data.slice(0, 6)); // Show max 6 testimonials
                }
            } catch (error) {
                console.warn('Error fetching testimonials:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (loading) return null;

    // Don't render static data - hide section if no real data
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="py-24 px-6 lg:px-12 bg-white">
            <div className="max-w-[1400px] mx-auto">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-navy">Testimonials</h2>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {testimonials.map((t, i) => (
                        <motion.div key={i} variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-shadow text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-[#F0FBFA] px-3 py-1 rounded-bl-xl border-l border-b border-slate-100 flex items-center gap-1">
                                <CheckCircle size={12} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Verified Client</span>
                            </div>
                            <div className="flex items-center gap-4 mb-6 mt-2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ED6E3F] to-[#F9A65E] flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {t.customerName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#043E52] text-sm">{t.customerName || 'Anonymous'}</h4>
                                    <p className="text-[10px] text-[#3D4D55] uppercase tracking-wider">{t.serviceName || 'Customer'}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm italic leading-relaxed mb-6">"{t.feedback}"</p>
                            <div className="flex justify-between items-center">
                                <div className="flex text-[#F9A65E]">
                                    {[...Array(t.rating || 5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">Order Completed</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};



const LandingPage = ({ isLoggedIn }) => {
    const { user } = React.useContext(AuthContext);
    const [isMobile, setIsMobile] = useState(false);

    const [activeFaq, setActiveFaq] = useState(0);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Flatten all services for search
    const allServices = Object.values(SERVICE_DATA).flatMap(category => category.items);

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 1) {
            const filtered = allServices.filter(service =>
                service.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5); // Limit to top 5 results
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const getServiceSlug = (name) => {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const map = {
            "privatelimitedcompanyregistration": "private-limited-company",
            "onepersoncompanyopc": "one-person-company",
            "limitedliabilitypartnershipllp": "llp-registration",
            "partnershipfirmregistration": "partnership-firm",
            "soleproprietorshipregistration": "sole-proprietorship",
            "section8ngocompany": "section-8-company",
            "nidhicompanyregistration": "nidhi-company-registration",
            "producercompanyregistration": "producer-company-registration",
            "publiclimitedcompany": "public-limited-company",
            "rentagreement": "rent-agreement",

            // Tax & Compliance
            "gstregistration": "tax-compliance/gst-registration",
            "gstmonthlyreturngstr13b": "tax-compliance/gst-monthly-return",
            "gstannualreturngstr9": "tax-compliance/gst-annual-return",
            "incometaxreturnitr17": "tax-compliance/income-tax-return",
            "tdsreturnfiling": "tax-compliance/tds-return-filing",
            "professionaltaxregfiling": "tax-compliance/professional-tax",
            "advancetaxfiling": "tax-compliance/advance-tax",
            "taxauditfiling": "tax-compliance/tax-audit",
        };
        return map[normalize(name)];
    };

    const handleSearch = (term) => {
        const query = term || searchQuery;
        if (query.trim()) {
            setSuggestions([]); // Clear suggestions on search

            // Try to find a direct match for navigation
            const slug = getServiceSlug(query);

            if (slug) {
                navigate(`/services/${slug}`);
            } else {
                // Check if it exactly matches a service name in our data even if we don't have a specific slug map for it (fallback to generic apply)
                const isExactMatch = allServices.find(s => s.toLowerCase() === query.toLowerCase());
                if (isExactMatch && !slug) {
                    navigate(`/services/apply?name=${encodeURIComponent(query)}`);
                } else {
                    navigate(`/services?search=${encodeURIComponent(query)}`);
                }
            }
        }
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- Data: Matched to User's "Services Grid" Image ---
    const premiumServices = [
        { title: 'Private Limited Company', icon: Building, desc: 'Registration & Incorporation' },
        { title: 'LLP Registration', icon: Users, desc: 'Limited Liability Partnership' },
        { title: 'One Person Company', icon: User, desc: 'Single Owner Registration' },
        { title: 'Partnership Firm', icon: Briefcase, desc: 'Register your Partnership' },

        { title: 'GST Registration', icon: FileText, desc: 'Get your GSTIN Number' },
        { title: 'Income Tax Filing', icon: Layout, desc: 'Expert ITR Filing Services' },
        { title: 'GST Filing', icon: FileCheck, desc: 'Monthly/Quarterly Returns' },
        { title: 'TDS Compliance', icon: Zap, desc: 'TDS Return Filing' },

        { title: 'Trademark Filing', icon: Shield, desc: 'Protect your Brand Name' },
        { title: 'Copyright Registration', icon: FileCheck, desc: 'Protect your Creative Work' },
        { title: 'Patent Filing', icon: Lightbulb, desc: 'Protect your Inventions' },
        { title: 'Design Registration', icon: PenTool, desc: 'Protect Industrial Designs' },
    ];

    const faqs = [
        { q: 'How long does company registration take?', a: 'Typically 7-10 working days, depending on government processing times. Our team ensures the fastest turnaround possible.' },
        { q: 'Do I need to visit your office physically?', a: 'No. The entire process is 100% digital. You can upload documents securely via our dashboard.' },
        { q: 'What documents are required for Pvt Ltd?', a: 'You need PAN, Aadhaar, Bank Statement, and a registered office address proof (Electricity Bill/NOC).' },
        { q: 'Is my data secure with ShineFiling?', a: 'Absolutely. We use bank-grade encryption and strict data privacy protocols to ensure your information is safe.' }
    ];

    return (
        <div className="font-sans text-navy bg-white selection:bg-bronze/30 selection:text-navy overflow-x-hidden">
            <SEOHead
                title="ShineFiling - Hire Verified CA Freelancers & Expert Tax Consultants"
                description="India's leading marketplace to hire CA freelancers online. Expert services for GST registration, ITR filing, company incorporation, and legal compliance across India."
                keywords="CA freelancer India, hire CA online, GST registration India, ITR filing online, company registration India, chartered accountant freelancer, tax consultant India, best CA platform India, online accounting services, startup compliance India"
            />
            {/* --- HERO SECTION (Refined Design) --- */}
            <section className="relative w-full min-h-[90vh] flex items-center pt-24 pb-32 lg:pt-32 lg:pb-40 bg-slate-50">

                {/* --- 1. Background Effects (Gradients & Glows) --- */}
                {/* --- 1. Background Effects (Image Based) --- */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                        src={heroBgReal}
                        alt="Background"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Dark Overlay for text readability */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                {/* Dynamic Floating Icons */}
                <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
                    <FloatingIconsAnimation />
                </div>

                <div className="container mx-auto px-4 relative z-50 flex flex-col justify-center h-full pt-12 pointer-events-none">
                    {/* Text Content Area (Centered) */}
                    <div className="w-full flex flex-col items-center text-center mb-20 pointer-events-auto">

                        {/* --- 2. Top Badge --- */}


                        {/* --- 3. Main Headline --- */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2] mb-6 tracking-tight max-w-5xl"
                        >
                            Connect with India’s Most Trusted Network of <br />
                            <span className="text-[#F9A65E]">Elite Freelance CAs & Financial Experts</span>
                        </motion.h1>

                        {/* --- 4. Subtext --- */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-2xl mx-auto text-base text-slate-100 mb-10 leading-relaxed"
                        >
                            Hire specialized top-tier Chartered Accountants and financial experts on-demand. From company formation to complex tax audits, access premium professional services through our secure freelance marketplace.
                        </motion.p>

                        {/* --- NEW: Hero Search & CTA Row --- */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="max-w-2xl mx-auto mb-20 relative z-30 w-full"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                {/* Search Bar */}
                                <div className="w-full relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#043E52] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search for any service..."
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                                        onFocus={() => { if (searchQuery) handleInputChange({ target: { value: searchQuery } }) }}
                                        className="block w-full pl-14 pr-32 py-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-full text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-[#ED6E3F]/10 transition-all shadow-xl font-medium"
                                    />
                                    <div className="absolute inset-y-1.5 right-1.5">
                                        <button
                                            onClick={() => handleSearch(searchQuery)}
                                            className="h-full px-6 bg-[#043E52] hover:bg-[#032d3c] text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 shadow-lg active:scale-95"
                                        >
                                            Search
                                        </button>
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    <AnimatePresence>
                                        {suggestions.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-[300px] overflow-y-auto"
                                            >
                                                {suggestions.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            setSearchQuery(item);
                                                            handleSearch(item);
                                                        }}
                                                        className="px-6 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0 text-left"
                                                    >
                                                        <Search size={14} className="text-slate-400" />
                                                        <span className="text-sm font-medium text-slate-700">{item}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* CTA Button */}
                                <div className="w-auto shrink-0">
                                    <button
                                        onClick={() => {
                                            if (isLoggedIn) {
                                                navigate(getDashboardPath(user?.role));
                                            } else {
                                                navigate('/?login=true');
                                            }
                                        }}

                                        className="w-auto h-10 md:h-[48px] px-6 md:px-8 bg-[#ED6E3F] text-white rounded-full font-bold text-xs shadow-xl hover:bg-[#F9A65E] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        Get Started
                                        <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                                            <ArrowRight size={14} className="text-white" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div> {/* End Text Column */}
                </div>
            </section>

            {/* --- NEW SECTION: 3D Mockups --- */}
            <section className="py-4 bg-transparent relative z-40 -mt-12 md:-mt-48 pb-20 md:pb-4">
                <div className="container mx-auto px-4">
                    {/* --- 6. 3D Mockup Container with Scroll Animation --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative w-full max-w-[1200px] h-[550px] md:h-[600px] mx-auto perspective-[2500px] flex justify-center items-start md:items-center"
                    >
                        {/* --- A. Center Phone (The Hero) --- */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-50"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="relative z-30 w-[280px] sm:w-[300px] md:w-[320px] h-[580px] sm:h-[620px] md:h-[640px] bg-white rounded-[40px] border-[8px] md:border-[10px] border-[#043E52] shadow-2xl overflow-hidden ring-1 ring-black/5 mx-auto"
                            >
                                {/* Phone Notch/Status Bar */}
                                <div className="h-14 bg-white flex items-center justify-between px-6 pt-2 border-b border-slate-50">
                                    <span className="text-xs font-bold text-slate-900">9:41</span>
                                    <div className="w-20 h-5 bg-slate-900 rounded-full absolute left-1/2 -translate-x-1/2 top-3"></div>
                                    <div className="flex gap-1">
                                        <div className="w-4 h-3 border border-slate-800 rounded-sm"></div>
                                    </div>
                                </div>

                                {/* App Header */}
                                <div className="px-4 pb-4 pt-2 bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-[#043E52]">ShineFiling</h2>
                                        <div className="flex gap-3 text-[#ED6E3F]">
                                            <TrendingUp size={20} />
                                            <MoreVertical size={20} />
                                        </div>
                                    </div>
                                    {/* Search Input Mock */}
                                    <div className="w-full h-10 bg-slate-100 rounded-lg flex items-center px-4 gap-2 text-slate-400">
                                        <div className="w-5 h-5 rounded-full border-2 border-[#043E52]/50 flex items-center justify-center">
                                            <div className="w-full h-full bg-[#043E52] rounded-full opacity-50"></div>
                                        </div>
                                        <span className="text-sm">Search your filings...</span>
                                    </div>
                                </div>

                                {/* Service Status List - Scrollable on Mobile */}
                                <div className="flex flex-col h-[400px] overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-white to-transparent z-10"></div>

                                    {/* Item 1 (Pvt Ltd) */}
                                    <div className="flex items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50/50">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-[#ED6E3F]">
                                            <Building size={24} />
                                        </div>
                                        <div className="ml-3 flex-1 pb-1">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-slate-900 text-sm">Pvt Ltd Registration</h3>
                                                <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded">STEP 3/4</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 truncate">Document Verification in Progress</p>
                                        </div>
                                    </div>

                                    {/* Item 2 (GST) */}
                                    <div className="flex items-center p-4 bg-[#F0FBFA] hover:bg-emerald-50 transition-colors cursor-pointer border-b border-slate-50/50">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <FileText size={24} />
                                        </div>
                                        <div className="ml-3 flex-1 pb-1">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-slate-900 text-sm">GST Monthly Return</h3>
                                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">FILED</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 truncate">ACK: 882910JQ • Oct 2024</p>
                                        </div>
                                    </div>

                                    {/* Item 3 (Trademark) */}
                                    <div className="flex items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50/50">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Shield size={24} />
                                        </div>
                                        <div className="ml-3 flex-1 pb-1">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-slate-900 text-sm">Trademark Search</h3>
                                                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">READY</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 truncate">Class 42 • Software Services</p>
                                        </div>
                                    </div>

                                    {/* Item 4 (Income Tax) */}
                                    <div className="flex items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                            <TrendingUp size={24} />
                                        </div>
                                        <div className="ml-3 flex-1 pb-1">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-slate-900 text-sm">Income Tax Filing</h3>
                                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">PENDING</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 truncate">Expert CA assigned to your file</p>
                                        </div>
                                    </div>

                                    {/* Floating Action Button (Mobile Feel) */}
                                    <div className="absolute bottom-6 right-6 w-12 h-12 bg-[#ED6E3F] rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center text-white">
                                        <MessageCircle size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* --- B. Left Card (Discount) - Hidden on Mobile --- */}
                        <motion.div
                            initial={{ x: -100, opacity: 0, rotateY: 20 }}
                            animate={{ x: 0, opacity: 1, rotateY: 12, rotateZ: -6 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="hidden lg:block absolute left-[8%] top-10 w-[280px] h-[480px] bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 z-40 transform-style-3d origin-right"
                        >
                            {/* Speech Bubble Tail */}
                            <div className="absolute -top-12 -left-8 bg-white p-3 rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl shadow-lg border border-slate-100 flex items-center justify-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            </div>

                            {/* Connection Line/Icon */}
                            <div className="absolute -right-6 top-1/2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-blue-500 z-30">
                                <Link2 size={20} />
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">N</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900">TechNova Solutions</h4>
                                    <span className="text-[10px] text-slate-400">Application SF-882</span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                                Your Pvt Ltd Incorporation application has been successfully verified. <span className="font-bold text-[#043E52]">Final Certificate</span> is ready for download.
                            </p>

                            {/* Added Timeline to fill space */}
                            <div className="space-y-3 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800">
                                    <TrendingUp size={14} className="text-emerald-500" />
                                    FILING TIMELINE
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-slate-500">DIN & DSC Approval</span>
                                        <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={10} /> COMPLETED</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-slate-500">Name Reservation (RUN)</span>
                                        <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={10} /> COMPLETED</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-slate-500">MCA Form Submission</span>
                                        <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={10} /> COMPLETED</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-3 border border-emerald-100 mb-4">
                                <div>
                                    <p className="text-[10px] text-emerald-600 uppercase font-bold mb-0.5">Registration Status</p>
                                    <p className="text-lg font-bold text-[#043E52]">ACTIVE</p>
                                </div>
                                <Shield size={24} className="text-emerald-600 opacity-20" />
                            </div>

                            <button className="w-full py-2 rounded-lg bg-[#ED6E3F] text-white text-sm font-bold hover:bg-[#F9A65E] transition-colors">
                                Download Certificate
                            </button>
                        </motion.div>

                        {/* --- C. Right Card (Travel) - Hidden on Mobile --- */}
                        <motion.div
                            initial={{ x: 100, opacity: 0, rotateY: -20 }}
                            animate={{ x: 0, opacity: 1, rotateY: -12, rotateZ: 6 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="hidden lg:block absolute right-[8%] top-10 w-[280px] h-[480px] bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 z-40 transform-style-3d origin-left"
                        >
                            {/* Speech Bubble Tail (Right) */}
                            <div className="absolute -top-10 -right-8 bg-white p-3 rounded-tr-3xl rounded-tl-3xl rounded-br-3xl shadow-lg border border-slate-100 flex items-center justify-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            </div>

                            {/* Connection Line/Icon */}
                            <div className="absolute -left-6 top-1/2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 z-30">
                                <Plane size={20} />
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">GST</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900">GST Compliance</h4>
                                    <span className="text-[10px] text-slate-400">Due in 3 days</span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 mb-4">
                                Q3 GST Returns are pending. Complete your filing to avoid late penalties and maintain your compliance score.
                            </p>

                            {/* Added Deadlines to fill space */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800 mb-1">
                                    <Clock size={14} className="text-orange-500" />
                                    UPCOMING DEADLINES
                                </div>
                                <div className="bg-orange-50 rounded-lg p-2 flex justify-between items-center text-[10px] border border-orange-100">
                                    <span className="font-bold text-slate-700">GSTR-1 (Monthly)</span>
                                    <span className="text-orange-600 font-bold">11 OCT</span>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2 flex justify-between items-center text-[10px] border border-slate-100">
                                    <span className="font-bold text-slate-700">GSTR-3B (Filing)</span>
                                    <span className="text-slate-500 font-bold">20 OCT</span>
                                </div>
                            </div>

                            {/* Image Card */}
                            <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 group">
                                <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Compliance" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                                    <span className="text-white font-bold text-sm">Tax Compliance</span>
                                    <span className="text-white/80 text-[10px]">Financial Year 2024-25</span>
                                </div>
                            </div>

                            <button className="w-full py-2 rounded-lg border border-[#ED6E3F] text-[#ED6E3F] text-sm font-bold hover:bg-[#ED6E3F] hover:text-white transition-all">
                                File Return Now
                            </button>
                        </motion.div>

                    </motion.div>
                </div>
            </section>


            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="bg-white border-y border-slate-100 py-6 relative z-30 mt-12 md:mt-20"
            >
                <div className="max-w-[1400px] mx-auto px-6 text-center overflow-hidden">
                    <Marquee speed={40}>
                        <div className="flex items-center gap-16 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">

                            {/* Startup India */}
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <Award className="text-[#ED6E3F]" size={28} />
                                <span className="text-sm md:text-xl font-bold text-[#043E52]">Startup India</span>
                            </div>

                            {/* Digital India */}
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <Globe className="text-[#ED6E3F]" size={28} />
                                <span className="text-sm md:text-xl font-bold text-slate-700">Digital India</span>
                            </div>

                            {/* MCA */}
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <Building className="text-[#043E52]" size={28} />
                                <span className="text-sm md:text-xl font-bold text-[#043E52]">MCA Govt</span>
                            </div>

                            {/* MSME */}
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <Briefcase className="text-[#F9A65E]" size={28} />
                                <span className="text-sm md:text-xl font-bold text-[#043E52]">MSME</span>
                            </div>

                            {/* ISO */}
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <Shield className="text-[#043E52]" size={28} />
                                <span className="text-sm md:text-xl font-bold text-[#043E52]">ISO 9001:2015</span>
                            </div>

                        </div>
                    </Marquee>
                </div>
            </motion.div>

            {/* --- SECTION 1: SERVICES GRID (Matched to Image) --- */}
            <section className="py-24 px-6 lg:px-12 relative overflow-hidden bg-slate-50">
                {!isMobile && <FloatingIconsAnimation />}
                <div className="absolute inset-0 z-0">
                    <img src={servicesBg} alt="Services Background" className="w-full h-full object-cover opacity-10" />
                </div>
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-12 text-center"
                    >
                        <span className="text-[#ED6E3F] font-bold tracking-widest uppercase text-xs">OUR SOLUTIONS</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#043E52] mt-2">Services We Offer</h2>
                        <div className="h-1 w-20 bg-[#ED6E3F] mx-auto mt-4 rounded-full"></div>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {premiumServices.map((svc, i) => (
                            <motion.div key={i} variants={fadeInUp}>
                                <Link
                                    to={`/services/${svc.title.toLowerCase().replace(/ /g, '-')}`}
                                    className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(237,110,63,0.15)] transition-all duration-300 flex flex-col items-center text-center h-full hover:-translate-y-2 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ED6E3F] to-[#F9A65E] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-[#FFF5F1] text-[#ED6E3F] flex items-center justify-center mb-6 group-hover:bg-[#ED6E3F] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-orange-200">
                                        <svc.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#043E52] mb-2 leading-tight group-hover:text-[#ED6E3F] transition-colors">{svc.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{svc.desc}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 2: SIMPLIFYING COMPLIANCE (Beige Split Section) --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 min-h-[500px]">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-[#043E52] p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1"
                    >
                        <span className="text-[#F9A65E] font-bold uppercase tracking-widest text-xs mb-4">OUR PHILOSOPHY</span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Access Elite Professional <br /> Expertise On-Demand
                        </h2>
                        <p className="text-slate-100 text-lg leading-relaxed mb-8">
                            ShineFiling is India's premier gateway to specialized freelance CAs and financial architects. We connect your business with the right experts for company incorporation, annual audits, and strategic trademark protection. Stop managing compliance alone—hire a professional who understands your industry.
                        </p>
                        <Link to="/about-us" className="inline-flex items-center gap-2 text-white font-bold hover:text-[#F9A65E] transition-colors uppercase tracking-widest text-sm self-start border-b-2 border-white/30 hover:border-[#F9A65E] pb-1">
                            EXPLORE OUR EXPERTISE <ArrowRight size={16} />
                        </Link>
                    </motion.div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative order-1 lg:order-2 h-[300px] lg:h-auto"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600"
                            alt="Indian Boardroom Meeting"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 2.5: GST COMPLIANCE FOCUS --- */}
            <section className="py-24 px-6 lg:px-12 bg-slate-50 relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#ED6E3F] font-bold tracking-widest uppercase text-xs mb-4 block">TAXATION SERVICES</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-[#043E52] mb-8 leading-tight">
                            Expert GST Freelancers <br />
                            <span className="text-[#043E52]">& Professional Tax Advisory</span>
                        </h2>
                        <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                            Navigate the complex world of GST with India's most trusted freelance tax professionals. Our platform connects you with experts who ensure 100% accuracy in filings while maximizing your Input Tax Credit (ITC) through personalized advisory.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-8 mb-10">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-[#ED6E3F]">
                                    <FileCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#043E52] mb-1">GSTR-1 & 3B Filing</h4>
                                    <p className="text-sm text-slate-500">Accurate monthly & quarterly return filing by experts.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-[#043E52]">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#043E52] mb-1">ITC Reconciliation</h4>
                                    <p className="text-sm text-slate-500">Match your purchases with 2A/2B to claim full credits.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#043E52] mb-1">E-Invoicing</h4>
                                    <p className="text-sm text-slate-500">Generate IRN and E-Way bills in seconds.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#043E52] mb-1">GST Audit & Annual</h4>
                                    <p className="text-sm text-slate-500">Comprehensive support for GSTR-9 and 9C filings.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/services/gst-filing" className="px-10 py-4 bg-[#043E52] text-white font-bold rounded-full hover:bg-[#043E52] transition-all shadow-lg hover:shadow-[#043E52]/20 inline-flex items-center gap-2">
                            Check GST Status <ArrowRight size={20} />
                        </Link>
                    </motion.div>

                    {/* Right: Modern Visual/Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#ED6E3F]/10 to-[#043E52]/10 rounded-[40px] blur-2xl"></div>
                        <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white">
                            <img
                                src="/taxation-service.png"
                                alt="Tax professional compliance dashboard"
                                className="w-full h-[350px] md:h-[500px] lg:h-[600px] object-cover"
                            />
                            {/* Floating Floating Stat Badge */}
                            <div className="absolute top-12 left-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Returns Filed</p>
                                        <h4 className="text-2xl font-bold text-[#043E52]">1.2M+</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* --- SECTION 3: WHY CHOOSE US --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-navy">Why Choose Us</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    >
                        {[
                            { icon: Clock, title: "SPEED", desc: "Fast & Efficient Filing" },
                            { icon: Shield, title: "SECURITY", desc: "Secure Data & Compliance" },
                            { icon: Award, title: "EXPERT SUPPORT", desc: "Dedicated Professional Team" },
                            { icon: Globe, title: "DIGITAL FIRST", desc: "Seamless Online Platform" }
                        ].map((item, i) => (
                            <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center group">
                                <div className="w-20 h-20 mb-6 relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[#ED6E3F]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    <item.icon size={48} strokeWidth={1} className="text-[#ED6E3F] relative z-10" />
                                </div>
                                <h4 className="text-lg font-bold text-[#043E52] mb-2 uppercase tracking-wide">{item.title}</h4>
                                <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 3: PROCESS TIMELINE (Matched to Image) --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-navy">Process Timeline</h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="hidden lg:block absolute top-[50px] left-[15%] right-[15%] h-px bg-[#ED6E3F]/30 z-0 origin-left"
                        ></motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
                        >
                            {[
                                { title: 'Consultation', desc: 'Details and document analysis with our experts.', icon: Users, step: 'STEP 1' },
                                { title: 'Document Submission', desc: 'Securely document upload on dashboard.', icon: FileText, step: 'STEP 2' },
                                { title: 'Verification & Filing', desc: 'Our experts verify & file your application.', icon: Shield, step: 'STEP 3' },
                                { title: 'Completion & Handover', desc: 'Receive your license & start business.', icon: Check, step: 'STEP 4' }
                            ].map((step, i) => (
                                <motion.div key={i} variants={scaleIn} className="flex flex-col items-center text-center group">
                                    <div className="w-24 h-24 rounded-full bg-[#ED6E3F] border-4 border-white shadow-xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-all duration-300 relative z-10">
                                        <step.icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-xs font-bold text-[#043E52] uppercase tracking-widest mb-1">{step.step}</span>
                                    <h3 className="text-lg font-bold text-[#043E52] mb-2">{step.title}</h3>
                                    <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: STATS BAR (Dark Band) --- */}
            <section className="py-16 px-6 lg:px-12 bg-[#043E52] text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#043E52] via-transparent to-transparent"></div>

                <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-0 text-center md:divide-x divide-white/10 relative z-10">
                    {[
                        { val: 50, suffix: "+", label: "Legal Services" },
                        { val: 100, suffix: "%", label: "Digital Process" },
                        { val: 24, suffix: "/7", label: "Expert Support" },
                        { val: 0, suffix: "", label: "Hidden Charges" } // 0 doesn't need animation really but consistent
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="px-0 md:px-4"
                        >
                            <h4 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F9A65E] mb-2 font-display flex justify-center items-baseline gap-1">
                                <AnimatedCounter from={0} to={stat.val} duration={2} />
                                <span>{stat.suffix}</span>
                            </h4>
                            <p className="text-sm text-slate-400 uppercase tracking-widest font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- SECTION 5: TESTIMONIALS (Clean Cards) --- */}
            <TestimonialsSection />

            {/* --- SECTION 6: FAQ (Simple List) --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1000px] mx-auto text-center">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <h2 className="text-3xl font-bold text-navy">FAQ</h2>
                        <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest">Frequently Asked Questions</p>
                    </motion.div>

                    <div className="space-y-2 text-left">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="border-b border-slate-100"
                            >
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex justify-between items-center py-5 focus:outline-none group"
                                >
                                    <span className={`text-base font-bold transition-colors ${activeFaq === i ? 'text-[#ED6E3F]' : 'text-[#043E52] group-hover:text-[#ED6E3F]'}`}>{faq.q}</span>
                                    <ChevronDown size={18} className={`transform transition-transform text-slate-400 ${activeFaq === i ? 'rotate-180 text-[#ED6E3F]' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                            <p className="text-slate-500 pb-5 text-sm leading-relaxed max-w-3xl">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 7: FEATURED ARTICLES & INSIGHTS --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto">

                    {/* Featured Article 1 (Text Left, Image Right)
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid lg:grid-cols-2 gap-12 items-center mb-24"
                    >
                        <div>
                            <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">BLOG NEWS</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">Understanding the Junior Governance Business</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                A brief blog news post displayed personally served as writing assessment. However, we're dedicated to customer success.
                            </p>
                            <Link to="/blog/1" className="px-8 py-3 bg-[#ED6E3F] text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-[#a37853] transition-colors inline-block">
                                READ FULL
                            </Link>
                        </div>
                        <div className="rounded-2xl overflow-hidden h-[300px] lg:h-[350px]">
                            <img src="https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&q=80&w=1600" alt="Business Handshake" className="w-full h-full object-cover" />
                        </div>
                    </motion.div>
                    */}

                    {/* Featured Article 2 (Image Left, Text Right)
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid lg:grid-cols-2 gap-12 items-center mb-24"
                    >
                        <div className="rounded-2xl overflow-hidden h-[300px] lg:h-[350px] order-2 lg:order-1">
                            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600" alt="Business Discussion" className="w-full h-full object-cover" />
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">LATEST INSIGHTS</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">Understanding Floor Area: The Invoice for Business</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                A brief blog news post displayed personally served as writing assessment. However, we're dedicated to customer success.
                            </p>
                            <Link to="/blog/2" className="px-8 py-3 bg-[#ED6E3F] text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-[#a37853] transition-colors inline-block">
                                READ FULL
                            </Link>
                        </div>
                    </motion.div>
                    */}

                    {/* Latest Insights 3-Column Grid
                    <div className="mb-12">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-8">
                            <h2 className="text-3xl font-bold text-navy">Latest Insights</h2>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {[
                                { date: "12 Oct", title: "Understanding Section 80C Filing & Tax", img: "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&q=80&w=600" },
                                { date: "15 Oct", title: "Understanding the New GST Returns 2.0", img: "https://images.unsplash.com/photo-1554224155-9ffd4cf44310?auto=format&fit=crop&q=80&w=600" },
                                { date: "18 Oct", title: "Understanding Section 144 IPC Rules Law", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600" }
                            ].map((post, i) => (
                                <motion.div key={i} variants={fadeInUp} className="group cursor-pointer">
                                    <div className="rounded-xl overflow-hidden h-60 mb-6">
                                        <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2 font-medium">{post.date}</p>
                                    <h3 className="text-xl font-bold text-navy leading-tight mb-4 group-hover:text-bronze transition-colors pr-4">{post.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                        Understanding tax laws can be complex, but essential for your business health. Read more to ensure compliance.
                                    </p>
                                    <button className="text-bronze font-bold text-sm uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read More <ArrowRight size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                    */}

                </div>
            </section>
            {/* --- FINAL CTA --- */}
            <section className="py-24 px-6 lg:px-12 bg-[#043E52] relative overflow-hidden" >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Launch Your Business?</h2>
                    <p className="text-xl text-slate-300 mb-10 font-light">Join thousands of Indian entrepreneurs who trust ShineFiling.</p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => {
                                if (isLoggedIn) {
                                    navigate('/dashboard');
                                } else {
                                    navigate('/?login=true');
                                }
                            }}
                            className="px-12 py-5 bg-[#ED6E3F] text-white font-bold rounded-full text-lg shadow-2xl hover:bg-[#F9A65E] transition-all hover:-translate-y-1 block sm:inline-block w-full sm:w-auto"
                        >
                            Get Started Now
                        </button>
                        <Link to="/contact-us" className="px-12 py-5 bg-transparent border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/10 transition-all">
                            Talk to an Expert
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div >
    );
};

export default LandingPage;
