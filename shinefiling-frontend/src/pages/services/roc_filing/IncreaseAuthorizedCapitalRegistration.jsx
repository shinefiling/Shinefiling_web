
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, Calendar, FileText, User,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, Building2, TrendingUp, Users, Scale,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, CreditCard
} from 'lucide-react';
import { uploadFile, submitIncreaseAuthorizedCapital } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

// --- CONSTANTS & HELPERS ---
const validatePlan = (plan) => {
    return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const PLATFORM_FEE_RATE = 0.03;
const TAX_RATE = 0.03;
const GST_RATE = 0.09;

const IncreaseAuthorizedCapitalRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        basic: {
            price: 1999,
            title: 'Basic Filing',
            features: ["SH-7 Filing Support", "MOA Alteration Template", "Standard ROC Upload", "SRN Receipt Generation"],
            color: 'bg-slate-50 border-slate-200'
        },
        standard: {
            price: 2999,
            title: 'Professional Plan',
            features: ["Custom MOA Drafting", "Board Resolution Prep", "Stamp Duty Assistance", "EGM Notice Drafting", "Priority ROC Filing"],
            color: 'bg-white border-slate-200'
        },
        premium: {
            price: 5999,
            title: 'Fund Raising Kit',
            features: ["Everything in Professional", "Share Allotment (PAS-3)", "Share Certificate Prep", "Demat Coordination Aid", "Dedicated CS Advisory"],
            recommended: true,
            color: 'bg-indigo-50 border-indigo-200'
        }
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planParam = searchParams.get('plan');

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(() => validatePlan(planProp || planParam));

    // Sync plan if props change
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
        cin: '',
        existingCapital: '',
        newCapital: '',
        meetingDate: ''
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
        const plan = plans[selectedPlan] || plans.standard;
        const basePrice = plan.price;

        const platformFee = Math.round(basePrice * PLATFORM_FEE_RATE);
        const tax = Math.round(basePrice * TAX_RATE);
        const gst = Math.round(basePrice * GST_RATE);

        return {
            base: basePrice,
            platformFee: platformFee,
            tax: tax,
            gst: gst,
            total: basePrice + platformFee + tax + gst
        };
    }, [selectedPlan]);

    // Input Handling
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
            const isReallyLoggedIn = isLoggedIn || !!storedUser;
            if (!isReallyLoggedIn) {
                if (!formData.userEmail) { newErrors.userEmail = "Required"; isValid = false; }
                if (!formData.userPhone) { newErrors.userPhone = "Required"; isValid = false; }
            }
            if (!formData.companyName) { newErrors.companyName = "Required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "Required"; isValid = false; }
            if (!formData.existingCapital) { newErrors.existingCapital = "Required"; isValid = false; }
            if (!formData.newCapital) { newErrors.newCapital = "Required"; isValid = false; }
            if (parseFloat(formData.newCapital) <= parseFloat(formData.existingCapital)) {
                newErrors.newCapital = "Must be > existing"; isValid = false;
            }
        }
        if (step === 2) {
            if (!formData.meetingDate) { newErrors.meetingDate = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'capital_increase_docs');
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
        const email = userObj?.email || formData.userEmail;
        const phone = userObj?.phone || formData.userPhone;

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${plans[selectedPlan]?.title} - Increase Authorized Capital`,
            prefill: {
                name: userObj?.name || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                try {
                    const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
                    const finalPayload = {
                        submissionId: `ROCCAP-${Date.now()}`,
                        plan: selectedPlan,
                        userEmail: email,
                        userPhone: phone,
                        formData: formData,
                        documents: docsList,
                        amountPaid: billDetails.total,
                        status: "PAYMENT_SUCCESSFUL",
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };
                    const apiResponse = await submitIncreaseAuthorizedCapital(finalPayload);
                    setAutomationPayload(apiResponse);
                    setIsSuccess(true);
                } catch (error) {
                    alert("Error: " + error.message);
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
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        {(!isLoggedIn && !localStorage.getItem('user')) && (
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 pb-6 border-b border-gray-100">
                                <h3 className="md:col-span-2 font-bold text-slate-800 mb-1 text-sm flex items-center gap-2"><User size={16} /> CONTACT DETAILS</h3>
                                <input name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="Your Email Address" className={`p-2 text-sm border rounded-lg ${errors.userEmail ? 'border-red-500' : ''}`} />
                                <input name="userPhone" value={formData.userPhone} onChange={handleInputChange} placeholder="Your Phone Number" className={`p-2 text-sm border rounded-lg ${errors.userPhone ? 'border-red-500' : ''}`} />
                            </div>
                        )}
                        <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Building2 size={16} /> COMPANY & CAPITAL</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" className={`md:col-span-2 p-2 text-sm border rounded-lg ${errors.companyName ? 'border-red-500' : ''}`} />
                            <input name="cin" value={formData.cin} onChange={handleInputChange} placeholder="Company CIN" className={`p-2 text-sm border rounded-lg ${errors.cin ? 'border-red-500' : ''}`} />
                            <div className="hidden md:block"></div>
                            <input type="number" name="existingCapital" value={formData.existingCapital} onChange={handleInputChange} placeholder="Existing Authorized Capital (₹)" className={`p-2 text-sm border rounded-lg ${errors.existingCapital ? 'border-red-500' : ''}`} />
                            <input type="number" name="newCapital" value={formData.newCapital} onChange={handleInputChange} placeholder="Proposed New Capital (₹)" className={`p-2 text-sm border rounded-lg ${errors.newCapital ? 'border-red-500' : ''}`} />
                            {formData.newCapital && formData.existingCapital && (
                                <div className="md:col-span-2 p-3 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#ED6E3F]">
                                        <Scale size={16} />
                                        <span className="text-xs font-bold">Net Injection: ₹{(formData.newCapital - formData.existingCapital).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Users size={16} /> MEETING DETAILS</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of EGM / Special Resolution</p>
                                <input type="date" name="meetingDate" value={formData.meetingDate} onChange={handleInputChange} className={`w-full p-2 text-sm border rounded-lg ${errors.meetingDate ? 'border-red-500' : ''}`} />
                            </div>
                            <p className="text-[10px] text-gray-500 italic">The date on which shareholders authorized the MOA alteration.</p>
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><ClipboardList size={16} /> FILING DOCUMENTS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { label: 'Board Resolution', key: 'resolution_doc' },
                                { label: 'Altered MOA', key: 'moa_doc' },
                                { label: 'EGM Notice', key: 'egm_doc' }
                            ].map((doc, i) => (
                                <div key={i} className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-gray-50">
                                    <span className="text-xs text-gray-600">{doc.label}</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, doc.key)} className="text-[10px] w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-navy mb-4">Confirm Details</h2>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between"><span>Plan</span><span className="font-bold text-navy">{plans[selectedPlan]?.title}</span></div>
                        <div className="flex justify-between"><span>Company</span><span className="font-bold">{formData.companyName}</span></div>
                        <div className="flex justify-between"><span>Existing Capital</span><span className="font-bold">₹{parseFloat(formData.existingCapital || 0).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Proposed Capital</span><span className="font-bold text-green-600 font-mono">₹{parseFloat(formData.newCapital || 0).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Meeting Date</span><span className="font-bold">{formData.meetingDate}</span></div>
                    </div>
                </div>
            );
            case 5: return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <IndianRupee size={32} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                        <div className="flex justify-between text-sm"><span>Service Fee</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFee.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                        <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total Amount</span><span className="text-green-600">₹{billDetails.total.toLocaleString()}</span></div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center">
                        <input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} /> I Accept Terms & Conditions
                    </label>
                    <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">
                        {isSubmitting || isPaymentProcessing ? 'Authorizing Payment...' : 'Pay & Submit'}
                    </button>
                </div>
            );
            default: return null;
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Increase Capital
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight mb-4">{plans[selectedPlan]?.title}</p>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-300">Service Fee</span>
                                    <span className="text-white font-medium">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-300">Fees & Taxes</span>
                                    <span className="text-white font-medium">₹{(billDetails.total - billDetails.base).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold text-[#ED6E3F] uppercase tracking-wider">Total</span>
                                    <span className="text-xl font-bold text-white leading-none">₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Capital Info', 'Meetings', 'Documents', 'Review', 'Payment'].map((step, i) => (
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

                {/* RIGHT CONTENT */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                        <div className="flex flex-col justify-center">
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <span className="font-bold text-slate-800 text-sm truncate">Increase Capital</span>
                                <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider">Total</span>
                                        <span className="text-xs font-bold text-green-600">₹{billDetails.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Capital Information"}
                                {currentStep === 2 && "Meeting Details"}
                                {currentStep === 3 && "Upload Documents"}
                                {currentStep === 4 && "Review Application"}
                                {currentStep === 5 && "Complete Payment"}
                            </h2>
                        </div>
                        <button onClick={onClose || (() => navigate(-1))} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

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

                    {!isSuccess && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30">Back</button>
                            {currentStep < 5 && (
                                <button onClick={handleNext} className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold hover:-translate-y-0.5 transition flex items-center gap-2 text-sm shadow-lg shadow-orange-500/20">
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
                            {['Capital Info', 'Meetings', 'Documents', 'Review', 'Payment'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-[#043E52] text-white font-bold' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        {!isSuccess && (
                            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30">Back</button>
                                <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/10 flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncreaseAuthorizedCapitalRegistration;
