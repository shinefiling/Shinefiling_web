import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Mail, Lock, Smartphone, ChevronRight,
    Shield, CheckCircle, ArrowRight, User,
    AlertCircle, Eye, EyeOff, Building
} from 'lucide-react';
import axios from 'axios';
import { loginUser, signupUser, verifyOtp, resendOtp, googleLogin } from '../../api';
import { useGoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
    const [step, setStep] = useState('details'); // 'details' or 'otp' for signup
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        mobile: '',
        role: 'USER' // Default to Business Owner
    });

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setStep('details');
            setError('');
            setFormData({
                fullName: '',
                email: '',
                password: '',
                mobile: '',
                role: 'USER'
            });
        }
    }, [isOpen, initialMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                // 1. Fetch User Info using Access Token
                const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });

                const { email, name, sub: googleId } = userInfoResponse.data;

                // 2. Send Profile to Backend
                const data = await googleLogin({ email, name, googleId });

                // Robust User/Token Handling
                const userObj = data.user || data;
                const token = data.token || userObj.token;
                const finalUser = { ...userObj, token };

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(finalUser));
                onAuthSuccess(finalUser);
                onClose();
            } catch (err) {
                console.error("Google Login Error:", err);
                setError(err.response?.data?.message || 'Google login failed');
            } finally {
                setLoading(false);
            }
        },
        onError: error => console.error('Login Failed:', error)
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (step === 'details') {
                    // Request OTP
                    await signupUser({ ...formData, step: 'initiate' });
                    setStep('otp');
                    setLoading(false);
                } else {
                    // Verify OTP and Finalize Signup
                    const data = await verifyOtp({ email: formData.email, otp, type: 'signup' });

                    const userObj = data.user || data;
                    const token = data.token || userObj.token;
                    const finalUser = { ...userObj, token };

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(finalUser));
                    onAuthSuccess(finalUser);
                    onClose();
                }
            } else {
                // Login
                if (loginMethod === 'email') {
                    const data = await loginUser({ email: formData.email, password: formData.password });

                    const userObj = data.user || data;
                    const token = data.token || userObj.token;
                    const finalUser = { ...userObj, token };

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(finalUser));
                    onAuthSuccess(finalUser);
                    onClose();
                } else {
                    // OTP Login Flow (simplified for now)
                    if (step === 'details') {
                        // Send OTP logic would go here
                        setStep('otp');
                        setLoading(false);
                    } else {
                        // Verify OTP logic
                    }
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.response?.data?.message || 'Authentication failed');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#043E52]/60 backdrop-blur-sm"
                />

                {/* Modal Container - Compact Split Design */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-[800px] h-[500px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Left Side - Brand Panel */}
                    <div className="hidden md:flex w-[40%] bg-[#043E52] relative flex-col justify-between p-8 text-white overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-full z-0">
                            <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#ED6E3F] rounded-full blur-[80px] opacity-30"></div>
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#022c3a] rounded-full blur-[60px] opacity-50"></div>
                            <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                        <Building size={20} className="text-white" />
                                    </div>
                                    <span className="font-bold text-xl tracking-wide">ShineFiling</span>
                                </div>
                                <h2 className="text-3xl font-bold leading-tight mb-3 text-[#ED6E3F]">
                                    {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
                                </h2>
                                <p className="text-white/70 text-xs leading-relaxed max-w-xs">
                                    Experience the easiest way to manage your business compliance.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-[#043E52] flex items-center justify-center text-[8px] font-bold text-[#043E52]">
                                                <User size={10} />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-[#ED6E3F] ml-2">15k+ Users</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form Panel */}
                    <div className="flex-1 bg-white relative flex flex-col h-full w-full">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 text-slate-400 hover:text-[#ED6E3F] hover:bg-orange-50 p-2 rounded-full transition-all group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 w-full">
                            <div className="max-w-xs mx-auto pt-2">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-[#043E52] mb-1">
                                        {mode === 'login' ? 'Sign In' : (step === 'details' ? 'Create Account' : 'Verify OTP')}
                                    </h3>
                                    <p className="text-slate-500 text-xs">
                                        {mode === 'login'
                                            ? 'Enter your credentials to access.'
                                            : 'Fill in your details to get started.'}
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg flex items-center gap-2 border border-red-100">
                                        <AlertCircle size={14} /> {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {mode === 'signup' && step === 'details' && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className="w-full h-10 border-2 border-slate-100 rounded-lg px-3 text-xs font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50 focus:bg-white"
                                                    required
                                                />
                                            </div>

                                            {/* Role Selection */}
                                            <div className="space-y-1 pt-0.5">
                                                <label className="text-[10px] font-bold text-slate-500 ml-1">I am a</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { id: 'USER', label: 'Business Owner', icon: User },
                                                        { id: 'AGENT', label: 'Partner / Agent', icon: Shield }
                                                    ].map((role) => (
                                                        <button
                                                            key={role.id}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, role: role.id })}
                                                            className={`relative flex flex-col items-center justify-center h-16 rounded-xl border-2 transition-all duration-300 ${formData.role === role.id
                                                                ? 'bg-[#043E52]/5 border-[#043E52] text-[#043E52]'
                                                                : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-100'
                                                                }`}
                                                        >
                                                            <div className="mb-1">
                                                                <role.icon size={20} strokeWidth={2} />
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase tracking-tight">{role.label}</span>
                                                            {formData.role === role.id && (
                                                                <div className="absolute top-2 right-2 text-[#043E52]">
                                                                    <CheckCircle size={14} fill="currentColor" stroke="white" strokeWidth={3} />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {step === 'details' ? (
                                        <>
                                            {loginMethod === 'email' ? (
                                                <>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-500 ml-1">Email Address</label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            autoComplete="username"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full h-10 border-2 border-slate-100 rounded-lg px-3 text-xs font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50 focus:bg-white"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="flex justify-between items-center px-1">
                                                            <label className="text-[10px] font-bold text-slate-500">Password</label>
                                                            {mode === 'login' && <button type="button" className="text-[9px] font-bold text-[#ED6E3F] hover:underline uppercase">Forgot Password?</button>}
                                                        </div>
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                name="password"
                                                                autoComplete={mode === 'login' ? "current-password" : "new-password"}
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                className="w-full h-10 border-2 border-slate-100 rounded-lg pl-3 pr-12 text-xs font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50 focus:bg-white"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#ED6E3F] uppercase tracking-wider hover:text-[#d55f34]"
                                                            >
                                                                {showPassword ? "HIDE" : "SHOW"}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {mode === 'signup' && (
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-slate-500 ml-1">Mobile</label>
                                                            <input
                                                                type="tel"
                                                                name="mobile"
                                                                value={formData.mobile}
                                                                onChange={handleChange}
                                                                className="w-full h-10 border-2 border-slate-100 rounded-lg px-3 text-xs font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50 focus:bg-white"
                                                                required
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 ml-1">Mobile Number</label>
                                                    <input
                                                        type="tel"
                                                        name="mobile"
                                                        value={formData.mobile}
                                                        onChange={handleChange}
                                                        className="w-full h-10 border-2 border-slate-100 rounded-lg px-3 text-xs font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50 focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="space-y-3 py-2">
                                            <p className="text-xs text-center text-slate-600">Enter code sent to <span className="font-bold text-[#043E52]">{formData.email}</span></p>
                                            <input
                                                type="text"
                                                maxLength="6"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-[#ED6E3F] transition-colors tracking-[0.5em] text-[#043E52]"
                                                placeholder="000000"
                                            />
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 bg-[#ED6E3F] text-white rounded-xl font-bold text-base hover:bg-[#d55f34] transition-all transform active:scale-95 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Processing...' : (
                                                <>
                                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 flex flex-col gap-3">
                                    {/* Google Login */}
                                    {step === 'details' && (
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-100"></div>
                                            </div>
                                            <div className="relative flex justify-center text-[10px]">
                                                <span className="px-2 bg-white text-slate-400 font-medium">Or continue with</span>
                                            </div>
                                        </div>
                                    )}

                                    {step === 'details' && (
                                        <button
                                            type="button"
                                            onClick={() => handleGoogleLogin()}
                                            className="w-full h-10 border-2 border-slate-100 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-bold text-xs text-slate-600 bg-white"
                                        >
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                                            <span>Google</span>
                                        </button>
                                    )}

                                    <div className="text-center mt-1">
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {mode === 'login' ? "New to ShineFiling?" : "Already member?"}
                                            <button
                                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                                className="text-[#ED6E3F] font-black ml-1 hover:underline uppercase tracking-wide"
                                            >
                                                {mode === 'login' ? 'Create Account' : 'Login Here'}
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Scrollbar CSS */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e2e8f0;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #cbd5e1;
                    }
                `}} />
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
