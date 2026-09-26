"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  ArrowRight, 
  Loader2, 
  Info, 
  ChevronRight, 
  Calendar, 
  Users, 
  ListChecks, 
  Scale, 
  Download, 
  Clock, 
  X, 
  HelpCircle,
  Briefcase,
  Home,
  ShoppingCart
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  analyzeLegalDocumentAction, 
  LegalDocumentAnalysis 
} from "@/actions/document-intelligence";
import GroundedDocumentQA from "@/components/GroundedDocumentQA";

const BENCHMARK_DOCUMENTS = [
  {
    id: "employment-noncompete",
    title: "Startup Employment Agreement (Non-Compete & Forfeiture)",
    category: "Employment",
    icon: <Briefcase size={18} className="text-purple-600" />,
    badge: "High Risk Clauses",
    description: "Standard tech offer letter containing a 2-year non-compete and unilateral salary forfeiture clause.",
    content: `EMPLOYMENT AND CONFIDENTIALITY AGREEMENT - TECH VENTURES INDIA
1. Probation & Notice: The Employee shall serve a probation period of 6 months. During or after probation, the Employee must provide 90 (ninety) days prior written notice before resigning.
2. Unilateral Salary Forfeiture: In the event the Employee fails to serve the complete 90-day notice period, the Employer reserves the absolute right to forfeit all unpaid salary, accrued bonuses, and experience certificates.
3. Post-Employment Non-Compete: Employee expressly covenants that for a period of 2 (two) years following termination of employment for any reason, Employee shall not directly or indirectly work for, consult, or operate any business competing in software engineering across India or worldwide.
4. Intellectual Property Assignment: All inventions, code, designs, or literary works authored by Employee—regardless of whether created during working hours or using personal equipment—shall remain the exclusive property of Employer without additional compensation.
5. Dispute Resolution: All disputes shall be subject solely to private arbitration in New Delhi, with the sole arbitrator chosen solely by the Employer.`
  },
  {
    id: "rental-lease",
    title: "Residential Lease (10-Month Deposit & 48h Eviction)",
    category: "Property / Tenancy",
    icon: <Home size={18} className="text-blue-600" />,
    badge: "Unlawful Eviction Risk",
    description: "Bengaluru residential lease with 10-month deposit, 50% painting deduction, and arbitrary eviction clause.",
    content: `11-MONTH RESIDENTIAL LEASE AGREEMENT - BENGALURU, KARNATAKA
1. Security Deposit: The Tenant shall pay an interest-free refundable deposit of INR 2,50,000 (10 months rent). Upon vacation, the Landlord shall automatically deduct 50% of the deposit for mandatory repainting and deep cleaning, irrespective of premise condition.
2. Early Termination & Lock-In: The initial 11 months shall be a mandatory lock-in period. If Tenant vacates prior to 11 months, the entire security deposit of INR 2,50,000 shall stand completely forfeited.
3. Summary Eviction: If rent is delayed by more than 3 (three) consecutive days, Landlord reserves the right to terminate electricity, lock the entrance, and evict the Tenant within 48 hours without requiring a court order.
4. Maintenance Burdens: All major structural repairs, plumbing overhauls, and electrical replacements shall be borne 100% by the Tenant during the tenancy.`
  },
  {
    id: "consumer-invoice",
    title: "Consumer Electronics Invoice & Warranty Terms",
    category: "Consumer Law",
    icon: <ShoppingCart size={18} className="text-amber-600" />,
    badge: "Unfair Trade Practice",
    description: "Retail electronics invoice featuring strict 'No Refund Under Any Circumstance' and exclusive jurisdiction clauses.",
    content: `TERMS & CONDITIONS OF SALE - ELECTRONICS MEGA STORE PVT LTD
1. No Refund Policy: Goods once sold will not be exchanged, returned, or refunded under any circumstances whatsoever, regardless of manufacturer defect or failure.
2. Warranty Exclusions: Any claim under warranty must be reported within 48 hours of invoice. Normal wear, software defects, power surges, or minor transit scuffs immediately void all warranty protections.
3. Limitation of Liability: In any event of defect, fire, or malfunction, the total liability of Seller shall be capped at 10% of the product purchase price.
4. Jurisdiction: All disputes arising from this sale shall be subject exclusively to the courts of New Delhi, and the consumer waives all rights to file in their home district consumer forum.`
  }
];

export default function DocumentAnalysisPage() {
  const router = useRouter();
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LegalDocumentAnalysis | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSelectDemo = (demo: typeof BENCHMARK_DOCUMENTS[0]) => {
    setSelectedDemoId(demo.id);
    setDocumentTitle(demo.title);
    setDocumentText(demo.content);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocumentTitle(file.name);
      setSelectedDemoId(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDocumentText(text || "");
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!documentText.trim()) return;

    setIsLoading(true);
    setAnalysis(null);

    try {
      const title = documentTitle.trim() || "Uploaded Legal Document";
      const result = await analyzeLegalDocumentAction(documentText, title);

      if (result.success && result.data) {
        setAnalysis(result.data);

        // Save to Firestore if authenticated
        if (auth.currentUser) {
          try {
            await addDoc(collection(db, `users/${auth.currentUser.uid}/document_analyses`), {
              title,
              documentText,
              analysis: result.data,
              createdAt: serverTimestamp()
            });
          } catch (dbErr) {
            console.warn("Could not persist to Firestore:", dbErr);
          }
        }

        // Save to sessionStorage for cross-tool context
        sessionStorage.setItem("nyaya_active_document", JSON.stringify({
          title,
          text: documentText,
          analysis: result.data
        }));

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        alert(result.error || "Failed to analyze document.");
      }
    } catch (err: any) {
      console.error(err);
      alert("An unexpected error occurred during document analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "Critical":
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Critical Risk</span>;
      case "High":
        return <span className="bg-red-100 text-red-800 border border-red-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">High Risk</span>;
      case "Moderate":
      case "Medium":
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Medium Risk</span>;
      default:
        return <span className="bg-green-100 text-green-800 border border-green-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Low Risk</span>;
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans selection:bg-black selection:text-white">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-muted font-semibold">
        <span className="cursor-pointer hover:text-black" onClick={() => router.push("/dashboard")}>Home</span>
        <ChevronRight size={14} />
        <span className="text-black">Document Intelligence</span>
        <ChevronRight size={14} />
        <span className="text-black font-bold">Understand Document</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-main pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-xs">
            <Sparkles size={14} />
            <span>AI Legal Document Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main">
            Understand Legal Documents & Detect Hidden Traps
          </h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl">
            Upload any contract, tenancy lease, employment offer, or terms of service. Our AI decodes complex legalese into plain English, flags unfair clauses, and prepares an actionable checklist.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-bg-subtle border border-border-main px-4 py-3 rounded-2xl shrink-0">
          <ShieldCheck size={22} className="text-black shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-text-main">Confidential & Grounded</p>
            <p className="text-text-muted text-[11px]">Strict anti-hallucination guardrails</p>
          </div>
        </div>
      </div>

      {/* Benchmark Agreement Selectors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Sparkles size={14} className="text-brand-primary" />
            <span>Try A Benchmark Agreement (Instant Live Demo)</span>
          </label>
          <span className="text-[11px] text-text-muted font-medium">Click any card to populate text</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BENCHMARK_DOCUMENTS.map((demo) => {
            const isSelected = selectedDemoId === demo.id;
            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleSelectDemo(demo)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-black text-white border-black shadow-md scale-[1.01]"
                    : "bg-white text-text-main border-border-main hover:border-black hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? "bg-white/20 text-white" : "bg-gray-100"}`}>
                      {demo.icon}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">{demo.category}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? "bg-white/20 text-white" : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {demo.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold truncate w-full">{demo.title}</h4>
                <p className={`text-[11px] mt-1 leading-snug line-clamp-2 ${isSelected ? "text-gray-300" : "text-text-muted"}`}>
                  {demo.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border border-border-main rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Document Name / Title (e.g. Bengaluru Lease 2025)"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="flex-1 px-4 py-2 bg-bg-subtle border border-border-main rounded-xl text-sm font-semibold outline-none focus:border-black transition-all"
          />
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-border-main bg-white hover:bg-bg-subtle rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Upload size={14} />
              <span>Upload Document (.txt, .pdf)</span>
            </button>
            {documentText && (
              <button
                type="button"
                onClick={() => {
                  setDocumentText("");
                  setDocumentTitle("");
                  setSelectedDemoId(null);
                  setAnalysis(null);
                }}
                className="p-2 text-text-muted hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                title="Clear input"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={documentText}
            onChange={(e) => {
              setDocumentText(e.target.value);
              setSelectedDemoId(null);
            }}
            placeholder="Paste your legal document, tenancy agreement, employment offer, or contract clauses here to analyze..."
            rows={8}
            className="w-full p-4 bg-bg-subtle/50 border border-border-main rounded-2xl text-xs font-mono text-text-main outline-none focus:ring-2 focus:ring-black focus:border-black transition-all resize-y leading-relaxed"
          />
          <div className="absolute right-3 bottom-3 text-[10px] font-mono text-text-muted bg-white/80 px-2 py-0.5 rounded border border-border-main">
            {documentText.length} characters • {documentText.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Info size={14} className="text-black" />
            <span>AI decomposes clauses into plain English and flags unenforceable terms under Indian statutes.</span>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !documentText.trim()}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-all shadow-md shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deconstructing Legal Clauses...</span>
              </>
            ) : (
              <>
                <span>Analyze Document</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div ref={resultsRef} className="space-y-8 animate-in fade-in duration-500 pt-4">
          
          {/* Executive Summary & Header Pill */}
          <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="bg-black text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                    {analysis.documentType}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-gray-200">
                    {analysis.jurisdiction}
                  </span>
                  {getRiskBadge(analysis.riskRadar.overallRisk)}
                </div>
                <h2 className="text-2xl font-black text-text-main tracking-tight">
                  {analysis.documentTitle}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 border border-border-main rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-xs"
                >
                  <Printer size={14} />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => handleCopy(JSON.stringify(analysis, null, 2), "summary")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-xs"
                >
                  {copiedSection === "summary" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  <span>{copiedSection === "summary" ? "Copied!" : "Copy Summary"}</span>
                </button>
              </div>
            </div>

            {/* Plain-English Executive Summary */}
            <div className="bg-bg-subtle p-5 rounded-2xl border border-border-main">
              <h3 className="text-xs font-black uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                <Scale size={14} className="text-black" />
                <span>Plain-English Executive Summary</span>
              </h3>
              <p className="text-sm font-semibold text-text-main leading-relaxed">
                {analysis.executiveSummary}
              </p>
            </div>

            {/* Parties & Crucial Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Parties */}
              <div className="p-4 border border-border-main rounded-2xl bg-white space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Users size={14} className="text-black" />
                  <span>Identified Parties & Obligations</span>
                </h4>
                <div className="space-y-2 pt-1">
                  {analysis.parties.map((p, idx) => (
                    <div key={idx} className="text-xs border-b border-border-main/50 pb-2 last:border-none last:pb-0">
                      <span className="font-extrabold text-black">{p.nameOrRole}: </span>
                      <span className="text-text-muted font-medium">{p.obligationsSummary}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crucial Dates & Values */}
              <div className="p-4 border border-border-main rounded-2xl bg-white space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Calendar size={14} className="text-black" />
                  <span>Key Terms & Financial Values</span>
                </h4>
                <div className="space-y-2 pt-1">
                  {analysis.keyDatesAndValues.map((v, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs border-b border-border-main/50 pb-2 last:border-none last:pb-0">
                      <div>
                        <span className="font-extrabold text-black">{v.label}</span>
                        <p className="text-[11px] text-text-muted font-medium">{v.significance}</p>
                      </div>
                      <span className="font-black bg-bg-subtle px-2.5 py-1 rounded-md text-xs border border-border-main shrink-0 ml-2">
                        {v.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Risk Radar */}
          <div className="bg-white border border-border-main rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight text-text-main flex items-center gap-2">
                  <ShieldAlert size={20} className="text-red-600" />
                  <span>Legal Risk Radar</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Multi-factor breakdown of potential legal and financial exposures in this text.</p>
              </div>
              <div>{getRiskBadge(analysis.riskRadar.overallRisk)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl border border-border-main bg-bg-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main">Financial Risk</span>
                  {getRiskBadge(analysis.riskRadar.financialRisk.level)}
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                  {analysis.riskRadar.financialRisk.explanation}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border-main bg-bg-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main">Termination Risk</span>
                  {getRiskBadge(analysis.riskRadar.terminationRisk.level)}
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                  {analysis.riskRadar.terminationRisk.explanation}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border-main bg-bg-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main">Liability Risk</span>
                  {getRiskBadge(analysis.riskRadar.liabilityRisk.level)}
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                  {analysis.riskRadar.liabilityRisk.explanation}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border-main bg-bg-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main">Restrictive Clauses</span>
                  {getRiskBadge(analysis.riskRadar.restrictiveCovenants.level)}
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                  {analysis.riskRadar.restrictiveCovenants.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Decoded Operational Clauses */}
          <div className="bg-white border border-border-main rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-black tracking-tight text-text-main flex items-center gap-2">
                <FileText size={20} className="text-black" />
                <span>Decoded Operational Clauses</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Every operative clause translated side-by-side from complex legalese into citizen language with statutory advisory notes.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {analysis.clauses.map((c, idx) => (
                <div key={idx} className="border border-border-main rounded-2xl p-5 bg-white hover:border-black transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-main/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-mono font-black">
                        {c.clauseNumber}
                      </span>
                      <h4 className="text-sm font-extrabold text-black">{c.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">
                        Type: {c.type}
                      </span>
                      {getRiskBadge(c.riskLevel)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-bg-subtle rounded-xl border border-border-main/60">
                      <span className="text-[10px] font-extrabold uppercase text-text-muted block mb-1">
                        Original Document Legalese:
                      </span>
                      <p className="font-mono text-[11px] text-gray-800 leading-relaxed italic">
                        "{c.originalSnippet}"
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      <span className="text-[10px] font-extrabold uppercase text-blue-900 block mb-1">
                        Plain-English Translation:
                      </span>
                      <p className="text-xs font-bold text-blue-950 leading-relaxed">
                        {c.plainEnglish}
                      </p>
                    </div>
                  </div>

                  {c.cautiousAdvisory && (
                    <div className="flex items-start gap-2 bg-amber-50/60 border border-amber-200 p-3 rounded-xl text-xs text-amber-950">
                      <AlertTriangle size={15} className="text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-[11px] text-amber-900 uppercase tracking-wider block">Statutory Advisory Note:</span>
                        <span className="font-semibold text-[11px]">{c.cautiousAdvisory}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document-Grounded Q&A Section */}
          <GroundedDocumentQA 
            documentText={documentText} 
            documentTitle={analysis.documentTitle} 
          />

          {/* Action Checklist & Advocate Preparation Kit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Action Checklist */}
            <div className="bg-white border border-border-main rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black tracking-tight text-text-main flex items-center gap-2">
                <ListChecks size={18} className="text-green-600" />
                <span>Citizen Action Checklist</span>
              </h3>
              <p className="text-xs text-text-muted">Recommended steps before executing or disputing this agreement.</p>
              
              <div className="space-y-2.5 pt-1">
                {analysis.actionChecklist.map((item, idx) => (
                  <div key={idx} className="p-3 bg-bg-subtle rounded-xl border border-border-main flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-black uppercase text-text-muted">{item.timeline}</span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          item.priority === "High" ? "bg-red-100 text-red-800" : "bg-gray-200 text-gray-700"
                        }`}>{item.priority} Priority</span>
                      </div>
                      <p className="text-xs font-bold text-text-main">{item.step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions to Ask Your Advocate */}
            <div className="bg-white border border-border-main rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black tracking-tight text-text-main flex items-center gap-2">
                  <HelpCircle size={18} className="text-purple-600" />
                  <span>Lawyer Consultation Brief</span>
                </h3>
                <button
                  onClick={() => handleCopy(analysis.lawyerQuestions.join("\n\n"), "questions")}
                  className="text-xs text-brand-primary font-bold flex items-center gap-1 hover:underline"
                >
                  {copiedSection === "questions" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  <span>{copiedSection === "questions" ? "Copied" : "Copy Questions"}</span>
                </button>
              </div>
              <p className="text-xs text-text-muted">Take these targeted questions to your paid advocate consultation to save time and fees.</p>

              <div className="space-y-2 pt-1">
                {analysis.lawyerQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-bold text-purple-950 leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Legal Safety Disclaimer */}
          <div className="bg-amber-50 border-2 border-amber-600/40 rounded-2xl p-5 flex items-start gap-3.5 shadow-xs text-amber-950">
            <Scale size={22} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-semibold">
              <span className="font-extrabold uppercase tracking-wider block text-amber-900 mb-1">
                Responsible Legal Information & Non-Advocate Disclaimer:
              </span>
              {analysis.disclaimer}
            </div>
          </div>

        </div>
      )}

    </main>
  );
}
