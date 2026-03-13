import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Upload, CreditCard, Building, ArrowLeft, ArrowRight, Shield, IndianRupee, X, Zap, Calendar, ReceiptText, User } from 'lucide-react';
import { submitTdsReturn } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';
import { useAuth } from '../../../context/AuthContext';

const TdsReturnRegistration = ({ initialPlan = 'non_salary', isModal = false, onClose }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(state?.plan || searchParams.get('plan') || initialPlan);

    const [formData, setFormData] = useState({
        deductorName: user?.name || '',
        tanNumber: '',
        financialYear: '2024-25',
        quarter: 'Q1',
        deductorType: 'Company'
    });

    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const plans = {
        salary: { price: 999, title: 'Salary (24Q)', features: ["Employer deduction", "Employee data audit"] },
        non_salary: { price: 1499, title: 'Non-Salary (26Q)', features: ["Vendor payments", "Rent/Profs."] },
        nri: { price: 2499, title: 'NRI (27Q)', features: ["Foreign Remittance", "DTAA Rate Audit"] }
    };

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.non_salary;
        const basePrice = plan.price;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);
        return {
            base: basePrice,
            platformFn: platformFee,
            tax: tax,
            gst: gst,
            total: basePrice + platformFee + tax + gst
        };
    }, [selectedPlan]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [docName]: file }));
        }
    };

    const submitApplication = async () => {
        const email = user?.email || "";
        const phone = user?.mobile || "";

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${plans[selectedPlan]?.title} - TDS Return`,
            prefill: {
                name: formData.deductorName || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                setIsSubmitting(true);
                const payload = new FormData();
                const requestData = {
                    plan: selectedPlan,
                    ...formData,
                    status: "PAYMENT_SUCCESSFUL",
                    paymentDetails: {
                        ...billDetails,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    }
                };

                payload.append('data', JSON.stringify(requestData));

                Object.keys(files).forEach(key => {
                    payload.append('documents', files[key]);
                });

                try {
                    await submitTdsReturn(payload);
                    setIsSuccess(true);
                } catch (error) {
                    console.error("Submission failed", error);
                    alert("Transmission break. Please reconnect and retry.");
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };

    const handleNext = () => setCurrentStep(p => Math.min(5, p + 1));

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Zap size={18} className="text-purple-500" /> Form Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(plans).map(([key, plan]) => (
                                <div key={key} onClick={() => setSelectedPlan(key)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === key ? 'border-[#043E52] bg-blue-50/30' : 'border-gray-100'}`}>
                                    <h4 className="font-bold text-navy">{plan.title}</h4>
                                    <p className="font-bold text-lg mb-2">₹{plan.price.toLocaleString()}</p>
                                    <ul className="text-xs text-gray-500 space-y-1">
                                        {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={18} className="text-purple-500" /> Deductor Profile</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Legal Deductor Name</label>
                                <input name="deductorName" value={formData.deductorName} onChange={handleInputChange} type="text" placeholder="Company or Individual Name" className="w-full p-3 border rounded-lg" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">TAN Number (10 Digits)</label>
                                <input name="tanNumber" value={formData.tanNumber} onChange={handleInputChange} type="text" placeholder="ABCD12345E" className="w-full p-3 border rounded-lg uppercase" maxLength={10} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Entity Type</label>
                                <select name="deductorType" value={formData.deductorType} onChange={handleInputChange} className="w-full p-3 border rounded-lg">
                                    <option value="Company">Pvt Ltd / Ltd Company</option>
                                    <option value="Firm">Partnership / LLP</option>
                                    <option value="Individual">Individual / Proprietor</option>
                                    <option value="Trust">Trust / NGO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Calendar size={18} className="text-purple-500" /> Timeline</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Financial Year</label>
                                <select name="financialYear" value={formData.financialYear} onChange={handleInputChange} className="w-full p-3 border rounded-lg">
                                    <option value="2024-25">2024-2025</option>
                                    <option value="2023-24">2023-2024</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Filing Quarter</label>
                                <select name="quarter" value={formData.quarter} onChange={handleInputChange} className="w-full p-3 border rounded-lg">
                                    <option value="Q1">Q1 (Apr-Jun)</option>
                                    <option value="Q2">Q2 (Jul-Sep)</option>
                                    <option value="Q3">Q3 (Oct-Dec)</option>
                                    <option value="Q4">Q4 (Jan-Mar)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-navy mb-4">Upload Documents</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Payment / Deductee List (XLS)', key: 'deductee_data' },
                            { label: 'Paid Challan Copies (Zip/PDF)', key: 'challan_proof' },
                            { label: 'Previous Ack. (Optional)', key: 'prev_ack' },
                            { label: 'Auth Signatory Identity', key: 'auth_id' }
                        ].map((doc, i) => (
                            <div key={i} className="border border-dashed p-4 rounded-lg flex justify-between items-center bg-gray-50">
                                <span className="text-sm font-medium">{doc.label}</span>
                                <div className="flex items-center gap-3">
                                    {files[doc.key] && <CheckCircle className="text-green-500" size={16} />}
                                    <input type="file" id={doc.key} className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                                    <label htmlFor={doc.key} className="text-xs font-bold px-3 py-1.5 bg-white border rounded cursor-pointer hover:bg-gray-50">
                                        {files[doc.key] ? 'Change File' : 'Upload'}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 5:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                        <IndianRupee size={32} className="mx-auto mb-4 text-green-600" />
                        <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-left">
                            <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center"><input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} /> I Accept Terms & Conditions</label>
                        <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting || isPaymentProcessing} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">
                            {isSubmitting || isPaymentProcessing ? 'Processing Payment...' : 'Pay & Submit'}
                        </button>
                    </div>
                );
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white mb-6">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            TDS Return
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
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Form Type', 'Deductor', 'Timeline', 'Payload', 'Finalize'].map((step, i) => (
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

                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                        <div className="flex flex-col justify-center">
                            <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-800 text-sm truncate">TDS Return</span>
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
                            <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                                {currentStep === 1 && "Form Type"}
                                {currentStep === 2 && "Deductor Profile"}
                                {currentStep === 3 && "Timeline Details"}
                                {currentStep === 4 && "Upload Documents"}
                                {currentStep === 5 && "Complete Payment"}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">We will review your TDS return details shortly.</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg hover:bg-black transition">Close Window</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                    </div>

                    {!isSuccess && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button
                                onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                disabled={currentStep === 1}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                                Back
                            </button>
                            {currentStep < 5 && (
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
                            {['Form Type', 'Deductor', 'Timeline', 'Payload', 'Finalize'].map((s, i) => (
                                <div key={i} className={`p-2 rounded font-bold text-sm ${currentStep === i + 1 ? 'bg-[#043E52] text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-transparent">
                        {isSuccess ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">We will review your TDS return details shortly.</p>
                            </div>
                        ) : (
                            <div className="bg-transparent">
                                {renderStepContent()}
                                <div className="mt-6 flex justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1} className="px-6 py-2 text-gray-500 font-bold rounded hover:bg-gray-50 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="bg-[#ED6E3F] text-white px-6 py-2 rounded font-bold hover:shadow-lg transition">Next Step</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TdsReturnRegistration;
