
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Briefcase, X
} from 'lucide-react';
import { uploadFile } from '../../../utils/uploadFile';
import { submitRocNoticeReply } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const RocNoticeReplyRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    useEffect(() => {
        // Login check removed to allow manual entry if user logged out
    }, []);

    const [currentStep, setCurrentStep] = useState(1);
    const validatePlan = (plan) => ['basic', 'standard', 'compounding'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        companyName: '',
        cin: '',
        noticeType: 'Strike Off',
        noticeDate: '',
        referenceNumber: '',
        userEmail: JSON.parse(localStorage.getItem('user'))?.email || ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [errors, setErrors] = useState({});

    const plans = {
        basic: { price: 1499, title: 'Basic Reply', features: ["Reply to Routine Query", "Correction of Forms", "Resubmission Support"], color: 'bg-white border-slate-200' },
        standard: { price: 2499, title: 'Adjudication', features: ["SCN Detailed Reply", "STK-1 Reply", "Hearing Assistance"], recommended: true, color: 'bg-[#043E52] text-white border-gray-700' },
        compounding: { price: 9999, title: 'Compounding', features: ["NCLT Application", "Physical Appearance", "Complete Settlement"], color: 'bg-purple-50 border-purple-200' }
    };

    const billDetails = React.useMemo(() => {
        const planPrice = plans[selectedPlan]?.price || 0;
        const platformFee = Math.round(planPrice * 0.03); // 3% Platform Fee
        const tax = Math.round(planPrice * 0.03); // 3% Tax
        const gst = Math.round(planPrice * 0.09); // 9% GST
        const total = planPrice + platformFee + tax + gst;
        return { base: planPrice, platformFn: platformFee, tax, gst, total };
    }, [selectedPlan]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };
    const handleFileChange = (e) => e.target.files && setSelectedFiles(Array.from(e.target.files));

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            const storedUser = localStorage.getItem('user');
            const isReallyLoggedIn = isLoggedIn || !!storedUser;
            if (!isReallyLoggedIn) {
                if (!formData.userEmail) { newErrors.userEmail = "Required"; isValid = false; }
            }
            if (!formData.companyName) { newErrors.companyName = "Required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "Required"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.noticeDate) { newErrors.noticeDate = "Required"; isValid = false; }
            if (!formData.referenceNumber) { newErrors.referenceNumber = "Required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const submitApplication = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || formData.userEmail;
        const phone = userObj?.mobile || '';

        processPayment({
            amount: billDetails.total,
            description: `Payment for ROC Notice Reply - ${plans[selectedPlan].title}`,
            prefill: {
                name: userObj?.name || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                try {
                    const uploadedDocs = [];
                    for (const file of selectedFiles) {
                        const url = await uploadFile(file);
                        uploadedDocs.push({ type: "ROC_NOTICE", filename: file.name, fileUrl: url });
                    }
                    const finalPayload = {
                        submissionId: `ROC-${Date.now()}`,
                        plan: selectedPlan,
                        userEmail: email,
                        userPhone: phone,
                        formData: formData,
                        documents: uploadedDocs,
                        amountPaid: billDetails.total,
                        status: "PAYMENT_SUCCESSFUL",
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };
                    await submitRocNoticeReply(finalPayload);
                    setIsSuccess(true);
                } catch (error) {
                    alert(error.message);
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };

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
                            ROC Notice
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
                        {['Entity Info', 'Notice Details', 'Upload Notice', 'Review', 'Payment'].map((step, i) => (
                            <div key={i} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
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
                    <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                        <div className="flex flex-col justify-center">
                            {/* Mobile: Detailed Service & Price Info */}
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">ROC Notice Reply</span>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Service</span>
                                        <span className="text-xs font-bold text-slate-700">₹{billDetails.base.toLocaleString()}</span>
                                    </div>
                                    <div className="w-px h-5 bg-gray-200"></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Govt Fee</span>
                                        <span className="text-xs font-bold text-slate-700">₹{(billDetails.total - billDetails.base).toLocaleString()}</span>
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
                                {currentStep === 1 && "Entity Information"}
                                {currentStep === 2 && "Notice Details"}
                                {currentStep === 3 && "Upload Documents"}
                                {currentStep === 4 && "Review Application"}
                                {currentStep === 5 && "Complete Payment"}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Request received for <span className="font-bold text-navy">{plans[selectedPlan].title}</span>.</p>
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
                                    onClick={() => validateStep(currentStep) && setCurrentStep(p => p + 1)}
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

    function renderStepContent() {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        {(!isLoggedIn && !localStorage.getItem('user')) && (
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
                                <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><User size={16} /> CONTACT DETAILS</h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <input name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="Your Email Address" className={`p-2 text-sm border rounded-lg ${errors.userEmail ? 'border-red-500' : ''}`} />
                                </div>
                            </div>
                        )}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><Briefcase size={16} className="text-[#015A62]" /> COMPANY INFO</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Company / LLP Name</label>
                                    <input name="companyName" value={formData.companyName} onChange={handleInputChange} className={`w-full p-2 text-sm border rounded-lg ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">CIN / LLPIN</label>
                                    <input name="cin" value={formData.cin} onChange={handleInputChange} placeholder="21 Digit No." className={`w-full p-2 text-sm border rounded-lg ${errors.cin ? 'border-red-500' : 'border-gray-200'}`} /></div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">NOTICE DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Type</label>
                                    <select name="noticeType" value={formData.noticeType} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white">
                                        <option value="Strike Off">Strike Off Notice (STK-1/5)</option>
                                        <option value="Director Disqualification">Director Disqualification</option>
                                        <option value="Penalty Notice">Penalty / Adjudication</option>
                                        <option value="Non-Compliance">General Non-Compliance</option>
                                    </select></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Date</label>
                                    <input type="date" name="noticeDate" value={formData.noticeDate} onChange={handleInputChange} className={`w-full p-2 text-sm border rounded-lg ${errors.noticeDate ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 mb-1 block">Reference ID / SN</label>
                                    <input name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} className={`w-full p-2 text-sm border rounded-lg ${errors.referenceNumber ? 'border-red-500' : 'border-gray-200'}`} /></div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center animate-in fade-in slide-in-from-right-4">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2 justify-center"><Upload size={16} className="text-[#015A62]" /> NOTICE COPY UPLOAD</h3>
                        <p className="text-xs text-gray-500 mb-4">Please upload a clear copy of the notice you received.</p>
                        <input type="file" multiple onChange={handleFileChange} className="p-4 border-2 border-dashed border-gray-200 w-full rounded-xl cursor-pointer text-xs" />
                        {selectedFiles.length > 0 && <div className="mt-4 text-left space-y-2">{selectedFiles.map((f, i) => <div key={i} className="text-xs p-2 bg-gray-50 rounded flex justify-between"><span>{f.name}</span><CheckCircle size={14} className="text-green-500" /></div>)}</div>}
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-sm animate-in zoom-in-95">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Review Application Details</h2>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between"><span>Company</span><span className="font-bold">{formData.companyName}</span></div>
                            <div className="flex justify-between"><span>Type</span><span className="font-bold italic">{formData.noticeType}</span></div>
                            <div className="flex justify-between pt-2 border-t text-lg"><span>Total</span><span className="font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <IndianRupee size={32} className="mx-auto mb-4 text-green-600" />
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Payment Summary</h2>
                        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                            <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-[#015A62] border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center">
                            <input type="checkbox" checked={isTermsAccepted || false} onChange={(e) => setIsTermsAccepted(e.target.checked)} /> I Accept Terms & Conditions
                        </label>
                        <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">
                            {isSubmitting || isPaymentProcessing ? 'Processing Payment...' : 'Pay & Submit'}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    // --- STANDARD FULL PAGE LAYOUT (Kept for fallback/direct access) ---
    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase"><ArrowLeft size={14} /> Back</button>
                <div className="flex gap-8">
                    <div className="w-72 hidden lg:block space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                            {['Entity', 'Notice', 'Upload', 'Review', 'Pay'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-navy text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        <div className="mt-6 flex justify-between">
                            <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1}>Back</button>
                            <button onClick={() => validateStep(currentStep) && setCurrentStep(p => p + 1)} className="bg-[#ED6E3F] text-white px-6 py-2 rounded">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RocNoticeReplyRegistration;
