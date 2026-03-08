import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Palette, Image, AlertTriangle, X
} from 'lucide-react';
import { uploadFile, submitDesignRegistration } from '../../../api';

const ApplyDesignRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState(() => {
        const target = (planProp || searchParams.get('plan'))?.toLowerCase();
        return ['consultation', 'design_std', 'design_corporate', 'standard'].includes(target) ? target : 'standard';
    });

    const planFromUrl = searchParams.get('plan');
    useEffect(() => {
        const targetPlan = (planProp || planFromUrl)?.toLowerCase();
        const validPlan = ['consultation', 'design_std', 'design_corporate', 'standard'].includes(targetPlan) ? targetPlan : 'standard';
        if (validPlan !== planType) {
            setPlanType(validPlan);
        }
    }, [planProp, planFromUrl]);

    // Plans
    const plans = {
        consultation: { title: "Consultation", serviceFee: 999 },
        design_std: { title: "Standard Filing", serviceFee: 4999 },
        design_corporate: { title: "Corporate Filing", serviceFee: 7999 },
        standard: { title: "Standard Filing", serviceFee: 4999 },
    };

    const [formData, setFormData] = useState({
        articleName: '',
        applicantName: '',
        applicantNature: 'STARTUP', // STARTUP, MSME, OTHER
        designDescription: '',
        isNovel: 'TRUE',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Memoize bill details
    const billDetails = useMemo(() => {
        const selectedPricing = plans[planType] || plans.standard;
        const basePrice = selectedPricing.serviceFee;

        const platformFee = Math.round(basePrice * 0.03); // 3%
        const gst = Math.round(basePrice * 0.18);         // 18%
        const govtFee = formData.applicantNature === 'OTHER' ? 4000 : 1000;

        return {
            base: basePrice,
            platformFee,
            gst,
            govt: govtFee,
            taxesTotal: platformFee + gst, // 21% extra Professional Taxes
            total: basePrice + platformFee + gst, // EXCLUDING govtFee from immediate total
            planName: selectedPricing.title
        };
    }, [planType, formData.applicantNature]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? (checked ? 'TRUE' : 'FALSE') : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.articleName) { newErrors.articleName = "Required"; isValid = false; }
            if (!formData.applicantName) { newErrors.applicantName = "Required"; isValid = false; }
            if (!formData.designDescription) { newErrors.designDescription = "Required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(4, prev + 1));
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'design-registration');
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName, fileUrl: response.fileUrl } }));
        } catch (error) {
            alert("Upload failed.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = {
                submissionId: `DES-${Date.now()}`,
                plan: planType,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData,
                documents: docsList,
                paymentDetails: billDetails,
                status: "PAYMENT_SUCCESSFUL"
            };
            await submitDesignRegistration(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><Palette size={16} className="text-sky-600" /> DESIGN DETAILS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Article Name</label>
                                <input name="articleName" value={formData.articleName} onChange={handleInputChange} placeholder="e.g. Unique Chair Design" className={`w-full p-2.5 text-sm border rounded-lg ${errors.articleName ? 'border-red-500' : ''}`} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Applicant Name</label>
                                <input name="applicantName" value={formData.applicantName} onChange={handleInputChange} placeholder="Full Name" className={`w-full p-2.5 text-sm border rounded-lg ${errors.applicantName ? 'border-red-500' : ''}`} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Nature of Applicant</label>
                                <select name="applicantNature" value={formData.applicantNature} onChange={handleInputChange} className="w-full p-2.5 text-sm border rounded-lg">
                                    <option value="STARTUP">Startup (₹1000 Gov Fee)</option>
                                    <option value="MSME">Small Enterprise (₹1000 Gov Fee)</option>
                                    <option value="OTHER">Company / Other (₹4000 Gov Fee)</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Design Description</label>
                                <textarea name="designDescription" value={formData.designDescription} onChange={handleInputChange} rows="3" placeholder="Describe the novelty of your design..." className={`w-full p-2.5 text-sm border rounded-lg ${errors.designDescription ? 'border-red-500' : ''}`} />
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2"><Upload size={16} /> UPLOAD DESIGN VIEWS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'FRONT', label: 'Front View' },
                                { id: 'SIDE', label: 'Side View' },
                                { id: 'TOP', label: 'Top/Bottom View' },
                                { id: 'POA', label: 'Power of Authority' }
                            ].map((doc) => (
                                <div key={doc.id} className="border-2 border-dashed p-4 rounded-xl text-center hover:border-sky-200 transition-colors">
                                    <label className="cursor-pointer block">
                                        <FileText size={20} className="mx-auto mb-2 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700 block mb-2">{doc.label}</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                        {uploadedFiles[doc.id] ?
                                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded">{uploadedFiles[doc.id].name}</span> :
                                            <span className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-lg">Upload</span>}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">REVIEW REGISTRATION</h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between"><span>Article Name</span><span className="font-bold text-navy">{formData.articleName}</span></div>
                            <div className="flex justify-between"><span>Applicant</span><span className="font-bold">{formData.applicantName}</span></div>
                            <div className="flex justify-between"><span>Nature</span><span className="font-bold text-xs">{formData.applicantNature}</span></div>
                            <div className="flex justify-between pt-2 border-t mt-2"><span>Service Plan</span><span className="font-bold text-sky-600">{billDetails.planName}</span></div>
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg text-center animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IndianRupee size={24} className="text-sky-600" />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-1">Payment Summary</h3>
                    <p className="text-xs text-slate-500 mb-6 font-medium">Design Registration + Govt Fee</p>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-xs text-left shadow-inner border border-slate-100">
                        <div className="flex justify-between items-center group">
                            <span className="text-slate-500 group-hover:text-slate-800 transition-colors font-bold uppercase text-[10px]">Professional Fee</span>
                            <span className="font-bold text-navy">₹{billDetails.base.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-slate-400 group-hover:text-slate-600 transition-colors text-[10px]">Platform & GST (18%)</span>
                            <span className="font-semibold text-slate-700">₹{billDetails.taxesTotal.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-slate-200 my-1"></div>
                        <div className="flex justify-between items-center text-base font-black text-navy border-t border-slate-200 pt-2 mt-2">
                            <span className="uppercase tracking-tighter">Total Payable</span>
                            <span className="text-orange-600 font-mono">₹{billDetails.total.toLocaleString()}</span>
                        </div>
                        {billDetails.govt > 0 && (
                            <div className="mt-2 pt-2 border-t border-dashed border-slate-300 opacity-60">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-[9px] font-bold uppercase italic">Govt Registration Fee (Extra)</span>
                                    <span className="font-bold text-slate-500 text-[10px]">₹{billDetails.govt.toLocaleString()}*</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <label className="flex items-center gap-2 text-[10px] text-slate-400 mb-6 justify-center cursor-pointer">
                        <input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300" />
                        I accept the registration terms
                    </label>
                    <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                        {isSubmitting ? 'Processing...' : 'Pay & Submit Design'}
                    </button>
                </div>
            );
            default: return null;
        }
    };

    // --- MODAL LAYOUT: SPLIT VIEW ---
    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                            <Palette className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Design Reg.
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4">
                            <div>
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight">{billDetails.planName}</p>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Service Fee</span>
                                    <span className="text-white font-medium font-mono">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Taxes & Fees</span>
                                    <span className="text-white font-medium font-mono">₹{billDetails.taxesTotal.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end text-sm">
                                    <span className="text-[11px] font-bold text-[#ED6E3F] uppercase tracking-wider">Total Payable</span>
                                    <span className="text-xl font-bold text-white leading-none">₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Design Details', 'Upload Views', 'Review', 'Payment'].map((step, i) => (
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

                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                        <div className="flex flex-col">
                            {/* Mobile Info */}
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">Design Reg.</span>
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
                            {/* Desktop Info */}
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {['Design Details', 'Upload Views', 'Review', 'Payment Summary'][currentStep - 1]}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4 group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy text-slate-800">Application Filed!</h2>
                                <p className="text-gray-500 mt-2 font-medium">Design registration has been initiated. Our team will contact you soon.</p>
                                <button onClick={onClose} className="mt-8 px-10 py-3 bg-[#043E52] text-white rounded-xl font-bold shadow-lg">Close</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                        {apiError && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">{apiError}</div>}
                    </div>

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
        <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-32 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-400 font-bold text-xs uppercase transition-colors hover:text-navy">
                    <ArrowLeft size={16} /> Back to Services
                </button>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <h2 className="font-bold text-xl mb-6 relative z-10 flex items-center gap-2 max-w-[80%]">
                                <Palette size={18} fill="#ED6E3F" stroke="none" />
                                Design Registration
                                <div className="mt-1 block text-[10px] text-[#ED6E3F] font-bold uppercase tracking-wider">Aesthetic Protection</div>
                            </h2>
                            <div className="space-y-3 relative z-10">
                                {['Design Details', 'Upload Views', 'Review', 'Payment'].map((s, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${currentStep === i + 1 ? 'bg-white/10 text-white shadow-inner' : 'text-blue-200/40'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/10'}`}>{currentStep > i + 1 ? <CheckCircle size={14} /> : i + 1}</div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${currentStep === i + 1 ? 'text-white' : 'text-blue-200/40'}`}>{s}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                                <p className="text-[10px] uppercase text-gray-400 font-bold mb-3 tracking-widest">Bill Summary</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs"><span className="text-gray-300">Total Payable</span><span className="font-bold text-white">₹{billDetails.total.toLocaleString()}</span></div>
                                    <p className="text-[9px] text-gray-500 italic leading-tight">Includes government filing fees and all taxes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        {isSuccess ? (
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center">
                                <CheckCircle size={70} className="text-green-500 mx-auto mb-6" />
                                <h2 className="text-3xl font-black text-navy mb-4">Design Protected!</h2>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Your design registration application has been successfully submitted.</p>
                                <button onClick={() => navigate('/dashboard')} className="px-10 py-3.5 bg-[#043E52] text-white rounded-xl font-bold shadow-xl shadow-navy/20 hover:-translate-y-1 transition-all">Go to Dashboard</button>
                            </div>
                        ) : (
                            <>
                                {renderStepContent()}
                                <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-8 py-3 text-gray-400 font-bold hover:bg-gray-100 hover:text-slate-600 rounded-xl disabled:opacity-30 transition-all">Back</button>
                                    {currentStep < 4 && <button onClick={handleNext} className="px-8 py-3 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:-translate-y-1 transition-all">Save & Continue <ArrowRight size={18} /></button>}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyDesignRegistration;
