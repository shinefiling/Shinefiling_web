import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, ArrowLeft, ArrowRight, IndianRupee, Building, FileText, AlertCircle, Shield, X
} from 'lucide-react';
import { uploadFile, submitCompanyLlpCorrection } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const CompanyLLPDetailCorrectionRegistration = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const [currentStep, setCurrentStep] = useState(1);
    const [plan, setPlan] = useState(planProp || 'office_shift');

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
            if (planParam && ['capital', 'office_shift', 'name'].includes(planParam.toLowerCase())) {
                setPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [formData, setFormData] = useState({
        userEmail: '',
        userPhone: '',
        companyName: '',
        cin: '',
        companyType: 'Private Limited',
        correctionType: 'Address Change', // Address, Capital, Objectives, Directors, Others
        detailsToCorrect: '',
        newInformation: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const pricing = {
        'capital': { serviceFee: 2499, title: "Capital Increase" },
        'office_shift': { serviceFee: 3999, title: "Office Shift" },
        'name': { serviceFee: 7999, title: "Name Change" }
    };

    // Memoize bill details
    const billDetails = useMemo(() => {
        const selectedPricing = pricing[plan] || pricing.office_shift;
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

        if (step === 1) { // Entity Details
            if (!formData.userEmail) { newErrors.userEmail = "Email required"; isValid = false; }
            if (!formData.userPhone) { newErrors.userPhone = "Phone Number required"; isValid = false; }
            if (!formData.companyName) { newErrors.companyName = "Company Name required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "CIN required"; isValid = false; }
        } else if (step === 2) { // Change Details
            if (!formData.detailsToCorrect) { newErrors.detailsToCorrect = "Please specify what needs to be changed"; isValid = false; }
            if (!formData.newInformation) { newErrors.newInformation = "Please enter the new correct information"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(5, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'roc_correction_docs');
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
        const email = userObj?.email || formData.userEmail;
        const phone = userObj?.userPhone || formData.userPhone || '';

        processPayment({
            amount: billDetails.total,
            description: `Payment for Company/LLP Detail Correction - ${pricing[plan].title}`,
            prefill: {
                name: userObj?.name || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                try {
                    const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                        id: k,
                        filename: v.name,
                        fileUrl: v.fileUrl
                    }));

                    const finalPayload = {
                        submissionId: `ROC-C-${Date.now()}`,
                        userEmail: email,
                        userPhone: phone,
                        plan: plan,
                        amountPaid: billDetails.total,
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

                    await submitCompanyLlpCorrection(finalPayload);
                    setIsSuccess(true);
                } catch (error) {
                    console.error(error);
                    alert("Submission error: " + error.message);
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
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Building size={20} className="text-indigo-600" /> ENTITY DETAILS
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Full Company / LLP Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Email ID</label>
                                        <input type="email" name="userEmail" value={formData.userEmail} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.userEmail ? 'border-red-500' : 'border-gray-200'}`} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Mobile Number</label>
                                        <input type="tel" name="userPhone" value={formData.userPhone} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.userPhone ? 'border-red-500' : 'border-gray-200'}`} />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">CIN / LLPIN</label>
                                        <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} className={`w-full p-3 rounded-lg border uppercase ${errors.cin ? 'border-red-500' : 'border-gray-200'}`} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Entity Type</label>
                                        <select name="companyType" value={formData.companyType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                            <option value="Private Limited">Private Limited</option>
                                            <option value="LLP">LLP</option>
                                            <option value="One Person Company">One Person Company</option>
                                            <option value="Public Limited">Public Limited</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-red-600" /> CORRECTION DETAILS
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Nature of Correction</label>
                                    <select name="correctionType" value={formData.correctionType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Address Change">Address Change (Office)</option>
                                        <option value="Capital Increase">Authorized / Paid-up Capital</option>
                                        <option value="MOA/AOA Change">MOA / AOA Amendment</option>
                                        <option value="Director Change">Director / Partner Details</option>
                                        <option value="Others">Others (Master Data Mistake)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Details to Correct</label>
                                    <textarea name="detailsToCorrect" value={formData.detailsToCorrect} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.detailsToCorrect ? 'border-red-500' : 'border-gray-200'}`} rows="2" placeholder="Specify which field in MCA records is incorrect..."></textarea>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">New Correct Information</label>
                                    <textarea name="newInformation" value={formData.newInformation} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.newInformation ? 'border-red-500' : 'border-gray-200'}`} rows="4" placeholder="Enter the new details as per supporting documents..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-6">UPLOAD SUPPORTING DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Certificate of Incorporation', key: 'coi' },
                                    { label: 'Authorized Signatory PAN/Aadhaar', key: 'signatory_id' },
                                    { label: 'Passport Size Photo of Directors', key: 'director_photo' },
                                    { label: 'Proof of Proposed Correction', key: 'change_proof' }
                                ].map((doc, idx) => (
                                    <div key={idx} className="border border-dashed p-4 rounded-xl flex justify-between items-center group hover:border-indigo-300 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">{doc.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {uploadedFiles[doc.key] && <CheckCircle size={16} className="text-green-500" />}
                                            <label className="cursor-pointer bg-navy text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                                                {uploadedFiles[doc.key] ? 'Change' : 'Upload'}
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-2xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="space-y-6 text-sm">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Company Name</p>
                                    <p className="font-bold text-navy">{formData.companyName}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">CIN / LLPIN</p>
                                    <p className="font-bold text-navy">{formData.cin}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <p className="text-indigo-800 text-xs font-bold uppercase mb-2">Requested Correction</p>
                                <p className="text-navy font-semibold mb-2">{formData.correctionType}</p>
                                <div className="p-3 bg-white rounded-lg text-xs text-gray-600 leading-relaxed font-mono">
                                    {formData.newInformation}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Professional Fee</h2>
                        <p className="text-gray-500 mb-8">Service fee for {pricing[plan].title}</p>

                        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-left">
                            <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting || isPaymentProcessing} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
                            {isSubmitting || isPaymentProcessing ? 'Processing Payment...' : 'Pay & File Correction'}
                            {!isSubmitting && !isPaymentProcessing && <ArrowRight size={18} />}
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
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white text-[#ED6E3F]">
                            MCA Services
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
                        {['Entity Info', 'Corrections', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">Company/LLP Correction</span>
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
                                {currentStep === 1 && "Entity Details"}
                                {currentStep === 2 && "Correction Details"}
                                {currentStep === 3 && "Documents"}
                                {currentStep === 4 && "Review Application"}
                                {currentStep === 5 && "Complete Payment"}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Your request has been submitted successfully.</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                    </div>

                    {/* Sticky Footer */}
                    {!isSuccess && currentStep < 5 && (
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
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition flex items-center gap-2 text-sm"
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
        <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request for master data correction of <b>{formData.companyName}</b> has been received. Our CS team will verify the documents and draft the necessary board resolutions.
                    </p>
                    <button onClick={() => navigate('/dashboard?tab=orders')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">Company / LLP Detail Correction</h1>
                        <p className="text-gray-500">Update your corporate master data on the MCA portal</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Entity Info', 'Corrections', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-indigo-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-navy text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center gap-2">
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

export default CompanyLLPDetailCorrectionRegistration;
