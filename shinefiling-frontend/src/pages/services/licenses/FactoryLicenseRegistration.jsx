import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Factory, Zap, AlertTriangle, X, Shield, Building, User, Check
} from 'lucide-react';
import { uploadFile, submitFactoryLicense } from '../../../api';

const FactoryLicenseRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});
    const [uploadingFiles, setUploadingFiles] = useState({});

    const [formData, setFormData] = useState({
        factoryName: '',
        state: '',
        numberOfWorkers: '',
        usePower: false,
        installedHorsePower: '',
        occupierName: '',
        managerName: '',
        factoryAddress: '',
        landArea: '',
        builtUpArea: '',
        uploadedDocuments: []
    });

    // Dynamic Pricing
    const pricing = {
        advisory: { price: 1999, title: "Expert Factory Advisory" },
        comprehensive: { price: 14999, title: "Full Factory Approval" },
        basic: { price: 7999, title: "Factory License Only" }
    };

    const currentPricing = pricing[planProp] || pricing.comprehensive;
    const price = currentPricing.price;

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn && !isModal) {
            navigate('/login', { state: { from: `/services/licenses/factory-license/apply` } });
        }
    }, [isLoggedIn, navigate, isModal]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.factoryName) { newErrors.factoryName = "Factory Name required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
            if (!formData.numberOfWorkers) { newErrors.numberOfWorkers = "Workers count required"; isValid = false; }
        }
        else if (step === 2) {
            if (!formData.factoryAddress) { newErrors.factoryAddress = "Address required"; isValid = false; }
            if (!formData.managerName) { newErrors.managerName = "Manager Name required"; isValid = false; }
            if (!formData.occupierName) { newErrors.occupierName = "Occupier Name required"; isValid = false; }
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
            const response = await uploadFile(file, 'factory_license');
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
                submissionId: `FACTORY-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: "standard",
                amountPaid: price,
                factoryName: formData.factoryName,
                state: formData.state,
                numberOfWorkers: parseInt(formData.numberOfWorkers),
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    ...formData,
                    numberOfWorkers: parseInt(formData.numberOfWorkers),
                    installedHorsePower: parseFloat(formData.installedHorsePower) || 0,
                    landArea: parseFloat(formData.landArea) || 0,
                    builtUpArea: parseFloat(formData.builtUpArea) || 0
                },
                documents: formData.uploadedDocuments
            };

            await submitFactoryLicense(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Building size={18} className="text-[#ED6E3F]" /> Facility Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Factory Registered Name</label>
                                    <input type="text" name="factoryName" value={formData.factoryName} onChange={handleInputChange} placeholder="e.g. ACME INDUSTRIAL HUB" className={`w-full p-4 bg-gray-50 border ${errors.factoryName ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">State Jurisdiction</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-4 bg-gray-50 border ${errors.state ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#ED6E3F]/30 transition-all`}>
                                        <option value="">Select State</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Workforce Count</label>
                                    <input type="number" name="numberOfWorkers" value={formData.numberOfWorkers} onChange={handleInputChange} placeholder="Total headcount" className={`w-full p-4 bg-gray-50 border ${errors.numberOfWorkers ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>

                                <div className="md:col-span-2 bg-orange-50/30 p-6 rounded-xl border border-orange-100/50">
                                    <label className="flex items-center gap-3 cursor-pointer group mb-4">
                                        <input type="checkbox" name="usePower" checked={formData.usePower} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-[#ED6E3F] focus:ring-[#ED6E3F]" />
                                        <span className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">Does facility utilize Electric Power? <Zap size={14} className="text-[#ED6E3F]" /></span>
                                    </label>

                                    <AnimatePresence>
                                        {formData.usePower && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <div className="space-y-2 pt-2">
                                                    <label className="text-[10px] font-bold text-[#ED6E3F] uppercase tracking-widest px-1">Installed Load (Horse Power)</label>
                                                    <input type="number" name="installedHorsePower" value={formData.installedHorsePower} onChange={handleInputChange} placeholder="e.g. 50 HP" className="w-full p-4 bg-white border border-gray-100 rounded-xl text-sm focus:border-[#ED6E3F]/30 outline-none transition-all shadow-sm" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin size={18} className="text-[#ED6E3F]" /> Geographical & Leadership
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Plant physical Address (Full Legal)</label>
                                    <textarea name="factoryAddress" value={formData.factoryAddress} onChange={handleInputChange} rows={3} placeholder="Complete physical location coordinates..." className={`w-full p-4 bg-gray-50 border ${errors.factoryAddress ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all resize-none`} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Occupier Identity (Director/Owner)</label>
                                        <input type="text" name="occupierName" value={formData.occupierName} onChange={handleInputChange} placeholder="First & Last Name" className={`w-full p-4 bg-gray-50 border ${errors.occupierName ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nominated Manager</label>
                                        <input type="text" name="managerName" value={formData.managerName} onChange={handleInputChange} placeholder="First & Last Name" className={`w-full p-4 bg-gray-50 border ${errors.managerName ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Total Land footprint (Sq m)</label>
                                        <input type="number" name="landArea" value={formData.landArea} onChange={handleInputChange} placeholder="Total area" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Total Built-up Area (Sq m)</label>
                                        <input type="number" name="builtUpArea" value={formData.builtUpArea} onChange={handleInputChange} placeholder="Constructed area" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Upload size={18} className="text-[#ED6E3F]" /> Structural Assets
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'SITE_PLAN', label: 'Factory Site Plan', icon: FileText },
                                    { id: 'PROCESS_FLOW', label: 'Industrial Process Flow', icon: Zap },
                                    { id: 'FIRE_NOC', label: 'Fire Safety NOC', icon: Shield },
                                    { id: 'ID_PROOF', label: 'Occupier ID Proof', icon: User }
                                ].map((doc) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.id === doc.id);
                                    return (
                                        <div key={doc.id} className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${uploadedDoc ? 'bg-orange-50/30 border-orange-200' : 'bg-gray-50 border-gray-200 hover:border-[#ED6E3F]/50'}`}>
                                            <div className={`w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${uploadedDoc ? 'text-green-500' : 'text-gray-400'}`}>
                                                <doc.icon size={20} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-navy mb-0.5">{doc.label}</p>
                                                <p className="text-[8px] text-gray-400 font-medium uppercase tracking-widest">PDF (Max 10MB)</p>
                                            </div>
                                            <label className="cursor-pointer">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${uploadedDoc ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                                    {uploadingFiles[doc.id] ? 'Uploading...' : uploadedDoc ? 'Replace' : 'Upload'}
                                                </span>
                                                <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileUpload(doc.id, e)} accept=".pdf,.jpg,.png" />
                                            </label>
                                            {uploadedDoc && (
                                                <div className="flex items-center gap-1 text-[8px] font-bold text-green-600 uppercase tracking-widest">
                                                    <CheckCircle size={10} /> {uploadedDoc.filename}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden font-poppins text-navy">
                            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#ED6E3F] shadow-lg shadow-orange-500/10">
                                <IndianRupee size={32} />
                            </div>

                            <h2 className="text-2xl font-bold text-navy mb-2 tracking-tight uppercase">Checkout</h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8">Industrial License Protocol</p>

                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-4 text-xs border border-gray-100 shadow-inner translate-z-0">
                                <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Professional Fee</span>
                                    <span className="text-navy">₹{price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Govt Statutory Fees</span>
                                    <span className="text-[#ED6E3F] text-[9px]">AS PER ACTUALS</span>
                                </div>
                                <div className="h-px bg-gray-200"></div>
                                <div className="flex justify-between items-center text-3xl font-bold text-navy">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Base</span>
                                    <span className="tracking-tighter">₹{price.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                            >
                                {isSubmitting ? 'Processing...' : 'Complete Filing'}
                                {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </motion.div>
                );
            default: return null;
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
                            Factory License
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
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Tax & Fees</span>
                                    <span className="text-white font-medium font-mono">₹{Math.round(price * 0.18).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold text-[#ED6E3F] uppercase tracking-wider">Estimated Total</span>
                                    <span className="text-xl font-bold text-white leading-none">₹{Math.round(price * 1.18).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ED6E3F] to-transparent opacity-50"></div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Occupier Profile', 'Plant Location', 'Document Vault', 'Review & Pay'].map((step, i) => (
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
                            {/* Mobile Info */}
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">Factory License</span>
                                </div>
                            </div>

                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Identity Details"}
                                {currentStep === 2 && "Infrastructure Coordinates"}
                                {currentStep === 3 && "Verified Vault"}
                                {currentStep === 4 && "Final Summary"}
                            </h2>
                        </div>

                        <button onClick={onClose || (() => navigate(-1))} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {apiError && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                <AlertTriangle size={16} /> {apiError}
                            </div>
                        )}

                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Filed!</h2>
                                <p className="text-gray-500 mt-2">Your data has been queued for professional review.</p>
                                <button onClick={onClose || (() => navigate(-1))} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
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
                            {['Entity Profile', 'Infrastructure', 'Documents', 'Review'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-navy text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        <div className="mt-6 flex justify-between">
                            <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2 font-bold text-gray-500">Back</button>
                            {currentStep < 4 && <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-8 py-2 rounded-xl font-bold">Next</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FactoryLicenseRegistration;
