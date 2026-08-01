"use client";

import React from "react";
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
  Star
} from "lucide-react";

export default function CaseAnalysisPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4 font-semibold">
        <span>Home</span>
        <ChevronRight size={14} />
        <span>AI Assistant</span>
        <ChevronRight size={14} />
        <span className="text-text-main">Case Analysis</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main pb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-text-main tracking-tight">Case Analysis</h1>
              <div className="hidden sm:flex items-center gap-1.5 bg-gray-100 text-text-main px-3 py-1.5 rounded-full text-xs font-bold border border-border-main">
                <CheckCircle2 size={14} className="text-text-main" />
                AI Analysis Complete
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-xl text-sm font-semibold hover:bg-bg-subtle transition-colors shadow-sm">
                <Download size={16} />
                Download Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-xl text-sm font-semibold hover:bg-bg-subtle transition-colors shadow-sm">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
          <p className="text-text-muted">Here is your case analysis and recommended legal action.</p>

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-border-main overflow-x-auto scrollbar-hide text-sm font-semibold">
            <button className="text-brand-primary border-b-2 border-brand-primary pb-3 whitespace-nowrap">Case Summary</button>
            <button className="text-text-muted hover:text-text-main pb-3 whitespace-nowrap transition-colors">Applicable Laws</button>
            <button className="text-text-muted hover:text-text-main pb-3 whitespace-nowrap transition-colors">Evidence Checklist</button>
            <button className="text-text-muted hover:text-text-main pb-3 whitespace-nowrap transition-colors">Recommended Actions</button>
            <button className="text-text-muted hover:text-text-main pb-3 whitespace-nowrap transition-colors">Draft Documents</button>
          </div>

          {/* Your Issue Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-bold text-text-main text-lg">Your Issue</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border-main rounded-xl text-xs font-bold text-text-main hover:bg-bg-subtle transition-colors shrink-0">
                <Pencil size={12} />
                Edit Issue
              </button>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              My online transaction was fraudulent. Money was deducted from my account but the product/service was not delivered and the merchant is not responding.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white border border-border-main rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center mb-3">
                <ShoppingCart size={20} className="text-text-main" />
              </div>
              <p className="text-xs text-text-muted font-semibold mb-1">Issue Category</p>
              <p className="font-bold text-sm text-text-main mb-3">Consumer Dispute</p>
              <p className="text-[11px] text-text-muted mt-auto">Transaction Fraud / Deficiency in Service</p>
            </div>

            <div className="bg-white border border-border-main rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center mb-3 relative">
                <ShieldAlert size={20} className="text-text-main" />
              </div>
              <p className="text-xs text-text-muted font-semibold mb-1">Severity Level</p>
              <div className="bg-gray-100 text-text-main px-3 py-1 rounded-full text-xs font-bold mb-3 border border-border-main">
                Medium
              </div>
              <p className="text-[11px] text-text-muted mt-auto">Your issue requires formal action but is not an emergency.</p>
            </div>

            <div className="bg-white border border-border-main rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center mb-3">
                <Clock size={20} className="text-text-main" />
              </div>
              <p className="text-xs text-text-muted font-semibold mb-1">Likely Resolution Time</p>
              <p className="font-bold text-sm text-text-main mb-3">30 – 60 Days</p>
              <p className="text-[11px] text-text-muted mt-auto">Estimated time for initial response after filing.</p>
            </div>

          </div>

          {/* AI Summary Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center shrink-0 border border-border-main">
                <Bot size={20} className="text-text-main" />
              </div>
              <div>
                <h3 className="font-bold text-text-main text-sm mb-2">AI Summary</h3>
                <p className="text-[13px] text-text-muted leading-relaxed mb-6">
                  Based on the details you provided, this appears to be a case of online transaction fraud and deficiency in service under consumer protection laws and IT Act. You have the right to claim refund and compensation for the loss.
                </p>
                
                <h4 className="font-bold text-sm text-text-main mb-3">What this means:</h4>
                <ul className="list-disc list-outside pl-4 space-y-2 text-[13px] text-text-muted">
                  <li>You were a victim of unfair trade practice.</li>
                  <li>You are entitled to refund of the amount paid.</li>
                  <li>You can also claim compensation for harassment and loss.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Next Step Banner */}
          <div className="bg-black rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-black/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center shrink-0">
                <Lightbulb size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Next Step</h3>
                <p className="text-[13px] text-gray-300">Review applicable laws and collect the required evidence to take action.</p>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shrink-0">
              View Applicable Laws <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* Sidebar Content (Right) */}
        <div className="space-y-6">
          
          {/* At a Glance */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-4">At a Glance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-main pb-3">
                <span className="text-xs font-semibold text-text-muted">Case ID</span>
                <span className="text-xs font-bold text-text-main">NYA-2025-0512-001</span>
              </div>
              <div className="flex items-center justify-between border-b border-border-main pb-3">
                <span className="text-xs font-semibold text-text-muted">Date Analyzed</span>
                <span className="text-xs font-bold text-text-main">12 May 2025, 11:30 AM</span>
              </div>
              <div className="flex items-center justify-between border-b border-border-main pb-3">
                <span className="text-xs font-semibold text-text-muted">Analyzed By</span>
                <span className="text-xs font-bold text-text-main">NyayaAI Assistant</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted">Privacy</span>
                <span className="text-xs font-bold text-text-main flex items-center gap-1">
                  100% Secure & Private <ShieldCheck size={12} />
                </span>
              </div>
            </div>
          </div>

          {/* Urgent Help */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0">
                <PhoneCall size={20} className="text-text-main" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Need Urgent Help?</h4>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed">If this is an emergency or you feel threatened, contact authorities immediately.</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
              <PhoneCall size={16} />
              Emergency Contacts
            </button>
          </div>

          {/* Helpful Tip */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-3 mb-6 relative z-10">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                <Star size={14} fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Helpful Tip</h4>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Keep all communication, payment screenshots, and transaction details safe. They will strengthen your case.</p>
              </div>
            </div>
            
            {/* Placeholder for Gavel/Books illustration */}
            <div className="w-full h-24 bg-bg-subtle rounded-xl flex items-center justify-center border border-border-main text-text-light text-xs font-bold uppercase relative z-10">
              Illustration Area
            </div>
          </div>

          {/* Rate Analysis */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-sm mb-1">Rate This Analysis</h4>
            <p className="text-[11px] text-text-muted mb-4">Was this analysis helpful?</p>
            <div className="flex items-center gap-2 text-text-light">
              <button className="hover:text-yellow-400 transition-colors"><Star size={20} /></button>
              <button className="hover:text-yellow-400 transition-colors"><Star size={20} /></button>
              <button className="hover:text-yellow-400 transition-colors"><Star size={20} /></button>
              <button className="hover:text-yellow-400 transition-colors"><Star size={20} /></button>
              <button className="hover:text-yellow-400 transition-colors"><Star size={20} /></button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
