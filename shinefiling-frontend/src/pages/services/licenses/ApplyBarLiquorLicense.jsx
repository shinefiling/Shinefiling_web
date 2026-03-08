import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Wine, MapPin, Gauge } from 'lucide-react';
import { uploadFile, submitBarLiquor } from '../../../api'; // ensure in api.js

const ApplyBarLiquorLicense = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data form local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        establishmentName: '',
        state: '',
        licenseType: 'RETAIL', // RETAIL, BAR, WHOLESALE, BREWERY, EVENT

        // Form Data
        address: '',
        premisesType: 'RENTED',
        distanceFromSchoolOrTemple: '', // in meters
        hasPoliceNoc: false,
        hasFireNoc: false,

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/bar-liquor-license/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'liquor');
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

        try {
            // Logic: Check mandatory inputs
            if (parseFloat(formData.distanceFromSchoolOrTemple) < 50) {
                if (!window.confirm("Distance from School/Religious place is < 50m. This is likely to be REJECTED. Do you still want to proceed?")) {
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                submissionId: `LIQ-${Date.now()}`,
                userEmail: formData.userEmail,
                establishmentName: formData.establishmentName,
                state: formData.state,
                licenseType: formData.licenseType,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    address: formData.address,
                    premisesType: formData.premisesType,
                    distanceFromSchoolOrTemple: parseFloat(formData.distanceFromSchoolOrTemple),
                    hasPoliceNoc: formData.hasPoliceNoc,
                    hasFireNoc: formData.hasFireNoc
                },
                documents: formData.uploadedDocuments
            };

            await submitBarLiquor(payload);
            setCurrentStep(3); // Success
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate dynamic price
    const getPrice = () => {
        if (formData.licenseType === 'EVENT') return '₹9,999';
        if (formData.licenseType === 'BREWERY') return '₹49,999';
        return '₹24,999';
    }

    return (
        <div className="min-h-screen bg-[#111] font-sans pt-24 pb-24 text-gray-200">
            {/* Header */}
            <div className="bg-[#1A1A1A] border-b border-white/10 py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2 text-white"><Wine size={20} className="text-red-500" /> Liquor License Application</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-red-600 text-white' : 'bg-[#222] border-2 border-white/20 text-gray-500'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-[#1E1E1E] rounded-2xl shadow-xl p-8 border border-white/5">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-white mb-2">Establishment Details</h2>
                            <p className="text-gray-400 mb-8">Select license type and location.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Establishment Name</label>
                                        <input type="text" name="establishmentName" value={formData.establishmentName} required className="w-full p-3 bg-[#2A2A2A] border border-white/10 rounded-lg text-white focus:border-red-500 outline-none" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">License Type</label>
                                        <select name="licenseType" value={formData.licenseType} onChange={handleChange} className="w-full p-3 bg-[#2A2A2A] border border-white/10 rounded-lg text-white focus:border-red-500 outline-none">
                                            <option value="RETAIL">Retail Liquor Shop (FL-2)</option>
                                            <option value="BAR">Restaurant & Bar (FL-3)</option>
                                            <option value="WHOLESALE">Wholesale Distributor</option>
                                            <option value="BREWERY">Microbrewery</option>
                                            <option value="EVENT">One Day Event Permit</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">State</label>
                                    <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 bg-[#2A2A2A] border border-white/10 rounded-lg text-white focus:border-red-500 outline-none" required>
                                        <option value="">Select State</option>
                                        <option value="MAHARASHTRA">Maharashtra</option>
                                        <option value="KARNATAKA">Karnataka</option>
                                        <option value="DELHI">Delhi</option>
                                        <option value="GOA">Goa</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Premises Address</label>
                                    <textarea name="address" rows="2" value={formData.address} required className="w-full p-3 bg-[#2A2A2A] border border-white/10 rounded-lg text-white focus:border-red-500 outline-none" onChange={handleChange}></textarea>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Premises Ownership</label>
                                        <select name="premisesType" value={formData.premisesType} onChange={handleChange} className="w-full p-3 bg-[#2A2A2A] border border-white/10 rounded-lg text-white focus:border-red-500 outline-none">
                                            <option value="RENTED">Rented (Lease)</option>
                                            <option value="OWNED">Owned</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2"><MapPin size={14} /> Distance from School/Temple (Meters)</label>
                                        <input type="number" name="distanceFromSchoolOrTemple" value={formData.distanceFromSchoolOrTemple} placeholder="e.g. 150" required className="w-full p-3 bg-[#2A2A2A] border border-white/10 rounded-lg text-white focus:border-red-500 outline-none" onChange={handleChange} />
                                        {formData.distanceFromSchoolOrTemple && parseFloat(formData.distanceFromSchoolOrTemple) < 100 && (
                                            <span className="text-xs text-red-500 font-bold mt-1 block">Warning: Violation imminent if less than 75-100m.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-white mb-2">Approvals & Docs</h2>
                            <p className="text-gray-400 mb-8">Mandatory NOCs and Layouts.</p>

                            <div className="bg-red-900/10 p-6 rounded-xl border border-red-900/40 mb-8">
                                <h3 className="font-bold text-red-400 mb-4 text-sm uppercase tracking-wide flex items-center gap-2"><ShieldCheck size={16} /> Pre-requisites</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                                        <input type="checkbox" name="hasPoliceNoc" checked={formData.hasPoliceNoc} onChange={handleChange} className="w-5 h-5 accent-red-600 rounded" />
                                        <div>
                                            <span className="text-gray-200 font-bold block">Do you have Police Verification / NOC?</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                                        <input type="checkbox" name="hasFireNoc" checked={formData.hasFireNoc} onChange={handleChange} className="w-5 h-5 accent-red-600 rounded" />
                                        <div>
                                            <span className="text-gray-200 font-bold block">Do you have Fire Safety NOC?</span>
                                            <span className="text-xs text-gray-500">Service available on portal if pending.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'LIQUOR_LAYOUT', label: 'Premises Layout Plan (Approved)' },
                                    { id: 'SOLVENCY_CERT', label: 'Solvency Certificate' },
                                    { id: 'OWNERSHIP_PROOF', label: 'Sale Deed / Lease Agreement' },
                                    { id: 'POLICE_CLEARANCE', label: 'Police Clearance Certain (if available)' }
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-red-900/20 border-red-500/50' : 'bg-[#2A2A2A] border-white/10'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${uploadedDoc ? 'text-red-400' : 'text-gray-500'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-red-200' : 'text-gray-300'}`}>{doc.label}</span>
                                                    {uploadingFiles[doc.id] ? (
                                                        <span className="text-xs text-blue-400 font-medium animate-pulse">Uploading...</span>
                                                    ) : uploadedDoc ? (
                                                        <span className="text-xs text-green-400 font-medium flex items-center gap-1">Attached</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-gray-700 text-gray-400' : uploadedDoc ? 'text-red-300 bg-red-900/40 hover:bg-red-900/60' : 'text-gray-300 bg-white/10 hover:bg-white/20'}`}>
                                                {uploadingFiles[doc.id] ? '...' : uploadedDoc ? 'Change' : 'Upload'}
                                                <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileChange(doc.id, e)} />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                            {error && <div className="p-4 bg-red-900/20 text-red-400 rounded-lg text-sm mb-6 border border-red-500/30 flex items-center gap-2"><AlertTriangle size={18} /> {error}</div>}

                            <div className="flex gap-4">
                                <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-transparent border border-white/20 text-gray-300 font-bold rounded-xl hover:bg-white/5 transition">
                                    Back
                                </button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition flex justify-center items-center">
                                    {loading ? 'Processing...' : 'Submit Application'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">Application Submitted!</h2>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                We have received your request for <strong>{formData.establishmentName}</strong>. Our Excise Consultant will review your location eligibility.
                            </p>

                            <div className="bg-[#2A2A2A] p-6 rounded-xl border border-white/10 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-bold">Estimated Cost</p>
                                <p className="text-4xl font-black text-white">{getPrice()}<span className="text-sm font-normal text-gray-500 block">+ Govt Excise Duty</span></p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyBarLiquorLicense;
