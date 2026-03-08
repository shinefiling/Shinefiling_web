import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { SERVICE_DATA } from '../data/services';
import AuthContext from '../context/AuthContext';

const XIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z" />
    </svg>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    // Fallback if auth is null (should not verify happen if wrapped in Provider)
    const isLoggedIn = auth ? auth.isLoggedIn : false;

    if (!auth) {
        console.warn('Footer: AuthContext is null. Ensure Footer is wrapped in AuthProvider.');
    }

    // Helper to get slug
    const getServiceSlug = (name) => {
        const normalize = (str) =>
            str.toLowerCase().replace(/[^a-z0-9]/g, '');

        const map = {
            "privatelimitedcompanyregistration": "business-registration/private-limited-company",
            "privatecompany": "business-registration/private-limited-company",
            "onepersoncompanyopcregistration": "business-registration/one-person-company",
            "limitedliabilitypartnershipllpregistration": "business-registration/llp-registration",
            "partnershipfirmregistration": "business-registration/partnership-firm",
            "soleproprietorshipregistration": "business-registration/sole-proprietorship",
            "section8ngocompanyregistration": "business-registration/section-8-company",
            "nidhicompanyregistration": "business-registration/nidhi-company-registration",
            "producercompanyregistration": "business-registration/producer-company-registration",
            "publiclimitedcompanyregistration": "business-registration/public-limited-company",
            "indiansubsidiaryregistration": "business-registration/indian-subsidiary-registration",
            "foreigncompanyregistrationindia": "business-registration/foreign-company-registration",
            "startupincorporationadvisory": "business-registration/startup-incorporation-advisory",

            "gstregistration": "tax-compliance/gst-registration",
            "gstamendmentcorrection": "tax-compliance/gst-amendment",
            "gstmonthlyreturngstr1": "gst-return/gstr-1",
            "gstmonthlyreturngstr3b": "gst-return/gstr-3b",
            "gstannualreturngstr9": "tax_compliance/gst-annual-return",
            "gstauditgstr9c": "tax-compliance/gst-audit",
            "gstcancellation": "tax-compliance/gst-cancellation",
            "gstcancellationbusinessclosure": "tax-compliance/gst-cancellation",

            "incometaxreturnitr1": "income-tax/itr-1",
            "incometaxreturnitr2": "income-tax/itr-2",
            "incometaxreturnitr3": "income-tax/itr-3",
            "incometaxreturnitr4": "income-tax/itr-4",
            "incometaxreturnitr567": "income-tax/itr-5-6-7",

            "tdsreturnfiling": "tax-compliance/tds-return-filing",
            "professionaltaxregreturn": "tax-compliance/professional-tax",
            "advancetaxfiling": "tax-compliance/advance-tax",
            "taxauditfiling": "tax-compliance/tax-audit",

            "annualrocfilingaoc4": "roc-filing/annual-return",
            "annualrocfilingmgt7": "roc-filing/annual-return",
            "directorkycdir3kyc": "roc-filing/director-kyc",
            "adddirector": "roc-filing/add-remove-director",
            "removedirector": "roc-filing/add-remove-director",
            "changeregisteredoffice": "roc-filing/change-registered-office",
            "sharetransferfiling": "roc-filing/share-transfer",
            "increaseauthorizedcapital": "roc-filing/increase-authorized-capital",
            "moaamendment": "roc-filing/moa-amendment",
            "aoaamendment": "roc-filing/aoa-amendment",
            "companynamechange": "roc-filing/company-name-change",
            "strikeoffcompany": "roc-filing/strike-off-company",

            "fssairegistrationbasic": "licenses/fssai-license",
            "fssailicensestate": "licenses/fssai-license",
            "fssailicensecentral": "licenses/fssai-central-license",
            "fssairenewal": "licenses/fssai-renewal",
            "fssaicorrection": "licenses/fssai-license",
            "shopestablishmentlicense": "licenses/shop-establishment-license",
            "tradelicense": "licenses/trade-license",
            "labourlicense": "licenses/labour-license",
            "factorylicense": "licenses/factory-license",
            "druglicense": "licenses/drug-license",
            "firesafetynoc": "licenses/fire-safety-noc",
            "pollutioncontrolctecto": "licenses/pollution-control",
            "importexportcodeiec": "licenses/import-export-code",
            "gumasthalicense": "licenses/gumastha-license",
            "barliquorlicense": "licenses/bar-liquor-license",

            "trademarkregistration": "intellectual-property/trademark-registration",
            "trademarkobjectionreply": "intellectual-property/trademark-objection",
            "trademarkhearingsupport": "intellectual-property/trademark-hearing",
            "trademarkhearingrepresentation": "intellectual-property/trademark-hearing",
            "trademarkassignment": "intellectual-property/trademark-assignment",
            "trademarkrenewal": "intellectual-property/trademark-renewal",
            "copyrightregistration": "intellectual-property/copyright-registration",
            "patentfilingprovisionalcomplete": "intellectual-property/patent-filing",
            "patentprovisionalfiling": "intellectual-property/patent-provisional",
            "patentcompletefiling": "intellectual-property/patent-complete",
            "designregistration": "intellectual-property/design-registration",

            "pfregistrationfiling": "labour/pf-registration",
            "pfregistration": "labour/pf-registration",
            "pffiling": "labour/pf-filing",
            "pfreturnfiling": "labour/pf-filing",
            "esiregistrationfiling": "labour/esi-registration",
            "esiregistration": "labour/esi-registration",
            "esifiling": "labour/esi-filing",
            "esireturnfiling": "labour/esi-filing",
            "professionaltaxfiling": "labour/professional-tax-filing",
            "labourwelfarefundfiling": "labour/labour-welfare-fund",
            "payrollcompliance": "labour/payroll-compliance",
            "gratuityactregistration": "labour-law/gratuity-act",
            "bonusactcompliance": "labour-law/bonus-act",
            "minimumwagescompliance": "labour-law/minimum-wages",

            "msmeudyamregistration": "business-certifications/msme-registration",
            "isocertification90011400127001": "business-certifications/iso-certification",
            "startupindiaregistration": "business-certifications/startup-india",
            "digitalsignaturecertificatedsc": "business-certifications/digital-signature",
            "barcodegs1registration": "business-certifications/bar-code",
            "panapplication": "business-certifications/tan-pan",
            "tanapplication": "business-certifications/tan-pan",

            "partnershipdeeddrafting": "legal-drafting/partnership-deed",
            "foundersagreement": "legal-drafting/founders-agreement",
            "shareholdersagreement": "legal-drafting/shareholders-agreement",
            "employmentagreement": "legal-drafting/employment-agreement",
            "rentleaseagreement": "legal-drafting/rent-agreement",
            "franchiseagreement": "legal-drafting/franchise-agreement",
            "ndanondisclosureagreement": "legal-drafting/nda",
            "vendorserviceagreement": "legal-drafting/vendor-agreement",

            "legalnoticedrafting": "legal-notices/legal-notice-drafting",
            "replytolegalnotice": "legal-notices/reply-to-legal-notice",
            "chequebouncenoticesection138": "legal-notices/cheque-bounce-notice",
            "gstincometaxnoticereply": "legal-notices/tax-notice-reply",
            "rocnoticereply": "legal-notices/roc-notice-reply",

            "pancorrection": "corrections/pan-correction",
            "gstcertificatecorrection": "corrections/gst-correction",
            "fssailicensecorrection": "corrections/fssai-correction",
            "companyllpdetailcorrection": "corrections/company-llp-correction",
            "dindsccorrection": "corrections/din-dsc-correction",

            "llpclosure": "business-closure/llp-closure",
            "proprietorshipclosure": "business-closure/proprietorship-closure",
            "fssailicensecancellation": "business-closure/fssai-cancellation",

            "cmadatapreparation": "financial-services/cma-data-preparation",
            "projectreportforbankloan": "financial-services/project-report",
            "bankloandocumentation": "financial-services/bank-loan-documentation",
            "cashflowcompliance": "financial-services/cash-flow-compliance",
            "startuppitchdeck": "financial-services/startup-pitch-deck",
            "businessvaluation": "financial-services/business-valuation",
            "virtualcfoservices": "financial-services/virtual-cfo",
            "cashflowstatement": "financial-services/cash-flow-compliance",
        };
        const key = normalize(name);
        return map[key] || "services/apply";
    };

    // Organized Columns Logic
    const columns = [
        {
            title: "Company",
            items: [
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about-us" },
                { label: "Career", to: "/careers" },
                { label: "Contact", to: "/contact-us" },
                { label: "Terms & Conditions", to: "/terms-and-conditions" },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Refund Policy", to: "/refund-policy" }
            ]
        },
        {
            title: "Start Business",
            items: [...SERVICE_DATA.business_reg.items, ...SERVICE_DATA.closure.items]
        },
        {
            title: "Tax & Compliance",
            items: [...SERVICE_DATA.tax_compliance.items, ...SERVICE_DATA.roc_compliance.items, ...SERVICE_DATA.financial.items]
        },
        {
            title: "Licenses & IP",
            items: [...SERVICE_DATA.licenses.items, ...SERVICE_DATA.ipr.items, ...SERVICE_DATA.certifications.items]
        },
        {
            title: "Legal & HR",
            items: [...SERVICE_DATA.legal.items, ...SERVICE_DATA.labour_hr.items, ...SERVICE_DATA.legal_notices.items, ...SERVICE_DATA.corrections.items]
        }
    ];

    return (
        <footer className="bg-white pt-20 pb-10 text-slate-900 font-sans relative overflow-hidden border-t border-slate-100">
            {/* Subtle Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ED6E3F]/20 to-transparent"></div>

            <div className="max-w-[1700px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-8 text-sm mb-20">

                {/* BRAND COLUMN */}
                <div className="xl:col-span-3 space-y-8">
                    <Link to="/" className="inline-block group">
                        <img
                            src="/logo.png"
                            alt="ShineFiling"
                            className="h-20 md:h-32 w-auto object-contain hover:opacity-90 transition-opacity"
                        />
                    </Link>

                    <div className="space-y-4">
                        <p className="text-slate-500 leading-relaxed text-sm font-light max-w-xs">
                            India's premier marketplace connecting businesses with elite freelance Chartered Accountants and legal professionals. Simplified compliance, expert-driven growth.
                        </p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-slate-600 group cursor-pointer hover:text-[#043E52] transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-[#ED6E3F]/10 group-hover:text-[#ED6E3F] transition-all">
                                    <Mail size={14} />
                                </div>
                                <span className="text-xs">support@shinefiling.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 group cursor-pointer hover:text-[#043E52] transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-[#ED6E3F]/10 group-hover:text-[#ED6E3F] transition-all">
                                    <Phone size={14} />
                                </div>
                                <span className="text-xs">+91 7639227019</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {[Instagram, XIcon, Linkedin, Facebook].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#ED6E3F] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* DYNAMIC COLUMNS */}
                <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12">
                    {columns.map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-6">
                            <h4 className="text-[#043E52] font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ED6E3F]"></span>
                                {col.title}
                            </h4>
                            <ul className="space-y-3.5">
                                {col.items.slice(0, 15).map((item, i) => {
                                    let label, linkTo;
                                    if (typeof item === 'object') {
                                        label = item.label;
                                        linkTo = item.to;
                                    } else {
                                        label = item;
                                        const slug = getServiceSlug(item);
                                        linkTo = slug.startsWith('http') ? slug : `/services/${slug}`;
                                    }
                                    return (
                                        <li key={i}>
                                            <FooterLink to={linkTo} label={label} />
                                        </li>
                                    );
                                })}
                                {col.items.length > 15 && (
                                    <li>
                                        <button
                                            onClick={() => {
                                                if (isLoggedIn) navigate('/dashboard/new-filings');
                                                else navigate('/?login=true');
                                            }}
                                            className="text-[#ED6E3F] hover:text-[#043E52] text-xs font-bold flex items-center gap-1.5 transition-colors group"
                                        >
                                            View {col.items.length - 15} more <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-center items-center gap-6 text-xs text-slate-500 font-medium">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
                        <p>&copy; {currentYear} Newfu Technology Private Limited.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, label }) => (
    <Link to={to} className="text-slate-500 hover:text-[#043E52] transition-all text-[13px] font-medium flex items-center group leading-snug">
        <span className="w-0 group-hover:w-2 h-0.5 bg-[#ED6E3F] mr-0 group-hover:mr-2 transition-all duration-300"></span>
        <span className="group-hover:translate-x-0.5 transition-transform duration-300">{label}</span>
    </Link>
);

export default Footer;
