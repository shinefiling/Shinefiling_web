import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, Globe, Users, Briefcase, FileText, Building, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { MAIN_SERVICES, TOP_CITIES } from '../data/seoData';

const DynamicSEOPage = () => {
    const { seoSlug } = useParams();

    // Default values
    let service = MAIN_SERVICES[0];
    let city = 'India';

    if (seoSlug) {
        // Try to find matching service in slug
        const matchedService = MAIN_SERVICES.find(s => seoSlug.startsWith(s.id));
        if (matchedService) {
            service = matchedService;
            const cityPart = seoSlug.replace(matchedService.id, '').replace(/^-/, '');
            if (cityPart) {
                city = cityPart.charAt(0).toUpperCase() + cityPart.slice(1).replace(/-/g, ' ');
            }
        } else {
            // Handle cases like "hire-ca-freelancer-india" which might not perfectly match IDs
            city = 'India';
            if (seoSlug.includes('ca-freelancer')) service = MAIN_SERVICES[0];
            else if (seoSlug.includes('gst')) service = MAIN_SERVICES[1];
            else if (seoSlug.includes('income-tax') || seoSlug.includes('itr')) service = MAIN_SERVICES[2];
            else if (seoSlug.includes('company')) service = MAIN_SERVICES[3];
        }
    }

    const title = service.title.replace('{city}', city);
    const description = service.description.replace('{city}', city);

    // Schema for Local Business / Service
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${service.name} in ${city}`,
        "provider": {
            "@type": "Organization",
            "name": "ShineFiling"
        },
        "description": description,
        "areaServed": {
            "@type": "Place",
            "name": city
        }
    };

    return (
        <div className="bg-white">
            <SEOHead
                title={`${title} - ShineFiling`}
                description={`${description} Pan India verified CA network. India's #1 CA freelancer marketplace.`}
                keywords={`${service.name} ${city}, best ${service.name} in ${city}, online ${service.name} ${city}, ${city} ${service.name} services, hire ${service.name} in ${city}, top rated ${service.name} ${city}`}
                schema={schema}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-tr from-[#043E52] to-[#0D9488] text-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6">
                            Verified Professionals in {city}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                            {service.name} in <span className="text-[#F9A65E]">{city}</span>
                        </h1>
                        <p className="text-xl opacity-90 mb-10 leading-relaxed">
                            Connect with verified {service.name} experts and Chartered Accountant freelancers in {city} for fast, reliable, and affordable compliance services.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/?signup=true" className="px-8 py-4 bg-[#ED6E3F] hover:bg-[#d55d32] text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1">
                                Hire Expert in {city}
                            </Link>
                            <Link to="/services" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-all">
                                View All Services
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                             initial={{ opacity: 0, x: -30 }}
                             whileInView={{ opacity: 1, x: 0 }}
                             viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-[#043E52] mb-6">
                                Why hire a {service.name} in {city} from ShineFiling?
                            </h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Our platform brings the best professional expertise right to your doorstep in {city}. Whether you're a startup, a small business, or an individual, our network of {city}-based Chartered Accountants ensures that your compliance needs are met with precision and transparency.
                            </p>
                            <div className="space-y-4">
                                {[
                                    '100% ICAI Verified Professionals',
                                    'Dedicated Support for Businesses in ' + city,
                                    'Secure & Paperless Digital Process',
                                    'Affordable and Transparent Pricing',
                                    'Fastest Turnaround Time Guaranteed'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="text-emerald-500" size={20} />
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
                        >
                            <h3 className="text-xl font-bold text-[#043E52] mb-6 leading-tight">
                                Get a Free Consultation from a {service.name} in {city}
                            </h3>
                            <form className="space-y-4">
                                <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#ED6E3F] transition-all outline-none" />
                                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#ED6E3F] transition-all outline-none" />
                                <input type="tel" placeholder="Mobile Number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#ED6E3F] transition-all outline-none" />
                                <textarea placeholder="How can we help you?" rows="3" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#ED6E3F] transition-all outline-none"></textarea>
                                <button type="button" className="w-full py-4 bg-[#043E52] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all">
                                    Send Inquiry
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Service Details Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#043E52] mb-4">Complete SEO Compliance for {city}</h2>
                        <p className="text-slate-500">Trusted by over 10,000+ happy clients across Pan India</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: 'Secure Filing', desc: 'Secure data encryption for all your financial documents in ' + city + '.' },
                            { icon: Zap, title: 'Instant Filing', desc: 'Fastest ITR and GST filing service available for professionals in ' + city + '.' },
                            { icon: Globe, title: 'Pan India Support', desc: 'Expertise across India with local assistance in ' + city + '.' }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all">
                                <item.icon className="text-[#ED6E3F] mb-6" size={32} />
                                <h4 className="text-xl font-bold text-[#043E52] mb-3">{item.title}</h4>
                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Cities Section */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl font-bold text-[#043E52] mb-10">Our Presence in Other Cities</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {TOP_CITIES.slice(0, 30).map((otherCity, i) => (
                            <Link
                                key={i}
                                to={`/${service.id}-${otherCity.toLowerCase().replace(/ /g, '-')}`}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:text-[#ED6E3F] hover:border-[#ED6E3F] transition-all"
                            >
                                {service.name} in {otherCity}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Link to="/services" className="text-[#043E52] font-bold hover:underline flex items-center justify-center gap-2">
                           Explore More <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DynamicSEOPage;
