"use client";

import React from "react";
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
  Headphones
} from "lucide-react";
import { useRouter } from "@/i18n/routing";

export default function EvidenceChecklistPage() {
  const router = useRouter();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      
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

          <div>
            <h3 className="font-bold text-lg text-text-main mb-4">Essential Evidence</h3>
            
            <div className="space-y-4">
              {/* Evidence Item 1 */}
              <div className="bg-white border border-border-main rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center shrink-0 border border-border-main">
                    <ImageIcon size={20} className="text-text-main" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-text-main">Payment Proof</h4>
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Mandatory</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 max-w-md">Screenshot or download of the payment confirmation, transaction ID, amount, date and time.</p>
                    <p className="text-[11px] font-semibold text-text-main"><span className="text-text-muted">Why needed:</span> Proves money was transferred.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:border-l border-border-main sm:pl-6 shrink-0">
                  <div className="flex flex-col items-end sm:items-center gap-1">
                    <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                      <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                      Collected
                    </div>
                    <span className="text-[10px] text-text-muted">1 file uploaded</span>
                  </div>
                  <ChevronRight size={18} className="text-text-light" />
                </div>
              </div>

              {/* Evidence Item 2 */}
              <div className="bg-white border border-border-main rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center shrink-0 border border-border-main">
                    <Package size={20} className="text-text-main" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-text-main">Order Details / Invoice</h4>
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Mandatory</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 max-w-md">Screenshot of the order details, invoice, or any confirmation received from the seller.</p>
                    <p className="text-[11px] font-semibold text-text-main"><span className="text-text-muted">Why needed:</span> Proves the purchase and agreement.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:border-l border-border-main sm:pl-6 shrink-0">
                  <div className="flex flex-col items-end sm:items-center gap-1">
                    <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                      <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                      Collected
                    </div>
                    <span className="text-[10px] text-text-muted">1 file uploaded</span>
                  </div>
                  <ChevronRight size={18} className="text-text-light" />
                </div>
              </div>

              {/* Evidence Item 3 */}
              <div className="bg-white border border-border-main rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center shrink-0 border border-border-main">
                    <MessageSquare size={20} className="text-text-main" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-text-main">Conversation with Seller</h4>
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Mandatory</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 max-w-md">Chats, emails or messages where you discussed the order, payment or issue.</p>
                    <p className="text-[11px] font-semibold text-text-main"><span className="text-text-muted">Why needed:</span> Proves communication and seller's promise.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:border-l border-border-main sm:pl-6 shrink-0 cursor-pointer group">
                  <div className="flex flex-col items-end sm:items-center gap-1 group-hover:text-black transition-colors text-text-main">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <Upload size={16} />
                      Upload
                    </div>
                    <span className="text-[10px] text-text-muted">PDF, JPG, PNG</span>
                  </div>
                  <ChevronRight size={18} className="text-text-light group-hover:text-black transition-colors" />
                </div>
              </div>

              {/* Evidence Item 4 */}
              <div className="bg-white border border-border-main rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center shrink-0 border border-border-main">
                    <AlertTriangle size={20} className="text-text-main" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-text-main">Proof of Non-Delivery / Deficiency</h4>
                      <span className="bg-bg-subtle border border-border-main text-text-muted text-[10px] font-bold px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 max-w-md">Any evidence showing the product/service was not delivered or was defective. (Photos, videos, etc.)</p>
                    <p className="text-[11px] font-semibold text-text-main"><span className="text-text-muted">Why needed:</span> Proves the issue and its impact.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:border-l border-border-main sm:pl-6 shrink-0 cursor-pointer group">
                  <div className="flex flex-col items-end sm:items-center gap-1 group-hover:text-black transition-colors text-text-main">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <Upload size={16} />
                      Upload
                    </div>
                    <span className="text-[10px] text-text-muted">PDF, JPG, PNG</span>
                  </div>
                  <ChevronRight size={18} className="text-text-light group-hover:text-black transition-colors" />
                </div>
              </div>

              {/* Evidence Item 5 */}
              <div className="bg-white border border-border-main rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center shrink-0 border border-border-main">
                    <IdCard size={20} className="text-text-main" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-text-main">Your Identity Proof</h4>
                      <span className="bg-bg-subtle border border-border-main text-text-muted text-[10px] font-bold px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 max-w-md">Aadhaar card, PAN card or any valid ID proof.</p>
                    <p className="text-[11px] font-semibold text-text-main"><span className="text-text-muted">Why needed:</span> Required for filing a complaint.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:border-l border-border-main sm:pl-6 shrink-0 cursor-pointer group">
                  <div className="flex flex-col items-end sm:items-center gap-1 group-hover:text-black transition-colors text-text-main">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <Upload size={16} />
                      Upload
                    </div>
                    <span className="text-[10px] text-text-muted">PDF, JPG, PNG</span>
                  </div>
                  <ChevronRight size={18} className="text-text-light group-hover:text-black transition-colors" />
                </div>
              </div>

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
            <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-md">
              Next: Recommended Actions
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* Sidebar Content (Right) */}
        <div className="space-y-6">
          
          {/* Progress Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-bold text-sm text-text-main self-start mb-6">Progress</h3>
            
            {/* Circular Progress (CSS driven) */}
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Circle */}
                <path
                  className="text-gray-100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                {/* Progress Circle (40% for 2/5) */}
                <path
                  className="text-green-600"
                  strokeDasharray="40, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black">2/5</span>
              </div>
            </div>

            <h4 className="font-bold text-sm text-text-main mb-1">Evidence Collected</h4>
            <p className="text-[11px] text-text-muted">Collect all mandatory evidence to proceed further.</p>
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
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-border-main rounded-xl text-xs font-bold hover:bg-bg-subtle transition-colors shadow-sm">
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
                <span className="text-xs font-bold text-text-main">NYA-2025-0512-001</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-semibold text-text-muted shrink-0">Issue</span>
                <span className="text-xs font-bold text-text-main text-right">Online Transaction Fraud</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted">Severity</span>
                <span className="bg-bg-subtle text-text-main px-3 py-1 rounded-full text-[10px] font-bold border border-border-main">
                  Medium
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
