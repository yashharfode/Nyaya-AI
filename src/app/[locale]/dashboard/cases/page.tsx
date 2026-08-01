"use client";

import React from "react";
import { 
  Plus, 
  ShoppingCart, 
  Home, 
  Briefcase, 
  CreditCard, 
  ShieldAlert, 
  ChevronRight,
  Check,
  ChevronLeft,
  PieChart,
  PlusSquare,
  Upload,
  MessageSquare,
  ShieldCheck,
  Headphones,
  Calendar,
  ArrowRight
} from "lucide-react";
import { useRouter } from "@/i18n/routing";

export default function MyCasesPage() {
  const router = useRouter();

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight mb-2">My Cases</h1>
          <p className="text-sm text-text-muted">Track, manage and take action on all your legal matters in one place.</p>
        </div>
        <button 
          onClick={() => router.push("/dashboard/describe-issue")}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} />
          New Case
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="space-y-6">
          
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button className="px-4 py-2 rounded-full text-sm font-bold bg-black text-white shrink-0">All Cases</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">In Progress</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">Draft</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">Pending Action</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">Resolved</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">Closed</button>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            
            {/* Case 1: Detailed with Timeline */}
            <div className="bg-white border border-border-main rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
                    <ShoppingCart size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-main mb-1">Online Transaction Fraud</h3>
                    <p className="text-xs text-text-muted mb-3">Case ID: NYA-2025-0512-001</p>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Calendar size={14} /> 12 May 2025
                      </div>
                      <div className="flex items-center gap-1.5 text-text-main">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        In Progress
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:items-start justify-between sm:flex-col gap-2 shrink-0">
                  <div className="flex items-center justify-end w-full gap-2">
                    <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold border border-orange-200">
                      Medium
                    </span>
                  </div>
                  <div className="text-right flex items-center justify-end gap-3 mt-auto">
                    <div>
                      <p className="text-[10px] text-text-muted font-semibold">Last Updated</p>
                      <p className="text-xs font-bold text-text-main">12 May 2025, 11:30 AM</p>
                    </div>
                    <ChevronRight size={20} className="text-text-light" />
                  </div>
                </div>
              </div>

              {/* Timeline Indicator inside Case 1 */}
              <div className="mt-6 pt-5 border-t border-border-main">
                <div className="flex items-center justify-between relative px-2">
                  {/* Background Line */}
                  <div className="absolute left-6 right-6 top-3 h-0.5 bg-gray-200 z-0"></div>
                  {/* Progress Line */}
                  <div className="absolute left-6 top-3 h-0.5 bg-green-500 z-0" style={{ width: '50%' }}></div>

                  <div className="flex flex-col items-center gap-2 relative z-10 w-20">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-bold text-text-main text-center leading-tight">Issue Described</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 relative z-10 w-20">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-bold text-text-main text-center leading-tight">AI Analysis</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 relative z-10 w-20">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-bold text-text-main text-center leading-tight">Evidence Collected</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 relative z-10 w-20">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-sm font-bold text-[10px] outline outline-4 outline-white">
                      4
                    </div>
                    <span className="text-[10px] font-bold text-text-main text-center leading-tight">Action Recommended</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 relative z-10 w-20">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-text-muted flex items-center justify-center shadow-sm font-bold text-[10px] outline outline-4 outline-white">
                      5
                    </div>
                    <span className="text-[10px] font-bold text-text-muted text-center leading-tight">Filed / Submitted</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Case 2 */}
            <div className="bg-white border border-border-main rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                  <Home size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-text-main mb-1">Landlord Dispute</h3>
                  <p className="text-[11px] text-text-muted mb-2">Case ID: NYA-2025-0503-002</p>
                  <div className="flex items-center gap-4 text-[11px] font-semibold">
                    <div className="flex items-center gap-1 text-text-muted">
                      <Calendar size={12} /> 03 May 2025
                    </div>
                    <div className="flex items-center gap-1 text-text-main">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Draft
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col gap-2 shrink-0">
                <div className="flex items-center justify-end w-full">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-200">
                    Low
                  </span>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-[10px] text-text-muted font-semibold">Last Updated</p>
                    <p className="text-[11px] font-bold text-text-main">05 May 2025, 04:20 PM</p>
                  </div>
                  <ChevronRight size={18} className="text-text-light" />
                </div>
              </div>
            </div>

            {/* Case 3 */}
            <div className="bg-white border border-border-main rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
                  <Briefcase size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-text-main mb-1">Workplace Harassment</h3>
                  <p className="text-[11px] text-text-muted mb-2">Case ID: NYA-2025-0428-003</p>
                  <div className="flex items-center gap-4 text-[11px] font-semibold">
                    <div className="flex items-center gap-1 text-text-muted">
                      <Calendar size={12} /> 28 Apr 2025
                    </div>
                    <div className="flex items-center gap-1 text-text-main">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      In Progress
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col gap-2 shrink-0">
                <div className="flex items-center justify-end w-full">
                  <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold border border-red-200">
                    High
                  </span>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-[10px] text-text-muted font-semibold">Last Updated</p>
                    <p className="text-[11px] font-bold text-text-main">01 May 2025, 09:15 AM</p>
                  </div>
                  <ChevronRight size={18} className="text-text-light" />
                </div>
              </div>
            </div>

            {/* Case 4 */}
            <div className="bg-white border border-border-main rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
                  <CreditCard size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-text-main mb-1">Consumer Complaint - Defective Product</h3>
                  <p className="text-[11px] text-text-muted mb-2">Case ID: NYA-2025-0405-004</p>
                  <div className="flex items-center gap-4 text-[11px] font-semibold">
                    <div className="flex items-center gap-1 text-text-muted">
                      <Calendar size={12} /> 05 Apr 2025
                    </div>
                    <div className="flex items-center gap-1 text-text-main">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Pending Action
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col gap-2 shrink-0">
                <div className="flex items-center justify-end w-full">
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold border border-orange-200">
                    Medium
                  </span>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-[10px] text-text-muted font-semibold">Last Updated</p>
                    <p className="text-[11px] font-bold text-text-main">30 Apr 2025, 10:45 AM</p>
                  </div>
                  <ChevronRight size={18} className="text-text-light" />
                </div>
              </div>
            </div>

            {/* Case 5 */}
            <div className="bg-white border border-border-main rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
                  <ShieldAlert size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-text-main mb-1">Cyber Harassment</h3>
                  <p className="text-[11px] text-text-muted mb-2">Case ID: NYA-2025-0315-005</p>
                  <div className="flex items-center gap-4 text-[11px] font-semibold">
                    <div className="flex items-center gap-1 text-text-muted">
                      <Calendar size={12} /> 15 Mar 2025
                    </div>
                    <div className="flex items-center gap-1 text-text-main">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                      Resolved
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col gap-2 shrink-0">
                <div className="flex items-center justify-end w-full">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-200">
                    Low
                  </span>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-[10px] text-text-muted font-semibold">Last Updated</p>
                    <p className="text-[11px] font-bold text-text-main">20 Apr 2025, 03:10 PM</p>
                  </div>
                  <ChevronRight size={18} className="text-text-light" />
                </div>
              </div>
            </div>

          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button className="w-8 h-8 flex items-center justify-center border border-border-main rounded-lg text-text-muted hover:bg-bg-subtle transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg text-sm font-bold shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-transparent rounded-lg text-text-main hover:bg-bg-subtle transition-colors text-sm font-semibold">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-transparent rounded-lg text-text-main hover:bg-bg-subtle transition-colors text-sm font-semibold">
              3
            </button>
            <span className="text-text-muted px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center border border-transparent rounded-lg text-text-main hover:bg-bg-subtle transition-colors text-sm font-semibold">
              5
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-border-main rounded-lg text-text-main hover:bg-bg-subtle transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

        {/* Sidebar Content (Right) */}
        <div className="space-y-6">
          
          {/* Case Overview */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={20} className="text-text-main" />
              <h3 className="font-bold text-sm text-text-main">Case Overview</h3>
            </div>
            
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {/* Draft: 1 (20%) Blue */}
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="0" />
                {/* Pending Action: 1 (20%) Purple */}
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-20" />
                {/* Resolved: 1 (20%) Green */}
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-40" />
                {/* Closed: 0 (0%) */}
                {/* In Progress: 2 (40%) Yellow */}
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="40 100" strokeDashoffset="-60" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black leading-none">5</span>
                <span className="text-[10px] text-text-muted font-bold mt-1">Total Cases</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-text-main">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span> In Progress
                </div>
                <span>2</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-text-main">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Draft
                </div>
                <span>1</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-text-main">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Pending Action
                </div>
                <span>1</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-text-main">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Resolved
                </div>
                <span>1</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-text-main">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span> Closed
                </div>
                <span>0</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-text-main hover:text-black transition-colors pt-4 border-t border-border-main">
              View Detailed Report <ArrowRight size={14} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PlusSquare size={20} className="text-text-main" />
              <h3 className="font-bold text-sm text-text-main">Quick Actions</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md bg-bg-subtle border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Plus size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">File a New Case</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Start a new legal case</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md bg-bg-subtle border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Upload size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">Upload Documents</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Add documents to a case</p>
                </div>
              </div>

              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md bg-bg-subtle border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">Ask AI Assistant</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Get instant legal guidance</p>
                </div>
              </div>

              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md bg-bg-subtle border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">Know Your Rights</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Learn about your legal rights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help Card */}
          <div className="bg-bg-subtle border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Headphones size={20} className="text-text-main" />
              <h3 className="font-bold text-sm text-text-main">Need Help?</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Our support team is here to assist you with your legal journey.
            </p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-border-main rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
              Contact Support <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
