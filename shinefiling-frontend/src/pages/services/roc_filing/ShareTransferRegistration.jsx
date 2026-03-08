
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Building2, TrendingUp, Users,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, CreditCard
} from 'lucide-react';
import { uploadFile, submitShareTransfer } from '../../../api';

const validatePlan = (plan) => {
    return ['consultation', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const ShareTransferRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        consultation: { price: 999, title: 'Expert Consult' },
        standard: { price: 2499, title: 'Single Transfer' },
        premium: { price: 4999, title: 'Bulk Execution' }
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
        userEmail: '',
        userPhone: '',
        companyName: '',
        transferDate: '',
        numberOfShares: '',
        pricePerShare: '',
        transferorName: '',
        transferorPan: '',
        transfereeName: '',
        transfereePan: '',
        transfereeEmail: '',
        transfereeMobile: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            const storedUser = localStorage.getItem('user');
            if (!isLoggedIn && !storedUser) {
                if (!formData.userEmail) { newErrors.userEmail = "Required"; isValid = false; }
                if (!formData.userPhone) { newErrors.userPhone = "Required"; isValid = false; }
            }
            if (!formData.companyName) { newErrors.companyName = "Required"; isValid = false; }
            if (!formData.numberOfShares) { newErrors.numberOfShares = "Required"; isValid = false; }
        } else if (step === 2) {
            if (!formData.transferorName) { newErrors.transferorName = "Required"; isValid = false; }
            if (!formData.transfereeName) { newErrors.transfereeName = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'share_transfer_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id }
            }));
        } catch (error) {
            alert("Upload failed.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const consideration = (parseInt(formData.numberOfShares) || 0) * (parseFloat(formData.pricePerShare) || 0);
            const finalPayload = {
                submissionId: `ROCSHARE-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.userEmail,
                userPhone: JSON.parse(localStorage.getItem('user'))?.phone || formData.userPhone,
                formData: formData,
                documents: docsList,
                amountPaid: billDetails.total,
                considerationAmount: consideration,
                status: "PAYMENT_SUCCESSFUL"
            };
            const response = await submitShareTransfer(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            {(!isLoggedIn && !localStorage.getItem('user')) && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 pb-6 border-b border-gray-100">
                                    <h3 className="md:col-span-2 font-bold text-slate-800 mb-1 text-sm flex items-center gap-2"><User size={16} /> CONTACT DETAILS</h3>
                                    <input name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="Email Address" className={`p-2 text-sm border rounded-lg ${errors.userEmail ? 'border-red-500' : ''}`} />
                                    <input name="userPhone" value={formData.userPhone} onChange={handleInputChange} placeholder="Phone Number" className={`p-2 text-sm border rounded-lg ${errors.userPhone ? 'border-red-500' : ''}`} />
                                </div>
                            )}
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><TrendingUp size={16} /> TRANSFER DETAILS</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Filing Company Name" className={`md:col-span-2 p-2 text-sm border rounded-lg ${errors.companyName ? 'border-red-500' : ''}`} />
                                <input type="number" name="numberOfShares" value={formData.numberOfShares} onChange={handleInputChange} placeholder="Quantity of Shares" className={`p-2 text-sm border rounded-lg ${errors.numberOfShares ? 'border-red-500' : ''}`} />
                                <input type="number" name="pricePerShare" value={formData.pricePerShare} onChange={handleInputChange} placeholder="Price per Share (₹)" className="p-2 text-sm border rounded-lg" />
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Deed Execution Date</p>
                                    <input type="date" name="transferDate" value={formData.transferDate} onChange={handleInputChange} className="w-full p-2 text-sm border rounded-lg" />
                                </div>

                                {formData.numberOfShares && (
                                    <div className="md:col-span-2 p-3 bg-orange-50 rounded-lg border border-orange-100 flex items-center gap-2 text-[#ED6E3F]">
                                        <Briefcase size={14} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Est. Value: ₹{((formData.numberOfShares || 0) * (formData.pricePerShare || 0)).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Users size={16} /> PARTIES INVOLVED</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">TRANSFEROR (SELLER)</h4>
                                    <input name="transferorName" value={formData.transferorName} onChange={handleInputChange} placeholder="Full Name" className={`w-full p-2 text-sm border rounded-lg ${errors.transferorName ? 'border-red-500' : ''}`} />
                                    <input name="transferorPan" value={formData.transferorPan} onChange={handleInputChange} placeholder="PAN Number" className="w-full p-2 text-sm border rounded-lg font-mono uppercase" />
                                </div>
                                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest">TRANSFEREE (BUYER)</h4>
                                    <input name="transfereeName" value={formData.transfereeName} onChange={handleInputChange} placeholder="Full Name" className={`w-full p-2 text-sm border rounded-lg ${errors.transfereeName ? 'border-red-500' : ''}`} />
                                    <input name="transfereePan" value={formData.transfereePan} onChange={handleInputChange} placeholder="PAN Number" className="w-full p-2 text-sm border rounded-lg font-mono uppercase" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><ClipboardList size={16} /> SH-4 DOCUMENTATION</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-gray-50">
                                    <span className="text-xs text-gray-600">Share Certificate</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'certificate')} className="text-[10px] w-24" />
                                </div>
                                <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-gray-50">
                                    <span className="text-xs text-gray-600">Draft SH-4 Deed</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'sh4')} className="text-[10px] w-24" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-navy mb-4">Confirm Details</h2>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between"><span>Plan</span><span className="font-bold text-navy">{plans[selectedPlan]?.title}</span></div>
                            <div className="flex justify-between"><span>Company</span><span className="font-bold">{formData.companyName}</span></div>
                            <div className="flex justify-between"><span>Shares</span><span className="font-bold">{formData.numberOfShares}</span></div>
                            <div className="flex justify-between"><span>Transferor</span><span className="font-bold">{formData.transferorName}</span></div>
                            <div className="flex justify-between"><span>Transferee</span><span className="font-bold">{formData.transfereeName}</span></div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                        <IndianRupee size={32} className="mx-auto mb-4 text-green-600" />
                        <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                            <div className="flex justify-between text-sm"><span>Service Fee</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFee.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center">
                            <input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} />
                            I Accept Terms & Conditions
                        </label>
                        <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    // --- MODAL LAYOUT: SPLIT VIEW (Left Sidebar + Right Content) ---
    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK - Hidden on Mobile */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Share Transfer
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
                                    <span className="text-white font-medium font-mono">₹{Math.max(0, billDetails.total - billDetails.base).toLocaleString()}</span>
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
                        {['Transfer Info', 'Parties', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Share Transfer</span>
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
                                {currentStep === 1 && "Transfer Details"}
                                {currentStep === 2 && "Parties Involved"}
                                {currentStep === 3 && "Document Evidence"}
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
                                <p className="text-gray-500 mt-2">Order ID: {automationPayload?.submissionId}</p>
                                <button onClick={onClose || (() => navigate(-1))} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
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

    // --- STANDARD FULL PAGE LAYOUT ---
    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase"><ArrowLeft size={14} /> Back</button>
                <div className="flex gap-8">
                    <div className="w-72 hidden lg:block space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                            {['Transfer', 'Parties', 'Docs', 'Review', 'Payment'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-[#043E52] text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        <div className="mt-6 flex justify-between">
                            <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1} className="px-6 py-2 rounded border">Back</button>
                            <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-6 py-2 rounded">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareTransferRegistration;
