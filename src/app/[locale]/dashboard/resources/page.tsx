"use client";

import React, { useState } from "react";
import { 
  Search, 
  FileText, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Folder, 
  FileCheck2, 
  Scale, 
  ChevronRight, 
  Check, 
  Loader2,
  X,
  Copy,
  Printer,
  BookOpen,
  Share2,
  CheckCircle2
} from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";

interface LegalResource {
  id: number;
  title: string;
  description: string;
  category: "Legal Templates" | "Glossaries" | "How-to Guides" | "Forms & Applications";
  icon: React.ReactNode;
  fileName: string;
  content: string;
}

const ALL_RESOURCES: LegalResource[] = [
  {
    id: 1,
    title: "Standard Legal Notice Template",
    description: "A formal written communication sent to a person or entity informing them of your intention to undertake legal proceedings.",
    category: "Legal Templates",
    icon: <FileText size={20} className="text-blue-600" />,
    fileName: "Standard_Legal_Notice_Template.txt",
    content: `[ADVOCATE / SENDER NAME & ADDRESS]
[Contact Number | Email Address]
Date: DD/MM/YYYY

REGISTERED POST WITH ACKNOWLEDGEMENT DUE / SPEED POST / EMAIL

To,
[Name of Recipient / Opposite Party]
[Complete Address of Opposite Party]

SUBJECT: LEGAL NOTICE UNDER SECTION 80 CPC / SECTION 138 NEGOTIABLE INSTRUMENTS ACT / LAW OF CONTRACT FOR [INSERT SUBJECT OF DISPUTE, e.g., NON-PAYMENT OF DUES / BREACH OF CONTRACT]

Under instructions from and on behalf of my client, [Name of Your Client], residing at [Client's Full Address], I hereby serve upon you the following Legal Notice:

1. That my client entered into [describe the agreement, transaction, or relationship, e.g., "an agreement dated XX/XX/XXXX for professional services"].
2. That in accordance with the said agreement/transaction, my client faithfully discharged all obligations required under the law.
3. That despite repeated reminders and requests made by my client on [Dates of correspondence], you have failed and neglected to [describe the default/breach, e.g., "clear the outstanding payment of Rs. XXXX / rectify the defective service"].
4. That your actions constitute a deliberate breach of trust, deficiency in service, and unlawful withholding of my client's rightful dues.

DEMAND & REQUISITION:
I hereby call upon you to:
a) [State demand clearly, e.g., "Pay the outstanding amount of Rs. XXXXX along with interest @ 18% per annum"] within FIFTEEN (15) DAYS from the receipt of this Legal Notice;
b) Compensate my client with Rs. [XXXX] towards mental harassment and legal costs.

Please note that in the event of your failure to comply with this notice within the stipulated period of 15 days, my client shall be constrained to initiate appropriate civil and/or criminal proceedings against you before the competent Court of Law entirely at your risk, cost, and consequence.

Copy kept in office for record.

[Signature of Advocate / Sender]
[Advocate Registration Number, if applicable]`
  },
  {
    id: 2,
    title: "Rental Agreement Draft",
    description: "Standardized residential rental agreement draft outlining terms between landlord and tenant.",
    category: "Legal Templates",
    icon: <FileText size={20} className="text-blue-600" />,
    fileName: "Residential_Rental_Agreement_Draft.txt",
    content: `RESIDENTIAL LEASE / RENTAL AGREEMENT

This Rental Agreement is made and executed on this [Day] of [Month], [Year] at [City/State] between:

LANDLORD / LICENSOR:
[Full Name of Landlord], S/o [Father's Name], aged about [XX] years, residing at [Landlord's Address], hereinafter referred to as the "LANDLORD" (which expression shall include successors and assigns).

AND

TENANT / LICENSEE:
[Full Name of Tenant], S/o [Father's Name], aged about [XX] years, permanently residing at [Tenant's Permanent Address], hereinafter referred to as the "TENANT".

WHEREAS the Landlord is the absolute owner of the residential property situated at [Complete Address of Leased Property], and has agreed to let out the premises to the Tenant for residential purposes only.

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. TERM OF LEASE: The lease shall be for an initial duration of ELEVEN (11) MONTHS commencing from [Start Date] and ending on [End Date].
2. MONTHLY RENT: The Tenant agrees to pay a monthly rent of Rs. [XXXXX]/- (Rupees [Words] Only), payable on or before the [Xth] day of every calendar month.
3. SECURITY DEPOSIT: The Tenant has deposited an interest-free refundable Security Deposit of Rs. [XXXXX]/- with the Landlord, which shall be returned upon peaceful vacation of the premises after deducting dues, if any.
4. UTILITIES & MAINTENANCE: Electricity, water charges, and society maintenance shall be borne by the [Tenant / Landlord] according to meter readings and society bills.
5. NOTICE PERIOD: Either party may terminate this agreement prior to the expiry of the 11-month term by serving a THIRTY (30) DAYS written notice to the other party.
6. PERMITTED USE: The premises shall be used strictly for lawful residential purposes of the Tenant and immediate family members only. No commercial activity or sub-letting is permitted.
7. GOVERNING LAW: Any dispute arising out of this Agreement shall be subject to the exclusive jurisdiction of the Courts at [City Name].

IN WITNESS WHEREOF, both parties have signed this Rental Agreement on the date mentioned above in the presence of witnesses.

LANDLORD SIGNATURE: ____________________
TENANT SIGNATURE:   ____________________

WITNESS 1: ____________________
WITNESS 2: ____________________`
  },
  {
    id: 3,
    title: "Consumer Rights Glossary",
    description: "A comprehensive glossary of terms related to consumer protection laws in India.",
    category: "Glossaries",
    icon: <FileCheck2 size={20} className="text-purple-600" />,
    fileName: "Indian_Consumer_Rights_Glossary.txt",
    content: `INDIAN CONSUMER RIGHTS & LAW GLOSSARY (CPA, 2019)

1. CONSUMER:
Any person who buys goods or hires services for consideration. Excludes individuals purchasing goods for commercial resale, but includes self-employment livelihoods.

2. DEFICIENCY IN SERVICE:
Any fault, imperfection, shortcoming, or inadequacy in the quality, nature, or manner of performance which is required to be maintained by law or contract (e.g., delayed flights, medical negligence, banking errors).

3. PRODUCT LIABILITY:
The responsibility of a product manufacturer, seller, or service provider to compensate for harm caused by a defective product or deficient service.

4. UNFAIR TRADE PRACTICE (UTP):
Deceptive practices such as false advertising, selling expired goods, refusing legitimate cash refunds within 7 days, or imposing replacement-only terms on damaged parcels.

5. PECUNIARY JURISDICTION (2021 REVISED LIMITS):
- District Consumer Commission: Claims up to Rs. 50 Lakhs.
- State Consumer Commission: Claims from Rs. 50 Lakhs to Rs. 2 Crore.
- National Commission (NCDRC): Claims exceeding Rs. 2 Crore.

6. E-DAAKHIL:
The official Government of India online portal (edaakhil.nic.in) allowing consumers to file complaints electronically from any location without needing an advocate.

7. CENTRAL CONSUMER PROTECTION AUTHORITY (CCPA):
A national regulatory authority empowered to investigate class-action consumer rights violations, order recalls of unsafe goods, and penalize misleading endorsements.`
  },
  {
    id: 4,
    title: "How to File an RTI (Guide)",
    description: "Step-by-step guide on how to file a Right to Information (RTI) application online.",
    category: "How-to Guides",
    icon: <Folder size={20} className="text-amber-600" />,
    fileName: "How_To_File_RTI_Application_Guide.txt",
    content: `CITIZEN STEP-BY-STEP GUIDE: HOW TO FILE AN RTI APPLICATION
Under the Right to Information (RTI) Act, 2005

WHO CAN FILE?
Every Indian citizen has the statutory right to request information from any Public Authority (Central, State, or Local government body, or state-funded institution).

METHOD 1: ONLINE FILING (CENTRAL GOVERNMENT DEPARTMENTS)
Step 1: Visit the official portal: https://rtionline.gov.in
Step 2: Click on "Submit Request" and read the guidelines.
Step 3: Select the appropriate Ministry/Department (e.g., Ministry of Railways, Ministry of Health, UIDAI).
Step 4: Fill in your personal details (Name, Address, Email, Mobile).
Step 5: Type your RTI query clearly in points (limit: 3000 characters). Avoid asking hypothetical "Why" questions; ask for specific records, memos, budgets, or inspection reports.
Step 6: Pay the statutory fee of Rs. 10/- via UPI, Debit Card, or Net Banking. (Below Poverty Line / BPL citizens are exempt from fee upon uploading BPL card).

METHOD 2: OFFLINE FILING (STATE OR LOCAL DEPARTMENTS)
Step 1: Draft an application addressed to: "The Public Information Officer (PIO), [Department Name & Office Address]".
Step 2: Mention clearly: "Application under Section 6(1) of the Right to Information Act, 2005".
Step 3: Attach an Indian Postal Order (IPO) or Court Fee Stamp of Rs. 10/- payable to the Accounts Officer.
Step 4: Send via Speed Post / Registered Post and retain the postal tracking receipt.

STATUTORY TIMELINE & FIRST APPEAL:
- The PIO is legally bound to provide the information within 30 DAYS (or 48 HOURS if the matter involves life and liberty).
- If information is denied or delayed beyond 30 days, you can file a First Appeal under Section 19(1) to the First Appellate Authority (FAA) free of cost.`
  },
  {
    id: 5,
    title: "Non-Disclosure Agreement (NDA)",
    description: "Standard mutual non-disclosure agreement to protect confidential information.",
    category: "Legal Templates",
    icon: <FileText size={20} className="text-blue-600" />,
    fileName: "Mutual_Non_Disclosure_Agreement_NDA.txt",
    content: `MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on this [Day] of [Month], [Year] by and between:

PARTY A:
[Name of Individual / Company], having its principal address at [Address of Party A].

AND

PARTY B:
[Name of Individual / Company], having its principal address at [Address of Party B].

1. DEFINITION OF CONFIDENTIAL INFORMATION:
"Confidential Information" refers to any proprietary technical data, business plans, financial records, source code, trade secrets, customer lists, or product designs disclosed by either party, whether verbally or in writing.

2. OBLIGATIONS OF RECIPROCATION & CONFIDENTIALITY:
Each party agrees to:
a) Hold all Confidential Information in strict confidence and protect it with the same degree of care as its own proprietary data;
b) Restrict disclosure strictly to employees, legal counsel, or contractors on a "need-to-know" basis who are bound by confidentiality obligations;
c) Not use the Confidential Information for any commercial purpose outside the contemplated business relationship without prior written consent.

3. EXCLUSIONS FROM CONFIDENTIALITY:
This Agreement shall not apply to information that:
a) Is already in the public domain without breach of this Agreement;
b) Was lawfully known to the receiving party prior to disclosure;
c) Is required to be disclosed by order of a competent Court or statutory authority.

4. TERM & DURATION:
This Agreement shall remain valid for a period of THREE (3) YEARS from the date of execution. The obligation of confidentiality regarding trade secrets shall survive indefinitely.

5. GOVERNING LAW & JURISDICTION:
This Agreement shall be construed in accordance with the laws of India, and Courts at [City Name] shall have exclusive jurisdiction.

PARTY A SIGNATURE: ____________________
PARTY B SIGNATURE: ____________________`
  },
  {
    id: 6,
    title: "Divorce Mutual Consent Form",
    description: "Standard petition format for filing divorce by mutual consent under the Hindu Marriage Act.",
    category: "Forms & Applications",
    icon: <FileText size={20} className="text-pink-600" />,
    fileName: "Mutual_Consent_Divorce_Petition_13B.txt",
    content: `IN THE COURT OF THE PRINCIPAL JUDGE, FAMILY COURT AT [CITY NAME]

HINDU MARRIAGE PETITION NO. ________ OF [YEAR]
UNDER SECTION 13-B OF THE HINDU MARRIAGE ACT, 1955

BETWEEN:
1. [Full Name of Husband], S/o [Father's Name], aged about [XX] years, residing at [Complete Address]
... PETITIONER NO. 1 (HUSBAND)

AND

2. [Full Name of Wife], D/o [Father's Name], aged about [XX] years, residing at [Complete Address]
... PETITIONER NO. 2 (WIFE)

JOINT PETITION FOR DISSOLUTION OF MARRIAGE BY MUTUAL CONSENT

The Petitioners above-named respectfully submit as under:

1. SOLEMNIZATION OF MARRIAGE:
That the marriage between Petitioner No. 1 and Petitioner No. 2 was solemnized on [Marriage Date] at [City Name] according to Hindu Vedic rites and ceremonies.

2. SEPARATION & INCOMPATIBILITY:
That due to irreconcilable temperamental differences, the Petitioners have been living separately since [Separation Date, must be over 1 year ago]. Despite best efforts by family members and counselors, reconciliation has not been possible.

3. MUTUAL SETTLEMENT:
a) ALIMONY & MAINTENANCE: Petitioner No. 1 has agreed to pay Rs. [XXXXX]/- to Petitioner No. 2 towards one-time full and final settlement of all past, present, and future alimony claims.
b) CHILD CUSTODY (if applicable): The custody of the minor child [Child Name] shall remain with [Petitioner 1 / 2], with mutual visitation rights as detailed in Annexure A.
c) STRIDHAN & ASSETS: All personal belongings, Stridhan, and jewelry have been mutually exchanged and neither party has any further monetary or property claim against the other.

4. FREE CONSENT:
That this joint petition is being filed mutually, voluntarily, and without any coercion, fraud, or undue influence.

PRAYER:
In light of the above facts, the Petitioners pray that this Hon'ble Court be pleased to grant a decree of Divorce by Mutual Consent dissolving the marriage solemnized between them on [Marriage Date].

PETITIONER NO. 1 (HUSBAND): ____________________
PETITIONER NO. 2 (WIFE):    ____________________
ADVOCATE FOR PETITIONERS:   ____________________`
  }
];

export default function ResourcesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);
  const [previewModalResource, setPreviewModalResource] = useState<LegalResource | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = [
    { name: "All", count: ALL_RESOURCES.length },
    { name: "Legal Templates", count: ALL_RESOURCES.filter(r => r.category === "Legal Templates").length },
    { name: "How-to Guides", count: ALL_RESOURCES.filter(r => r.category === "How-to Guides").length },
    { name: "Glossaries", count: ALL_RESOURCES.filter(r => r.category === "Glossaries").length },
    { name: "Forms & Applications", count: ALL_RESOURCES.filter(r => r.category === "Forms & Applications").length },
  ];

  const filteredResources = ALL_RESOURCES.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRealDownload = (res: LegalResource) => {
    setDownloadingId(res.id);
    try {
      const blob = new Blob([res.content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = res.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setDownloadingId(null);
        if (!downloadedIds.includes(res.id)) {
          setDownloadedIds(prev => [...prev, res.id]);
        }
      }, 800);
    } catch (e) {
      console.error("Download failed:", e);
      setDownloadingId(null);
    }
  };

  const handleCopyText = (res: LegalResource) => {
    navigator.clipboard.writeText(res.content);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCustomizeWithAI = (res: LegalResource) => {
    const payload = {
      category: res.category,
      severity: "Medium",
      originalIssue: `I need help customizing the "${res.title}" template with my specific names, dates, and facts.`,
      applicableRights: [res.title, "Statutory Compliance"],
      evidenceChecklist: [
        "Names and addresses of both parties",
        "Key dates and transaction amounts",
        "Supporting invoice or agreement copies"
      ],
      recommendedAuthority: "Legal Documentation & Drafting",
      complaintDraft: res.content,
      summary: `Standardized ${res.title} loaded into AI Assistant for personalized legal drafting.`
    };

    sessionStorage.setItem("nyaya_ai_analysis", JSON.stringify(payload));
    router.push("/dashboard/ai-assistant");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 space-y-6 lg:space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Legal Drafting Library
            </span>
            <span className="bg-green-100 text-green-900 text-xs font-bold px-3 py-1 rounded-full border border-green-300">
              ● Verified Indian Formats
            </span>
          </div>
          <h1 className="text-3xl font-black text-text-main">Legal Resources & Templates</h1>
          <p className="text-text-muted text-sm font-medium mt-1">
            Access standardized legal notices, rental agreements, RTIs, NDAs, and mutual consent divorce petitions. Download instantly or preview full statutory text.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, RTIs, or sections..." 
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all text-xs font-bold shadow-sm"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          
          {filteredResources.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-3xl p-16 text-center shadow-sm">
              <Folder size={48} className="mx-auto text-text-light mb-4" />
              <h3 className="text-lg font-bold text-text-main mb-2">No resources found</h3>
              <p className="text-text-muted text-sm">Try searching for Legal Notice, Rental Agreement, RTI, or NDA.</p>
            </div>
          ) : (
            filteredResources.map((res) => (
              <div 
                key={res.id} 
                className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-bg-subtle rounded-2xl flex items-center justify-center shrink-0 border border-black shadow-sm">
                      {res.icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold bg-black text-white px-2.5 py-0.5 rounded-full">
                          {res.category}
                        </span>
                        {downloadedIds.includes(res.id) && (
                          <span className="text-[10px] uppercase tracking-wider font-extrabold bg-green-100 text-green-900 px-2.5 py-0.5 rounded-full border border-green-300 flex items-center gap-1">
                            <CheckCircle2 size={11} /> Downloaded
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-lg text-text-main leading-snug">{res.title}</h3>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed font-medium">
                        {res.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t-2 border-border-main">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleRealDownload(res)}
                      disabled={downloadingId === res.id}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                        downloadedIds.includes(res.id)
                          ? "bg-green-700 text-white hover:bg-green-800"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                      title="Download standardized .txt file"
                    >
                      {downloadingId === res.id ? (
                        <><Loader2 size={14} className="animate-spin" /> Downloading...</>
                      ) : downloadedIds.includes(res.id) ? (
                        <><Download size={14} /> Download Again</>
                      ) : (
                        <><Download size={14} /> Download File</>
                      )}
                    </button>

                    <button
                      onClick={() => setPreviewModalResource(res)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-text-main border-2 border-black text-xs font-bold rounded-xl hover:bg-bg-subtle transition-colors shadow-sm"
                      title="Preview full statutory document text"
                    >
                      <ExternalLink size={14} />
                      Preview
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleCopyText(res)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-bg-subtle hover:bg-gray-200 text-text-main border border-border-main rounded-xl text-xs font-bold transition-colors"
                      title="Copy full document text to clipboard"
                    >
                      {copiedId === res.id ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                      {copiedId === res.id ? "Copied" : "Copy"}
                    </button>

                    <button
                      onClick={() => handleCustomizeWithAI(res)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white border border-brand-primary rounded-xl text-xs font-bold transition-all"
                      title="Open in AI Assistant to fill your personal details automatically"
                    >
                      <Sparkles size={13} />
                      Customize with AI
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* AI Generator CTA */}
          <div className="bg-gradient-to-br from-indigo-900 via-black to-black text-white rounded-3xl p-7 shadow-lg relative overflow-hidden border-2 border-black">
            <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
              <Scale size={140} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles size={16} />
                NyayaAI Drafting Engine
              </div>
              <h3 className="text-xl font-extrabold mb-2">Need a Custom Draft?</h3>
              <p className="text-indigo-100 text-xs mb-6 leading-relaxed font-medium">
                Describe your unique dispute, and our AI will generate a tailored legal notice, consumer complaint, or affidavit in seconds.
              </p>
              <Link 
                href="/dashboard/ai-assistant" 
                className="bg-white text-black border-2 border-black text-xs font-bold px-5 py-3 rounded-xl flex items-center justify-between gap-2 hover:bg-bg-subtle transition-all shadow-md"
              >
                Open AI Legal Assistant
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base mb-4 flex items-center gap-2 text-text-main">
              <Folder size={18} className="text-brand-primary" />
              Filter by Category
            </h3>
            <div className="space-y-2">
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all font-bold text-xs ${
                    activeCategory === cat.name 
                      ? "bg-black text-white shadow-sm" 
                      : "hover:bg-bg-subtle text-text-main border border-transparent hover:border-border-main"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`border text-xs font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                    activeCategory === cat.name
                      ? "bg-gray-800 border-gray-700 text-gray-300"
                      : "bg-bg-main border-border-main text-text-muted"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* --- LIVE INTERACTIVE PREVIEW MODAL --- */}
      {previewModalResource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-black pb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {previewModalResource.category}
                  </span>
                  <span className="bg-bg-subtle text-text-main px-3 py-1 rounded-full text-xs font-bold border border-black font-mono">
                    {previewModalResource.fileName}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-text-main">
                  {previewModalResource.title}
                </h2>
                <p className="text-xs text-text-muted font-bold mt-1">
                  {previewModalResource.description}
                </p>
              </div>

              <button
                onClick={() => setPreviewModalResource(null)}
                className="p-2.5 rounded-full bg-bg-subtle hover:bg-gray-200 text-text-main transition-colors shrink-0 border border-black"
                title="Close Preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Document Content Box */}
            <div className="bg-[#F8FAFC] border-2 border-black rounded-2xl p-6 sm:p-8 font-mono text-xs sm:text-sm text-text-main whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner max-h-[55vh] overflow-y-auto">
              {previewModalResource.content}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-black">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleCopyText(previewModalResource)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 bg-bg-subtle hover:bg-gray-200 text-text-main border border-black rounded-2xl text-xs font-bold transition-colors"
                >
                  {copiedId === previewModalResource.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  {copiedId === previewModalResource.id ? "Copied Full Text" : "Copy Full Text"}
                </button>

                <button
                  onClick={() => {
                    const win = window.open("", "_blank");
                    if (win) {
                      win.document.write(`<pre style="font-family: monospace; font-size: 14px; padding: 20px;">${previewModalResource.content}</pre>`);
                      win.document.close();
                      win.print();
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 bg-white hover:bg-bg-subtle text-text-main border border-black rounded-2xl text-xs font-bold transition-colors"
                >
                  <Printer size={14} />
                  Print
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    const res = previewModalResource;
                    setPreviewModalResource(null);
                    handleCustomizeWithAI(res);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 bg-white text-text-main border-2 border-black rounded-2xl text-xs font-bold hover:bg-bg-subtle transition-all"
                >
                  <Sparkles size={14} />
                  Customize with AI
                </button>

                <button
                  onClick={() => handleRealDownload(previewModalResource)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all shadow-md"
                >
                  <Download size={15} />
                  Download File ({previewModalResource.fileName})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
