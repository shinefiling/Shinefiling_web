
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, PieChart, Calendar, X
} from 'lucide-react';
import { uploadFile, submitGstMonthlyReturn } from '../../../api';

const GstMonthlyReturnRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/gst-monthly-return/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['nil', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        gstin: '',
        filingMonth: 'April',
        filingYear: '2024-25',
        isNilReturn: selectedPlan === 'nil',
        turnoverAmount: '',
        totalInvoices: '',
        wantsReconciliation: selectedPlan === 'premium'
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        nil: { price: 499, title: 'NIL Return', features: ["No Sales/Purchase", "Zero Tax Liability"], color: 'bg-white border-slate-200' },
        standard: { price: 999, title: 'Standard Return', features: ["GSTR-1 & 3B", "Invoice Matching"], recommended: true, color: 'bg-indigo-50 border-indigo-200' },
        premium: { price: 1999, title: 'Premium Return', features: ["100% 2B Reconciliation", "CA Review"], color: 'bg-purple-50 border-purple-200' }
    };

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.standard;
        const basePrice = plan.price;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);
        const total = basePrice + platformFee + tax + gst;
        return { base: basePrice, platformFn: platformFee, tax: tax, gst: gst, total: total };
    }, [selectedPlan]);

    useEffect(() => {
        if (planProp) setSelectedPlan(validatePlan(planProp));
        setFormData(prev => ({ ...prev, isNilReturn: selectedPlan === 'nil' }));
    }, [planProp, selectedPlan]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.gstin) { newErrors.gstin = "GSTIN is required"; isValid = false; }
            if (!formData.filingMonth) { newErrors.filingMonth = "Month is required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(4, prev + 1));
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'gst_docs');
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id } }));
        } catch (error) { alert("Upload failed"); }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = { plan: selectedPlan, formData: formData, documents: docsList, status: "PAYMENT_SUCCESSFUL" };
            const response = await submitGstMonthlyReturn(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} /> FILING PERIOD</h3>
                            <div className="space-y-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">GSTIN Number</label><input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className={`w-full p-3 rounded-lg border uppercase ${errors.gstin ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">Month</label><select name="filingMonth" value={formData.filingMonth} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">{['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">Year</label><select name="filingYear" value={formData.filingYear} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200"><option>2024-25</option><option>2025-26</option></select></div>
                                </div>
                            </div>
                        </div>
                        {selectedPlan !== 'nil' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-navy mb-4">TURNOVER DETAILS</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">Est. Turnover</label><input type="text" name="turnoverAmount" value={formData.turnoverAmount} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" placeholder="e.g. 5,00,000" /></div>
                                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">Total Invoices</label><input type="number" name="totalInvoices" value={formData.totalInvoices} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" placeholder="e.g. 15" /></div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Upload Sales/Purchase Data</h3>
                            {selectedPlan === 'nil' ? <div className="text-center p-8 bg-green-50 rounded-lg text-green-700">No documents required for NIL Return.</div> :
                                ['Sales Register (Excel/JSON)', 'Purchase Register (Excel/JSON)', 'Bank Statement'].map((doc, i) => (
                                    <div key={i} className="border border-dashed p-4 rounded-lg bg-gray-50 flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">{doc}</span>
                                        <div className="flex items-center gap-2">{uploadedFiles[`doc_${i}`] && <CheckCircle size={16} className="text-bronze" />}<input type="file" onChange={(e) => handleFileUpload(e, `doc_${i}`)} className="text-xs w-24" /></div>
                                    </div>
                                ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-4">Review Filing</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="font-bold font-mono uppercase text-navy">{plans[selectedPlan].title}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">GSM</span><span className="font-bold uppercase">{formData.filingMonth}</span></div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-gray-200 text-left space-y-2">
                            <div className="flex justify-between text-sm"><span>Base Fee</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-[#043E52] text-white rounded-xl font-bold transition">{isSubmitting ? 'Processing...' : 'Pay & Submit'}</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? <div className="text-center bg-white p-12 rounded-3xl shadow-xl"><CheckCircle size={48} className="text-slate mx-auto mb-4" /><h1 className="text-3xl font-bold text-navy mb-4">Filing Submitted!</h1><p className="mb-8">Order ID: {automationPayload?.submissionId}</p><button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-navy text-white px-8 py-3 rounded-xl font-bold">Dashboard</button></div> :
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                            {['Period & GSTIN', 'Data Upload', 'Review', 'Payment'].map((step, i) => (
                                <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'opacity-60 cursor-pointer'}`} onClick={() => currentStep > i + 1 && setCurrentStep(i + 1)}>
                                    <span className="font-bold text-sm text-navy">{step}</span>
                                    {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                </div>
                            ))}
                        </div>
                        <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan].color} sticky top-24`}>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Plan Details</div>
                            <div className="text-2xl font-bold text-gray-800 mb-4">{plans[selectedPlan].title}</div>
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between text-xs"><span className="text-gray-500">Service Fee</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                                <div className="flex justify-between text-xs"><span className="text-gray-500">Govt Fee & Taxes</span><span className="font-bold">₹{(billDetails.total - billDetails.base).toLocaleString()}</span></div>
                                <div className="h-px bg-gray-100 my-2"></div>
                                <div className="flex justify-between items-end"><span className="text-[10px] font-bold text-navy uppercase">Total</span><span className="text-xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        {!isSuccess && currentStep < 4 && (
                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default GstMonthlyReturnRegistration;
