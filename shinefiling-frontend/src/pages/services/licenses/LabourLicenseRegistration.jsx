import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, HardHat, Building, AlertTriangle, X, Shield, User, Check
} from 'lucide-react';
import { uploadFile, submitLabourLicense } from '../../../api';

const LabourLicenseRegistration = ({ isLoggedIn, onClose, isModal = false, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});
    const [uploadingFiles, setUploadingFiles] = useState({});

    const [formData, setFormData] = useState({
        contractorName: '',
        state: '',
        numberOfLabourers: '',
        principalEmployerName: '',
        principalEmployerAddress: '',
        natureOfWork: '',
        workStartDate: '',
        workEndDate: '',
        isContractAgreementAvailable: false,
        uploadedDocuments: []
    });

    // Dynamic Pricing
    const pricing = {
        advisory: { price: 999, title: "Expert Labour Advisory" },
        license: { price: 3999, title: "Labour Contractor License" },
        registration: { price: 4499, title: "Employer Registration" }
    };

    const currentPricing = pricing[planProp] || pricing.license;
    const price = currentPricing.price;

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/labour-license/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.contractorName) { newErrors.contractorName = "Contractor Name required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
            if (!formData.numberOfLabourers) { newErrors.numberOfLabourers = "Number of Labourers required"; isValid = false; }
            else if (parseInt(formData.numberOfLabourers) < 20) { newErrors.numberOfLabourers = "Minimum 20 labourers required"; isValid = false; }
        }
        else if (step === 2) {
            if (!formData.principalEmployerName) { newErrors.principalEmployerName = "Principal Employer required"; isValid = false; }
            if (!formData.natureOfWork) { newErrors.natureOfWork = "Nature of Work required"; isValid = false; }
            if (!formData.workStartDate) { newErrors.workStartDate = "Start Date required"; isValid = false; }
            if (!formData.workEndDate) { newErrors.workEndDate = "End Date required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleFileUpload = async (docType, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingFiles(prev => ({ ...prev, [docType]: true }));
        try {
            const response = await uploadFile(file, 'labour_license');
            setFormData(prev => ({
                ...prev,
                uploadedDocuments: [
                    ...prev.uploadedDocuments.filter(d => d.id !== docType),
                    {
                        id: docType,
                        type: docType,
                        filename: response.originalName || file.name,
                        fileUrl: response.fileUrl
                    }
                ]
            }));
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploadingFiles(prev => ({ ...prev, [docType]: false }));
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            const finalPayload = {
                submissionId: `LABOUR-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: "standard",
                amountPaid: price,
                contractorName: formData.contractorName,
                state: formData.state,
                numberOfLabourers: parseInt(formData.numberOfLabourers),
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    ...formData,
                    numberOfWorkers: parseInt(formData.numberOfLabourers)
                },
                documents: formData.uploadedDocuments
            };

            await submitLabourLicense(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            Labour License
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight mb-4">{currentPricing.title}</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Service Fee</span>
                                    <span className="text-white font-medium font-mono">₹{price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Govt Fee (Actuals)</span>
                                    <span className="text-white font-medium font-mono">₹0</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold text-[#ED6E3F] uppercase tracking-wider">Total Payable</span>
                                    <span className="text-xl font-bold text-white leading-none">₹{price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ED6E3F] to-transparent opacity-50"></div>
                        </div>
                    </div>

                    {/* VERTICAL STEPPER */}
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Contractor Node', 'Work Order', 'Verified Docs', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Labour License</span>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Service</span>
                                        <span className="text-xs font-bold text-slate-700">₹{(price / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="w-px h-5 bg-gray-200"></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Govt Fee</span>
                                        <span className="text-xs font-bold text-slate-700">₹0</span>
                                    </div>
                                    <div className="w-px h-5 bg-gray-200"></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Total</span>
                                        <span className="text-xs font-bold text-green-600">₹{price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop: Step Title */}
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Contractor Identification"}
                                {currentStep === 2 && "Principal Employer Ecosystem"}
                                {currentStep === 3 && "Compliance Assets"}
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
                                <p className="text-gray-500 mt-2">Your application has been received successfully.</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
                                                <User size={16} className="text-orange-400" /> Contractor Identification
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-xs font-bold text-gray-500 block mb-1">Contractor Full Legal Name</label>
                                                    <input type="text" name="contractorName" value={formData.contractorName} onChange={handleInputChange} placeholder="As per Aadhaar/PAN" className={`w-full p-2 text-sm bg-slate-50 border ${errors.contractorName ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white focus:border-orange-400 outline-none transition-all shadow-inner`} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 block mb-1">Work Site State</label>
                                                    <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-2 text-sm bg-slate-50 border ${errors.state ? 'border-red-400' : 'border-transparent'} rounded-lg outline-none appearance-none cursor-pointer focus:bg-white focus:border-orange-400 transition-all shadow-inner`}>
                                                        <option value="">Select State</option>
                                                        <option value="Maharashtra">Maharashtra</option>
                                                        <option value="Karnataka">Karnataka</option>
                                                        <option value="Delhi">Delhi</option>
                                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 block mb-1">Max Labour Strength</label>
                                                    <input type="number" name="numberOfLabourers" value={formData.numberOfLabourers} onChange={handleInputChange} placeholder="Min 20 required" className={`w-full p-2 text-sm bg-slate-50 border ${errors.numberOfLabourers ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white focus:border-orange-400 outline-none transition-all shadow-inner`} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
                                                <Building size={16} className="text-orange-400" /> Principal Employer Ecosystem
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-xs font-bold text-gray-500 block mb-1">Principal Employer Name</label>
                                                    <input type="text" name="principalEmployerName" value={formData.principalEmployerName} onChange={handleInputChange} placeholder="Company issuing work order" className={`w-full p-2 text-sm bg-slate-50 border ${errors.principalEmployerName ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white focus:border-orange-400 outline-none transition-all shadow-inner`} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-xs font-bold text-gray-500 block mb-1">Employer operational Address</label>
                                                    <textarea name="principalEmployerAddress" rows="2" value={formData.principalEmployerAddress} onChange={handleInputChange} placeholder="Complete physical address..." className="w-full p-3 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-orange-400 outline-none transition-all resize-none shadow-inner" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 block mb-1">Nature of Work</label>
                                                    <input type="text" name="natureOfWork" value={formData.natureOfWork} onChange={handleInputChange} placeholder="e.g. Manpower / Facility" className={`w-full p-2 text-sm bg-slate-50 border ${errors.natureOfWork ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white focus:border-orange-400 outline-none transition-all shadow-inner`} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 block mb-1">Contract Validity</label>
                                                    <div className="flex gap-2">
                                                        <input type="date" name="workStartDate" value={formData.workStartDate} onChange={handleInputChange} className={`w-1/2 p-2 text-xs bg-slate-50 border ${errors.workStartDate ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white outline-none shadow-inner`} />
                                                        <input type="date" name="workEndDate" value={formData.workEndDate} onChange={handleInputChange} className={`w-1/2 p-2 text-xs bg-slate-50 border ${errors.workEndDate ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white outline-none shadow-inner`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
                                                <Upload size={16} className="text-orange-400" /> Compliance Assets
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { id: 'FORM_V', label: 'Form V (Certificate)', icon: FileText },
                                                    { id: 'CONTRACT_AGREEMENT', label: 'Work Agreement', icon: Shield },
                                                    { id: 'PAN_CARD', label: 'Contractor PAN', icon: User },
                                                    { id: 'LABOUR_LIST', label: 'Labour Muster Roll', icon: HardHat }
                                                ].map((doc) => {
                                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.id === doc.id);
                                                    return (
                                                        <div key={doc.id} className="border border-dashed p-3 rounded-lg flex justify-between items-center group hover:border-[#ED6E3F]">
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-600 block">{doc.label}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center">
                                                                <label className="cursor-pointer">
                                                                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold text-white transition-all ${uploadedDoc ? 'bg-green-500' : 'bg-[#043E52] hover:bg-black'}`}>
                                                                        {uploadedDoc ? 'Replace' : 'Upload'}
                                                                    </span>
                                                                    <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileUpload(doc.id, e)} accept=".pdf,.jpg,.png" />
                                                                </label>
                                                                {uploadedDoc && <span className="text-[10px] text-green-600 mt-1 truncate w-16 text-center">{uploadedDoc.filename}</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                                            <IndianRupee size={32} className="mx-auto mb-4 text-green-600" />
                                            <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                                            <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-sm">
                                                <div className="flex justify-between"><span>Service Fee</span><span className="font-bold">₹{price.toLocaleString()}</span></div>
                                                <div className="flex justify-between text-gray-600"><span>Govt Fee</span><span className="font-bold">Actuals</span></div>
                                                <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total amount</span><span>₹{price.toLocaleString()}</span></div>
                                            </div>
                                            <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">Pay & Submit</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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

    // --- STANDARD FULL PAGE LAYOUT (Kept for fallback/direct access) ---
    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-500 font-bold text-xs uppercase"><ArrowLeft size={14} /> Back</button>
                <div className="flex gap-8">
                    <div className="w-72 hidden lg:block space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                            {['Contractor Node', 'Work Order', 'Verified Docs', 'Payment'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-navy text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {currentStep === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
                                        <User size={16} className="text-orange-400" /> Contractor Identification
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Contractor Full Legal Name</label>
                                            <input type="text" name="contractorName" value={formData.contractorName} onChange={handleInputChange} placeholder="As per Aadhaar/PAN" className={`w-full p-2 text-sm bg-slate-50 border ${errors.contractorName ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white focus:border-orange-400 outline-none transition-all shadow-inner`} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Work Site State</label>
                                            <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-2 text-sm bg-slate-50 border ${errors.state ? 'border-red-400' : 'border-transparent'} rounded-lg outline-none appearance-none cursor-pointer focus:bg-white focus:border-orange-400 transition-all shadow-inner`}>
                                                <option value="">Select State</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Karnataka">Karnataka</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Max Labour Strength</label>
                                            <input type="number" name="numberOfLabourers" value={formData.numberOfLabourers} onChange={handleInputChange} placeholder="Min 20 required" className={`w-full p-2 text-sm bg-slate-50 border ${errors.numberOfLabourers ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white focus:border-orange-400 outline-none transition-all shadow-inner`} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
                                        <Building size={16} className="text-orange-400" /> Principal Employer Ecosystem
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Principal Employer Name</label>
                                            <input type="text" name="principalEmployerName" value={formData.principalEmployerName} onChange={handleInputChange} placeholder="Company issuing work order" className={`w-full p-2 text-sm bg-slate-50 border ${errors.principalEmployerName ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white focus:border-orange-400 outline-none transition-all shadow-inner`} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Employer operational Address</label>
                                            <textarea name="principalEmployerAddress" rows="2" value={formData.principalEmployerAddress} onChange={handleInputChange} placeholder="Complete physical address..." className="w-full p-3 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-orange-400 outline-none transition-all resize-none shadow-inner" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Nature of Work</label>
                                            <input type="text" name="natureOfWork" value={formData.natureOfWork} onChange={handleInputChange} placeholder="e.g. Manpower / Facility" className={`w-full p-2 text-sm bg-slate-50 border ${errors.natureOfWork ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white focus:border-orange-400 outline-none transition-all shadow-inner`} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Contract Validity</label>
                                            <div className="flex gap-2">
                                                <input type="date" name="workStartDate" value={formData.workStartDate} onChange={handleInputChange} className={`w-1/2 p-2 text-xs bg-slate-50 border ${errors.workStartDate ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white outline-none shadow-inner`} />
                                                <input type="date" name="workEndDate" value={formData.workEndDate} onChange={handleInputChange} className={`w-1/2 p-2 text-xs bg-slate-50 border ${errors.workEndDate ? 'border-red-400' : 'border-transparent'} rounded-lg focus:bg-white outline-none shadow-inner`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
                                        <Upload size={16} className="text-orange-400" /> Compliance Assets
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'FORM_V', label: 'Form V (Certificate)', icon: FileText },
                                            { id: 'CONTRACT_AGREEMENT', label: 'Work Agreement', icon: Shield },
                                            { id: 'PAN_CARD', label: 'Contractor PAN', icon: User },
                                            { id: 'LABOUR_LIST', label: 'Labour Muster Roll', icon: HardHat }
                                        ].map((doc) => {
                                            const uploadedDoc = formData.uploadedDocuments.find(d => d.id === doc.id);
                                            return (
                                                <div key={doc.id} className="border border-dashed p-3 rounded-lg flex justify-between items-center group hover:border-[#ED6E3F]">
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-600 block">{doc.label}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <label className="cursor-pointer">
                                                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold text-white transition-all ${uploadedDoc ? 'bg-green-500' : 'bg-[#043E52] hover:bg-black'}`}>
                                                                {uploadedDoc ? 'Replace' : 'Upload'}
                                                            </span>
                                                            <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileUpload(doc.id, e)} accept=".pdf,.jpg,.png" />
                                                        </label>
                                                        {uploadedDoc && <span className="text-[10px] text-green-600 mt-1 truncate w-16 text-center">{uploadedDoc.filename}</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                                    <IndianRupee size={32} className="mx-auto mb-4 text-green-600" />
                                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-sm">
                                        <div className="flex justify-between"><span>Service Fee</span><span className="font-bold">₹{price.toLocaleString()}</span></div>
                                        <div className="flex justify-between text-gray-600"><span>Govt Fee</span><span className="font-bold">Actuals</span></div>
                                        <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total amount</span><span>₹{price.toLocaleString()}</span></div>
                                    </div>
                                    <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">Pay & Submit</button>
                                </div>
                            </motion.div>
                        )}

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

export default LabourLicenseRegistration;
