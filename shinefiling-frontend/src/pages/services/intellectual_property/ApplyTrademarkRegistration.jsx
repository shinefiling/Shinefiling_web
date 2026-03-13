import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Copyright, Globe, Briefcase, User, AlertTriangle, X, Shield
} from 'lucide-react';
import { uploadFile, submitTrademarkRegistration } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const validatePlan = (plan) => {
    return ['basic', 'standard', 'corporate'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const ApplyTrademarkRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState(() => validatePlan(planProp || searchParams.get('plan')));

    const planFromUrl = searchParams.get('plan');
    useEffect(() => {
        const targetPlan = validatePlan(planProp || planFromUrl);
        if (targetPlan !== planType) {
            setPlanType(targetPlan);
        }
    }, [planProp, planFromUrl]);

    // Plans
    const plans = {
        basic: { title: "Basic", serviceFee: 999 },
        standard: { title: "Standard", serviceFee: 1499 },
        corporate: { title: "Corporate", serviceFee: 2999 },
    };

    const [formData, setFormData] = useState({
        brandName: '',
        trademarkType: 'WORDMARK',
        classNumber: '',
        goodsDescription: '',
        applicantType: 'INDIVIDUAL',
        ownerName: '',
        ownerAddress: '',
        isUseDateClean: true,
        useDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Memoize bill details - Updated carefully based on user's ₹1,209 screenshot for ₹999 plan
    const billDetails = useMemo(() => {
        const selectedPricing = plans[planType] || plans.standard;
        const basePrice = selectedPricing.serviceFee;

        // Requirement: Platform Fee (3%) + Taxes (18%) = 21% total extra on service
        const platformFee = Math.round(basePrice * 0.03); // 3%
        const gst = Math.round(basePrice * 0.18);         // 18%

        // Registry Fee (Govt Fee) - Separate from professional taxes
        const govtFee = (['INDIVIDUAL', 'STARTUP', 'SMALL_ENTERPRISE'].includes(formData.applicantType)) ? 4500 : 9000;

        return {
            base: basePrice,
            platformFee,
            gst,
            govt: govtFee,
            taxesTotal: platformFee + gst, // 21% extra (Matches user's ₹210 for ₹999 -> Total 1209)
            total: basePrice + platformFee + gst, // EXCLUDING govtFee from immediate total (Private Limited pattern)
            planName: selectedPricing.title
        };
    }, [planType, formData.applicantType]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.brandName) { newErrors.brandName = "Required"; isValid = false; }
            if (!formData.classNumber) { newErrors.classNumber = "Required"; isValid = false; }
            if (!formData.goodsDescription) { newErrors.goodsDescription = "Required"; isValid = false; }
        } else if (step === 2) {
            if (!formData.ownerName) { newErrors.ownerName = "Required"; isValid = false; }
            if (!formData.ownerAddress) { newErrors.ownerAddress = "Required"; isValid = false; }
            if (!formData.isUseDateClean && !formData.useDate) { newErrors.useDate = "Required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(5, prev + 1));
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'trademark');
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName, fileUrl: response.fileUrl } }));
        } catch (error) {
            alert("Upload failed.");
        }
    };

    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const submitApplication = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || 'guest@example.com';
        const phone = userObj?.phone || '';

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${billDetails.planName} - Trademark Registration`,
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
                        submissionId: `TM-${Date.now()}`,
                        plan: planType,
                        userEmail: email,
                        userPhone: phone,
                        formData,
                        documents: docsList,
                        status: "PAYMENT_SUCCESSFUL",
                        amountPaid: billDetails.total,
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };
                    await submitTrademarkRegistration(finalPayload);
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
            case 1: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2 uppercase tracking-tight">
                            <div className="bg-orange-100 p-1.5 rounded-lg"><Copyright size={16} className="text-orange-600" /></div> Mark Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block ml-1">Brand / Word Mark Name</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        name="brandName"
                                        value={formData.brandName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your brand name"
                                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.brandName ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-200 focus:border-navy focus:ring-4 focus:ring-navy/5'} rounded-xl text-sm transition-all outline-none`}
                                    />
                                </div>
                                {errors.brandName && <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.brandName}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block ml-1">Trademark Type</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <select
                                        name="trademarkType"
                                        value={formData.trademarkType}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-navy focus:ring-4 focus:ring-navy/5 transition-all outline-none appearance-none"
                                    >
                                        <option value="WORDMARK">Wordmark (Text only)</option>
                                        <option value="DEVICE">Device / Logo</option>
                                        <option value="COLOUR">Colour Mark</option>
                                        <option value="SHAPE">Shape of Goods</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block ml-1 uppercase">Class Number</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        name="classNumber"
                                        value={formData.classNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 35, 9, 42"
                                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.classNumber ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-200 focus:ring-4 focus:ring-navy/5'} rounded-xl text-sm outline-none transition-all focus:border-navy`}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block ml-1">Goods/Services Description</label>
                                <textarea
                                    name="goodsDescription"
                                    value={formData.goodsDescription}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="Describe your business activities in this class..."
                                    className={`w-full p-4 bg-slate-50 border ${errors.goodsDescription ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-200 focus:border-navy focus:ring-4 focus:ring-navy/5'} rounded-xl text-sm outline-none transition-all resize-none`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2 uppercase tracking-tight">
                            <div className="bg-indigo-100 p-1.5 rounded-lg"><User size={16} className="text-indigo-600" /></div> Applicant Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Applicant Category</label>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {[
                                        { id: 'INDIVIDUAL', label: 'Individual' },
                                        { id: 'STARTUP', label: 'Startup' },
                                        { id: 'SMALL_ENTERPRISE', label: 'MSME' },
                                        { id: 'OTHERS', label: 'Company' }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => handleInputChange({ target: { name: 'applicantType', value: type.id } })}
                                            className={`py-3 px-2 text-[10px] font-black rounded-xl border transition-all ${formData.applicantType === type.id ? 'bg-navy text-white border-navy shadow-lg shadow-navy/10' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block ml-1">Owner / Entity Name</label>
                                <input
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                    placeholder="Full name or company name"
                                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.ownerName ? 'border-red-500' : 'border-slate-200 focus:border-navy'} rounded-xl text-sm outline-none transition-all`}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block ml-1">Business Address</label>
                                <input
                                    name="ownerAddress"
                                    value={formData.ownerAddress}
                                    onChange={handleInputChange}
                                    placeholder="Full address for registry records"
                                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.ownerAddress ? 'border-red-500' : 'border-slate-200 focus:border-navy'} rounded-xl text-sm outline-none transition-all`}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input type="checkbox" name="isUseDateClean" checked={formData.isUseDateClean} onChange={handleInputChange} className="w-4 h-4 text-navy rounded border-slate-300" />
                                    <span className="text-xs font-bold text-slate-700">Proposed to be used (New Brand)</span>
                                </label>
                                {!formData.isUseDateClean && (
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 animate-in slide-in-from-top-2">
                                        <label className="text-[10px] font-bold text-orange-600 uppercase mb-1.5 block">First date of use in India</label>
                                        <input type="date" name="useDate" value={formData.useDate} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl text-sm outline-none" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2 uppercase tracking-tight">
                            <div className="bg-green-100 p-1.5 rounded-lg"><Upload size={16} className="text-green-600" /></div> Required Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'LOGO', label: 'Brand Logo' },
                                { id: 'AUTHORIZATION', label: 'Authorization Form' },
                                { id: 'ID_PROOF', label: 'ID Proof' },
                                { id: 'MSME', label: 'MSME / Startup Cert' }
                            ].map((doc) => (
                                <div key={doc.id} className="group relative border-2 border-dashed border-slate-200 p-5 rounded-2xl text-center hover:border-navy/30 hover:bg-slate-50 transition-all">
                                    <label className="cursor-pointer block">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white transition-colors">
                                            <FileText size={18} className="text-slate-400 group-hover:text-navy" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700 block mb-3">{doc.label}</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                        {uploadedFiles[doc.id] ?
                                            <div className="flex items-center justify-center gap-1.5">
                                                <CheckCircle size={12} className="text-green-500" />
                                                <span className="text-[10px] text-green-600 font-black truncate max-w-[120px]">{uploadedFiles[doc.id].name}</span>
                                            </div> :
                                            <span className="text-[10px] bg-slate-900 text-white px-4 py-1.5 rounded-full font-bold">Choose File</span>}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full opacity-50"></div>
                        <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-tight relative z-10">Review Registration Info</h3>
                        <div className="space-y-3 relative z-10">
                            {[
                                { l: 'Brand Name', v: formData.brandName },
                                { l: 'Class', v: `Class ${formData.classNumber}` },
                                { l: 'Applicant', v: formData.ownerName },
                                { l: 'Category', v: formData.applicantType.replace('_', ' ') },
                                { l: 'Plan', v: billDetails.planName, c: 'text-orange-600' }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-xs p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <span className="text-slate-500 font-medium">{item.l}</span>
                                    <span className={`font-bold ${item.c || 'text-navy'}`}>{item.v || 'Not provided'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
            case 5: return (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl text-center animate-in zoom-in-95 max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IndianRupee size={32} className="text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-black text-navy mb-2">Final Step</h3>
                    <p className="text-xs text-slate-500 mb-8 font-medium px-4 leading-relaxed">Secure payment for Trademark Government Filing & Service Fees.</p>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-xs text-left shadow-inner border border-slate-100">
                        <div className="flex justify-between items-center group">
                            <span className="text-slate-500 group-hover:text-slate-800 transition-colors font-bold uppercase text-[10px]">Professional Fee</span>
                            <span className="font-bold text-navy">₹{billDetails.base.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-slate-400 group-hover:text-slate-600 transition-colors text-[10px]">Platform & GST (18%)</span>
                            <span className="font-semibold text-slate-700">₹{billDetails.taxesTotal.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-slate-200 my-1"></div>
                        <div className="flex justify-between items-center text-base font-black text-navy border-t border-slate-200 pt-2 mt-2">
                            <span className="uppercase tracking-tighter">Total Payable</span>
                            <span className="text-orange-600 font-mono">₹{billDetails.total.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-dashed border-slate-300">
                            <div className="flex justify-between items-center group opacity-60">
                                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tight italic">Govt Registration Fee (Extra)</span>
                                <span className="font-bold text-slate-500 text-[10px]">₹{billDetails.govt.toLocaleString()}*</span>
                            </div>
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-[10px] text-slate-400 mb-8 justify-center cursor-pointer group">
                        <input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-navy" />
                        <span className="group-hover:text-slate-600 transition-colors">I accept the registration terms & conditions</span>
                    </label>
                    <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing} className="w-full py-4 bg-navy text-white rounded-2xl font-black shadow-xl hover:shadow-2xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wide">
                        {isSubmitting || isPaymentProcessing ? 'Processing Payment...' : 'Pay & Begin Registration'}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1 font-medium"><Shield size={10} /> 256-bit Secure Encryption</p>
                </div>
            );
            default: return null;
        }
    };

    // --- MODAL LAYOUT: SPLIT VIEW ---
    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Trademark Reg.
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight">{billDetails.planName}</p>
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
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Mark Information', 'Applicant Details', 'Required Documents', 'Review Application', 'Payment Summary'].map((step, i) => (
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

                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                        <div className="flex flex-col">
                            {/* Mobile Info */}
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">Trademark Reg.</span>
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
                            {/* Desktop Info */}
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {['Mark Information', 'Applicant Details', 'Documents', 'Review Application', 'Payment Summary'][currentStep - 1]}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4 group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy text-slate-800">Registration Initiated!</h2>
                                <p className="text-gray-500 mt-2 font-medium">Your trademark registration has been started. Our team will contact you shortly.</p>
                                <button onClick={onClose} className="mt-8 px-10 py-3 bg-[#043E52] text-white rounded-xl font-bold shadow-lg">Close</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                        {apiError && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">{apiError}</div>}
                    </div>

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

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-32 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-400 font-bold text-xs uppercase transition-colors hover:text-navy">
                    <ArrowLeft size={16} /> Back to Services
                </button>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <h2 className="font-bold text-xl mb-6 relative z-10 flex items-center gap-2 max-w-[80%]">
                                <Shield size={18} fill="#ED6E3F" stroke="none" />
                                Trademark Registration
                                <div className="mt-1 block text-[10px] text-[#ED6E3F] font-bold uppercase tracking-wider">Secure Your Brand</div>
                            </h2>
                            <div className="space-y-3 relative z-10">
                                {['Mark Information', 'Applicant Details', 'Documents', 'Review Application', 'Payment Summary'].map((s, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${currentStep === i + 1 ? 'bg-white/10 text-white shadow-inner' : 'text-blue-200/40'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/10'}`}>{currentStep > i + 1 ? <CheckCircle size={14} /> : i + 1}</div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${currentStep === i + 1 ? 'text-white' : 'text-blue-200/40'}`}>{s}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                                <p className="text-[10px] uppercase text-gray-400 font-bold mb-4 tracking-widest">Bill Details</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs items-center group">
                                        <span className="text-gray-400 group-hover:text-gray-300 transition-colors font-bold uppercase text-[10px]">Drafting Fee</span>
                                        <span className="font-bold text-white">₹{billDetails.base.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs items-center group">
                                        <span className="text-gray-400 group-hover:text-gray-300 transition-colors font-bold uppercase text-[10px]">Govt Fee</span>
                                        <span className="font-bold text-white">₹{billDetails.govt.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs items-center group">
                                        <span className="text-gray-400 group-hover:text-gray-300 transition-colors font-bold uppercase text-[10px]">Taxes (18%)</span>
                                        <span className="font-bold text-white">₹{billDetails.taxesTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2"></div>
                                    <div className="flex justify-between text-base items-end">
                                        <span className="font-bold text-[#ED6E3F] uppercase text-[10px] tracking-wider">Total Amount</span>
                                        <span className="font-black text-white">₹{billDetails.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        {isSuccess ? (
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center">
                                <CheckCircle size={70} className="text-green-500 mx-auto mb-6" />
                                <h2 className="text-3xl font-black text-navy mb-4">Registration Filed!</h2>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Your trademark registration has been successfully submitted to the registry.</p>
                                <button onClick={() => navigate('/dashboard')} className="px-10 py-3.5 bg-[#043E52] text-white rounded-xl font-bold shadow-xl shadow-navy/20 hover:-translate-y-1 transition-all">Go to Dashboard</button>
                            </div>
                        ) : (
                            <>
                                {renderStepContent()}
                                <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-8 py-3 text-gray-400 font-bold hover:bg-gray-100 hover:text-slate-600 rounded-xl disabled:opacity-30 transition-all">Back</button>
                                    {currentStep < 5 && <button onClick={handleNext} className="px-8 py-3 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:-translate-y-1 transition-all">Save & Continue <ArrowRight size={18} /></button>}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyTrademarkRegistration;
