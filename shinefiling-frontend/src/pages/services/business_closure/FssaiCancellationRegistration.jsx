import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, IndianRupee, Coffee
} from 'lucide-react';
import { submitFssaiCancellation, uploadFile } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const FssaiCancellationRegistration = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    // Determine initial plan
    const [selectedPlan, setSelectedPlan] = useState(planProp || 'state');

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({});

    const [formData, setFormData] = useState({
        businessName: '',
        fssaiNumber: '',
        licenseType: 'State License',
        reasonForCancellation: 'Shutdown of Food Business',
        email: '',
        mobile: ''
    });

    const plans = {
        registration: {
            price: 999,
            title: 'Basic Registration',
            features: ["Basic FSSAI Surrender", "Filing Application", "Closure Intimation"],
            color: 'bg-white border-slate-200'
        },
        state: {
            price: 1499,
            title: 'State License',
            features: ["State/Central Surrender", "Declaration Drafting", "FSO Liaison", "Surrender Proof"],
            recommended: true,
            color: 'bg-[#043E52] text-white border-gray-700'
        },
        death: {
            price: 2499,
            title: 'Death Case',
            features: ["Transfer or Close", "Affidavit by Legal Heir", "Priority Support"],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    // Memoize bill details
    const billDetails = useMemo(() => {
        const selectedPricing = plans[selectedPlan] || plans.state;
        const basePrice = selectedPricing.price;

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

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData(prev => ({ ...prev, email: user.email, mobile: user.mobile || '' }));
        }
    }, [isModal]);

    useEffect(() => {
        if (planProp) {
            setSelectedPlan(planProp.toLowerCase());
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['registration', 'state', 'death'].includes(planParam.toLowerCase())) {
                setSelectedPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.fssaiNumber) { newErrors.fssaiNumber = "FSSAI Number required"; isValid = false; }
            if (!formData.email) { newErrors.email = "Email required"; isValid = false; }
            if (!formData.mobile) { newErrors.mobile = "Mobile required"; isValid = false; }
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
            const response = await uploadFile(file, 'fssai_cancellation_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    fileUrl: response.fileUrl
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const handleSubmit = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || formData.email;
        const phone = userObj?.phone || formData.mobile || '';

        processPayment({
            amount: billDetails.total,
            description: `Payment for FSSAI Cancellation - ${plans[selectedPlan].title}`,
            prefill: {
                name: userObj?.name || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setLoading(true);
                try {
                    const submissionId = `FSAC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                    const finalPayload = {
                        submissionId,
                        plan: selectedPlan,
                        userEmail: email,
                        userPhone: phone,
                        amountPaid: billDetails.total,
                        formData: { ...formData },
                        documents: Object.values(uploadedFiles),
                        status: 'PAYMENT_SUCCESSFUL',
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };
                    await submitFssaiCancellation(finalPayload);
                    setSuccess(true);
                } catch (err) {
                    alert(err.message || 'Submission failed. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const steps = ['License Info', 'Reasoning', 'Documents', 'Review & Pay'];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // License Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {isModal && (
                            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        )}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Coffee size={20} className="text-blue-600" /> FOOD BUSINESS DETAILS
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Food Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="As printed on license" className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 bg-gray-50`} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">FSSAI License / Registration No.</label>
                                    <input type="text" name="fssaiNumber" value={formData.fssaiNumber} onChange={handleChange} placeholder="14-digit Number" className={`w-full p-3 rounded-lg border ${errors.fssaiNumber ? 'border-red-500' : 'border-gray-200'} bg-white`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Email ID</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Mobile Number</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-gray-200'} bg-white`} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">License Type</label>
                                    <select name="licenseType" value={formData.licenseType} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="State License">State License</option>
                                        <option value="Central License">Central License</option>
                                        <option value="Basic Registration">Basic Registration</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                );

            case 2: // Reasoning
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <AlertCircle size={20} className="text-amber-600" /> CANCELLATION REASON
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Why are you surrendering this license?</label>
                                    <select name="reasonForCancellation" value={formData.reasonForCancellation} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Shutdown of Food Business">Shutdown of Food Business</option>
                                        <option value="Transfer of Ownership">Transfer of Ownership</option>
                                        <option value="Change in Entity Type">Change in Entity Type (e.g. Prop to Pvt Ltd)</option>
                                        <option value="Death of Licensee">Death of Licensee</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-bronze" /> REQUIRED DOCUMENTS
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Copies required for FoSCoS portal filing.</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {['Current FSSAI Certificate', 'Reason for Surrender Letter', 'PAN Card of Authorized Signatory', 'Death Certificate (if applicable)'].map((label, idx) => {
                                    const key = `doc_${idx}`;
                                    return (
                                        <div key={idx} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-blue-300 transition-colors bg-gray-50">
                                            <div className="flex items-center gap-2">
                                                <Upload size={16} className="text-gray-400 group-hover:text-bronze" />
                                                <span className="text-sm font-medium text-gray-600">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={16} className="text-green-500" />}
                                                <input type="file" onChange={(e) => handleFileUpload(e, key)} className="text-xs w-24 text-slate-400" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Review your license details before submission.</p>

                        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-left">
                            <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                        </div>

                        <div className="text-left bg-gray-50 p-4 rounded-xl mb-6 text-sm space-y-2 border border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Entity:</span>
                                <span className="font-semibold">{formData.businessName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">License No:</span>
                                <span className="font-semibold">{formData.fssaiNumber}</span>
                            </div>
                        </div>

                        <button onClick={handleSubmit} disabled={loading || isPaymentProcessing} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading || isPaymentProcessing ? 'Processing Payment...' : 'Pay Now & Cancel License'}
                            {!loading && !isPaymentProcessing && <ArrowRight size={18} />}
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                            <Lock size={12} /> Secure 256-bit SSL Payment
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK - Detailed View */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white text-[#ED6E3F]">
                            FSSAI Cancellation
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
                        {['License Info', 'Reasoning', 'Documents', 'Review & Pay'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">FSSAI Cancellation</span>
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
                            <h2 className="hidden md:block font-bold text-[#ED6E3F] text-lg">
                                {currentStep === 1 && "FSSAI Details"}
                                {currentStep === 2 && "Cancellation Reason"}
                                {currentStep === 3 && "Documents"}
                                {currentStep === 4 && "Review & Submit"}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {success ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Received!</h2>
                                <p className="text-gray-500 mt-2">
                                    Your request for <span className="font-bold text-navy">FSSAI Cancellation</span> has been received.
                                </p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                    </div>

                    {/* Sticky Footer */}
                    {!success && currentStep < 4 && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button
                                onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                disabled={currentStep === 1}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-6 py-2.5 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2 text-sm"
                            >
                                Save & Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={isModal ? "bg-[#F8F9FA] p-4 md:p-8" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {success ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Application Received!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request for <span className="font-bold text-navy">FSSAI Cancellation</span> has been received.
                        Reference ID: <span className="font-bold text-blue-600">{formData.submissionId}</span>.
                        We will file the surrender application on FoSCoS portal within 24-48 hours.
                    </p>
                    <button onClick={() => isModal && onClose ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">
                        Go to Dashboard
                    </button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        {!isModal && (
                            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition">
                                <ArrowLeft size={14} /> Back
                            </button>
                        )}
                        <h1 className="text-3xl font-bold text-navy">FSSAI License Cancellation</h1>
                        <p className="text-gray-500">Legal surrender of your food business license.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* LEFT SIDEBAR */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {steps.map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-blue-800' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan]?.color || 'bg-white'} relative overflow-hidden transition-all sticky top-24`}>
                                <div className="relative z-10">
                                    <div className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Current Plan</div>
                                    <div className="text-2xl font-bold mb-2">{plans[selectedPlan]?.title}</div>
                                    <div className="text-3xl font-black mb-4">₹{plans[selectedPlan]?.price?.toLocaleString()}</div>

                                    <div className="space-y-3 mb-6">
                                        {plans[selectedPlan]?.features?.map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium opacity-80">
                                                <CheckCircle size={14} className="shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Coffee className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 rotate-12" />
                            </div>
                        </div>

                        {/* RIGHT FORM CONTENT */}
                        <div className="flex-1">
                            {renderStepContent()}

                            {currentStep < 4 && (
                                <div className="mt-8 flex justify-between">
                                    <button
                                        onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                        disabled={currentStep === 1}
                                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={() => setCurrentStep(p => Math.min(4, p + 1))}
                                        className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2"
                                    >
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FssaiCancellationRegistration;
