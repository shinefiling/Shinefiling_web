import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Building, AlertTriangle, X, Shield, Store, Calendar, Briefcase
} from 'lucide-react';
import { uploadFile, submitTradeLicense } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const TradeLicenseRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const [planType, setPlanType] = useState(planProp || 'standard');
    const plans = {
        advisory: { price: 999, title: "Expert Trade Advisory" },
        standard: { price: 2999, title: "New Trade License" },
        new: { price: 2999, title: "New Trade License" },
        renewal: { price: 1999, title: "License Renewal" }
    };

    const [formData, setFormData] = useState({
        businessName: '',
        entityType: '',
        natureOfTrade: '',
        commencementDate: '',
        address: '',
        city: '',
        state: '',
        wardNumber: '',
        areaSquareFeet: '',
        isRented: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});

    const billDetails = useMemo(() => {
        const basePrice = plans[planType]?.price || 2999;
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
    }, [planType]);

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan && plans[plan]) setPlanType(plan);
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Info
            if (!formData.businessName) { newErrors.businessName = "Business name required"; isValid = false; }
            if (!formData.natureOfTrade) { newErrors.natureOfTrade = "Nature of trade required"; isValid = false; }
            if (!formData.entityType) { newErrors.entityType = "Entity type required"; isValid = false; }
        }
        else if (step === 2) { // Location & Area
            if (!formData.address) { newErrors.address = "Address required"; isValid = false; }
            if (!formData.areaSquareFeet) { newErrors.areaSquareFeet = "Area required"; isValid = false; }
            if (!formData.commencementDate) { newErrors.commencementDate = "Date required"; isValid = false; }
            if (!formData.city) { newErrors.city = "City required"; isValid = false; }
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
            const response = await uploadFile(file, 'trade_docs');
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
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const submitApplication = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || "guest@example.com";
        const phone = userObj?.phone || "9999999999";

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${plans[planType]?.title} - Trade License`,
            prefill: {
                name: userObj?.name || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                setApiError(null);
                try {
                    const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                        id: k,
                        filename: v.name,
                        fileUrl: v.fileUrl
                    }));

                    const finalPayload = {
                        submissionId: `TRADE-${Date.now()}`,
                        userEmail: email,
                        userPhone: phone,
                        plan: planType,
                        amountPaid: billDetails.total,
                        businessName: formData.businessName,
                        city: formData.city,
                        status: "PAYMENT_SUCCESSFUL",
                        formData: formData,
                        documents: docsList,
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };

                    await submitTradeLicense(finalPayload);
                    setIsSuccess(true);
                } catch (error) {
                    setApiError(error.message);
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm font-poppins text-navy">
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Store size={18} className="text-[#3b82f6]" /> Trade Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Business Name (Trade Name)</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="e.g. Apex General Stores" className={`w-full p-4 bg-slate-50 border ${errors.businessName ? 'border-red-500' : 'border-gray-200'} rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nature of Trade</label>
                                    <input type="text" name="natureOfTrade" value={formData.natureOfTrade} onChange={handleInputChange} placeholder="e.g. Retail / IT Services" className={`w-full p-4 bg-slate-50 border ${errors.natureOfTrade ? 'border-red-500' : 'border-gray-200'} rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Constitution</label>
                                    <select name="entityType" value={formData.entityType} onChange={handleInputChange} className={`w-full p-4 bg-slate-50 border ${errors.entityType ? 'border-red-500' : 'border-gray-200'} rounded-2xl font-bold text-sm outline-none`}>
                                        <option value="">Select Type</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Private Limited">Private Limited</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Application Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(plans).map(([key, plan]) => (
                                            <button key={key} type="button" onClick={() => setPlanType(key)} className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${planType === key ? 'bg-blue-50 border-[#3b82f6] text-[#3b82f6]' : 'bg-slate-50 border-transparent text-slate-400 opacity-60'}`}>
                                                {plan.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm font-poppins text-navy">
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin size={18} className="text-[#3b82f6]" /> Trade Location
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Business Premises Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder="Full address of the trade establishment..." className={`w-full p-4 bg-slate-50 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all resize-none`} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">City / Municipality</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Name of City" className={`w-full p-4 bg-slate-50 border ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Ward Number (if known)</label>
                                        <input type="text" name="wardNumber" value={formData.wardNumber} onChange={handleInputChange} placeholder="Ward ID" className="w-full p-4 bg-slate-50 border border-gray-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Total Area (Sq. Ft)</label>
                                        <input type="number" name="areaSquareFeet" value={formData.areaSquareFeet} onChange={handleInputChange} placeholder="Area" className={`w-full p-4 bg-slate-50 border ${errors.areaSquareFeet ? 'border-red-500' : 'border-gray-200'} rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Trade Commencement Date</label>
                                        <input type="date" name="commencementDate" value={formData.commencementDate} onChange={handleInputChange} className={`w-full p-4 bg-slate-50 border ${errors.commencementDate ? 'border-red-500' : 'border-gray-200'} rounded-2xl font-bold text-sm outline-none transition-all`} />
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-200 cursor-pointer group transition-all">
                                    <input type="checkbox" name="isRented" checked={formData.isRented} onChange={handleInputChange} className="w-5 h-5 text-[#3b82f6] rounded transition-all" />
                                    <div className="flex-1">
                                        <span className="font-bold text-sm text-navy group-hover:text-[#3b82f6]">Property is Rented</span>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Select this if you don't own the premises</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm font-poppins text-navy">
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Upload size={18} className="text-[#3b82f6]" /> Artifact Gallery
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={`relative p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-4 ${uploadedFiles.property_tax ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-[#3b82f6]/50 group'}`}>
                                    <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center ${uploadedFiles.property_tax ? 'text-green-500' : 'text-slate-400 group-hover:text-[#3b82f6]'}`}>
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-navy mb-1">Property Tax Receipt</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">Ownership Proof</p>
                                    </div>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${uploadedFiles.property_tax ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                            {uploadedFiles.property_tax ? 'Replace' : 'Upload File'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'property_tax')} accept=".pdf,.jpg,.png" />
                                    </label>
                                    {uploadedFiles.property_tax && <div className="mt-2 text-[10px] font-bold text-green-700">{uploadedFiles.property_tax.name}</div>}
                                </div>

                                {formData.isRented && (
                                    <div className={`relative p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-4 ${uploadedFiles.rent_agreement ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-[#3b82f6]/50 group'}`}>
                                        <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center ${uploadedFiles.rent_agreement ? 'text-green-500' : 'text-slate-400 group-hover:text-[#3b82f6]'}`}>
                                            <Shield size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-navy mb-1">Rent Agmt / NOC</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Legal Clearance</p>
                                        </div>
                                        <label className="cursor-pointer">
                                            <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${uploadedFiles.rent_agreement ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                                {uploadedFiles.rent_agreement ? 'Replace' : 'Upload File'}
                                            </span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'rent_agreement')} accept=".pdf,.jpg,.png" />
                                        </label>
                                        {uploadedFiles.rent_agreement && <div className="mt-2 text-[10px] font-bold text-green-700">{uploadedFiles.rent_agreement.name}</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto font-poppins text-navy">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-navy/5 border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="w-24 h-24 bg-blue-50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-blue-600 shadow-xl shadow-blue-500/10 rotate-3">
                                <IndianRupee size={36} />
                            </div>

                            <h2 className="text-2xl font-black text-navy mb-2 tracking-tight uppercase">Settlement Center</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 opacity-70">Trade License Processing</p>

                            <div className="bg-slate-50/50 backdrop-blur-sm p-8 rounded-3xl mb-10 space-y-5 text-sm border-2 border-white shadow-inner">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Professional Fee</span>
                                    <span className="text-navy font-bold text-sm">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Taxes & Filing</span>
                                    <span className="text-navy font-bold text-sm">₹{(billDetails.total - billDetails.base).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex justify-between items-center text-3xl font-black text-navy">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</span>
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
                                className="w-full py-5 bg-navy text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-navy/20 hover:bg-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                {isSubmitting || isPaymentProcessing ? 'Authorizing Payment...' : 'Authorize Submission'}
                                {!isSubmitting && !isPaymentProcessing && <ArrowRight size={20} />}
                            </button>
                        </div>
                    </motion.div>
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
                            Trade License
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight mb-4">{plans[planType]?.title || 'Standard Trade License'}</p>
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

                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Business Profile', 'Location', 'Documents', 'Payment'].map((step, i) => (
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
                            {/* Mobile Info */}
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">Trade License</span>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Total Payable</span>
                                        <span className="text-xs font-bold text-green-600">₹{billDetails.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Business Details"}
                                {currentStep === 2 && "Operational Area"}
                                {currentStep === 3 && "Document Vault"}
                                {currentStep === 4 && "Final Summary"}
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
                                <h2 className="text-2xl font-bold text-navy">Filing Initiated!</h2>
                                <p className="text-gray-500 mt-2">Your application has been received successfully.</p>
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

    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase"><ArrowLeft size={14} /> Back</button>
                <div className="flex gap-8">
                    <div className="w-72 hidden lg:block space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                            {['Business Details', 'Location', 'Documents', 'Payment'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-navy text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        <div className="mt-6 flex justify-between">
                            <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2 font-bold text-gray-500">Back</button>
                            {currentStep < 4 && <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-8 py-2 rounded-xl font-bold">Next</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradeLicenseRegistration;
