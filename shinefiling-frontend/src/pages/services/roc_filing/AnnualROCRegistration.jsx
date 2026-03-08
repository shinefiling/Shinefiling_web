
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, Building2, Layers,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, User, Phone, Mail
} from 'lucide-react';
import { uploadFile, submitAnnualRocFiling } from '../../../api';

const validatePlan = (plan) => {
    return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const AnnualROCRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        basic: {
            price: 3999,
            title: 'Basic Plan',
            features: ["AOC-4 & MGT-7/7A Filing", "Balance Sheet Upload", "Profit & Loss Upload", "MCA Manual Upload", "SRN Receipt Generation", "Standard Support"],
            icon: Zap
        },
        standard: {
            price: 6999,
            title: 'Standard Plan',
            features: ["Director's Report Prep", "Auditor Coordination", "Shareholder List Prep", "CS Error-Free Support", "Penalty Avoidance Check", "Priority Processing"],
            recommended: true,
            icon: Shield
        },
        premium: {
            price: 11999,
            title: 'Premium Plan',
            features: ["AGM Notice & Minutes", "Board Meeting Minutes", "AGM Compliance Support", "1-Year Compliance Calendar", "Dedicated CS Support", "Year-Round Advisory"],
            icon: Briefcase
        }
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planParam = searchParams.get('plan');

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(() => validatePlan(planProp || planParam));

    useEffect(() => {
        const targetPlan = validatePlan(planProp || planParam);
        if (targetPlan !== selectedPlan) {
            setSelectedPlan(targetPlan);
        }
    }, [planParam, planProp, selectedPlan]);

    const [formData, setFormData] = useState({
        companyName: '',
        cin: '',
        financialYear: '2023-2024',
        agmDate: '',
        companyType: 'Private Limited',
        paidUpCapital: '',
        turnover: '',
        userEmail: '',
        userPhone: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.standard;
        const basePrice = plan.price;
        const platformFee = Math.round(basePrice * 0.03); // 3%
        const tax = Math.round(basePrice * 0.03);         // 3%
        const gst = Math.round(basePrice * 0.09);         // 9%

        return {
            base: basePrice,
            platformFee,
            tax,
            gst,
            total: basePrice + platformFee + tax + gst
        };
    }, [selectedPlan]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.companyName) { newErrors.companyName = "Required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "Required"; isValid = false; }
            if (formData.cin && formData.cin.length !== 21) { newErrors.cin = "Must be 21 chars"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.paidUpCapital) { newErrors.paidUpCapital = "Required"; isValid = false; }
            if (!formData.turnover) { newErrors.turnover = "Required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(5, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'annual_roc_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
        } catch (error) {
            alert("File upload failed.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                type: k.toUpperCase(),
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `ROC-ANNUAL-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.userEmail,
                amountPaid: billDetails.total,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            await submitAnnualRocFiling(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Company Info
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <Building2 size={16} className="text-[#ED6E3F]" /> COMPANY IDENTIFICATION
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Company CIN (21 characters)</label>
                                    <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} placeholder="U12345DL2024PTC123456" maxLength={21} className={`w-full p-3 bg-slate-50 border rounded-xl font-mono tracking-wider uppercase text-sm ${errors.cin ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'}`} />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Registered Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter full name as per MCA" className={`w-full p-3 bg-slate-50 border rounded-xl font-bold text-sm ${errors.companyName ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'}`} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Entity Type</label>
                                    <select name="companyType" value={formData.companyType} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium outline-none">
                                        <option value="Private Limited">Private Limited</option>
                                        <option value="OPC">One Person Company</option>
                                        <option value="Public Limited">Public Limited</option>
                                        <option value="Section 8">Section 8 Company</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Financial Year</label>
                                    <select name="financialYear" value={formData.financialYear} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium outline-none">
                                        <option value="2023-2024">FY 2023-2024</option>
                                        <option value="2022-2023">FY 2022-2023</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Stats & Dates
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <Layers size={16} className="text-[#ED6E3F]" /> FINANCIAL STATISTICS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 text-sm font-poppins">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Paid-up Capital (₹)</label>
                                    <input type="number" name="paidUpCapital" value={formData.paidUpCapital} onChange={handleInputChange} placeholder="0" className={`w-full p-3 bg-slate-50 border rounded-xl font-bold ${errors.paidUpCapital ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'}`} />
                                </div>
                                <div className="space-y-1 text-sm font-poppins">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Turnover (₹)</label>
                                    <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} placeholder="0" className={`w-full p-3 bg-slate-50 border rounded-xl font-bold ${errors.turnover ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'}`} />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Date of Annual General Meeting (AGM)</label>
                                    <input type="date" name="agmDate" value={formData.agmDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <ClipboardList size={16} className="text-[#ED6E3F]" /> COMPLIANCE DOCUMENTS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { id: 'pl_bs', label: 'P&L Statement & Balance Sheet' },
                                    { id: 'audit_report', label: 'Auditor Report' },
                                    { id: 'notes_accounts', label: 'Notes to Accounts' },
                                    { id: 'director_report', label: "Director's Report" },
                                ].map((doc) => (
                                    <div key={doc.id} className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-2 ${uploadedFiles[doc.id] ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                        <div className={`p-2 rounded-lg ${uploadedFiles[doc.id] ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400'}`}>
                                            {uploadedFiles[doc.id] ? <CheckCircle size={20} /> : <FileText size={20} />}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{doc.label}</span>
                                        <label className="mt-2 cursor-pointer">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm ${uploadedFiles[doc.id] ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                                {uploadedFiles[doc.id] ? 'Change File' : 'Upload File'}
                                            </span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-navy mb-4">Application Review</h2>
                            <div className="bg-slate-50 p-5 rounded-xl space-y-4 text-sm font-poppins">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Company</span>
                                    <span className="font-black text-navy uppercase">{formData.companyName}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">CIN</span>
                                    <span className="font-black text-navy font-mono tracking-widest">{formData.cin}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Filing FY</span>
                                    <span className="font-black text-orange-600">{formData.financialYear}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Selected Plan</span>
                                    <span className="font-black text-indigo-600 uppercase">{plans[selectedPlan].title}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5: // Payment
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                                <IndianRupee size={32} />
                            </div>

                            <h2 className="text-2xl font-black text-navy mb-2">Filing Summary</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 opacity-60">Complete payment to start ROC filing</p>

                            <div className="bg-slate-50 p-6 rounded-2xl mb-8 space-y-3 font-poppins text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Service Fee</span>
                                    <span className="font-black text-navy">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 italic">
                                    <span className="text-xs">Platform & Admin Fees</span>
                                    <span className="font-bold">₹{(billDetails.platformFee + billDetails.tax).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 italic">
                                    <span className="text-xs">GST (18% on fees)</span>
                                    <span className="font-bold">₹{billDetails.gst.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between text-xl font-black text-navy">
                                    <span className="uppercase text-[10px] font-bold text-orange-600 tracking-wider">Total Payable</span>
                                    <span>₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-navy text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-black transition-all flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? 'Processing Application...' : 'Pay & Dispatch Filing'}
                                {!isSubmitting && <ArrowRight size={20} />}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 opacity-30 italic">
                                <Shield size={14} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Secure Corporate Gateway</span>
                            </div>
                        </div>
                    </div>
                );

            default: return null;
        }
    }

    // --- MODAL LAYOUT: SPLIT VIEW (Left Sidebar + Right Content) ---
    if (isModal || true) { // Always use split-view for ROC
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK - Hidden on Mobile */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Annual ROC Filing
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight mb-4">{plans[selectedPlan]?.title}</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Service Fee</span>
                                    <span className="text-white font-medium font-mono">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Govt Fee & Taxes</span>
                                    <span className="text-white font-medium font-mono">₹{(billDetails.total - billDetails.base).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold text-[#ED6E3F] uppercase tracking-wider">Total Payable</span>
                                    <span className="text-xl font-bold text-white leading-none">₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ED6E3F] to-transparent opacity-50"></div>
                        </div>
                    </div>

                    {/* VERTICAL STEPPER */}
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Company Info', 'Filing Details', 'Upload Documents', 'Review', 'Payment'].map((step, i) => (
                            <div key={i}
                                onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                    {currentStep > i + 1 ? <CheckCircle size={12} /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${currentStep === i + 1 ? 'text-white font-bold' : ''}`}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT CONTENT: FORM */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    {/* Header Bar */}
                    <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                        <div className="flex flex-col justify-center">
                            {/* Mobile: Detailed Service & Price Info */}
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">Annual ROC Filing</span>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Service</span>
                                        <span className="text-xs font-bold text-slate-700">₹{(billDetails.base / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="w-px h-5 bg-gray-200"></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Govt Fee</span>
                                        <span className="text-xs font-bold text-slate-700">₹{((billDetails.total - billDetails.base) / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="w-px h-5 bg-gray-200"></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Total</span>
                                        <span className="text-xs font-bold text-green-600">₹{billDetails.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop: Step Title */}
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Company Information"}
                                {currentStep === 2 && "Corporate Statistics"}
                                {currentStep === 3 && "Upload Documents"}
                                {currentStep === 4 && "Review Application"}
                                {currentStep === 5 && "Complete Payment"}
                            </h2>
                        </div>

                        <button onClick={onClose || (() => navigate(-1))} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Check dashboard for status updates.</p>
                                <button onClick={onClose || (() => navigate(-1))} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Proceed to Dashboard</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                    </div>

                    {/* Sticky Footer */}
                    {!isSuccess && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button
                                onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                disabled={currentStep === 1}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                                Back
                            </button>
                            {currentStep < 5 && (
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition flex items-center gap-2 text-sm"
                                >
                                    Save & Continue <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- STANDARD FULL PAGE LAYOUT (Kept for fallback/direct access) ---
    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase"><ArrowLeft size={14} /> Back</button>
                <div className="flex gap-8">
                    <div className="w-72 hidden lg:block space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                            {['Company', 'Statistics', 'Docs', 'Review', 'Payment'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-navy text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        <div className="mt-6 flex justify-between">
                            <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1}>Back</button>
                            <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-6 py-2 rounded">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnualROCRegistration;
