
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, IndianRupee, Users, Plus, Trash2, Receipt, Briefcase, MapPin
} from 'lucide-react';
import { uploadFile, submitOnePersonCompanyRegistration } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

// --- CONSTANTS MOVED OUTSIDE COMPONENT ---
const plans = {
    startup: {
        price: 4999,
        title: 'Startup Plan',
        features: ["1 DSC & 1 DIN", "Name Approval", "Certificate of Incorporation", "MOA & AOA Drafting", "PAN & TAN"],
        color: 'bg-white border-slate-200'
    },
    standard: {
        price: 9999,
        title: 'Standard Plan',
        features: ["Everything in Startup", "Nominee Consent Filing", "Share Certificate", "PAN & TAN Allocation", "GST & Bank Account"],
        recommended: true,
        color: 'bg-indigo-50 border-indigo-200'
    },
    premium: {
        price: 19999,
        title: 'Premium Plan',
        features: ["Everything in Standard", "GST Registration", "MSME (Udyam) Registration", "Bank Account (Full Support)", "First Board Resolution"],
        color: 'bg-purple-50 border-purple-200'
    }
};

const validatePlan = (plan) => {
    return ['startup', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'startup';
};

const PLATFORM_FEE = 499;
const GST_RATE = 0.18;

const OnePersonCompanyRegistration = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planParam = searchParams.get('plan');

    // Protect Route (Removed)
    useEffect(() => {
        // Login check removed to allow manual entry
    }, []);

    const [currentStep, setCurrentStep] = useState(1);

    // Initialize state with validation run once
    const [selectedPlan, setSelectedPlan] = useState(() => validatePlan(planProp || planParam));

    // Optimised Plan Sync: STRICT CHECK to prevent loops
    useEffect(() => {
        const targetPlan = validatePlan(planProp || planParam);
        if (targetPlan !== selectedPlan) {
            setSelectedPlan(targetPlan);
        }
    }, [planParam, planProp, selectedPlan]);

    const [formData, setFormData] = useState({
        userEmail: '',
        userPhone: '',
        companyNames: ['', ''],
        businessActivity: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        ownershipStatus: 'rented',
        authorizedCapital: '100000',
        paidUpCapital: '100000',
        director: { name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', address: '' },
        nominee: { name: '', relationship: '', dob: '', pan: '', aadhaar: '', email: '', phone: '' },
        bankPreference: '',
        turnoverEstimate: '',
        accountingStartDate: '',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    // Memoize bill details
    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.startup;
        const basePrice = plan.price;

        // Match PrivateLimitedRegistration logic
        const platformFee = Math.round(basePrice * 0.03); // 3%
        const tax = Math.round(basePrice * 0.03);         // 3%
        const gst = Math.round(basePrice * 0.09);         // 9%

        return {
            base: basePrice,
            platformFn: platformFee,
            tax: tax,
            gst: gst,
            total: basePrice + platformFee + tax + gst
        };
    }, [selectedPlan]);

    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section === 'companyNames') {
            const index = parseInt(name);
            const newNames = [...formData.companyNames];
            newNames[index] = value;
            setFormData({ ...formData, companyNames: newNames });
        } else if (section === 'director') {
            setFormData({ ...formData, director: { ...formData.director, [name]: value } });
        } else if (section === 'nominee') {
            setFormData({ ...formData, nominee: { ...formData.nominee, [name]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            const storedUser = localStorage.getItem('user');
            const isReallyLoggedIn = isLoggedIn || !!storedUser;
            if (!isReallyLoggedIn) {
                if (!formData.userEmail) { newErrors.userEmail = "Required"; isValid = false; }
                if (!formData.userPhone) { newErrors.userPhone = "Required"; isValid = false; }
            }
            if (!formData.companyNames[0]) { newErrors.companyName1 = "Required"; isValid = false; }
            if (!formData.businessActivity) { newErrors.businessActivity = "Required"; isValid = false; }
            if (!formData.addressLine1) { newErrors.addressLine1 = "Required"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.director.name) { newErrors.directorName = "Required"; isValid = false; }
            if (!formData.director.email) { newErrors.directorEmail = "Required"; isValid = false; }
            if (!formData.director.phone) { newErrors.directorPhone = "Required"; isValid = false; }
            if (!formData.director.pan) { newErrors.directorPan = "Required"; isValid = false; }
            if (!formData.nominee.name) { newErrors.nomineeName = "Nominee Name Required"; isValid = false; }
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
            let category = 'opc_docs';
            const response = await uploadFile(file, category);
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName, fileUrl: response.fileUrl, fileId: response.id } }));
        } catch (error) {
            alert("Upload failed.");
        }
    };

    const submitApplication = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || formData.userEmail;
        const phone = userObj?.phone || formData.userPhone;

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${plans[selectedPlan]?.title} - OPC Registration`,
            prefill: {
                name: formData.director.name || "Customer",
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
                        submissionId: `OPC-${Date.now()}`,
                        plan: selectedPlan,
                        userEmail: email,
                        userPhone: phone,
                        formData: formData,
                        documents: docsList,
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        },
                        status: "PAYMENT_SUCCESSFUL"
                    };

                    const apiResponse = await submitOnePersonCompanyRegistration(finalPayload);
                    setAutomationPayload(apiResponse);
                    setIsSuccess(true);
                } catch (err) {
                    alert("Submission failed: " + err.message);
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // OPC Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            {(!isLoggedIn && !localStorage.getItem('user')) && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                                    <h3 className="md:col-span-2 font-bold text-navy mb-1 text-sm flex items-center gap-2"><User size={16} /> CONTACT DETAILS</h3>
                                    <input name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="Your Email Address" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.userEmail ? 'border-red-500' : ''}`} />
                                    <input name="userPhone" value={formData.userPhone} onChange={handleInputChange} placeholder="Your Phone Number" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.userPhone ? 'border-red-500' : ''}`} />
                                </div>
                            )}
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Briefcase size={20} className="text-blue-600" /> OPC DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="0" placeholder="Proposed OPC Name Option 1" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.companyName1 ? 'border-red-500' : ''}`} onChange={(e) => handleInputChange(e, 'companyNames')} value={formData.companyNames[0]} />
                                <input name="1" placeholder="Proposed OPC Name Option 2" className="p-3 rounded-lg border border-gray-200 w-full" onChange={(e) => handleInputChange(e, 'companyNames')} value={formData.companyNames[1]} />
                                <textarea name="businessActivity" placeholder="Main Business Activity (e.g. Software Development)" className={`p-3 rounded-lg border border-gray-200 w-full md:col-span-2 ${errors.businessActivity ? 'border-red-500' : ''}`} rows="2" onChange={handleInputChange} value={formData.businessActivity}></textarea>
                                <input name="authorizedCapital" placeholder="Authorized Capital (min 1 Lakh)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.authorizedCapital} />
                                <input name="addressLine1" placeholder="Registered Office Address" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.addressLine1 ? 'border-red-500' : ''}`} onChange={handleInputChange} value={formData.addressLine1} />
                            </div>
                        </div>
                    </div>
                );
            case 2: // Personal Details (Director & Nominee)
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h3 className="font-bold text-navy flex items-center gap-2"><User size={20} className="text-bronze" /> DIRECTOR DETAILS</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="name" placeholder="Director Name" value={formData.director.name} onChange={(e) => handleInputChange(e, 'director')} className={`p-3 rounded-lg border border-gray-200 w-full ${errors.directorName ? 'border-red-500' : ''}`} />
                                <input name="email" placeholder="Email" value={formData.director.email} onChange={(e) => handleInputChange(e, 'director')} className={`p-3 rounded-lg border border-gray-200 w-full ${errors.directorEmail ? 'border-red-500' : ''}`} />
                                <input name="phone" placeholder="Mobile" value={formData.director.phone} onChange={(e) => handleInputChange(e, 'director')} className={`p-3 rounded-lg border border-gray-200 w-full ${errors.directorPhone ? 'border-red-500' : ''}`} />
                                <input name="pan" placeholder="PAN Number" value={formData.director.pan} onChange={(e) => handleInputChange(e, 'director')} className={`p-3 rounded-lg border border-gray-200 w-full ${errors.directorPan ? 'border-red-500' : ''}`} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h3 className="font-bold text-navy flex items-center gap-2"><Users size={20} className="text-purple-600" /> NOMINEE DETAILS</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="name" placeholder="Nominee Name" value={formData.nominee.name} onChange={(e) => handleInputChange(e, 'nominee')} className={`p-3 rounded-lg border border-gray-200 w-full ${errors.nomineeName ? 'border-red-500' : ''}`} />
                                <input name="relationship" placeholder="Relationship (e.g. Spouse)" value={formData.nominee.relationship} onChange={(e) => handleInputChange(e, 'nominee')} className="p-3 rounded-lg border border-gray-200 w-full" />
                                <input name="pan" placeholder="Nominee PAN" value={formData.nominee.pan} onChange={(e) => handleInputChange(e, 'nominee')} className="p-3 rounded-lg border border-gray-200 w-full" />
                            </div>
                        </div>
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-slate" /> UPLOAD DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['Director PAN', 'Director Aadhaar', 'Director Photo', 'Nominee PAN', 'Nominee Aadhaar', 'Office Proof'].map((doc, i) => {
                                    const key = doc.toLowerCase().replace(/ /g, '_');
                                    return (
                                        <div key={i} className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{doc}</span>
                                            <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, key)} />
                                            {uploadedFiles[key] && <CheckCircle size={14} className="text-green-500" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Plan</span>
                                <span className="font-bold font-mono uppercase text-navy">{plans[selectedPlan].title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-bold">Company Name:</span> {formData.companyNames[0]}</p>
                            <p><span className="font-bold">Director:</span> {formData.director.name}</p>
                            <p><span className="font-bold">Nominee:</span> {formData.nominee.name}</p>
                        </div>
                    </div>
                );
            case 5: return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <Receipt size={32} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                        <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                        <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center"><input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} /> I Accept Terms & Conditions</label>
                    <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">
                        {isSubmitting || isPaymentProcessing ? 'Processing Payment...' : 'Pay & Submit'}
                    </button>
                </div>
            );
        }
    }

    // --- MODAL LAYOUT: SPLIT VIEW (Matches Private Limited) ---
    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg text-bronze flex items-center gap-2 tracking-tight">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            OPC Registration
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
                        {['Director Details', 'Nominee Details', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">OPC Registration</span>
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
                                {currentStep === 2 && "Director & Nominee"}
                                {currentStep === 3 && "Upload Documents"}
                                {currentStep === 4 && "Review Application"}
                                {currentStep === 5 && "Complete Payment"}
                            </h2>
                        </div>

                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Order ID: {automationPayload?.submissionId}</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
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

    // --- FALLBACK FULL PAGE LAYOUT ---
    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
                <div className="bg-white p-8 rounded-3xl shadow-xl">
                    <h1 className="text-2xl font-bold text-navy mb-6">One Person Company Registration</h1>
                    {renderStepContent()}
                    <div className="mt-8 flex justify-between">
                        <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-lg bg-gray-100 font-bold text-gray-600">Back</button>
                        {currentStep < 5 && <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-navy text-white font-bold">Next</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnePersonCompanyRegistration;
