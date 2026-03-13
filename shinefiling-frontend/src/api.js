// Dynamic Base URL to support both Localhost and Network Devices
const getBaseUrl = () => {
    // 1. Priority: Environment Variable from Vite .env files
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // 2. Production: Use relative path if we are on a domain to avoid mixed content errors
    if (hostname.includes('shinefiling.com') || (hostname.includes('.') && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname))) {
        return '/api';
    }

    // 3. Localhost: Use localhost backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080/api';
    }

    // 4. Fallback: For Network-based (IP) access during dev
    return `${protocol}//${hostname}:8080/api`;
};

export const BASE_URL = getBaseUrl();
export const RAZORPAY_KEY_ID = "rzp_live_SQJW4OPyfqhWwH"; // Update this with your live key

// Helper for handling responses
const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Unauthorized: Please login again.");
        }
        let errorMessage = `API Request Failed: ${response.status}`;
        try {
            const text = await response.text();
            // Try to parse JSON from text if possible, otherwise use text
            try {
                const json = JSON.parse(text);
                errorMessage = json.message || errorMessage;
            } catch {
                if (text) errorMessage = text;
            }
        } catch (e) {
            // Ignore text read error
        }
        throw new Error(errorMessage);
    }

    // Success, try parsing JSON
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.warn("Response parsing failed", error);
        return null;
    }
};

// Helper to get auth headers
const getAuthHeaders = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return { 'Content-Type': 'application/json' };

        const user = JSON.parse(userStr);
        // Try common token fields
        const token = user.token || user.accessToken || user.jwt || user.access_token || user.id_token || (typeof user === 'string' ? user : null);

        if (token) {
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
        }
    } catch (e) {
        console.error("Error reading auth token", e);
    }
    return { 'Content-Type': 'application/json' };
};

// --- AUTHENTICATION ---

export const signupUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Login API Error:", error);
        throw error;
    }
};

export const googleLogin = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Google Login API Error:", error);
        throw error;
    }
};

export const verifyOtp = async (data) => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const resendOtp = async (email) => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

export const forgotPassword = async (email) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

export const resetPassword = async (data) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};



// --- FILE UPLOAD ---

export const uploadFile = async (file, category = "others") => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    // Manually construct headers to exclude Content-Type (let browser set it with boundary)
    const userStr = localStorage.getItem('user');
    let headers = {};
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const token = user.token || user.accessToken || user.jwt || user.access_token || user.id_token || ((typeof user === 'string') ? user : null);
            if (token) headers['Authorization'] = `Bearer ${token}`;
        } catch (e) { }
    }

    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const getUserDocuments = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${email}/documents`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch user documents", e);
    }
    return [];
};

export const uploadUserDocument = async (email, file, category, name) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (name) formData.append('name', name);

    // Manually construct headers to exclude Content-Type
    const userStr = localStorage.getItem('user');
    let headers = {};
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const token = user.token || user.accessToken || user.jwt || user.access_token || user.id_token || ((typeof user === 'string') ? user : null);
            if (token) headers['Authorization'] = `Bearer ${token}`;
        } catch (e) { }
    }

    const response = await fetch(`${BASE_URL}/users/${email}/documents`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};


// --- SERVICE REQUESTS ---


export const getServiceCatalog = async () => {
    const response = await fetch(`${BASE_URL}/admin/services`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const submitServiceRequest = async (requestData) => {
    const response = await fetch(`${BASE_URL}/services/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

// --- BUSINESS REGISTRATION SERVICE REQUESTS ---
export const submitPrivateLimitedRegistration = async (requestData) => {
    // Controller: PrivateLimitedCompanyController, Route: /api/service/private-limited-company/apply
    const response = await fetch(`${BASE_URL}/service/private-limited-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePrivateLimitedStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/private-limited-company/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitOnePersonCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/one-person-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateOnePersonCompanyStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/one-person-company/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitLlpRegistration = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/llp/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const updateLlpStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/llp/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitPartnershipFirmRegistration = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/partnership/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

// Also exported as 'submitPartnershipRegistration' for component compatibility
export const submitPartnershipRegistration = submitPartnershipFirmRegistration;

export const updatePartnershipStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/partnership/${id}/status`, {
        method: 'POST', // or PUT depending on Controller
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitProprietorshipRegistration = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/proprietorship/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const updateProprietorshipStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/proprietorship/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitSection8Registration = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/section8/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const submitSection8CompanyRegistration = submitSection8Registration;

export const updateSection8Status = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/section8/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitNidhiRegistration = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/nidhi/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const updateNidhiStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/nidhi/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitProducerRegistration = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/producer/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const updateProducerStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/producer/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitPublicLimitedRegistration = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/public-limited/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const updatePublicLimitedStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/public-limited/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitGstRegistration = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/gst-registration/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const updateGstStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/gst/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitGstAmendment = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-amendment/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitGstCancellation = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-cancellation/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitGstAudit = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-audit/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitGstMonthlyReturn = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-monthly-return/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateGstMonthlyReturnStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/gst-monthly-return/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitGstAnnualReturn = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-annual-return/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitIncomeTaxReturn = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/income-tax-return/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateGstAnnualReturnStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/gst-annual/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitSoleProprietorshipRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/sole-proprietorship/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};



export const submitNidhiCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/nidhi-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitProducerCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/producer-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};



export const submitPublicLimitedCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/public-limited-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitIndianSubsidiaryRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/indian-subsidiary/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitForeignCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/foreign-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitStartupAdvisoryRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/startup-advisory/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};








export const updateIncomeTaxReturnStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/income-tax-return/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitTdsReturn = async (formData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/service/tds-return/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};

export const updateTdsReturnStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/tds-return/${id}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};








export const submitAdvanceTax = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/advance-tax/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitTaxAudit = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/tax-audit/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitAnnualRocFiling = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/annual-roc-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitDirectorKyc = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/director-kyc/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitAddRemoveDirector = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/add-remove-director/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitChangeRegisteredOffice = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/change-registered-office/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitShareTransfer = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/share-transfer-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitIncreaseAuthorizedCapital = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/increase-authorized-capital/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitMoaAoaAmendment = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/moa-aoa-amendment/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitCompanyNameChange = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/company-name-change/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitStrikeOff = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/strike-off/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitFssaiLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/fssai-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitShopEstablishment = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/shop-establishment/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitTradeLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trade-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitLabourLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/labour-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitFactoryLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/factory-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTradeLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trade-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitDrugLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/drug-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitFireNoc = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/fire-noc/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateFactoryLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/factory-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- NEW LICENSES (Fire, IEC, Bar, Shop) ---


export const updateFireNocStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/fire-noc/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitIEC = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/iec/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateIECStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/iec/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitBarLiquor = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/bar-liquor/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateBarLiquorStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/bar-liquor/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitShopLicense = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/shop-establishment/apply?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateShopLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/shop-establishment/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- BATCH 2 LICENSES (Labour, Drug, Pollution, Gumastha) ---


export const updateLabourLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/labour-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const updateDrugLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/drug-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitPollutionControl = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/pollution-control/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePollutionControlStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/pollution-control/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitGumasthaLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gumastha-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateGumasthaLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/gumastha-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- IP SERVICES ---


export const submitTrademarkRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitTrademarkObjection = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-objection/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkObjectionStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-objection/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitTrademarkHearing = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-hearing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkHearingStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-hearing/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitTrademarkAssignment = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-assignment/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkAssignmentStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-assignment/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};



export const submitTrademarkRenewal = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-renewal/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkRenewalStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-renewal/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitCopyrightRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/copyright-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateCopyrightRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/copyright-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitPatentFiling = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/patent-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePatentFilingStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/patent-filing/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitDesignRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/design-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateDesignRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/design-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};



// --- LABOUR LAW & HR SERVICES ---


export const submitPFRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/pf-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePFRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/pf-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitPFFiling = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/pf-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePFFilingStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/pf-filing/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitESIRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/esi-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateESIRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/esi-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitESIFiling = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/esi-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateESIFilingStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/esi-filing/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};



export const submitProfessionalTax = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/labour-professional-tax/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateProfessionalTaxStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/professional-tax/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitLabourWelfareFund = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/labour-welfare-fund/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateLabourWelfareFundStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/labour-welfare-fund/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitGratuityAct = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gratuity-act/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateGratuityActStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/gratuity-act/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitBonusAct = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/bonus-act/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateBonusActStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/bonus-act/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitMinimumWages = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/minimum-wages/apply?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateMinimumWagesStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/minimum-wages/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitPayrollCompliance = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/payroll-compliance/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

// --- BUSINESS CERTIFICATIONS ---




export const submitISOCertification = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/iso-certification/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const updateISOCertificationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/iso-certification/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitStartupIndia = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/startup-india/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const updateStartupIndiaStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/startup-india/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitDigitalSignature = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/digital-signature/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const updateDigitalSignatureStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/digital-signature/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitBarCode = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/bar-code/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const updateBarCodeStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/bar-code/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitTanPan = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/tan-pan/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const updateTanPanStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/tan-pan/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitMSMERegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/msme-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateMSMERegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/msme-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const getUserApplications = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/services/my-requests?email=${encodeURIComponent(email)}`, {
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        if (Array.isArray(data)) {
            // Sort by most recent
            return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return [];
    } catch (error) {
        console.warn('Error fetching all applications:', error);
        return [];
    }
};

export const getAllApplications = async () => {
    const res = await fetch(`${BASE_URL}/services/all`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};



export const getAgentApplications = async (email) => {
    const response = await fetch(`${BASE_URL}/agent/applications?email=${encodeURIComponent(email)}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const createAgentClientApplication = async (agentId, applicationData) => {
    const response = await fetch(`${BASE_URL}/agent/applications/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            agentId,
            ...applicationData
        })
    });
    return handleResponse(response);
};

export const submitAgentKyc = async (userId, kycData) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/kyc`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(kycData),
    });
    return handleResponse(response);
};



export const approveAgentKyc = async (userId) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/approve-kyc`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const rejectAgentKyc = async (userId, reason) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/reject-kyc`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
    });
    return handleResponse(response);
};

export const deleteUser = async (userId) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// --- USER MANAGEMENT ---

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/users`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (e) {
        console.warn("Backend /auth/users failed. " + e.message);
        throw e;
    }
};

export const updateUserRole = async (userId, newRole) => {
    const response = await fetch(`${BASE_URL}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: newRole }),
    });
    return handleResponse(response);
};

export const assignAgentToRequest = async (requestId, agentId) => {
    const response = await fetch(`${BASE_URL}/services/${requestId}/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ agentId }),
    });
    return handleResponse(response);
};

export const updateApplicationStatus = async (requestId, status) => {
    const response = await fetch(`${BASE_URL}/services/${requestId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

// --- DASHBOARD STATS ---

export const getUserStats = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/stats`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch user stats", e);
    }
    return {
        activeServices: 0,
        pendingActions: 0,
        totalDocuments: 0
    };
};

// (Duplicate removal)
// (Duplicate removal)

export const getUserPayments = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/payments`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch user payments", e);
    }
    // Return empty array or mock if preferred
    return [];
};

export const updateUserProfile = async (userId, profileData) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
    });
    return handleResponse(response);
};

export const getUserById = async (userId) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const uploadProfilePicture = async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const headers = getAuthHeaders();
    delete headers['Content-Type'];

    const response = await fetch(`${BASE_URL}/users/${userId}/profile-image`, {
        method: 'POST',
        headers: headers,
        body: formData
    });
    return handleResponse(response);
};

export const requestWithdrawal = async (userId, amount) => {
    const response = await fetch(`${BASE_URL}/agent/${userId}/withdraw`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount }),
    });
    return handleResponse(response);
};

// --- SUPER ADMIN CRM APIs ---

export const broadcastRequest = async (requestId, amount, duration, description) => {
    const response = await fetch(`${BASE_URL}/super-admin/requests/${requestId}/broadcast`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount, duration, description })
    });
    return handleResponse(response);
};

export const getBidsForRequest = async (requestId) => {
    const response = await fetch(`${BASE_URL}/super-admin/requests/${requestId}/bids`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const acceptBid = async (bidId) => {
    const response = await fetch(`${BASE_URL}/super-admin/bids/${bidId}/accept`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};




// --- CA DASHBOARD APIs ---

export const getCaRequests = async (caId) => {
    const response = await fetch(`${BASE_URL}/ca/${caId}/requests`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const respondToBoundAmount = async (requestId, status, comments, files = null) => {
    // comments is technically optional in backend, but good to pass if needed
    const body = { status, comments };
    if (files) body.generatedDocuments = JSON.stringify(files);

    const response = await fetch(`${BASE_URL}/ca/requests/${requestId}/respond`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse(response);
};

export const getOpenBiddingRequests = async () => {
    const response = await fetch(`${BASE_URL}/ca/requests/open`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const submitCaBid = async (requestId, caId, amount, remarks) => {
    const response = await fetch(`${BASE_URL}/ca/requests/${requestId}/bid`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ caId, amount, remarks })
    });
    return handleResponse(response);
};

export const getCaBids = async (caId) => {
    const response = await fetch(`${BASE_URL}/ca/${caId}/bids`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getCaEmployees = async (caId) => {
    const response = await fetch(`${BASE_URL}/ca/${caId}/employees`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const createEmployee = async (caId, employeeData) => {
    const response = await fetch(`${BASE_URL}/ca/${caId}/employees`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData)
    });
    return handleResponse(response);
};

export const assignEmployeeToRequest = async (requestId, employeeId) => {
    const response = await fetch(`${BASE_URL}/ca/requests/${requestId}/assign-employee`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ employeeId })
    });
    return handleResponse(response);
};

export const getCaWalletTransactions = async (caId) => {
    const response = await fetch(`${BASE_URL}/ca/${caId}/wallet/transactions`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const requestCaWithdrawal = async (caId, amount, remarks) => {
    const response = await fetch(`${BASE_URL}/ca/${caId}/wallet/withdraw`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount, remarks })
    });
    return handleResponse(response);
};

// --- EMPLOYEE DASHBOARD APIs ---

export const getEmployeeTasks = async (employeeId) => {
    const response = await fetch(`${BASE_URL}/employee/${employeeId}/tasks`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const updateEmployeeTaskStatus = async (requestId, status) => {
    const response = await fetch(`${BASE_URL}/employee/tasks/${requestId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitSupportTicket = async (ticketData) => {
    const response = await fetch(`${BASE_URL}/tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ticketData),
    });
    return handleResponse(response);
};

// --- CHAT SYSTEM ---

export const getChatHistory = async (ticketId) => {
    const response = await fetch(`${BASE_URL}/chat/history/${ticketId}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const sendChatMessage = async (chatData) => {
    // chatData = { email, message, ticketId, role? }
    const response = await fetch(`${BASE_URL}/chat/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(chatData),
    });
    return handleResponse(response);
};

export const markChatAsRead = async (ticketId, role) => {
    const response = await fetch(`${BASE_URL}/chat/read/${ticketId}?role=${role}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const getUnreadChatCounts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/chat/unread`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch chat counts", e);
    }
    return {};
};

export const getUserUnreadChatCounts = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/chat/unread/user?email=${encodeURIComponent(email)}`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch user chat counts", e);
    }
    return {};
};

// --- CHAT ACTIONS ---

export const editChatMessage = async (ticketId, messageId, newMessage) => {
    const response = await fetch(`${BASE_URL}/chat/message/${ticketId}/${messageId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: newMessage })
    });
    return response.ok;
};

export const deleteChatMessage = async (ticketId, messageId) => {
    const response = await fetch(`${BASE_URL}/chat/message/${ticketId}/${messageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const clearChatHistory = async (ticketId) => {
    const response = await fetch(`${BASE_URL}/chat/history/${ticketId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const setTypingStatus = async (ticketId, role, isTyping) => {
    await fetch(`${BASE_URL}/chat/typing/${ticketId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role, isTyping })
    });
};

export const getTypingStatus = async (ticketId) => {
    try {
        const response = await fetch(`${BASE_URL}/chat/typing/${ticketId}`, { headers: getAuthHeaders() });
        if (response.ok) return await response.json();
    } catch (e) { }
    return [];
};

export const getAdminStats = async () => {
    const response = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getClientAnalysis = async () => {
    const response = await fetch(`${BASE_URL}/admin/client-analysis`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

// --- ADMIN ORDER ACTIONS ---

export const deleteAllChats = async (password) => {
    const response = await fetch(`${BASE_URL}/admin/delete-all-chats`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ password })
    });
    return handleResponse(response);
};

// --- FINANCIAL OPERATIONS ---

export const getFinancialData = async () => {
    const response = await fetch(`${BASE_URL}/admin/finance`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};



export const getAuditLogs = async () => {
    const response = await fetch(`${BASE_URL}/admin/logs`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};



// --- PRIVATE LIMITED AUTOMATION ---

export const verifyPrivateLimitedDocs = async (submissionId) => {
    const response = await fetch(`${BASE_URL}/service/private-limited-company/${submissionId}/verify-docs`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};


// --- AI PROMPT MANAGEMENT ---

export const getAllPrompts = async () => {
    const response = await fetch(`${BASE_URL}/prompts`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const createPrompt = async (promptData) => {
    const response = await fetch(`${BASE_URL}/prompts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(promptData),
    });
    return handleResponse(response);
};

export const updatePrompt = async (id, promptData) => {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(promptData),
    });
    return handleResponse(response);
};

export const deletePrompt = async (id) => {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    // Response might be empty 200 OK
    if (response.ok) return true;
    return handleResponse(response);
};

// --- NOTIFICATIONS ---

export const getNotifications = async (email) => {
    const response = await fetch(`${BASE_URL}/notifications?email=${encodeURIComponent(email)}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getUnreadSystemNotifications = async () => {
    try {
        const response = await fetch(`${BASE_URL}/notifications/system/unread`, { headers: getAuthHeaders() });
        // Return array or empty array if fails
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch system notifications", e);
    }
    return [];
};

export const markNotificationRead = async (id) => {
    const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const markAllNotificationsRead = async (email) => {
    const response = await fetch(`${BASE_URL}/notifications/mark-all-read?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return response.ok;
};

// --- NOTIFICATION TEMPLATES ---

export const getTemplates = async () => {
    const response = await fetch(`${BASE_URL}/templates`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

export const createTemplate = async (data) => {
    const response = await fetch(`${BASE_URL}/templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const updateTemplate = async (id, data) => {
    const response = await fetch(`${BASE_URL}/templates/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const deleteTemplate = async (id) => {
    const response = await fetch(`${BASE_URL}/templates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (response.ok) return true;
    return handleResponse(response);
};




// --- SERVICE CATALOG MANAGEMENT ---
// --- SERVICE CATALOG MANAGEMENT ---

export const getServiceProducts = async () => {
    const response = await fetch(`${BASE_URL}/admin/services`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const createServiceProduct = async (data) => {
    // Note: Backend endpoint /admin/services for POST might not exist yet.
    const response = await fetch(`${BASE_URL}/admin/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const updateServiceProduct = async (id, data) => {
    const response = await fetch(`${BASE_URL}/admin/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const deleteServiceProduct = async (id) => {
    const response = await fetch(`${BASE_URL}/admin/service-products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// --- FINANCIAL SERVICES ---

export const submitFinancialService = async (slug, formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/${slug}/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};


export const updateFinancialServiceStatus = async (slug, id, status) => {
    const response = await fetch(`${BASE_URL}/service/${slug}/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- ADMIN CLEANUP ---
export const deleteOrder = async (orderId) => {
    const response = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// --- ADMIN USER & ORG MANAGEMENT ---

export const getDepartments = async () => {
    // Mock or Real Endpoint
    // If backend doesn't support depts, we return mock to prevent crash.
    // Or we can try to fetch.
    try {
        const response = await fetch(`${BASE_URL}/admin/departments`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (response.ok) return await response.json();
    } catch (e) { }

    return [
        { id: 1, name: 'Legal Board', count: 12, head: 'Adv. Sharma', color: 'bg-indigo-50 text-indigo-700' },
        { id: 2, name: 'Support Ops', count: 8, head: 'Priya K.', color: 'bg-pink-50 text-pink-700' },
        { id: 3, name: 'Finance', count: 4, head: 'Amit R.', color: 'bg-emerald-50 text-emerald-700' },
        { id: 4, name: 'Tech Team', count: 6, head: 'Suresh V.', color: 'bg-blue-50 text-blue-700' }
    ];
};

export const updateDepartment = async () => {
    // Placeholder
    return { success: true };
};

export const getSystemSettings = async () => {
    const response = await fetch(`${BASE_URL}/admin/settings`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const updateSystemSettings = async (settings) => {
    const response = await fetch(`${BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
    });
    return handleResponse(response);
};
// --- FILE MANAGEMENT ---

export const getAllFiles = async () => {
    const response = await fetch(`${BASE_URL}/upload/all`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const deleteFile = async (id) => {
    const response = await fetch(`${BASE_URL}/upload/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    // Response might be empty 200 OK
    if (response.ok) return true;
    return handleResponse(response);
};

// --- TESTIMONIALS / FEEDBACK ---

export const submitTestimonial = async (testimonialData) => {
    const response = await fetch(`${BASE_URL}/testimonials`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
    });
    return handleResponse(response);
};

export const getApprovedTestimonials = async () => {
    const response = await fetch(`${BASE_URL}/testimonials/approved`, {
        method: 'GET',
    });
    return handleResponse(response);
};

export const getAllTestimonials = async () => {
    const response = await fetch(`${BASE_URL}/testimonials/all`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// --- LEGAL DRAFTING SERVICES ---

export const submitPartnershipDeed = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/partnership-deed/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePartnershipDeedStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/partnership-deed/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitFoundersAgreement = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/founders-agreement/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateFoundersAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/founders-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitShareholdersAgreement = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/shareholders-agreement/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateShareholdersAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/shareholders-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitEmploymentAgreement = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/employment-agreement/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateEmploymentAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/employment-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitRentAgreement = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/rent-agreement/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateRentAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/rent-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitFranchiseAgreement = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/franchise-agreement/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateFranchiseAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/franchise-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitNDA = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/nda/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateNDAStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/nda/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitVendorAgreement = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/vendor-agreement/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateVendorAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/vendor-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitLegalNotice = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/legal-notice/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitLegalNoticeReply = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/legal-notice-reply/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitChequeBounceNotice = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/cheque-bounce-notice/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitTaxNoticeReply = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/tax-notice-reply/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitRocNoticeReply = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/roc-notice-reply/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

// --- CORRECTION SERVICES ---

export const submitPanCorrection = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/pan-correction/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitGstCorrection = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-amendment/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitCompanyLlpCorrection = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/company-llp-correction/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitDinDscCorrection = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/din-dsc-correction/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


// --- CLOSURE SERVICES ---

export const submitLlpClosure = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/strike-off/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitProprietorshipClosure = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/proprietorship-closure/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitFssaiCancellation = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/fssai-cancellation/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

// --- FINANCIAL SERVICES ---

export const submitBusinessValuation = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/business-valuation/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitStartupPitchDeck = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/startup-pitch-deck/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitCashFlowStatement = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/cash-flow-statement/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitProjectReport = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/project-report/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitCmaData = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/cma-data-preparation/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitVirtualCfo = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/virtual-cfo/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitCmaDataPreparation = submitCmaData;

export const submitPitchDeck = submitStartupPitchDeck;

export const submitBankLoanDocumentation = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/bank-loan-documentation/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

// --- ADMIN CONTROL CENTER (CA CRM & SYSTEM) ---

export const getComplianceRules = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/compliance-rules`, { headers: getAuthHeaders() });
        return await handleResponse(response) || [];
    } catch (e) { console.warn(e); return []; }
};

export const saveComplianceRule = async (data) => {
    const response = await fetch(`${BASE_URL}/admin/compliance-rules`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const deleteComplianceRule = async (id) => {
    const response = await fetch(`${BASE_URL}/admin/compliance-rules/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const getServiceConfigs = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/services`, { headers: getAuthHeaders() });
        const services = await handleResponse(response);
        if (Array.isArray(services)) {
            return services.map(s => ({
                ...s,
                docsRequired: typeof s.docsRequired === 'string' ? s.docsRequired.split(',') : (s.docsRequired || [])
            }));
        }
        return [];
    } catch (e) { return []; }
};

export const saveServiceConfig = async (data) => {
    const response = await fetch(`${BASE_URL}/admin/service-configs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const getBillingSettings = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/billing-settings`, { headers: getAuthHeaders() });
        return await handleResponse(response) || {};
    } catch (e) { return {}; }
};

export const getSystemRoles = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/system-roles`, { headers: getAuthHeaders() });
        return await handleResponse(response) || [];
    } catch (e) { return []; }
};

// --- SERVICE REQUEST BINDING (SUPER ADMIN) ---

export const getSuperAdminRequests = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/requests`, { headers: getAuthHeaders() });
        return await handleResponse(response) || [];
    } catch (e) { return []; }
};

export const getAllCas = async () => {
    try {
        const users = await getAllUsers();
        return users.filter(u => u.role === 'CA');
    } catch (e) { return []; }
};

export const bindRequestAmount = async (id, amount) => {
    const response = await fetch(`${BASE_URL}/admin/requests/${id}/bind`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount })
    });
    return handleResponse(response);
};

export const assignRequestToCa = async (id, caId, comments) => {
    const response = await fetch(`${BASE_URL}/admin/requests/${id}/bind`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ caId, comments })
    });
    return handleResponse(response);
};

// Duplicate functions removed

export const getBotResponse = (message, role) => {
    const msg = message.toLowerCase();

    if (msg.includes('hello') || msg.includes('hi')) return "Hello! How can I assist you today?";
    if (msg.includes('status')) return "You can check your application status in the 'My Applications' tab.";
    if (msg.includes('document') || msg.includes('upload')) return "Please go to 'My Documents' to upload or view your files.";
    if (msg.includes('payment') || msg.includes('invoice')) return "Billing details are available under the 'Billing & Invoices' section.";
    if (msg.includes('contact') || msg.includes('call')) return "You can call our support at +91 7639227019.";

    return "I'm here to help! Could you please provide more details?";
};


// --- PAYMENT INTEGRATION ---

export const createRazorpayOrder = async (amount) => {
    const response = await fetch(`${BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount }),
    });
    return handleResponse(response);
};

export const getFullAnalytics = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/analytics/full`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch full analytics", e);
    }
    return null;
};
