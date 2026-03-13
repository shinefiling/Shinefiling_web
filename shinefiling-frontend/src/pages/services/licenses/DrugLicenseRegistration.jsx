import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Pill, Thermometer, AlertTriangle, X, Shield, Activity, Landmark
} from 'lucide-react';
import { uploadFile, submitDrugLicense } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const DrugLicenseRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const [formData, setFormData] = useState({
        businessName: '',
        state: '',
        entityType: 'Proprietorship',
        premisesAddress: '',
        areaInSqMeters: '',
        hasColdStorage: false,
        pharmacistName: '',
        pharmacistRegNo: '',
        licenseType: 'RETAIL'
    });

    const [uploadedFiles, setUploadedFiles] = useState({});

    // Dynamic Pricing
    const pricing = {
        advisory: { price: 999, title: "Expert Drug Licensing Advisory" },
        standard: { price: 7999, title: "Retail/Wholesale Drug License" },
        manufacturing: { price: 24999, title: "Manufacturing Drug License" }
    };

    const currentPricing = pricing[planProp] || pricing.standard;
    const price = currentPricing.price;

    const billDetails = useMemo(() => {
        const basePrice = price;
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
    }, [price]);

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan) setFormData(prev => ({ ...prev, licenseType: plan.toUpperCase() }));
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Identity
            if (!formData.businessName) { newErrors.businessName = "Business name required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
        }
        else if (step === 2) { // Operational Hub
            if (!formData.premisesAddress) { newErrors.premisesAddress = "Address required"; isValid = false; }
            if (!formData.areaInSqMeters) { newErrors.areaInSqMeters = "Area required"; isValid = false; }
            else if (parseFloat(formData.areaInSqMeters) < 10) { newErrors.areaInSqMeters = "Min 10 Sq.m required"; isValid = false; }
            if (!formData.pharmacistName) { newErrors.pharmacistName = "Pharmacist required"; isValid = false; }
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
            const response = await uploadFile(file, 'drug_license');
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
            description: `Payment for ${currentPricing.title} - Drug License`,
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
                        submissionId: `DRUG-${Date.now()}`,
                        userEmail: email,
                        userPhone: phone,
                        plan: formData.licenseType,
                        amountPaid: billDetails.total,
                        businessName: formData.businessName,
                        state: formData.state,
                        licenseType: formData.licenseType,
                        status: "PAYMENT_SUCCESSFUL",
                        formData: {
                            ...formData,
                            areaInSqMeters: parseFloat(formData.areaInSqMeters) || 0
                        },
                        documents: docsList,
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };

                    await submitDrugLicense(finalPayload);
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
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm font-poppins text-navy text-zinc-800">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Activity size={18} className="text-[#ED6E3F]" /> Business Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Business Name (Pharmacys/Store)</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="e.g. LifeCare Pharmacy" className={`w-full p-4 bg-gray-50 border ${errors.businessName ? 'border-red-500' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">License Type</label>
                                    <select name="licenseType" value={formData.licenseType} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none">
                                        <option value="RETAIL">Retail Drug License</option>
                                        <option value="WHOLESALE">Wholesale Drug License</option>
                                        <option value="BOTH">Both (Retail + Wholesale)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Constitution</label>
                                    <select name="entityType" value={formData.entityType} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none">
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Private Limited">Private Limited</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Operating State</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-4 bg-gray-50 border ${errors.state ? 'border-red-500' : 'border-gray-100'} rounded-xl text-sm outline-none`}>
                                        <option value="">Select State</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm font-poppins text-navy">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Landmark size={18} className="text-[#ED6E3F]" /> Operational Center
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Premises Full Address</label>
                                    <textarea name="premisesAddress" value={formData.premisesAddress} onChange={handleInputChange} rows={3} placeholder="Full address with Pincode..." className={`w-full p-4 bg-gray-50 border ${errors.premisesAddress ? 'border-red-500' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all resize-none`} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Carpet Area (in Sq Meters)</label>
                                        <input type="number" step="0.1" name="areaInSqMeters" value={formData.areaInSqMeters} onChange={handleInputChange} placeholder="Min 10 Sq.m" className={`w-full p-4 bg-gray-50 border ${errors.areaInSqMeters ? 'border-red-500' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" name="hasColdStorage" checked={formData.hasColdStorage} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-[#ED6E3F] focus:ring-[#ED6E3F]" />
                                            <span className="font-bold text-xs text-navy uppercase tracking-widest group-hover:text-[#ED6E3F]">Cold Storage Available?</span>
                                            <Thermometer size={14} className="text-blue-500" />
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Pharmacist / Competent Person Name</label>
                                        <input type="text" name="pharmacistName" value={formData.pharmacistName} onChange={handleInputChange} placeholder="Full Name" className={`w-full p-4 bg-gray-50 border ${errors.pharmacistName ? 'border-red-500' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Registration No. (if applicable)</label>
                                        <input type="text" name="pharmacistRegNo" value={formData.pharmacistRegNo} onChange={handleInputChange} placeholder="Reg. ID" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm font-poppins text-navy">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Upload size={18} className="text-[#ED6E3F]" /> Compliance Vault
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'PHARMACIST_CERT', label: 'Pharmacist Certificate', icon: FileText },
                                    { id: 'RENT_AGREEMENT', label: 'Rent Agreement', icon: FileText },
                                    { id: 'BLUEPRINT', label: 'Shop Blue Print', icon: MapPin },
                                    { id: 'PRINTER_INVOICE', label: 'Refrigerator Invoice', icon: Shield }
                                ].map((doc) => (
                                    <div key={doc.id} className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${uploadedFiles[doc.id] ? 'bg-emerald-50/30 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:border-[#ED6E3F]/50 group'}`}>
                                        <div className={`w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${uploadedFiles[doc.id] ? 'text-green-500' : 'text-gray-400'}`}>
                                            <doc.icon size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-navy mb-0.5">{doc.label}</p>
                                            <p className="text-[8px] text-gray-400 font-medium uppercase tracking-widest font-black">PDF (Max 5MB)</p>
                                        </div>
                                        <label className="cursor-pointer">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${uploadedFiles[doc.id] ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                                {uploadedFiles[doc.id] ? 'Replace' : 'Upload'}
                                            </span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png" />
                                        </label>
                                        {uploadedFiles[doc.id] && (
                                            <div className="flex items-center gap-1 text-[8px] font-bold text-green-700 uppercase tracking-widest">
                                                <CheckCircle size={10} /> {uploadedFiles[doc.id].name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto font-poppins text-navy">
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#059669] shadow-lg shadow-emerald-500/10 rotate-3">
                                <IndianRupee size={32} />
                            </div>

                            <h2 className="text-2xl font-bold text-navy mb-2 tracking-tight uppercase">Checkout</h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8">Drug License Fee Protocol</p>

                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-4 text-xs border border-gray-100 shadow-inner">
                                <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Professional Service</span>
                                    <span className="text-navy">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Compliance Fees</span>
                                    <span className="text-[#ED6E3F]">₹{(billDetails.total - billDetails.base).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-gray-200"></div>
                                <div className="flex justify-between items-center text-3xl font-bold text-navy">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Total</span>
                                    <span className="tracking-tighter">₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center">
                                <input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} />
                                I Accept Terms & Conditions
                            </label>
                            <button
                                onClick={submitApplication}
                                disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing}
                                className="w-full py-4 bg-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                            >
                                {isSubmitting || isPaymentProcessing ? 'Authorizing Payment...' : 'Complete Payment'}
                                {!isSubmitting && !isPaymentProcessing && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
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
                            Drug License
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight mb-4">{currentPricing.title}</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Service Fee</span>
                                    <span className="text-white font-medium font-mono">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Tax & Fees</span>
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

                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Store Identity', 'Operational Hub', 'Document Vault', 'Review & Pay'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Drug License</span>
                                </div>
                            </div>

                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Store Details"}
                                {currentStep === 2 && "Physical Coordinates"}
                                {currentStep === 3 && "Verified Vault"}
                                {currentStep === 4 && "Final Summary"}
                            </h2>
                        </div>

                        <button onClick={onClose || (() => navigate(-1))} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {apiError && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                <AlertTriangle size={16} /> {apiError}
                            </div>
                        )}

                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Filed!</h2>
                                <p className="text-gray-500 mt-2">Your data has been queued for professional review.</p>
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
                            {['Store Identity', 'Physical Hub', 'Documents', 'Payment'].map((s, i) => (
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

export default DrugLicenseRegistration;
