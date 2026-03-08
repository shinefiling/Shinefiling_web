import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { submitServiceRequest } from '../../api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader } from 'lucide-react';

const RentAgreementPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        landlordName: '',
        tenantName: '',
        propertyAddress: '',
        rentAmount: '',
        startDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setError("You must be logged in to apply.");
            setLoading(false);
            return;
        }
        const user = JSON.parse(userStr);

        try {
            await submitServiceRequest({
                email: user.email,
                serviceName: 'Rent Agreement',
                formData: formData
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar isLoggedIn={true} /> {/* Assuming logged in for now, or check generic context */}

            <div className="pt-32 px-6 max-w-3xl mx-auto">
                <button onClick={() => navigate('/services')} className="flex items-center text-gray-500 hover:text-brand-gold mb-6">
                    <ArrowLeft size={20} className="mr-2" /> Back to Services
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent Agreement Application</h1>
                    <p className="text-gray-600 mb-8">Fill in the details below to generate your rent agreement automatically.</p>

                    {success ? (
                        <div className="text-center py-12">
                            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                            <p className="text-gray-600">Redirecting to your dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Landlord Name</label>
                                    <input
                                        type="text"
                                        name="landlordName"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                        value={formData.landlordName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tenant Name</label>
                                    <input
                                        type="text"
                                        name="tenantName"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                        value={formData.tenantName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
                                <textarea
                                    name="propertyAddress"
                                    required
                                    rows="3"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                    value={formData.propertyAddress}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (₹)</label>
                                    <input
                                        type="number"
                                        name="rentAmount"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                        value={formData.rentAmount}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-gold text-white font-bold py-4 rounded-xl hover:bg-yellow-600 transition flex items-center justify-center"
                            >
                                {loading ? <Loader className="animate-spin" /> : 'Submit Application'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RentAgreementPage;
