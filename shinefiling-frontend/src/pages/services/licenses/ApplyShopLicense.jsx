import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, CreditCard, FileText } from 'lucide-react';
import { submitShopLicense, uploadFile } from '../../../api';

const ApplyShopLicense = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const plan = searchParams.get('plan') || 'standard';

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data from local storage for initial fill
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        // Common
        email: user.email || '',
        contactMobile: user.mobile || '',

        // Shop Details
        applicantName: user.fullName || '',
        shopName: '',
        shopAddress: '',
        natureOfBusiness: '',
        numberOfEmployees: '',
        category: 'commercial', // commercial, hotel, etc

        // Docs
        uploadedDocuments: {}
    });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login?redirect=/services/licenses/shop-establishment/apply?plan=' + plan);
        }
        window.scrollTo(0, 0);
    }, [isLoggedIn, navigate, plan]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));
            try {
                const response = await uploadFile(file, 'shop-license');
                if (response && response.fileUrl) {
                    setFormData(prev => ({
                        ...prev,
                        uploadedDocuments: {
                            ...prev.uploadedDocuments,
                            [docType]: response.fileUrl
                        }
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
            const payload = {
                email: formData.email,
                ...formData,
                planType: plan,
                numberOfEmployees: parseInt(formData.numberOfEmployees),
                uploadedDocuments: formData.uploadedDocuments
            };

            await submitShopLicense(payload);
            setStep(3); // Success/Payment Step
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPlanDetails = () => {
        switch (plan) {
            case 'renewal': return { title: 'Shop License Renewal', price: '₹999' };
            case 'consult': return { title: 'Consultation', price: '₹499' };
            default: return { title: 'Shop & Establishment Registration', price: '₹2,499' };
        }
    };

    const planDetails = getPlanDetails();

    const getDocsList = () => {
        return ['PAN Card', 'Aadhaar Card', 'Shop Photo with Name Board', 'Electricity Bill'];
    };

    const docsList = getDocsList();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="bg-[#2B3446] text-white py-6 px-6 shadow-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold">{planDetails.title} Application</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-[#2B3446] text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Shop Details</h2>
                            <p className="text-slate-500 mb-8">Provide details for Shop License.</p>
                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Applicant Name</label>
                                        <input type="text" name="applicantName" defaultValue={formData.applicantName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Shop Name</label>
                                        <input type="text" name="shopName" required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Shop Address</label>
                                    <textarea name="shopAddress" rows="3" required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange}></textarea>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nature of Business</label>
                                        <input type="text" name="natureOfBusiness" required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="e.g. Retail, Software" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">No. of Employees</label>
                                        <input type="number" name="numberOfEmployees" required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-[#2B3446] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition">Next Step</button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Upload Documents</h2>
                            <p className="text-slate-500 mb-8">Upload proofs for verification.</p>
                            <div className="space-y-4 mb-8">
                                {docsList.map((doc, i) => (
                                    <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${formData.uploadedDocuments[doc] ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg border ${formData.uploadedDocuments[doc] ? 'bg-white border-green-200 text-green-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                {formData.uploadedDocuments[doc] ? <CheckCircle size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <span className={`font-bold text-sm block ${formData.uploadedDocuments[doc] ? 'text-green-800' : 'text-slate-700'}`}>{doc}</span>
                                                {uploadingFiles[doc] ? <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span> : formData.uploadedDocuments[doc] ? <span className="text-xs text-green-600 font-medium">Attached</span> : null}
                                            </div>
                                        </div>
                                        <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : formData.uploadedDocuments[doc] ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
                                            {uploadingFiles[doc] ? '...' : formData.uploadedDocuments[doc] ? 'Change' : 'Upload'}
                                            <input type="file" className="hidden" disabled={uploadingFiles[doc]} onChange={(e) => handleFileChange(doc, e)} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-6">{error}</div>}
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Back</button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-[#2B3446] text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex justify-center items-center">{loading ? 'Processing...' : 'Submit & Pay'}</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6"><CheckCircle size={40} /></div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">Your Shop License application has been received.</p>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Total Payable</p>
                                <p className="text-4xl font-black text-[#2B3446]">{planDetails.price} <span className="text-sm font-normal text-slate-400">+ Govt Fees</span></p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mx-auto"><CreditCard size={18} /> Pay Now</button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplyShopLicense;
