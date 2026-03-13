import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Users, Plus, Trash2, X, Briefcase, MapPin, RefreshCw, PieChart, Calendar
} from 'lucide-react';
import { uploadFile, submitGstCancellation } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const GstCancellationRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/gst-cancellation/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    };

    const [selectedPlan, setSelectedPlan] = useState(() => validatePlan(planProp || searchParams.get('plan')));

    useEffect(() => {
        const targetPlan = validatePlan(planProp || searchParams.get('plan'));
        if (targetPlan !== selectedPlan) {
            setSelectedPlan(targetPlan);
        }
    }, [planProp, searchParams, selectedPlan]);

    const [formData, setFormData] = useState({
        userEmail: '',
        userPhone: '',
        gstin: '',
        tradeName: '',
        reason: 'Discontinuance of Business',
        cessationDate: '',
        stockValue: '',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const plans = {
        basic: {
            price: 999,
            title: 'Basic Exit',
            features: ["Application for Surrender", "Reason for Closure Drafting", "ARN Tracking"],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 1999,
            title: 'Full Closure',
            features: ["Everything in Basic", "GSTR-10 (Final Return)", "NOC Coordination"],
            recommended: true,
            color: 'bg-indigo-50 border-indigo-200'
        },
        premium: {
            price: 3499,
            title: 'Corporate Exit',
            features: ["Everything in Standard", "Stock ITC Reversal", "Officer Visit Support"],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.standard;
        const basePrice = plan.price;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);
        const total = basePrice + platformFee + tax + gst;
        return { basePrice, platformFee, tax, gst, total };
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
            const isReallyLoggedIn = isLoggedIn || !!storedUser;
            if (!isReallyLoggedIn) {
                if (!formData.userEmail) { newErrors.userEmail = "Required"; isValid = false; }
                if (!formData.userPhone) { newErrors.userPhone = "Required"; isValid = false; }
            }
            if (!formData.gstin) { newErrors.gstin = "GSTIN required"; isValid = false; }
            if (!formData.tradeName) { newErrors.tradeName = "Business name required"; isValid = false; }
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
            const response = await uploadFile(file, 'gst_cancellation_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id }
            }));
        } catch (error) { alert("Upload failed"); }
    };

    const submitApplication = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || formData.userEmail;
        const phone = userObj?.mobile || formData.userPhone;

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${plans[selectedPlan]?.title} - GST Cancellation Registration`,
            prefill: {
                name: formData.tradeName || "Customer",
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
                    const apiResponse = await submitGstCancellation(finalPayload);
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
                        <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Building size={16} /> ENTITY IDENTIFICATION</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input name="gstin" value={formData.gstin} onChange={handleInputChange} placeholder="Active GSTIN Number" className={`md:col-span-2 p-2 text-sm border rounded-lg uppercase ${errors.gstin ? 'border-red-500' : ''}`} />
                            <input name="tradeName" value={formData.tradeName} onChange={handleInputChange} placeholder="Registered Legal Name" className={`md:col-span-2 p-2 text-sm border rounded-lg ${errors.tradeName ? 'border-red-500' : ''}`} />
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Calendar size={16} /> CLOSURE DETAILS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select name="reason" value={formData.reason} onChange={handleInputChange} className="md:col-span-2 p-2 text-sm border rounded-lg w-full">
                                <option value="Discontinuance of Business">Discontinuance of Business</option>
                                <option value="Change in Constitution of Business">Change in Constitution of Business</option>
                                <option value="Turnover below threshold limit">Turnover below threshold limit</option>
                                <option value="Transfer of Business">Transfer of Business / Merger</option>
                                <option value="Death of Proprietor">Death of Proprietor</option>
                            </select>
                            <input type="date" name="cessationDate" value={formData.cessationDate} onChange={handleInputChange} className="p-2 text-sm border rounded-lg w-full" />
                            <input type="number" name="stockValue" value={formData.stockValue} onChange={handleInputChange} placeholder="Estimated Stock Value (₹)" className="p-2 text-sm border rounded-lg w-full" />
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm">UPLOAD DATA</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {['GST Registration Certificate', 'Latest Profit & Loss Statement', 'Stock Summary Report'].map((doc, i) => (
                                <div key={i} className="border border-dashed p-3 rounded-lg flex justify-between items-center"><span className="text-xs text-gray-600">{doc}</span><input type="file" onChange={(e) => handleFileUpload(e, `doc_${i}`)} className="text-[10px] w-20" /></div>
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
                        <div className="flex justify-between"><span>GSTIN</span><span className="font-bold text-navy font-mono tracking-wider">{formData.gstin}</span></div>
                        <div className="flex justify-between"><span>Reason</span><span className="font-bold text-amber-600 truncate max-w-[150px]">{formData.reason}</span></div>
                    </div>
                </div>
            );
            case 5: return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <IndianRupee size={32} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                        <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.basePrice.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFee.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                        <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center">
                        <input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} />
                        I Accept Terms & Conditions
                    </label>
                    <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50 transition">
                        {isSubmitting || isPaymentProcessing ? 'Processing Payment...' : 'Pay & Submit'}
                    </button>
                </div>
            );
            default: return null;
        }
    }

    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK - Hidden on Mobile */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white mb-6">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            GST Cancellation
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
                                    <span className="text-white font-medium font-mono">₹{billDetails.basePrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Govt Fee & Taxes</span>
                                    <span className="text-white font-medium font-mono">₹{(billDetails.total - billDetails.basePrice).toLocaleString()}</span>
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
                        {['Entity Info', 'Closure Scope', 'Upload Data', 'Review Info', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">GST Cancel</span>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Service</span>
                                        <span className="text-xs font-bold text-slate-700">₹{(billDetails.basePrice / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="w-px h-5 bg-gray-200"></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Govt Fee</span>
                                        <span className="text-xs font-bold text-slate-700">₹{((billDetails.total - billDetails.basePrice) / 1000).toFixed(1)}k</span>
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
                                {currentStep === 1 && "Start Cancellation"}
                                {currentStep === 2 && "Closure Details"}
                                {currentStep === 3 && "Data Upload"}
                                {currentStep === 4 && "Review Application"}
                                {currentStep === 5 && "Complete Payment"}
                            </h2>
                        </div>

                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
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
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg hover:bg-black transition">Close Window</button>
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

    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase"><ArrowLeft size={14} /> Back</button>
                <div className="flex gap-8">
                    <div className="w-72 hidden lg:block space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                            {['Entity Info', 'Closure Scope', 'Upload Data', 'Review Info', 'Payment'].map((s, i) => (
                                <div key={i} className={`p-2 rounded font-bold text-sm ${currentStep === i + 1 ? 'bg-[#043E52] text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-transparent">
                        {isSuccess ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Order ID: {automationPayload?.submissionId}</p>
                            </div>
                        ) : (
                            <div className="bg-transparent">
                                {renderStepContent()}
                                <div className="mt-6 flex justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1} className="px-6 py-2 text-gray-500 font-bold rounded hover:bg-gray-50 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-6 py-2 rounded font-bold hover:shadow-lg transition">Next Step</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GstCancellationRegistration;
