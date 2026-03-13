import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Store, Building, Globe, Zap, AlertTriangle, BookOpen, Clock, Building2, Utensils, ClipboardList, CreditCard, X, Shield, Activity, Award, RefreshCw
} from 'lucide-react';
import { uploadFile, submitFssaiLicense } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const validatePlan = (plan) => {
    return ['basic', 'state', 'central', 'renewal', 'advisory', 'modification'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'basic';
};

const FSSAILicenseRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const pricing = {
        basic: { serviceFee: 1499, title: "Basic Registration", icon: Utensils },
        state: { serviceFee: 4999, title: "State License", icon: Store },
        central: { serviceFee: 7499, title: "Central License", icon: Globe },
        renewal: { serviceFee: 999, title: "License Renewal", icon: Clock },
        advisory: { serviceFee: 999, title: "FSSAI Expert Advisory", icon: Award },
        modification: { serviceFee: 1499, title: "License Modification", icon: RefreshCw }
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const typeParam = searchParams.get('type') || searchParams.get('plan');

    const [currentStep, setCurrentStep] = useState(1);
    const [licenseType, setLicenseType] = useState(() => validatePlan(planProp || typeParam));

    useEffect(() => {
        const targetPlan = validatePlan(planProp || typeParam);
        if (targetPlan !== licenseType) {
            setLicenseType(targetPlan);
        }
    }, [typeParam, planProp]);

    const [formData, setFormData] = useState({
        businessName: '',
        gstNumber: '',
        businessType: '',
        turnover: '',
        validityYears: '1',
        address: '',
        foodCategory: '',
        isImporterExporter: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    // Auto-calculate license type based on turnover input
    useEffect(() => {
        if (!formData.turnover) return;
        if (licenseType === 'renewal') return;

        if (formData.isImporterExporter) {
            setLicenseType('central');
            return;
        }

        const t = parseFloat(formData.turnover);
        if (isNaN(t)) return;

        if (t > 200000000) {
            if (licenseType !== 'central') setLicenseType('central');
        } else if (t > 1200000) {
            if (licenseType !== 'central' && licenseType !== 'state') setLicenseType('state');
        } else {
            if (licenseType !== 'basic') setLicenseType('basic');
        }
    }, [formData.turnover, formData.isImporterExporter, licenseType]);

    const billDetails = useMemo(() => {
        const plan = pricing[licenseType] || pricing.basic;
        const basePrice = plan.serviceFee;
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
    }, [licenseType]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.businessName) { newErrors.businessName = "Required"; isValid = false; }
            if (!formData.businessType) { newErrors.businessType = "Required"; isValid = false; }
            if (!formData.turnover) { newErrors.turnover = "Required"; isValid = false; }
        } else if (step === 2) {
            if (!formData.address) { newErrors.address = "Required"; isValid = false; }
            if (!formData.foodCategory) { newErrors.foodCategory = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'fssai_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id }
            }));
        } catch (error) {
            alert("Upload failed.");
        }
    };

    const submitApplication = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || formData.userEmail || "guest@example.com";
        const phone = userObj?.phone || formData.userPhone || "9999999999";

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${pricing[licenseType]?.title} - FSSAI`,
            prefill: {
                name: userObj?.name || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                setApiError(null);
                try {
                    const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
                    const finalPayload = {
                        submissionId: `FSSAI-${Date.now()}`,
                        userEmail: email,
                        userPhone: phone,
                        plan: licenseType,
                        amountPaid: billDetails.total,
                        businessName: formData.businessName,
                        businessType: formData.businessType,
                        businessCategory: formData.foodCategory,
                        annualTurnover: parseFloat(formData.turnover),
                        validityYears: parseInt(formData.validityYears),
                        licenseType: licenseType.toUpperCase(),
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
                    await submitFssaiLicense(finalPayload);
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
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Activity size={16} /> BUSINESS CONTEXT</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Organization Name</p>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="As per documents" className={`w-full p-2 text-sm border rounded-lg ${errors.businessName ? 'border-red-500' : ''}`} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Constitution</p>
                                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className={`w-full p-2 text-sm border rounded-lg ${errors.businessType ? 'border-red-500' : ''}`}>
                                        <option value="">-- Select Constitution --</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership / LLP</option>
                                        <option value="Private Limited">Private Limited</option>
                                        <option value="OPC">One Person Company</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Annual Turnover</p>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                                        <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} placeholder="e.g. 500000" className={`w-full p-2 pl-7 text-sm border rounded-lg ${errors.turnover ? 'border-red-500' : ''}`} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 mt-2">
                                    <label className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg cursor-pointer">
                                        <input type="checkbox" name="isImporterExporter" checked={formData.isImporterExporter} onChange={handleInputChange} className="w-4 h-4" />
                                        <div>
                                            <span className="text-xs text-gray-700 font-medium">Exporter / Importer activity?</span>
                                            <p className="text-[10px] text-gray-500">Triggers Central License automatically</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><MapPin size={16} /> LOCATION & CATEGORIES</h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Operating Address</p>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder="Full address of food unit..." className={`w-full p-2 text-sm border rounded-lg resize-none ${errors.address ? 'border-red-500' : ''}`} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Food Category</p>
                                    <input type="text" name="foodCategory" value={formData.foodCategory} onChange={handleInputChange} placeholder="e.g. Bakery, Ready-to-eat, Dairy" className={`w-full p-2 text-sm border rounded-lg ${errors.foodCategory ? 'border-red-500' : ''}`} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">License Validity Period</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[1, 2, 3, 4, 5].map(y => (
                                            <button key={y} type="button" onClick={() => setFormData({ ...formData, validityYears: y })} className={`p-2 rounded-lg border text-xs font-medium transition-all ${formData.validityYears == y ? 'bg-[#043E52] border-[#043E52] text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                                {y} Yr
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Upload size={16} /> REQUIRED DOCUMENTS</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { id: 'owner_photo', label: 'Authorized Person Photo', icon: FileText },
                                    { id: 'premises_proof', label: 'Premises Proof', icon: Building2 }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-gray-50 hover:border-[#ED6E3F] transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">{doc.label}</span>
                                            {uploadedFiles[doc.id] && <span className="text-[9px] text-green-600 font-bold truncate w-24">{uploadedFiles[doc.id].name}</span>}
                                        </div>
                                        <label className="cursor-pointer">
                                            <span className={`px-3 py-1 rounded text-[10px] font-black uppercase text-white ${uploadedFiles[doc.id] ? 'bg-green-500' : 'bg-[#043E52] hover:bg-black'}`}>
                                                {uploadedFiles[doc.id] ? 'Change' : 'Upload'}
                                            </span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
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
                        <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">
                            {isSubmitting || isPaymentProcessing ? 'Authorizing Payment...' : 'Pay & Submit'}
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
                            FSSAI License
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight mb-4">{pricing[licenseType]?.title}</p>
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
                        {['Business Context', 'Location', 'Documents', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">FSSAI License</span>
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

                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Business Context"}
                                {currentStep === 2 && "Location & Category"}
                                {currentStep === 3 && "Document Upload"}
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
                                <p className="text-gray-500 mt-2">Your FSSAI application is now under processing.</p>
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
                            {['Business Context', 'Location', 'Documents', 'Payment'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-[#043E52] text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        {!isSuccess && (
                            <div className="mt-6 flex justify-between">
                                <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2 font-bold text-gray-500">Back</button>
                                {currentStep < 4 && <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-8 py-2 rounded-xl font-bold">Next</button>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FSSAILicenseRegistration;
