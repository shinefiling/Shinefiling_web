import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText, User, Building, ArrowRight, X, Globe, Shield, Users, ArrowLeft
} from 'lucide-react';
import { uploadFile, submitForeignCompanyRegistration } from '../../../api';

// --- HELPERS ---
const validatePlan = (plan) => {
    const p = plan?.toLowerCase();
    if (['liaison', 'basic', 'startup'].includes(p)) return 'liaison';
    if (['branch', 'standard', 'foreign'].includes(p)) return 'branch';
    if (['project', 'premium', 'elite'].includes(p)) return 'project';
    return 'liaison';
};

const ForeignCompanyRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        liaison: {
            price: 29999,
            title: 'Liaison Office',
            features: ["RBI Approval Filing", "ROC Registration", "PAN & TAN for Office", "Documentation Support"],
            color: 'bg-white border-slate-200'
        },
        branch: {
            price: 39999,
            title: 'Branch Office',
            features: ["Invest India/RBI Approval", "ROC Registration", "Import/Export License", "GST Registration"],
            color: 'bg-emerald-50 border-emerald-200'
        },
        project: {
            price: 49999,
            title: 'Project Office',
            features: ["Specific Project Approval", "RBI Reporting", "Bank Account Setup", "Project Contract Vetting"],
            color: 'bg-blue-50 border-blue-200'
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
        parentCompanyName: '',
        countryOfIncorporation: '',
        officeType: 'Liaison Office',
        proposedActivities: '',
        authorizedRepName: '',
        authorizedRepEmail: '',
        authorizedRepPhone: '',
        registeredAddressIndia: '',
        pincode: '',
        sector: '',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.liaison;
        const basePrice = plan.price;

        // Breakdown: Platform Fee 3%, Tax 3%, GST 9% = Total 15% extra
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);

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
            if (!formData.parentCompanyName) { newErrors.parentCompanyName = "Parent company name required"; isValid = false; }
            if (!formData.countryOfIncorporation) { newErrors.countryOfIncorporation = "Country required"; isValid = false; }
            if (!formData.proposedActivities) { newErrors.proposedActivities = "Activities description required"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.authorizedRepName) { newErrors.authorizedRepName = "Representative name required"; isValid = false; }
            if (!formData.authorizedRepEmail) { newErrors.authorizedRepEmail = "Email required"; isValid = false; }
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
            const response = await uploadFile(file, 'foreign_company_docs');
            setUploadedFiles(prev => ({
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
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const payload = {
                ...formData,
                plan: selectedPlan,
                paymentDetails: billDetails,
                amount: billDetails.total,
                documents: docsList,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.userEmail || formData.authorizedRepEmail,
                userPhone: JSON.parse(localStorage.getItem('user'))?.phone || formData.userPhone,
                submissionId: `FOR-${Date.now()}`
            };

            const response = await submitForeignCompanyRegistration(payload);
            if (response) {
                setAutomationPayload(response);
                setIsSuccess(true);
            }
        } catch (error) {
            alert("Submission failed: " + error.message);
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
                        <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><Globe size={16} /> FOREIGN PARENT DETAILS</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Foreign Parent Company Name</label>
                                <input name="parentCompanyName" value={formData.parentCompanyName} onChange={handleInputChange} placeholder="e.g. Acme Corp USA" className={`w-full p-2 text-sm rounded-lg border ${errors.parentCompanyName ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Country of Incorporation</label>
                                <input name="countryOfIncorporation" value={formData.countryOfIncorporation} onChange={handleInputChange} placeholder="e.g. USA" className={`w-full p-2 text-sm rounded-lg border ${errors.countryOfIncorporation ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Office Type</label>
                                <select name="officeType" value={selectedPlan === 'liaison' ? 'Liaison Office' : selectedPlan === 'branch' ? 'Branch Office' : 'Project Office'} disabled className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-gray-50">
                                    <option value="Liaison Office">Liaison Office</option>
                                    <option value="Branch Office">Branch Office</option>
                                    <option value="Project Office">Project Office</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Proposed Activities in India</label>
                                <textarea name="proposedActivities" value={formData.proposedActivities} onChange={handleInputChange} placeholder="e.g. Market research, Export promotion..." className={`w-full p-2 text-sm rounded-lg border ${errors.proposedActivities ? 'border-red-500' : 'border-gray-200'}`} rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><User size={16} className="text-blue-600" /> AUTHORIZED REPRESENTATIVE (In India)</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input name="authorizedRepName" value={formData.authorizedRepName} onChange={handleInputChange} placeholder="Full Name" className={`w-full p-2 text-sm rounded-lg border ${errors.authorizedRepName ? 'border-red-500' : 'border-gray-200'}`} />
                            <input name="authorizedRepEmail" value={formData.authorizedRepEmail} onChange={handleInputChange} placeholder="Email" className={`w-full p-2 text-sm rounded-lg border ${errors.authorizedRepEmail ? 'border-red-500' : 'border-gray-200'}`} />
                            <input name="authorizedRepPhone" value={formData.authorizedRepPhone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-2 text-sm rounded-lg border border-gray-200" />
                            <div className="md:col-span-2">
                                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Proposed Address in India (If any)</label>
                                <input name="registeredAddressIndia" value={formData.registeredAddressIndia} onChange={handleInputChange} placeholder="Address Line 1" className="w-full p-2 text-sm rounded-lg border border-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm">Required Documents</h3>
                        <div className="space-y-3">
                            <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-slate-50">
                                <span className="text-xs font-medium">COI / Charter (Apostilled)</span>
                                <input type="file" onChange={(e) => handleFileUpload(e, 'parent_coi')} className="text-[10px] w-20" />
                            </div>
                            <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-slate-50">
                                <span className="text-xs font-medium">MOA & AOA (Translated)</span>
                                <input type="file" onChange={(e) => handleFileUpload(e, 'parent_moa_aoa')} className="text-[10px] w-20" />
                            </div>
                            <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-slate-50">
                                <span className="text-xs font-medium">Board Resolution</span>
                                <input type="file" onChange={(e) => handleFileUpload(e, 'board_resolution')} className="text-[10px] w-20" />
                            </div>
                            <div className="border border-dashed p-3 rounded-lg flex justify-between items-center bg-slate-50">
                                <span className="text-xs font-medium">KYC of Representative</span>
                                <input type="file" onChange={(e) => handleFileUpload(e, 'rep_kyc')} className="text-[10px] w-20" />
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-navy mb-4">Review Application</h2>
                    <div className="p-4 bg-emerald-50/50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Office Type</span><span className="font-bold text-navy uppercase">{plans[selectedPlan].title}</span></div>
                        <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Parent Company</span><span className="font-bold text-navy">{formData.parentCompanyName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Representative</span><span className="font-bold text-navy">{formData.authorizedRepName}</span></div>
                    </div>
                </div>
            );
            case 5: return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <Building size={32} className="mx-auto mb-4 text-emerald-600" />
                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                        <div className="flex justify-between text-sm"><span>Base Price</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                        <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                    </div>
                    <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700">
                        {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                    </button>
                </div>
            );
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg text-[#ED6E3F] flex items-center gap-2 tracking-tight">
                            <Globe className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Registration
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
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Company Details', 'Representative', 'Documents', 'Review', 'Payment'].map((step, i) => (
                            <div key={i} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
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
                        <div className="flex flex-col justify-center">
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">Foreign Company</span>
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
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Start Details"}
                                {currentStep === 2 && "Representative Information"}
                                {currentStep === 3 && "Review Package"}
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
                                <p className="text-gray-500 mt-2">Order ID: {automationPayload?.submissionId}</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
                            </div>
                        ) : renderStepContent()}
                    </div>

                    {!isSuccess && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30">Back</button>
                            {currentStep < 5 && (
                                <button onClick={handleNext} className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition flex items-center gap-2 text-sm">
                                    Save & Continue <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default ForeignCompanyRegistration;
