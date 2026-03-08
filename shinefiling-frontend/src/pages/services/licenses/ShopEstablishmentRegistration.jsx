import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Building, Users, AlertTriangle, X, Shield, Landmark, User, Check
} from 'lucide-react';
import { uploadFile, submitShopEstablishment } from '../../../api';

const ShopEstablishmentRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [employeeRange, setEmployeeRange] = useState(planProp === 'advisory' ? 'advisory' : '0-9');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn && !isModal) {
            const emp = searchParams.get('employees') || '0-9';
            navigate('/login', { state: { from: `/services/licenses/shop-act/register?employees=${emp}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    useEffect(() => {
        const empParam = searchParams.get('employees');
        if (empParam) setEmployeeRange(empParam);
    }, [searchParams]);

    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        state: '',
        natureOfBusiness: '',
        numberOfEmployees: '',
        businessAddress: '',
        commencementDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Dynamic Pricing
    const pricing = {
        'advisory': { serviceFee: 1499, title: "Expert Advisory - Retail/Commercial" },
        '0-9': { serviceFee: 1999, title: "Standard Registration (< 10 Employees)" },
        '10+': { serviceFee: 3499, title: "Establishment Registration (> 10 Employees)" }
    };

    // Auto-update Plan based on Employee Input
    useEffect(() => {
        if (!formData.numberOfEmployees) return;
        const count = parseInt(formData.numberOfEmployees);
        if (isNaN(count)) return;

        if (count > 9 && employeeRange !== '10+') setEmployeeRange('10+');
        else if (count <= 9 && employeeRange !== '0-9') setEmployeeRange('0-9');
    }, [formData.numberOfEmployees]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Details
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.ownerName) { newErrors.ownerName = "Owner Name required"; isValid = false; }
            if (!formData.numberOfEmployees) { newErrors.numberOfEmployees = "Employee count required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
        }
        else if (step === 2) { // Address & Nature
            if (!formData.businessAddress) { newErrors.businessAddress = "Address required"; isValid = false; }
            if (!formData.natureOfBusiness) { newErrors.natureOfBusiness = "Nature required"; isValid = false; }
            if (!formData.commencementDate) { newErrors.commencementDate = "Date required"; isValid = false; }
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
            const response = await uploadFile(file, 'shop_act_docs');
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
            alert("Upload failed. Please try again.");
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
                submissionId: `SHOPACT-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: employeeRange,
                amountPaid: pricing[employeeRange].serviceFee,
                businessName: formData.businessName,
                state: formData.state,
                numberOfEmployees: parseInt(formData.numberOfEmployees),
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitShopEstablishment(finalPayload);
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
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Building size={18} className="text-[#ED6E3F]" /> Establishment Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Shop / Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="As on Signboard" className={`w-full p-4 bg-gray-50 border ${errors.businessName ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Owner / Manager Name</label>
                                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="Full Legal Name" className={`w-full p-4 bg-gray-50 border ${errors.ownerName ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">No. of Employees</label>
                                    <input type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleInputChange} placeholder="e.g. 5" className={`w-full p-4 bg-gray-50 border ${errors.numberOfEmployees ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all`} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Select State</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-4 bg-gray-50 border ${errors.state ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm outline-none`}>
                                        <option value="">Select State</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Telangana">Telangana</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Other">Other</option>
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
                                <MapPin size={18} className="text-[#ED6E3F]" /> Site Activity
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Exact Business Address</label>
                                    <textarea name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} rows={3} placeholder="Room/Shop, Building, Street, Area..." className={`w-full p-4 bg-gray-50 border ${errors.businessAddress ? 'border-red-500' : 'border-gray-100'} rounded-xl text-sm focus:bg-white focus:border-[#ED6E3F]/30 outline-none transition-all resize-none`} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nature of Business</label>
                                        <select name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleInputChange} className={`w-full p-4 bg-gray-50 border ${errors.natureOfBusiness ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm outline-none`}>
                                            <option value="">Select Activity</option>
                                            <option value="Retail">Retail Store</option>
                                            <option value="Wholesale">Wholesale Trade</option>
                                            <option value="Office">Commercial Office</option>
                                            <option value="Restaurant">Hotel / Restaurant</option>
                                            <option value="Logistics">Warehouse / Logistics</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Commencement Date</label>
                                        <input type="date" name="commencementDate" value={formData.commencementDate} onChange={handleInputChange} className={`w-full p-4 bg-gray-50 border ${errors.commencementDate ? 'border-red-400' : 'border-gray-100'} rounded-xl text-sm outline-none`} />
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
                                    { id: 'shop_photo', label: 'Shopboard Photo', icon: Building },
                                    { id: 'address_proof', label: 'Premises Proof', icon: MapPin },
                                    { id: 'identity_proof', label: 'Owner ID Proof', icon: User },
                                    { id: 'bank_copy', label: 'Bank Statement', icon: Landmark }
                                ].map((doc) => (
                                    <div key={doc.id} className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-2 ${uploadedFiles[doc.id] ? 'bg-orange-50/30 border-orange-200' : 'bg-gray-50 border-gray-200 hover:border-[#ED6E3F]/50 group'}`}>
                                        <div className={`w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${uploadedFiles[doc.id] ? 'text-green-500' : 'text-gray-400'}`}>
                                            <doc.icon size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-0.5">{doc.label}</p>
                                            <p className="text-[8px] text-gray-400 font-medium uppercase tracking-widest">JPG / PDF (Max 5MB)</p>
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
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#ED6E3F] shadow-lg shadow-orange-500/10 rotate-12">
                                <IndianRupee size={32} />
                            </div>

                            <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight uppercase">Checkout</h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8">Establishment Protocol</p>

                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-4 text-xs border border-gray-100 shadow-inner">
                                <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Professional Fee</span>
                                    <span className="text-zinc-900 font-bold">₹{pricing[employeeRange].serviceFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Govt Fees</span>
                                    <span className="text-[#ED6E3F] font-bold">State Specific (TBD)</span>
                                </div>
                                <div className="h-px bg-gray-200"></div>
                                <div className="flex justify-between items-center text-3xl font-bold text-zinc-900">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Total</span>
                                    <span className="tracking-tighter">₹{pricing[employeeRange].serviceFee.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                            >
                                {isSubmitting ? 'Syncing...' : 'Complete Filing'}
                                {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Shop Act
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-base tracking-tight mb-4">{pricing[employeeRange]?.title}</p>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                                <div className="flex justify-between items-center text-xs group"><span className="text-gray-300">Service Fee</span><span className="text-white font-mono">₹{pricing[employeeRange]?.serviceFee.toLocaleString()}</span></div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end"><span className="text-[11px] font-bold text-[#ED6E3F] uppercase">Total</span><span className="text-xl font-bold text-white">₹{pricing[employeeRange]?.serviceFee.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Entity Profile', 'Operation Details', 'Document Vault', 'Filing'].map((step, i) => (
                            <div key={i} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                    {currentStep > i + 1 ? <Check size={12} /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${currentStep === i + 1 ? 'text-white font-bold' : ''}`}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col h-full bg-[#F8F9FA]">
                    <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-6 py-2 shrink-0 z-20">
                        <h2 className="font-bold text-slate-800 text-lg">
                            {currentStep === 1 && "Establishment Profile"}
                            {currentStep === 2 && "Site Activity"}
                            {currentStep === 3 && "Verified Vault"}
                            {currentStep === 4 && "Final Review"}
                        </h2>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        {apiError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs font-bold uppercase flex items-center gap-3"><AlertTriangle size={16} /> {apiError}</div>}
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-zinc-900">Application Filed!</h2>
                                <p className="text-gray-500 mt-2">Your establishment record is now being processed.</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg uppercase text-xs font-bold tracking-widest">Close</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                    </div>

                    {!isSuccess && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 disabled:opacity-30">Back</button>
                            {currentStep < 4 && <button onClick={handleNext} className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg flex items-center gap-2 text-sm">Save & Continue <ArrowRight size={16} /></button>}
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
                            {['Establishment', 'Activity', 'Documents', 'Checkout'].map((s, i) => (
                                <div key={i} className={`p-2 rounded ${currentStep === i + 1 ? 'bg-navy text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        {!isSuccess && (
                            <div className="mt-6 flex justify-between">
                                <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2 font-bold text-gray-500">Back</button>
                                {currentStep < 4 && <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-8 py-2 rounded-xl font-bold">Next</button>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopEstablishmentRegistration;
