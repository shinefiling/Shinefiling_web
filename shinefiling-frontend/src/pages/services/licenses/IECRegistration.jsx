import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Building, Globe, Zap, Landmark, AlertTriangle, X, Shield, Globe2, Check
} from 'lucide-react';
import { uploadFile, submitIEC } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const IECRegistration = ({ isLoggedIn, isModal = false, planProp = 'standard', onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

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

    // Dynamic Pricing
    const pricing = {
        advisory: { price: 999, title: "Expert Advisory - Global Trade" },
        standard: { price: 1999, title: "Standard IEC Registration" },
        combo: { price: 3499, title: "IEC + GST Registration" }
    };

    const currentPricing = pricing[planProp] || pricing.standard;
    const price = currentPricing.price;

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
    }, [price]);

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn && !isModal) {
            navigate('/login', { state: { from: `/services/licenses/import-export-code/apply` } });
        }
    }, [isLoggedIn, navigate, isModal]);

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
        const userObj = JSON.parse(localStorage.getItem('user'));
        const email = userObj?.email || "guest@example.com";
        const phone = userObj?.phone || "9999999999";

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${currentPricing.title} - IEC Registration`,
            prefill: {
                name: userObj?.name || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                setApiError(null);
                try {
                    const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                        id: k,
                        filename: v.name,
                        fileUrl: v.fileUrl
                    }));

                    const finalPayload = {
                        submissionId: `IEC-${Date.now()}`,
                        userEmail: email,
                        userPhone: phone,
                        plan: planProp || "standard",
                        amountPaid: billDetails.total,
                        firmName: formData.firmName,
                        firmPan: formData.firmPan,
                        status: "PAYMENT_SUCCESSFUL",
                        formData: formData,
                        documents: docsList,
                        paymentDetails: {
                            ...billDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };

                    await submitIEC(finalPayload);
                    setIsSuccess(true);
                } catch (error) {
                    setApiError(error.message);
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Building size={18} className="text-[#ED6E3F]" /> Business Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Firm Name (As per PAN)</label>
                                    <input type="text" name="firmName" value={formData.firmName} onChange={handleInputChange} placeholder="e.g. Acme Exports" className={`w-full p-4 bg-gray-50 border ${errors.firmName ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Firm PAN</label>
                                    <input type="text" name="firmPan" value={formData.firmPan} onChange={handleInputChange} placeholder="ABCDE1234F" maxLength={10} className={`w-full p-4 bg-gray-50 border ${errors.firmPan ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm uppercase focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Contact Mobile</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="10 Digit Number" className={`w-full p-4 bg-gray-50 border ${errors.mobile ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Constitution</label>
                                    <select name="entityType" value={formData.entityType} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none">
                                        <option value="PROPRIETORSHIP">Proprietorship</option>
                                        <option value="PARTNERSHIP">Partnership</option>
                                        <option value="LLP">LLP</option>
                                        <option value="PRIVATE_LTD">Private Limited</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nature of Concern</label>
                                    <select name="natureOfConcern" value={formData.natureOfConcern} onChange={handleInputChange} className={`w-full p-4 bg-gray-50 border ${errors.natureOfConcern ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm outline-none`}>
                                        <option value="">Select Activity</option>
                                        <option value="MERCHANT_EXPORTER">Merchant Exporter</option>
                                        <option value="MANUFACTURER_EXPORTER">Manufacturer Exporter</option>
                                        <option value="SERVICE_PROVIDER">Service Provider</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Landmark size={18} className="text-[#ED6E3F]" /> Infrastructure
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Premises Business Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder="Full address with Pincode..." className={`w-full p-4 bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all resize-none`} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Bank Account Number</label>
                                        <input type="text" name="bankAccountNo" value={formData.bankAccountNo} onChange={handleInputChange} placeholder="Account Number" className={`w-full p-4 bg-gray-50 border ${errors.bankAccountNo ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Bank IFSC Code</label>
                                        <input type="text" name="bankIfsc" value={formData.bankIfsc} onChange={handleInputChange} placeholder="SBIN0001234" className={`w-full p-4 bg-gray-50 border ${errors.bankIfsc ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm uppercase focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
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
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Upload size={18} className="text-[#ED6E3F]" /> Verified Vault
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'pan_card', label: 'Firm PAN Card', icon: FileText },
                                    { id: 'cancelled_cheque', label: 'Cancelled Cheque', icon: FileText },
                                    { id: 'address_proof', label: 'Address Proof', icon: MapPin },
                                    { id: 'aadhaar_card', label: 'Identity Proof', icon: Shield }
                                ].map((doc) => (
                                    <div key={doc.id} className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-2 ${uploadedFiles[doc.id] ? 'bg-orange-50/30 border-orange-200' : 'bg-gray-50 border-gray-200 hover:border-[#ED6E3F]/50 group'}`}>
                                        <div className={`w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${uploadedFiles[doc.id] ? 'text-green-500' : 'text-gray-400'}`}>
                                            <doc.icon size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-0.5">{doc.label}</p>
                                            <p className="text-[8px] text-gray-400 font-medium uppercase tracking-widest">PDF / JPG (Max 5MB)</p>
                                        </div>
                                        <label className="cursor-pointer">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${uploadedFiles[doc.id] ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                                {uploadedFiles[doc.id] ? 'Replace' : 'Upload'}
                                            </span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png" />
                                        </label>
                                        {uploadedFiles[doc.id] && (
                                            <div className="flex items-center gap-1 text-[8px] font-bold text-green-700 uppercase tracking-widest">
                                                <CheckCircle size={10} /> {uploadedFiles[doc.id].name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto font-poppins text-navy">
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#ED6E3F] shadow-lg shadow-orange-500/10 rotate-12">
                                <IndianRupee size={32} />
                            </div>

                            <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight uppercase">Checkout</h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8">IEC License Protocol</p>

                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-4 text-xs border border-gray-100 shadow-inner">
                                <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Base Fee</span>
                                    <span className="text-zinc-900 font-bold">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Taxes & Filing</span>
                                    <span className="text-[#ED6E3F] font-bold">₹{(billDetails.total - billDetails.base).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-gray-200"></div>
                                <div className="flex justify-between items-center text-3xl font-bold text-zinc-900">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Total</span>
                                    <span className="tracking-tighter">₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center">
                                <input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} />
                                I Accept Terms & Conditions
                            </label>
                            <button
                                onClick={submitApplication}
                                disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing}
                                className="w-full py-4 bg-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                            >
                                {isSubmitting || isPaymentProcessing ? 'Authorizing Payment...' : 'Complete Filing'}
                                {!isSubmitting && !isPaymentProcessing && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
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
                            IEC Registration
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
                                    <span className="text-white font-medium font-mono">₹{billDetails.base.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs group">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">Tax & GST</span>
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

                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Entity Profile', 'Infrastructure', 'Document Vault', 'Review & Pay'].map((step, i) => (
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
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Business Identity"}
                                {currentStep === 2 && "Physical Assets"}
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
                                <h2 className="text-2xl font-bold text-navy text-zinc-900">IEC Application Filed!</h2>
                                <p className="text-gray-500 mt-2">Your firm details are now under DGFT verification.</p>
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
                            {['Firm Identity', 'Infrastructure', 'Documents', 'Payment'].map((s, i) => (
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

export default IECRegistration;
