import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Building2, TrendingUp, Users, BookOpen,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, CreditCard
} from 'lucide-react';
import { uploadFile, submitMoaAoaAmendment } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const validatePlan = (plan) => {
    return ['consultation', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const AOAAmendmentRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        consultation: { price: 999, title: 'Expert Advisory' },
        standard: { price: 2999, title: 'Clause Update' },
        premium: { price: 3999, title: 'New Adoption' }
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
        cin: '',
        amendmentType: 'AOA',
        reasonForAmendment: '',
        existingClause: '',
        proposedClause: '',
        meetingDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

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
            if (!formData.cin) { newErrors.cin = "Required"; isValid = false; }
            if (!formData.reasonForAmendment) { newErrors.reasonForAmendment = "Required"; isValid = false; }
        } else if (step === 2) {
            if (!formData.existingClause) { newErrors.existingClause = "Required"; isValid = false; }
            if (!formData.proposedClause) { newErrors.proposedClause = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'aoa_amendment_docs');
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
            description: `Payment for ${plans[selectedPlan]?.title} - AOA Amendment`,
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
                        submissionId: `ROC-AOA-${Date.now()}`,
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
                    const apiResponse = await submitMoaAoaAmendment(finalPayload);
                    setAutomationPayload(apiResponse);
                    setIsSuccess(true);
                } catch (error) {
                    alert("Submission error: " + error.message);
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
                            {(!isLoggedIn && !localStorage.getItem('user')) && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 pb-6 border-b border-gray-100">
                                    <h3 className="md:col-span-2 font-bold text-slate-800 mb-1 text-sm flex items-center gap-2"><User size={16} /> CONTACT DETAILS</h3>
                                    <input name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="Email Address" className={`p-2 text-sm border rounded-lg ${errors.userEmail ? 'border-red-500' : ''}`} />
                                    <input name="userPhone" value={formData.userPhone} onChange={handleInputChange} placeholder="Phone Number" className={`p-2 text-sm border rounded-lg ${errors.userPhone ? 'border-red-500' : ''}`} />
                                </div>
                            )}
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Building2 size={16} /> COMPLIANCE SETUP</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input name="cin" value={formData.cin} onChange={handleInputChange} placeholder="Company CIN" className={`md:col-span-2 p-2 text-sm border rounded-lg ${errors.cin ? 'border-red-500' : ''}`} />
                                <input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Filing Company Name" className={`md:col-span-2 p-2 text-sm border rounded-lg ${errors.companyName ? 'border-red-500' : ''}`} />
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Reason for Amendment</p>
                                    <select name="reasonForAmendment" value={formData.reasonForAmendment} onChange={handleInputChange} className="w-full p-2 text-sm border rounded-lg bg-white">
                                        <option value="">-- Select Reason --</option>
                                        <option value="Change Share Transfer Rules">Change Share Transfer Rules</option>
                                        <option value="Change Board Meeting Rules">Change Board Meeting Rules</option>
                                        <option value="Adopt New AOA (Table F)">Adopt New AOA (Table F)</option>
                                        <option value="Remove Private Company Restrictions">Remove Private Company Restrictions</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><BookOpen size={16} /> CLAUSE SPECIFICS</h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Existing Clause (Reference)</p>
                                    <textarea name="existingClause" value={formData.existingClause} onChange={handleInputChange} rows={3} placeholder="Paste current AOA clause here..." className="w-full p-3 text-sm border rounded-lg bg-gray-50 italic" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Proposed New Clause</p>
                                    <textarea name="proposedClause" value={formData.proposedClause} onChange={handleInputChange} rows={4} placeholder="Type new clause text here..." className="w-full p-3 text-sm border-2 border-[#043E52]/10 rounded-lg bg-white font-medium" />
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-800 text-[10px] rounded-lg border border-blue-100 font-medium italic">
                                    AOA cannot completely ban share transfers in a Private Limited Company.
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><ClipboardList size={16} /> UPLOAD DOCUMENTS</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-gray-50">
                                    <span className="text-xs text-gray-600">Special Resolution</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'special_resolution')} className="text-[10px] w-24" />
                                </div>
                                <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-gray-50">
                                    <span className="text-xs text-gray-600">Existing AOA</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'existing_aoa')} className="text-[10px] w-24" />
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
                            <div className="flex justify-between"><span>Amendment</span><span className="font-bold text-orange-600">{formData.amendmentType}</span></div>
                            <div className="flex justify-between"><span>Reason</span><span className="font-bold">{formData.reasonForAmendment}</span></div>
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
                        <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">
                            {isSubmitting || isPaymentProcessing ? 'Authorizing Payment...' : 'Pay & Submit'}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    // --- MODAL LAYOUT: SPLIT VIEW (Left Sidebar + Right Content) ---
    return (
        <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
            {/* LEFT SIDEBAR: DARK - Hidden on Mobile */}
            <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10 mb-8">
                    <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                        <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                        AOA Amendment
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
                    {['Entity Sync', 'Clause Specifics', 'Upload Docs', 'Review', 'Payment'].map((step, i) => (
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
                                <span className="font-bold text-slate-800 text-sm truncate">AOA Amendment</span>
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
                            {currentStep === 1 && "Amendment Details"}
                            {currentStep === 2 && "Textual Revision"}
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
};

export default AOAAmendmentRegistration;
