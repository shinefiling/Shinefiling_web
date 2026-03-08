import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, HardHat } from 'lucide-react';
import { uploadFile, submitLabourLicense } from '../../../api'; // Ensure submitLabourLicense is in api.js

const ApplyLabourLicense = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const plan = searchParams.get('plan') || 'standard';

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        contractorName: user.fullName || '',
        state: '',
        numberOfLabourers: '',

        // Form Data
        principalEmployerName: '',
        principalEmployerAddress: '',
        natureOfWork: '',
        workStartDate: '',
        workEndDate: '',
        establishmentRegNo: '',
        workSiteAddress: '',
        isContractAgreementAvailable: false,

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/labour-license/apply?plan=${plan}` } });
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
                const response = await uploadFile(file, 'labour-license');
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

        if (parseInt(formData.numberOfLabourers) < 20) {
            setError("Labour License is mandatory only for 20+ employees. Please check requirements.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                submissionId: `LABOUR-${Date.now()}`,
                userEmail: formData.userEmail,
                contractorName: formData.contractorName,
                state: formData.state,
                numberOfLabourers: parseInt(formData.numberOfLabourers),
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    principalEmployerName: formData.principalEmployerName,
                    principalEmployerAddress: formData.principalEmployerAddress,
                    natureOfWork: formData.natureOfWork,
                    workStartDate: formData.workStartDate,
                    workEndDate: formData.workEndDate,
                    establishmentRegNo: formData.establishmentRegNo,
                    workSiteAddress: formData.workSiteAddress,
                    isContractAgreementAvailable: formData.isContractAgreementAvailable
                },
                documents: formData.uploadedDocuments
            };

            await submitLabourLicense(payload);
            setCurrentStep(3); // Success
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F6] font-sans pt-24 pb-24">
            {/* Simple Header */}
            <div className="bg-[#2B3446] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><HardHat size={20} className="text-indigo-400" /> Labour License Application</h1>
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
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Contract Details</h2>
                            <p className="text-slate-500 mb-8">Enter details of the contract work and employer.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Contractor Name</label>
                                        <input type="text" name="contractorName" value={formData.contractorName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State of Work</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="">Select State</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Principal Employer Name</label>
                                    <input type="text" name="principalEmployerName" value={formData.principalEmployerName} required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Company issuing the contract" onChange={handleChange} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Principal Employer Address</label>
                                    <textarea name="principalEmployerAddress" rows="2" value={formData.principalEmployerAddress} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange}></textarea>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Number of Labourers</label>
                                        <input type="number" name="numberOfLabourers" value={formData.numberOfLabourers} required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Max count on any day" onChange={handleChange} />
                                        <p className="text-xs text-orange-500 mt-1">Must be 20 or more.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nature of Work</label>
                                        <input type="text" name="natureOfWork" value={formData.natureOfWork} required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="e.g. Housekeeping, Security" onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Work Start Date</label>
                                        <input type="date" name="workStartDate" value={formData.workStartDate} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Work End Date</label>
                                        <input type="date" name="workEndDate" value={formData.workEndDate} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl">
                                    <input type="checkbox" name="isContractAgreementAvailable" checked={formData.isContractAgreementAvailable} onChange={handleChange} className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <span className="text-sm font-bold text-slate-700 block">Is Work Order / Agreement Available?</span>
                                        <span className="text-xs text-slate-500">Required for verification.</span>
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
                            <p className="text-slate-500 mb-8">Form V and Agreement are critical for license.</p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'FORM_V', label: 'Form V / Letter from Principal Employer' },
                                    { id: 'CONTRACT_AGREEMENT', label: 'Work Order / Contract Agreement' },
                                    { id: 'PAN', label: 'Contractor PAN Card' },
                                    { id: 'AADHAAR', label: 'Contractor Aadhaar Card' },
                                    { id: 'EST_REG', label: 'Principal Employer Reg. Certificate (Form I/II)' }
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
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'}`}>
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
                                    {loading ? 'Processing...' : 'Submit Now'}
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
                                Your application for <strong>Labour License</strong> has been received.
                                <br />State: <strong>{formData.state}</strong>
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Total Payable</p>
                                <p className="text-4xl font-black text-[#2B3446]">₹3,999 <span className="text-sm font-normal text-slate-400">+ Govt Fees</span></p>
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

export default ApplyLabourLicense;
