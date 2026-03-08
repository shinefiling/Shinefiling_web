import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getDashboardPath } from '../utils/permissions';
import { ChevronDown, Menu, X, Search, User, Bell, LogOut, ArrowRight, FileText, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICE_DATA } from '../data/services';
import { getNotifications, getServiceCatalog } from '../api';
import { getInactiveServices } from '../utils/serviceManager';
import AuthModal from './auth/AuthModal';

const Navbar = ({ isLoggedIn, onLogout, onLogin, user }) => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMobileCat, setExpandedMobileCat] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);
    const notificationRef = useRef(null); // Added Ref
    const [showNotifications, setShowNotifications] = useState(false); // Added State
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeCategory, setActiveCategory] = useState('BUSINESS & TAX');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const navigate = useNavigate();

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        if (searchParams.get('login') === 'true') {
            setShowAuthModal(true);
            setAuthMode('login');

            // Clean URL
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('login');
            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        if (!isLoggedIn || !user) return;

        let interval;
        const fetchNotes = async () => {
            try {
                const data = await getNotifications(user.email);
                if (Array.isArray(data)) {
                    setNotifications(data);
                    setNotificationCount(data.filter(n => !n.isRead && !n.read).length);
                }
            } catch (e) { }
        };

        fetchNotes();
        interval = setInterval(fetchNotes, 10000);
        return () => clearInterval(interval);
    }, [isLoggedIn, user]);

    // Service Filtering Logic
    const [inactiveList, setInactiveList] = useState([]);
    const [apiCatalog, setApiCatalog] = useState([]);

    useEffect(() => {
        // Initial Fetch
        const fetchCatalog = async () => {
            try {
                const catalog = await getServiceCatalog();
                if (Array.isArray(catalog)) setApiCatalog(catalog);
                setInactiveList(getInactiveServices());
            } catch (err) {
                console.warn("[Navbar] Failed to fetch service catalog:", err);
            }
        };
        fetchCatalog();

        const handleStatusChange = () => setInactiveList(getInactiveServices());
        window.addEventListener('serviceStatusChanged', handleStatusChange);
        return () => window.removeEventListener('serviceStatusChanged', handleStatusChange);
    }, []);

    const isServiceActive = (serviceName) => {
        const apiService = apiCatalog.find(s => s.name === serviceName);
        if (apiService && apiService.status === 'INACTIVE') return false;
        if (inactiveList.includes(serviceName)) return false;
        return true;
    };

    const navGroups = [
        { label: 'BUSINESS & TAX', keys: ['business_reg', 'tax_compliance'] },
        { label: 'ROC & LICENSES', keys: ['roc_compliance', 'licenses'] },
        { label: 'TRADEMARK & HR', keys: ['ipr', 'labour_hr'] },
        { label: 'CERTS & DRAFTING', keys: ['certifications', 'legal'] },
        { label: 'NOTICES & FINANCE', keys: ['legal_notices', 'financial'] },
        { label: 'CORRECTIONS & CLOSURE', keys: ['corrections', 'closure'] }
    ];

    const categories = [
        'business_reg', 'tax_compliance', 'roc_compliance', 'licenses',
        'ipr', 'labour_hr', 'certifications', 'legal',
        'legal_notices', 'corrections', 'closure', 'financial'
    ];

    const navLabels = {
        business_reg: 'BUSINESS REG',
        tax_compliance: 'TAX & GST',
        roc_compliance: 'ROC COMPLIANCE',
        licenses: 'LICENSES',
        ipr: 'TRADEMARK',
        labour_hr: 'LABOUR/HR',
        certifications: 'CERTIFICATES',
        legal: 'DRAFTING',
        financial: 'FINANCE',
        legal_notices: 'NOTICES',
        corrections: 'CORRECTIONS',
        closure: 'CLOSURE',
        storage: 'DIGILOCKER'
    };

    const getServiceSlug = (name) => {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const map = {
            "privatelimitedcompanyregistration": "private-limited-company",
            "onepersoncompanyopcregistration": "one-person-company",
            "limitedliabilitypartnershipllpregistration": "llp-registration",
            "partnershipfirmregistration": "partnership-firm",
            "soleproprietorshipregistration": "sole-proprietorship",
            "section8ngocompanyregistration": "section-8-company",
            "nidhicompanyregistration": "nidhi-company-registration",
            "producercompanyregistration": "producer-company-registration",
            "publiclimitedcompanyregistration": "public-limited-company",
            "indiansubsidiaryregistration": "indian-subsidiary-registration",
            "foreigncompanyregistrationindia": "foreign-company-registration",
            "startupincorporationadvisory": "startup-incorporation-advisory",

            "gstregistration": "tax-compliance/gst-registration",
            "gstamendmentcorrection": "tax-compliance/gst-amendment",
            "gstmonthlyreturngstr1": "gst-return/gstr-1",
            "gstmonthlyreturngstr3b": "gst-return/gstr-3b",
            "gstannualreturngstr9": "tax_compliance/gst-annual-return",
            "gstauditgstr9c": "tax-compliance/gst-audit",
            "gstcancellation": "tax-compliance/gst-cancellation",

            "incometaxreturnitr1": "income-tax/itr-1",
            "incometaxreturnitr2": "income-tax/itr-2",
            "incometaxreturnitr3": "income-tax/itr-3",
            "incometaxreturnitr4": "income-tax/itr-4",
            "incometaxreturnitr567": "income-tax/itr-5-6-7",

            "tdsreturnfiling": "tax-compliance/tds-return-filing",
            "professionaltaxregfiling": "tax-compliance/professional-tax",
            "advancetaxfiling": "tax-compliance/advance-tax",
            "taxauditfiling": "tax-compliance/tax-audit",

            "annualrocfilingaoc4": "roc-filing/annual-return",
            "annualrocfilingmgt7": "roc-filing/annual-return",
            "directorkycdir3kyc": "roc-filing/director-kyc",
            "adddirector": "roc-filing/add-remove-director",
            "removedirector": "roc-filing/add-remove-director",
            "changeregisteredoffice": "roc-filing/change-registered-office",
            "sharetransferfiling": "roc-filing/share-transfer",
            "increaseauthorizedcapital": "roc-filing/increase-authorized-capital",
            "moaamendment": "roc-filing/moa-amendment",
            "aoaamendment": "roc-filing/aoa-amendment",
            "companynamechange": "roc-filing/company-name-change",
            "strikeoffcompany": "roc-filing/strike-off-company",

            "fssairegistrationbasic": "licenses/fssai-license",
            "fssailicensestate": "licenses/fssai-license",
            "fssailicensecentral": "licenses/fssai-central-license",
            "fssairenewal": "licenses/fssai-renewal",
            "fssaicorrection": "licenses/fssai-license",
            "shopestablishmentlicense": "licenses/shop-establishment-license",
            "tradelicense": "licenses/trade-license",
            "labourlicense": "licenses/labour-license",
            "factorylicense": "licenses/factory-license",
            "druglicense": "licenses/drug-license",
            "firesafetynoc": "licenses/fire-safety-noc",
            "pollutioncontrolctecto": "licenses/pollution-control",
            "importexportcodeiec": "licenses/import-export-code",
            "gumasthalicense": "licenses/gumastha-license",
            "barliquorlicense": "licenses/bar-liquor-license",

            "trademarkregistration": "intellectual-property/trademark-registration",
            "trademarkobjectionreply": "intellectual-property/trademark-objection",
            "trademarkhearingsupport": "intellectual-property/trademark-hearing",
            "trademarkhearingrepresentation": "intellectual-property/trademark-hearing",
            "trademarkassignment": "intellectual-property/trademark-assignment",
            "trademarkrenewal": "intellectual-property/trademark-renewal",
            "copyrightregistration": "intellectual-property/copyright-registration",
            "patentfilingprovisionalcomplete": "intellectual-property/patent-filing",
            "patentprovisionalfiling": "intellectual-property/patent-provisional",
            "patentcompletefiling": "intellectual-property/patent-complete",
            "designregistration": "intellectual-property/design-registration",

            "pfregistrationfiling": "labour/pf-registration",
            "pfregistration": "labour/pf-registration",
            "pffiling": "labour/pf-filing",
            "pfreturnfiling": "labour/pf-filing",
            "esiregistrationfiling": "labour/esi-registration",
            "esiregistration": "labour/esi-registration",
            "esifiling": "labour/esi-filing",
            "esireturnfiling": "labour/esi-filing",
            "professionaltaxregreturn": "labour/professional-tax-registration",
            "professionaltaxregistration": "labour/professional-tax-registration",
            "professionaltaxfiling": "labour/professional-tax-filing",
            "labourwelfarefundfiling": "labour/labour-welfare-fund",
            "payrollcompliance": "labour/payroll-compliance",
            "gratuityactregistration": "labour-law/gratuity-act",
            "bonusactcompliance": "labour-law/bonus-act",
            "minimumwagescompliance": "labour-law/minimum-wages",

            "msmeudyamregistration": "business-certifications/msme-registration",
            "isocertification90011400127001": "business-certifications/iso-certification",
            "startupindiaregistration": "business-certifications/startup-india",
            "digitalsignaturecertificatedsc": "business-certifications/digital-signature",
            "barcodegs1registration": "business-certifications/bar-code",
            "panapplication": "business-certifications/tan-pan",
            "tanapplication": "business-certifications/tan-pan",

            "partnershipdeeddrafting": "legal-drafting/partnership-deed",
            "foundersagreement": "legal-drafting/founders-agreement",
            "shareholdersagreement": "legal-drafting/shareholders-agreement",
            "employmentagreement": "legal-drafting/employment-agreement",
            "rentleaseagreement": "legal-drafting/rent-agreement",
            "franchiseagreement": "legal-drafting/franchise-agreement",
            "ndanondisclosureagreement": "legal-drafting/nda",
            "vendorserviceagreement": "legal-drafting/vendor-agreement",

            "legalnoticedrafting": "legal-notices/legal-notice-drafting",
            "replytolegalnotice": "legal-notices/reply-to-legal-notice",
            "chequebouncenoticesection138": "legal-notices/cheque-bounce-notice",
            "gstincometaxnoticereply": "legal-notices/tax-notice-reply",
            "rocnoticereply": "legal-notices/roc-notice-reply",

            "pancorrection": "corrections/pan-correction",
            "gstcertificatecorrection": "corrections/gst-correction",
            "fssailicensecorrection": "corrections/fssai-correction",
            "companyllpdetailcorrection": "corrections/company-llp-correction",
            "dindsccorrection": "corrections/din-dsc-correction",

            "llpclosure": "business-closure/llp-closure",
            "gstcancellationbusinessclosure": "tax-compliance/gst-cancellation",
            "proprietorshipclosure": "business-closure/proprietorship-closure",
            "fssailicensecancellation": "business-closure/fssai-cancellation",

            "cmadatapreparation": "financial-services/cma-data-preparation",
            "projectreportforbankloan": "financial-services/project-report",
            "bankloandocumentation": "financial-services/bank-loan-documentation",
            "cashflowcompliance": "financial-services/cash-flow-compliance",
            "startuppitchdeck": "financial-services/startup-pitch-deck",
            "businessvaluation": "financial-services/business-valuation",
            "virtualcfoservices": "financial-services/virtual-cfo",
            "cashflowstatement": "financial-services/cash-flow-compliance",
        };
        const key = normalize(name);
        return map[key];
    };

    // Smart Scroll Logic
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if scrolling UP or at the very TOP
            if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                // Hide if scrolling DOWN and not at top
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
            setScrolled(currentScrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={`fixed w-full z-[100] top-0 left-0 transition-all duration-500 ease-in-out font-sans ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${(scrolled || !isHome) ? 'bg-white/90 backdrop-blur-md shadow-lg py-1' : 'bg-transparent py-4'}`}>
                {/* SINGLE ROW NAVBAR */}
                <div className="w-full relative z-50">
                    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">

                        {/* LEFT: LOGO */}
                        <div className="w-auto xl:w-[300px] shrink-0 flex items-center">
                            <Link to="/" className="flex items-center">
                                <img
                                    src="/logo.png"
                                    alt="ShineFiling"
                                    className="h-20 md:h-32 w-auto object-contain hover:opacity-90 transition-all"
                                />
                            </Link>
                        </div>

                        {/* CENTER: NAVIGATION GROUPS (Desktop Only) */}
                        <div className="hidden xl:flex items-center justify-center flex-1 h-full px-2 gap-8">
                            {/* STATIC LINKS */}
                            {[
                                { label: 'ABOUT', path: '/about-us' },
                                { label: 'CAREERS', path: '/careers' },
                                { label: 'CONTACT', path: '/contact-us' }
                            ].map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    className={`text-[12px] font-bold uppercase tracking-wide transition-colors ${(scrolled || !isHome) ? 'text-[#043E52] hover:text-[#ED6E3F]' : 'text-white/90 hover:text-[#ED6E3F]'}`}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* BUSINESS SOLUTIONS MEGA MENU TRIGGER */}
                            <div
                                className="h-full flex items-center"
                                onMouseEnter={() => setHoveredMenu('SOLUTIONS')}
                                onMouseLeave={() => setHoveredMenu(null)}
                            >
                                <button className={`flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide transition-all px-3 py-2 rounded-lg ${hoveredMenu === 'SOLUTIONS' ? 'text-[#ED6E3F]' : ((scrolled || !isHome) ? 'text-[#043E52] hover:bg-slate-50' : 'text-white/90 hover:bg-white/10')}`}>
                                    BUSINESS SOLUTIONS
                                    <ChevronDown size={12} className={`transform transition-transform duration-300 opacity-50 ${hoveredMenu === 'SOLUTIONS' ? 'rotate-180 text-[#ED6E3F] opacity-100' : ''}`} />
                                </button>

                                {/* SIDE-BY-SIDE MEGA MENU */}
                                <AnimatePresence>
                                    {hoveredMenu === 'SOLUTIONS' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 w-full flex justify-center pt-1 z-[102]"
                                        >
                                            <div className="w-[95%] max-w-[1000px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden flex">
                                                {/* Left Sidebar: Categories */}
                                                <div className="w-[260px] shrink-0 bg-slate-50/80 backdrop-blur-sm border-r border-slate-100 py-4 flex flex-col gap-1">
                                                    <div className="px-5 mb-3">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</span>
                                                    </div>
                                                    {navGroups.map((group, idx) => (
                                                        <button
                                                            key={idx}
                                                            onMouseEnter={() => setActiveCategory(group.label)}
                                                            className={`w-full text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wide flex items-center justify-between transition-all duration-200 relative ${activeCategory === group.label
                                                                ? 'bg-white text-[#ED6E3F] border-l-4 border-[#ED6E3F] shadow-sm'
                                                                : 'text-slate-500 hover:text-[#043E52] hover:bg-white/50 border-l-4 border-transparent'
                                                                }`}
                                                        >
                                                            {group.label}
                                                            {activeCategory === group.label && <ChevronDown className="-rotate-90 text-[#ED6E3F]" size={14} />}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Right Content: Services Grid */}
                                                <div className="flex-1 p-6 bg-white min-h-[350px] flex flex-col">
                                                    <AnimatePresence mode="wait">
                                                        {(() => {
                                                            const activeGroup = navGroups.find(g => g.label === activeCategory) || navGroups[0];
                                                            return (
                                                                <motion.div
                                                                    key={activeCategory}
                                                                    initial={{ opacity: 0, x: 8 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    exit={{ opacity: 0, x: -8 }}
                                                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                                                    className="flex-1 flex flex-col"
                                                                >
                                                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                                                                        <h3 className="text-lg font-black text-[#043E52] tracking-tight flex items-center gap-2">
                                                                            <div className="w-6 h-10 rounded-md bg-[#ED6E3F]/10 flex items-center justify-center text-[#ED6E3F] text-sm">
                                                                                {activeGroup.label.charAt(0)}
                                                                            </div>
                                                                            {activeGroup.label}
                                                                        </h3>
                                                                        <button
                                                                            onClick={() => {
                                                                                setHoveredMenu(null);
                                                                                if (isLoggedIn) navigate('/dashboard/new-filings');
                                                                                else {
                                                                                    setAuthMode('login');
                                                                                    setShowAuthModal(true);
                                                                                }
                                                                            }}
                                                                            className="text-[11px] font-bold text-[#ED6E3F] hover:text-[#043E52] flex items-center gap-1 group/view transition-colors"
                                                                        >
                                                                            VIEW ALL <ArrowRight size={12} className="transition-transform group-hover/view:translate-x-1" />
                                                                        </button>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 content-start flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                                                                        {activeGroup.keys.map(catKey => {
                                                                            const category = SERVICE_DATA[catKey];
                                                                            if (!category) return null;
                                                                            return category.items.map((item, i) => {
                                                                                if (!isServiceActive(item)) return null;
                                                                                const slug = getServiceSlug(item);
                                                                                return (
                                                                                    <Link
                                                                                        key={`${catKey}-${i}`}
                                                                                        to={slug ? `/services/${slug}` : `/services/apply?name=${encodeURIComponent(item)}`}
                                                                                        onClick={() => setHoveredMenu(null)}
                                                                                        className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-all group/link"
                                                                                    >
                                                                                        <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 group-hover/link:bg-[#ED6E3F] transition-colors shrink-0"></div>
                                                                                        <span className="text-[12px] font-medium text-slate-600 group-hover/link:text-[#043E52] leading-snug">
                                                                                            {item}
                                                                                        </span>
                                                                                    </Link>
                                                                                );
                                                                            });
                                                                        })}
                                                                    </div>
                                                                </motion.div>
                                                            );
                                                        })()}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* RIGHT: AUTH & MOBILE TOGGLE */}
                        <div className="w-auto xl:w-[280px] shrink-0 flex items-center justify-end gap-6">
                            {!isLoggedIn ? (
                                <div className="hidden xl:flex items-center gap-4">
                                    <button
                                        onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                                        className={`text-xs font-bold hover:text-[#F9A65E] tracking-wider uppercase transition-colors cursor-pointer ${(scrolled || !isHome) ? 'text-[#043E52]' : 'text-white'}`}
                                    >
                                        LOGIN
                                    </button>
                                    <button
                                        onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                                        className="px-6 py-2.5 rounded-full bg-[#ED6E3F] text-white hover:bg-[#F9A65E] text-xs font-bold tracking-wider shadow-lg shadow-[#ED6E3F]/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                                    >
                                        SIGN UP
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden xl:flex items-center gap-6">
                                    <div className="relative" ref={notificationRef}>
                                        <button
                                            onClick={() => setShowNotifications(!showNotifications)}
                                            className={`relative transition p-1 ${(scrolled || !isHome) ? 'text-slate-600 hover:text-[#043E52]' : 'text-white hover:text-[#F9A65E]'}`}
                                        >
                                            <Bell size={20} />
                                            {notificationCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>}
                                        </button>

                                        <AnimatePresence>
                                            {showNotifications && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl z-[102] overflow-hidden ring-1 ring-black/5"
                                                >
                                                    {/* Header */}
                                                    <div className="bg-[#ED6E3F] px-4 py-3 flex items-center justify-between">
                                                        <h4 className="text-white font-bold text-sm">Notifications</h4>
                                                        <button className="text-white/80 hover:text-white transition-colors">
                                                            <Settings size={16} />
                                                        </button>
                                                    </div>

                                                    {/* Notification List */}
                                                    <div className="max-h-[350px] overflow-y-auto bg-white">
                                                        {notifications.length > 0 ? (
                                                            notifications.slice(0, 5).map((notif, idx) => (
                                                                <div key={idx} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 group cursor-pointer relative">
                                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-[#043E52] font-bold text-sm">
                                                                        {notif.sender ? notif.sender.charAt(0) : 'S'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-slate-800 leading-snug">
                                                                            <span className="font-bold">{notif.title || 'System'}</span> {notif.message}
                                                                        </p>
                                                                        <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                                                                            {notif.timestamp ? new Date(notif.timestamp).toLocaleDateString() : 'Just now'}
                                                                        </span>
                                                                    </div>
                                                                    {(!notif.isRead && !notif.read) && (
                                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#ED6E3F]"></div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                                                                <Bell size={24} className="mb-2 opacity-50" />
                                                                <span className="text-xs font-medium">No new notifications</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Footer */}
                                                    <div
                                                        onClick={() => {
                                                            setShowNotifications(false);
                                                            let dashboardPath = "/dashboard";
                                                            if (user?.role?.includes('ADMIN')) dashboardPath = "/admin-dashboard";
                                                            else if (user?.role === 'AGENT') dashboardPath = "/agent-dashboard";
                                                            else if (user?.role === 'CA') dashboardPath = "/ca-dashboard";

                                                            navigate(`${dashboardPath}?tab=notifications`);
                                                        }}
                                                        className="bg-slate-50 px-4 py-3 text-center border-t border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                                                    >
                                                        <span className="text-xs font-bold text-[#043E52]">See all recent activity</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="flex items-center gap-3 cursor-pointer relative" ref={userMenuRef}>
                                        <div className="flex items-center gap-3" onClick={() => setShowUserMenu(!showUserMenu)}>
                                            <div className="text-right hidden xl:block">
                                                <p className={`text-xs font-bold ${(scrolled || !isHome) ? 'text-[#043E52]' : 'text-white'}`}>{user?.fullName}</p>
                                            </div>
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ring-2 transition-all overflow-hidden relative ${(scrolled || !isHome) ? 'bg-slate-100 text-[#043E52] ring-slate-200' : 'bg-white/20 text-white ring-white/30'}`}>
                                                {user?.profileImage ? (
                                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                                                )}
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {showUserMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full right-0 mt-4 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-[102] overflow-hidden"
                                                >
                                                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                                        <p className="text-xs font-bold text-[#043E52] truncate">{user?.email}</p>
                                                    </div>
                                                    <Link
                                                        to={getDashboardPath(user?.role)}
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#043E52] transition-colors"
                                                    >
                                                        <User size={16} /> Dashboard
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setShowUserMenu(false);
                                                            onLogout();
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left border-t border-slate-50 mt-1"
                                                    >
                                                        <LogOut size={16} /> Logout
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            <button className={`xl:hidden p-2 rounded-lg transition-colors ${(scrolled || !isHome) ? 'text-[#043E52] hover:bg-slate-100' : 'text-white hover:bg-white/10'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Menu (Enhanced) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col xl:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <span className="text-xl font-black text-[#043E52] tracking-tight">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 -mr-2 text-slate-400 hover:text-[#043E52] hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-slate-50">
                            <div className="p-5 space-y-6">
                                {/* Mobile Search */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setSearchQuery(val);
                                                if (val.trim()) {
                                                    const query = val.toLowerCase();
                                                    const results = [];
                                                    for (const catKey of Object.keys(SERVICE_DATA)) {
                                                        const cat = SERVICE_DATA[catKey];
                                                        cat.items.forEach(item => {
                                                            if (item.toLowerCase().includes(query) && isServiceActive(item)) {
                                                                results.push({ name: item, category: cat.label });
                                                            }
                                                        });
                                                    }
                                                    setSearchResults(results.slice(0, 5));
                                                } else {
                                                    setSearchResults([]);
                                                }
                                            }}
                                            placeholder="Find a service..."
                                            className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:border-[#ED6E3F] focus:ring-4 focus:ring-[#ED6E3F]/10 outline-none transition-all shadow-sm"
                                        />
                                        {/* Mobile Search Results */}
                                        {searchResults.length > 0 && searchQuery && (
                                            <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                                                {searchResults.map((res, idx) => {
                                                    const slug = getServiceSlug(res.name);
                                                    const url = slug ? `/services/${slug}` : `/services/apply?name=${encodeURIComponent(res.name)}`;
                                                    return (
                                                        <Link
                                                            key={idx}
                                                            to={url}
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                setSearchResults([]);
                                                                setMobileMenuOpen(false);
                                                            }}
                                                            className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-[#043E52]">{res.name}</span>
                                                                <span className="text-[10px] uppercase text-slate-400 font-bold">{res.category}</span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Auth Buttons */}
                                {!isLoggedIn ? (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <button
                                            onClick={() => { setAuthMode('login'); setShowAuthModal(true); setMobileMenuOpen(false); }}
                                            className="flex items-center justify-center h-12 rounded-xl bg-white border border-slate-200 text-[#043E52] font-bold text-sm shadow-sm hover:border-[#ED6E3F] transition-all cursor-pointer"
                                        >
                                            LOGIN
                                        </button>
                                        <button
                                            onClick={() => { setAuthMode('signup'); setShowAuthModal(true); setMobileMenuOpen(false); }}
                                            className="flex items-center justify-center h-12 rounded-xl bg-gradient-to-r from-[#ED6E3F] to-[#F9A65E] text-white font-bold text-sm shadow-lg shadow-[#ED6E3F]/20 transition-all hover:shadow-[#ED6E3F]/30 hover:-translate-y-0.5 cursor-pointer"
                                        >
                                            SIGN UP
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-[#043E52] text-white flex items-center justify-center font-bold text-lg">
                                                {user?.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#043E52]">{user?.fullName}</p>
                                                <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                to={getDashboardPath(user?.role)}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center justify-center h-10 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-[#043E52] hover:bg-slate-100 transition-colors"
                                            >
                                                DASHBOARD
                                            </Link>
                                            <button
                                                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                                                className="flex items-center justify-center h-10 rounded-lg bg-red-50 border border-red-100 text-xs font-bold text-red-500 hover:bg-red-100 transition-colors"
                                            >
                                                LOGOUT
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Services Accordion */}
                                <div className="space-y-4 pt-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Our Solutions</label>
                                    <div className="space-y-2">
                                        {categories.map((catKey) => {
                                            const category = SERVICE_DATA[catKey];
                                            if (!category) return null;
                                            const isOpen = expandedMobileCat === catKey;

                                            return (
                                                <div key={catKey} className={`rounded-xl border transition-all duration-200 ${isOpen ? 'bg-white border-[#ED6E3F]/30 shadow-md' : 'bg-white border-slate-200 shadow-sm'}`}>
                                                    <button
                                                        onClick={() => setExpandedMobileCat(isOpen ? null : catKey)}
                                                        className="w-full flex items-center justify-between p-4"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${isOpen ? 'bg-[#ED6E3F]/10 text-[#ED6E3F]' : 'bg-slate-50 text-slate-400'}`}>
                                                                <category.icon size={18} />
                                                            </div>
                                                            <span className={`text-sm font-bold uppercase tracking-wide ${isOpen ? 'text-[#043E52]' : 'text-slate-600'}`}>{navLabels[catKey]}</span>
                                                        </div>
                                                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#ED6E3F]' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-4 pb-4 space-y-1">
                                                                    <div className="h-px w-full bg-slate-100 mb-3"></div>
                                                                    {category.items.map((item, idy) => {
                                                                        if (!isServiceActive(item)) return null;
                                                                        const slug = getServiceSlug(item);
                                                                        return (
                                                                            <Link
                                                                                key={idy}
                                                                                to={slug ? `/services/${slug}` : `/services/apply?name=${encodeURIComponent(item)}`}
                                                                                onClick={() => setMobileMenuOpen(false)}
                                                                                className="block py-2 text-sm text-[#043E52] hover:text-[#ED6E3F] font-medium pl-11 relative"
                                                                            >
                                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#043E52]/30"></span>
                                                                                {item}
                                                                            </Link>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Bottom Links */}
                                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 pb-8">
                                    {[
                                        { label: 'About Us', path: '/about-us' },
                                        { label: 'Careers', path: '/careers' },
                                        { label: 'Contact Us', path: '/contact-us' },
                                    ].map((link, idx) => (
                                        <Link
                                            key={idx}
                                            to={link.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-sm font-bold text-slate-500 hover:text-[#043E52]"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )
                }
            </AnimatePresence >

            {/* Auth Modal Popup */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode={authMode}
                onAuthSuccess={onLogin}
            />
        </>
    );
};

export default Navbar;
