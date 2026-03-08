import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, ChevronRight,
    Save, Shield, CreditCard, Lock, HelpCircle, Info, Award, Phone, Mail, MapPin, X, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitISOCertification } from '../../../api';
import { uploadFile } from '../../../utils/uploadFile';

// Pricing Configuration
const pricing = {
    iso9001: { serviceFee: 1499, title: "ISO 9001:2015", subtitle: "Quality Management" },
    iso14001: { serviceFee: 1999, title: "ISO 14001:2015", subtitle: "Environmental Mgmt" },
    iso27001: { serviceFee: 2499, title: "ISO 27001:2013", subtitle: "Information Security" },
    iso45001: { serviceFee: 1999, title: "ISO 45001:2018", subtitle: "Health & Safety" },
    ims: { serviceFee: 6999, title: "IMS Integrated", subtitle: "QMS + EMS (Combo)" }
};

const ApplyISOCertification = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPlan = planProp || queryParams.get('plan') || 'iso9001';

    const [step, setStep] = useState(1);
    const [plan, setPlan] = useState(initialPlan);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        organizationName: '',
        contactPerson: '',
        mobile: '',
        email: '',
        address: '',
        businessActivity: '',
        gstNumber: ''
    });

    const [documents, setDocuments] = useState({
        registrationCert: null,
        letterhead: null,
        panCard: null
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
                    mobile: user.mobile || '',
                    contactPerson: user.fullName || ''
                }));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!isModal) window.scrollTo(0, 0);
    }, [step, isModal]);

    // Bill Details Calculation
    const billDetails = useMemo(() => {
        let selectedKey = plan;
        if (plan === 'essential') selectedKey = 'iso9001';
        if (plan === 'professional') selectedKey = 'iso9001';
        if (plan === 'enterprise') selectedKey = 'ims';

        const selectedPricing = pricing[selectedKey] || pricing.iso9001;
        const basePrice = selectedPricing.serviceFee;
        const platformFee = Math.round(basePrice * 0.03); // 3%
        const tax = Math.round(basePrice * 0.18);         // 18% GST on service

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
            case 1: // Service Selection & Contact
                if (!formData.contactPerson) return "Contact Person Name is required.";
                if (!formData.mobile || formData.mobile.length !== 10) return "Valid 10-digit Mobile Number is required.";
                if (!formData.email) return "Email ID is required.";
                return null;
            case 2: // detailed info
                if (!formData.organizationName) return "Organization/Company Name is required.";
                if (!formData.businessActivity) return "Scope of Business (Activity) is required.";
                if (!formData.address) return "Registered Address is required.";
                return null;
            case 3: // Documents
                if (!documents.registrationCert) return "Business Registration Proof is mandatory.";
                if (!documents.letterhead) return "Letterhead/Invoice sample is mandatory.";
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
                        const uploadRes = await uploadFile(file, 'iso-certification');
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
                submissionId: `ISO-${Date.now()}`,
                userEmail: formData.email,
                plan: plan,
                amountPaid: billDetails.total,
                status: "INITIATED",
                formData: {
                    ...formData,
                    isoStandard: billDetails.planName
                },
                documents: uploadedDocsList,
                createdAt: new Date().toISOString()
            };

            // API Call
            await submitISOCertification(submissionPayload);

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

    const steps = ['Standard & Contact', 'Organization', 'Documents', 'Review', 'Payment'];

    const renderStepContent = () => {
        switch (step) {
            case 1: // Service Selection & Contact
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
                                <Award size={20} className="text-blue-600" /> SELECT STANDARD
                            </h3>
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3 mb-6">
                                <Info className="text-blue-600 mt-0.5 shrink-0" size={18} />
                                <p className="text-sm text-blue-800">
                                    Select the ISO Standard you need. For most tenders, <strong>ISO 9001:2015</strong> is the primary requirement.
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.entries(pricing).map(([key, val]) => (
                                        <button
                                            key={key}
                                            onClick={() => setPlan(key)}
                                            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${plan === key
                                                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                                        >
                                            <div>
                                                <div className={`font-bold text-base ${plan === key ? 'text-navy' : 'text-slate-700'}`}>{val.title}</div>
                                                <div className="text-xs text-slate-500 font-medium">{val.subtitle}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-blue-600 font-bold">₹{val.serviceFee}</div>
                                                {plan === key && <CheckCircle size={16} className="text-blue-600 ml-auto mt-1" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2 pt-4 border-t border-gray-100">
                                <Phone size={20} className="text-orange-600" /> CONTACT PERSON
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Your Name</label>
                                    <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="e.g. John Doe" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Mobile Number</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-slate-400 font-bold">+91</span>
                                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} maxLength={10} className="w-full pl-12 p-3 rounded-lg border border-gray-200 bg-white font-bold text-navy" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Email ID (For Certification)</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="company@example.com" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Organization Details
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
                                <CreditCard size={20} className="text-purple-600" /> ORGANIZATION DETAILS
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Organization / Company Name</label>
                                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white font-bold text-lg text-navy" placeholder="e.g. ABC Technologies Pvt Ltd" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Scope of Business (Activity)</label>
                                    <textarea name="businessActivity" value={formData.businessActivity} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white resize-none" rows="3" placeholder="e.g. Manufacturing of Electrical Components..." />
                                    <p className="text-[10px] text-slate-400 mt-1">This text will appear on your ISO Certificate.</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Registered Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white resize-none" rows="2" placeholder="Full address with Pincode" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">GST Number (Optional)</label>
                                    <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white uppercase" />
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
                                <Upload size={20} className="text-bronze" /> DOCUMENT UPLOAD
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">Required formats: JPEG, PNG, or PDF</p>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'registrationCert', label: 'Business Registration Proof (GST/MSME)', required: true },
                                    { id: 'letterhead', label: 'Sample Bill / Letterhead', required: true },
                                    { id: 'panCard', label: 'Company PAN / Proprietor PAN', required: false }
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
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, doc.id)} accept="image/*,application/pdf" />
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
                                <div className="flex justify-between"><span>Standard</span><span className="font-bold">{billDetails.planName}</span></div>
                                <div className="flex justify-between"><span>Company</span><span className="font-bold">{formData.organizationName}</span></div>
                                <div className="flex justify-between"><span>Contact</span><span className="font-bold">{formData.contactPerson}</span></div>
                                <div className="flex justify-between"><span>Mobile</span><span className="font-bold">{formData.mobile}</span></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                                <strong>Scope:</strong> {formData.businessActivity}
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 text-yellow-800 text-xs mb-6 flex gap-2 text-left">
                            <Info size={14} className="shrink-0 mt-0.5" />
                            By proceeding, you agree that you are the authorized representative of the organization.
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
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Certification Fee</span><span>₹{billDetails.base.toLocaleString()}</span></div>
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
                        ISO Certification
                    </h1>
                    <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 blur-sm pointer-events-none">
                            <Award size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</div>
                            <div className="font-bold text-white text-lg tracking-tight mb-4">{billDetails.planName}</div>
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
                                <span className="font-bold text-slate-800 text-sm truncate">ISO Certification</span>
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

export default ApplyISOCertification;
