import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Building, Globe, Zap, Landmark, AlertTriangle, X, Shield, Globe2, Check, User
} from 'lucide-react';
import { uploadFile, submitIEC } from '../../../api';

const ApplyIEC = ({ isLoggedIn, isModal = false, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        firmName: '',
        firmPan: '',
        entityType: 'PROPRIETORSHIP',
        natureOfConcern: '',
        address: '',
        mobile: '',
        bankAccountNo: '',
        bankIfsc: '',
        bankName: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});

    // Price is fixed for standard IEC
    const price = 1999;

    const billDetails = useMemo(() => {
        const basePrice = price;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);

        return {
            base: basePrice,
            platformFee,
            tax,
            gst,
            total: basePrice + platformFee + tax + gst
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'firmPan') {
            setFormData({ ...formData, [name]: value.toUpperCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Details
            if (!formData.firmName) { newErrors.firmName = "Firm Name required"; isValid = false; }
            if (!formData.firmPan || formData.firmPan.length !== 10) { newErrors.firmPan = "Valid PAN required"; isValid = false; }
            if (!formData.mobile) { newErrors.mobile = "Mobile required"; isValid = false; }
            if (!formData.natureOfConcern) { newErrors.natureOfConcern = "Nature required"; isValid = false; }
        }
        else if (step === 2) { // Address & Bank
            if (!formData.address) { newErrors.address = "Address required"; isValid = false; }
            if (!formData.bankAccountNo) { newErrors.bankAccountNo = "Account No required"; isValid = false; }
            if (!formData.bankIfsc) { newErrors.bankIfsc = "IFSC required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'iec_docs');
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
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `Apply-IEC-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: "standard",
                amountPaid: billDetails.total,
                firmName: formData.firmName,
                firmPan: formData.firmPan,
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitIEC(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white font-poppins">
            {/* LEFT SIDEBAR: PREMIUM DARK EMERALD */}
            <div className="hidden md:flex w-96 bg-[#064E3B] text-white flex-col p-10 shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-900/40 rounded-full blur-[80px] -ml-24 -mb-24"></div>

                <div className="relative z-10 mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Globe2 className="text-emerald-400" size={24} />
                        </div>
                        <h1 className="font-black text-2xl tracking-tighter uppercase italic text-white leading-tight">Apply <span className="text-emerald-400">IEC</span></h1>
                    </div>

                    <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
                        <p className="text-[10px] text-emerald-200/50 font-black uppercase tracking-[0.2em] mb-2 px-1">DGFT Filing Protocol</p>
                        <h2 className="text-2xl font-black text-white leading-tight mb-6 tracking-tight">Standard<br /><span className="text-orange-400">Import Export Code</span></h2>

                        <div className="space-y-4 pt-6 border-t border-white/10 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-emerald-200/70">
                                <span>Govt Fees</span>
                                <span className="text-white">Included</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em] pb-1">Final Payable</span>
                                <span className="text-4xl font-black text-white leading-none tracking-tighter italic">₹{billDetails.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* VERTICAL STEPPER */}
                <div className="flex-1 space-y-4 pt-4 border-t border-white/5 relative z-10">
                    {[
                        { label: 'Merchant Data', sub: 'Business Identity', icon: User },
                        { label: 'Operational Hub', sub: 'Location & Banking', icon: Building },
                        { label: 'Compliance Vault', sub: 'Verification Docs', icon: Shield },
                        { label: 'Finalization', sub: 'Payment Milestone', icon: CheckCircle }
                    ].map((step, i) => (
                        <div key={i}
                            className={`flex items-center gap-5 p-5 rounded-3xl transition-all ${currentStep === i + 1 ? 'bg-white/10 text-white shadow-xl translate-x-2' : currentStep > i + 1 ? 'text-emerald-400 opacity-60' : 'text-emerald-200/20'}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all ${currentStep === i + 1 ? 'bg-orange-400 text-white rotate-6 scale-110 shadow-lg shadow-orange-500/20' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/5'}`}>
                                {currentStep > i + 1 ? <Check size={18} /> : i + 1}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-widest uppercase">{step.label}</span>
                                <span className="text-[9px] font-medium uppercase tracking-[0.1em] opacity-60 mt-0.5">{step.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FBFBFC]">
                {/* Header Bar */}
                <div className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 z-20">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Current Protocol</span>
                        <h2 className="font-black text-navy text-2xl uppercase tracking-tighter italic">
                            {currentStep === 1 && "Firm Identification"}
                            {currentStep === 2 && "Infrastructure Hub"}
                            {currentStep === 3 && "Verification Vault"}
                            {currentStep === 4 && "Finalization Phase"}
                        </h2>
                    </div>

                    <button onClick={onClose || (() => navigate(-1))} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group">
                        <X size={20} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-12">
                    {apiError && (
                        <div className="mb-10 p-8 bg-red-50 text-red-700 rounded-[2.5rem] border border-red-100 flex items-center gap-6 animate-in fade-in zoom-in-95 shadow-xl shadow-red-500/5">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm shrink-0"><AlertTriangle size={32} /></div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Filing Breach</span>
                                <span className="text-sm font-black uppercase tracking-widest">{apiError}</span>
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20 max-w-xl mx-auto">
                                <div className="w-32 h-32 bg-emerald-50 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 text-emerald-500 shadow-2xl shadow-emerald-500/20 rotate-12">
                                    <CheckCircle size={64} />
                                </div>
                                <h2 className="text-5xl font-black text-navy uppercase tracking-tighter mb-6 italic">Protocol <br />Executed!</h2>
                                <p className="text-slate-500 text-lg font-medium mb-12 leading-relaxed">
                                    Your IEC registration for <span className="text-navy font-black">{formData.firmName}</span> is now under DGFT scrutiny.
                                </p>
                                <button onClick={() => navigate('/dashboard')} className="px-12 py-5 bg-navy text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-navy/20 hover:bg-black transition-all transform hover:-translate-y-1">
                                    Access Workspace
                                </button>
                            </motion.div>
                        ) : (
                            <div className="max-w-4xl mx-auto">
                                {currentStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                            <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-10 flex items-center gap-3">
                                                <User size={20} className="text-orange-400" /> Merchant Identity Profile
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3 md:col-span-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Firm Legal Name (As per PAN)</label>
                                                    <input type="text" name="firmName" value={formData.firmName} onChange={handleInputChange} placeholder="e.g. ACME GLOBAL EXPORTS" className={`w-full p-5 bg-slate-50 border ${errors.firmName ? 'border-red-400' : 'border-transparent'} rounded-[1.5rem] font-black text-sm focus:bg-white focus:border-orange-400/30 outline-none transition-all shadow-inner`} />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Organization PAN</label>
                                                    <input type="text" name="firmPan" value={formData.firmPan} onChange={handleInputChange} placeholder="ABCDE1234F" maxLength={10} className={`w-full p-5 bg-slate-50 border ${errors.firmPan ? 'border-red-400' : 'border-transparent'} rounded-[1.5rem] font-black text-sm uppercase focus:bg-white focus:border-orange-400/30 outline-none transition-all shadow-inner`} />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Secure Contact Number</label>
                                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="+91 XXX XXX XXXX" className={`w-full p-5 bg-slate-50 border ${errors.mobile ? 'border-red-400' : 'border-transparent'} rounded-[1.5rem] font-black text-sm focus:bg-white focus:border-orange-400/30 outline-none transition-all shadow-inner`} />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Legal Constitution</label>
                                                    <div className="relative">
                                                        <select name="entityType" value={formData.entityType} onChange={handleInputChange} className="w-full p-5 bg-slate-50 border border-transparent rounded-[1.5rem] font-black text-sm outline-none appearance-none cursor-pointer focus:bg-white focus:border-orange-400/30 transition-all shadow-inner">
                                                            <option value="PROPRIETORSHIP">Proprietorship</option>
                                                            <option value="PARTNERSHIP">Partnership</option>
                                                            <option value="LLP">LLP</option>
                                                            <option value="PRIVATE_LTD">Private Limited</option>
                                                        </select>
                                                        <Zap className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Nature of Concern</label>
                                                    <div className="relative">
                                                        <select name="natureOfConcern" value={formData.natureOfConcern} onChange={handleInputChange} className={`w-full p-5 bg-slate-50 border ${errors.natureOfConcern ? 'border-red-400' : 'border-transparent'} rounded-[1.5rem] font-black text-sm outline-none appearance-none cursor-pointer focus:bg-white focus:border-orange-400/30 transition-all shadow-inner`}>
                                                            <option value="">Select Activity</option>
                                                            <option value="MERCHANT_EXPORTER">Merchant Exporter</option>
                                                            <option value="MANUFACTURER_EXPORTER">Manufacturer Exporter</option>
                                                            <option value="SERVICE_PROVIDER">Service Provider</option>
                                                        </select>
                                                        <Globe className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                            <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-10 flex items-center gap-3">
                                                <Landmark size={20} className="text-orange-400" /> Logistical & Banking Node
                                            </h3>
                                            <div className="space-y-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Operational address (Full Legal)</label>
                                                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder="Complete physical location coordinates..." className={`w-full p-6 bg-slate-50 border ${errors.address ? 'border-red-400' : 'border-transparent'} rounded-[2rem] font-black text-sm focus:bg-white focus:border-orange-400/30 outline-none transition-all resize-none shadow-inner`} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Verified Account No</label>
                                                        <input type="text" name="bankAccountNo" value={formData.bankAccountNo} onChange={handleInputChange} placeholder="Bank Account Identifier" className={`w-full p-5 bg-slate-50 border ${errors.bankAccountNo ? 'border-red-400' : 'border-transparent'} rounded-[1.5rem] font-black text-sm focus:bg-white focus:border-orange-400/30 outline-none transition-all shadow-inner`} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Swift / IFSC Routing</label>
                                                        <input type="text" name="bankIfsc" value={formData.bankIfsc} onChange={handleInputChange} placeholder="SBIN0001234" className={`w-full p-5 bg-slate-50 border ${errors.bankIfsc ? 'border-red-400' : 'border-transparent'} rounded-[1.5rem] font-black text-sm uppercase focus:bg-white focus:border-orange-400/30 outline-none transition-all shadow-inner`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                            <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-10 flex items-center gap-3">
                                                <Upload size={20} className="text-orange-400" /> Secure Verification Vault
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {[
                                                    { id: 'pan_card', label: 'Organization PAN', icon: FileText },
                                                    { id: 'cancelled_cheque', label: 'Commercial Cheque', icon: FileText },
                                                    { id: 'address_proof', label: 'Infrastructure Proof', icon: MapPin },
                                                    { id: 'aadhaar_card', label: 'Authorized Aadhaar', icon: Shield }
                                                ].map((doc) => (
                                                    <div key={doc.id} className={`relative p-8 rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-5 ${uploadedFiles[doc.id] ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-orange-400/50 group'}`}>
                                                        <div className={`w-16 h-16 rounded-[1.2rem] bg-white shadow-xl flex items-center justify-center ${uploadedFiles[doc.id] ? 'text-emerald-500' : 'text-slate-400 group-hover:text-orange-400'}`}>
                                                            <doc.icon size={28} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-navy mb-1">{doc.label}</p>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Digital Scan (Max 5MB)</p>
                                                        </div>
                                                        <label className="cursor-pointer">
                                                            <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-lg ${uploadedFiles[doc.id] ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-navy text-white hover:bg-black shadow-navy/10'}`}>
                                                                {uploadedFiles[doc.id] ? 'Update' : 'Upload'}
                                                            </span>
                                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png" />
                                                        </label>
                                                        {uploadedFiles[doc.id] && (
                                                            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">
                                                                <CheckCircle size={12} /> {uploadedFiles[doc.id].name}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
                                        <div className="bg-white p-12 rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 text-center relative overflow-hidden font-poppins text-navy">
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>

                                            <div className="w-24 h-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-orange-500 shadow-2xl shadow-orange-500/10 rotate-12">
                                                <IndianRupee size={36} />
                                            </div>

                                            <h2 className="text-3xl font-black text-navy mb-2 tracking-tighter uppercase italic">Checkout</h2>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-12 opacity-60">DGFT Standard protocols</p>

                                            <div className="bg-slate-50/80 backdrop-blur-sm p-10 rounded-[3rem] mb-12 space-y-6 text-sm border-2 border-white shadow-inner relative z-10">
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span>Service execution</span>
                                                    <span className="text-navy font-black text-sm italic tracking-tighter">₹{billDetails.base.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span>Fiscal Handling</span>
                                                    <span className="text-navy font-black text-sm italic tracking-tighter">₹{(billDetails.total - billDetails.base).toLocaleString()}</span>
                                                </div>
                                                <div className="h-px bg-slate-200 opacity-50"></div>
                                                <div className="flex justify-between items-center text-4xl font-black text-navy">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Total</span>
                                                    <span className="italic tracking-tighter leading-none">₹{billDetails.total.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={submitApplication}
                                                disabled={isSubmitting}
                                                className="w-full py-6 bg-navy text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:bg-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-4 group"
                                            >
                                                {isSubmitting ? 'Syncing...' : 'Initiate payment'}
                                                {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- FLOATING FOOTER --- */}
                {!isSuccess && (
                    <div className="bg-white/80 backdrop-blur-md p-8 border-t border-gray-100 flex justify-between items-center shrink-0 z-20">
                        <button
                            onClick={() => currentStep === 1 ? (onClose ? onClose() : navigate(-1)) : setCurrentStep(p => Math.max(1, p - 1))}
                            className="flex items-center gap-3 px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-navy transition-all"
                        >
                            <ArrowLeft size={16} /> {currentStep === 1 ? 'Go Back' : 'Identity Step'}
                        </button>

                        {currentStep < 4 && (
                            <button
                                onClick={handleNext}
                                className="px-12 py-4 bg-orange-400 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all flex items-center gap-3"
                            >
                                Next Step <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyIEC;
