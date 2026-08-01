"use client";

import React, { useState } from "react";
import { 
  ChevronRight,
  Sparkles,
  Headphones,
  FileText,
  ShieldCheck,
  Crown,
  Check,
  X,
  ArrowRight,
  Scale,
  Lock,
  Star,
  Quote
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";

export default function UpgradePage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted font-semibold">
        <span className="hover:text-text-main cursor-pointer" onClick={() => router.push("/dashboard")}>Home</span>
        <ChevronRight size={14} />
        <span className="text-text-main">Upgrade to Pro</span>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 border border-border-main rounded-3xl p-8 lg:p-12 overflow-hidden shadow-sm">
        
        {/* Abstract Background Graphic (Replacing scales image) */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <Scale size={400} strokeWidth={1} />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight">
              Upgrade to NyayaAI Pro
            </h1>
            <Star className="text-brand-accent fill-brand-accent animate-pulse" size={32} />
          </div>
          <p className="text-lg text-text-muted mb-10 max-w-xl leading-relaxed">
            Unlock advanced legal tools, priority support and smarter AI for faster legal results.
          </p>

          {/* Feature Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm border border-border-main rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
              <Sparkles size={20} className="text-brand-accent" />
              <h3 className="font-bold text-sm text-text-main">Smarter AI</h3>
              <p className="text-[10px] text-text-muted leading-snug">More accurate legal analysis</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-border-main rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
              <Headphones size={20} className="text-blue-600" />
              <h3 className="font-bold text-sm text-text-main">Priority Support</h3>
              <p className="text-[10px] text-text-muted leading-snug">Faster responses & assistance</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-border-main rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
              <FileText size={20} className="text-green-600" />
              <h3 className="font-bold text-sm text-text-main">Advanced Drafting</h3>
              <p className="text-[10px] text-text-muted leading-snug">Generate professional legal documents</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-border-main rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
              <ShieldCheck size={20} className="text-purple-600" />
              <h3 className="font-bold text-sm text-text-main">Secure & Private</h3>
              <p className="text-[10px] text-text-muted leading-snug">100% data privacy and encryption</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="space-y-12">
          
          {/* Billing Toggle & Pricing Cards */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex bg-bg-subtle p-1 rounded-full border border-border-main">
                <button 
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-black text-white shadow-sm" : "text-text-muted hover:text-text-main"}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === "yearly" ? "bg-black text-white shadow-sm" : "text-text-muted hover:text-text-main"}`}
                >
                  Yearly
                </button>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[11px] font-bold border border-green-200">
                Save 20%
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Basic Plan */}
              <div className="bg-white border border-border-main rounded-3xl p-8 flex flex-col relative overflow-hidden">
                <Crown size={80} className="absolute -top-4 -right-4 text-gray-50 opacity-50" />
                <h3 className="text-2xl font-bold text-text-main mb-1 relative z-10">Basic</h3>
                <p className="text-xs text-text-muted mb-6 relative z-10">For Individuals</p>
                <div className="mb-2 relative z-10">
                  <span className="text-4xl font-extrabold text-text-main">₹0</span>
                  <span className="text-sm text-text-muted font-semibold"> /month</span>
                </div>
                <p className="text-xs font-semibold text-text-muted mb-8 pb-8 border-b border-border-main relative z-10">Free Forever</p>
                
                <ul className="space-y-4 mb-8 flex-1 relative z-10">
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> 5 AI Assistant Queries / day</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> Basic Case Analysis</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> Access to Govt. Navigator</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> Document Upload (Up to 10 MB)</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> Standard Support</li>
                </ul>
                
                <button className="w-full py-3.5 bg-white border-2 border-border-main text-text-main rounded-xl font-bold hover:bg-bg-subtle transition-colors relative z-10">
                  Current Plan
                </button>
              </div>

              {/* Pro Plan (Most Popular) */}
              <div className="bg-[#FAF9F6] border-2 border-black rounded-3xl p-8 flex flex-col relative shadow-xl transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
                  Most Popular
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-text-main">Pro</h3>
                  <span className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded">PRO</span>
                </div>
                <p className="text-xs text-text-muted mb-6">For Power Users</p>
                
                <div className="mb-2">
                  <span className="text-4xl font-extrabold text-text-main">{billingCycle === "monthly" ? "₹199" : "₹159"}</span>
                  <span className="text-sm text-text-muted font-semibold"> /month</span>
                </div>
                <p className="text-xs font-semibold text-text-muted mb-8 pb-8 border-b border-gray-200">
                  {billingCycle === "monthly" ? "Billed monthly" : "Billed ₹1,908 annually"}
                </p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-text-main font-bold"><Check size={18} className="shrink-0" /> Unlimited AI Queries</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-bold"><Check size={18} className="shrink-0" /> Advanced Case Analysis</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-bold"><Check size={18} className="shrink-0" /> Evidence Checklist (Unlimited)</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-bold"><Check size={18} className="shrink-0" /> Document Upload (Up to 100 MB)</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-bold"><Check size={18} className="shrink-0" /> AI Legal Document Drafting</li>
                  <li className="flex items-start gap-3 text-sm text-black font-extrabold"><Check size={18} className="shrink-0" /> Priority Support</li>
                </ul>
                
                <button className="w-full py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20">
                  Upgrade to Pro <ArrowRight size={18} />
                </button>
              </div>

              {/* Pro+ Plan */}
              <div className="bg-white border border-border-main rounded-3xl p-8 flex flex-col">
                <h3 className="text-2xl font-bold text-text-main mb-1">Pro+</h3>
                <p className="text-xs text-text-muted mb-6">For Professionals</p>
                <div className="mb-2">
                  <span className="text-4xl font-extrabold text-text-main">{billingCycle === "monthly" ? "₹499" : "₹399"}</span>
                  <span className="text-sm text-text-muted font-semibold"> /month</span>
                </div>
                <p className="text-xs font-semibold text-text-muted mb-8 pb-8 border-b border-border-main">
                  {billingCycle === "monthly" ? "Billed monthly" : "Billed ₹4,788 annually"}
                </p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> Everything in Pro</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> AI-Powered Legal Research</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> Case Tracking & Alerts</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> Export Reports (PDF/Doc)</li>
                  <li className="flex items-start gap-3 text-sm text-text-main font-medium"><Check size={18} className="shrink-0 text-text-main" /> Dedicated Support</li>
                </ul>
                
                <button className="w-full py-3.5 bg-white border-2 border-border-main text-text-main rounded-xl font-bold hover:bg-bg-subtle transition-colors">
                  Upgrade to Pro+
                </button>
              </div>
            </div>
          </div>

          {/* Compare Table */}
          <div>
            <h3 className="text-xl font-bold text-text-main mb-6">Compare All Features</h3>
            <div className="bg-white border border-border-main rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-bg-subtle border-b border-border-main text-text-main font-bold">
                  <tr>
                    <th className="px-6 py-4">Features</th>
                    <th className="px-6 py-4 text-center">Basic</th>
                    <th className="px-6 py-4 text-center">Pro</th>
                    <th className="px-6 py-4 text-center">Pro+</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main text-text-main font-medium">
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">AI Queries</td>
                    <td className="px-6 py-4 text-center text-text-muted">5 / day</td>
                    <td className="px-6 py-4 text-center font-bold">Unlimited</td>
                    <td className="px-6 py-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">Document Upload Limit</td>
                    <td className="px-6 py-4 text-center text-text-muted">10 MB</td>
                    <td className="px-6 py-4 text-center font-bold">100 MB</td>
                    <td className="px-6 py-4 text-center">500 MB</td>
                  </tr>
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">AI Document Drafting</td>
                    <td className="px-6 py-4 text-center text-text-muted flex justify-center"><X size={18} /></td>
                    <td className="px-6 py-4 text-center text-black flex justify-center"><Check size={18} strokeWidth={3} /></td>
                    <td className="px-6 py-4 text-center flex justify-center"><Check size={18} strokeWidth={3} /></td>
                  </tr>
                  <tr className="hover:bg-bg-subtle/30 transition-colors">
                    <td className="px-6 py-4">Support</td>
                    <td className="px-6 py-4 text-center text-text-muted">Standard</td>
                    <td className="px-6 py-4 text-center font-bold">Priority</td>
                    <td className="px-6 py-4 text-center">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Sidebar Content (Right) */}
        <div className="space-y-6">
          
          {/* Why Upgrade */}
          <div className="bg-white border border-border-main rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border-main pb-4 mb-6">
              <Crown size={20} className="text-text-main" />
              <h3 className="font-bold text-lg text-text-main">Why Upgrade?</h3>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-bg-subtle flex items-center justify-center shrink-0 text-text-main border border-border-main">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm text-text-main font-semibold leading-snug">Save time with AI-powered legal assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-bg-subtle flex items-center justify-center shrink-0 text-text-main border border-border-main">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm text-text-main font-semibold leading-snug">Access expert-recommended actions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-bg-subtle flex items-center justify-center shrink-0 text-text-main border border-border-main">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm text-text-main font-semibold leading-snug">Draft legal documents in minutes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-bg-subtle flex items-center justify-center shrink-0 text-text-main border border-border-main">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm text-text-main font-semibold leading-snug">Stay updated with real-time legal alerts</span>
              </li>
            </ul>

            {/* Lady Justice Banner */}
            <div className="bg-gray-100 rounded-2xl p-5 relative overflow-hidden flex items-center min-h-[140px]">
              <div className="relative z-10 w-2/3">
                <h4 className="font-bold text-[13px] text-text-main mb-2 leading-snug">Justice is better when you are prepared.</h4>
                <p className="text-[10px] font-semibold text-text-muted">— NyayaAI</p>
              </div>
              <div className="absolute right-0 bottom-0 text-gray-300 opacity-50 transform translate-x-4">
                <Scale size={120} strokeWidth={1} />
              </div>
            </div>
          </div>

          {/* Trusted & Secure */}
          <div className="bg-white border border-border-main rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-text-main" />
              <h3 className="font-bold text-sm text-text-main">Trusted & Secure</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              Your data is safe with enterprise-grade encryption and 100% confidentiality.
            </p>
            
            <div className="flex items-center justify-between gap-2 border-t border-border-main pt-4">
              <div className="flex flex-col items-center gap-1 text-center">
                <Lock size={16} className="text-text-main" />
                <span className="text-[9px] font-bold uppercase">ISO<br/>27001</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <ShieldCheck size={16} className="text-text-main" />
                <span className="text-[9px] font-bold uppercase">SOC 2<br/>Certified</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Scale size={16} className="text-text-main" />
                <span className="text-[9px] font-bold uppercase">GDPR<br/>Compliant</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-3xl p-6 shadow-sm relative">
            <Quote size={32} className="text-[#E5E0D8] absolute top-4 right-6" />
            <p className="text-sm font-semibold text-text-main leading-relaxed mb-6 relative z-10">
              "NyayaAI Pro helped me resolve my case faster with the right legal guidance."
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-text-main text-xs">AV</span>
                </div>
                <div>
                  <p className="font-bold text-xs text-text-main">Anjali Verma</p>
                  <p className="text-[10px] text-text-muted font-semibold">Verified User</p>
                </div>
              </div>
              <div className="flex gap-0.5 text-black">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
