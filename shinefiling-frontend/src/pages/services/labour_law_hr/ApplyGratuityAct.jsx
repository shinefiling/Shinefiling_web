import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Shield, AlertCircle, X, IndianRupee } from 'lucide-react';
import { uploadFile, submitGratuityAct } from '../../../api';

const ApplyGratuityAct = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});
    const [eligibilityWarning, setEligibilityWarning] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        businessName: '',
        establishmentType: 'COMPANY',
        dateOfCommencement: '',
        employeeCount: '',
        state: 'MAHARASHTRA',
        labourOfficeJurisdiction: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        pincode: '',
        employerName: '',
        employerDesignation: '',
        hasFactoryLicense: false,
        hasShopActLicense: false,
        uploadedDocuments: []
    });

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour-law/gratuity-act/apply` } });
        }
    }, [isLoggedIn, navigate, isModal]);

    useEffect(() => {
        if (formData.employeeCount) {
            const count = parseInt(formData.employeeCount);
            if (count < 10) {
                setEligibilityWarning('⚠️ Gratuity Act registration requires minimum 10 employees. Your application may be rejected.');
            } else {
                setEligibilityWarning('');
            }
        }
    }, [formData.employeeCount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'gratuity-act');
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
                } else {
                    alert('Upload failed. Please try again.');
                }
            } catch (error) {
                console.error("File upload error:", error);
                alert('Error uploading file.');
            } finally {
                setUploadingFiles(prev => ({ ...prev, [docType]: false }));
            }
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                submissionId: `GRA-${Date.now()}`,
                userEmail: formData.userEmail,
                businessName: formData.businessName,
                status: "PAYMENT_SUCCESSFUL",
                formData: { ...formData },
                documents: formData.uploadedDocuments
            };

            await submitGratuityAct(payload);
            setCurrentStep(3);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stepContent = (
        <AnimatePresence mode="wait">
            {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#2B3446] mb-2 uppercase tracking-tight">Establishment Details</h2>
                    <p className="text-slate-500 mb-8 font-medium">As per Payment of Gratuity Act, 1972.</p>

                    {eligibilityWarning && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                            <AlertCircle size={20} className="text-yellow-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-yellow-800 font-bold">{eligibilityWarning}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Business Name *</label>
                                <input type="text" name="businessName" value={formData.businessName} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Establishment Type *</label>
                                <select name="establishmentType" value={formData.establishmentType} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg outline-none cursor-pointer font-bold">
                                    <option value="COMPANY">Company</option>
                                    <option value="LLP">LLP</option>
                                    <option value="FACTORY">Factory</option>
                                    <option value="SHOP">Shop & Establishment</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Date of Commencement *</label>
                                <input type="date" name="dateOfCommencement" value={formData.dateOfCommencement} required className="w-full p-3 border border-slate-200 rounded-lg outline-none font-bold" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Total Employee Count *</label>
                                <input type="number" name="employeeCount" value={formData.employeeCount} required min="1" className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} placeholder="Minimum 10 required" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">State *</label>
                                <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg outline-none font-bold cursor-pointer">
                                    <option value="MAHARASHTRA">Maharashtra</option>
                                    <option value="KARNATAKA">Karnataka</option>
                                    <option value="TAMIL_NADU">Tamil Nadu</option>
                                    <option value="DELHI">Delhi</option>
                                    <option value="GUJARAT">Gujarat</option>
                                    <option value="WEST_BENGAL">West Bengal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Labour Office Jurisdiction</label>
                                <input type="text" name="labourOfficeJurisdiction" value={formData.labourOfficeJurisdiction} className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} placeholder="e.g. Mumbai Central" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Address Line 1 *</label>
                            <input type="text" name="addressLine1" value={formData.addressLine1} required className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Address Line 2</label>
                                <input type="text" name="addressLine2" value={formData.addressLine2} className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">City *</label>
                                <input type="text" name="city" value={formData.city} required className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Pincode *</label>
                                <input type="text" name="pincode" value={formData.pincode} required pattern="[0-9]{6}" className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} placeholder="6 digits" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button onClick={() => setCurrentStep(2)} disabled={!formData.businessName || !formData.dateOfCommencement} className="w-full py-4 bg-red-600 text-white font-black rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50">
                                Next Step <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#2B3446] mb-2 uppercase tracking-tight">Upload Documents</h2>
                    <p className="text-slate-500 mb-8 font-medium">Upload all mandatory documents for registration.</p>

                    <div className="space-y-4 mb-8">
                        {[
                            { id: 'COI', label: 'Certificate of Incorporation *' },
                            { id: 'PAN', label: 'PAN Card of Establishment *' },
                            { id: 'ADDRESS_PROOF', label: 'Address Proof *' },
                            { id: 'EMPLOYER_ID', label: 'Employer ID Proof *' }
                        ].map((doc, i) => {
                            const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                            return (
                                <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-green-200 text-green-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                            {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                        </div>
                                        <div>
                                            <span className="font-black text-xs block text-navy uppercase tracking-tight">{doc.label}</span>
                                            {uploadedDoc && <span className="text-[10px] text-green-600 font-bold truncate max-w-[150px] inline-block">{uploadedDoc.filename}</span>}
                                        </div>
                                    </div>
                                    <label className="cursor-pointer">
                                        <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${uploadedDoc ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                            {uploadingFiles[doc.id] ? '...' : uploadedDoc ? 'Change' : 'Upload'}
                                        </span>
                                        <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileChange(doc.id, e)} />
                                    </label>
                                </div>
                            );
                        })}
                    </div>

                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-xs font-bold mb-6 border border-red-200 flex items-center gap-2"><AlertTriangle size={16} /> {error}</div>}

                    <div className="flex gap-4">
                        <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black rounded-xl hover:bg-slate-50 transition uppercase text-sm">Back</button>
                        <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-red-600 text-white font-black rounded-xl shadow-lg hover:bg-red-700 transition flex justify-center items-center uppercase text-sm tracking-widest">
                            {loading ? 'Processing...' : 'Submit Application'}
                        </button>
                    </div>
                </motion.div>
            )}

            {currentStep === 3 && (
                <motion.div key="step3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6 shadow-inner">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-navy mb-4 uppercase tracking-tighter">Application Submitted!</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
                        We've received your Gratuity Act registration application for <strong>{formData.businessName}</strong>. Our team will file the application with the Labour Department.
                    </p>

                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8 max-w-xs mx-auto shadow-sm">
                        <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest font-black">Service Fee</p>
                        <p className="text-5xl font-black text-navy uppercase">₹2,999</p>
                    </div>

                    {isModal ? (
                        <button onClick={onClose} className="w-full max-w-xs py-4 bg-red-600 text-white font-black rounded-xl shadow-lg hover:bg-black transition uppercase tracking-widest mx-auto">
                            Close Window
                        </button>
                    ) : (
                        <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-navy text-white font-black rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2 mx-auto uppercase tracking-widest">
                            <CreditCard size={18} /> Go to Dashboard
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* Sidebar */}
                <div className="w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight">
                            <span className="text-red-400">Gratuity Act</span>
                        </h1>
                        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm space-y-2">
                            <div>
                                <p className="text-[10px] uppercase text-blue-200 tracking-wider mb-1">Service Type</p>
                                <p className="font-bold text-white leading-tight">Registration</p>
                            </div>
                            <div className="pt-2 border-t border-white/10 space-y-1">
                                <div className="flex justify-between text-xs text-blue-200">
                                    <span>Service Fee</span>
                                    <span>₹2,999</span>
                                </div>
                                <div className="flex justify-between text-xs text-blue-200">
                                    <span>Govt Fees</span>
                                    <span>Extra</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-white/10 flex justify-between items-end">
                                <span className="text-xs font-bold text-white">Total</span>
                                <p className="text-[#ED6E3F] font-bold text-lg leading-none">₹2,999</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Establishment', 'Documents', 'Success'].map((s, i) => (
                            <div key={i} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                    {currentStep > i + 1 ? <CheckCircle size={12} /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${currentStep === i + 1 ? 'text-white font-bold' : ''}`}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">{['Establishment Details', 'Upload Documents', 'Application Submitted'][currentStep - 1]}</h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition"><X size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {stepContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF5F5] font-sans pt-24 pb-24 px-4">
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#dc2626] text-white py-6 px-6 shadow-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-red-200 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Shield size={20} className="text-red-300" /> Gratuity Act Registration</h1>
                    <div />
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 border border-red-100">
                <div className="mb-8 flex items-center justify-between relative px-2">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-red-200 z-0"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all relative z-10 ${currentStep >= s ? 'bg-red-600 text-white shadow-lg' : 'bg-white border-2 border-red-200 text-red-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>
                {stepContent}
            </div>
        </div>
    );
};

export default ApplyGratuityAct;
