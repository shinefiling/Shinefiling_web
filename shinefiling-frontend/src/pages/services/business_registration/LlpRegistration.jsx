import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Shield, CreditCard, FileText,
    User, MapPin, Briefcase, Plus, Trash2, ArrowLeft, ArrowRight, X, IndianRupee, Users, Receipt
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitLlpRegistration, uploadFile } from '../../../api';



const LlpRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        startup: {
            price: 4999,
            title: 'Startup Plan',
            features: ["2 DSC & 2 DPIN", "Name Reservation", "Incorporation Filing", "PAN & TAN", "LLP Agreement Drafting"],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 9999,
            title: 'Standard Plan',
            features: ["Everything in Startup", "GST Registration", "MSME (Udyam) Registration", "Stamp Paper Assistance", "Bank Account Support"],
            color: 'bg-[#F0F7FF] border-blue-200'
        },
        premium: {
            price: 19999,
            title: 'Premium Plan',
            features: ["Everything in Standard", "Trademark Filing (1 Class)", "Domain + Email (1 Yr)", "Zero Balance Current A/c", "Dedicated CA Support"],
            color: 'bg-[#FDF4FF] border-purple-200'
        }
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Protect Route (Removed)
    useEffect(() => {
        // Login check removed to allow manual entry
    }, []);

    // Steps: Plan -> Company -> Partners -> Docs -> Payment
    // Mapped to: 1: Company, 2: Partners, 3: Docs, 4: Review, 5: Payment (Plan selection moved to sidebar/initial state)
    const [currentStep, setCurrentStep] = useState(1);

    // Validate plan
    const validatePlan = (plan) => {
        return ['startup', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'startup';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    useEffect(() => {
        if (planProp) {
            setSelectedPlan(validatePlan(planProp));
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['startup', 'standard', 'premium'].includes(planParam.toLowerCase())) {
                setSelectedPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [formData, setFormData] = useState({
        userEmail: '',
        userPhone: '',
        llpNameOption1: '',
        llpNameOption2: '',
        businessActivity: '',
        contributionAmount: '',
        registeredAddress: '',

        profitSharingRatio: 'Equal',
        turnoverEstimate: '',
        gstState: '',
        bankPreference: '',
        accountingStartDate: '',

        partners: [
            { id: 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' },
            { id: 2, name: '', email: '', mobile: '', pan: '', aadhaar: '' }
        ]
    });

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Memoize bill details
    const billDetails = useMemo(() => {
        const planKey = plans[selectedPlan] ? selectedPlan : 'startup';
        const plan = plans[planKey];
        const basePrice = plan.price;

        const platformFee = Math.round(basePrice * 0.03); // 3%
        const tax = Math.round(basePrice * 0.03); // 3%
        const gst = Math.round(basePrice * 0.09); // 9%

        return {
            base: basePrice,
            platformFn: platformFee,
            tax: tax,
            gst: gst,
            total: basePrice + platformFee + tax + gst
        };
    }, [selectedPlan]);

    // Plans Configuration

    // Plans Configuration


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
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
            if (!formData.llpNameOption1) { newErrors.llpNameOption1 = "Required"; isValid = false; }
            if (!formData.businessActivity) { newErrors.businessActivity = "Required"; isValid = false; }
            if (!formData.contributionAmount) { newErrors.contributionAmount = "Required"; isValid = false; }
            if (!formData.registeredAddress) { newErrors.registeredAddress = "Required"; isValid = false; }
        }

        if (step === 2) {
            formData.partners.forEach((partner, index) => {
                if (!partner.name) { newErrors[`partner_${index}_name`] = "Required"; isValid = false; }
                if (!partner.pan) { newErrors[`partner_${index}_pan`] = "Required"; isValid = false; }
            });
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(5, prev + 1));
        }
    };

    const handlePartnerChange = (index, e) => {
        const newPartners = [...formData.partners];
        newPartners[index][e.target.name] = e.target.value;
        setFormData({ ...formData, partners: newPartners });
    };

    const addPartner = () => {
        setFormData({
            ...formData,
            partners: [...formData.partners, { id: formData.partners.length + 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' }]
        });
    };

    const removePartner = (index) => {
        if (formData.partners.length <= 2) return; // Min 2
        const newPartners = formData.partners.filter((_, i) => i !== index);
        setFormData({ ...formData, partners: newPartners });
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            let category = 'llp_docs';
            if (key.includes('partner')) category = 'partner_docs';
            if (key.includes('office')) category = 'office_docs';

            const response = await uploadFile(file, category);

            setFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    preview: file.type.includes('image') ? URL.createObjectURL(file) : null,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(files).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `LLP-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.userEmail,
                userPhone: JSON.parse(localStorage.getItem('user'))?.phone || formData.userPhone,
                formData: formData,
                documents: docsList,
                paymentDetails: billDetails,
                status: "PAYMENT_SUCCESSFUL"
            };

            // Backend LlpController expects Multipart with 'data' field containing JSON string
            const formDataObj = new FormData();
            formDataObj.append('data', JSON.stringify(finalPayload));

            const response = await submitLlpRegistration(formDataObj);

            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit. " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Company Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            {(!isLoggedIn && !localStorage.getItem('user')) && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                                    <h3 className="md:col-span-2 font-bold text-navy mb-1 text-sm flex items-center gap-2"><User size={16} /> CONTACT DETAILS</h3>
                                    <input name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="Your Email Address" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.userEmail ? 'border-red-500' : ''}`} />
                                    <input name="userPhone" value={formData.userPhone} onChange={handleInputChange} placeholder="Your Phone Number" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.userPhone ? 'border-red-500' : ''}`} />
                                </div>
                            )}
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Briefcase size={20} className="text-blue-600" /> LLP DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="llpNameOption1" placeholder="Proposed LLP Name Option 1" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.llpNameOption1 ? 'border-red-500' : ''}`} onChange={handleInputChange} value={formData.llpNameOption1} />
                                <input name="llpNameOption2" placeholder="Proposed LLP Name Option 2" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.llpNameOption2} />
                                <textarea name="businessActivity" placeholder="Main Business Activity (e.g. Software Development)" className={`p-3 rounded-lg border border-gray-200 w-full md:col-span-2 ${errors.businessActivity ? 'border-red-500' : ''}`} rows="2" onChange={handleInputChange} value={formData.businessActivity}></textarea>
                                <input name="contributionAmount" placeholder="Total Contribution Amount (e.g. 100000)" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.contributionAmount ? 'border-red-500' : ''}`} onChange={handleInputChange} value={formData.contributionAmount} />
                                <input name="registeredAddress" placeholder="Registered Office Address" className={`p-3 rounded-lg border border-gray-200 w-full ${errors.registeredAddress ? 'border-red-500' : ''}`} onChange={handleInputChange} value={formData.registeredAddress} />

                                {selectedPlan !== 'basic' && (
                                    <>
                                        <input name="profitSharingRatio" placeholder="Profit Sharing Ratio (e.g. 50:50)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.profitSharingRatio} />
                                        <input name="gstState" placeholder="GST State Code" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.gstState} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2: // Partners
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-navy flex items-center gap-2"><Users size={20} className="text-bronze" /> PARTNER DETAILS</h3>
                            <button onClick={addPartner} className="text-sm font-bold text-white bg-bronze px-3 py-1.5 rounded-lg hover:bg-bronze-dark flex items-center gap-1"><Plus size={14} /> Add</button>
                        </div>
                        {formData.partners.map((partner, index) => (
                            <div key={partner.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <span className="font-bold text-gray-700">Partner #{index + 1}</span>
                                    {index >= 2 && <button onClick={() => removePartner(index)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input name="name" placeholder="Full Name" value={partner.name} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="email" placeholder="Email" value={partner.email} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="mobile" placeholder="Mobile" value={partner.mobile} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="pan" placeholder="PAN Number" value={partner.pan} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-slate" /> UPLOAD DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {formData.partners.map((partner, i) => (
                                    <div key={i} className="space-y-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Partner {i + 1} ({partner.name || 'Name'})</p>
                                        <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-gray-600">PAN Card</span>
                                            <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `partner_${i}_pan`)} />
                                            {files[`partner_${i}_pan`] && <CheckCircle size={14} className="text-green-500" />}
                                        </div>
                                        <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-gray-600">ID Proof (Aadhaar/DL)</span>
                                            <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `partner_${i}_id`)} />
                                            {files[`partner_${i}_id`] && <CheckCircle size={14} className="text-green-500" />}
                                        </div>
                                    </div>
                                ))}
                                <div className="md:col-span-2 pt-4 border-t">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Office Proof</p>
                                    <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Electricity Bill / NOC</span>
                                        <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `office_proof`)} />
                                        {files[`office_proof`] && <CheckCircle size={14} className="text-green-500" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Plan</span>
                                <span className="font-bold font-mono uppercase text-navy">{plans[selectedPlan].title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-bold">LLP Name:</span> {formData.llpNameOption1}</p>
                            <p><span className="font-bold">Partners:</span> {formData.partners.length}</p>
                            <p><span className="font-bold">Contribution:</span> {formData.contributionAmount}</p>
                        </div>
                    </div>
                );
            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    }

    // --- MODAL LAYOUT: SPLIT VIEW (Matches Private Limited) ---
    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK */}
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg text-bronze flex items-center gap-2 tracking-tight">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            LLP Registration
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
                                    <span className="text-gray-300 group-hover:text-white transition-colors">GST (18%)</span>
                                    <span className="text-white font-medium font-mono">₹{billDetails.gst.toLocaleString()}</span>
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
                        {['LLP Details', 'Partner Details', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">LLP Registration</span>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Service</span>
                                        <span className="text-xs font-bold text-slate-700">₹{(billDetails.base / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="w-px h-5 bg-gray-200"></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">GST (18%)</span>
                                        <span className="text-xs font-bold text-slate-700">₹{(billDetails.gst / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="w-px h-5 bg-gray-200"></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Total</span>
                                        <span className="text-xs font-bold text-green-600">₹{billDetails.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop: Step Title */}
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "LLP Information"}
                                {currentStep === 2 && "Partner Details"}
                                {currentStep === 3 && "Upload Documents"}
                                {currentStep === 4 && "Review Application"}
                                {currentStep === 5 && "Complete Payment"}
                            </h2>
                        </div>

                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Order ID: {automationPayload?.submissionId}</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
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
                            {currentStep < 5 && <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">
                                Next Step <ArrowRight size={18} />
                            </button>
                            }
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-slate" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <span className="font-bold text-navy">{plans[selectedPlan].title}</span> has been submitted.
                        Your Order ID is <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{automationPayload?.submissionId}</span>.
                    </p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">LLP Registration</h1>
                            <p className="text-gray-500">Complete the process to register your Limited Liability Partnership.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* SIDEBAR */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['LLP Details', 'Partners', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}
                                        onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                    >
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-bronze-dark' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                    </div>
                                ))}
                            </div>

                            <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan].color} relative overflow-hidden transition-all sticky top-24`}>
                                <div className="relative z-10">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Plan</div>
                                    <div className="text-3xl font-bold text-gray-800 mb-2">{plans[selectedPlan].title}</div>
                                    <div className="text-3xl font-bold text-navy mb-4">₹{plans[selectedPlan].price.toLocaleString()}</div>

                                    <div className="space-y-3 mb-6">
                                        {plans[selectedPlan].features.map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600">
                                                <CheckCircle size={14} className="text-slate shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {!isModal && <button onClick={() => navigate('/services/llp-registration')} className="text-xs font-bold text-gray-500 hover:text-navy underline">Change Plan</button>}
                                </div>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1">
                            {renderStepContent()}

                            {!isSuccess && currentStep < 5 && (
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

export default LlpRegistration;
