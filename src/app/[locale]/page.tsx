import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Heart,
  Users,
  FileCheck2,
  Gavel,
  ShieldCheck,
  Bot,
  ListChecks,
  Landmark,
  LineChart,
  Search,
  ClipboardList
} from "lucide-react";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-brand-accent selection:text-white">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-semibold shadow-sm">
              <Sparkles size={16} className="fill-brand-accent/20" />
              {t("badge")}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              {t("title1")} <br />
              {t("title2")}
            </h1>
            
            <p className="text-lg text-text-muted leading-relaxed max-w-lg">
              {t("description")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard/describe-issue" className="flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-brand-primary/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-primary/20">
                <MessageSquare size={20} />
                {t("buttonPrimary")}
              </Link>
              <Link href="/know-your-rights" className="flex items-center justify-center gap-2 bg-white text-text-main border border-border-main px-6 py-4 rounded-xl font-semibold hover:bg-bg-subtle transition-all shadow-sm hover:shadow-md">
                <FileText size={20} />
                {t("buttonSecondary")}
              </Link>
            </div>
            
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-text-muted flex items-center gap-1">
                {t("socialProof")} <Heart size={14} className="fill-brand-primary text-brand-primary" />
              </div>
            </div>
          </div>

          {/* Right Content - Abstract Illustration */}
          <div className="relative h-[600px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary to-transparent rounded-full blur-3xl opacity-50"></div>
            
            {/* Center Pillar/Landmark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow-2xl flex flex-col items-center">
              <Landmark size={200} className="text-brand-primary opacity-90 drop-shadow-lg" strokeWidth={1} />
            </div>

            {/* Connecting Lines SVG */}
            <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
              <path d="M 200 150 Q 350 150, 350 250" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M 150 250 Q 300 250, 350 300" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M 150 400 Q 300 400, 350 350" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M 450 150 Q 300 150, 350 250" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M 450 250 Q 300 250, 350 300" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M 450 400 Q 300 400, 350 350" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            </svg>

            {/* Floating Cards */}
            <div className="absolute top-10 left-0 bg-white p-4 rounded-2xl shadow-xl border border-border-main flex gap-4 items-center w-64 hover:-translate-y-1 transition-transform z-20">
              <div className="bg-brand-secondary p-3 rounded-xl text-brand-primary">
                <Bot size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t("features.aiAssistant.title")}</h4>
                <p className="text-xs text-text-muted mt-1">{t("features.aiAssistant.desc")}</p>
              </div>
            </div>

            <div className="absolute top-36 -left-12 bg-white p-4 rounded-2xl shadow-xl border border-border-main flex gap-4 items-center w-64 hover:-translate-y-1 transition-transform z-20">
              <div className="bg-brand-secondary p-3 rounded-xl text-brand-primary">
                <ListChecks size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t("features.evidence.title")}</h4>
                <p className="text-xs text-text-muted mt-1">{t("features.evidence.desc")}</p>
              </div>
            </div>

            <div className="absolute top-72 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-border-main flex gap-4 items-center w-64 hover:-translate-y-1 transition-transform z-20">
              <div className="bg-brand-secondary p-3 rounded-xl text-brand-primary">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t("features.complaint.title")}</h4>
                <p className="text-xs text-text-muted mt-1">{t("features.complaint.desc")}</p>
              </div>
            </div>

            <div className="absolute top-12 right-0 bg-white p-4 rounded-2xl shadow-xl border border-border-main flex gap-4 items-center w-64 hover:-translate-y-1 transition-transform z-20">
              <div className="bg-brand-secondary p-3 rounded-xl text-brand-primary">
                <Gavel size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t("features.laws.title")}</h4>
                <p className="text-xs text-text-muted mt-1">{t("features.laws.desc")}</p>
              </div>
            </div>

            <div className="absolute top-44 -right-12 bg-white p-4 rounded-2xl shadow-xl border border-border-main flex gap-4 items-center w-64 hover:-translate-y-1 transition-transform z-20">
              <div className="bg-brand-secondary p-3 rounded-xl text-brand-primary">
                <Landmark size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t("features.navigator.title")}</h4>
                <p className="text-xs text-text-muted mt-1">{t("features.navigator.desc")}</p>
              </div>
            </div>

            <div className="absolute top-[320px] right-4 bg-white p-4 rounded-2xl shadow-xl border border-border-main flex gap-4 items-center w-64 hover:-translate-y-1 transition-transform z-20">
              <div className="bg-brand-secondary p-3 rounded-xl text-brand-primary">
                <LineChart size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t("features.dashboard.title")}</h4>
                <p className="text-xs text-text-muted mt-1">{t("features.dashboard.desc")}</p>
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-2xl shadow-lg border border-border-main flex gap-3 items-center z-20">
              <ShieldCheck size={24} className="text-brand-primary" />
              <div>
                <h4 className="font-bold text-sm">{t("features.secure.title")}</h4>
                <p className="text-xs text-text-muted">{t("features.secure.desc")}</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-bg-main border border-border-main rounded-3xl p-8 md:p-12 shadow-xl shadow-brand-primary/5 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-6 w-full md:w-auto md:flex-1 md:border-r border-border-main">
            <div className="bg-bg-subtle p-4 rounded-2xl">
              <Users size={32} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-black">{t("stats.users.value")}</h3>
              <p className="text-text-muted font-medium">{t("stats.users.label")}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto md:flex-1 md:border-r border-border-main md:pl-8">
            <div className="bg-bg-subtle p-4 rounded-2xl">
              <FileCheck2 size={32} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-black">{t("stats.docs.value")}</h3>
              <p className="text-text-muted font-medium">{t("stats.docs.label")}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto md:flex-1 md:border-r border-border-main md:pl-8">
            <div className="bg-bg-subtle p-4 rounded-2xl">
              <Gavel size={32} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-black">{t("stats.categories.value")}</h3>
              <p className="text-text-muted font-medium">{t("stats.categories.label")}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto md:flex-1 md:pl-8">
            <div className="bg-bg-subtle p-4 rounded-2xl">
              <ShieldCheck size={32} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-black">{t("stats.secure.value")}</h3>
              <p className="text-text-muted font-medium">{t("stats.secure.label")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t("howItWorks.title")}</h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/3 left-0 w-full h-[2px] border-b-2 border-dashed border-border-main -z-10 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-4 gap-12 md:gap-6">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center md:items-start relative bg-bg-main">
              <div className="w-20 h-20 bg-bg-subtle border border-border-main rounded-full flex items-center justify-center mb-6 shadow-sm relative">
                <MessageSquare size={32} className="text-brand-primary" />
                <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">1</div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.steps.step1.title")}</h3>
              <p className="text-text-muted text-center md:text-left text-sm leading-relaxed">
                {t("howItWorks.steps.step1.desc")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center md:items-start relative bg-bg-main">
              <div className="w-20 h-20 bg-bg-subtle border border-border-main rounded-full flex items-center justify-center mb-6 shadow-sm relative">
                <Search size={32} className="text-brand-primary" />
                <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">2</div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.steps.step2.title")}</h3>
              <p className="text-text-muted text-center md:text-left text-sm leading-relaxed">
                {t("howItWorks.steps.step2.desc")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center md:items-start relative bg-bg-main">
              <div className="w-20 h-20 bg-bg-subtle border border-border-main rounded-full flex items-center justify-center mb-6 shadow-sm relative">
                <ClipboardList size={32} className="text-brand-primary" />
                <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">3</div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.steps.step3.title")}</h3>
              <p className="text-text-muted text-center md:text-left text-sm leading-relaxed">
                {t("howItWorks.steps.step3.desc")}
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center md:items-start relative bg-bg-main">
              <div className="w-20 h-20 bg-bg-subtle border border-border-main rounded-full flex items-center justify-center mb-6 shadow-sm relative">
                <FileText size={32} className="text-brand-primary" />
                <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">4</div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.steps.step4.title")}</h3>
              <p className="text-text-muted text-center md:text-left text-sm leading-relaxed">
                {t("howItWorks.steps.step4.desc")}
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
