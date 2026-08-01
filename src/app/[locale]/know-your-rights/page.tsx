import React from "react";
import { Link } from "@/i18n/routing";
import { ShieldCheck, Scale, Lock, Briefcase } from "lucide-react";

export default function PublicRightsPage() {
  const rightsPreview = [
    {
      title: "Consumer Rights",
      description: "You have the right to be protected against hazardous goods, the right to be informed about quality and price, and the right to seek redressal against unfair trade practices.",
      icon: <Scale size={24} className="text-amber-600" />
    },
    {
      title: "Fundamental Rights",
      description: "Guaranteed by the Constitution, including the Right to Equality, Freedom of Speech, and Protection of Life and Personal Liberty.",
      icon: <ShieldCheck size={24} className="text-brand-primary" />
    },
    {
      title: "Data Privacy & Digital Rights",
      description: "Understand your rights regarding personal data collection, consent, and protection against unauthorized surveillance or data breaches.",
      icon: <Lock size={24} className="text-red-600" />
    },
    {
      title: "Workplace Rights",
      description: "Protection against discrimination, right to a safe working environment, timely payment of wages, and protection against unjust termination.",
      icon: <Briefcase size={24} className="text-teal-600" />
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-24 selection:bg-brand-accent selection:text-white">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="w-20 h-20 bg-bg-subtle border border-border-main rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
          <ShieldCheck size={40} className="text-text-main" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-main leading-tight">
          Know Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Rights</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
          Legal empowerment starts with knowledge. We break down complex Indian laws into simple, actionable insights so you can protect yourself and your family.
        </p>
      </section>

      {/* Rights Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        {rightsPreview.map((right, idx) => (
          <div key={idx} className="bg-white border border-border-main p-8 rounded-3xl hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-bg-subtle rounded-2xl flex items-center justify-center shrink-0 border border-border-main">
                {right.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-main mb-3">{right.title}</h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  {right.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                  Sign in to read details <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-bg-subtle border border-border-main rounded-3xl p-12 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold mb-4">Explore the Full Database</h2>
        <p className="text-text-muted mb-8 max-w-xl mx-auto">
          Create a free account to access our comprehensive, searchable database of fundamental, consumer, property, and workplace rights complete with legal citations.
        </p>
        <Link href="/signup" className="inline-block px-8 py-3.5 bg-text-main text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
          Create Free Account
        </Link>
      </section>

    </main>
  );
}
