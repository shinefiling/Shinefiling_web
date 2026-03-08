
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Banknote, Calendar, X
} from 'lucide-react';
import { uploadFile } from '../../../utils/uploadFile';
import { submitChequeBounceNotice } from '../../../api';

const ChequeBounceNoticeRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Login check removed to allow manual entry if user logged out
    }, []);

    const [currentStep, setCurrentStep] = useState(1);
    const validatePlan = (plan) => ['basic', 'standard', 'urgent'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        userType: 'Complainant',
        chequeNumber: '',
        chequeDate: '',
        bankName: '',
        chequeAmount: '',
        bounceDate: '',
        bounceReason: 'Insufficient Funds',
        otherPartyName: '',
        userEmail: JSON.parse(localStorage.getItem('user'))?.email || ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [errors, setErrors] = useState({});

    const plans = {
        basic: { price: 999, title: 'Draft Only', features: ["Sec 138 Compliant Draft", "PDF / Word Delivery", "Email Delivery"], color: 'bg-white border-slate-200' },
        standard: { price: 1499, title: 'Standard Notice', features: ["Lawyer Letterhead", "Regd. Post Dispatch", "Tracking Shared"], recommended: true, color: 'bg-[#043E52] text-white border-gray-700' },
        urgent: { price: 2499, title: 'Priority Notice', features: ["Same Day Dispatch", "Speed Post", "Lawyer Consultation"], color: 'bg-purple-50 border-purple-200' }
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

    const handleFileChange = (e) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.chequeNumber) { newErrors.chequeNumber = "Required"; isValid = false; }
            if (!formData.chequeAmount) { newErrors.chequeAmount = "Required"; isValid = false; }
            if (!formData.otherPartyName) { newErrors.otherPartyName = "Required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const uploadedDocs = [];
            for (const file of selectedFiles) {
                const url = await uploadFile(file);
                uploadedDocs.push({ type: "CHEQUE_DOC", filename: file.name, fileUrl: url });
            }
            const finalPayload = {
                submissionId: `CB-${Date.now()}`,
                plan: selectedPlan,
                userEmail: formData.userEmail,
                formData: formData,
                documents: uploadedDocs,
                amountPaid: plans[selectedPlan].price,
                status: "INITIATED"
            };
            await submitChequeBounceNotice(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
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
                            Cheque Bounce
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
                        {['Cheque Details', 'Bounce Info', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Cheque Bounce</span>
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
                                {currentStep === 1 && "Cheque Information"}
                                {currentStep === 2 && "Bounce Details"}
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
                                    <input name="userPhone" value={formData.userPhone} onChange={handleInputChange} placeholder="Your Phone Number" className={`p-2 text-sm border rounded-lg ${errors.userPhone ? 'border-red-500' : ''}`} />
                                </div>
                            </div>
                        )}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><Banknote size={16} className="text-[#015A62]" /> CHEQUE DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Cheque Number</label>
                                    <input type="text" name="chequeNumber" value={formData.chequeNumber} onChange={handleInputChange} placeholder="6 Digit No." className={`w-full p-2 text-sm border rounded-lg ${errors.chequeNumber ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Cheque Amount (₹)</label>
                                    <input type="number" name="chequeAmount" value={formData.chequeAmount} onChange={handleInputChange} placeholder="₹ 0.00" className={`w-full p-2 text-sm border rounded-lg ${errors.chequeAmount ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Cheque Date</label>
                                    <input type="date" name="chequeDate" value={formData.chequeDate} onChange={handleInputChange} className="w-full p-2 text-sm border rounded-lg border-gray-200" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Bank Name</label>
                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="e.g. SBI, HDFC" className="w-full p-2 text-sm border rounded-lg border-gray-200" /></div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><User size={16} className="text-[#ED6E3F]" /> PARTIES</h3>
                            <div className="grid gap-3">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Other Party Name (Drawer)</label>
                                    <input type="text" name="otherPartyName" value={formData.otherPartyName} onChange={handleInputChange} placeholder="Who signed the cheque?" className={`w-full p-2 text-sm border rounded-lg ${errors.otherPartyName ? 'border-red-500' : 'border-gray-200'}`} /></div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><Calendar size={16} className="text-red-500" /> BOUNCE DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Check Bounce Date</label>
                                    <input type="date" name="bounceDate" value={formData.bounceDate} onChange={handleInputChange} className="w-full p-2 text-sm border rounded-lg border-gray-200" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Reason for Bounce</label>
                                    <select name="bounceReason" value={formData.bounceReason} onChange={handleInputChange} className="w-full p-2 text-sm border rounded-lg border-gray-200">
                                        <option value="Insufficient Funds">Insufficient Funds</option>
                                        <option value="Account Closed">Account Closed</option>
                                        <option value="Signature Mismatch">Signature Mismatch</option>
                                        <option value="Stop Payment">Stop Payment</option>
                                    </select></div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center animate-in fade-in slide-in-from-right-4">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2 justify-center"><Upload size={16} className="text-[#015A62]" /> UPLOAD DOCUMENTS</h3>
                        <p className="text-xs text-gray-500 mb-4">Upload Cheque Copy and Bank Return Memo.</p>
                        <input type="file" multiple onChange={handleFileChange} className="p-4 border-2 border-dashed border-gray-200 w-full rounded-xl cursor-pointer text-xs" />
                        {selectedFiles.length > 0 && <div className="mt-4 text-left space-y-2">{selectedFiles.map((f, i) => <div key={i} className="text-xs p-2 bg-gray-50 rounded flex justify-between"><span>{f.name}</span><CheckCircle size={14} className="text-green-500" /></div>)}</div>}
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Confirm Details</h2>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                            <div className="flex justify-between"><span>Cheque No.</span><span className="font-bold">{formData.chequeNumber}</span></div>
                            <div className="flex justify-between"><span>Amount</span><span className="font-bold">₹{formData.chequeAmount}</span></div>
                            <div className="flex justify-between"><span>Party</span><span className="font-bold">{formData.otherPartyName}</span></div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
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
                        <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
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
                            {['Cheque', 'Bounce', 'Docs', 'Review', 'Pay'].map((s, i) => (
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

export default ChequeBounceNoticeRegistration;
