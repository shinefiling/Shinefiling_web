import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, ChevronRight,
    Save, Shield, CreditCard, Lock, Info, Award, Rocket, Building, Briefcase, X, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitStartupIndia } from '../../../api';
import { uploadFile } from '../../../utils/uploadFile';

// Pricing Configuration
const pricing = {
    basic: { serviceFee: 4999, title: "Basic", subtitle: "DPIIT Recognition Only" },
    standard: { serviceFee: 9999, title: "Standard", subtitle: "Recognition + Pitch Deck" },
    premium: { serviceFee: 14999, title: "Premium", subtitle: "Recognition + Tax Exemption" }
};

const ApplyStartupIndia = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPlan = planProp || queryParams.get('plan') || 'basic';

    const [step, setStep] = useState(1);
    const [plan, setPlan] = useState(initialPlan);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        startupName: '',
        cinLlpNumber: '',
        dateOfIncorporation: '',
        industry: '',
        sector: '',
        website: '',
        mobile: '',
        email: ''
    });

    const [documents, setDocuments] = useState({
        coi: null,
        pitchDeck: null,
        directorsList: null
    });

    // Load User Data
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    email: user.email || '',
                    mobile: user.mobile || ''
                }));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!isModal) window.scrollTo(0, 0);
    }, [step, isModal]);

    // Bill Details
    const billDetails = useMemo(() => {
        const selectedPricing = pricing[plan] || pricing.basic;
        const basePrice = selectedPricing.serviceFee;
        const platformFee = Math.round(basePrice * 0.03); // 3%
        const tax = Math.round(basePrice * 0.18);         // 18% GST

        return {
            base: basePrice,
            platformFn: platformFee,
            tax: tax,
            total: basePrice + platformFee + tax,
            planName: selectedPricing.title,
            planSubtitle: selectedPricing.subtitle
        };
    }, [plan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, docType) => {
        if (e.target.files && e.target.files[0]) {
            setDocuments(prev => ({ ...prev, [docType]: e.target.files[0] }));
        }
    };

    const validateStep = (currentStep) => {
        setError(null);
        switch (currentStep) {
            case 1: // Plan Selection
                return null;
            case 2: // Startup Details
                if (!formData.startupName) return "Startup Name is required.";
                if (!formData.cinLlpNumber) return "CIN / LLPIN is required.";
                if (!formData.dateOfIncorporation) return "Date of Incorporation is required.";
                if (!formData.industry) return "Industry is required.";
                if (!formData.mobile || formData.mobile.length !== 10) return "Valid Mobile Number is required.";
                if (!formData.email) return "Email is required.";
                return null;
            case 3: // Documents
                if (!documents.coi) return "Certificate of Incorporation (COI) is mandatory.";
                if (!documents.directorsList) return "List of Directors/Partners is mandatory.";
                // Pitch Deck mandatory only for Standard/Premium or generally? Usually mandatory for Recognition.
                if (!documents.pitchDeck) return "Pitch Deck or Brief Note is mandatory.";
                return null;
            default:
                return null;
        }
    };

    const handleNext = () => {
        const validationError = validateStep(step);
        if (validationError) {
            setError(validationError);
            return;
        }
        setStep(prev => Math.min(5, prev + 1));
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const uploadedDocsList = [];

            // Upload Documents
            const uploadPromises = Object.entries(documents).map(async ([key, file]) => {
                if (file) {
                    try {
                        const uploadRes = await uploadFile(file, 'startup-india');
                        return {
                            id: key,
                            filename: uploadRes.originalName || file.name,
                            fileUrl: uploadRes.fileUrl,
                            type: key
                        };
                    } catch (e) {
                        console.error(`Failed to upload ${key}`, e);
                        return null;
                    }
                }
                return null;
            });

            const uploadedResults = await Promise.all(uploadPromises);
            uploadedResults.forEach(doc => {
                if (doc) uploadedDocsList.push(doc);
            });

            // Prepare Payload
            const submissionPayload = {
                submissionId: `STARTUP-${Date.now()}`,
                userEmail: formData.email,
                plan: plan,
                amountPaid: billDetails.total,
                status: "INITIATED",
                formData: {
                    ...formData,
                    entityType: "Private Limited/LLP", // Assuming mostly these
                    selectedPlan: billDetails.planName
                },
                documents: uploadedDocsList,
                createdAt: new Date().toISOString()
            };

            // API Call
            await submitStartupIndia(submissionPayload);

            // Redirect
            if (isModal) {
                onClose();
                navigate('/dashboard?tab=orders');
            } else {
                navigate('/dashboard?tab=orders');
            }

        } catch (err) {
            console.error("Submission Error", err);
            setError(err.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Plan Selection', 'Entity Details', 'Documents', 'Review', 'Payment'];

    const renderStepContent = () => {
        switch (step) {
            case 1: // Service Selection
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Rocket size={20} className="text-red-600" /> SELECT PACKAGE
                            </h3>
                            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 flex items-start gap-3 mb-6">
                                <Info className="text-red-600 mt-0.5 shrink-0" size={18} />
                                <p className="text-sm text-red-800">
                                    Choose a package based on your current stage. For <strong>Tax Exemptions</strong>, select the Premium plan.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.entries(pricing).map(([key, val]) => (
                                        <button
                                            key={key}
                                            onClick={() => setPlan(key)}
                                            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${plan === key
                                                ? 'border-red-600 bg-red-50 ring-1 ring-red-600'
                                                : 'border-slate-200 hover:border-red-300 hover:bg-slate-50'}`}
                                        >
                                            <div>
                                                <div className={`font-bold text-base ${plan === key ? 'text-navy' : 'text-slate-700'}`}>{val.title}</div>
                                                <div className="text-xs text-slate-500 font-medium">{val.subtitle}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-red-600 font-bold">₹{val.serviceFee}</div>
                                                {plan === key && <CheckCircle size={16} className="text-red-600 ml-auto mt-1" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Startup Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Building size={20} className="text-orange-600" /> ENTITY DETAILS
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Startup Name</label>
                                    <input type="text" name="startupName" value={formData.startupName} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="e.g. Acme Innovations" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">CIN / LLPIN</label>
                                    <input type="text" name="cinLlpNumber" value={formData.cinLlpNumber} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white uppercase" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Date of Incorporation</label>
                                    <input type="date" name="dateOfIncorporation" value={formData.dateOfIncorporation} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Website (Optional)</label>
                                    <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="https://" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Industry</label>
                                    <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="e.g. IT Services" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Sector</label>
                                    <input type="text" name="sector" value={formData.sector} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="e.g. AI / ML" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Authorized Mobile</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-slate-400 font-bold">+91</span>
                                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} maxLength={10} className="w-full pl-12 p-3 rounded-lg border border-gray-200 bg-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Authorized Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Upload size={20} className="text-bronze" /> UPLOAD DOCUMENTS
                            </h3>
                            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex items-start gap-3 mb-6">
                                <AlertCircle className="text-orange-600 mt-0.5 shrink-0" size={18} />
                                <p className="text-sm text-orange-800">
                                    Upload clear copies. Pitch Deck is crucial for approval.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'coi', label: 'Certificate of Incorporation (COI)', required: true },
                                    { id: 'directorsList', label: 'List of Directors / Partners', required: true },
                                    { id: 'pitchDeck', label: 'Pitch Deck / Innovation Note', required: true }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-blue-300 transition-colors bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <FileText size={20} className="text-gray-400 group-hover:text-bronze" />
                                            <div>
                                                <p className="text-sm font-bold text-navy flex items-center gap-2">
                                                    {doc.label} {doc.required && <span className="text-red-500">*</span>}
                                                </p>
                                                {documents[doc.id] ? (
                                                    <p className="text-xs text-green-600 font-medium mt-0.5">{documents[doc.id].name.substring(0, 30)}...</p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 mt-0.5">Upload File</p>
                                                )}
                                            </div>
                                        </div>
                                        <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition shadow-sm">
                                            {documents[doc.id] ? 'Change' : 'Select'}
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, doc.id)} accept="application/pdf,image/*" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Review Application</h2>
                        <p className="text-gray-500 mb-8">Verify your information before submission.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200 text-left">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Plan</span><span className="font-bold">{billDetails.planName}</span></div>
                                <div className="flex justify-between"><span>Startup</span><span className="font-bold">{formData.startupName}</span></div>
                                <div className="flex justify-between"><span>CIN/LLPIN</span><span className="font-bold uppercase">{formData.cinLlpNumber}</span></div>
                                <div className="flex justify-between"><span>Mobile</span><span className="font-bold">{formData.mobile}</span></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={handleBack} className="py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50">Edit</button>
                            <button onClick={() => setStep(5)} className="py-3 bg-navy text-white rounded-xl font-bold hover:bg-black transition">Proceed to Pay</button>
                        </div>
                    </div>
                );

            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Award size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Almost Done!</h2>
                        <p className="text-gray-500 mb-8">Secure payment gateway</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Professional Fee</span><span>₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Tax (18%)</span><span>₹{billDetails.tax}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Platform Fee</span><span>₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="border-t pt-2 mt-2 flex justify-between items-end"><span className="text-gray-500 font-bold">Total</span><span className="text-3xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                        </div>

                        <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
                            {loading ? 'Processing...' : `Pay ₹${billDetails.total} & Submit`}
                            {!loading && <Lock size={18} />}
                        </button>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className={`flex flex-row overflow-hidden bg-white ${isModal ? 'h-[85vh]' : 'min-h-screen pt-20'}`}>
            {/* LEFT SIDEBAR: DARK */}
            <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10 mb-8">
                    <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                        <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                        Startup India
                    </h1>
                    <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 blur-sm pointer-events-none">
                            <Rocket size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</div>
                            <div className="font-bold text-white text-lg tracking-tight mb-4">{billDetails.planName}</div>
                            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Professional Fee</span>
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
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    {steps.map((s, i) => (
                        <div key={i} onClick={() => { if (step > i + 1) setStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${step === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === i + 1 ? 'bg-[#ED6E3F] text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                {step > i + 1 ? <CheckCircle size={12} /> : i + 1}
                            </div>
                            <span className={`text-xs font-medium ${step === i + 1 ? 'text-white font-bold' : ''}`}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                    <div className="flex flex-col justify-center">
                        <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                            <div className="flex items-center gap-2 truncate">
                                <span className="font-bold text-slate-800 text-sm truncate">Startup India</span>
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
                        <h2 className="hidden md:block font-bold text-slate-800 text-lg">{steps[step - 1]}</h2>
                    </div>

                    <button onClick={isModal ? onClose : () => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                        {isModal ? <X size={20} /> : <ArrowLeft size={20} />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderStepContent()}
                </div>

                {step < 5 && (
                    <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                        <button onClick={() => setStep(p => Math.max(1, p - 1))} disabled={step === 1} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30">Back</button>
                        <button onClick={handleNext} className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition flex items-center gap-2 text-sm">Save & Continue <ArrowRight size={16} /></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyStartupIndia;
