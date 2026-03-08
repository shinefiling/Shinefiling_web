import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, PieChart, Shield, User,
    Briefcase, Building2
} from 'lucide-react';
import { uploadFile, submitIncomeTaxReturn } from '../../../api'; // Need to add to api.js

const IncomeTaxRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/income-tax-return/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'basic');

    const [formData, setFormData] = useState({
        pan: '',
        dobOrIncorporationDate: '',
        taxpayerType: 'Individual', // Individual, Firm, Company
        itrFormType: '', // Auto-set
        sourceOfIncome: 'Salary', // Salary, Business, Capital Gains
        assessmentYear: '2024-2025',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
            setSelectedPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    // Auto-select ITR based on user selection
    useEffect(() => {
        const { taxpayerType, sourceOfIncome } = formData;
        let itr = "ITR-1";
        if (taxpayerType === 'Company') itr = "ITR-6";
        else if (taxpayerType === 'Firm') itr = "ITR-5";
        else if (sourceOfIncome === 'Business') itr = "ITR-3"; // or ITR-4
        else if (sourceOfIncome === 'Capital Gains') itr = "ITR-2";

        setFormData(prev => ({ ...prev, itrFormType: itr }));
    }, [formData.taxpayerType, formData.sourceOfIncome]);

    const plans = {
        basic: {
            price: 999,
            title: 'Basic Plan',
            features: ["ITR Filing (Salary)", "E-Verify"],
            color: 'bg-white border-gray-200'
        },
        standard: {
            price: 2999,
            title: 'Standard Plan',
            features: ["Capital Gains", "Deductions", "Notice Review"],
            recommended: true,
            color: 'bg-green-50 border-green-200'
        },
        premium: {
            price: 6999,
            title: 'Premium Plan',
            features: ["Audit Ready", "Refund Tracking", "Advisory"],
            color: 'bg-emerald-50 border-emerald-200'
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // ITR Selection
            // Just confirmation
        }

        if (step === 2) { // Personal Details
            if (!formData.pan) { newErrors.pan = "PAN required"; isValid = false; }
            if (!formData.dobOrIncorporationDate) { newErrors.dob = "Date required"; isValid = false; }
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
            const response = await uploadFile(file, 'income_tax_docs');
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // ITR Type Selection
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    {isModal && (
                        <button onClick={onClose} className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                    
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><PieChart size={20} className="text-green-600" /> SOURCE OF INCOME & TYPE</h3>
                            <p className="text-sm text-gray-500 mb-6">Tell us about your income sources so we can select the right ITR form for you.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-2">Who are you filing for?</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'Individual', icon: User, label: 'Individual' },
                                            { id: 'Firm', icon: Briefcase, label: 'Partnership/LLP' },
                                            { id: 'Company', icon: Building2, label: 'Company' }
                                        ].map((type) => (
                                            <div
                                                key={type.id}
                                                onClick={() => setFormData({ ...formData, taxpayerType: type.id })}
                                                className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition ${formData.taxpayerType === type.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-200'}`}
                                            >
                                                <type.icon size={24} />
                                                <span className="text-xs font-bold">{type.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {formData.taxpayerType === 'Individual' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-2">Major Source of Income</label>
                                        <select
                                            name="sourceOfIncome"
                                            value={formData.sourceOfIncome}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-lg border border-gray-200"
                                        >
                                            <option value="Salary">Salary / Pension / House Property</option>
                                            <option value="Capital Gains">Capital Gains (Stocks, Mutual Funds, Property)</option>
                                            <option value="Business">Business / Profession (Freelancing, Shop, etc.)</option>
                                        </select>
                                    </div>
                                )}

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Recommended Form</span>
                                        <span className="text-2xl font-black text-green-600">{formData.itrFormType}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Assessment Year</span>
                                        <span className="font-bold text-gray-700">{formData.assessmentYear}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Personal/Business Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><FileText size={20} className="text-green-600" /> BASIC DETAILS</h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">PAN Number</label>
                                    <input type="text" name="pan" value={formData.pan} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.pan ? 'border-red-500' : 'border-gray-200'}`} placeholder="ABCDE1234F" maxLength={10} style={{ textTransform: 'uppercase' }} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Date of Birth / Incorporation</label>
                                    <input type="date" name="dobOrIncorporationDate" value={formData.dobOrIncorporationDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-green-600" /> UPLOAD DOCUMENTS</h3>
                            <p className="text-xs text-gray-500 mb-6">Upload Form 16, Bank Statements, or Capital Gains Reports to help us prepare your computation accurately.</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-green-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Form 16 / Salary Slips</span>
                                        <span className="text-xs text-gray-400 block mb-4">PDF or Image</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'income_proof')} accept=".pdf,.jpg,.png,.jpeg" />
                                        {uploadedFiles['income_proof'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['income_proof'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-green-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-green-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Other Docs (Optional)</span>
                                        <span className="text-xs text-gray-400 block mb-4">Bank Stmt, Capital Gains Report</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'other_docs')} accept=".pdf,.xlsx,.csv,.zip" />
                                        {uploadedFiles['other_docs'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['other_docs'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review & Pay
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-2xl font-black text-[#2B3446] mb-6">Review & Pay</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Plan</span>
                                    <span className="font-bold font-mono uppercase text-green-600">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan Amount</span>
                                    <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Filing For</span>
                                    <span className="font-bold">{formData.taxpayerType}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">ITR Form</span>
                                    <span className="font-bold">{formData.itrFormType}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">PAN</span>
                                    <span className="font-bold">{formData.pan.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                                {isSubmitting ? 'Processing...' : `Pay ₹${plans[selectedPlan].price}`}
                                {!isSubmitting && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `ITR-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitIncomeTaxReturn(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={isModal ? "bg-[#F8F9FA] p-4 md:p-8" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Request Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        We have received your request for <b>{formData.itrFormType}</b> filing.
                        Our experts will categorize your income and compute your tax liability shortly.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">File Income Tax Return</h1>
                        <p className="text-gray-500">For Assessment Year {formData.assessmentYear}</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['ITR Selection', 'Basic Info', 'Documents', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-green-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

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

export default IncomeTaxRegistration;
