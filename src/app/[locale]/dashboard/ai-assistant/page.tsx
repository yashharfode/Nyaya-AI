"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  ChevronRight, 
  CheckCircle2, 
  Download, 
  Share2, 
  Pencil,
  ShoppingCart,
  ShieldAlert,
  Clock,
  Bot,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Star,
  Loader2,
  FileText,
  CheckSquare,
  Landmark,
  Scale
} from "lucide-react";

export default function CaseAnalysisPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [revealStep, setRevealStep] = useState(0);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("nyaya_ai_analysis");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setAnalysis(parsed);
      } catch (e) {
        console.error("Failed to parse analysis data", e);
      }
    }
    
    // Simulate initial loading time for dramatic effect if data exists
    if (data) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Cascading reveal effect
  useEffect(() => {
    if (!isLoading && analysis) {
      const timers = [
        setTimeout(() => setRevealStep(1), 500),  // Category
        setTimeout(() => setRevealStep(2), 1500), // Severity
        setTimeout(() => setRevealStep(3), 2500), // Applicable Rights
        setTimeout(() => setRevealStep(4), 3500), // Evidence Checklist
        setTimeout(() => setRevealStep(5), 4500), // Recommended Authority
        setTimeout(() => setRevealStep(6), 6000), // Complaint Draft
        setTimeout(() => setRevealStep(7), 7500), // Next Steps
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isLoading, analysis]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 relative flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin"></div>
          <Bot size={24} className="text-brand-primary absolute" />
        </div>
        <h2 className="text-xl font-bold text-text-main animate-pulse">NyayaAI is thinking...</h2>
        <p className="text-text-muted text-sm">Analyzing laws, precedents, and evidence requirements.</p>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-black border border-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
            <Bot size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Case Assistant</h2>
          <p className="text-gray-400 mb-8">Follow these steps to get a complete case analysis:</p>
          
          <div className="space-y-4 mb-8 text-left">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <p className="text-sm font-medium text-white mt-0.5">Please upload or paste the details of your legal issue</p>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <p className="text-sm font-medium text-white mt-0.5">Ensure all relevant documents are attached for a thorough analysis</p>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <p className="text-sm font-medium text-white mt-0.5">Specify the jurisdiction if known</p>
            </div>
          </div>

          <button 
            onClick={() => router.push("/dashboard/describe-issue")}
            className="w-full bg-white text-black px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Start New Analysis <ArrowRight size={18} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6 print:py-0 print:px-0">
      
      {/* Hide breadcrumbs and header on print */}
      <div className="print:hidden">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4 font-semibold">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>AI Assistant</span>
          <ChevronRight size={14} />
          <span className="text-text-main">Case Analysis</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main pb-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-text-main tracking-tight">Smart Analysis</h1>
            {revealStep >= 7 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 size={14} />
                Analysis Complete
              </div>
            )}
          </div>
          
          <div className={`flex items-center gap-3 transition-opacity duration-1000 ${revealStep >= 7 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-text-main text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors shadow-sm">
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Container - Hidden on Print */}
      <div ref={printRef} className="grid lg:grid-cols-[1fr_320px] gap-8 items-start print:hidden">
        
        {/* Main Content (Left) */}
        <div className="space-y-6">
          
          {/* Your Issue Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm print:shadow-none print:border-b">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                <FileText size={20} className="text-brand-primary" />
                Your Issue
              </h3>
              <button 
                onClick={() => router.push("/dashboard/describe-issue")}
                className="print:hidden flex items-center gap-2 px-3 py-1.5 bg-white border border-border-main rounded-xl text-xs font-bold text-text-main hover:bg-bg-subtle transition-colors shrink-0"
              >
                <Pencil size={12} />
                Edit
              </button>
            </div>
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
              {analysis.originalIssue}
            </p>
          </div>

          {/* Stats Grid - Step 1 & 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
            
            {/* Case Category (Step 1) */}
            <div className={`bg-white border border-border-main rounded-2xl p-5 shadow-sm flex flex-col transition-all duration-700 ${revealStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-bg-subtle rounded-xl flex items-center justify-center">
                  <ShoppingCart size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-semibold">Case Category</p>
                  <p className="font-bold text-text-main">{analysis.category || "General Dispute"}</p>
                </div>
              </div>
            </div>

            {/* Severity (Step 2) */}
            <div className={`bg-white border border-border-main rounded-2xl p-5 shadow-sm flex flex-col transition-all duration-700 ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <ShieldAlert size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-semibold">Severity</p>
                  <div className="inline-block bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-200 mt-1">
                    {analysis.severity || "Medium"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applicable Rights (Step 3) */}
          {revealStep >= 3 && (
            <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 print:shadow-none print:border-b">
              <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
                <Scale size={20} className="text-indigo-600" />
                Applicable Rights & Laws
              </h3>
              <ul className="space-y-3">
                {(analysis.applicableRights || analysis.implications || []).map((right: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-main bg-bg-subtle/50 p-3 rounded-xl border border-border-main">
                    <ShieldCheck size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence Checklist (Step 4) */}
          {revealStep >= 4 && (
            <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 print:shadow-none print:border-b">
              <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
                <CheckSquare size={20} className="text-amber-600" />
                Evidence Checklist
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {(analysis.evidenceChecklist || []).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border border-border-main rounded-xl hover:bg-bg-subtle transition-colors cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-text-light group-hover:border-brand-primary flex items-center justify-center bg-white shrink-0"></div>
                    <span className="text-sm font-medium text-text-main line-clamp-2">{item}</span>
                  </div>
                ))}
                {(!analysis.evidenceChecklist || analysis.evidenceChecklist.length === 0) && (
                  <p className="text-sm text-text-muted">No specific evidence checklist generated.</p>
                )}
              </div>
            </div>
          )}

          {/* Recommended Authority (Step 5) */}
          {revealStep >= 5 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 print:bg-none print:border-b print:shadow-none">
              <h3 className="font-bold text-text-main text-lg mb-2 flex items-center gap-2">
                <Landmark size={20} className="text-blue-700" />
                Recommended Authority
              </h3>
              <p className="text-sm text-text-main mb-4">You should file your complaint with:</p>
              <div className="bg-white border border-blue-200 p-4 rounded-xl shadow-sm inline-block font-bold text-blue-900">
                {analysis.recommendedAuthority || "Appropriate Legal Forum"}
              </div>
            </div>
          )}

          {/* Complaint Draft (Step 6) */}
          {revealStep >= 6 && analysis.complaintDraft && (
            <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 print:shadow-none print:border-0 print:pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                  <FileText size={20} className="text-text-main" />
                  Generated Complaint Draft
                </h3>
                <button className="print:hidden text-xs font-bold text-brand-primary hover:underline">Copy Text</button>
              </div>
              <div className="bg-bg-subtle/30 border border-border-main rounded-xl p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-text-main max-h-[400px] overflow-y-auto print:max-h-none print:border-0 print:bg-transparent print:p-0">
                {analysis.complaintDraft}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Content (Right) - Hidden on Print */}
        <div className="space-y-6 print:hidden">
          
          {/* Next Steps (Step 7) */}
          <div className={`bg-black rounded-2xl p-6 shadow-xl transition-all duration-1000 ${revealStep >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb size={18} className="text-yellow-400" />
              Next Steps
            </h3>
            <div className="space-y-4 relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-800 z-0"></div>
              {(analysis.nextSteps || ["Review analysis", "Gather documents", "File complaint"]).map((step: string, idx: number) => (
                <div key={idx} className="flex gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold shrink-0 border-2 border-black">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5">{step}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={handlePrint}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              <Download size={16} />
              Save Case File (PDF)
            </button>
          </div>

          {/* Urgent Help - Always visible early */}
          <div className={`bg-white border border-border-main rounded-2xl p-6 shadow-sm transition-opacity duration-1000 ${revealStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0">
                <PhoneCall size={20} className="text-text-main" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Need Urgent Help?</h4>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed">If this is an emergency or you feel threatened, contact authorities immediately.</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-text-main text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-colors">
              <PhoneCall size={16} />
              Emergency Contacts
            </button>
          </div>

        </div>

      </div>

      {/* --- PROFESSIONAL PRINT LAYOUT (HIDDEN ON SCREEN) --- */}
      <div className="hidden print:block font-serif text-black max-w-4xl mx-auto p-8 bg-white">
        {/* Header */}
        <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-1">NyayaAI</h1>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">Official Legal Analysis Report</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Ref:</strong> NYA-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Case Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">1. Case Summary</h2>
          <div className="bg-gray-50 p-4 rounded text-sm leading-relaxed border border-gray-200 whitespace-pre-wrap">
            {analysis.originalIssue}
          </div>
        </div>

        {/* Classification */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">2. Classification</h2>
            <p className="text-sm mb-2"><strong className="text-gray-600">Category:</strong> {analysis.category || "General Dispute"}</p>
            <p className="text-sm"><strong className="text-gray-600">Severity:</strong> {analysis.severity || "Medium"}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">3. Recommended Forum</h2>
            <p className="text-sm font-bold text-black">{analysis.recommendedAuthority || "Appropriate Legal Forum"}</p>
          </div>
        </div>

        {/* Rights & Evidence */}
        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">4. Applicable Rights & Laws</h2>
          <ul className="list-disc pl-5 text-sm space-y-2">
            {(analysis.applicableRights || analysis.implications || []).map((right: string, idx: number) => (
              <li key={idx}>{right}</li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">5. Required Evidence</h2>
          <ul className="list-disc pl-5 text-sm space-y-2">
            {(analysis.evidenceChecklist || []).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
            {(!analysis.evidenceChecklist || analysis.evidenceChecklist.length === 0) && (
              <p className="text-sm text-gray-500 italic">No specific evidence listed.</p>
            )}
          </ul>
        </div>

        {/* Complaint Draft */}
        {analysis.complaintDraft && (
          <div className="mb-8 break-inside-avoid">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">6. Official Complaint Draft</h2>
            <div className="border border-gray-300 p-6 text-sm font-serif leading-loose whitespace-pre-wrap">
              {analysis.complaintDraft}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-300 text-xs text-center text-gray-500">
          <p className="font-bold mb-1">Disclaimer</p>
          <p>This document is generated by NyayaAI for informational purposes and does not constitute formal legal advice. Please consult with a qualified legal professional before taking legal action.</p>
        </div>
      </div>
    </main>
  );
}
