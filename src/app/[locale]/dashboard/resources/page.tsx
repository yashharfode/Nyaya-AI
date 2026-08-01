"use client";

import React, { useState } from "react";
import { Search, FileText, Download, ExternalLink, Sparkles, Folder, FileCheck2, Scale, ChevronRight, Check, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);

  const allResources = [
    {
      id: 1,
      title: "Standard Legal Notice Template",
      description: "A formal written communication sent to a person or entity informing them of your intention to undertake legal proceedings.",
      category: "Legal Templates",
      icon: <FileText size={20} className="text-blue-600" />
    },
    {
      id: 2,
      title: "Rental Agreement Draft",
      description: "Standardized residential rental agreement draft outlining terms between landlord and tenant.",
      category: "Legal Templates",
      icon: <FileText size={20} className="text-blue-600" />
    },
    {
      id: 3,
      title: "Consumer Rights Glossary",
      description: "A comprehensive glossary of terms related to consumer protection laws in India.",
      category: "Glossaries",
      icon: <FileCheck2 size={20} className="text-purple-600" />
    },
    {
      id: 4,
      title: "How to File an RTI (Guide)",
      description: "Step-by-step guide on how to file a Right to Information (RTI) application online.",
      category: "How-to Guides",
      icon: <Folder size={20} className="text-amber-600" />
    },
    {
      id: 5,
      title: "Non-Disclosure Agreement (NDA)",
      description: "Standard mutual non-disclosure agreement to protect confidential information.",
      category: "Legal Templates",
      icon: <FileText size={20} className="text-blue-600" />
    },
    {
      id: 6,
      title: "Divorce Mutual Consent Form",
      description: "Standard petition format for filing divorce by mutual consent under the Hindu Marriage Act.",
      category: "Forms & Applications",
      icon: <FileText size={20} className="text-pink-600" />
    }
  ];

  const categories = [
    { name: "All", count: allResources.length },
    { name: "Legal Templates", count: allResources.filter(r => r.category === "Legal Templates").length },
    { name: "How-to Guides", count: allResources.filter(r => r.category === "How-to Guides").length },
    { name: "Glossaries", count: allResources.filter(r => r.category === "Glossaries").length },
    { name: "Forms & Applications", count: allResources.filter(r => r.category === "Forms & Applications").length },
  ];

  const filteredResources = allResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (id: number) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedIds(prev => [...prev, id]);
    }, 1500);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 space-y-6 lg:space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Legal Resources & Templates</h1>
          <p className="text-text-muted text-sm">Access standardized legal drafts, guides, and glossaries.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          
          {filteredResources.length === 0 ? (
            <div className="bg-white border border-border-main rounded-2xl p-12 text-center shadow-sm">
              <Folder size={48} className="mx-auto text-text-light mb-4" />
              <h3 className="text-lg font-bold text-text-main mb-2">No resources found</h3>
              <p className="text-text-muted">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            filteredResources.map((res) => (
              <div key={res.id} className="bg-white border border-border-main rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-bg-subtle rounded-xl flex items-center justify-center shrink-0 border border-border-main">
                    {res.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-text-main">{res.title}</h3>
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-bg-main px-2 py-0.5 rounded-full border border-border-main text-text-muted">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {res.description}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => handleDownload(res.id)}
                    disabled={downloadedIds.includes(res.id) || downloadingId === res.id}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                      downloadedIds.includes(res.id)
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-text-main text-white hover:bg-black"
                    }`}
                  >
                    {downloadingId === res.id ? (
                      <><Loader2 size={16} className="animate-spin" /> Downloading...</>
                    ) : downloadedIds.includes(res.id) ? (
                      <><Check size={16} /> Saved</>
                    ) : (
                      <><Download size={16} /> Download</>
                    )}
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-text-main border border-border-main text-sm font-semibold rounded-xl hover:bg-bg-subtle transition-colors">
                    <ExternalLink size={16} />
                    Preview
                  </button>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* AI Generator CTA */}
          <div className="bg-gradient-to-br from-indigo-900 to-black text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Scale size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-2">
                <Sparkles size={16} />
                NyayaAI Assistant
              </div>
              <h3 className="text-xl font-bold mb-2">Need a Custom Draft?</h3>
              <p className="text-indigo-100 text-sm mb-6">
                Describe your unique situation, and our AI will generate a tailored legal notice or complaint for you in seconds.
              </p>
              <Link href="/dashboard/ai-assistant" className="bg-white border border-border-main text-sm font-semibold px-4 py-2 rounded-xl flex items-center justify-between gap-2 hover:bg-bg-subtle transition-colors shadow-sm text-text-main">
                Ask AI Assistant
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                    activeCategory === cat.name 
                      ? "bg-black text-white shadow-md" 
                      : "hover:bg-bg-subtle text-text-main"
                  }`}
                >
                  <span className={`font-medium text-sm transition-colors ${activeCategory !== cat.name && "group-hover:text-brand-primary"}`}>
                    {cat.name}
                  </span>
                  <span className={`border text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
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

    </main>
  );
}
