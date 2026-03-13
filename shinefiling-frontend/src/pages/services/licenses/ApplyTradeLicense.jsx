import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Upload, CheckCircle, CreditCard, AlertTriangle,
    FileText, ArrowRight, X, Building, MapPin, Briefcase, Calendar,
    Shield, Check, User
} from 'lucide-react';
import { submitTradeLicense, uploadFile } from '../../../api';
import { useRazorpay } from '../../../hooks/useRazorpay';

const ApplyTradeLicense = ({ isLoggedIn, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const plan = searchParams.get('plan') || 'standard';

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        applicantName: user.fullName || '',
        businessName: '',
        state: '',
        city: '',
        entityType: '',
        natureOfTrade: '',
        commencementDate: '',
        address: '',
        wardNumber: '',
        areaSquareFeet: '',
        isRented: false,
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;
        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/trade-license/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, plan]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'trade-license');
                if (response && response.fileUrl) {
                    setFormData(prev => ({
                        ...prev,
                        uploadedDocuments: [
                            ...prev.uploadedDocuments.filter(d => d.id !== docType),
                            {
                                id: docType,
                                type: docType,
                                filename: response.originalName || file.name,
                                fileUrl: response.fileUrl
                            }
                        ]
                    }));
                }
            } catch (error) {
                console.error("File upload error:", error);
            } finally {
                setUploadingFiles(prev => ({ ...prev, [docType]: false }));
            }
        }
    };

    const { processPayment, isProcessing: isPaymentProcessing } = useRazorpay();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const priceMap = {
            standard: 2999,
            renewal: 1999,
            basic: 499
        };
        const amount = priceMap[plan] || 2999;

        processPayment({
            amount: amount,
            description: `Payment for ${planTitle} - Trade License`,
            prefill: {
                name: user?.fullName || "Customer",
                email: formData.userEmail,
                contact: user?.phone || ''
            },
            onSuccess: async (response) => {
                setLoading(true);
                setError('');
                try {
                    const payload = {
                        submissionId: `TRADE-${Date.now()}`,
                        userEmail: formData.userEmail,
                        userPhone: user?.phone || '',
                        businessName: formData.businessName,
                        state: formData.state,
                        city: formData.city,
                        status: "PAYMENT_SUCCESSFUL",
                        amountPaid: amount,
                        formData: {
                            entityType: formData.entityType,
                            natureOfTrade: formData.natureOfTrade,
                            commencementDate: formData.commencementDate,
                            address: formData.address,
                            wardNumber: formData.wardNumber,
                            areaSquareFeet: parseFloat(formData.areaSquareFeet),
                            isRented: formData.isRented
                        },
                        documents: formData.uploadedDocuments,
                        paymentDetails: {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    };

                    await submitTradeLicense(payload);
                    setCurrentStep(3);
                } catch (err) {
                    setError(err.message || 'Submission failed. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const planPrices = {
        standard: "₹2,999",
        renewal: "₹1,999",
        basic: "₹499"
    };

    const planTitle = plan === 'renewal' ? 'License Renewal' : 'New Trade License';

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white font-poppins overflow-hidden">
            {/* LEFT SIDEBAR: PREMIUM DARK */}
            <div className="hidden md:flex w-96 bg-[#041E32] text-white flex-col p-10 shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-navy/20 rounded-full blur-[80px] -ml-24 -mb-24"></div>

                <div className="relative z-10 mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Building className="text-bronze" size={24} />
                        </div>
                        <h1 className="font-black text-2xl tracking-tighter uppercase italic">Shine<span className="text-bronze">Filing</span></h1>
                    </div>

                    <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl mb-12">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2 px-1">Selected Compliance</p>
                        <h2 className="text-2xl font-black text-white leading-tight mb-6">Trade License<br /><span className="text-bronze">{planTitle}</span></h2>

                        <div className="space-y-4 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Platform Fee</span>
                                <span className="text-white">Included</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-bronze uppercase tracking-[0.2em] pb-1">Professional Fee</span>
                                <span className="text-4xl font-black text-white leading-none">{planPrices[plan]}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROGRESS STEPPER */}
                <div className="flex-1 space-y-4">
                    {[
                        { label: 'Merchant Data', sub: 'Business Identity', icon: User },
                        { label: 'Establishment', sub: 'Location & Area', icon: MapPin },
                        { label: 'Compliance', sub: 'Final Submission', icon: Shield }
                    ].map((step, i) => (
                        <div key={i} className={`flex items-center gap-5 p-5 rounded-3xl transition-all ${currentStep === i + 1 ? 'bg-white/10 text-white shadow-xl translate-x-2' : currentStep > i + 1 ? 'text-green-400 opacity-60' : 'text-gray-500'}`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all ${currentStep === i + 1 ? 'bg-bronze text-white rotate-6 scale-110 shadow-lg shadow-bronze/20' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/5'}`}>
                                {currentStep > i + 1 ? <Check size={18} /> : i + 1}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-widest">{step.label}</span>
                                <span className="text-[9px] font-medium uppercase tracking-[0.1em] opacity-60 mt-0.5">{step.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FBFBFC]">
                {/* Header Bar */}
                <div className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 z-20">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Current Protocol</span>
                        <h2 className="font-black text-navy text-2xl uppercase tracking-tighter">
                            {currentStep === 1 ? "Business Identity" : currentStep === 2 ? "Filing Documents" : "Payment Verification"}
                        </h2>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-12">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto space-y-10">
                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-10 flex items-center gap-3">
                                        <Briefcase size={20} className="text-bronze" /> Business Structure & Core Details
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Operational Business Name</label>
                                            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="e.g. Acme Retail Solutions" className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:border-bronze/30 outline-none transition-all" />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Legal Entity Type</label>
                                            <select name="entityType" value={formData.entityType} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:border-bronze/30 outline-none transition-all appearance-none cursor-pointer">
                                                <option value="">Select Type</option>
                                                <option value="Proprietorship">Proprietorship</option>
                                                <option value="Partnership">Partnership</option>
                                                <option value="Private Limited">Private Limited</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nature of Trade</label>
                                            <input type="text" name="natureOfTrade" value={formData.natureOfTrade} onChange={handleChange} placeholder="e.g. Retail Store / Software House" className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:border-bronze/30 outline-none transition-all" />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">State of Operation</label>
                                            <select name="state" value={formData.state} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:border-bronze/30 outline-none transition-all appearance-none cursor-pointer">
                                                <option value="">Select State</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Karnataka">Karnataka</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Telangana">Telangana</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">City / Municipality</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City Name" className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:border-bronze/30 outline-none transition-all" />
                                        </div>

                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Premises Full Address</label>
                                            <textarea name="address" rows="3" value={formData.address} onChange={handleChange} placeholder="Complete physical address..." className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:border-bronze/30 outline-none transition-all resize-none"></textarea>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Establishment Area (Sq.Ft)</label>
                                            <input type="number" name="areaSquareFeet" value={formData.areaSquareFeet} onChange={handleChange} placeholder="e.g. 1500" className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:border-bronze/30 outline-none transition-all" />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Commencement Date</label>
                                            <div className="relative">
                                                <input type="date" name="commencementDate" value={formData.commencementDate} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:border-bronze/30 outline-none transition-all cursor-pointer" />
                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 pt-4">
                                            <label className="flex items-center gap-4 cursor-pointer group">
                                                <div className="relative">
                                                    <input type="checkbox" name="isRented" checked={formData.isRented} onChange={handleChange} className="sr-only" />
                                                    <div className={`w-6 h-6 rounded-lg border-2 transition-all ${formData.isRented ? 'bg-bronze border-bronze shadow-lg shadow-bronze/20' : 'bg-slate-50 border-slate-200'}`}>
                                                        {formData.isRented && <Check size={16} className="text-white mx-auto" />}
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 group-hover:text-navy transition-colors tracking-tight uppercase tracking-widest text-xs">Premises is Rented?</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto space-y-10">
                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-10 flex items-center gap-3">
                                        <Upload size={20} className="text-bronze" /> Mandatory Verification Documents
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {['PAN Card', 'Aadhaar Card', 'Property Tax Receipt', 'Address Proof'].map((doc, i) => {
                                            const docTypeI = doc.toUpperCase().replace(/ /g, '_');
                                            const uploadedDoc = formData.uploadedDocuments.find(d => d.type === docTypeI);

                                            return (
                                                <div key={i} className={`relative p-8 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-5 ${uploadedDoc ? 'bg-green-50/50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-bronze/50 group'}`}>
                                                    <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center ${uploadedDoc ? 'text-green-500' : 'text-slate-400 group-hover:text-bronze'}`}>
                                                        {uploadedDoc ? <CheckCircle size={32} /> : <FileText size={32} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-navy mb-1">{doc}</h4>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">Scanned Copy (Max 2MB)</p>
                                                    </div>
                                                    <label className="cursor-pointer">
                                                        <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${uploadedDoc ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-navy text-white hover:bg-black'}`}>
                                                            {uploadingFiles[docTypeI] ? 'Uploading...' : uploadedDoc ? 'Change File' : 'Browse File'}
                                                        </span>
                                                        <input type="file" className="hidden" disabled={uploadingFiles[docTypeI]} onChange={(e) => handleFileChange(docTypeI, e)} />
                                                    </label>
                                                </div>
                                            );
                                        })}

                                        {formData.isRented && (
                                            <div className={`relative p-8 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-5 ${formData.uploadedDocuments.find(d => d.id === 'RENT_AGREEMENT') ? 'bg-green-50/50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-bronze/50 group'}`}>
                                                <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center ${formData.uploadedDocuments.find(d => d.id === 'RENT_AGREEMENT') ? 'text-green-500' : 'text-slate-400 group-hover:text-bronze'}`}>
                                                    {formData.uploadedDocuments.find(d => d.id === 'RENT_AGREEMENT') ? <CheckCircle size={32} /> : <FileText size={32} />}
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-navy mb-1">Rent agreement / noc</h4>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">Clear Scanned PDF/Image</p>
                                                </div>
                                                <label className="cursor-pointer">
                                                    <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${uploadingFiles['RENT_AGREEMENT'] ? 'Uploading...' : formData.uploadedDocuments.find(d => d.id === 'RENT_AGREEMENT') ? 'Change File' : 'Browse File'}`}>
                                                        {uploadingFiles['RENT_AGREEMENT'] ? 'Uploading...' : formData.uploadedDocuments.find(d => d.id === 'RENT_AGREEMENT') ? 'Change File' : 'Browse File'}
                                                    </span>
                                                    <input type="file" className="hidden" disabled={uploadingFiles['RENT_AGREEMENT']} onChange={(e) => handleFileChange('RENT_AGREEMENT', e)} />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center py-12">
                                <div className="w-24 h-24 bg-green-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-green-500 shadow-xl shadow-green-500/10 rotate-3">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-4xl font-black text-navy uppercase tracking-tighter mb-6">Filing Recorded!</h2>
                                <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                                    Your application for <span className="text-navy font-bold">{formData.businessName}</span> has been processed. Final payment is required to initiate department liaison.
                                </p>

                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl mb-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Professional Charge</p>
                                    <p className="text-5xl font-black text-navy tracking-tighter mb-2">{planPrices[plan]}</p>
                                    <p className="text-[10px] font-bold text-bronze uppercase tracking-widest">+ Municipal Govt Fees</p>
                                </div>

                                <button onClick={() => navigate('/dashboard')} className="w-full py-5 bg-navy text-white font-black rounded-[2rem] shadow-2xl shadow-navy/20 hover:bg-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs">
                                    <CreditCard size={20} /> Complete Payment
                                </button>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-6 opacity-60 italic">Encrypted Secure Transaction</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                {currentStep < 3 && (
                    <div className="h-24 bg-white border-t border-gray-100 flex items-center justify-between px-12 shrink-0 z-20">
                        <button
                            onClick={() => currentStep === 1 ? navigate(-1) : setCurrentStep(1)}
                            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-all"
                        >
                            <ArrowLeft size={18} /> {currentStep === 1 ? 'Go Back' : 'Identity Step'}
                        </button>

                        <div className="flex items-center gap-8">
                            {error && <span className="text-xs font-bold text-red-500 animate-pulse">{error}</span>}
                            <button
                                onClick={(e) => currentStep === 1 ? setCurrentStep(2) : handleSubmit(e)}
                                disabled={loading || isPaymentProcessing}
                                className="px-10 py-4 bg-navy text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-navy/20 hover:bg-black hover:-translate-y-1 transition-all flex items-center gap-3"
                            >
                                {loading || isPaymentProcessing ? (currentStep === 1 ? 'Next Phase' : 'Processing Payment...') : currentStep === 1 ? 'Next Phase' : 'Apply Now'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyTradeLicense;
