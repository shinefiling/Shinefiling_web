
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, MapPin, Plus, Trash2, ArrowLeft, ArrowRight, X, Building, Users, Shield, Receipt, AlertCircle, Lock, Landmark
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitNidhiRegistration, uploadFile } from '../../../api';

// --- CONSTANTS & HELPERS MOVED OUTSIDE COMPONENT ---
const validatePlan = (plan) => {
    const p = plan?.toLowerCase();
    if (['starter', 'basic'].includes(p)) return 'starter';
    if (['pro', 'standard', 'nidhi'].includes(p)) return 'pro';
    if (['elite', 'premium', 'banker'].includes(p)) return 'elite';
    return 'starter';
};

const NidhiRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        starter: {
            price: 14999,
            title: 'Starter Nidhi',
            features: ["3 DSC & 3 DIN", "Name Approval", "MOA & AOA", "Incorporation Cert."],
            color: 'bg-white border-slate-200'
        },
        pro: {
            price: 19999,
            title: 'Pro Nidhi',
            features: ["Everything in Starter", "PAN & TAN", "GST Registration", "Bank Account Support"],
            color: 'bg-amber-50 border-amber-200'
        },
        elite: {
            price: 29999,
            title: 'Elite Nidhi',
            features: ["Everything in Pro", "NDH-4 Filing Support", "Compliance for 1 Year", "Legal Advisory"],
            color: 'bg-orange-50 border-orange-200'
        }
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
        companyNameOption1: '',
        companyNameOption2: '',
        authorizedCapital: '10 Lakhs',
        registeredAddress: '',
        bankPreference: '',
        directors: [
            { id: 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' },
            { id: 2, name: '', email: '', mobile: '', pan: '', aadhaar: '' },
            { id: 3, name: '', email: '', mobile: '', pan: '', aadhaar: '' }
        ]
    });

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Memoize bill details
    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.starter;
        const basePrice = plan.price;

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleDirectorChange = (index, e) => {
        const newDirectors = [...formData.directors];
        newDirectors[index][e.target.name] = e.target.value;
        setFormData({ ...formData, directors: newDirectors });
    };

    const addDirector = () => {
        if (formData.directors.length < 7) {
            setFormData({
                ...formData,
                directors: [...formData.directors, { id: Date.now(), name: '', email: '', mobile: '', pan: '', aadhaar: '' }]
            });
        }
    };

    const removeDirector = (index) => {
        if (formData.directors.length <= 3) {
            alert("Minimum 3 directors required for Nidhi Company.");
            return;
        }
        const newDirectors = formData.directors.filter((_, i) => i !== index);
        setFormData({ ...formData, directors: newDirectors });
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
            if (!formData.companyNameOption1) { newErrors.companyNameOption1 = "Required"; isValid = false; }
            if (!formData.registeredAddress) { newErrors.registeredAddress = "Required"; isValid = false; }
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
            let category = 'nidhi_docs';
            if (key.includes('director')) category = 'director_docs';
            const response = await uploadFile(file, category);
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
            alert("File upload failed.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(files).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = {
                submissionId: `NIDHI-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.userEmail || formData.directors[0].email,
                userPhone: JSON.parse(localStorage.getItem('user'))?.phone || formData.userPhone,
                formData: formData,
                documents: docsList,
                paymentDetails: billDetails,
                status: "PAYMENT_SUCCESSFUL"
            };
            const response = await submitNidhiRegistration(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            alert("Failed to submit. " + error.message);
        } finally {
            setIsSubmitting(false);
        }
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
                        <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><Building size={16} /> COMPANY DETAILS</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input name="companyNameOption1" value={formData.companyNameOption1} onChange={handleInputChange} placeholder="Proposed Name 1" className={`col-span-2 p-2 text-sm border rounded-lg ${errors.companyNameOption1 ? 'border-red-500' : ''}`} />
                            <input name="companyNameOption2" value={formData.companyNameOption2} onChange={handleInputChange} placeholder="Proposed Name 2" className="col-span-2 p-2 text-sm border rounded-lg" />
                            <select name="authorizedCapital" value={formData.authorizedCapital} onChange={handleInputChange} className="p-2 text-sm border rounded-lg">
                                <option value="5 Lakhs">5 Lakhs</option>
                                <option value="10 Lakhs">10 Lakhs</option>
                                <option value="15 Lakhs">15 Lakhs</option>
                            </select>
                            <input name="registeredAddress" value={formData.registeredAddress} onChange={handleInputChange} placeholder="Registered Address" className={`p-2 text-sm border rounded-lg ${errors.registeredAddress ? 'border-red-500' : ''}`} />
                            {selectedPlan !== 'starter' && (
                                <input name="bankPreference" value={formData.bankPreference} onChange={handleInputChange} placeholder="Bank Preference" className="col-span-2 p-2 text-sm border rounded-lg" />
                            )}
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    {formData.directors.map((dir, i) => (
                        <div key={dir.id || i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-xs uppercase text-gray-700">Director {i + 1}</h4>
                                {formData.directors.length > 3 && <Trash2 size={14} onClick={() => removeDirector(i)} className="cursor-pointer text-red-500" />}
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <input name="name" value={dir.name} onChange={(e) => handleDirectorChange(i, e)} placeholder="Full Name" className="p-2 text-sm border rounded-lg" />
                                <input name="pan" value={dir.pan} onChange={(e) => handleDirectorChange(i, e)} placeholder="PAN" className="p-2 text-sm border rounded-lg" />
                                <input name="email" value={dir.email} onChange={(e) => handleDirectorChange(i, e)} placeholder="Email" className="p-2 text-sm border rounded-lg" />
                                <input name="mobile" value={dir.mobile} onChange={(e) => handleDirectorChange(i, e)} placeholder="Mobile" className="p-2 text-sm border rounded-lg" />
                            </div>
                        </div>
                    ))}
                    {formData.directors.length < 7 && <button onClick={addDirector} className="w-full py-3 border-2 border-dashed rounded-xl text-gray-400 font-bold text-xs">+ ADD DIRECTOR</button>}
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm">KYC DOCUMENTS</h3>
                        <div className="space-y-4">
                            {formData.directors.map((dir, i) => (
                                <div key={i} className="border border-dashed p-3 rounded-lg bg-gray-50">
                                    <p className="text-xs font-bold mb-2 uppercase">{dir.name || `Director ${i + 1}`}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 border p-2 rounded bg-white">
                                            <span className="text-[10px]">PAN</span>
                                            {files[`director_${i + 1}_pan`] ? <CheckCircle size={12} className="text-green-500" /> : <input type="file" onChange={(e) => handleFileUpload(e, `director_${i + 1}_pan`)} className="w-16 text-[8px]" />}
                                        </div>
                                        <div className="flex items-center gap-2 border p-2 rounded bg-white">
                                            <span className="text-[10px]">Aadhaar</span>
                                            {files[`director_${i + 1}_aadhaar`] ? <CheckCircle size={12} className="text-green-500" /> : <input type="file" onChange={(e) => handleFileUpload(e, `director_${i + 1}_aadhaar`)} className="w-16 text-[8px]" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-gray-50">
                                <span className="text-xs font-bold">Office Address Proof</span>
                                {files['office_address_proof'] ? <CheckCircle size={14} className="text-green-500" /> : <input type="file" onChange={(e) => handleFileUpload(e, 'office_address_proof')} className="text-[10px] w-20" />}
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-navy mb-4">Review Application</h2>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2"><span>Plan</span><span className="font-bold text-navy">{plans[selectedPlan]?.title}</span></div>
                        <div className="flex justify-between border-b pb-2"><span>Company</span><span className="font-bold">{formData.companyNameOption1}</span></div>
                        <div className="flex justify-between border-b pb-2"><span>Directors</span><span className="font-bold">{formData.directors.length}</span></div>
                        <div className="flex justify-between"><span>Capital</span><span className="font-bold">{formData.authorizedCapital}</span></div>
                    </div>
                </div>
            );
            case 5: return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <Receipt size={32} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                        <div className="flex justify-between text-sm"><span>Base Price</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                        <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center"><input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} /> I Accept Terms & Conditions</label>
                    <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">Pay & Submit</button>
                </div>
            );
        }
    }

    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK - Hidden on Mobile */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg text-[#ED6E3F] flex items-center gap-2 tracking-tight">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Nidhi Registration
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
                        {['Company Details', 'Directors', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-[#ED6E3F] text-sm truncate">Nidhi Registration</span>
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
                                {currentStep === 1 && "Company Information"}
                                {currentStep === 2 && "Director Details"}
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

    // Standard Layout (Fallback)
    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto text-center py-20">
                <h1 className="text-3xl font-bold text-navy mb-4">Application Form</h1>
                <p className="text-gray-500 mb-8">Please open this in the service page modal for the best experience.</p>
                <button onClick={() => navigate(-1)} className="px-8 py-3 bg-navy text-white rounded-xl font-bold">Go Back</button>
            </div>
        </div>
    );
};

export default NidhiRegistration;

