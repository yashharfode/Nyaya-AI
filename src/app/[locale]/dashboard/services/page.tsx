"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  Search, 
  Share2, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  Download, 
  ArrowRight,
  Calculator,
  Landmark,
  Scale,
  Award
} from "lucide-react";
import { useRouter } from "@/i18n/routing";

interface LegalServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Documentation" | "Court & Notice" | "Police & RTI" | "Property" | "Family & Civil";
  timeEstimate: string;
  costRange: string;
  costBreakdown: string;
  documentsNeeded: string[];
  whereToGo: {
    physical: string;
    online?: { name: string; url: string };
  };
  proTip?: string;
  isFreeGovtService?: boolean;
}

const SERVICES_DATA: LegalServiceItem[] = [
  {
    id: "notary-services",
    title: "Notary Services & Document Authentication",
    subtitle: "Legal attestation of affidavits, agreements, declarations, and deeds by an authorized Notary Public.",
    category: "Documentation",
    timeEstimate: "Same Day (30–60 mins)",
    costRange: "₹50 – ₹500",
    costBreakdown: "Statutory notary seal fee ₹50–₹100; Additional drafting/typing charges if applicable.",
    documentsNeeded: [
      "Original documents to be notarized",
      "Valid Government ID proof (Aadhaar, PAN, or Passport)",
      "Two passport-size photographs (if attesting sworn affidavits)",
      "Witness IDs (for property or power of attorney attestation)"
    ],
    whereToGo: {
      physical: "Notary Public offices near District Court premises, Sub-Registrar offices, or authorized advocate chambers.",
    },
    proTip: "Always check the red Notary Seal and Registration Number of the advocate. Simple photocopies cannot be notarized without showing the original."
  },
  {
    id: "affidavit-drafting",
    title: "Affidavit Drafting & Sworn Declarations",
    subtitle: "Sworn written statements for court proceedings, name change, DOB correction, address proof, and government claims.",
    category: "Documentation",
    timeEstimate: "1–2 Hours",
    costRange: "₹100 – ₹500",
    costBreakdown: "Non-judicial stamp paper (₹10–₹100 as per state rules) + Advocate drafting & Notary attestation fees.",
    documentsNeeded: [
      "Exact details & facts of the declaration/statement",
      "Valid ID & Address proof (Aadhaar / Voter ID)",
      "Supporting proof for claims (e.g., Gazette copy, old certificate)",
      "Non-judicial stamp paper of prescribed value"
    ],
    whereToGo: {
      physical: "Advocate offices near courts, Notary Public, or legal documentation kiosks.",
      online: { name: "e-Stamping Portal (SHCIL)", url: "https://www.shcilestamp.com" }
    },
    proTip: "For official government name changes, the affidavit must be followed by publication in two local newspapers and the State Gazette."
  },
  {
    id: "power-of-attorney",
    title: "Power of Attorney (General / Special - GPA & SPA)",
    subtitle: "Legal instrument authorizing another person (agent) to act on your behalf in property, banking, or court matters.",
    category: "Property",
    timeEstimate: "1–2 Days",
    costRange: "₹500 – ₹2,500+",
    costBreakdown: "Advocate drafting fee (₹500–₹2000) + State stamp duty & Sub-Registrar registration fee (varies by state).",
    documentsNeeded: [
      "ID & Address proof of both Principal (grantor) and Agent (holder)",
      "Property ownership documents (if GPA is for real estate)",
      "Non-judicial stamp paper as per state stamp act",
      "Two independent witnesses with valid government ID proof",
      "Passport-size photographs of Principal, Agent, and Witnesses"
    ],
    whereToGo: {
      physical: "Sub-Registrar Office of the jurisdiction where the property or principal resides.",
    },
    proTip: "A Power of Attorney for property sale is legally invalid unless compulsory registered at the Sub-Registrar office."
  },
  {
    id: "stamp-paper-registration",
    title: "Stamp Paper & Property / Agreement Registration",
    subtitle: "Procurement of e-Stamp paper and formal registration of sale deeds, lease agreements, gift deeds, and contracts.",
    category: "Property",
    timeEstimate: "1–3 Days",
    costRange: "2% – 8% of Value",
    costBreakdown: "Stamp Duty (2%–8% of property/transaction value depending on state) + Registration fee (usually 1%).",
    documentsNeeded: [
      "Drafted agreement or deed (Sale Deed, Lease Deed, Gift Deed)",
      "Aadhaar & PAN cards of all executing parties",
      "Property title deed, municipal tax receipt, and Katha/Mutation copy",
      "Two witnesses with original Aadhaar cards and photos"
    ],
    whereToGo: {
      physical: "Sub-Registrar Office (SRO) of the revenue district.",
      online: { name: "SHCIL e-Stamp Portal", url: "https://www.shcilestamp.com" }
    },
    proTip: "Rental agreements exceeding 11 months must be compulsorily registered under the Registration Act, 1908 to be admissible as evidence."
  },
  {
    id: "legal-notice-drafting",
    title: "Legal Notice Drafting & Serving",
    subtitle: "Formal legal intimation for cheque bounce, money recovery, breach of contract, tenant eviction, or defamation.",
    category: "Court & Notice",
    timeEstimate: "1–2 Days",
    costRange: "₹1,000 – ₹5,000",
    costBreakdown: "Advocate drafting fee (₹1000–₹5000) + Registered Post with Acknowledgment Due (RPAD) postal charges.",
    documentsNeeded: [
      "Complete chronology of facts and dispute details",
      "Invoices, agreements, bounced cheques, or bank memos",
      "Full legal name and address of the opponent party",
      "Copies of previous email, WhatsApp, or written correspondence"
    ],
    whereToGo: {
      physical: "Advocate chambers, Legal Aid Centers, or District Legal Services Authority (DLSA) for free legal aid.",
    },
    proTip: "Under Section 138 of NI Act (Cheque Bounce), sending a statutory legal notice within 30 days of cheque dishonor is compulsory before filing a case."
  },
  {
    id: "court-fee-filing",
    title: "Court Fee Calculation & Case Filing",
    subtitle: "Filing civil suits, appeals, writ petitions, and applications including payment of judicial stamp fee and Vakalatnama.",
    category: "Court & Notice",
    timeEstimate: "2–5 Days",
    costRange: "₹100 – ₹10,000+",
    costBreakdown: "Statutory court fee (calculated on claim value) + Vakalatnama stamp (₹20–₹50) + Advocate professional fee.",
    documentsNeeded: [
      "Typed Petition, Plaint, or Written Statement with index",
      "Original supporting documents & annexures",
      "Signed Vakalatnama (advocate authorization form)",
      "Judicial Court Fee stamps or e-Challan receipt",
      "Spare sets for service to opponent parties"
    ],
    whereToGo: {
      physical: "Filing Counter / Registry of District Court, High Court, or Tribunal.",
      online: { name: "e-Courts India e-Filing Portal", url: "https://efiling.ecourts.gov.in" }
    },
    proTip: "You can calculate exact statutory court fees online using the e-Courts fee calculator before purchasing judicial stamps."
  },
  {
    id: "rti-application",
    title: "RTI Application (Right to Information)",
    subtitle: "Requesting official government records, expenditure details, public works inspection, or decision notes from public departments.",
    category: "Police & RTI",
    timeEstimate: "30-Day Statutory Reply",
    costRange: "₹10 (FREE for BPL)",
    costBreakdown: "Statutory application fee ₹10 (Postal Order / Court Fee Stamp); ₹2 per additional photocopied page. 100% Free for BPL families.",
    documentsNeeded: [
      "Specific, concise questions regarding government records/work",
      "Name & designation of Public Information Officer (PIO)",
      "₹10 Indian Postal Order (IPO), Court Fee Stamp, or online payment",
      "BPL Ration Card copy (if claiming 100% fee exemption)"
    ],
    whereToGo: {
      physical: "By Registered Post to PIO of concerned department.",
      online: { name: "RTI Online Central Portal", url: "https://rtionline.gov.in" }
    },
    proTip: "If the PIO does not reply within 30 days, you can file a First Appeal free of cost, and information must then be provided free of charge.",
    isFreeGovtService: true
  },
  {
    id: "fir-filing",
    title: "FIR Filing (First Information Report)",
    subtitle: "Registering police complaint for cognizable offences like theft, fraud, assault, cybercrime, or domestic harassment.",
    category: "Police & RTI",
    timeEstimate: "Instant / Same Day",
    costRange: "₹0 (100% FREE)",
    costBreakdown: "Statutory Right under CrPC / BNSS. Police cannot charge any fee for registering an FIR or giving a free copy.",
    documentsNeeded: [
      "Written or verbal statement of the incident (Date, Time, Place)",
      "Identity of accused (if known to complainant)",
      "Valid ID proof of complainant (Aadhaar / Voter ID)",
      "Supporting evidence (medical certificates, screenshots, CCTV, photos)"
    ],
    whereToGo: {
      physical: "Nearest Police Station (based on incident jurisdiction) or SP/DCP Office.",
      online: { name: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in" }
    },
    proTip: "Under the law of 'Zero FIR', ANY police station must register an FIR for a cognizable crime regardless of territorial jurisdiction and transfer it.",
    isFreeGovtService: true
  },
  {
    id: "consumer-complaint",
    title: "Consumer Commission Complaint Filing",
    subtitle: "Filing cases against defective electronics, deficient services, e-commerce fraud, insurance rejection, or overcharging.",
    category: "Family & Civil",
    timeEstimate: "30–90 Days Resolution",
    costRange: "₹0 – ₹5,000",
    costBreakdown: "100% FREE for claims up to ₹5 Lakh. Nominal fee (₹500–₹5000) for higher valuation slabs.",
    documentsNeeded: [
      "Original bills, tax invoices, and payment receipts",
      "Warranty cards or service center inspection sheets",
      "Copies of correspondence / emails sent to seller customer care",
      "Photographs or videos demonstrating defect or deficiency"
    ],
    whereToGo: {
      physical: "District Consumer Disputes Redressal Commission.",
      online: { name: "e-Daakhil National Consumer Portal", url: "https://edaakhil.nic.in" }
    },
    proTip: "You do NOT need to hire an advocate to file a consumer case. Citizens can argue their own complaint in Consumer Commissions.",
    isFreeGovtService: true
  },
  {
    id: "marriage-registration",
    title: "Marriage Registration & Legal Certificate",
    subtitle: "Official registration of marriage under Hindu Marriage Act, Special Marriage Act, or Christian/Muslim marriage laws.",
    category: "Family & Civil",
    timeEstimate: "1–30 Days",
    costRange: "₹100 – ₹1,000",
    costBreakdown: "State registration fee ₹100–₹500; Special Marriage Act 30-day notice fee where applicable.",
    documentsNeeded: [
      "Age proof of Bride (min 18 yrs) and Groom (min 21 yrs) - Birth/School Cert.",
      "Address proof & Aadhaar cards of both parties",
      "Joint wedding photograph & individual passport photos",
      "Wedding invitation card or affidavit of marriage ceremony",
      "Three witnesses with original Aadhaar cards and photos"
    ],
    whereToGo: {
      physical: "Office of the Marriage Registrar / Sub-Registrar of District.",
    },
    proTip: "Under Special Marriage Act (inter-faith or court marriage), a mandatory 30-day public notice is displayed at the Registrar office."
  }
];

export default function LegalServicesGuidePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false);
  
  // Calculator state
  const [calcService, setCalcService] = useState<string>("property");
  const [calcAmount, setCalcAmount] = useState<number>(1000000);

  const categories = ["All", "Documentation", "Court & Notice", "Police & RTI", "Property", "Family & Civil"];

  const filteredServices = SERVICES_DATA.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.documentsNeeded.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.costBreakdown.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareWhatsApp = (e: React.MouseEvent, item: LegalServiceItem) => {
    e.stopPropagation();
    const text = `*⚖ NyayaAI Legal Service Guide: ${item.title}*\n\n` +
      `*Overview:* ${item.subtitle}\n` +
      `*Estimated Cost:* ${item.costRange}\n` +
      `*Time Required:* ${item.timeEstimate}\n\n` +
      `*📑 Documents You Need:*\n${item.documentsNeeded.map(d => "• " + d).join("\n")}\n\n` +
      `*💰 Cost Breakdown:*\n${item.costBreakdown}\n\n` +
      `*📍 Where To Go:*\n${item.whereToGo.physical}\n` +
      (item.whereToGo.online ? `*Online Portal:* ${item.whereToGo.online.url}\n\n` : "\n") +
      (item.proTip ? `*💡 Legal Pro-Tip:* ${item.proTip}\n\n` : "") +
      `_Shared via NyayaAI - India's AI Legal Operating System_`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleAskAI = (item: LegalServiceItem) => {
    const payload = {
      category: item.category,
      severity: "Medium",
      originalIssue: `I need help with [${item.title}]. Please explain the exact step-by-step procedure in India, verify if I have all required documents (${item.documentsNeeded.slice(0, 2).join(", ")}), and draft any necessary application or notice for me.`,
      applicableRights: [
        `Statutory Procedure: ${item.title}`,
        `Fee Structure: ${item.costRange}`,
        `Time Estimate: ${item.timeEstimate}`
      ],
      evidenceChecklist: item.documentsNeeded,
      recommendedAuthority: item.whereToGo.physical,
      complaintDraft: `Subject: Formal Application / Notice regarding ${item.title}\n\nRespected Sir/Madam,\n\nI am submitting the required documents as per statutory guidelines...`,
      summary: item.subtitle
    };

    sessionStorage.setItem("nyaya_ai_analysis", JSON.stringify(payload));
    router.push("/dashboard/ai-assistant");
  };

  const calculateEstimate = () => {
    if (calcService === "property") {
      const stampDuty = Math.round(calcAmount * 0.05); // ~5% avg
      const regFee = Math.round(calcAmount * 0.01); // 1%
      return {
        stampDuty: `₹${stampDuty.toLocaleString("en-IN")}`,
        regFee: `₹${regFee.toLocaleString("en-IN")}`,
        total: `₹${(stampDuty + regFee).toLocaleString("en-IN")}`,
        note: "Based on average 5% stamp duty + 1% registration fee."
      };
    } else if (calcService === "consumer") {
      const fee = calcAmount <= 500000 ? 0 : (calcAmount <= 1000000 ? 200 : 1000);
      return {
        stampDuty: "₹0",
        regFee: `₹${fee}`,
        total: `₹${fee}`,
        note: calcAmount <= 500000 ? "100% FREE for consumer claims up to ₹5 Lakh." : "Nominal statutory fee for consumer claims."
      };
    } else if (calcService === "notice") {
      return {
        stampDuty: "₹0",
        regFee: "₹100 (Postal)",
        total: "₹1,500 – ₹3,500",
        note: "Includes typical advocate drafting fee + Registered Post with Acknowledgment Due."
      };
    }
    return { stampDuty: "₹100", regFee: "₹50", total: "₹150 – ₹500", note: "Standard notary and non-judicial stamp fee." };
  };

  const est = calculateEstimate();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase inline-flex items-center gap-1.5">
              <Briefcase size={14} /> Legal Services Guide
            </span>
            <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-blue-200">
              ● Documents • Costs • Where To Go
            </span>
          </div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Legal Services & Costs Guide</h1>
          <p className="text-sm text-text-muted mt-1">
            Understand common legal services in India with actionable checklists of documents required, official fees, and verified authorities.
          </p>
        </div>

        <button
          onClick={() => setCalculatorOpen(!calculatorOpen)}
          className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm shrink-0"
        >
          <Calculator size={16} />
          {calculatorOpen ? "Hide Fee Estimator" : "Quick Cost Estimator"}
        </button>
      </div>

      {/* QUICK COST ESTIMATOR DRAWER */}
      {calculatorOpen && (
        <div className="bg-[#F8FAFC] border-2 border-black rounded-2xl p-6 shadow-md animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calculator size={20} className="text-brand-primary" />
              <h3 className="font-bold text-base text-text-main">Quick Statutory Fee & Stamp Duty Estimator</h3>
            </div>
            <span className="text-xs font-semibold text-text-muted bg-white px-3 py-1 rounded-full border border-border-main">
              Indicative Indian Rates
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                1. Select Legal Service / Instrument
              </label>
              <select
                value={calcService}
                onChange={(e) => setCalcService(e.target.value)}
                className="w-full bg-white border border-border-main rounded-xl px-4 py-2.5 text-sm font-bold text-text-main outline-none focus:ring-2 focus:ring-black"
              >
                <option value="property">Property Sale / Lease Deed Registration</option>
                <option value="consumer">Consumer Commission Complaint Filing</option>
                <option value="notice">Legal Notice Drafting & Serving</option>
                <option value="affidavit">Affidavit / Sworn Declaration Notarization</option>
              </select>
            </div>

            {(calcService === "property" || calcService === "consumer") && (
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  2. Enter Property / Claim Value (₹)
                </label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-border-main rounded-xl px-4 py-2 text-sm font-bold text-text-main outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}

            <div className="bg-white border-2 border-black p-4 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Estimated Official Cost:
              </p>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-text-main">{est.total}</span>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Govt / Stamp Estimate
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-tight">{est.note}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar & Search */}
      <div className="bg-white border border-border-main rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold shrink-0 transition-colors ${
                selectedCategory === cat 
                  ? "bg-black text-white" 
                  : "bg-bg-subtle text-text-muted hover:text-text-main"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service, fee, or document..."
            className="w-full pl-10 pr-4 py-2 bg-bg-subtle border border-border-main rounded-xl text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
          />
        </div>

      </div>

      {/* Pro-Tips Alert Bar */}
      <div className="bg-bg-subtle border border-border-main rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck size={24} className="text-text-main shrink-0" />
        <p className="text-xs sm:text-sm text-text-main font-medium">
          <span className="font-bold">Citizen Pro-Tip:</span> Police cannot refuse to register an FIR for cognizable crimes (Zero FIR). RTI applications and Consumer Commission complaints up to ₹5 Lakh are statutory rights with 100% free government filing fees.
        </p>
      </div>

      {/* Legal Services Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white border-2 border-black rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Title & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {service.category}
                </span>

                <div className="flex items-center gap-2">
                  {service.isFreeGovtService && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-300">
                      ★ 100% Free Govt Right
                    </span>
                  )}
                  <span className="bg-bg-subtle text-text-main text-xs font-bold px-3 py-1 rounded-full border border-border-main flex items-center gap-1">
                    <Clock size={12} />
                    {service.timeEstimate}
                  </span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-text-main mb-1.5">
                {service.title}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                {service.subtitle}
              </p>

              {/* THREE PILLAR PANELS: DOCUMENTS, COST, WHERE TO GO */}
              <div className="space-y-4 mb-6">
                
                {/* 1. DOCUMENTS YOU NEED */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-main mb-2.5 flex items-center gap-1.5">
                    <FileText size={15} className="text-brand-primary" />
                    📑 WHAT DOCUMENTS YOU NEED
                  </h3>
                  <ul className="space-y-1.5">
                    {service.documentsNeeded.map((doc, idx) => (
                      <li key={idx} className="text-xs text-text-main flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. COST BREAKDOWN */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <DollarSign size={15} className="text-amber-700" />
                      💰 ESTIMATED COST & FEES
                    </h3>
                    <span className="text-xs font-black text-amber-950 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                      {service.costRange}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {service.costBreakdown}
                  </p>
                </div>

                {/* 3. WHERE TO GO */}
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={15} className="text-blue-700" />
                    📍 WHERE TO GO
                  </h3>
                  <p className="text-xs text-blue-950 font-semibold leading-relaxed">
                    {service.whereToGo.physical}
                  </p>
                  {service.whereToGo.online && (
                    <div className="mt-2 pt-2 border-t border-blue-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-800">
                        Online Portal: {service.whereToGo.online.name}
                      </span>
                      <a
                        href={service.whereToGo.online.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-black text-blue-900 hover:underline inline-flex items-center gap-1"
                      >
                        Visit <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>

                {/* PRO TIP */}
                {service.proTip && (
                  <div className="bg-white border border-border-main rounded-xl p-3 flex items-start gap-2.5">
                    <AlertCircle size={15} className="text-text-main shrink-0 mt-0.5" />
                    <p className="text-[11px] text-text-muted font-medium leading-relaxed">
                      <span className="font-bold text-text-main">Pro-Tip: </span>
                      {service.proTip}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* CARD ACTION FOOTER */}
            <div className="flex items-center justify-between pt-4 border-t border-border-main gap-3 flex-wrap sm:flex-nowrap">
              <button
                onClick={(e) => handleShareWhatsApp(e, service)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#1ebd5b] transition-all shadow-sm w-full sm:w-auto"
                title="Share this service guide on WhatsApp"
              >
                <Share2 size={14} />
                Share Guide
              </button>

              <button
                onClick={() => handleAskAI(service)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-sm w-full sm:w-auto"
              >
                <Sparkles size={14} />
                Ask AI for Details
              </button>
            </div>

          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white border border-border-main rounded-2xl p-12 text-center">
          <Briefcase size={40} className="mx-auto text-text-light mb-3" />
          <h3 className="font-bold text-lg text-text-main mb-1">No legal services matched your search</h3>
          <p className="text-sm text-text-muted">Try searching for notary, affidavit, property, RTI, or FIR.</p>
        </div>
      )}

    </main>
  );
}
