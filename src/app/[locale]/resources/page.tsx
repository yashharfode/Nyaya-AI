import React from "react";
import { Link } from "@/i18n/routing";
import { FileText, Download, Lock } from "lucide-react";

export default function PublicResourcesPage() {
  const templates = [
    {
      title: "Standard Legal Notice",
      description: "A formal written communication sent to a person or entity informing them of your intention to undertake legal proceedings.",
    },
    {
      title: "Consumer Forum Complaint",
      description: "Standardized format to file a complaint against defective goods or deficient services in consumer courts.",
    },
    {
      title: "RTI Application Draft",
      description: "Standard application format to seek information from any government department under the RTI Act, 2005.",
    },
    {
      title: "Residential Rental Agreement",
      description: "Standard 11-month lease agreement outline protecting both landlord and tenant interests.",
    },
    {
      title: "Non-Disclosure Agreement (NDA)",
      description: "Mutual confidentiality agreement template to protect business secrets and ideas.",
    },
    {
      title: "Cheque Bounce Notice",
      description: "Draft notice under Section 138 of the Negotiable Instruments Act for dishonored cheques.",
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-24 selection:bg-brand-accent selection:text-white">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="w-20 h-20 bg-bg-subtle border border-border-main rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
          <FileText size={40} className="text-text-main" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-main leading-tight">
          Free Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Templates</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed">
          Access our library of professionally drafted, standard legal templates and how-to guides.
        </p>
      </section>

      {/* Templates Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, idx) => (
          <div key={idx} className="bg-white border border-border-main p-6 rounded-3xl flex flex-col hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* Lock Overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Lock size={24} className="text-text-main mb-2" />
              <span className="font-bold text-sm text-text-main">Account Required</span>
            </div>

            <div className="flex items-center gap-3 mb-4 relative z-0">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                <FileText size={20} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-text-main leading-tight">{template.title}</h3>
            </div>
            <p className="text-sm text-text-muted flex-1 relative z-0">
              {template.description}
            </p>
            <div className="mt-6 flex items-center justify-between relative z-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Template</span>
              <Download size={16} className="text-text-light" />
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-brand-primary text-white rounded-3xl p-12 text-center max-w-4xl mx-auto space-y-6 shadow-xl shadow-brand-primary/20">
        <h2 className="text-3xl font-bold mb-4">Unlock All Resources</h2>
        <p className="text-brand-primary-light mb-8 max-w-xl mx-auto">
          Sign up today to instantly download these templates, read detailed legal guides, and use our AI to generate custom drafts tailored to your specific situation.
        </p>
        <Link href="/signup" className="inline-block px-8 py-3.5 bg-white text-brand-primary font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
          Get Free Access Now
        </Link>
      </section>

    </main>
  );
}
