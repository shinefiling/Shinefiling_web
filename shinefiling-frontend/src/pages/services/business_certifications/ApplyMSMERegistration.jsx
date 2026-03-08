import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
    CheckCircle, Upload, ArrowLeft, ArrowRight, IndianRupee, User,
    FileText, AlertCircle, RefreshCw, Smartphone, Building, BookOpen, MapPin, Briefcase,
    Shield, Lock, ChevronRight, Menu, X, Layout, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadFile, submitMSMERegistration } from '../../../api';

const ApplyMSMERegistration = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [plan, setPlan] = useState(planProp || 'basic');

    // Protect Route
    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const planParam = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/business-certifications/msme-registration/apply?plan=${planParam}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    useEffect(() => {
        if (!isModal) window.scrollTo(0, 0);
    }, [step, isModal]);

    useEffect(() => {
        if (planProp) {
            setPlan(planProp.toLowerCase());
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['basic', 'u_pro', 'growth'].includes(planParam.toLowerCase())) {
                setPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [formData, setFormData] = useState({
        applicantName: '',
        aadhaarNumber: '',
        panNumber: '',
        enterpriseName: '',
        organisationType: 'Proprietorship',
        plantAddress: '',
        officialAddress: '',
        bankAccountNumber: '',
        ifscCode: '',
        mobileNumber: '',
        email: '',
        dateOfCommencement: '',
        majorActivity: 'Services',
        nicCodes: [],
        maleEmployees: '',
        femaleEmployees: '',
        investmentPlantMachinery: '',
        turnover: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    // NIC Options Simulation
    const nicOptions = [
        { code: "6201", desc: "Computer programming activities" },
        { code: "6202", desc: "Computer consultancy" },
        { code: "6311", desc: "Data processing" },
        { code: "4791", desc: "Retail sale via Internet" },
        { code: "5610", desc: "Restaurants" }
    ];
    const [nicSearch, setNicSearch] = useState("");

    const pricing = {
        basic: { serviceFee: 999, title: "Basic Registration" },
        u_pro: { serviceFee: 1499, title: "Udyam Pro" },
        growth: { serviceFee: 2999, title: "Growth Package" }
    };

    // Memoize bill details
    const billDetails = useMemo(() => {
        const selectedPricing = pricing[plan] || pricing.basic;
        const basePrice = selectedPricing.serviceFee;

        const platformFee = Math.round(basePrice * 0.03); // 3%
        const tax = Math.round(basePrice * 0.03);         // 3% 
        const gst = Math.round(basePrice * 0.09);         // 9%

        return {
            base: basePrice,
            platformFn: platformFee,
            tax: tax,
            gst: gst,
            total: basePrice + platformFee + tax + gst,
            planName: selectedPricing.title
        };
    }, [plan]);

    // Load User Data
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    email: user.email || '',
                    mobileNumber: user.mobile || ''
                }));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        let isValid = true;
        setError(null);

        if (currentStep === 1) { // Primary Details
            if (!formData.enterpriseName) { newErrors.enterpriseName = "Enterprise Name required"; isValid = false; }
            if (!formData.aadhaarNumber) { newErrors.aadhaarNumber = "Aadhaar required"; isValid = false; }
            if (!formData.panNumber) { newErrors.panNumber = "PAN required"; isValid = false; }
            if (!formData.mobileNumber) { newErrors.mobileNumber = "Mobile required"; isValid = false; }
        } else if (currentStep === 2) { // Business Details
            if (!formData.dateOfCommencement) { newErrors.dateOfCommencement = "Start Date required"; isValid = false; }
            if (!formData.investmentPlantMachinery) { newErrors.investmentPlantMachinery = "Investment details required"; isValid = false; }
        }

        setErrors(newErrors);
        if (!isValid) setError("Please fill all required fields correctly.");
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(5, prev + 1));
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'msme_docs');
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
            setError("File upload failed. Please try again.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            // Prepare MSME Specific Form Data Structure
            const msmeSpecificData = {
                ...formData,
                maleEmployees: parseInt(formData.maleEmployees) || 0,
                femaleEmployees: parseInt(formData.femaleEmployees) || 0,
                investmentPlantMachinery: parseFloat(formData.investmentPlantMachinery) || 0,
                turnover: parseFloat(formData.turnover) || 0,
                nicCodes: JSON.stringify(formData.nicCodes),
                selectedPlan: billDetails.planName
            };

            const finalPayload = {
                submissionId: `MSME-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.email || 'guest@example.com',
                plan: plan,
                amountPaid: billDetails.total,
                status: "PAYMENT_SUCCESSFUL",
                formData: msmeSpecificData,
                documents: docsList,
                paymentDetails: billDetails
            };

            await submitMSMERegistration(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            setError("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helpers for NIC Selection
    const addNicCode = (code) => {
        if (!formData.nicCodes.find(c => c.code === code.code)) {
            setFormData(prev => ({ ...prev, nicCodes: [...prev.nicCodes, code] }));
        }
        setNicSearch("");
    };
    const removeNicCode = (codeToRemove) => {
        setFormData(prev => ({ ...prev, nicCodes: prev.nicCodes.filter(c => c.code !== codeToRemove) }));
    };

    const steps = ['Basic Info', 'Business Details', 'Documents', 'Review', 'Payment'];

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <User size={20} className="text-blue-600" /> APPLICANT DETAILS
                            </h3>
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3 mb-6">
                                <AlertCircle className="text-blue-600 mt-0.5 shrink-0" size={18} />
                                <p className="text-sm text-blue-800">
                                    Please ensure details match your <strong>Aadhaar Card</strong> exactly to avoid rejection.
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Enterprise Name</label>
                                    <input type="text" name="enterpriseName" value={formData.enterpriseName} onChange={handleInputChange} placeholder="e.g. ABC Trading Co." className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition ${errors.enterpriseName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Applicant Name</label>
                                    <input type="text" name="applicantName" value={formData.applicantName} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Entity Type</label>
                                    <select name="organisationType" value={formData.organisationType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option>Proprietorship</option>
                                        <option>Partnership</option>
                                        <option>Private Limited</option>
                                        <option>LLP</option>
                                        <option>Trust/Society</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Aadhaar Number</label>
                                    <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} maxLength={12} className={`w-full p-3 rounded-lg border ${errors.aadhaarNumber ? 'border-red-500' : 'border-gray-200'} bg-white`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">PAN Number</label>
                                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} maxLength={10} className={`w-full p-3 rounded-lg border ${errors.panNumber ? 'border-red-500' : 'border-gray-200'} bg-white uppercase`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Mobile (Aadhaar Linked)</label>
                                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-200'} bg-white`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Email ID</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Briefcase size={20} className="text-orange-600" /> BUSINESS DETAILS
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Date of Commencement</label>
                                    <input type="date" name="dateOfCommencement" value={formData.dateOfCommencement} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.dateOfCommencement ? 'border-red-500' : 'border-gray-200'} bg-white`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Main Activity</label>
                                    <select name="majorActivity" value={formData.majorActivity} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option>Manufacturing</option>
                                        <option>Services</option>
                                        <option>Trading</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Investment (Msg/Plant) ₹</label>
                                    <input type="number" name="investmentPlantMachinery" value={formData.investmentPlantMachinery} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.investmentPlantMachinery ? 'border-red-500' : 'border-gray-200'} bg-white`} placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Turnover (Annual) ₹</label>
                                    <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Male Employees</label>
                                    <input type="number" name="maleEmployees" value={formData.maleEmployees} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Female Employees</label>
                                    <input type="number" name="femaleEmployees" value={formData.femaleEmployees} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                                <div className="md:col-span-2 space-y-2 pt-2 border-t border-dashed">
                                    <label className="text-xs font-bold text-gray-500 block uppercase">NIC Search</label>
                                    <div className="relative">
                                        <input type="text" value={nicSearch} onChange={(e) => setNicSearch(e.target.value)} placeholder="Type activity (e.g. Software, Retail)" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50" />
                                        {nicSearch.length > 2 && (
                                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl rounded-xl mt-1 z-10 max-h-40 overflow-y-auto">
                                                {nicOptions.filter(n => n.desc.toLowerCase().includes(nicSearch.toLowerCase())).map(n => (
                                                    <div key={n.code} onClick={() => addNicCode(n)} className="p-3 hover:bg-orange-50 cursor-pointer text-sm border-b border-gray-50">
                                                        <span className="font-bold text-orange-600">{n.code}</span> - {n.desc}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.nicCodes.map(code => (
                                            <span key={code.code} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold">
                                                {code.desc} <button onClick={() => removeNicCode(code.code)} className="hover:text-red-600">×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-2 mt-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Business Address</label>
                                    <textarea name="plantAddress" value={formData.plantAddress} onChange={handleInputChange} rows="2" className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="Full address with Pincode" />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Bank A/c No</label>
                                        <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">IFSC Code</label>
                                        <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white uppercase" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Upload size={20} className="text-bronze" /> DOCUMENT UPLOAD
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">Required formats: JPEG, PNG, or PDF</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Aadhaar Card (F/B)', key: 'aadhaar_doc' },
                                    { label: 'PAN Card Copy', key: 'pan_doc' },
                                    { label: 'Bank Cheque/Passbook', key: 'bank_doc' },
                                    { label: 'GST Certificate (Opt.)', key: 'gst_doc' }
                                ].map((doc, idx) => {
                                    return (
                                        <div key={idx} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-blue-300 transition-colors bg-gray-50">
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-gray-400 group-hover:text-bronze" />
                                                <span className="text-sm font-medium text-gray-600">{doc.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[doc.key] && <CheckCircle size={16} className="text-green-500" />}
                                                <input type="file" onChange={(e) => handleFileUpload(e, doc.key)} className="text-xs w-24 text-slate-400" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Review Details</h2>
                        <p className="text-gray-500 mb-6">Verify your information before submission.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200 text-left">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Plan</span><span className="font-bold">{billDetails.planName}</span></div>
                                <div className="flex justify-between"><span>Applicant</span><span className="font-bold">{formData.applicantName}</span></div>
                                <div className="flex justify-between"><span>Enterprise</span><span className="font-bold">{formData.enterpriseName}</span></div>
                                <div className="flex justify-between"><span>PAN Details</span><span className="font-bold uppercase">{formData.panNumber}</span></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={handleBack} className="py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50">Edit</button>
                            <button onClick={() => setStep(5)} className="py-3 bg-navy text-white rounded-xl font-bold hover:bg-black transition">Proceed to Pay</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment</h2>
                        <p className="text-gray-500 mb-8">Secure payment gateway</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Service Fee</span><span>₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Tax & GST</span><span>₹{billDetails.tax + billDetails.gst}</span></div>
                            <div className="border-t pt-2 mt-2 flex justify-between items-end"><span className="text-gray-500 font-bold">Total</span><span className="text-3xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : `Pay ₹${billDetails.total} & Submit`}
                            {!isSubmitting && <Lock size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    if (isSuccess) {
        return (
            <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm`}>
                <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your Udyam Registration for <span className="font-bold text-navy">{formData.enterpriseName}</span> is under process. Reference ID: MSME-{Date.now().toString().substr(-6)}.
                    </p>
                    <button onClick={onClose || (() => navigate('/dashboard'))} className="bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition w-full">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-row overflow-hidden bg-white ${isModal ? 'h-[85vh]' : 'min-h-screen pt-20'}`}>
            {/* LEFT SIDEBAR: DARK */}
            <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10 mb-8">
                    <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                        <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                        MSME Registration
                    </h1>
                    <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 blur-sm pointer-events-none">
                            <Building size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</div>
                            <div className="font-bold text-white text-lg tracking-tight mb-4">{billDetails.planName}</div>
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
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    {steps.map((s, i) => (
                        <div key={i} onClick={() => { if (step > i + 1) setStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${step === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === i + 1 ? 'bg-[#ED6E3F] text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                {step > i + 1 ? <CheckCircle size={12} /> : i + 1}
                            </div>
                            <span className={`text-xs font-medium ${step === i + 1 ? 'text-white font-bold' : ''}`}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                    <div className="flex flex-col justify-center">
                        <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                            <div className="flex items-center gap-2 truncate">
                                <span className="font-bold text-slate-800 text-sm truncate">MSME Registration</span>
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
                        <h2 className="hidden md:block font-bold text-slate-800 text-lg">{steps[step - 1]}</h2>
                    </div>

                    <button onClick={isModal ? onClose : () => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                        {isModal ? <X size={20} /> : <ArrowLeft size={20} />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderStepContent()}
                </div>

                {step < 5 && (
                    <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                        <button onClick={() => setStep(p => Math.max(1, p - 1))} disabled={step === 1} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30">Back</button>
                        <button onClick={handleNext} className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition flex items-center gap-2 text-sm">Save & Continue <ArrowRight size={16} /></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyMSMERegistration;
