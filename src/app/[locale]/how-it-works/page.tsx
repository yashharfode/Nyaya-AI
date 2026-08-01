import React from "react";
import { useTranslations } from "next-intl";
import { 
  Info,
  MessageSquare,
  Search,
  ClipboardList,
  FileText,
  User,
  Cpu,
  ArrowRight,
  Landmark,
  ShieldCheck,
  EyeOff,
  Languages,
  Users
} from "lucide-react";

export default function HowItWorks() {
  const t = useTranslations("HowItWorksPage");

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-brand-accent selection:text-white pb-24">
      
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Timeline */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-subtle border border-border-main text-text-main text-sm font-semibold shadow-sm">
              <Info size={16} className="text-text-muted" />
              {t("badge")}
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight">{t("title")}</h1>
            
            <p className="text-lg text-text-muted">
              {t("description")}
            </p>
            
            <div className="relative pt-6">
              <div className="absolute left-[15px] top-10 bottom-10 w-[2px] border-l-2 border-dashed border-border-main -z-10"></div>
              
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
                  </div>
                  <div className="flex-1 flex gap-4 items-start bg-bg-main border border-border-main p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-bg-subtle p-4 rounded-xl shrink-0">
                      <MessageSquare size={28} className="text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{t("steps.step1.title")}</h3>
                      <p className="text-text-muted text-sm mt-1">{t("steps.step1.desc")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-md">2</div>
                  </div>
                  <div className="flex-1 flex gap-4 items-start bg-bg-main border border-border-main p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-bg-subtle p-4 rounded-xl shrink-0">
                      <Search size={28} className="text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{t("steps.step2.title")}</h3>
                      <p className="text-text-muted text-sm mt-1">{t("steps.step2.desc")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-md">3</div>
                  </div>
                  <div className="flex-1 flex gap-4 items-start bg-bg-main border border-border-main p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-bg-subtle p-4 rounded-xl shrink-0">
                      <ClipboardList size={28} className="text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{t("steps.step3.title")}</h3>
                      <p className="text-text-muted text-sm mt-1">{t("steps.step3.desc")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-md">4</div>
                  </div>
                  <div className="flex-1 flex gap-4 items-start bg-bg-main border border-border-main p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-bg-subtle p-4 rounded-xl shrink-0">
                      <Landmark size={28} className="text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{t("steps.step4.title")}</h3>
                      <p className="text-text-muted text-sm mt-1">{t("steps.step4.desc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="bg-bg-subtle border border-border-main rounded-3xl p-8 shadow-sm flex flex-col h-full relative overflow-hidden">
              <h2 className="text-xl font-bold mb-8">{t("flowchart.title")}</h2>
              
              <div className="flex items-center justify-between w-full relative z-10 px-4 md:px-8">
                
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white border border-border-main p-5 rounded-2xl shadow-sm">
                    <User size={32} className="text-brand-primary" />
                  </div>
                  <span className="text-sm font-semibold text-center leading-tight whitespace-pre-line">{t("flowchart.node1")}</span>
                </div>
                
                <ArrowRight className="text-text-light shrink-0 mb-8" size={20} />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white border border-border-main p-5 rounded-2xl shadow-sm">
                    <Cpu size={32} className="text-brand-primary" />
                  </div>
                  <span className="text-sm font-semibold text-center leading-tight whitespace-pre-line">{t("flowchart.node2")}</span>
                </div>
                
                <ArrowRight className="text-text-light shrink-0 mb-8" size={20} />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white border border-border-main p-5 rounded-2xl shadow-sm">
                    <FileText size={32} className="text-brand-primary" />
                  </div>
                  <span className="text-sm font-semibold text-center leading-tight whitespace-pre-line">{t("flowchart.node3")}</span>
                </div>
                
                <ArrowRight className="text-text-light shrink-0 mb-8" size={20} />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white border border-border-main p-5 rounded-2xl shadow-sm">
                    <Landmark size={32} className="text-brand-primary" />
                  </div>
                  <span className="text-sm font-semibold text-center leading-tight whitespace-pre-line">{t("flowchart.node4")}</span>
                </div>

              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none opacity-80">
                <svg viewBox="0 0 800 200" className="w-full h-full object-cover object-bottom" preserveAspectRatio="none">
                  <path d="M 100 200 Q 300 150 400 120 T 700 80" fill="none" stroke="#e5e7eb" strokeWidth="80" strokeLinecap="round" />
                  <path d="M 100 200 Q 300 150 400 120 T 700 80" fill="none" stroke="#f9fafb" strokeWidth="70" strokeLinecap="round" />
                  
                  <circle cx="200" cy="140" r="15" fill="#d1d5db" />
                  <circle cx="220" cy="145" r="10" fill="#d1d5db" />
                  
                  <circle cx="650" cy="90" r="12" fill="#d1d5db" />
                  <circle cx="670" cy="95" r="8" fill="#d1d5db" />
                  
                  <circle cx="350" cy="110" r="18" fill="#d1d5db" />
                </svg>
                
                <div className="absolute right-[10%] bottom-[40%] text-brand-primary/80 transform translate-x-1/2">
                  <Landmark size={80} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="bg-bg-subtle border border-border-main rounded-2xl p-6 flex items-start gap-6 shadow-sm">
              <div className="bg-white p-4 rounded-full shadow-sm shrink-0">
                <ShieldCheck size={32} className="text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">{t("trust.title")}</h3>
                <p className="text-text-muted leading-relaxed">
                  {t("trust.desc")}
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
        <div className="bg-bg-main border border-border-main rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 shadow-sm">
          
          <div className="flex items-start gap-4 lg:border-r border-border-main lg:pr-6">
            <div className="bg-bg-subtle p-3 rounded-xl shrink-0">
              <ShieldCheck size={24} className="text-brand-primary" />
            </div>
            <div>
              <h4 className="font-bold mb-1">{t("features.secure.title")}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{t("features.secure.desc")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 lg:border-r border-border-main lg:pr-6">
            <div className="bg-bg-subtle p-3 rounded-xl shrink-0">
              <EyeOff size={24} className="text-brand-primary" />
            </div>
            <div>
              <h4 className="font-bold mb-1">{t("features.privacy.title")}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{t("features.privacy.desc")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 lg:border-r border-border-main lg:pr-6">
            <div className="bg-bg-subtle p-3 rounded-xl shrink-0">
              <Languages size={24} className="text-brand-primary" />
            </div>
            <div>
              <h4 className="font-bold mb-1">{t("features.language.title")}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{t("features.language.desc")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-bg-subtle p-3 rounded-xl shrink-0">
              <Users size={24} className="text-brand-primary" />
            </div>
            <div>
              <h4 className="font-bold mb-1">{t("features.everyone.title")}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{t("features.everyone.desc")}</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
