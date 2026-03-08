import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, ArrowLeft, ArrowRight, IndianRupee, MapPin, Store, AlertTriangle, FileText, X
} from 'lucide-react';
import { uploadFile, submitFssaiLicense } from '../../../api';

const FssaiCorrectionRegistration = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [plan, setPlan] = useState(planProp || 'standard');

    // Protect Route
    useEffect(() => {
        // Login check removed to allow guest access
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData(prev => ({
                ...prev,
                userEmail: user.email,
                userPhone: user.mobile || ''
            }));
        }
    }, []);

    useEffect(() => {
        if (planProp) {
            setPlan(planProp.toLowerCase());
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['basic', 'standard', 'complex', 'professional'].includes(planParam.toLowerCase())) {
                setPlan(planParam.toLowerCase() === 'professional' ? 'standard' : planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [formData, setFormData] = useState({
        userEmail: '',
        userPhone: '',
        businessName: '',
        existingLicenseNumber: '',
        modificationDetails: '',
        address: '',
        foodCategory: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const pricing = {
        basic: { serviceFee: 999, title: "Basic Update" },
        standard: { serviceFee: 1499, title: "Full Modification" },
        complex: { serviceFee: 2499, title: "Category Change" }
    };

    // Memoize bill details
    const billDetails = useMemo(() => {
        const selectedPricing = pricing[plan] || pricing.standard;
        const basePrice = selectedPricing.serviceFee;

        // User Request: Total extra is 15% split into Platform Fee, Tax, and GST
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
    }, [plan]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Details
            if (!formData.userEmail) { newErrors.userEmail = "Email required"; isValid = false; }
            if (!formData.userPhone) { newErrors.userPhone = "Phone Number required"; isValid = false; }
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.existingLicenseNumber) { newErrors.existingLicenseNumber = "License Number required"; isValid = false; }
            if (!formData.modificationDetails) { newErrors.modificationDetails = "Please describe required changes"; isValid = false; }
        }
        else if (step === 2) { // Address & Category
            // Optional depending on what they want to change, but good to collect
            if (!formData.address) { newErrors.address = "Current Address required"; isValid = false; }
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
            const response = await uploadFile(file, 'fssai_correction_docs');
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
                submissionId: `FSSAI-MOD-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.userEmail,
                plan: plan,
                amountPaid: billDetails.total,
                businessName: formData.businessName,
                licenseType: "MODIFICATION", // Explicitly set
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    ...formData,
                    // Map modification details to something useful or keep as is if backend supports generic formData map
                    description: formData.modificationDetails
                },
                documents: docsList
            };

            // Reusing submitFssaiLicense as the controller is generic enough or we can add a new one if needed
            // The controller accepts FssaiRequest which has a generic 'formData' inner class. 
            // We might need to ensure backend FssaiFormData has fields we need or use a map.
            // FssaiRequest.FssaiFormData has specific fields. 
            // Ideally we should add 'modificationDetails' to backend FssaiFormData, but for now we can pass it in 'addressLine2' or similar if strict.
            // Or rely on the fact that we are sending JSON and if backend uses ObjectMapper to map to class, extra fields might be ignored? 
            // Wait, if ignored, then we lose data.
            // I should check FssaiFormData in backend. It has 'addressLine1', 'addressLine2'.
            // I will map 'modificationDetails' to 'addressLine2' or 'kindOfBusiness' as a hack, or better, update backend DTO.
            // Since DTO update is quick and safer: I'll update FssaiFormData in backend to include 'modificationDetails' and 'existingLicenseNumber'.

            await submitFssaiLicense(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Store size={20} className="text-orange-600" /> LICENSE DETAILS
                            </h3>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Business Name</label>
                                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Email ID</label>
                                    <input type="email" name="userEmail" value={formData.userEmail} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.userEmail ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Mobile Number</label>
                                    <input type="tel" name="userPhone" value={formData.userPhone} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.userPhone ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Existing License/Registration No.</label>
                                    <input type="text" name="existingLicenseNumber" value={formData.existingLicenseNumber} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.existingLicenseNumber ? 'border-red-500' : 'border-gray-200'}`} placeholder="14-digit number" />
                                </div>
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">What needs to be changed?</label>
                                    <textarea name="modificationDetails" value={formData.modificationDetails} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.modificationDetails ? 'border-red-500' : 'border-gray-200'}`} rows="3" placeholder="Describe the changes (e.g., Change address to ..., Add new product category...)"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-orange-600" /> NEW / CURRENT DETAILS
                            </h3>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Current/New Address</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'}`} rows="3" placeholder="Full address..."></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Food Category (If adding products)</label>
                                <input type="text" name="foodCategory" value={formData.foodCategory} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" placeholder="Optional" />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-orange-600" /> DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">License Copy</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'license_copy')} accept=".pdf,.jpg" />
                                        {uploadedFiles['license_copy'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['license_copy'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Proof of Change</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'proof_of_change')} accept=".pdf,.jpg" />
                                        {uploadedFiles['proof_of_change'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['proof_of_change'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Service Fee for {pricing[plan].title}</p>

                        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-left">
                            <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & File Application'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK - Detailed View */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                            <span className="text-[#ED6E3F]">FSSAI</span>
                            Modification
                        </h1>
                        <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                            <div className="relative z-10">
                                <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                                <p className="font-bold text-white text-lg tracking-tight mb-4">{pricing[plan]?.title}</p>
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
                        {['License Details', 'New Details', 'Documents', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">FSSAI Modification</span>
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
                            <h2 className="hidden md:block font-bold text-[#ED6E3F] text-lg">
                                {currentStep === 1 && "License Details"}
                                {currentStep === 2 && "New / Current Details"}
                                {currentStep === 3 && "Documents"}
                                {currentStep === 4 && "Complete Payment"}
                            </h2>
                        </div>
                        <button onClick={onClose || (() => navigate(-1))} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Modification Submitted!</h2>
                                <p className="text-gray-500 mt-2">Your request has been submitted successfully.</p>
                                <button onClick={onClose || (() => navigate(-1))} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                        {apiError && (
                            <div className="mx-6 md:mx-8 mb-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                                <AlertTriangle size={20} />
                                <span>{apiError}</span>
                            </div>
                        )}
                    </div>

                    {/* Sticky Footer */}
                    {!isSuccess && currentStep < 4 && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button
                                onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                disabled={currentStep === 1}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition flex items-center gap-2 text-sm"
                            >
                                Save & Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF7] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Modification Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request to modify <b>{formData.businessName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">FSSAI License Modification</h1>
                        <p className="text-gray-500">Update details of your existing license</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['License Details', 'New Details', 'Documents', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-orange-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-xs text-orange-800">
                                <strong>Selected Plan:</strong> <br />
                                <span className="text-lg font-bold">{pricing[plan].title}</span>
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}
                            {apiError && (
                                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    <span>{apiError}</span>
                                </div>
                            )}
                            {!isSuccess && currentStep < 4 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FssaiCorrectionRegistration;
