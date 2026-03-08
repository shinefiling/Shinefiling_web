
// Smart Chatbot Logic for ShineFiling - Comprehensive Knowledge Base
// Handles extensive queries for Clients, Agents, and Guests

const BUSINESS_HOURS = "9:00 AM - 7:00 PM (Mon-Sat)";
const SUPPORT_EMAIL = "support@shinefiling.com";
const SUPPORT_PHONE = "+91-7639227019";

// --- Helper for Dynamic Links ---
const getLink = (path, text) => `<a href="${path}" style="color: #4da6ff; text-decoration: underline;">${text}</a>`;

const KNOWLEDGE_BASE = {
    // 1. GUEST / GENERAL (Login, Signup, About)
    common: [
        {
            keywords: ['hello', 'hi', 'hey', 'greetings', 'start', 'menu'],
            response: "Hello! Welcome to ShineFiling. I can help you with:\n1. Is registration required?\n2. Services & Pricing\n3. Application Status\n4. Contact Support\n\nHow can I assist you today?"
        },
        {
            keywords: ['contact', 'support', 'number', 'phone', 'call', 'talk'],
            response: `You can reach our premium support team at ${SUPPORT_EMAIL} or call us at ${SUPPORT_PHONE} during ${BUSINESS_HOURS}.`
        },
        {
            keywords: ['login', 'signin', 'cant login', 'password', 'forgot'],
            response: "Having trouble logging in? Click 'Forgot Password' on the login page to reset it. If you don't have an account, please sign up first."
        },
        {
            keywords: ['register', 'signup', 'create account', 'join'],
            response: `You can create a free account to track applications and get agent benefits. ${getLink('/signup', 'Click here to Sign Up')}.`
        },
        {
            keywords: ['location', 'address', 'office'],
            response: "Our registered office is located in Chennai, Tamil Nadu. However, we serve clients completely online across all of India!"
        },
        {
            keywords: ['thank', 'thanks', 'good', 'cool', 'ok', 'bye'],
            response: "You're welcome! Feel free to ask if you need anything else. Have a great day!"
        }
    ],

    // 2. AGENT SPECIFIC (Earnings, KYC, Commission)
    agent: [
        {
            keywords: ['withdraw', 'payout', 'money', 'payment', 'encash'],
            response: "To withdraw your earnings:\n1. Go to 'Earnings' tab.\n2. Ensure your Wallet Balance is > ₹500.\n3. Click 'Withdraw Funds'.\n\nNote: Your KYC must be verified first."
        },
        {
            keywords: ['commission', 'earn', 'rate', 'much', 'salary'],
            response: "Agents earn high commissions!\n- **Company Reg**: ₹2000 per referral\n- **GST/TM**: ₹500 per referral\n- **Bonus**: Extra rewards for 10+ filings/month."
        },
        {
            keywords: ['kyc', 'verification', 'document', 'pan', 'aadhaar'],
            response: "Agent KYC is mandatory for payouts. Please upload your PAN and Aadhaar in the 'Settings' tab. Verification takes 24-48 hours."
        },
        {
            keywords: ['refer', 'link', 'code', 'invite', 'share'],
            response: "Your unique Referral Link is available on your Dashboard. Share it with clients—when they file, you earn automatically!"
        },
        {
            keywords: ['pending', 'status', 'approval', 'review'],
            response: "If your KYC or Payout is pending, our admin team is reviewing it. This usually clears within 1 business day."
        },
        {
            keywords: ['bank', 'account', 'ifsc', 'update'],
            response: "You can update your Bank Account details in the 'Profile & Settings' tab to receive payouts directly."
        }
    ],

    // 3. CLIENT SPECIFIC (Services, Docs, Pricing, Status)
    client: [
        // --- Application Status ---
        {
            keywords: ['status', 'track', 'progress', 'where is my'],
            response: "You can track your real-time application status in the 'My Applications' tab. We also send SMS/Email updates at every step."
        },

        // --- Company Registration ---
        {
            keywords: ['pvt ltd', 'private limited', 'company registration', 'incorporation'],
            response: "Private Limited is best for startups raising funds.\n**Cost**: Starting ₹6,999\n**Docs**: PAN, Aadhaar, Photo, Bank Statement, Rent Agreement/NOC.\n**Time**: 7-10 Days."
        },
        {
            keywords: ['llp', 'liability partnership'],
            response: "LLP (Limited Liability Partnership) is simpler than a Pvt Ltd.\n**Cost**: Starting ₹3,999\n**Docs**: PAN, Aadhaar of Partners + Office Proof.\n**Time**: 7-10 Days."
        },
        {
            keywords: ['opc', 'one person'],
            response: "One Person Company (OPC) is for single owners wanting limited liability.\n**Cost**: Starting ₹5,999\n**Time**: 7-10 Days."
        },

        // --- GST & Tax ---
        {
            keywords: ['gst', 'tax', 'goods and service'],
            response: "GST Registration is mandatory if turnover > ₹20L (Services) or ₹40L (Goods).\n**Cost**: ₹1,499\n**Docs**: PAN, Aadhaar, Photo, Electricity Bill, Rent Agreement."
        },
        {
            keywords: ['itr', 'income tax', 'return'],
            response: "We file Income Tax Returns (ITR) for individuals and businesses.\n**Cost**: Starting ₹999 for Salaried, ₹2,499 for Business."
        },

        // --- Trademark & IP ---
        {
            keywords: ['trademark', 'brand', 'logo', 'copyright', 'ip'],
            response: "Protect your Brand Name/Logo with Trademark Registration.\n**Cost**: ₹1,999 + Govt Fees\n**Docs**: Logo Image, Signed Authorization (Form 48), MSME (optional for discount)."
        },

        // --- Licenses ---
        {
            keywords: ['fssai', 'food', 'license', 'eating'],
            response: "FSSAI License is mandatory for all food businesses.\n- **Registration**: ₹1,999 (Basic)\n- **State License**: ₹4,999\n- **Central**: Call for quote."
        },
        {
            keywords: ['isc', 'import', 'export', 'code', 'iec'],
            response: "Import Export Code (IEC) is mandatory for global trade.\n**Cost**: ₹2,999\n**Validity**: Lifetime (No renewals)."
        },
        {
            keywords: ['dsc', 'digital signature', 'token'],
            response: "DSC (Class 3) is required for company filings and GST.\n**Cost**: ₹1,499 (includes USB Token breakdown & courier)."
        },

        // --- Startup ---
        {
            keywords: ['startup', 'india', 'recognition', 'dpiit'],
            response: "Startup India Recognition offers tax holidays & angel tax exemptions.\n**Cost**: ₹4,999\n**Eligibility**: Pvt Ltd/LLP < 10 years old."
        },

        // --- Payments & Refunds ---
        {
            keywords: ['price', 'cost', 'fee', 'charges', 'payment'],
            response: "Our pricing is transparent with no hidden costs. You can check the specific service page for a detailed breakdown or ask me about a specific service!"
        },
        {
            keywords: ['refund', 'cancel', 'money back'],
            response: "Refunds are processed only if the work hasn't started. Once government fees are paid, they are non-refundable. Email support@shinefiling.com for help."
        },

        // --- ROC COMPLIANCE ---
        {
            keywords: ['annual return', 'roc filing', 'mgt-7', 'aoc-4'],
            response: "All companies must file Annual Returns (AOC-4 & MGT-7) yearly to avoid penalties.\n**Due Date**: Oct/Nov every year.\n**Late Fee**: ₹100 per day."
        },
        {
            keywords: ['director kyc', 'dir-3', 'din kyc'],
            response: "Director KYC (DIR-3 KYC) is mandatory for every DIN holder yearly.\n**Deadline**: 30th September.\n**Penalty**: ₹5,000 if missed."
        },
        {
            keywords: ['add director', 'remove director', 'resign director'],
            response: "We can help you Add or Remove a Director.\n**Docs**: DIR-12, Resignation Letter/Consent Letter, Digital Signature."
        },
        {
            keywords: ['change address', 'registered office', 'shift office'],
            response: "Shifting Registered Office?\n- **Within City**: Simple Board Resolution.\n- **Within State**: Form INC-22.\n- **Inter-State**: Central Govt Approval needed."
        },
        {
            keywords: ['share transfer', 'transfer shares'],
            response: "Share Transfer requires Form SH-4 and Stamp Duty payment (0.25% of value). We handle the entire drafting and ROC filing process."
        },
        {
            keywords: ['close company', 'strike off', 'shut down', 'wind up'],
            response: "To close a company (Strike Off), we file Form STK-2. The company must have Nil assets and liabilities before filing."
        },

        // --- LEGAL DRAFTING ---
        {
            keywords: ['rent agreement', 'rental', 'lease'],
            response: "We draft legally valid Rent Agreements.\n- **11 Months**: standard (Notarized).\n- **>1 Year**: Registered Rent Agreement is mandatory."
        },
        {
            keywords: ['partnership deed', 'deed'],
            response: "A Partnership Deed is the constitution of your firm. We draft detailed deeds covering profit ratio, capital, duties, and dispute resolution."
        },
        {
            keywords: ['nda', 'non disclosure', 'confidential'],
            response: "Protect your trade secrets with a robust Non-Disclosure Agreement (NDA). Essential before sharing ideas with investors or employees."
        },
        {
            keywords: ['shareholder agreement', 'founders agreement', 'co-founder'],
            response: "Starting a startup? a Founders' Agreement is crucial to define roles, equity split, and exit clauses clearly."
        },

        // --- CERTIFICATIONS ---
        {
            keywords: ['msme', 'udyam', 'ssi', 'small business'],
            response: "MSME/Udyam Registration is Free & Paperless!\n**Benefits**: Interest subsidy, Collateral-free loans, Protection against delayed payments."
        },
        {
            keywords: ['iso', '9001', 'certification'],
            response: "ISO Certification (9001:2015) builds trust with customers.\n**Cost**: Starting ₹2,999\n**Time**: 2-3 Days."
        },
        {
            keywords: ['barcode', 'ean', 'gtin'],
            response: "We provide GS1 Barcode registration for your retail products. Essential for selling on Amazon/Flipkart or in supermarkets."
        },

        // --- FINANCIAL SERVICES ---
        {
            keywords: ['cma data', 'loan report', 'credit'],
            response: "CMA Data (Credit Monitoring Arrangement) is required for Bank Loans/CC limits. Our CAs prepare detailed projections for approval."
        },
        {
            keywords: ['project report', 'bank loan'],
            response: "Need a Bank Loan? We create comprehensive Project Reports covering feasibility, financials, and market analysis."
        },
        {
            keywords: ['valuation', 'business value'],
            response: "Registered Valuer Reports are needed for investment rounds or share transfers. We offer DCF and Net Asset Value methods."
        },

        // --- LABOUR LAW ---
        {
            keywords: ['pf', 'epf', 'provident fund'],
            response: "PF Registration is mandatory if you have 20+ employees.\n**Employee**: 12% deduction.\n**Employer**: 12% contribution."
        },
        {
            keywords: ['esi', 'insurance'],
            response: "ESI is mandatory for employees earning < ₹21,000/month. Provides full medical cover for the employee and family."
        },
        {
            keywords: ['shop act', 'gumasta', 'labor license'],
            response: "Shop & Establishment License is the basic state license for any shop/office. Required for opening a Bank Account."
        },
        // --- DEEP DIVE: COMPANY REGISTRATION ---
        {
            keywords: ['din', 'director identification number'],
            response: "DIN is a unique 8-digit number assigned to directors. It is lifetime valid. You need a DIN to become a director in any company."
        },
        {
            keywords: ['moa', 'aoa', 'memorandum', 'articles'],
            response: "**MOA**: Defines the company's objective (what it can do).\n**AOA**: Defines the internal rules (how it operates).\nBoth are mandatory for Pvt Ltd/LLP."
        },
        {
            keywords: ['authorized capital', 'paid up capital', 'share capital'],
            response: "**Authorized Capital**: Max shares a company can issue.\n**Paid-up Capital**: Actual money invested by shareholders.\nYou can increase Authorized Capital later by filing SH-7."
        },
        {
            keywords: ['pvt ltd vs llp', 'difference', 'better'],
            response: "**Pvt Ltd**: Best for funding & scalability. Higher compliance.\n**LLP**: Cheaper, less compliance, but harder to raise VC funds.\nChoose Pvt Ltd for start-ups, LLP for services/family biz."
        },

        // --- DEEP DIVE: GST & TAX ---
        {
            keywords: ['gst composition', 'composition scheme'],
            response: "Composition Scheme is for small businesses (turnover < ₹1.5 Cr). You pay a lower fixed rate (1% for traders/manufacturers) but **cannot claim Input Tax Credit**."
        },
        {
            keywords: ['gst penalty', 'late fee', 'gst interest'],
            response: "**Late Fee**: ₹50/day for Normal Returns, ₹20/day for Nil Returns.\n**Interest**: 18% p.a. on unpaid tax liability."
        },
        {
            keywords: ['nil return', 'zero return'],
            response: "Even if you have no sales, you **MUST** file a Nil GST Return to avoid the ₹20/day penalty."
        },
        {
            keywords: ['tds', 'tax deducted at source'],
            response: "TDS must be deducted on payments like Rent (>₹50k), Professional Fees (>₹30k), etc. It must be deposited by the 7th of next month."
        },

        // --- TRADEMARK & IP ADVANCED ---
        {
            keywords: ['tm objection', 'objected', 'trademark status'],
            response: "Status 'Objected' means the Registrar has queries about your brand (similarity, distinctiveness). We must file a legal reply within 30 days to save your brand."
        },
        {
            keywords: ['tm class', 'trademark class'],
            response: "There are 45 classes.\n- **Class 35**: Advertising/Business Mgmt\n- **Class 25**: Clothing\n- **Class 42**: IT Services\nTell me your business, I'll suggest the class!"
        },
        {
            keywords: ['copyright vs trademark', 'difference tm'],
            response: "**Trademark**: Protects Brand Name & Logo.\n**Copyright**: Protects Content (Software, Books, Music, Art).\n**Patent**: Protects Inventions."
        },

        // --- POST-INCORPORATION COMPLIANCE ---
        {
            keywords: ['bank account', 'opening', 'current account'],
            response: "After incorporation, you must open a Current Bank Account. We provide introductions to partner banks (HDFC, ICICI, Axis) for zero-balance startup accounts."
        },
        {
            keywords: ['auditor', 'adt-1', 'first auditor'],
            response: "Every Pvt Ltd company must appoint a Statutory Auditor within 30 days of incorporation by filing Form ADT-1. Penalties apply for delay."
        },
        {
            keywords: ['commencement of business', 'inc-20a'],
            response: "Form INC-20A must be filed within 180 days of incorporation. It confirms that shareholders have deposited their capital in the bank money."
        },

        // --- TRUST & SAFETY ---
        {
            keywords: ['data privacy', 'secure', 'confidential'],
            response: "Your data is 100% secure. We use 256-bit encryption and never share client data with third parties without consent. We also sign NDAs upon request."
        },
        {
            keywords: ['hidden charges', 'extra cost'],
            response: "ShineFiling has a strict **No Hidden Fees** policy. The price you see includes Govt Fees + Professional Fees. Stamp duty varies by state (actuals)."
        },
        {
            keywords: ['visit', 'meet', 'offline'],
            response: "We are a digital-first platform to save you time and money. However, you can visit our Chennai HQ by appointment for high-value consultations."
        },

        // --- TROUBLESHOOTING ---
        {
            keywords: ['payment failed', 'transaction failed', 'money deducted'],
            response: "If money was deducted but payment failed, don't worry! It will be auto-refunded in 5-7 days. Or share the transaction ID at support@shinefiling.com."
        },
        {
            keywords: ['upload issue', 'document size', 'cant upload'],
            response: "Documents should be under 5MB (PDF/JPG). If you face issues, you can email them directly to your assigned agent or support@shinefiling.com."
        }
    ]
};

/**
 * Enhanced Logic to find the best match for user query
 */
export const getBotResponse = (message, role = 'user') => {
    const lowerMsg = message.toLowerCase().trim();

    // 0. Emergency/Direct Fallbacks
    if (lowerMsg.length < 2) return "Could you please elaborate?";

    // 1. Check Common Knowledge (Available to ALL)
    for (const item of KNOWLEDGE_BASE.common) {
        if (item.keywords.some(k => lowerMsg.includes(k))) {
            return formatResponse(item.response);
        }
    }

    // 2. Check Role-Specific Knowledge (High Priority)
    const roleKey = role === 'AGENT' ? 'agent' : 'client';
    // If user is GUEST (not logged in), treat as CLIENT for informational purposes
    const targetBase = role === 'GUEST' ? 'client' : roleKey;

    for (const item of KNOWLEDGE_BASE[targetBase]) {
        if (item.keywords.some(k => lowerMsg.includes(k))) {
            return formatResponse(item.response);
        }
    }

    // 3. Cross-Role Knowledge (e.g., Agent asking about Service Pricing)
    // If agent asks about "GST", they should get the client answer if no agent answer exists
    if (role === 'AGENT') {
        for (const item of KNOWLEDGE_BASE.client) {
            if (item.keywords.some(k => lowerMsg.includes(k))) {
                return formatResponse(`(On behalf of Client): ${item.response}`);
            }
        }
    }

    // 4. Default Fallback with Context
    const fallback = "I'm not sure about that. \n\nYou can ask me about:\n- Services (Private Ltd, GST, Trademark)\n- Pricing & Documents\n- Application Status\n- Contacting Support";
    return formatResponse(fallback);
};

// Helper to format text -> HTML
const formatResponse = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
        .replace(/\n/g, '<br/>'); // Newlines
};
