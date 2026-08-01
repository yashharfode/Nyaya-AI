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
    <main className="min-h-screen bg-white selection:bg-black selection:text-white pb-24">
      
      {/* Premium Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-gray-50 rounded-[100%] blur-3xl -z-10 opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck size={16} />
            <span>Legal Empowerment for Everyone</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Know Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Rights</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            We break down complex Indian laws into simple, actionable insights so you can protect yourself and your family with absolute confidence.
          </p>
        </div>
      </section>

      {/* Rights Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {rightsPreview.map((right, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white border border-gray-200 p-10 rounded-3xl hover:border-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${(idx + 3) * 100}ms` }}
            >
              {/* Hover gradient effect in background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-gray-200 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                  {right.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-gray-800 transition-colors">{right.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-6 text-lg">
                    {right.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-black border-b border-transparent group-hover:border-black transition-all">
                    Sign in to read details <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
        <div className="bg-black rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative rings */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] border border-gray-800 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[300px] h-[300px] border border-gray-800 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Explore the Full Database</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Create a free account to access our comprehensive, searchable database of fundamental, consumer, property, and workplace rights complete with official legal citations.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
