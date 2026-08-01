"use client";

import React, { useState } from "react";
import { Search, Landmark, ShieldAlert, Users, Home, ExternalLink } from "lucide-react";

export default function GovernmentNavigatorPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const portals = [
    {
      title: "National Consumer Helpline",
      description: "File complaints regarding defective products, poor services, and consumer rights violations.",
      category: "Consumer",
      icon: <Users size={24} className="text-blue-600" />,
      link: "https://consumerhelpline.gov.in/",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      title: "National Cyber Crime Reporting",
      description: "Report cyber frauds, online harassment, financial scams, and other cyber crimes.",
      category: "Cyber",
      icon: <ShieldAlert size={24} className="text-red-600" />,
      link: "https://cybercrime.gov.in/",
      bg: "bg-red-50",
      border: "border-red-100"
    },
    {
      title: "RERA (Real Estate Regulatory Authority)",
      description: "File complaints against builders, delays in possession, and real estate disputes.",
      category: "Property",
      icon: <Home size={24} className="text-amber-600" />,
      link: "https://rera.karnataka.gov.in/",
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    {
      title: "e-Filing (Income Tax Department)",
      description: "File income tax returns, respond to notices, and resolve tax-related grievances.",
      category: "Finance",
      icon: <Landmark size={24} className="text-green-600" />,
      link: "https://www.incometax.gov.in/",
      bg: "bg-green-50",
      border: "border-green-100"
    },
    {
      title: "EPFO Grievance Management",
      description: "Register and track grievances related to PF withdrawal, pension, and UAN.",
      category: "Finance",
      icon: <Users size={24} className="text-indigo-600" />,
      link: "https://epfigms.gov.in/",
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
    {
      title: "CPGRAMS (Public Grievances)",
      description: "Centralized Public Grievance Redress and Monitoring System for complaints against central/state ministries.",
      category: "General",
      icon: <Landmark size={24} className="text-gray-600" />,
      link: "https://pgportal.gov.in/",
      bg: "bg-gray-50",
      border: "border-gray-200"
    }
  ];

  const categories = ["All", "Consumer", "Cyber", "Property", "Finance", "General"];

  const filteredPortals = portals.filter(portal => {
    const matchesSearch = portal.title.toLowerCase().includes(search.toLowerCase()) || 
                          portal.description.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || portal.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 space-y-6 lg:space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Government Navigator</h1>
          <p className="text-text-muted text-sm">Find and access official government portals to file your complaints securely.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search portals..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === cat 
                ? "bg-text-main text-white shadow-sm" 
                : "bg-white border border-border-main text-text-main hover:bg-bg-subtle shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortals.map((portal, idx) => (
          <div key={idx} className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${portal.bg} ${portal.border}`}>
              {portal.icon}
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-1">{portal.title}</h3>
            <p className="text-sm text-text-muted mb-6 flex-1 line-clamp-3">
              {portal.description}
            </p>
            <a 
              href={portal.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-bg-subtle text-text-main font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors border border-border-main"
            >
              Visit Official Portal
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>
      
      {filteredPortals.length === 0 && (
        <div className="text-center py-12 bg-white border border-border-main rounded-2xl">
          <p className="text-text-muted font-medium">No portals found matching your search.</p>
        </div>
      )}

    </main>
  );
}
