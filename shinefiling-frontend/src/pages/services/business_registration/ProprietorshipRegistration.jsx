import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, MapPin, Plus, Trash2, ArrowLeft, ArrowRight, X, IndianRupee, Briefcase, Building, Shield, Receipt, AlertCircle, Lock
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitProprietorshipRegistration, uploadFile } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

// CONSTANTS
const validatePlan = (plan) => {
    return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'basic';
};

const PLATFORM_FEE = 0;
const GST_RATE = 0.18;

const ProprietorshipRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        basic: {
            price: 1999,
            title: 'Starter Plan',
            features: [
                "MSME (Udyam) Registration",
                "Business PAN Application",
                "Current Account Opening Support",
                "Basic Legal Consultation",
                "Email Support"
            ],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 4999,
            title: 'Pro Plan',
            features: [
                "Everything in Starter Plan",
                "GST Registration",
                "Shop & Establishment License",
                "CA Certified Net Worth Certificate",
                "Priority Support"
            ],
            color: 'bg-sky-50 border-sky-200'
        },
        premium: {
            price: 7999,
            title: 'Advanced Plan',
            features: [
                "Everything in Pro Plan",
                "Professional Tax Registration",
                "Trademark Filing (1 Class)",
                "Income Tax Return (1 Year)",
                "Dedicated Account Manager"
            ],
            color: 'bg-indigo-50 border-indigo-200'
        }
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const planParam = searchParams.get('plan');

    // Protect Route
    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = planParam || 'basic';
            navigate('/login', { state: { from: `/services/sole-proprietorship/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, planParam, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    // Initialize state
    const [selectedPlan, setSelectedPlan] = useState(() => validatePlan(planProp || planParam));

    // Sync Plan
    useEffect(() => {
        const targetPlan = validatePlan(planProp || planParam);
        if (targetPlan !== selectedPlan) {
            setSelectedPlan(targetPlan);
        }
    }, [planParam, planProp, selectedPlan]);

    const [formData, setFormData] = useState({
        businessNameOption1: '',
        businessNameOption2: '',
        businessType: 'Trading',
        businessAddress: '',
        proprietorName: '',
        email: '',
        mobile: '',
        panNumber: '',
        aadhaarNumber: '',
        gstState: '',
        shopActState: '',
        professionalTaxState: '',
        bankPreference: ''
    });

    useEffect(() => {
        const storedUser = user || JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setFormData(prev => ({
                ...prev,
                proprietorName: prev.proprietorName || storedUser.name || storedUser.fullName || '',
                email: prev.email || storedUser.email || '',
                mobile: prev.mobile || storedUser.mobile || storedUser.phoneNumber || ''
            }));
        }
    }, [user]);

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Memoize bill details
    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.basic;
        const basePrice = plan.price;

        const platformFee = Math.round(basePrice * 0.03); // 3%
        const taxVal = Math.round(basePrice * 0.03); // 3%
        const gst = Math.round(basePrice * 0.09); // 9%

        return {
            base: basePrice,
            platformFn: platformFee,
            tax: taxVal,
            gst: gst,
            total: basePrice + platformFee + taxVal + gst
        };
    }, [selectedPlan]);

    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.businessNameOption1) { newErrors.businessNameOption1 = "Required"; isValid = false; }
            if (!formData.businessAddress) { newErrors.businessAddress = "Required"; isValid = false; }
            if (!formData.proprietorName) { newErrors.proprietorName = "Required"; isValid = false; }
            if (!formData.mobile) { newErrors.mobile = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'proprietorship_docs');
            setFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed.");
        }
    };

    const submitApplication = async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || formData.email;
        const phone = userObj?.phone || formData.mobile;

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${plans[selectedPlan]?.title} - Proprietorship`,
            prefill: {
                name: formData.proprietorName || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                try {
                    const docsList = Object.entries(files).map(([k, v]) => ({
                        id: k,
                        filename: v.name,
                        fileUrl: v.fileUrl
                    }));

                    const finalPayload = {
                        submissionId: `SOLE-${Date.now()}`,
                        plan: selectedPlan,
                        userEmail: email,
                        formData: formData,
                        documents: docsList,
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        },
                        status: "PAYMENT_SUCCESSFUL",
                        amount: billDetails.total
                    };

                    const apiResponse = await submitProprietorshipRegistration(finalPayload);
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
            case 1: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><Building size={16} /> BUSINESS DETAILS</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Business Name</label>
                                <input name="businessNameOption1" value={formData.businessNameOption1} onChange={handleInputChange} placeholder="Proposed Name 1" className={`w-full p-2 text-sm border rounded-lg ${errors.businessNameOption1 ? 'border-red-500' : ''}`} />
                            </div>
                            <div className="col-span-2">
                                <input name="businessNameOption2" value={formData.businessNameOption2} onChange={handleInputChange} placeholder="Proposed Name 2 (Optional)" className="w-full p-2 text-sm border rounded-lg" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Business Activity</label>
                                <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full p-2 text-sm border rounded-lg">
                                    <option value="Trading">Trading</option>
                                    <option value="Service">Service</option>
                                    <option value="Online">Online Business</option>
                                    <option value="Shop">Retail Shop</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Office Address</label>
                                <textarea name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} placeholder="Registered Address" className={`w-full p-2 text-sm border rounded-lg ${errors.businessAddress ? 'border-red-500' : ''}`} rows="2" />
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><User size={16} /> PROPRIETOR INFO</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input name="proprietorName" value={formData.proprietorName} onChange={handleInputChange} placeholder="Full Name (As per PAN)" className={`col-span-2 p-2 text-sm border rounded-lg ${errors.proprietorName ? 'border-red-500' : ''}`} />
                            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="p-2 text-sm border rounded-lg" />
                            <input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile" className={`p-2 text-sm border rounded-lg ${errors.mobile ? 'border-red-500' : ''}`} />
                            <input name="panNumber" value={formData.panNumber} onChange={handleInputChange} placeholder="PAN Number" className="p-2 text-sm border rounded-lg" />
                            <input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} placeholder="Aadhaar Number" className="p-2 text-sm border rounded-lg" />
                        </div>
                    </div>
                    {selectedPlan !== 'basic' && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><Briefcase size={16} /> ADDITIONAL DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <input name="gstState" value={formData.gstState} onChange={handleInputChange} placeholder="GST State" className="p-2 text-sm border rounded-lg" />
                                <input name="shopActState" value={formData.shopActState} onChange={handleInputChange} placeholder="Shop Act State" className="p-2 text-sm border rounded-lg" />
                            </div>
                        </div>
                    )}
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm">DOCUMENTS</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {['Photo', 'PAN Card', 'Aadhaar Card', 'Address Proof'].map((doc, i) => (
                                <div key={i} className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-gray-50">
                                    <span className="text-xs text-gray-600 font-medium">{doc}</span>
                                    <div className="flex items-center gap-2">
                                        {files[doc.replace(' ', '_').toLowerCase()] && <CheckCircle size={14} className="text-green-500" />}
                                        <input type="file" onChange={(e) => handleFileUpload(e, doc.replace(' ', '_').toLowerCase())} className="text-[10px] w-20 text-transparent file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-navy mb-4">Review Application</h2>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2"><span>Plan</span><span className="font-bold text-navy">{plans[selectedPlan]?.title}</span></div>
                        <div className="flex justify-between border-b pb-2"><span>Business Name</span><span className="font-bold">{formData.businessNameOption1}</span></div>
                        <div className="flex justify-between border-b pb-2"><span>Proprietor</span><span className="font-bold">{formData.proprietorName}</span></div>
                        <div className="flex justify-between"><span>Contact</span><span className="font-bold">{formData.mobile}</span></div>
                    </div>
                </div>
            );
            case 5: return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <Receipt size={32} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                        <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
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

    // --- MODAL LAYOUT: SPLIT VIEW (Left Sidebar + Right Content) ---
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
                            Proprietorship
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
                        {['Business Details', 'Proprietor Info', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Proprietorship</span>
                                    {/* <span className="text-gray-300">|</span> */}
                                    {/* <span className="text-slate-500 text-xs font-medium truncate">{plans[selectedPlan]?.title}</span> */}
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
                                {currentStep === 1 && "Business Information"}
                                {currentStep === 2 && "Proprietor Details"}
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
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
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

    // --- STANDARD FULL PAGE FALLBACK (If accessed directly) ---
    return (
        <div className="min-h-screen pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
                {/* Re-use the modal layout content essentially */}
                <div className="w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative">
                    {/* Same sidebar content simplified */}
                    <h1 className="font-bold text-lg mb-8">Proprietorship</h1>
                    <div className="flex-1 space-y-2">
                        {['Business Details', 'Proprietor Info', 'Documents', 'Review', 'Payment'].map((step, i) => (
                            <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-white/10' : ''}`}>{step}</div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    {renderStepContent()}
                    <div className="mt-4 flex justify-between">
                        <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1} className="text-gray-500">Back</button>
                        {currentStep < 5 && <button onClick={handleNext} className="bg-navy text-white px-4 py-2 rounded-lg">Next</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProprietorshipRegistration;
