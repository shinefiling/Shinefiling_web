
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MessageSquare, Mic, HelpCircle } from 'lucide-react';
import { getBotResponse } from '../../../utils/chatbotLogic';

const HeadsetIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
)

const CaSupport = ({ user }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: `Hello ${user?.fullName || 'Partner'}, how can I assist you with your CA partnership today?`, sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate typing delay
        setTimeout(() => {
            const botReplyText = getBotResponse(userMsg.text, 'ca'); // Pass 'ca' context
            const botMsg = { id: Date.now() + 1, text: botReplyText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-[calc(100vh-140px)] flex gap-6">
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-[#F97316] text-white flex items-center justify-center">
                            <HeadsetIcon />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Partner Priority Support</h3>
                            <p className="text-xs text-emerald-500 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online</p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors"><HelpCircle size={20} className="text-slate-400" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                ? 'bg-slate-800 dark:bg-[#F97316] text-white rounded-br-none shadow-lg shadow-blue-900/10'
                                : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-transparent'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-50 dark:border-slate-700">
                    <div className="relative flex items-center gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your query regarding compliance, filings, or tech issues..."
                            className="flex-1 py-3 px-4 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316] text-sm dark:text-white"
                        />
                        <button type="button" className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"><Mic size={20} /></button>
                        <button type="submit" disabled={!input.trim()} className="p-3 bg-slate-800 dark:bg-[#F97316] text-white rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100">
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>

            <div className="hidden lg:block w-80 space-y-4">
                <div className="bg-slate-800 dark:bg-slate-700 p-6 rounded-3xl text-white">
                    <h4 className="font-bold mb-2">Dedicated RM</h4>
                    <p className="text-xs text-white/70 mb-4">You have a dedicated Relationship Manager for faster resolutions.</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">Call Your RM</button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Common Queries</h4>
                    <div className="space-y-2">
                        {['How to assign works to employees?', 'Updating completion status', 'Payout cycle details', 'Technical issue reporting'].map(q => (
                            <button key={q} className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">{q}</button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CaSupport;
