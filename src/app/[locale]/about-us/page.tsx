import React from "react";
import { Link } from "@/i18n/routing";
import { Scale, Users, Heart, Target } from "lucide-react";

export default function AboutUsPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-24 selection:bg-brand-accent selection:text-white">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-main leading-tight">
          Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Justice</span> in India
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
          NyayaAI was founded on a simple belief: the law should protect everyone, not just those who can afford expensive counsel.
        </p>
      </section>

      {/* Mission Grid */}
      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white border border-border-main p-8 rounded-3xl text-center">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            To bridge the gap between Indian citizens and the complex legal system by providing accessible, AI-driven legal guidance in regional languages.
          </p>
        </div>
        
        <div className="bg-white border border-border-main p-8 rounded-3xl text-center">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">The Problem</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Millions of Indians abandon their pursuit of justice because they don't understand the legal jargon, procedures, or where to file a basic complaint.
          </p>
        </div>

        <div className="bg-white border border-border-main p-8 rounded-3xl text-center">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Our Solution</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            An intuitive platform that analyzes your issue, identifies your rights, drafts legal notices, and directs you to the exact government portal to resolve it.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-text-main text-white rounded-3xl p-12 text-center max-w-4xl mx-auto space-y-6">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Whether you need help with a legal issue today, or just want to know your rights for tomorrow, we're here for you.
        </p>
        <Link href="/signup" className="inline-block px-8 py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors shadow-lg">
          Create Your Free Account
        </Link>
      </section>

    </main>
  );
}
