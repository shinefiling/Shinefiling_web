import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { submitServiceRequest } from '../../api';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader, FileText } from 'lucide-react';

const GenericServicePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const serviceName = searchParams.get('name') || "Service Application";

    // Simple Generic Form
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        businessName: '',
        requirements: ''
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
                serviceName: serviceName,
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
            <Navbar isLoggedIn={true} />

            <div className="pt-32 px-6 max-w-3xl mx-auto">
                <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-brand-gold mb-6">
                    <ArrowLeft size={20} className="mr-2" /> Back to Services
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-brand-gold/10 rounded-lg text-brand-gold">
                            <FileText size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">{serviceName}</h1>
                    </div>
                    <p className="text-gray-600 mb-8 ml-14">Complete the form below to initiate your application.</p>

                    {success ? (
                        <div className="text-center py-12">
                            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                            <p className="text-gray-600">Our experts will contact you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business/Entity Name (Optional)</label>
                                <input
                                    type="text"
                                    name="businessName"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Requirements / Notes</label>
                                <textarea
                                    name="requirements"
                                    rows="4"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-brand-gold outline-none"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                />
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

export default GenericServicePage;
