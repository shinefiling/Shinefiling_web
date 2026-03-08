import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, Upload, Calendar, Trash2, Check, FileCheck,
    ArrowLeft, ArrowRight, Zap, Building, Clock,
    Sparkles, AlertCircle, TrendingUp, Calculator,
    ShieldCheck, Download, ReceiptText, Briefcase,
    Wallet, PieChart, Shield, IndianRupee, X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitIncomeTaxReturn } from '../../../api';

const IncomeTaxReturnRegistration = ({ planProp, isModal = false, onClose }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['salaried', 'business', 'capital_gains', 'corporate'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'salaried';
    };

    const [selectedPlan, setSelectedPlan] = useState(() => validatePlan(planProp || state?.plan || searchParams.get('plan')));

    useEffect(() => {
        const targetPlan = validatePlan(planProp || state?.plan || searchParams.get('plan'));
        if (targetPlan !== selectedPlan) {
            setSelectedPlan(targetPlan);
        }
    }, [planProp, state, searchParams, selectedPlan]);


    const [formData, setFormData] = useState({
        applicantName: user?.name || '',
        panNumber: '',
        assessmentYear: '2025-26',
        employerName: '',
        annualSalary: '',
        businessName: '',
        turnover: '',
        capitalGainType: 'Equity',
        entityType: 'Firm',
        wantsRefundOptimization: true,
        userEmail: user?.email || '',
        userPhone: user?.mobile || ''
    });

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        salaried: {
            price: 999,
            title: 'Salaried',
            features: ["ITR-1/2 Filing", "Form-16 Import", "Tax Refund Assist"],
            color: 'bg-white border-slate-200'
        },
        business: {
            price: 1999,
            title: 'Business',
            features: ["ITR-3/4 Filing", "P&L/Balance Sheet", "Presumptive Audit"],
            recommended: true,
            color: 'bg-indigo-50 border-indigo-200'
        },
        capital_gains: {
            price: 2999,
            title: 'Investor',
            features: ["Shares/MF Gain", "Property Tax Prep", "Loss Carry Forward"],
            color: 'bg-purple-50 border-purple-200'
        },
        corporate: {
            price: 4999,
            title: 'Entity / Firm',
            features: ["ITR-5/6/7 Filing", "Pvt Ltd / LLP", "Tax Audit Support"],
            color: 'bg-blue-50 border-blue-200'
        }
    };

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.salaried;
        const basePrice = plan.price;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);
        const total = basePrice + platformFee + tax + gst;
        return { basePrice, platformFee, tax, gst, total };
    }, [selectedPlan]);

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const handleFileUpload = (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [docName]: file }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            const isReallyLoggedIn = !!user;
            if (!isReallyLoggedIn) {
                if (!formData.userEmail) { newErrors.userEmail = "Required"; isValid = false; }
                if (!formData.userPhone) { newErrors.userPhone = "Required"; isValid = false; }
            }
            if (!formData.applicantName) { newErrors.applicantName = "Name required"; isValid = false; }
            if (!formData.panNumber) { newErrors.panNumber = "PAN required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(4, prev + 1));
    };


    const submitApplication = async () => {
        setIsSubmitting(true);
        const payload = new FormData();
        const incomeDetails = {
            employerName: formData.employerName,
            annualSalary: formData.annualSalary,
            businessName: formData.businessName,
            turnover: formData.turnover,
            capitalGainType: formData.capitalGainType,
            entityType: formData.entityType
        };

        const requestData = {
            plan: selectedPlan,
            assessmentYear: formData.assessmentYear,
            panNumber: formData.panNumber,
            applicantName: formData.applicantName,
            incomeDetails: incomeDetails,
            wantsRefundOptimization: formData.wantsRefundOptimization,
            userEmail: formData.userEmail,
            userPhone: formData.userPhone
        };

        payload.append('data', JSON.stringify(requestData));

        Object.keys(files).forEach(key => {
            payload.append('documents', files[key]);
        });

        try {
            const response = await submitIncomeTaxReturn(payload);
            setAutomationPayload({ submissionId: response?.submissionId || `ITR-${Date.now()}` });
            setIsSuccess(true);
        } catch (error) {
            alert("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        {(!user) && (
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 pb-6 border-b border-gray-100">
                                <h3 className="md:col-span-2 font-bold text-slate-800 mb-1 text-sm flex items-center gap-2"><User size={16} /> CONTACT DETAILS</h3>
                                <input name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="Your Email Address" className={`p-2 text-sm border rounded-lg ${errors.userEmail ? 'border-red-500' : ''}`} />
                                <input name="userPhone" value={formData.userPhone} onChange={handleInputChange} placeholder="Your Phone Number" className={`p-2 text-sm border rounded-lg ${errors.userPhone ? 'border-red-500' : ''}`} />
                            </div>
                        )}
                        <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><User size={16} /> PRIMARY IDENTIFICATION</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input name="applicantName" value={formData.applicantName} onChange={handleInputChange} placeholder="Applicant Legal Name" className={`p-2 text-sm border rounded-lg ${errors.applicantName ? 'border-red-500' : ''}`} />
                            <input name="panNumber" value={formData.panNumber} onChange={handleInputChange} placeholder="PAN Card Number" className={`p-2 text-sm border rounded-lg uppercase ${errors.panNumber ? 'border-red-500' : ''}`} />
                            <select name="assessmentYear" value={formData.assessmentYear} onChange={handleInputChange} className="md:col-span-2 p-2 text-sm border rounded-lg w-full">
                                <option value="2025-26">2025-26 (Latest)</option>
                                <option value="2024-25">2024-25</option>
                            </select>
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><PieChart size={16} /> INCOME METRICS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedPlan === 'salaried' && (
                                <>
                                    <input name="employerName" value={formData.employerName} onChange={handleInputChange} placeholder="Current Employer Name" className="p-2 text-sm border rounded-lg md:col-span-2" />
                                    <input type="number" name="annualSalary" value={formData.annualSalary} onChange={handleInputChange} placeholder="Annual CTC (Approx)" className="p-2 text-sm border rounded-lg md:col-span-2" />
                                </>
                            )}
                            {selectedPlan === 'business' && (
                                <>
                                    <input name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Trade / Profession Name" className="p-2 text-sm border rounded-lg md:col-span-2" />
                                    <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} placeholder="Estimated Turnover" className="p-2 text-sm border rounded-lg md:col-span-2" />
                                </>
                            )}
                            {selectedPlan === 'capital_gains' && (
                                <select name="capitalGainType" value={formData.capitalGainType} onChange={handleInputChange} className="p-2 text-sm border rounded-lg md:col-span-2">
                                    <option value="Equity">Listed Shares / Mutual Funds</option>
                                    <option value="Property">Real Estate / Property Sale</option>
                                    <option value="Crypto">VDA / Crypto-Currency Yields</option>
                                    <option value="Foreign">Foreign Assets / Income</option>
                                </select>
                            )}
                            {selectedPlan === 'corporate' && (
                                <>
                                    <input name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Entity Name" className="p-2 text-sm border rounded-lg md:col-span-2" />
                                    <select name="entityType" value={formData.entityType} onChange={handleInputChange} className="p-2 text-sm border rounded-lg">
                                        <option value="Firm">Partnership Firm</option>
                                        <option value="LLP">LLP</option>
                                        <option value="Company">Private Ltd / Ltd</option>
                                        <option value="Trust">Trust / NGO</option>
                                    </select>
                                    <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} placeholder="Annual Turnover" className="p-2 text-sm border rounded-lg" />
                                </>
                            )}

                            <label className="md:col-span-2 flex items-center gap-2 mt-4 p-3 border rounded-lg bg-teal-50/30">
                                <input type="checkbox" name="wantsRefundOptimization" checked={formData.wantsRefundOptimization} onChange={handleInputChange} className="w-4 h-4 text-teal-600 rounded border-gray-300" />
                                <span className="text-sm text-slate-700">Apply Refund Optimization (80C / Chapter VI-A)</span>
                            </label>
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm">UPLOAD DATA</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {selectedPlan === 'salaried' && (
                                <div className="border border-dashed p-3 rounded-lg flex justify-between items-center"><span className="text-xs text-gray-600">Form-16 (PDF)</span><input type="file" onChange={(e) => handleFileUpload(e, 'form16')} className="text-[10px] w-20" /></div>
                            )}
                            <div className="border border-dashed p-3 rounded-lg flex justify-between items-center"><span className="text-xs text-gray-600">Bank Stmt (Full FY)</span><input type="file" onChange={(e) => handleFileUpload(e, 'bank_stmt')} className="text-[10px] w-20" /></div>
                            <div className="border border-dashed p-3 rounded-lg flex justify-between items-center"><span className="text-xs text-gray-600">Investment Proofs</span><input type="file" onChange={(e) => handleFileUpload(e, 'investments')} className="text-[10px] w-20" /></div>
                            {selectedPlan === 'capital_gains' && (
                                <div className="border border-dashed p-3 rounded-lg flex justify-between items-center"><span className="text-xs text-gray-600">Capital Gain Summary</span><input type="file" onChange={(e) => handleFileUpload(e, 'gain_stmt')} className="text-[10px] w-20" /></div>
                            )}
                            {selectedPlan === 'corporate' && (
                                <>
                                    <div className="border border-dashed p-3 rounded-lg flex justify-between items-center"><span className="text-xs text-gray-600">Financial Stmts (BS/PL)</span><input type="file" onChange={(e) => handleFileUpload(e, 'financials')} className="text-[10px] w-20" /></div>
                                    <div className="border border-dashed p-3 rounded-lg flex justify-between items-center"><span className="text-xs text-gray-600">Audit Report (Opt)</span><input type="file" onChange={(e) => handleFileUpload(e, 'audit')} className="text-[10px] w-20" /></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <IndianRupee size={32} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 text-left space-y-2">
                        <div className="flex justify-between text-sm"><span>Applicant</span><span className="font-bold">{formData.applicantName}</span></div>
                        <div className="flex justify-between text-sm"><span>PAN</span><span className="font-bold uppercase">{formData.panNumber}</span></div>
                        <div className="flex justify-between text-sm"><span>FY</span><span className="font-bold">{formData.assessmentYear}</span></div>
                        <div className="my-2 border-t"></div>
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
                    <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50 transition">
                        Pay & Submit
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
                            Income Tax Return
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
                        {['Identity Info', 'Income Metrics', 'Upload Data', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Income Tax Return</span>
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
                                {currentStep === 1 && "Start Filing"}
                                {currentStep === 2 && "Income Details"}
                                {currentStep === 3 && "Data Upload"}
                                {currentStep === 4 && "Complete Payment"}
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
                            {['Identity Info', 'Income Metrics', 'Upload Data', 'Payment'].map((s, i) => (
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

export default IncomeTaxReturnRegistration;
