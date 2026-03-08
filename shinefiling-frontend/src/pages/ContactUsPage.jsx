import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ArrowRight } from 'lucide-react';

const ContactUsPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* 1. HERO SECTION */}
            <div className="relative min-h-[50vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
                        alt="Contact Us"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                            <MessageSquare size={12} className="fill-bronze" /> We're Here to Help
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-white tracking-tight">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-yellow-200">Touch.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 font-light">
                            Have questions about your business registration or compliance? Our team of experts is ready to assist you.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* 2. CONTACT CARDS & FORM SECTION */}
            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* INFO COLUMNS (1 Col) */}
                    <div className="space-y-6">
                        {/* Address Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze mb-4">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-navy mb-2">Our Office</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                123, Business Avenue, <br />
                                Tech Park, Bangalore,<br />
                                Karnataka - 560001
                            </p>
                        </div>

                        {/* Phone/Email Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze mb-4">
                                <Phone size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-navy mb-4">Contact Info</h3>
                            <div className="space-y-3">
                                <p className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <Phone size={16} className="text-bronze" /> +91 7639227019
                                </p>
                                <p className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <Mail size={16} className="text-bronze" /> support@shinefiling.com
                                </p>
                                <p className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <Clock size={16} className="text-bronze" /> Mon - Sat, 9am - 7pm
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CONTACT FORM (2 Cols) */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-navy mb-6">Send Us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bronze focus:ring-0 transition-all outline-none text-navy font-medium" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bronze focus:ring-0 transition-all outline-none text-navy font-medium" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <input type="email" className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bronze focus:ring-0 transition-all outline-none text-navy font-medium" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input type="text" className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bronze focus:ring-0 transition-all outline-none text-navy font-medium" placeholder="+91 7639227019" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                                <select className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bronze focus:ring-0 transition-all outline-none text-navy font-medium appearance-none">
                                    <option>General Inquiry</option>
                                    <option>Business Registration</option>
                                    <option>Tax Compliance</option>
                                    <option>Partner With Us</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                                <textarea className="w-full h-40 p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bronze focus:ring-0 transition-all outline-none text-navy font-medium resize-none" placeholder="How can we help you today?"></textarea>
                            </div>

                            <button type="button" className="w-full md:w-auto px-10 py-4 bg-navy text-white font-bold rounded-xl hover:bg-bronze transition-all flex items-center justify-center gap-2 shadow-lg shadow-navy/20">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* 3. MAP SECTION (Optional Visual) */}
            <div className="max-w-7xl mx-auto px-6 mt-20">
                <div className="w-full h-80 bg-gray-200 rounded-3xl overflow-hidden shadow-inner grayscale hover:grayscale-0 transition-all duration-700">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.598687258079!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

        </div>
    );
};

export default ContactUsPage;
