import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, Upload, Calendar, Trash2, Check, FileCheck,
    ArrowLeft, ArrowRight, Zap, Building, Clock,
    Sparkles, AlertCircle, Gavel, ClipboardCheck,
    ShieldCheck, Download, ReceiptText, PieChart,
    IndianRupee, Briefcase, Wallet, History, Layers
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitTaxAudit } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useRazorpay } from '../../../hooks/useRazorpay';
import { useMemo } from 'react';

const TaxAuditRegistration = ({ initialPlan = 'standard', onClose }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(state?.plan || initialPlan);

    const [formData, setFormData] = useState({
        businessName: '',
        pan: '',
        assessmentYear: '2024-2025',
        taxpayerType: 'Business',
        turnoverAmount: '',
        natureOfBusiness: '',
        gstRegistered: 'Yes',
        userEmail: user?.email || '',
        userPhone: user?.mobile || ''
    });

    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const [files, setFiles] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const plansData = {
        basic: { price: 4999, title: 'Turnover < 2Cr' },
        standard: { price: 9999, title: 'Turnover 2-5Cr' },
        premium: { price: 14999, title: 'Turnover 5Cr+' }
    };

    const billDetails = useMemo(() => {
        const p = plansData[selectedPlan] || plansData.standard;
        const basePrice = p.price;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);
        const total = basePrice + platformFee + tax + gst;
        return { basePrice, platformFee, tax, gst, total };
    }, [selectedPlan]);

    const steps = [
        { id: 1, title: 'Tier', icon: Zap },
        { id: 2, title: 'Profile', icon: Building },
        { id: 3, title: 'Evidence', icon: ClipboardCheck },
        { id: 4, title: 'Scrutiny', icon: History },
        { id: 5, title: 'Initialize', icon: Gavel }
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [docName]: file }));
            setUploadProgress(prev => ({ ...prev, [docName]: 100 }));
        }
    };

    const handleSubmit = async () => {
        const email = user?.email || formData.userEmail;
        const phone = user?.mobile || formData.userPhone;

        processPayment({
            amount: billDetails.total,
            description: `Payment for ${plansData[selectedPlan]?.title} - Tax Audit`,
            prefill: {
                name: formData.businessName || "Customer",
                email: email,
                contact: phone
            },
            onSuccess: async (response) => {
                const payload = {
                    submissionId: `AUDIT-${Date.now()}`,
                    plan: selectedPlan,
                    formData: {
                        ...formData,
                        userEmail: email,
                        userPhone: phone
                    },
                    status: "PAYMENT_SUCCESSFUL",
                    paymentDetails: {
                        ...billDetails,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    }
                };

                try {
                    await submitTaxAudit(payload);
                    setCurrentStep(6);
                } catch (error) {
                    console.error("Submission failed", error);
                    alert("Transmission break. Please reconnect and retry.");
                }
            }
        });
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col h-full bg-white font-sans text-navy">
            {/* PROGRESS BAR */}
            <div className="px-12 pt-10 pb-6 bg-slate-50/50 border-b border-slate-100 font-poppins">
                <div className="flex justify-between items-center mb-10 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 rotate-3">
                            <Gavel size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Statutory Audit Portal</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sec 44AB v5.0</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors order-last">
                        <Trash2 size={24} />
                    </button>
                </div>

                <div className="flex justify-between relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                    <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-red-500 -translate-y-1/2 z-0"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></motion.div>

                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= s.id ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-200 text-slate-400 shadow-inner'}`}
                            >
                                {currentStep > s.id ? <Check size={18} /> : <s.icon size={18} />}
                            </motion.div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= s.id ? 'text-red-700' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FORM AREA */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar font-poppins text-left">
                <AnimatePresence mode="wait">
                    {/* STEP 1: TIER */}
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-left">
                            <div className="bg-red-50 border border-red-100 p-8 rounded-[40px] flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-red-950 italic tracking-tighter uppercase">Audit Intensity</h3>
                                    <p className="text-red-700/60 font-medium text-sm tracking-wide">Select threshold based on your annual turnover.</p>
                                </div>
                                <Zap className="text-red-500 animate-pulse" size={40} />
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { id: 'basic', name: 'Turnover < 2Cr', price: 4999, features: ["Form 3CB/3CD", "Standard Scrutiny"] },
                                    { id: 'standard', name: 'Turnover 2-5Cr', price: 9999, features: ["Detailed Verification", "GST Recon Assist"] },
                                    { id: 'premium', name: 'Turnover 5Cr+', price: 14999, features: ["Complex Transactions", "Priority CA Filing"] }
                                ].map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedPlan(p.id)}
                                        className={`p-10 rounded-[45px] border-4 transition-all relative overflow-hidden group cursor-pointer ${selectedPlan === p.id ? 'border-red-500 bg-red-50 shadow-2xl scale-105' : 'border-slate-100 hover:border-red-200'}`}
                                    >
                                        {selectedPlan === p.id && <div className="absolute top-0 right-0 bg-red-500 text-white p-3 rounded-bl-3xl"><CheckCircle size={20} /></div>}
                                        <h4 className={`text-xl font-black mb-1 uppercase italic ${selectedPlan === p.id ? 'text-red-900' : 'text-slate-400'}`}>{p.name}</h4>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-4xl font-black italic tracking-tighter tracking-tighter">₹{p.price.toLocaleString()}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">+ GST</span>
                                        </div>
                                        <div className="space-y-3">
                                            {p.features.map((f, i) => (
                                                <div key={i} className="flex gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><Check size={14} className="text-red-500" /> {f}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PROFILE */}
                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 text-left text-left">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-red-500 pl-6 text-left">Business Architecture</h3>

                            <div className="grid md:grid-cols-2 gap-8 text-left text-left">
                                {(!user) && (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Email Address</label>
                                            <input
                                                name="userEmail"
                                                value={formData.userEmail}
                                                onChange={handleInputChange}
                                                type="email"
                                                placeholder="contact@company.com"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-red-500 transition-all text-lg italic text-left"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Phone Number</label>
                                            <input
                                                name="userPhone"
                                                value={formData.userPhone}
                                                onChange={handleInputChange}
                                                type="tel"
                                                placeholder="9876543210"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-red-500 transition-all text-lg italic text-left"
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="space-y-3 md:col-span-2 text-left text-left text-left text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Legal Entity Name</label>
                                    <div className="relative text-left">
                                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500" size={24} />
                                        <input
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="Company / Firm Name"
                                            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[30px] font-black focus:border-red-500 transition-all text-2xl uppercase italic tracking-widest shadow-inner text-left"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">PAN Number</label>
                                    <div className="relative text-left">
                                        <ReceiptText className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                                        <input
                                            name="pan"
                                            value={formData.pan}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="ABCDE1234F"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-red-500 transition-all text-xl italic uppercase tracking-widest font-mono text-left"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Nature of Business</label>
                                    <div className="relative text-left">
                                        <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                                        <input
                                            name="natureOfBusiness"
                                            value={formData.natureOfBusiness}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="e.g. Retail, Manufacturing"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-red-500 transition-all text-xl italic uppercase tracking-widest text-left"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Annual Turnover (Estimate)</label>
                                    <div className="relative text-left">
                                        <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                                        <input
                                            name="turnoverAmount"
                                            value={formData.turnoverAmount}
                                            onChange={handleInputChange}
                                            type="number"
                                            placeholder="Total Gross Sales"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-red-500 transition-all text-xl italic text-left text-left"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Assessment Year</label>
                                    <div className="relative text-left">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                                        <select
                                            name="assessmentYear"
                                            value={formData.assessmentYear}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-red-500 transition-all text-lg tracking-tight uppercase appearance-none text-left"
                                        >
                                            <option value="2024-2025">AY 2024-2025</option>
                                            <option value="2023-2024">AY 2023-2024</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: EVIDENCE */}
                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-left">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-red-500 pl-6 text-left text-left">Statutory Evidence</h3>

                            <div className="grid md:grid-cols-2 gap-8 text-left text-left">
                                {[
                                    { label: 'Trial Balance (.XLS/PDF)', key: 'trial_balance' },
                                    { label: 'Balance Sheet Draft', key: 'bs_draft' },
                                    { label: 'Profit & Loss Statement', key: 'pl_stmt' },
                                    { label: 'Bank Interest Cert.', key: 'bank_cert' }
                                ].map((doc, i) => (
                                    <div key={i} className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative text-left ${files[doc.key] ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{doc.label}</h4>
                                            {files[doc.key] && <CheckCircle className="text-red-600 animate-bounce" size={20} />}
                                        </div>
                                        <input type="file" id={doc.key} className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                                        <label htmlFor={doc.key} className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                            <Upload size={20} className="text-red-500" />
                                            {files[doc.key] ? files[doc.key].name.substring(0, 20) + '...' : 'Upload Data/File'}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: SCRUTINY */}
                    {currentStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 text-left">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-red-500 pl-6 text-left">Scrutiny Roadmap</h3>

                            <div className="bg-slate-50 rounded-[40px] p-10 space-y-8 text-left">
                                {[
                                    { title: "Books Verification", desc: "Cross-vouching of sales invoices against bank statements for Section 40A(2) compliance.", icon: ClipboardCheck },
                                    { title: "Clause Mapping", desc: "Digital mapping of Tally/ERP heads to Form 3CD clauses 1 to 44.", icon: Layers },
                                    { title: "Statutory Liaising", desc: "Direct consultation with your accountants for justifying specific deductors.", icon: Users },
                                ].map((box, i) => (
                                    <div key={i} className="flex items-start gap-6 group hover:translate-x-2 transition-transform text-left">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-md group-hover:bg-red-600 group-hover:text-white transition-all shrink-0">
                                            <box.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg text-navy uppercase italic tracking-tighter">{box.title}</h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{box.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: INITIALIZE */}
                    {currentStep === 5 && (
                        <motion.div key="step5" initial={{ opacity: 1 }} className="space-y-10 text-center">
                            <div className="space-y-4 font-poppins text-navy text-center">
                                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-[40px] flex items-center justify-center mx-auto -rotate-12 mb-8 shadow-xl border border-red-200">
                                    <ShieldCheck size={48} />
                                </div>
                                <h3 className="text-5xl font-black italic tracking-tighter uppercase font-poppins">Audit Finalization</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-center">Evidence Cycle Verified</p>
                            </div>

                            <div className="bg-navy rounded-[60px] p-12 text-white relative overflow-hidden group shadow-6xl text-left">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                    <Building size={200} />
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 relative z-10 font-poppins">
                                    <div className="space-y-8 text-left">
                                        <div>
                                            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Client Identity</p>
                                            <p className="text-4xl font-black italic tracking-tighter uppercase">{formData.businessName || 'XXXXXXXXXX'}</p>
                                        </div>
                                        <div>
                                            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2 italic text-left">Target Year</p>
                                            <p className="text-2xl font-black italic uppercase tracking-tighter text-left">AY: {formData.assessmentYear}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-3xl rounded-[40px] p-10 flex flex-col justify-center border border-white/10 text-left">
                                        <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Audit Fee (Statutory)</p>
                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="text-7xl font-black italic tracking-tighter tracking-tighter">₹{billDetails.total.toLocaleString()}</span>
                                            <span className="text-red-300 font-bold text-xl uppercase tracking-tighter italic">Inc. Tax</span>
                                        </div>
                                        <div className="w-full h-px bg-white/20 mb-6"></div>
                                        <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest italic text-left">Includes digital signing & portal filing.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SUCCESS */}
                    {currentStep === 6 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-10 text-center">
                            <div className="w-32 h-32 bg-red-600 rounded-[50px] flex items-center justify-center mx-auto text-white shadow-3xl shadow-red-500/40 rotate-12">
                                <Check size={64} strokeWidth={4} />
                            </div>
                            <div className="space-y-4 font-poppins text-center">
                                <h3 className="text-6xl font-black italic tracking-tighter uppercase text-navy font-poppins text-center">Audit Initialized</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.5em] max-w-md mx-auto text-center">Your statutory audit file has been successfully initialized and queued for human verification.</p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-red-600 transition-all shadow-4xl mx-auto">Enter Dashboard</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ACTION FOOTER */}
            {currentStep < 6 && (
                <div className="px-12 py-10 bg-slate-50 flex justify-between items-center border-t border-slate-100 font-poppins">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all ${currentStep === 1 ? 'opacity-0' : 'hover:translate-x-[-5px] text-slate-400 hover:text-navy'}`}
                    >
                        <ArrowLeft size={18} /> Prev Phase
                    </button>

                    <button
                        onClick={currentStep === 5 ? handleSubmit : nextStep}
                        disabled={isPaymentProcessing}
                        className="flex items-center gap-6 px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-red-600 transition-all shadow-2xl group"
                    >
                        {isPaymentProcessing ? 'Authorizing...' : currentStep === 5 ? 'Authorize & Initialize' : 'Next Phase'} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaxAuditRegistration;
