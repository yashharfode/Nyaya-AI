import React from "react";
import { Link } from "@/i18n/routing";
import { Bot, FileText, Globe, CheckSquare, Search, ShieldCheck } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI Issue Analysis",
      description: "Describe your legal issue in simple words. Our advanced AI model analyzes it, identifies the category, and maps it to the relevant Indian laws in seconds.",
      icon: <Bot size={28} className="text-brand-primary" />
    },
    {
      title: "Automated Evidence Checklist",
      description: "Stop guessing what proof you need. NyayaAI generates a precise, customized list of documents and evidence required to strengthen your specific case.",
      icon: <CheckSquare size={28} className="text-green-600" />
    },
    {
      title: "Smart Legal Drafting",
      description: "Generate standard legal notices, consumer complaints, and RTI applications instantly. Just fill in your details and download a professionally formatted draft.",
      icon: <FileText size={28} className="text-indigo-600" />
    },
    {
      title: "Multilingual Support",
      description: "Justice shouldn't be limited by language barriers. Access all features, laws, and drafts in English, Hindi, Marathi, and 12 other regional languages.",
      icon: <Globe size={28} className="text-amber-600" />
    },
    {
      title: "Government Portal Navigator",
      description: "We help you find the exact official government portal (Consumer Helpline, Cyber Crime, RERA) needed to officially file your dispute.",
      icon: <Search size={28} className="text-teal-600" />
    },
    {
      title: "Data Privacy & Security",
      description: "Your case details are private. We employ industry-standard encryption to ensure your legal issues and generated documents remain strictly confidential.",
      icon: <ShieldCheck size={28} className="text-red-600" />
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-24 selection:bg-brand-accent selection:text-white">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-main leading-tight">
          Supercharge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Legal Navigation</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed">
          NyayaAI combines advanced artificial intelligence with India's legal framework to provide you with actionable, step-by-step guidance.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white border border-border-main p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-bg-subtle rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-text-main mb-3">{feature.title}</h3>
            <p className="text-text-muted leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-text-main text-white rounded-3xl p-12 text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to simplify your legal journey?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Join thousands of citizens who have successfully navigated consumer disputes, tenant issues, and cyber crimes with NyayaAI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/30">
              Get Started for Free
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
