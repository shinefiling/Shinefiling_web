import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/HomePage';
import Dashboard from './pages/DashboardPage';
import ServicesPage from './pages/ServicesPage';
import AboutUsPage from './pages/AboutUsPage';
import CareersPage from './pages/CareersPage';
import ContactUsPage from './pages/ContactUsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';
import AuthContext from './context/AuthContext';
import DynamicSEOPage from './pages/DynamicSEOPage';

// --- SEPARATE SERVICE PAGES ---


import {
  submitOnePersonCompanyRegistration,
  submitLlpRegistration,
  submitPartnershipFirmRegistration,
  submitSoleProprietorshipRegistration,
  submitSection8CompanyRegistration,
  submitNidhiCompanyRegistration,
  submitProducerCompanyRegistration,
  submitPublicLimitedCompanyRegistration
} from './api';
import PrivateLimitedPage from './pages/services/business_registration/PrivateLimitedPage';
import PrivateLimitedRegistration from './pages/services/business_registration/PrivateLimitedRegistration';
import OpcPage from './pages/services/business_registration/OpcPage';
import OnePersonCompanyRegistration from './pages/services/business_registration/OnePersonCompanyRegistration';
import LlpPage from './pages/services/business_registration/LlpPage';
import LlpRegistration from './pages/services/business_registration/LlpRegistration';
import PartnershipPage from './pages/services/business_registration/PartnershipPage';
import PartnershipRegistration from './pages/services/business_registration/PartnershipRegistration';
import ProprietorshipPage from './pages/services/business_registration/ProprietorshipPage';
import ProprietorshipRegistration from './pages/services/business_registration/ProprietorshipRegistration';
import Section8Page from './pages/services/business_registration/Section8Page';
import Section8Registration from './pages/services/business_registration/Section8Registration';
import NidhiPage from './pages/services/business_registration/NidhiPage';
import NidhiRegistration from './pages/services/business_registration/NidhiRegistration';
import ProducerPage from './pages/services/business_registration/ProducerPage';
import ProducerRegistration from './pages/services/business_registration/ProducerRegistration';
import PublicLimitedPage from './pages/services/business_registration/PublicLimitedPage';
import PublicLimitedRegistration from './pages/services/business_registration/PublicLimitedRegistration';
import IndianSubsidiaryPage from './pages/services/business_registration/IndianSubsidiaryPage';
import IndianSubsidiaryRegistration from './pages/services/business_registration/IndianSubsidiaryRegistration';
import ForeignCompanyPage from './pages/services/business_registration/ForeignCompanyPage';
import ForeignCompanyRegistration from './pages/services/business_registration/ForeignCompanyRegistration';
import StartupAdvisoryPage from './pages/services/business_registration/StartupAdvisoryPage';
import StartupAdvisoryRegistration from './pages/services/business_registration/StartupAdvisoryRegistration';
import GstPage from './pages/services/tax_compliance/GSTRegistration';
import GstRegistration from './pages/services/tax_compliance/GstRegistrationForm';
import GSTMonthlyReturnPage from './pages/services/tax_compliance/GSTMonthlyReturnPage';
import GSTMonthlyReturnRegistration from './pages/services/tax_compliance/GstMonthlyReturnRegistration';
import GSTAnnualReturnPage from './pages/services/tax_compliance/GSTAnnualReturnPage';
import GSTAnnualReturnRegistration from './pages/services/tax_compliance/GSTAnnualReturnRegistration';
import GSTR1Page from './pages/services/tax_compliance/GSTR1Page';
import GSTR1Registration from './pages/services/tax_compliance/GSTR1Registration';
import GSTR3BPage from './pages/services/tax_compliance/GSTR3BPage';
import GSTR3BRegistration from './pages/services/tax_compliance/GSTR3BRegistration';
import Itr1Page from './pages/services/tax_compliance/Itr1Page';
import Itr1Registration from './pages/services/tax_compliance/Itr1Registration';
import Itr2Page from './pages/services/tax_compliance/Itr2Page';
import Itr2Registration from './pages/services/tax_compliance/Itr2Registration';
import Itr3Page from './pages/services/tax_compliance/Itr3Page';
import Itr3Registration from './pages/services/tax_compliance/Itr3Registration';
import Itr4Page from './pages/services/tax_compliance/Itr4Page';
import Itr4Registration from './pages/services/tax_compliance/Itr4Registration';
import Itr567Page from './pages/services/tax_compliance/Itr567Page';
import Itr567Registration from './pages/services/tax_compliance/Itr567Registration';

import RentAgreementPage from './pages/services/RentAgreementPage';
import GenericServicePage from './pages/services/GenericServicePage';


// Tax & Compliance
import GstAmendmentPage from './pages/services/tax_compliance/GstAmendmentPage';
import GstAmendmentRegistration from './pages/services/tax_compliance/GstAmendmentRegistration';
import GstCancellationPage from './pages/services/tax_compliance/GstCancellationPage';
import GstCancellationRegistration from './pages/services/tax_compliance/GstCancellationRegistration';
import GstAuditPage from './pages/services/tax_compliance/GstAuditPage';
import GstAuditRegistration from './pages/services/tax_compliance/GstAuditRegistration';
import IncomeTaxReturnPage from './pages/services/tax_compliance/IncomeTaxReturnPage';
import IncomeTaxReturnRegistration from './pages/services/tax_compliance/IncomeTaxReturnRegistration';
import TDSReturnFilingPage from './pages/services/tax_compliance/TDSReturnFilingPage';
import TDSReturnFilingRegistration from './pages/services/tax_compliance/TdsReturnRegistration';
import IncomeTaxRegistration from './pages/services/tax_compliance/IncomeTaxRegistration';
import ProfessionalTaxPage from './pages/services/tax_compliance/ProfessionalTaxPage';
import ProfessionalTaxRegistration from './pages/services/tax_compliance/ProfessionalTaxRegistration';
import AdvanceTaxFilingPage from './pages/services/tax_compliance/AdvanceTaxFilingPage';
import AdvanceTaxFilingRegistration from './pages/services/tax_compliance/AdvanceTaxRegistration';
import TaxAuditFilingPage from './pages/services/tax_compliance/TaxAuditFilingPage';
import TaxAuditRegistration from './pages/services/tax_compliance/TaxAuditRegistration';

// ROC Compliance
import AnnualROCFilingPage from './pages/services/roc_filing/AnnualROCFiling';
import AnnualROCRegistration from './pages/services/roc_filing/AnnualROCRegistration';
import DirectorKYCPage from './pages/services/roc_filing/DirectorKYC';
import DirectorKycRegistration from './pages/services/roc_filing/DirectorKycRegistration';
import AddRemoveDirectorPage from './pages/services/roc_filing/AddRemoveDirector';
import AddRemoveDirectorRegistration from './pages/services/roc_filing/AddRemoveDirectorRegistration';
import ChangeRegisteredOfficePage from './pages/services/roc_filing/ChangeRegisteredOffice';
import ChangeRegisteredOfficeRegistration from './pages/services/roc_filing/ChangeRegisteredOfficeRegistration';
import ShareTransferFilingPage from './pages/services/roc_filing/ShareTransferFiling';
import ShareTransferRegistration from './pages/services/roc_filing/ShareTransferRegistration';
import IncreaseAuthorizedCapitalPage from './pages/services/roc_filing/IncreaseAuthorizedCapital';
import IncreaseAuthorizedCapitalRegistration from './pages/services/roc_filing/IncreaseAuthorizedCapitalRegistration';
import MOAAmendmentPage from './pages/services/roc_filing/MOAAmendment';
import MOAAmendmentRegistration from './pages/services/roc_filing/MOAAmendmentRegistration';
import AOAAmendmentPage from './pages/services/roc_filing/AOAAmendment';
import AOAAmendmentRegistration from './pages/services/roc_filing/AOAAmendmentRegistration';
import CompanyNameChangePage from './pages/services/roc_filing/CompanyNameChange';
import CompanyNameChangeRegistration from './pages/services/roc_filing/CompanyNameChangeRegistration';
import StrikeOffCompanyPage from './pages/services/roc_filing/StrikeOffCompany';
import StrikeOffCompanyRegistration from './pages/services/roc_filing/StrikeOffCompanyRegistration';

// Licenses
import FSSAILicensePage from './pages/services/licenses/FSSAILicense';
import FSSAICentralLicensePage from './pages/services/licenses/FSSAICentralLicense';
import FSSAIRenewalPage from './pages/services/licenses/FSSAIRenewal';
import FSSAILicenseRegistration from './pages/services/licenses/FSSAILicenseRegistration';
import ShopEstablishmentLicensePage from './pages/services/licenses/ShopEstablishmentLicense';
import ShopEstablishmentRegistration from './pages/services/licenses/ShopEstablishmentRegistration';
import TradeLicensePage from './pages/services/licenses/TradeLicense';
import TradeLicenseRegistration from './pages/services/licenses/TradeLicenseRegistration';
import LabourLicensePage from './pages/services/licenses/LabourLicense';
import FactoryLicensePage from './pages/services/licenses/FactoryLicense';
import LabourLicenseRegistration from './pages/services/licenses/LabourLicenseRegistration';

import FactoryLicenseRegistration from './pages/services/licenses/FactoryLicenseRegistration';
import DrugLicensePage from './pages/services/licenses/DrugLicense';

import DrugLicenseRegistration from './pages/services/licenses/DrugLicenseRegistration';
import FireSafetyNOCPage from './pages/services/licenses/FireSafetyNOC';
import FireNocRegistration from './pages/services/licenses/FireNocRegistration';
import PollutionControlPage from './pages/services/licenses/PollutionControl';
import PollutionControlRegistration from './pages/services/licenses/PollutionControlRegistration';
import ImportExportCodePage from './pages/services/licenses/ImportExportCode';
import IECRegistration from './pages/services/licenses/IECRegistration';
import GumasthaLicensePage from './pages/services/licenses/GumasthaLicense';
import ApplyGumasthaLicense from './pages/services/licenses/ApplyGumasthaLicense';
import BarLiquorLicensePage from './pages/services/licenses/BarLiquorLicense';
import ApplyBarLiquorLicense from './pages/services/licenses/ApplyBarLiquorLicense';


import ApplyShopLicense from './pages/services/licenses/ApplyShopLicense';


// Intellectual Property
import TrademarkRegistrationPage from './pages/services/intellectual_property/TrademarkRegistration';
import TrademarkObjectionPage from './pages/services/intellectual_property/TrademarkObjection';
import TrademarkHearingSupportPage from './pages/services/intellectual_property/TrademarkHearing';
import TrademarkAssignmentPage from './pages/services/intellectual_property/TrademarkAssignment';
import TrademarkRenewalPage from './pages/services/intellectual_property/TrademarkRenewal';
import CopyrightRegistrationPage from './pages/services/intellectual_property/CopyrightRegistration';
import PatentFilingPage from './pages/services/intellectual_property/PatentFiling';
import PatentProvisionalFilingPage from './pages/services/intellectual_property/PatentProvisionalFiling';
import PatentCompleteFilingPage from './pages/services/intellectual_property/PatentCompleteFiling';
import DesignRegistrationPage from './pages/services/intellectual_property/DesignRegistration';

import ApplyTrademarkRegistration from './pages/services/intellectual_property/ApplyTrademarkRegistration';
import ApplyTrademarkObjection from './pages/services/intellectual_property/ApplyTrademarkObjection';
import ApplyTrademarkHearing from './pages/services/intellectual_property/ApplyTrademarkHearing';
import ApplyTrademarkAssignment from './pages/services/intellectual_property/ApplyTrademarkAssignment';
import ApplyTrademarkRenewal from './pages/services/intellectual_property/ApplyTrademarkRenewal';
import ApplyCopyrightRegistration from './pages/services/intellectual_property/ApplyCopyrightRegistration';
import ApplyPatentFiling from './pages/services/intellectual_property/ApplyPatentFiling';
import ApplyPatentProvisional from './pages/services/intellectual_property/ApplyPatentProvisional';
import ApplyPatentComplete from './pages/services/intellectual_property/ApplyPatentComplete';
import ApplyDesignRegistration from './pages/services/intellectual_property/ApplyDesignRegistration';

// Labour Law & HR
import ApplyProfessionalTax from './pages/services/labour_law_hr/ApplyProfessionalTax';
import ApplyLabourWelfareFund from './pages/services/labour_law_hr/ApplyLabourWelfareFund';
import ApplyGratuityAct from './pages/services/labour_law_hr/ApplyGratuityAct';
import ApplyBonusAct from './pages/services/labour_law_hr/ApplyBonusAct';
import ApplyMinimumWages from './pages/services/labour_law_hr/ApplyMinimumWages';
import ApplyPayrollCompliance from './pages/services/labour_law_hr/ApplyPayrollCompliance';

import PFRegistrationPage from './pages/services/labour_law_hr/PFRegistration';
import PFFilingPage from './pages/services/labour_law_hr/PFFiling';
import ESIRegistrationPage from './pages/services/labour_law_hr/ESIRegistration';
import ESIFilingPage from './pages/services/labour_law_hr/ESIFiling';
import ProfessionalTaxRegistrationPage from './pages/services/labour_law_hr/ProfessionalTaxRegistration';
import ProfessionalTaxFilingPage from './pages/services/labour_law_hr/ProfessionalTaxFiling';
import LabourWelfareFundPage from './pages/services/labour_law_hr/LabourWelfareFund';
import PayrollCompliancePage from './pages/services/labour_law_hr/PayrollCompliance';
import GratuityAct from './pages/services/labour_law_hr/GratuityAct';
import BonusAct from './pages/services/labour_law_hr/BonusAct';
import MinimumWages from './pages/services/labour_law_hr/MinimumWages';

import ApplyPFRegistration from './pages/services/labour_law_hr/ApplyPFRegistration';
import ApplyPFFiling from './pages/services/labour_law_hr/ApplyPFFiling';
import ApplyESIRegistration from './pages/services/labour_law_hr/ApplyESIRegistration';
import ApplyESIFiling from './pages/services/labour_law_hr/ApplyESIFiling';

// Legal Drafting
import PartnershipDeed from './pages/services/legal_drafting/PartnershipDeed';
import ApplyPartnershipDeed from './pages/services/legal_drafting/ApplyPartnershipDeed';
import FoundersAgreement from './pages/services/legal_drafting/FoundersAgreement';
import ApplyFoundersAgreement from './pages/services/legal_drafting/ApplyFoundersAgreement';
import ShareholdersAgreement from './pages/services/legal_drafting/ShareholdersAgreement';
import ApplyShareholdersAgreement from './pages/services/legal_drafting/ApplyShareholdersAgreement';
import EmploymentAgreement from './pages/services/legal_drafting/EmploymentAgreement';
import ApplyEmploymentAgreement from './pages/services/legal_drafting/ApplyEmploymentAgreement';
import RentAgreementDrafting from './pages/services/legal_drafting/RentAgreementDrafting';
import ApplyRentAgreementDrafting from './pages/services/legal_drafting/ApplyRentAgreementDrafting';
import FranchiseAgreement from './pages/services/legal_drafting/FranchiseAgreement';
import ApplyFranchiseAgreement from './pages/services/legal_drafting/ApplyFranchiseAgreement';
import NDA from './pages/services/legal_drafting/NDA';
import ApplyNDA from './pages/services/legal_drafting/ApplyNDA';
import VendorAgreement from './pages/services/legal_drafting/VendorAgreement';
import ApplyVendorAgreement from './pages/services/legal_drafting/ApplyVendorAgreement';

// Business Certifications
import MSMERegistration from './pages/services/business_certifications/MSMERegistration';
import ApplyMSMERegistration from './pages/services/business_certifications/ApplyMSMERegistration';
import ISOCertification from './pages/services/business_certifications/ISOCertification';
import ApplyISOCertification from './pages/services/business_certifications/ApplyISOCertification';
import StartupIndia from './pages/services/business_certifications/StartupIndia';
import ApplyStartupIndia from './pages/services/business_certifications/ApplyStartupIndia';
import DigitalSignature from './pages/services/business_certifications/DigitalSignature';
import ApplyDigitalSignature from './pages/services/business_certifications/ApplyDigitalSignature';
import BarCodeRegistration from './pages/services/business_certifications/BarCodeRegistration';
import ApplyBarCode from './pages/services/business_certifications/ApplyBarCode';
import TanPanApplication from './pages/services/business_certifications/TanPanApplication';
import ApplyTanPan from './pages/services/business_certifications/ApplyTanPan';

// Financial Services
import CmaDataPreparation from './pages/services/financial_services/CmaDataPreparation';
import ProjectReport from './pages/services/financial_services/ProjectReport';
import BankLoanDocumentation from './pages/services/financial_services/BankLoanDocumentation';
import CashFlowCompliance from './pages/services/financial_services/CashFlowCompliance';
import StartupPitchDeck from './pages/services/financial_services/StartupPitchDeck';
import BusinessValuation from './pages/services/financial_services/BusinessValuation';
import VirtualCFO from './pages/services/financial_services/VirtualCFO';


// Legal Notices
import LegalNoticeDrafting from './pages/services/legal_notices/LegalNoticeDrafting';
import LegalNoticeRegistration from './pages/services/legal_notices/LegalNoticeRegistration';
import ReplyToLegalNotice from './pages/services/legal_notices/ReplyToLegalNotice';
import LegalNoticeReplyRegistration from './pages/services/legal_notices/LegalNoticeReplyRegistration';
import ChequeBounceNotice from './pages/services/legal_notices/ChequeBounceNotice';
import ChequeBounceNoticeRegistration from './pages/services/legal_notices/ChequeBounceNoticeRegistration';
import TaxNoticeReply from './pages/services/legal_notices/TaxNoticeReply';
import TaxNoticeReplyRegistration from './pages/services/legal_notices/TaxNoticeReplyRegistration';
import RocNoticeReply from './pages/services/legal_notices/RocNoticeReply';
import RocNoticeReplyRegistration from './pages/services/legal_notices/RocNoticeReplyRegistration';

// Corrections
import PanCorrection from './pages/services/corrections/PanCorrection';
import PanCorrectionRegistration from './pages/services/corrections/PanCorrectionRegistration';
import GstCorrection from './pages/services/corrections/GstCorrection';
import GstCorrectionRegistration from './pages/services/corrections/GstCorrectionRegistration';
import FssaiCorrection from './pages/services/corrections/FssaiCorrection';
import FssaiCorrectionRegistration from './pages/services/corrections/FssaiCorrectionRegistration';
import CompanyLLPDetailCorrection from './pages/services/corrections/CompanyLLPDetailCorrection';
import CompanyLLPDetailCorrectionRegistration from './pages/services/corrections/CompanyLLPDetailCorrectionRegistration';
import DINDSCCorrection from './pages/services/corrections/DINDSCCorrection';
import DINDSCCorrectionRegistration from './pages/services/corrections/DINDSCCorrectionRegistration';

// Business Closure
import LLPClosure from './pages/services/business_closure/LLPClosure';
import LLPClosureRegistration from './pages/services/business_closure/LLPClosureRegistration';
import ProprietorshipClosure from './pages/services/business_closure/ProprietorshipClosure';
import ProprietorshipClosureRegistration from './pages/services/business_closure/ProprietorshipClosureRegistration';
import FssaiCancellation from './pages/services/business_closure/FssaiCancellation';
import FssaiCancellationRegistration from './pages/services/business_closure/FssaiCancellationRegistration';

import StartupPitchDeckRegistration from './pages/services/financial_services/StartupPitchDeckRegistration';
import CashFlowStatementRegistration from './pages/services/financial_services/CashFlowStatementRegistration';
import CmaDataPreparationRegistration from './pages/services/financial_services/CmaDataPreparationRegistration';
import VirtualCFORegistration from './pages/services/financial_services/VirtualCFORegistration';
import ProjectReportRegistration from './pages/services/financial_services/ProjectReportRegistration';
import BusinessValuationRegistration from './pages/services/financial_services/BusinessValuationRegistration';
import BankLoanDocumentationRegistration from './pages/services/financial_services/BankLoanDocumentationRegistration';


import AdminDashboardPage from './pages/AdminDashboardPage';
import AgentDashboardPage from './pages/agent/AgentDashboard';
import CaDashboardPage from './pages/ca/CaDashboard';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import FssaiOrderDetails from './pages/admin/views/master/FssaiOrderDetails';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  // Lazy Init to prevent flash of login redirect
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Initial App Load Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Session Management (Super Admin Timeout: 2 Hours)
  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      // Session Timeout: 2 Hours for ALL users
      const loginTime = user.loginTimestamp;
      if (loginTime) {
        const now = Date.now();
        // 2 Hours = 2 * 60 * 60 * 1000 = 7200000 ms
        if (now - loginTime > 7200000) {
          console.warn("Session Expired");
          handleLogout();
        }
      }
    };

    // Check immediately on load
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Listen for global user updates (e.g. Profile Picture change)
  useEffect(() => {
    const handleUserUpdate = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const isLoggedIn = !!user;

  const location = useLocation();
  const hiddenRoutes = ['/dashboard', '/admin-dashboard', '/agent-dashboard', '/ca-dashboard', '/employee-dashboard', '/login', '/signup', '/loader-demo'];
  const shouldHideNavAndFooter =
    hiddenRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/dashboard/') ||
    location.pathname.startsWith('/admin-dashboard/') ||
    location.pathname.startsWith('/agent-dashboard/') ||
    location.pathname.startsWith('/ca-dashboard/') ||
    location.pathname.startsWith('/employee-dashboard/') ||
    location.pathname.endsWith('/register') ||
    location.pathname.endsWith('/apply');

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, isLoggedIn }}>
      <ScrollToTop />
      {initialLoading && <Loader text="Loading ShineFiling..." fullScreen={true} />}
      {!initialLoading && (
        <div className="flex flex-col min-h-screen">
          {!shouldHideNavAndFooter && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onLogin={handleLogin} user={user} />}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/refund-policy" element={<RefundPage />} />

              {/* Auth Redirects */}
              <Route path="/login" element={<Navigate to="/?login=true" replace />} />
              <Route path="/signup" element={<Navigate to="/?signup=true" replace />} />

              {/* Protected Dashboard */}
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/?login=true" replace />} />
              <Route path="/admin-dashboard" element={isLoggedIn ? <AdminDashboardPage onLogout={handleLogout} user={user} /> : <Navigate to="/?login=true" replace />} />
              <Route path="/agent-dashboard" element={isLoggedIn ? <AgentDashboardPage onLogout={handleLogout} /> : <Navigate to="/?login=true" replace />} />
              <Route path="/ca-dashboard" element={isLoggedIn ? <CaDashboardPage onLogout={handleLogout} /> : <Navigate to="/?login=true" replace />} />
              <Route path="/employee-dashboard" element={isLoggedIn ? <EmployeeDashboardPage onLogout={handleLogout} /> : <Navigate to="/?login=true" replace />} />
              <Route path="/admin/fssai/:orderId" element={isLoggedIn ? <FssaiOrderDetails /> : <Navigate to="/?login=true" replace />} />

              {/* Registration Routes */}
              <Route path="/services/private-limited-company/register" element={<PrivateLimitedRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/one-person-company/register" element={<OnePersonCompanyRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/limited-liability-partnership" element={<LlpPage />} />
              <Route path="/services/llp/register" element={<LlpRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/partnership-firm" element={<PartnershipPage />} />
              <Route path="/services/partnership-firm/register" element={<PartnershipRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/sole-proprietorship" element={<ProprietorshipPage />} />
              <Route path="/services/sole-proprietorship/register" element={<ProprietorshipRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/section-8-company" element={<Section8Page />} />
              <Route path="/services/section-8-company/register" element={<Section8Registration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/nidhi-company-registration" element={<NidhiPage />} />
              <Route path="/services/nidhi-company-registration/register" element={<NidhiRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/producer-company-registration" element={<ProducerPage />} />
              <Route path="/services/producer-company-registration/register" element={<ProducerRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/public-limited-company" element={<PublicLimitedPage />} />
              <Route path="/services/public-limited-company/register" element={<PublicLimitedRegistration isLoggedIn={isLoggedIn} />} />

              {/* GST Services */}
              <Route path="/services/gst-registration" element={<GstPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-registration/register" element={<GstRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-monthly-return" element={<GSTMonthlyReturnPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-monthly-return/register" element={<GSTMonthlyReturnRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-annual-return" element={<GSTAnnualReturnPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-annual-return/register" element={<GSTAnnualReturnRegistration isLoggedIn={isLoggedIn} />} />


              {/* Generic Service Application Route */}
              <Route path="/services/apply" element={<GenericServicePage />} />

              {/* --- SEPARATE SERVICE ROUTES --- */}
              <Route path="/services/private-limited-company" element={<PrivateLimitedPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/one-person-company" element={<OpcPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/llp-registration" element={<LlpPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/partnership-firm" element={<PartnershipPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/sole-proprietorship" element={<ProprietorshipPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/section-8-company" element={<Section8Page isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />

              {/* Updated Slugs to match common naming conventions */}
              <Route path="/services/nidhi-company-registration" element={<NidhiPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/producer-company-registration" element={<ProducerPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/public-limited-company" element={<PublicLimitedPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/rent-agreement" element={<RentAgreementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />

              <Route path="/services/indian-subsidiary-registration" element={<IndianSubsidiaryPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/indian-subsidiary-registration/register" element={<IndianSubsidiaryRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/foreign-company-registration" element={<ForeignCompanyPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/foreign-company-registration/register" element={<ForeignCompanyRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/startup-incorporation-advisory" element={<StartupAdvisoryPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/startup-incorporation-advisory/register" element={<StartupAdvisoryRegistration isLoggedIn={isLoggedIn} />} />


              {/* Tax & Compliance Routes */}
              <Route path="/services/gst-registration" element={<GstPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-registration/register" element={<GstRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/gst-registration" element={<GstPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/gst-monthly-return" element={<GSTMonthlyReturnPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-monthly-return-filing/register" element={<GSTMonthlyReturnRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-return/gstr-1" element={<GSTR1Page isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-return/gstr-1/register" element={<GSTR1Registration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-return/gstr-3b" element={<GSTR3BPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-return/gstr-3b/register" element={<GSTR3BRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax_compliance/gst-annual-return" element={<GSTAnnualReturnPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-annual-return/register" element={<GSTAnnualReturnRegistration isLoggedIn={isLoggedIn} />} />

              {/* New GST Services */}
              <Route path="/services/tax-compliance/gst-amendment" element={<GstAmendmentPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-amendment/register" element={<GstAmendmentRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/gst-cancellation" element={<GstCancellationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-cancellation/register" element={<GstCancellationRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/gst-audit" element={<GstAuditPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-audit/register" element={<GstAuditRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/tax-compliance/income-tax-return" element={<IncomeTaxReturnPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax-return/register" element={<IncomeTaxReturnRegistration isLoggedIn={isLoggedIn} />} />

              {/* Detailed ITR Routes */}
              <Route path="/services/income-tax/itr-1" element={<Itr1Page isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-1/register" element={<Itr1Registration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-2" element={<Itr2Page isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-2/register" element={<Itr2Registration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-3" element={<Itr3Page isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-3/register" element={<Itr3Registration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-4" element={<Itr4Page isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-4/register" element={<Itr4Registration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-5-6-7" element={<Itr567Page isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax/itr-5-6-7/register" element={<Itr567Registration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tds-return" element={<TDSReturnFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tds-return/register" element={<TDSReturnFilingRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/tds-return-filing" element={<TDSReturnFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/professional-tax" element={<ProfessionalTaxPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/professional-tax/register" element={<ProfessionalTaxRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/advance-tax" element={<AdvanceTaxFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/advance-tax/register" element={<AdvanceTaxFilingRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/tax-audit" element={<TaxAuditFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-audit/register" element={<TaxAuditRegistration isLoggedIn={isLoggedIn} />} />

              {/* ROC Filing Routes */}
              <Route path="/services/roc-filing/annual-return" element={<AnnualROCFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/annual-return/register" element={<AnnualROCRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/director-kyc" element={<DirectorKYCPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/director-kyc/register" element={<DirectorKycRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/add-remove-director" element={<AddRemoveDirectorPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/add-remove-director/register" element={<AddRemoveDirectorRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/change-registered-office" element={<ChangeRegisteredOfficePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/change-registered-office/register" element={<ChangeRegisteredOfficeRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/share-transfer" element={<ShareTransferFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/share-transfer/register" element={<ShareTransferRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/increase-authorized-capital" element={<IncreaseAuthorizedCapitalPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/increase-authorized-capital/register" element={<IncreaseAuthorizedCapitalRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/moa-amendment" element={<MOAAmendmentPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/moa-amendment/register" element={<MOAAmendmentRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/aoa-amendment" element={<AOAAmendmentPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/aoa-amendment/register" element={<AOAAmendmentRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/company-name-change" element={<CompanyNameChangePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/company-name-change/register" element={<CompanyNameChangeRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/strike-off-company" element={<StrikeOffCompanyPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/strike-off-company/register" element={<StrikeOffCompanyRegistration isLoggedIn={isLoggedIn} />} />

              {/* License Routes */}
              <Route path="/services/licenses/fssai-license" element={<FSSAILicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/fssai-central-license" element={<FSSAICentralLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/fssai-renewal" element={<FSSAIRenewalPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/fssai-license/register" element={<FSSAILicenseRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/shop-establishment-license" element={<ShopEstablishmentLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/shop-act/register" element={<ShopEstablishmentRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/trade-license" element={<TradeLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/trade-license/register" element={<TradeLicenseRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/labour-license" element={<LabourLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/labour-license/register" element={<LabourLicenseRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/factory-license" element={<FactoryLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/factory-license/register" element={<FactoryLicenseRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/drug-license" element={<DrugLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/drug-license/register" element={<DrugLicenseRegistration isLoggedIn={isLoggedIn} />} />


              <Route path="/services/licenses/fire-safety-noc" element={<FireSafetyNOCPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/fire-safety-noc/register" element={<FireNocRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/pollution-control" element={<PollutionControlPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/pollution-control/register" element={<PollutionControlRegistration isLoggedIn={isLoggedIn} />} />



              <Route path="/services/licenses/import-export-code" element={<ImportExportCodePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/import-export-code/register" element={<IECRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/gumastha-license" element={<GumasthaLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/gumastha-license/apply" element={<ApplyGumasthaLicense isLoggedIn={isLoggedIn} />} />


              <Route path="/services/licenses/bar-liquor-license" element={<BarLiquorLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/bar-liquor-license/apply" element={<ApplyBarLiquorLicense isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/shop-establishment/apply" element={<ApplyShopLicense isLoggedIn={isLoggedIn} />} />

              {/* Intellectual Property Routes */}
              <Route path="/services/intellectual-property/trademark-registration" element={<TrademarkRegistrationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-objection" element={<TrademarkObjectionPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-hearing" element={<TrademarkHearingSupportPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-assignment" element={<TrademarkAssignmentPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-renewal" element={<TrademarkRenewalPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/copyright-registration" element={<CopyrightRegistrationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/patent-filing" element={<PatentFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/patent-provisional" element={<PatentProvisionalFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/patent-complete" element={<PatentCompleteFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/design-registration" element={<DesignRegistrationPage isLoggedIn={isLoggedIn} />} />

              <Route path="/services/intellectual-property/trademark-registration/apply" element={<ApplyTrademarkRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-objection/apply" element={<ApplyTrademarkObjection isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-hearing/apply" element={<ApplyTrademarkHearing isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-assignment/apply" element={<ApplyTrademarkAssignment isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-renewal/apply" element={<ApplyTrademarkRenewal isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/copyright-registration/apply" element={<ApplyCopyrightRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/patent-filing/apply" element={<ApplyPatentFiling isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/patent-provisional/apply" element={<ApplyPatentProvisional isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/patent-complete/apply" element={<ApplyPatentComplete isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/design-registration/apply" element={<ApplyDesignRegistration isLoggedIn={isLoggedIn} />} />


              {/* Labour Law & HR Routes */}
              <Route path="/services/labour/pf-registration" element={<PFRegistrationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/pf-filing" element={<PFFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/esi-registration" element={<ESIRegistrationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/esi-filing" element={<ESIFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/professional-tax-registration" element={<ProfessionalTaxRegistrationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/professional-tax-filing" element={<ProfessionalTaxFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/labour-welfare-fund" element={<LabourWelfareFundPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/payroll-compliance" element={<PayrollCompliancePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/gratuity-act" element={<GratuityAct isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/bonus-act" element={<BonusAct isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/minimum-wages" element={<MinimumWages isLoggedIn={isLoggedIn} />} />

              <Route path="/services/labour/pf-registration/apply" element={<ApplyPFRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/pf-filing/apply" element={<ApplyPFFiling isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/esi-registration/apply" element={<ApplyESIRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/esi-filing/apply" element={<ApplyESIFiling isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/professional-tax/apply" element={<ApplyProfessionalTax isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/labour-welfare-fund/apply" element={<ApplyLabourWelfareFund isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/gratuity-act/apply" element={<ApplyGratuityAct isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/bonus-act/apply" element={<ApplyBonusAct isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/minimum-wages/apply" element={<ApplyMinimumWages isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/payroll-compliance/apply" element={<ApplyPayrollCompliance isLoggedIn={isLoggedIn} />} />

              {/* Legal Drafting Routes */}
              <Route path="/services/legal-drafting/partnership-deed" element={<PartnershipDeed isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/partnership-deed/apply" element={<ApplyPartnershipDeed isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/founders-agreement" element={<FoundersAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/founders-agreement/apply" element={<ApplyFoundersAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/shareholders-agreement" element={<ShareholdersAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/shareholders-agreement/apply" element={<ApplyShareholdersAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/employment-agreement" element={<EmploymentAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/employment-agreement/apply" element={<ApplyEmploymentAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/rent-agreement" element={<RentAgreementDrafting isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/rent-agreement/apply" element={<ApplyRentAgreementDrafting isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/franchise-agreement" element={<FranchiseAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/franchise-agreement/apply" element={<ApplyFranchiseAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/nda" element={<NDA isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/nda/apply" element={<ApplyNDA isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/vendor-agreement" element={<VendorAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-drafting/vendor-agreement/apply" element={<ApplyVendorAgreement isLoggedIn={isLoggedIn} />} />

              {/* Business Certifications Routes */}
              <Route path="/services/business-certifications/msme-registration" element={<MSMERegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/msme-registration/apply" element={<ApplyMSMERegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/iso-certification" element={<ISOCertification isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/iso-certification/apply" element={<ApplyISOCertification isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/startup-india" element={<StartupIndia isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/startup-india/apply" element={<ApplyStartupIndia isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/digital-signature" element={<DigitalSignature isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/digital-signature/apply" element={<ApplyDigitalSignature isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/bar-code" element={<BarCodeRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/bar-code/apply" element={<ApplyBarCode isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/tan-pan" element={<TanPanApplication isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/tan-pan/apply" element={<ApplyTanPan isLoggedIn={isLoggedIn} />} />

              {/* Financial Services Routes */}
              <Route path="/services/financial-services/cma-data-preparation" element={<CmaDataPreparation isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/cma-data-preparation/apply" element={<CmaDataPreparationRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/project-report" element={<ProjectReport isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/project-report/apply" element={<ProjectReportRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/bank-loan-documentation" element={<BankLoanDocumentation isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/bank-loan-documentation/apply" element={<BankLoanDocumentationRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/cash-flow-compliance" element={<CashFlowCompliance isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/cash-flow-compliance/apply" element={<CashFlowStatementRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/startup-pitch-deck" element={<StartupPitchDeck isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/startup-pitch-deck/apply" element={<StartupPitchDeckRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/business-valuation" element={<BusinessValuation isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/business-valuation/apply" element={<BusinessValuationRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/virtual-cfo" element={<VirtualCFO isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/virtual-cfo/apply" element={<VirtualCFORegistration isLoggedIn={isLoggedIn} />} />

              {/* Legal Notice Routes */}
              <Route path="/services/legal-notices/legal-notice-drafting" element={<LegalNoticeDrafting isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/legal-notice-drafting/apply" element={<LegalNoticeRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/reply-to-legal-notice" element={<ReplyToLegalNotice isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/reply-to-legal-notice/apply" element={<LegalNoticeReplyRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/cheque-bounce-notice" element={<ChequeBounceNotice isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/cheque-bounce-notice/apply" element={<ChequeBounceNoticeRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/tax-notice-reply" element={<TaxNoticeReply isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/tax-notice-reply/apply" element={<TaxNoticeReplyRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/roc-notice-reply" element={<RocNoticeReply isLoggedIn={isLoggedIn} />} />
              <Route path="/services/legal-notices/roc-notice-reply/apply" element={<RocNoticeReplyRegistration isLoggedIn={isLoggedIn} />} />

              {/* Correction Routes */}
              <Route path="/services/corrections/pan-correction" element={<PanCorrection isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/pan-correction/apply" element={<PanCorrectionRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/gst-correction" element={<GstCorrection isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/gst-correction/apply" element={<GstCorrectionRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/fssai-correction" element={<FssaiCorrection isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/fssai-correction/apply" element={<FssaiCorrectionRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/company-llp-correction" element={<CompanyLLPDetailCorrection isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/company-llp-correction/apply" element={<CompanyLLPDetailCorrectionRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/din-dsc-correction" element={<DINDSCCorrection isLoggedIn={isLoggedIn} />} />
              <Route path="/services/corrections/din-dsc-correction/apply" element={<DINDSCCorrectionRegistration isLoggedIn={isLoggedIn} />} />

              {/* Business Closure Routes */}
              <Route path="/services/business-closure/llp-closure" element={<LLPClosure isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-closure/llp-closure/apply" element={<LLPClosureRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-closure/proprietorship-closure" element={<ProprietorshipClosure isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-closure/proprietorship-closure/apply" element={<ProprietorshipClosureRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-closure/fssai-cancellation" element={<FssaiCancellation isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-closure/fssai-cancellation/apply" element={<FssaiCancellationRegistration isLoggedIn={isLoggedIn} />} />



              {/* --- SEO DYNAMIC ROUTES --- */}
              {/* Dynamic Service-City Routes (Supports 10,000+ combinations) */}
              <Route path="/:seoSlug" element={<DynamicSEOPage />} />
              
              {/* Priority Static SEO Routes */}
              <Route path="/hire-ca-freelancer-india" element={<DynamicSEOPage />} />
              <Route path="/gst-registration-india" element={<DynamicSEOPage />} />
              <Route path="/income-tax-filing-india" element={<DynamicSEOPage />} />
              <Route path="/company-registration-india" element={<DynamicSEOPage />} />
              <Route path="/online-ca-consultation" element={<DynamicSEOPage />} />
              <Route path="/freelance-ca-services" element={<DynamicSEOPage />} />
              <Route path="/best-ca-freelancer-platform" element={<DynamicSEOPage />} />
              <Route path="/startup-compliance-india" element={<DynamicSEOPage />} />
              <Route path="/accounting-services-india" element={<DynamicSEOPage />} />
              <Route path="/tax-consultant-india" element={<DynamicSEOPage />} />

              {/* Loader Demo */}
              <Route path="/loader-demo" element={<Loader fullScreen={false} />} />
            </Routes>
          </div>
          {!shouldHideNavAndFooter && <Footer />}
        </div>
      )}
    </AuthContext.Provider>
  );
};


export default App;
