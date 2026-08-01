"use client";

import React, { useState, useRef } from "react";
import { 
  ChevronRight, 
  ShoppingCart,
  Eye,
  Image as ImageIcon,
  CheckCircle2,
  Package,
  MessageSquare,
  Upload,
  AlertTriangle,
  IdCard,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Headphones,
  X,
  Paperclip,
  FileText
} from "lucide-react";
import { useRouter } from "@/i18n/routing";

type EvidenceItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  mandatory: boolean;
  description: string;
  whyNeeded: string;
};

const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: "payment",
    label: "Payment Proof",
    icon: <ImageIcon size={20} />,
    mandatory: true,
    description: "Screenshot or download of the payment confirmation, transaction ID, amount, date and time.",
    whyNeeded: "Proves money was transferred."
  },
  {
    id: "invoice",
    label: "Order Details / Invoice",
    icon: <Package size={20} />,
    mandatory: true,
    description: "Screenshot of the order details, invoice, or any confirmation received from the seller.",
    whyNeeded: "Proves the purchase and agreement."
  },
  {
    id: "chat",
    label: "Conversation with Seller",
    icon: <MessageSquare size={20} />,
    mandatory: true,
    description: "Chats, emails or messages where you discussed the order, payment or issue.",
    whyNeeded: "Proves communication and seller's promise."
  },
  {
    id: "proof",
    label: "Proof of Non-Delivery / Deficiency",
    icon: <AlertTriangle size={20} />,
    mandatory: false,
    description: "Any evidence showing the product/service was not delivered or was defective. (Photos, videos, etc.)",
    whyNeeded: "Proves the issue and its impact."
  },
  {
    id: "idproof",
    label: "Your Identity Proof",
    icon: <IdCard size={20} />,
    mandatory: false,
    description: "Aadhaar card, PAN card or any valid ID proof.",
    whyNeeded: "Required for filing a complaint."
  }
];

export default function EvidenceChecklistPage() {
  const router = useRouter();

  // Pre-seed first two as collected for demo
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({
    payment: [new File(["demo"], "payment_receipt.pdf", { type: "application/pdf" })],
    invoice: [new File(["demo"], "order_invoice.jpg", { type: "image/jpeg" })],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const collectedCount = EVIDENCE_ITEMS.filter(item => (uploadedFiles[item.id]?.length || 0) > 0).length;
  const progressPct = Math.round((collectedCount / EVIDENCE_ITEMS.length) * 100);
  const progressDash = progressPct;
  const mandatoryDone = EVIDENCE_ITEMS.filter(i => i.mandatory).every(i => (uploadedFiles[i.id]?.length || 0) > 0);

  const handleUploadClick = (id: string) => {
    setActiveUploadId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeUploadId || !e.target.files?.length) return;
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => ({
      ...prev,
      [activeUploadId]: [...(prev[activeUploadId] || []), ...files]
    }));
    e.target.value = "";
  };

  const removeFile = (id: string, idx: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [id]: (prev[id] || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4 font-semibold">
        <span className="hover:text-text-main cursor-pointer" onClick={() => router.push("/dashboard")}>Home</span>
        <ChevronRight size={14} />
        <span className="hover:text-text-main cursor-pointer" onClick={() => router.push("/dashboard/ai-assistant")}>Case Analysis</span>
        <ChevronRight size={14} />
        <span className="text-text-main">Evidence Checklist</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-text-main tracking-tight">Evidence Checklist</h1>
              <div className="bg-bg-subtle text-text-main px-3 py-1 rounded-full text-xs font-bold border border-border-main">
                Step 2 of 5
              </div>
            </div>
            <p className="text-text-muted text-sm">Collect these documents and information to strengthen your case.</p>
          </div>

          {/* Mandatory completion banner */}
          {mandatoryDone && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <CheckCircle2 size={20} className="text-green-600 shrink-0" />
              <p className="text-sm font-bold text-green-800">All mandatory evidence collected! You can now proceed to the next step.</p>
            </div>
          )}

          {/* Top Case Details Card */}
          <div className="bg-white border border-border-main rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-bg-subtle rounded-xl flex items-center justify-center shrink-0 border border-border-main">
                <ShoppingCart size={24} className="text-text-main" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-text-main">Case: Online Transaction Fraud</h3>
                <p className="text-xs text-text-muted">Case ID: NYA-2025-0512-001</p>
              </div>
            </div>
            <button 
              onClick={() => router.push("/dashboard/ai-assistant")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border-main rounded-xl text-sm font-semibold hover:bg-bg-subtle transition-colors shrink-0"
            >
              <Eye size={16} />
              View Case Analysis
            </button>
          </div>

          {/* Evidence Items */}
          <div>
            <h3 className="font-bold text-lg text-text-main mb-4">Essential Evidence</h3>
            <div className="space-y-4">
              {EVIDENCE_ITEMS.map((item) => {
                const files = uploadedFiles[item.id] || [];
                const isCollected = files.length > 0;
                return (
                  <div key={item.id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all duration-300 ${
                    isCollected ? "border-green-200 bg-green-50/20" : "border-border-main"
                  }`}>
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isCollected ? "bg-green-100 border-green-200 text-green-700" : "bg-bg-subtle border-border-main text-text-main"
                        }`}>
                          {isCollected ? <CheckCircle2 size={20} /> : item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h4 className="font-bold text-sm text-text-main">{item.label}</h4>
                            {item.mandatory ? (
                              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Mandatory</span>
                            ) : (
                              <span className="bg-bg-subtle border border-border-main text-text-muted text-[10px] font-bold px-2 py-0.5 rounded-full">Recommended</span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted mb-1.5">{item.description}</p>
                          <p className="text-[11px] font-semibold text-text-main">
                            <span className="text-text-muted">Why needed:</span> {item.whyNeeded}
                          </p>

                          {/* Uploaded file list */}
                          {files.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {files.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-white border border-green-200 rounded-lg px-2.5 py-1">
                                  <Paperclip size={12} className="text-green-600 shrink-0" />
                                  <span className="text-[11px] font-semibold text-green-800 max-w-[140px] truncate">{file.name}</span>
                                  <button
                                    onClick={() => removeFile(item.id, idx)}
                                    className="text-text-muted hover:text-red-500 transition-colors ml-1"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:border-l border-border-main sm:pl-5 shrink-0">
                        {isCollected ? (
                          <button
                            onClick={() => handleUploadClick(item.id)}
                            className="flex flex-col items-center gap-1 text-green-600 hover:text-green-800 transition-colors"
                          >
                            <div className="flex items-center gap-1.5 font-bold text-sm">
                              <CheckCircle2 size={16} /> Collected
                            </div>
                            <span className="text-[10px] text-text-muted">{files.length} file{files.length !== 1 ? "s" : ""} · Add more</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUploadClick(item.id)}
                            className="flex flex-col items-center gap-1 text-text-main hover:text-black transition-colors group"
                          >
                            <div className="flex items-center gap-1.5 font-bold text-sm">
                              <Upload size={16} /> Upload
                            </div>
                            <span className="text-[10px] text-text-muted">PDF, JPG, PNG</span>
                          </button>
                        )}
                        <ChevronRight size={18} className="text-text-light" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button 
              onClick={() => router.push("/dashboard/ai-assistant")}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-border-main rounded-xl text-sm font-bold hover:bg-bg-subtle transition-colors shadow-sm"
            >
              <ArrowLeft size={16} />
              Previous: Case Analysis
            </button>
            <button
              onClick={() => router.push("/dashboard/navigator")}
              disabled={!mandatoryDone}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md ${
                mandatoryDone
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-bg-subtle text-text-muted border border-border-main cursor-not-allowed"
              }`}
            >
              Next: Recommended Actions
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* Sidebar Content (Right) */}
        <div className="space-y-6">
          
          {/* Progress Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-bold text-sm text-text-main self-start mb-5">Progress</h3>
            
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-green-600 transition-all duration-700"
                  strokeDasharray={`${progressDash}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black">{collectedCount}/{EVIDENCE_ITEMS.length}</span>
              </div>
            </div>

            <h4 className="font-bold text-sm text-text-main mb-1">Evidence Collected</h4>
            <p className="text-[11px] text-text-muted">
              {mandatoryDone
                ? "All mandatory evidence collected!"
                : "Collect all mandatory evidence to proceed."}
            </p>

            {/* Mini item status list */}
            <div className="w-full mt-4 space-y-1.5">
              {EVIDENCE_ITEMS.map((item) => {
                const done = (uploadedFiles[item.id]?.length || 0) > 0;
                return (
                  <div key={item.id} className="flex items-center justify-between text-[11px]">
                    <span className={`font-semibold truncate text-left max-w-[160px] ${done ? "text-green-700" : "text-text-muted"}`}>{item.label}</span>
                    <span className={`font-bold shrink-0 ml-2 ${done ? "text-green-600" : "text-gray-300"}`}>
                      {done ? "✓" : "○"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-yellow-600" />
              <h3 className="font-bold text-sm text-text-main">Tips</h3>
            </div>
            <ul className="space-y-3 text-xs text-text-main list-disc list-outside pl-4">
              <li className="leading-relaxed">Clear screenshots are more effective.</li>
              <li className="leading-relaxed">Include date and time in the screenshots.</li>
              <li className="leading-relaxed">Save chats as PDF if possible.</li>
              <li className="leading-relaxed">Do not edit or manipulate any documents.</li>
            </ul>
          </div>

          {/* Need Help Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Headphones size={20} className="text-text-main" />
              <h3 className="font-bold text-sm text-text-main">Need Help?</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Our assistant can guide you on what and how to collect.
            </p>
            <button
              onClick={() => router.push("/dashboard/ai-assistant")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
            >
              <MessageSquare size={16} />
              Ask AI Assistant
            </button>
          </div>

          {/* Your Case Info */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-text-main mb-4">Your Case</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted">Case ID</span>
                <span className="text-xs font-bold text-text-main font-mono">NYA-2025-0512-001</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-semibold text-text-muted shrink-0">Issue</span>
                <span className="text-xs font-bold text-text-main text-right">Online Transaction Fraud</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted">Severity</span>
                <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-[10px] font-bold">
                  High
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted">Evidence</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  mandatoryDone
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-bg-subtle text-text-muted border-border-main"
                }`}>
                  {collectedCount}/{EVIDENCE_ITEMS.length} Collected
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
