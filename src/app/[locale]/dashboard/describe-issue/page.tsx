"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Upload, 
  Mic, 
  LayoutGrid, 
  Calendar, 
  ArrowRight, 
  Lock,
  ChevronRight,
  BrainCircuit,
  Search,
  ClipboardList,
  Rocket,
  Check,
  AlertTriangle,
  PhoneCall
} from "lucide-react";

export default function DescribeIssuePage() {
  const [text, setText] = useState("");

  return (
    <main className="max-w-6xl mx-auto px-6 lg:px-10 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4 font-semibold">
        <span>Home</span>
        <ChevronRight size={14} />
        <span className="text-text-main">Describe Issue</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        
        {/* Left Main Content */}
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-main mb-2 tracking-tight">Describe Your Issue</h1>
              <p className="text-text-muted">Tell us your legal problem in your own words. Our AI will analyze it and guide you.</p>
            </div>
            <div className="flex items-center gap-2 bg-bg-subtle border border-border-main px-4 py-2.5 rounded-xl shrink-0">
              <ShieldCheck size={20} className="text-text-main" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-tight text-text-muted">Your information is</span>
                <span className="text-xs font-bold leading-tight">100% secure & private</span>
              </div>
            </div>
          </div>

          {/* Text Area Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col relative focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
            <label className="text-sm font-bold text-text-main mb-4 flex items-center gap-1">
              Describe your legal issue <span className="text-red-500">*</span>
            </label>
            <textarea 
              className="w-full h-48 resize-none bg-transparent outline-none text-text-main placeholder:text-text-light text-sm"
              placeholder="Example: My landlord is not returning my security deposit and not responding to my messages."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={3000}
            />
            <div className="self-end text-xs font-semibold text-text-light mt-2">
              {text.length} / 3000
            </div>
          </div>

          {/* Add more details */}
          <div>
            <h3 className="text-sm font-bold text-text-main mb-3">Add more details <span className="text-text-muted font-semibold">(Optional)</span></h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button className="flex flex-col items-start p-4 bg-white border border-border-main rounded-2xl hover:border-text-light hover:shadow-md transition-all text-left">
                <Upload size={20} className="text-text-main mb-3" />
                <span className="text-sm font-bold text-text-main">Upload Document</span>
                <span className="text-[10px] text-text-muted mt-1 leading-snug">Attach screenshots, notice, agreements, etc.</span>
              </button>
              <button className="flex flex-col items-start p-4 bg-white border border-border-main rounded-2xl hover:border-text-light hover:shadow-md transition-all text-left">
                <Mic size={20} className="text-text-main mb-3" />
                <span className="text-sm font-bold text-text-main">Record Voice</span>
                <span className="text-[10px] text-text-muted mt-1 leading-snug">Explain your issue using voice</span>
              </button>
              <button className="flex flex-col items-start p-4 bg-white border border-border-main rounded-2xl hover:border-text-light hover:shadow-md transition-all text-left">
                <LayoutGrid size={20} className="text-text-main mb-3" />
                <span className="text-sm font-bold text-text-main">Select Category</span>
                <span className="text-[10px] text-text-muted mt-1 leading-snug">Choose the best matching category</span>
              </button>
              <button className="flex flex-col items-start p-4 bg-white border border-border-main rounded-2xl hover:border-text-light hover:shadow-md transition-all text-left">
                <Calendar size={20} className="text-text-main mb-3" />
                <span className="text-sm font-bold text-text-main">Add Date & Place</span>
                <span className="text-[10px] text-text-muted mt-1 leading-snug">Help us understand better</span>
              </button>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-bold text-text-main mb-3">Popular Categories</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Cyber Crime
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Consumer Dispute
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Property Dispute
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Employment Issue
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Harassment
              </button>
              <button className="p-2 bg-white border border-border-main rounded-full text-text-main hover:bg-bg-subtle transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col items-center mt-6 max-w-sm mx-auto w-full">
            <button className="w-full bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
              Analyze My Issue <ArrowRight size={18} />
            </button>
            <div className="flex items-center gap-1.5 mt-3 text-text-muted text-xs font-semibold">
              <Lock size={12} />
              <span>No personal data is stored or shared</span>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* How it works */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-6">How it works?</h3>
            <div className="relative pl-6 space-y-6">
              {/* Vertical line */}
              <div className="absolute left-10 top-6 bottom-6 w-px bg-border-main border-dashed border-l-2"></div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center border border-border-main shrink-0">
                  <BrainCircuit size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Describe Your Issue</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Share your problem in simple words.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center border border-border-main shrink-0">
                  <Search size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AI Analyzes</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Our AI understands your issue and finds relevant laws.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center border border-border-main shrink-0">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Get Guidance</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Receive step-by-step guidance, evidence checklist & more.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center border border-border-main shrink-0">
                  <Rocket size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Take Action</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Generate documents and get directed to the right authority.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-4">Tips for better results</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check size={16} className="text-text-main mt-0.5 shrink-0" />
                <span className="text-[12px] text-text-muted leading-relaxed font-medium">Provide clear and specific details.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-text-main mt-0.5 shrink-0" />
                <span className="text-[12px] text-text-muted leading-relaxed font-medium">Attach relevant documents or screenshots.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-text-main mt-0.5 shrink-0" />
                <span className="text-[12px] text-text-muted leading-relaxed font-medium">Mention dates, amounts and names if possible.</span>
              </li>
            </ul>
          </div>

          {/* Urgent Help */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-text-main" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Need urgent help?</h4>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Contact the relevant authorities immediately if it's an emergency.</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
              <PhoneCall size={16} />
              Emergency Contacts
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Legal Disclaimer */}
      <div className="mt-8 bg-bg-subtle rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden border border-border-main">
        <div className="relative z-10 flex items-start gap-4 flex-1">
          <div className="bg-white p-2 rounded-xl border border-border-main shadow-sm shrink-0">
            <ShieldCheck size={24} className="text-text-main" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-text-main">We are here to help you understand your rights, not replace legal professionals.</h4>
            <p className="text-xs text-text-muted mt-1">For complex legal matters, we recommend consulting a qualified lawyer.</p>
          </div>
        </div>
        {/* Placeholder graphic for gavel/books */}
        <div className="hidden md:block w-32 h-20 bg-gray-200/50 rounded-lg shrink-0 relative z-10 flex items-center justify-center border border-border-main text-text-light text-xs font-bold uppercase">
          Graphic
        </div>
      </div>

    </main>
  );
}
