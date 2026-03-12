import React, { useState } from 'react';
import { MessageCircle, Phone, FileText, ChevronRight, Send, X, Smile, Paperclip, HelpCircle, Search, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitSupportTicket, getBotResponse } from '../../api';

const ClientSupport = ({ setActiveTab }) => {
    // State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: 'system' }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [ticket, setTicket] = useState({ subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    // FAQ Data
    const faqs = [
        { q: "How do I download my GST certificate?", a: "Go to the 'Documents' tab, filter by 'Registration', and click the download icon next to your GST certificate." },
        { q: "What is the status of my Trademark application?", a: "You can track real-time status in the 'My Applications' tab. Click on your trademark order ID for detailed timeline." },
        { q: "How can I change my registered email?", a: "Navigate to 'Profile & KYC' > 'Account Settings' to update your contact information." },
    ];

    // Chat Handler
    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const msg = { id: Date.now(), text: newMessage, sender: 'user' };
        setChatMessages([...chatMessages, msg]);
        const userMsg = newMessage;
        setNewMessage("");

        // Instant response simulation
        setTimeout(() => {
            const botReplyText = getBotResponse(userMsg, 'CLIENT');
            const reply = { id: Date.now() + 1, text: botReplyText, sender: 'system' };
            setChatMessages(prev => [...prev, reply]);
        }, 600);
    };

    // Ticket Handler
    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitSupportTicket(ticket);
            alert("Ticket Raised Successfully! Reference ID: #TKT-" + Math.floor(Math.random() * 10000));
            setTicket({ subject: '', message: '' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#043E52] dark:text-white">Help & Support</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We are here to help you 24/7.</p>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Live Chat Card */}
                <div onClick={() => setIsChatOpen(true)} className="bg-[#043E52] rounded-2xl p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#ED6E3F]/20 rounded-full blur-[30px] translate-x-1/2 -translate-y-1/3"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[110px]">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md mb-2 border border-white/10">
                            <MessageCircle size={16} className="text-[#ED6E3F]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold mb-0.5">Live Chat</h3>
                            <p className="text-white/60 text-[9px] mb-2 leading-tight">Connect with support instantly.</p>
                            <span className="inline-flex items-center gap-1 text-[#ED6E3F] text-[10px] font-bold group-hover:gap-1.5 transition-all">Start Chat <ChevronRight size={12} /></span>
                        </div>
                    </div>
                </div>

                {/* Call Support */}
                <div className="bg-white dark:bg-[#043E52] border border-slate-100 dark:border-[#1C3540] rounded-2xl p-4 shadow-sm group hover:border-[#ED6E3F] transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-3">
                        <Phone size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-[#043E52] dark:text-white mb-0.5">Call Support</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[9px] mb-2 leading-tight">Speak with your manager.</p>
                    <p className="text-sm font-mono font-bold text-slate-800 dark:text-white">+91 7639227019</p>
                </div>

                {/* Email / Ticket */}
                <div className="bg-white dark:bg-[#043E52] border border-slate-100 dark:border-[#1C3540] rounded-2xl p-4 shadow-sm group hover:border-[#ED6E3F] transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-3">
                        <Mail size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-[#043E52] dark:text-white mb-0.5">Email Us</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[9px] mb-2 leading-tight">Response within 24 hours.</p>
                    <p className="text-[10px] font-bold text-slate-800 dark:text-white">info@shinefiling.com</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* FAQs */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-[#043E52] dark:text-white">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white dark:bg-[#043E52] border border-slate-100 dark:border-[#1C3540] p-4 rounded-xl shadow-sm hover:shadow-md transition">
                                <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-1.5 flex items-start gap-2">
                                    <HelpCircle size={16} className="text-[#ED6E3F] shrink-0 mt-0.5" />
                                    {faq.q}
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] pl-6 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket Form */}
                <div className="bg-white dark:bg-[#043E52] border border-slate-100 dark:border-[#1C3540] p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-lg text-[#043E52] dark:text-white mb-4">Raise a Ticket</h3>
                    <form onSubmit={handleSubmitTicket} className="space-y-3">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 mb-1 block">Subject</label>
                            <input
                                required
                                value={ticket.subject}
                                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#ED6E3F]"
                                placeholder="E.g. Issue with payment"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 mb-1 block">Description</label>
                            <textarea
                                required
                                rows={3}
                                value={ticket.message}
                                onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#ED6E3F]"
                                placeholder="Describe your issue in detail..."
                            />
                        </div>
                        <button disabled={loading} className="w-full py-2.5 bg-[#043E52] dark:bg-[#ED6E3F] text-white font-bold text-xs rounded-xl shadow-lg hover:bg-black dark:hover:bg-[#A57753] transition disabled:opacity-50">
                            {loading ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Chat Modal */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
                        onClick={() => setIsChatOpen(false)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-[#043E52] w-full sm:max-w-md h-[80vh] sm:h-[600px] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Chat Header */}
                            <div className="p-4 bg-[#043E52] text-white flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                                            <MessageCircle size={20} />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#043E52] rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Support Assistant</h3>
                                        <p className="text-xs text-white/50">Online • Replies instantly</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0D1C22]">
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-[#ED6E3F] text-white rounded-tr-none'
                                            : 'bg-white dark:bg-[#1C3540] text-slate-700 dark:text-slate-200 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-[#043E52] border-t border-slate-100 dark:border-[#1C3540] flex items-center gap-3 shrink-0">
                                <button className="p-2 text-slate-400 hover:text-[#043E52] dark:hover:text-white transition"><Paperclip size={20} /></button>
                                <div className="flex-1 relative">
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..."
                                        className="w-full bg-slate-100 dark:bg-[#1C3540] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#ED6E3F]/20 focus:outline-none dark:text-white"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ED6E3F] transition"><Smile size={18} /></button>
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-[#043E52] dark:bg-[#ED6E3F] text-white rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:scale-100"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientSupport;
