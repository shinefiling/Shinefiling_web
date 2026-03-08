import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, CreditCard, FileText, User, Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, PieChart, Calendar, X } from 'lucide-react';
import { uploadFile, submitIncomeTaxReturn } from '../../../api';

const Itr2Registration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        if (!isLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/income-tax/itr-2/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(planProp || 'basic');
    const [formData, setFormData] = useState({ fullName: '', pan: '', dob: '', itrType: 'ITR-2', assessmentYear: '2024-25', hasCapitalGains: 'No', hasForeignIncome: 'No' });
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const plans = {
        basic: { price: 999, title: 'Basic ITR-2', features: ["Multiple House Property"], color: 'bg-white border-slate-200' },
        gains: { price: 1499, title: 'Capital Gains Plan', features: ["Stock Market / MF Gains"], recommended: true, color: 'bg-indigo-50 border-indigo-200' },
        nri: { price: 2999, title: 'NRI / Foreign Income', features: ["Foreign Assets & DTAA"], color: 'bg-purple-50 border-purple-200' }
    };

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.basic;
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

    useEffect(() => { if (planProp) setSelectedPlan(planProp); }, [planProp]);
    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'tax_docs');
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id } }));
        } catch (error) { alert("Upload failed"); }
    };
    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = { plan: selectedPlan, formData: formData, documents: docsList, status: "PAYMENT_SUCCESSFUL", paymentDetails: billDetails };
            const response = await submitIncomeTaxReturn(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4">Personal Details</h3>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full p-3 rounded-lg border border-gray-200" />
                        <input type="text" name="pan" value={formData.pan} onChange={handleInputChange} placeholder="PAN" className="w-full p-3 rounded-lg border uppercase border-gray-200" />
                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4">Income Sources</h3>
                        <div><label className="text-sm font-bold block mb-1">Capital Gains (Stocks/MF/Property)?</label><select name="hasCapitalGains" value={formData.hasCapitalGains} onChange={handleInputChange} className="w-full p-3 border rounded-lg"><option value="No">No</option><option value="Yes">Yes</option></select></div>
                        <div><label className="text-sm font-bold block mb-1">Foreign Income/Assets?</label><select name="hasForeignIncome" value={formData.hasForeignIncome} onChange={handleInputChange} className="w-full p-3 border rounded-lg"><option value="No">No</option><option value="Yes">Yes</option></select></div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-navy mb-4">Upload Statements</h3>
                    {['Form 16', 'Capital Gains Stmt (Broker)', 'Bank Statement', 'Property Details'].map((d, i) => (
                        <div key={i} className="border border-dashed p-4 rounded-lg bg-gray-50 flex justify-between items-center"><span className="text-sm">{d}</span><div className="flex items-center gap-2">{uploadedFiles[`doc_${i}`] && <CheckCircle size={16} className="text-bronze" />}<input type="file" onChange={(e) => handleFileUpload(e, `doc_${i}`)} className="text-xs w-24" /></div></div>
                    ))}
                </div>
            );
            case 4:
                return (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-navy mb-4">Confirm Details</h2>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between"><span>Plan</span><span className="font-bold text-navy">{plans[selectedPlan]?.title}</span></div>
                            <div className="flex justify-between"><span>Name</span><span className="font-bold">{formData.fullName}</span></div>
                            <div className="flex justify-between"><span>Form</span><span className="font-bold">ITR-2 Filing</span></div>
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
                        <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">Pay & Submit</button>
                    </div>
                );
        }
    };

    const handleNext = () => setCurrentStep(p => Math.min(5, p + 1));

    if (isModal) {
        return (
            <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
                <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white mb-6">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            ITR-2 Filing
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
                        {['Personal', 'Sources', 'Docs', 'Review', 'Payment'].map((step, i) => (
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
                                    <span className="font-bold text-slate-800 text-sm truncate">ITR-2 Filing</span>
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
                                {currentStep === 1 && "Personal Information"}
                                {currentStep === 2 && "Income Sources"}
                                {currentStep === 3 && "Upload Documents"}
                                {currentStep === 4 && "Review Application"}
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
                                <p className="text-gray-500 mt-2">Order ID: {automationPayload?.submissionId}</p>
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
                            {['Personal', 'Sources', 'Docs', 'Review', 'Payment'].map((s, i) => (
                                <div key={i} className={`p-2 rounded font-bold text-sm ${currentStep === i + 1 ? 'bg-[#043E52] text-white' : 'text-gray-500'}`}>{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-transparent">
                        {isSuccess ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Order ID: {automationPayload?.submissionId}</p>
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
export default Itr2Registration;
