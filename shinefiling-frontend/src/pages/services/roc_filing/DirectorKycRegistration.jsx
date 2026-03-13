
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Phone, Mail,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, CreditCard
} from 'lucide-react';
import { uploadFile, submitDirectorKyc } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const validatePlan = (plan) => {
    return ['standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const DirectorKycRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        standard: {
            price: 499,
            title: 'Web KYC',
            features: ["No Details Change", "OTP Verification"],
            icon: Zap
        },
        premium: {
            price: 1499,
            title: 'e-Form KYC',
            features: ["Details Update", "Professional Cert."],
            recommended: true,
            icon: Shield
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
        din: '',
        fullName: '',
        fathersName: '',
        dob: '',
        mobileNumber: '',
        emailId: '',
        isForeignNational: false,
        financialYear: '2024-2025',
        otpVerified: false
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.standard;
        const basePrice = plan.price;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);

        return {
            base: basePrice,
            platformFee,
            tax,
            gst,
            total: basePrice + platformFee + tax + gst
        };
    }, [selectedPlan]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: val });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.din) { newErrors.din = "Required"; isValid = false; }
            if (!formData.fullName) { newErrors.fullName = "Required"; isValid = false; }
            if (!formData.mobileNumber) { newErrors.mobileNumber = "Required"; isValid = false; }
            if (!formData.emailId) { newErrors.emailId = "Required"; isValid = false; }
            if (!formData.otpVerified) { newErrors.otp = "Verify OTP first"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleSendOtp = () => {
        if (!formData.mobileNumber || !formData.emailId) {
            alert("Enter contact details first");
            return;
        }
        setOtpSent(true);
        alert(`OTP sent (Simulated: 1234)`);
    };

    const handleVerifyOtp = () => {
        if (otpInput === '1234') {
            setFormData({ ...formData, otpVerified: true });
            setErrors(prev => ({ ...prev, otp: null }));
        } else {
            alert("Invalid OTP");
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'director_kyc_docs');
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
            alert("Upload failed.");
        }
    };

    const submitApplication = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || formData.emailId;
        const phone = userObj?.phone || formData.mobileNumber;

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${plans[selectedPlan]?.title} - Director KYC Filing`,
            prefill: {
                name: formData.fullName || userObj?.name || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                try {
                    const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                        id: k,
                        filename: v.name,
                        fileUrl: v.fileUrl
                    }));

                    const finalPayload = {
                        submissionId: `ROCKYC-${Date.now()}`,
                        plan: selectedPlan,
                        userEmail: email,
                        userPhone: phone,
                        formData: formData,
                        documents: docsList,
                        status: "PAYMENT_SUCCESSFUL",
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };

                    const apiResponse = await submitDirectorKyc(finalPayload);
                    setAutomationPayload(apiResponse);
                    setIsSuccess(true);
                } catch (error) {
                    alert("Submission error: " + error.message);
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Director Info
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <User size={16} className="text-[#ED6E3F]" /> DIRECTOR VERIFICATION
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">DIN (8 Digits)</label>
                                    <input type="text" name="din" value={formData.din} onChange={handleInputChange} placeholder="00012345" maxLength={8} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-mono tracking-widest text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name (As per PAN)</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="As per PAN records" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-bold text-sm" />
                                </div>

                                <div className="md:col-span-2 p-5 bg-orange-50/50 rounded-2xl border border-orange-100 mt-4">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Clock size={12} /> Contact Authentication (OTP)
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="Mobile Number" className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium" />
                                        </div>
                                        <div className="relative">
                                            <Mail size={14} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} placeholder="Email ID" className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium" />
                                        </div>
                                    </div>

                                    {formData.otpVerified ? (
                                        <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-white p-3 rounded-xl border border-green-100 shadow-sm animate-in zoom-in-95">
                                            <CheckCircle size={16} /> Contact Verified Successfully
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {!otpSent ? (
                                                <button onClick={handleSendOtp} className="px-5 py-2.5 bg-navy text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all">Send Validation OTP</button>
                                            ) : (
                                                <div className="flex items-center gap-2 w-full md:w-auto">
                                                    <input type="text" placeholder="Enter OTP" value={otpInput} onChange={e => setOtpInput(e.target.value)} className="w-24 p-2 bg-white border border-gray-200 rounded-xl text-center text-sm font-black" />
                                                    <button onClick={handleVerifyOtp} className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all">Verify</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {errors.otp && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide px-2 shrink-0">{errors.otp}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Uploads
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-navy">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <ClipboardList size={16} className="text-[#ED6E3F]" /> IDENTITY PROOFS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.pan ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className={`p-4 rounded-2xl ${uploadedFiles.pan ? 'bg-green-500 text-white shadow-lg' : 'bg-white shadow-sm text-slate-400'}`}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-700">PAN Card</p>
                                        <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Self Attested Copy</p>
                                    </div>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md transition-all ${uploadedFiles.pan ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                            {uploadedFiles.pan ? 'Change Card' : 'Upload Card'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'pan')} />
                                    </label>
                                </div>

                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.aadhaar ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className={`p-4 rounded-2xl ${uploadedFiles.aadhaar ? 'bg-green-500 text-white shadow-lg' : 'bg-white shadow-sm text-slate-400'}`}>
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-700">Aadhaar Card</p>
                                        <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Address Evidence</p>
                                    </div>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md transition-all ${uploadedFiles.aadhaar ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                            {uploadedFiles.aadhaar ? 'Change Card' : 'Upload Card'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'aadhaar')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Review
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 text-navy">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-navy mb-4">Final Validation</h2>
                            <div className="bg-slate-50 p-6 rounded-2xl space-y-4 font-poppins text-sm border-2 border-white shadow-inner">
                                <div className="flex justify-between items-center border-b border-white pb-3">
                                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Director</span>
                                    <span className="font-black uppercase">{formData.fullName}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white pb-3">
                                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">DIN Number</span>
                                    <span className="font-black font-mono tracking-widest">{formData.din}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white pb-3">
                                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Mobile</span>
                                    <span className="font-black">{formData.mobileNumber}</span>
                                </div>
                                <div className="flex justify-between items-center text-green-600">
                                    <span className="font-bold text-[10px] uppercase tracking-widest">OTP Status</span>
                                    <span className="font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle size={14} /> Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 via-indigo-500 to-orange-500"></div>

                            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-600 rotate-3 shadow-lg shadow-orange-500/10">
                                <CreditCard size={32} />
                            </div>

                            <h2 className="text-2xl font-black text-navy mb-2 tracking-tight">Payment Summary</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60">DIR-3 KYC Statutory Filing Fee</p>

                            <div className="bg-slate-50 p-8 rounded-3xl mb-8 space-y-3 font-poppins text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 font-bold tracking-tight uppercase text-[10px]">KYC TIER</span>
                                    <span className="font-black text-indigo-600 uppercase italic tracking-tighter">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="h-px bg-white my-2 shadow-sm"></div>
                                <div className="flex justify-between text-2xl font-black text-navy underline decoration-[#ED6E3F] decoration-4 underline-offset-4">
                                    <span className="text-xs self-end mb-1 text-slate-400 font-bold">TOTAL COST</span>
                                    <span>₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center">
                                <input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} />
                                I Accept Terms & Conditions
                            </label>

                            <button
                                onClick={submitApplication}
                                disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing}
                                className="w-full py-5 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-navy/20 hover:bg-black transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                            >
                                {isSubmitting || isPaymentProcessing ? 'PROCESSING PAYMENT...' : 'PAY & PROCESS KYC'}
                                {!isSubmitting && !isPaymentProcessing && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                            </button>
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
                            Director KYC
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
                        {['Personnel Info', 'ID Proofs', 'Final Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Director KYC</span>
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
                                {currentStep === 1 && "Director Verification"}
                                {currentStep === 2 && "Identity Proofs"}
                                {currentStep === 3 && "Final Review"}
                                {currentStep === 4 && "Complete Payment"}
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
                            {currentStep < 4 && (
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
};

export default DirectorKycRegistration;
