import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, Landmark, Scale
} from 'lucide-react';
import { submitBankLoanDocumentation, uploadFile } from '../../../api';

const BankLoanDocumentationRegistration = ({ isModal, onClose, initialData = {}, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Determine initial plan
    const queryPlan = searchParams.get('plan') || planProp || initialData.plan || 'legal_opinion';
    const [selectedPlan, setSelectedPlan] = useState(queryPlan);

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [errors, setErrors] = useState({});
    const isLoggedIn = !!localStorage.getItem('user');
    const [uploadedFiles, setUploadedFiles] = useState({});

    const [formData, setFormData] = useState({
        propertyAddress: '',
        loanAmount: '',
        bankName: '',
        propertyType: 'Residential',
        email: '',
        mobile: '',
        ...initialData
    });

    const plans = {
        legal_opinion: {
            price: 3999,
            title: 'Legal Opinion',
            features: ["30 Years Title Search", "Lawyer Verification", "EC Check", "Document Verification"],
            color: 'bg-white border-slate-200'
        },
        valuation: {
            price: 4999,
            title: 'Valuation Report',
            features: ["Govt Approved Valuer", "Fair Market Value", "Distress Sale Value", "Site Visit Included"],
            recommended: true,
            color: 'bg-[#043E52] text-white border-gray-700'
        },
        full_kit: {
            price: 7999,
            title: 'Full Loan Kit',
            features: ["Legal Opinion + Valuation", "Loan Agreement Drafting", "Stamp Duty Calculation", "ROC Charge Filing"],
            color: 'bg-amber-50 border-amber-200'
        }
    };

    const billDetails = React.useMemo(() => {
        const planPrice = plans[selectedPlan]?.price || 0;
        const platformFee = Math.round(planPrice * 0.03); // 3% Platform Fee
        const tax = Math.round(planPrice * 0.03); // 3% Tax
        const gst = Math.round(planPrice * 0.09); // 9% GST
        const total = planPrice + platformFee + tax + gst;
        return { base: planPrice, platformFn: platformFee, tax, gst, total };
    }, [selectedPlan]);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({ ...prev, email: user.email, mobile: user.mobile || '' }));
        }
        if (!isModal) window.scrollTo(0, 0);
    }, [isModal]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'bank_loan_docs');
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
        setLoading(true);
        try {
            const submissionId = `LOAN-DOC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const finalPayload = {
                submissionId,
                plan: selectedPlan,
                userEmail: formData.email,
                amountPaid: plans[selectedPlan].price,
                formData: { ...formData },
                documents: Object.values(uploadedFiles),
                status: 'INITIATED'
            };
            await submitBankLoanDocumentation(finalPayload);
            setIsSuccess(true);
        } catch (err) {
            alert(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(p => p + 1);
        }
    };

    const validateStep = (step) => {
        let newErrors = {};
        if (step === 1) {
            if (!isLoggedIn && !formData.email) newErrors.email = 'Email required';
            if (!formData.bankName) newErrors.bankName = 'Bank name is required';
        }
        if (step === 2) {
            if (!formData.propertyAddress) newErrors.propertyAddress = 'Address required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const steps = ['Loan Context', 'Property Details', 'Documents', 'Review & Pay'];

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
                            Bank Loan Docs
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
                        {steps.map((step, i) => (
                            <div key={i} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
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
                            {/* Mobile: Detailed Service & Price Info */}
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">Bank Loan Docs</span>
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
                                {steps[currentStep - 1]}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Request Received!</h2>
                                <p className="text-gray-500 mt-2">Request received for <span className="font-bold text-navy">{plans[selectedPlan].title}</span>.</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                    </div>
                    {!isSuccess && currentStep < 4 && (
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
                                className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition flex items-center gap-2 text-sm"
                            >
                                Save & Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function renderStepContent() {
        switch (currentStep) {
            case 1: // Loan Context
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        {(!isLoggedIn && !localStorage.getItem('user')) && (
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
                                <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><User size={16} /> CONTACT DETAILS</h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <input name="email" value={formData.email} onChange={handleChange} placeholder="Your Email Address" className={`p-2 text-sm border rounded-lg ${errors.email ? 'border-red-500' : ''}`} />
                                    <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Your Phone Number" className={`p-2 text-sm border rounded-lg ${errors.mobile ? 'border-red-500' : ''}`} />
                                </div>
                            </div>
                        )}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                                <Landmark size={16} className="text-[#015A62]" /> BANK INFORMATION
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Prospective Bank</label>
                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. SBI, HDFC" className={`w-full p-2 text-sm rounded-lg border bg-white ${errors.bankName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Sanctioned Amount (₹)</label>
                                    <input type="text" name="loanAmount" value={formData.loanAmount} onChange={handleChange} placeholder="Approx Loan Value" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Borrower Legal Name</label>
                                    <input type="text" name="borrowerName" value={formData.borrowerName} onChange={handleChange} placeholder="As per PAN" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Property Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Scale size={20} className="text-amber-600" /> COLLATERAL INFO
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Property Address</label>
                                    <textarea name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} rows="3" placeholder="Full address for site visit and verification" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Property Type</label>
                                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Residential">Residential House/Flat</option>
                                        <option value="Commercial">Commercial Shop/Office</option>
                                        <option value="Industrial">Industrial Plot/Factory</option>
                                        <option value="Agricultural">Agricultural Land</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Survey / Khata No.</label>
                                    <input type="text" name="propertyIdentifier" value={formData.propertyIdentifier} onChange={handleChange} placeholder="Unique identification number" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
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
                                <FileText size={20} className="text-bronze" /> COLLATERAL DOCUMENTS
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Required for verification and valuation.</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {['Latest Sale Deed', 'Encumbrance Certificate (EC)', 'Property Tax Receipt', 'Sanction Letter (if issued)'].map((label, idx) => {
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
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <Landmark size={32} className="text-amber-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Final Review</h2>
                        <p className="text-gray-500 mb-8">Professional verification for loan approval.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Base Price</span><span>₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Platform Fee</span><span>₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Tax</span><span>₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>GST</span><span>₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="border-t pt-2 mt-2 flex justify-between items-end"><span className="text-gray-500 font-bold">Total Payable</span><span className="text-3xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                        </div>

                        <div className="text-left bg-gray-50 p-4 rounded-xl mb-6 text-sm space-y-2 border border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Bank:</span>
                                <span className="font-semibold">{formData.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Property:</span>
                                <span className="font-semibold">{formData.propertyType}</span>
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center">
                            <input type="checkbox" checked={isTermsAccepted || false} onChange={(e) => setIsTermsAccepted(e.target.checked)} /> I Accept Terms & Conditions
                        </label>
                        <button onClick={handleSubmit} disabled={!isTermsAccepted || loading} className="w-full py-4 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? 'Processing...' : 'Pay & Initiate Verification'}
                            {!loading && <ArrowRight size={18} />}
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
                            {steps.map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-navy text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        <div className="mt-6 flex justify-between">
                            <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1}>Back</button>
                            <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-6 py-2 rounded">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankLoanDocumentationRegistration;
