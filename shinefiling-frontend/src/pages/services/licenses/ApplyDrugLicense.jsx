import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Pill, Thermometer } from 'lucide-react';
import { uploadFile, submitDrugLicense } from '../../../api'; // ensure in api.js

const ApplyDrugLicense = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const plan = searchParams.get('plan') || 'standard';

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data form local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        businessName: '',
        state: '',
        licenseType: 'RETAIL', // RETAIL, WHOLESALE, BOTH

        // Form Data
        entityType: '',
        premisesAddress: '',
        areaInSqMeters: '',
        hasColdStorage: false,
        pharmacistName: '',
        pharmacistRegNo: '',
        pharmacistQualification: '',
        isAllopathic: true,
        isHomeopathic: false,

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/drug-license/apply?plan=${plan}` } });
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
                const response = await uploadFile(file, 'drug-license');
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
        e.preventDefault();
        setLoading(true);
        setError('');

        // Client Side Validation for Area
        const area = parseFloat(formData.areaInSqMeters);
        if (formData.licenseType === 'RETAIL' && area < 10) {
            setError("Retail License requires minimum 10 Sq. Meters area.");
            setLoading(false);
            return;
        }
        if (formData.licenseType === 'WHOLESALE' && area < 10) {
            setError("Wholesale License requires minimum 10 Sq. Meters area.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                submissionId: `DRUG-${Date.now()}`,
                userEmail: formData.userEmail,
                businessName: formData.businessName,
                state: formData.state,
                licenseType: formData.licenseType,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    entityType: formData.entityType,
                    premisesAddress: formData.premisesAddress,
                    areaInSqMeters: area,
                    hasColdStorage: formData.hasColdStorage,
                    pharmacistName: formData.pharmacistName,
                    pharmacistRegNo: formData.pharmacistRegNo,
                    pharmacistQualification: formData.pharmacistQualification,
                    isAllopathic: formData.isAllopathic,
                    isHomeopathic: formData.isHomeopathic
                },
                documents: formData.uploadedDocuments
            };

            await submitDrugLicense(payload);
            setCurrentStep(3); // Success
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0FDF4] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#2B3446] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Pill size={20} className="text-green-400" /> Drug License Application</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-[#2B3446] text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Pharmacy Details</h2>
                            <p className="text-slate-500 mb-8">Enter premises and pharmacist details.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                                        <input type="text" name="businessName" value={formData.businessName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">License Type</label>
                                        <select name="licenseType" value={formData.licenseType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="RETAIL">Retail (Medical Store)</option>
                                            <option value="WHOLESALE">Wholesale (Distributor)</option>
                                            <option value="BOTH">Both (Retail + Wholesale)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">entity Type</label>
                                        <select name="entityType" value={formData.entityType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="">Select</option>
                                            <option value="Proprietorship">Proprietorship</option>
                                            <option value="Partnership">Partnership</option>
                                            <option value="Private Limited">Private Limited</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="">Select State</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Gujarat">Gujarat</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Premises Address</label>
                                    <textarea name="premisesAddress" rows="2" value={formData.premisesAddress} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange}></textarea>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Carpet Area (Sq. Meters)</label>
                                        <input type="number" step="0.1" name="areaInSqMeters" value={formData.areaInSqMeters} required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Min 10 Sq.m" onChange={handleChange} />
                                    </div>
                                    <div className="flex items-center p-3 mt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="hasColdStorage" checked={formData.hasColdStorage} onChange={handleChange} className="w-5 h-5 text-green-600" />
                                            <span className="font-bold text-slate-700 text-sm">Refrigerator Available?</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <h4 className="font-bold text-green-800 mb-4 text-sm uppercase tracking-wide">Technical Staff (Pharmacist / Competent Person)</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <input type="text" name="pharmacistName" value={formData.pharmacistName} required className="w-full p-2 border border-green-200 rounded text-sm" placeholder="Full Name" onChange={handleChange} />
                                        <input type="text" name="pharmacistQualification" value={formData.pharmacistQualification} required className="w-full p-2 border border-green-200 rounded text-sm" placeholder="Degree (e.g. B.Pharm)" onChange={handleChange} />
                                        <input type="text" name="pharmacistRegNo" value={formData.pharmacistRegNo} required className="w-full p-2 border border-green-200 rounded text-sm" placeholder="Reg No." onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-[#2B3446] text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Upload Documents</h2>
                            <p className="text-slate-500 mb-8">Pharmacy Council Registration is mandatory.</p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'PHARMACIST_CERT', label: 'Pharmacist Registration Certificate' },
                                    { id: 'RENT_AGREEMENT', label: 'Rent Agreement / Ownership Proof' },
                                    { id: 'BLUEPRINT', label: 'Premises Key Plan / Blueprint' },
                                    { id: 'FRIDGE_INVOICE', label: 'Refrigerator Invoice' },
                                    { id: 'PAN', label: 'Firm PAN Card' }
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-green-200 text-green-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-green-800' : 'text-slate-700'}`}>{doc.label}</span>
                                                    {uploadingFiles[doc.id] ? (
                                                        <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span>
                                                    ) : uploadedDoc ? (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">Attached</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}>
                                                {uploadingFiles[doc.id] ? '...' : uploadedDoc ? 'Change' : 'Upload'}
                                                <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileChange(doc.id, e)} />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-6 border border-red-200 flex items-center gap-2"><AlertTriangle size={18} /> {error}</div>}

                            <div className="flex gap-4">
                                <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">
                                    Back
                                </button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-[#2B3446] text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex justify-center items-center">
                                    {loading ? 'Processing...' : 'Submit & Pay'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                Your application for <strong>{formData.businessName}</strong> has been received.
                                <br />Type: <strong>{formData.licenseType}</strong>
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Total Payable</p>
                                <p className="text-4xl font-black text-[#2B3446]">₹7,999 <span className="text-sm font-normal text-slate-400">+ Govt Fees</span></p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Pay Now
                            </button>

                            <p className="text-xs text-slate-400 mt-4">Secure Payment via Razorpay</p>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyDrugLicense;
