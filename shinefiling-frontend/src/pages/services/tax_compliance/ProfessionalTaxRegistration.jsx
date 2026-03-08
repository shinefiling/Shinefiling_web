
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, Upload, Calendar, Trash2, Check, FileCheck,
    ArrowLeft, ArrowRight, Zap, Building, Clock,
    Sparkles, AlertCircle, MapPin, ReceiptText,
    ShieldCheck, Download, Users, Landmark,
    IndianRupee, Briefcase, Wallet, History, Layers
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitProfessionalTax } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const ProfessionalTaxRegistration = ({ initialPlan = 'standard', onClose }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(state?.plan || initialPlan);

    const [formData, setFormData] = useState({
        employerName: '',
        pan: '',
        registrationState: 'Maharashtra',
        entityType: 'Private Limited',
        employeeCount: '',
        employmentStartDate: '',
        totalSalaryPayout: '',
        registrationType: 'Both (PTEC & PTRC)'
    });

    const [files, setFiles] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const steps = [
        { id: 1, title: 'Scope', icon: Zap },
        { id: 2, title: 'Identity', icon: Building },
        { id: 3, title: 'Payroll', icon: Users },
        { id: 4, title: 'Vault', icon: Upload },
        { id: 5, title: 'Finalize', icon: CreditCard }
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
        const payload = {
            submissionId: `PT-${Date.now()}`,
            plan: selectedPlan,
            formData: formData,
            status: "PAYMENT_SUCCESSFUL"
        };

        try {
            await submitProfessionalTax(payload);
            setCurrentStep(6);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Transmission break. Please reconnect and retry.");
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col h-full bg-white font-sans text-navy">
            {/* PROGRESS BAR */}
            <div className="px-12 pt-10 pb-6 bg-slate-50/50 border-b border-slate-100 font-poppins text-left">
                <div className="flex justify-between items-center mb-10 text-left">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 rotate-3">
                            <MapPin size={24} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-left">Professional Tax Shield</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-left">Regional Compliance v2.2</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors order-last">
                        <Trash2 size={24} />
                    </button>
                </div>

                <div className="flex justify-between relative px-4 text-left">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                    <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-amber-500 -translate-y-1/2 z-0"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></motion.div>

                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3 text-left">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= s.id ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-slate-200 text-slate-400 shadow-inner'}`}
                            >
                                {currentStep > s.id ? <Check size={18} /> : <s.icon size={18} />}
                            </motion.div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= s.id ? 'text-amber-700' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FORM AREA */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar font-poppins text-left">
                <AnimatePresence mode="wait">
                    {/* STEP 1: SCOPE */}
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-left">
                            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] flex items-center justify-between text-left">
                                <div className="space-y-1 text-left">
                                    <h3 className="text-3xl font-black text-amber-950 italic tracking-tighter uppercase text-left">Compliance Scope</h3>
                                    <p className="text-amber-700/60 font-medium text-sm tracking-wide text-left">Select your registration mandate for state leveling.</p>
                                </div>
                                <Zap className="text-amber-500 animate-pulse" size={40} />
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 text-left">
                                {[
                                    { id: 'basic', name: 'Registration', price: 1999, features: ["PTEC/PTRC Allocation", "Digital Verification"] },
                                    { id: 'standard', name: 'Reg + Filing', price: 3999, features: ["Registration Support", "1 Year Annual Returns"] },
                                    { id: 'premium', name: 'Advance', price: 5999, features: ["Multi-State Ready", "Legal Support Desk"] }
                                ].map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedPlan(p.id)}
                                        className={`p-10 rounded-[45px] border-4 transition-all relative overflow-hidden group cursor-pointer text-left ${selectedPlan === p.id ? 'border-amber-500 bg-amber-50 shadow-2xl scale-105' : 'border-slate-100 hover:border-amber-200'}`}
                                    >
                                        {selectedPlan === p.id && <div className="absolute top-0 right-0 bg-amber-500 text-white p-3 rounded-bl-3xl"><CheckCircle size={20} /></div>}
                                        <h4 className={`text-xl font-black mb-1 uppercase italic ${selectedPlan === p.id ? 'text-amber-900' : 'text-slate-400'} text-left`}>{p.name}</h4>
                                        <div className="flex items-baseline gap-1 mb-8 text-left">
                                            <span className="text-4xl font-black text-left italic tracking-tighter">₹{p.price.toLocaleString()}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-left">+ GST</span>
                                        </div>
                                        <div className="space-y-3 text-left">
                                            {p.features.map((f, i) => (
                                                <div key={i} className="flex gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest text-left"><Check size={14} className="text-amber-500" /> {f}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: IDENTITY */}
                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 text-left">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6 text-left">Employer Identification</h3>

                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                <div className="space-y-3 md:col-span-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Legal Employer Name</label>
                                    <div className="relative text-left">
                                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={24} />
                                        <input
                                            name="employerName"
                                            value={formData.employerName}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="As per PAN Card"
                                            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[30px] font-black focus:border-amber-500 transition-all text-2xl uppercase italic tracking-widest shadow-inner text-left"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 text-left text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Entity PAN Number</label>
                                    <div className="relative text-left">
                                        <ReceiptText className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <input
                                            name="pan"
                                            value={formData.pan}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="ABCDE1234F"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-xl italic uppercase tracking-widest font-mono text-left"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Registration State</label>
                                    <div className="relative text-left">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <select
                                            name="registrationState"
                                            value={formData.registrationState}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-lg tracking-tight uppercase appearance-none text-left"
                                        >
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="West Bengal">West Bengal</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Gujarat">Gujarat</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Entity Constitution</label>
                                    <div className="relative text-left text-left">
                                        <Landmark className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <select
                                            name="entityType"
                                            value={formData.entityType}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-lg tracking-tight uppercase appearance-none text-left"
                                        >
                                            <option value="Private Limited">Private Limited</option>
                                            <option value="Proprietorship">Proprietorship</option>
                                            <option value="LLP">LLP / Firm</option>
                                            <option value="OPC">One Person Company</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left text-left">Business Start Date</label>
                                    <div className="relative text-left">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <input
                                            name="employmentStartDate"
                                            value={formData.employmentStartDate}
                                            onChange={handleInputChange}
                                            type="date"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-lg uppercase text-left"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: PAYROLL */}
                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-left">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6 text-left">Payroll Matrix</h3>

                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left text-left">Employee Strength (PTRC)</label>
                                    <div className="relative text-left">
                                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <input
                                            name="employeeCount"
                                            value={formData.employeeCount}
                                            onChange={handleInputChange}
                                            type="number"
                                            placeholder="Total Staff"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-xl italic text-left"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Est. Monthly Salary Payout (₹)</label>
                                    <div className="relative text-left">
                                        <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <input
                                            name="totalSalaryPayout"
                                            value={formData.totalSalaryPayout}
                                            onChange={handleInputChange}
                                            type="number"
                                            placeholder="Total Gross Payroll"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-xl italic text-left"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic text-left">Registration Mandate</label>
                                    <div className="grid grid-cols-3 gap-4 text-left">
                                        {['PTEC Only', 'PTRC Only', 'Both (PTEC & PTRC)'].map(opt => (
                                            <button key={opt} onClick={() => setFormData({ ...formData, registrationType: opt })} className={`py-5 rounded-3xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.registrationType === opt ? 'bg-amber-600 border-amber-600 text-white shadow-xl rotate-1' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-amber-300'}`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: VAULT */}
                    {currentStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 text-left">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6 text-left">Compliance Vault</h3>

                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                {[
                                    { label: 'COI / Partnership Deed', key: 'corp_proof' },
                                    { label: 'Entity PAN Card Scan', key: 'pan_scan' },
                                    { label: 'Premises Proof (Utility)', key: 'addr_proof' },
                                    { label: 'Auth. Signatory ID', key: 'auth_id' }
                                ].map((doc, i) => (
                                    <div key={i} className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative text-left ${files[doc.key] ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-300'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{doc.label}</h4>
                                            {files[doc.key] && <CheckCircle className="text-amber-600 animate-bounce" size={20} />}
                                        </div>
                                        <input type="file" id={doc.key} className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                                        <label htmlFor={doc.key} className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                            <Upload size={20} className="text-amber-500" />
                                            {files[doc.key] ? files[doc.key].name.substring(0, 20) + '...' : 'Upload Doc'}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: REVIEW */}
                    {currentStep === 5 && (
                        <motion.div key="step5" initial={{ opacity: 1 }} className="space-y-10 text-center text-left">
                            <div className="space-y-4 font-poppins text-navy text-center">
                                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[40px] flex items-center justify-center mx-auto -rotate-12 mb-8 shadow-xl border border-amber-200">
                                    <ShieldCheck size={48} />
                                </div>
                                <h3 className="text-5xl font-black italic tracking-tighter uppercase font-poppins text-center">Protocol Authorization</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-center">Registration Cycle Ready</p>
                            </div>

                            <div className="bg-navy rounded-[60px] p-12 text-white relative overflow-hidden group shadow-6xl text-left">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                    <History size={200} />
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 relative z-10 font-poppins text-left">
                                    <div className="space-y-8 text-left">
                                        <div className="text-left">
                                            <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 italic text-left">Legal Profile</p>
                                            <p className="text-3xl font-black italic tracking-tighter uppercase text-left">{formData.employerName || 'XXXXXXXXXX'}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 italic text-left">Mandate Scope</p>
                                            <p className="text-2xl font-black italic uppercase tracking-tighter text-left">{formData.registrationType} | {formData.registrationState}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-3xl rounded-[40px] p-10 flex flex-col justify-center border border-white/10 text-left">
                                        <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 italic text-left">Statutory Fee</p>
                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="text-7xl font-black italic tracking-tighter text-left">₹{(selectedPlan === 'basic' ? 1999 : selectedPlan === 'standard' ? 3999 : 5999).toLocaleString()}</span>
                                            <span className="text-amber-300 font-bold text-xl uppercase tracking-tighter italic text-left">+ GST</span>
                                        </div>
                                        <div className="w-full h-px bg-white/20 mb-6"></div>
                                        <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest italic text-left">Includes state portal setup & certificate issue.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SUCCESS */}
                    {currentStep === 6 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-10 text-center">
                            <div className="w-32 h-32 bg-amber-600 rounded-[50px] flex items-center justify-center mx-auto text-white shadow-3xl shadow-amber-500/40 rotate-12">
                                <Check size={64} strokeWidth={4} />
                            </div>
                            <div className="space-y-4 font-poppins text-center">
                                <h3 className="text-6xl font-black italic tracking-tighter uppercase text-navy font-poppins text-center">Registration Sent</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.5em] max-w-md mx-auto text-center">Your Professional Tax registration request has been successfully transmitted for state portal processing.</p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-amber-600 transition-all shadow-4xl mx-auto">Enter Dashboard</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ACTION FOOTER */}
            {currentStep < 6 && (
                <div className="px-12 py-10 bg-slate-50 flex justify-between items-center border-t border-slate-100 font-poppins text-left">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all ${currentStep === 1 ? 'opacity-0' : 'hover:translate-x-[-5px] text-slate-400 hover:text-navy'}`}
                    >
                        <ArrowLeft size={18} /> Prev Stage
                    </button>

                    <button
                        onClick={currentStep === 5 ? handleSubmit : nextStep}
                        className="flex items-center gap-6 px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-amber-600 transition-all shadow-2xl group"
                    >
                        {currentStep === 5 ? 'Authorize & Register' : 'Next Stage'} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfessionalTaxRegistration;
