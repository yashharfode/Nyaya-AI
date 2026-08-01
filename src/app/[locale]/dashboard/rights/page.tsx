"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, BookOpen, Scale, AlertCircle } from "lucide-react";

export default function RightsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const rights = [
    {
      id: 1,
      title: "Right to Information (RTI)",
      category: "Fundamental",
      summary: "Empowers citizens to seek information from public authorities, promoting transparency.",
      details: "Under the RTI Act 2005, any citizen can request information from a 'public authority' (a body of Government or 'instrumentality of State') which is required to reply expeditiously or within thirty days. It is a fundamental right derived from Article 19(1)(a) of the Constitution.",
      law: "RTI Act, 2005",
      icon: <BookOpen size={20} className="text-blue-600" />
    },
    {
      id: 2,
      title: "Right Against Exploitation",
      category: "Fundamental",
      summary: "Prohibits human trafficking, forced labor, and employment of children in hazardous jobs.",
      details: "Articles 23 and 24 of the Indian Constitution guarantee this right. It aims to protect the dignity of individuals by abolishing practices like begar (forced labor without payment) and ensuring children under 14 are not employed in mines or factories.",
      law: "Articles 23 & 24, Indian Constitution",
      icon: <ShieldCheck size={20} className="text-red-600" />
    },
    {
      id: 3,
      title: "Right to be Protected as a Consumer",
      category: "Consumer",
      summary: "Right to be protected against the marketing of goods and services which are hazardous to life and property.",
      details: "The Consumer Protection Act ensures you have the right to be informed about the quality, quantity, potency, purity, standard, and price of goods. If a product causes harm or is defective, you have the right to seek redressal against unfair trade practices.",
      law: "Consumer Protection Act, 2019",
      icon: <AlertCircle size={20} className="text-amber-600" />
    },
    {
      id: 4,
      title: "Right to Equality",
      category: "Fundamental",
      summary: "Guarantees equal rights for everyone, irrespective of religion, gender, caste, race or place of birth.",
      details: "Enshrined in Articles 14 to 18 of the Constitution, it ensures equality before the law, prohibits discrimination, and guarantees equality of opportunity in matters of public employment. It also abolishes untouchability and titles.",
      law: "Articles 14-18, Indian Constitution",
      icon: <Scale size={20} className="text-indigo-600" />
    },
    {
      id: 5,
      title: "Tenant's Right Against Arbitrary Eviction",
      category: "Property",
      summary: "A landlord cannot arbitrarily evict a tenant without a valid reason and proper notice.",
      details: "Under various state Rent Control Acts, a landlord must provide a valid reason (like non-payment of rent, subletting without permission, or requirement for personal use) and follow the legal eviction process. Forced evictions using threats are illegal.",
      law: "State Rent Control Acts",
      icon: <ShieldCheck size={20} className="text-teal-600" />
    }
  ];

  const categories = ["All", "Fundamental", "Consumer", "Property", "Workplace"];

  const filteredRights = rights.filter(
    (r) => activeCategory === "All" || r.category === activeCategory
  );

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 space-y-6 lg:space-y-8 font-sans">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 bg-bg-subtle border border-border-main rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} className="text-text-main" />
        </div>
        <h1 className="text-3xl font-bold">Know Your Rights</h1>
        <p className="text-text-muted text-sm max-w-xl mx-auto">
          Legal empowerment starts with knowledge. Understand your fundamental and consumer rights simplified without the heavy legal jargon.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-border-main">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === cat 
                ? "bg-text-main text-white shadow-sm" 
                : "bg-white border border-border-main text-text-main hover:bg-bg-subtle shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredRights.map((right) => (
          <div 
            key={right.id} 
            className={`bg-white border border-border-main rounded-2xl overflow-hidden transition-all duration-300 ${
              expandedId === right.id ? "shadow-md" : "shadow-sm hover:shadow-md"
            }`}
          >
            {/* Header (Clickable) */}
            <button 
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              onClick={() => setExpandedId(expandedId === right.id ? null : right.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-bg-subtle rounded-xl flex items-center justify-center shrink-0 border border-border-main">
                  {right.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main">{right.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold bg-bg-main px-2 py-0.5 rounded-full border border-border-main text-text-muted">
                      {right.category}
                    </span>
                    <span className="text-xs text-text-muted hidden sm:inline">
                      • {right.law}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-text-light p-2 shrink-0">
                {expandedId === right.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {/* Expanded Content */}
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                expandedId === right.id ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pt-4 border-t border-border-main space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Summary</h4>
                  <p className="text-sm font-medium text-text-main">{right.summary}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">In Detail</h4>
                  <p className="text-sm text-text-muted leading-relaxed">{right.details}</p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-accent/10 text-brand-accent px-3 py-1.5 rounded-lg border border-brand-accent/20">
                    <Scale size={14} />
                    Source: {right.law}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRights.length === 0 && (
          <div className="text-center py-12 bg-white border border-border-main rounded-2xl">
            <p className="text-text-muted font-medium">No resources found for this category yet.</p>
          </div>
        )}
      </div>

    </main>
  );
}
