"use client";

import React from "react";
import { 
  CloudUpload, 
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Star,
  MoreVertical,
  Upload,
  Sparkles,
  Scan,
  FolderPlus,
  Lightbulb,
  Check,
  Scale,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function DocumentsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight mb-2">Documents</h1>
          <p className="text-sm text-text-muted">Upload, organize and manage all your legal documents in one place.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm shrink-0">
          <CloudUpload size={18} />
          Upload Document
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="space-y-6">
          
          {/* Filters (Tabs) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button className="px-4 py-2 rounded-full text-sm font-bold bg-black text-white shrink-0">All Documents</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">My Uploads</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">Case Documents</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">AI Generated</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">Favorites</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">Trash</button>
          </div>

          {/* Main Table Card */}
          <div className="bg-white border border-border-main rounded-2xl shadow-sm overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-border-main flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="relative w-full md:max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input 
                  type="text" 
                  placeholder="Search documents..."
                  className="w-full pl-9 pr-4 py-2 bg-bg-subtle border border-border-main rounded-xl text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex items-center gap-2 px-3 py-2 border border-border-main rounded-xl text-sm font-semibold hover:bg-bg-subtle transition-colors shrink-0">
                  All Types <ChevronDown size={16} />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-border-main rounded-xl text-sm font-semibold hover:bg-bg-subtle transition-colors shrink-0">
                  Sort by: Newest <ChevronDown size={16} />
                </button>
                
                <div className="flex items-center border border-border-main rounded-xl overflow-hidden shrink-0 ml-auto md:ml-0">
                  <button className="p-2 bg-black text-white hover:bg-gray-800 transition-colors">
                    <LayoutGrid size={16} />
                  </button>
                  <button className="p-2 bg-white text-text-muted hover:bg-bg-subtle transition-colors">
                    <List size={16} />
                  </button>
                </div>
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-bg-subtle border-b border-border-main text-text-muted font-semibold text-[11px] uppercase tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-6 py-4 font-bold">Document Name</th>
                    <th className="px-6 py-4 font-bold">Type</th>
                    <th className="px-6 py-4 font-bold">Related Case</th>
                    <th className="px-6 py-4 font-bold">Uploaded On</th>
                    <th className="px-6 py-4 font-bold">Size</th>
                    <th className="px-6 py-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  
                  {/* Row 1 */}
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                          <FileText size={20} className="text-red-500" />
                        </div>
                        <div>
                          <p className="font-bold text-text-main">Payment Receipt - Screenshot</p>
                          <p className="text-[11px] text-text-muted mt-0.5">Uploaded by You</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold">Evidence</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">Online Transaction Fraud</p>
                      <p className="text-[10px] text-text-muted">NYA-2025-0512-001</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">12 May 2025</p>
                      <p className="text-[10px] text-text-muted">11:30 AM</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-text-muted">1.2 MB</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-text-muted">
                        <button className="hover:text-yellow-400 transition-colors"><Star size={16} /></button>
                        <button className="hover:text-black transition-colors"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
                          <ImageIcon size={20} className="text-green-500" />
                        </div>
                        <div>
                          <p className="font-bold text-text-main">Chat with Seller</p>
                          <p className="text-[11px] text-text-muted mt-0.5">Uploaded by You</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold">Evidence</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">Online Transaction Fraud</p>
                      <p className="text-[10px] text-text-muted">NYA-2025-0512-001</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">12 May 2025</p>
                      <p className="text-[10px] text-text-muted">11:28 AM</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-text-muted">845 KB</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-text-muted">
                        <button className="hover:text-yellow-400 transition-colors"><Star size={16} /></button>
                        <button className="hover:text-black transition-colors"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                          <FileText size={20} className="text-red-500" />
                        </div>
                        <div>
                          <p className="font-bold text-text-main">Order Invoice</p>
                          <p className="text-[11px] text-text-muted mt-0.5">Uploaded by You</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold">Evidence</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">Online Transaction Fraud</p>
                      <p className="text-[10px] text-text-muted">NYA-2025-0512-001</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">12 May 2025</p>
                      <p className="text-[10px] text-text-muted">11:25 AM</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-text-muted">1.8 MB</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-text-muted">
                        <button className="hover:text-yellow-400 transition-colors"><Star size={16} /></button>
                        <button className="hover:text-black transition-colors"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                          <FileText size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-text-main">Complaint Draft</p>
                          <p className="text-[11px] text-text-muted mt-0.5">Generated by NyayaAI</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold">AI Generated</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">Online Transaction Fraud</p>
                      <p className="text-[10px] text-text-muted">NYA-2025-0512-001</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">12 May 2025</p>
                      <p className="text-[10px] text-text-muted">01:15 PM</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-text-muted">64 KB</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-text-muted">
                        <button className="text-yellow-400 transition-colors"><Star size={16} fill="currentColor" /></button>
                        <button className="hover:text-black transition-colors"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                          <FileText size={20} className="text-red-500" />
                        </div>
                        <div>
                          <p className="font-bold text-text-main">ID Proof</p>
                          <p className="text-[11px] text-text-muted mt-0.5">Uploaded by You</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold">Evidence</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">Online Transaction Fraud</p>
                      <p className="text-[10px] text-text-muted">NYA-2025-0512-001</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">12 May 2025</p>
                      <p className="text-[10px] text-text-muted">11:10 AM</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-text-muted">1.1 MB</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-text-muted">
                        <button className="hover:text-yellow-400 transition-colors"><Star size={16} /></button>
                        <button className="hover:text-black transition-colors"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                          <FileText size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-text-main">Refund Request Letter</p>
                          <p className="text-[11px] text-text-muted mt-0.5">Generated by NyayaAI</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold">AI Generated</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">Online Transaction Fraud</p>
                      <p className="text-[10px] text-text-muted">NYA-2025-0512-001</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main text-xs">12 May 2025</p>
                      <p className="text-[10px] text-text-muted">01:20 PM</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-text-muted">78 KB</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-text-muted">
                        <button className="hover:text-yellow-400 transition-colors"><Star size={16} /></button>
                        <button className="hover:text-black transition-colors"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            <div className="p-4 border-t border-border-main flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-semibold text-text-muted">Showing 1 to 6 of 24 documents</p>
              
              <div className="flex items-center gap-1.5">
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
                  4
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-border-main rounded-lg text-text-main hover:bg-bg-subtle transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Sidebar Content (Right) */}
        <div className="space-y-6">
          
          {/* Storage Usage Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-bold text-sm text-text-main self-start mb-6">Storage Usage</h3>
            
            {/* Circular Progress (24%) */}
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full mb-6">
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
                {/* Progress Circle (24%) */}
                <path
                  className="text-black"
                  strokeDasharray="24, 100"
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
                <span className="text-xl font-black">2.4 GB</span>
                <span className="text-[10px] text-text-muted mt-1 font-semibold">of 10 GB used</span>
              </div>
            </div>

            <div className="w-full space-y-2 mb-6">
              <div className="flex justify-between text-[10px] font-bold text-text-main">
                <span></span>
                <span>24% Used</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full" style={{ width: "24%" }}></div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center py-2.5 bg-white border border-border-main rounded-xl text-xs font-bold hover:bg-bg-subtle transition-colors shadow-sm">
              Manage Storage
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-text-main mb-4">Quick Actions</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Upload size={12} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">Upload Document</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Add files from your device</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Sparkles size={12} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">AI Generate Document</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Generate legal documents</p>
                </div>
              </div>

              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Scan size={12} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">Scan Document</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Scan using your camera</p>
                </div>
              </div>

              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <FolderPlus size={12} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">Create Folder</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Organize your documents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={20} className="text-text-main" />
                <h3 className="font-bold text-sm text-text-main">Tips</h3>
              </div>
              <ul className="space-y-3 text-[11px] text-text-main font-semibold">
                <li className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  <span className="leading-relaxed">Upload clear and readable documents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  <span className="leading-relaxed">PDF format works best for analysis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  <span className="leading-relaxed">Keep your documents organized by using folders.</span>
                </li>
              </ul>
            </div>
            
            {/* Background Icon */}
            <div className="absolute -bottom-6 -right-6 text-gray-200/60 z-0">
              <Scale size={120} strokeWidth={1} />
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
