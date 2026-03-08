
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, Building2, MapPin,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, CreditCard
} from 'lucide-react';
import { uploadFile, submitChangeRegisteredOffice } from '../../../api';

const validatePlan = (plan) => {
    return ['same_city', 'same_roc', 'different_state'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'same_city';
};

const ChangeRegisteredOfficeRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        same_city: { price: 1999, title: 'Local Shift', icon: MapPin },
        same_roc: { price: 4999, title: 'State Shift', icon: Building2 },
        different_state: { price: 19999, title: 'Inter-State Shift', icon: Briefcase }
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
        existingAddress: '',
        newAddress: '',
        city: '',
        state: '',
        pincode: '',
        effectiveDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.same_city;
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
            if (!formData.companyName) { newErrors.companyName = "Required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "Required"; isValid = false; }
            if (!formData.effectiveDate) { newErrors.effectiveDate = "Required"; isValid = false; }
        } else if (step === 2) {
            if (!formData.newAddress) { newErrors.newAddress = "Required"; isValid = false; }
            if (!formData.pincode) { newErrors.pincode = "Required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'office_change_docs');
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
            const finalPayload = {
                submissionId: `ROCOFFICE-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                amountPaid: billDetails.total,
                status: "PAYMENT_SUCCESSFUL"
            };
            await submitChangeRegisteredOffice(finalPayload);
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
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Company CIN</label>
                                    <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} placeholder="U12345DL2024PTC123456" maxLength={21} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-mono tracking-widest uppercase text-sm" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Registered Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter full name as per MCA" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-bold text-sm" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Existing Registered Address</label>
                                    <textarea name="existingAddress" value={formData.existingAddress} onChange={handleInputChange} placeholder="As per MCA records" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm" rows="2" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Effective Date of Shifting</label>
                                    <input type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // New Address
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <MapPin size={16} className="text-[#ED6E3F]" /> NEW REGISTERED OFFICE
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1 md:col-span-3">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Complete New Address</label>
                                    <textarea name="newAddress" value={formData.newAddress} onChange={handleInputChange} placeholder="Shop/Building No, Area, Street" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm" rows="3" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">State</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Pincode</label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="000000" maxLength={6} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Uploads
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-navy">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <ClipboardList size={16} className="text-[#ED6E3F]" /> ADDRESS EVIDENCE
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.utility ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-700">Utility Bill</p>
                                        <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Not older than 2 months</p>
                                    </div>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md transition-all ${uploadedFiles.utility ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.utility ? 'Change File' : 'Upload Bill'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'utility')} />
                                    </label>
                                </div>
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.noc ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-700">Owner NOC</p>
                                        <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Or Rent Agreement</p>
                                    </div>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md transition-all ${uploadedFiles.noc ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.noc ? 'Change File' : 'Upload NOC'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'noc')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-600 shadow-lg shadow-orange-500/10">
                                <CreditCard size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-navy mb-2 tracking-tight uppercase italic">Filing Assessment</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60 italic">INC-22 Statutory Service Charge</p>

                            <div className="bg-slate-50 p-8 rounded-3xl mb-8 space-y-4 font-poppins text-sm border-2 border-white">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>SHIFT TYPE</span>
                                    <span className="px-4 py-1.5 bg-navy text-white rounded-full italic">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex justify-between text-2xl font-black text-navy underline decoration-[#ED6E3F] decoration-4 underline-offset-8 italic">
                                    <span className="text-[10px] self-end mb-1 text-slate-400 not-italic font-bold">TOTAL PAYABLE</span>
                                    <span>₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-navy/30 hover:bg-black transition-all flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? 'PROCESSING COMPLIANCE...' : 'AUTHORIZE OFFICE CHANGE'}
                                {!isSubmitting && <ArrowRight size={20} />}
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
                            Change Office
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
                        {['Company Info', 'New Address', 'Documents', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Change Registered Office</span>
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
                                {currentStep === 2 && "New Office Address"}
                                {currentStep === 3 && "Document Evidence"}
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

export default ChangeRegisteredOfficeRegistration;
