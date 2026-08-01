import React from "react";
import { getTranslations } from "next-intl/server";
import { 
  Send, 
  RefreshCcw,
  MessageSquare,
  FileText,
  ClipboardList,
  Landmark,
  Folder,
  Phone,
  Eye,
  FileCheck2,
  FileQuestion,
  Scale
} from "lucide-react";
import { getSession } from "@/actions/auth";
import DashboardChatInput from "@/components/DashboardChatInput";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  const session = await getSession();
  const userName = session?.name ? session.name.split(" ")[0] : "User";

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-8 font-sans selection:bg-brand-accent selection:text-white">
      
      {/* Top Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Input Area */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
              {t("greeting", { name: userName })} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-text-muted">{t("helpPrompt")}</p>
          </div>

          <DashboardChatInput />
        </div>

        {/* Emergency Help Card */}
        <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">{t("immediateHelp.title")}</h3>
              <p className="text-sm text-text-muted">{t("immediateHelp.desc")}</p>
            </div>
            <div className="bg-brand-accent/10 p-3 rounded-full text-brand-accent shrink-0">
              <div className="relative">
                <div className="w-6 h-6 border-b-4 border-brand-accent rounded-t-full relative z-10"></div>
                <div className="w-1 h-2 bg-brand-accent absolute -top-2 left-1/2 -translate-x-1/2"></div>
                <div className="w-8 h-1 bg-brand-accent absolute bottom-[-4px] left-1/2 -translate-x-1/2 rounded-full"></div>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 bg-text-main text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-md">
            <Phone size={18} />
            {t("immediateHelp.button")}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold mb-4">{t("quickActions.title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button className="bg-white border border-border-main rounded-2xl p-5 text-left hover:shadow-md transition-shadow group flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-bg-subtle rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={24} className="text-text-main" />
            </div>
            <h4 className="font-bold text-sm mb-1">{t("quickActions.ai.title")}</h4>
            <p className="text-xs text-text-muted">{t("quickActions.ai.desc")}</p>
          </button>
          
          <button className="bg-white border border-border-main rounded-2xl p-5 text-left hover:shadow-md transition-shadow group flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-bg-subtle rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText size={24} className="text-text-main" />
            </div>
            <h4 className="font-bold text-sm mb-1">{t("quickActions.complaint.title")}</h4>
            <p className="text-xs text-text-muted">{t("quickActions.complaint.desc")}</p>
          </button>

          <button className="bg-white border border-border-main rounded-2xl p-5 text-left hover:shadow-md transition-shadow group flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-bg-subtle rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ClipboardList size={24} className="text-text-main" />
            </div>
            <h4 className="font-bold text-sm mb-1">{t("quickActions.evidence.title")}</h4>
            <p className="text-xs text-text-muted">{t("quickActions.evidence.desc")}</p>
          </button>

          <button className="bg-white border border-border-main rounded-2xl p-5 text-left hover:shadow-md transition-shadow group flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-bg-subtle rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Landmark size={24} className="text-text-main" />
            </div>
            <h4 className="font-bold text-sm mb-1">{t("quickActions.navigator.title")}</h4>
            <p className="text-xs text-text-muted">{t("quickActions.navigator.desc")}</p>
          </button>

          <button className="bg-white border border-border-main rounded-2xl p-5 text-left hover:shadow-md transition-shadow group flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-bg-subtle rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Folder size={24} className="text-text-main" />
            </div>
            <h4 className="font-bold text-sm mb-1">{t("quickActions.cases.title")}</h4>
            <p className="text-xs text-text-muted">{t("quickActions.cases.desc")}</p>
          </button>
        </div>
      </section>

      {/* Tables and Activity */}
      <div className="grid lg:grid-cols-3 gap-8 pt-4 pb-12">
        
        {/* Recent Cases Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{t("recentCases.title")}</h2>
            <button className="text-sm font-semibold text-text-muted hover:text-text-main">{t("recentCases.viewAll")}</button>
          </div>
          <div className="bg-white border border-border-main rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-subtle border-b border-border-main text-text-muted font-semibold">
                <tr>
                  <th className="px-6 py-4">{t("recentCases.columns.issue")}</th>
                  <th className="px-6 py-4">{t("recentCases.columns.status")}</th>
                  <th className="px-6 py-4">{t("recentCases.columns.updated")}</th>
                  <th className="px-6 py-4 text-center">{t("recentCases.columns.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                <tr className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-6 py-4 font-medium">Online Payment Fraud</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {t("recentCases.statuses.inProgress")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">12 May 2025</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-text-muted hover:text-brand-primary rounded-lg hover:bg-brand-primary/10 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-6 py-4 font-medium">Landlord Dispute</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {t("recentCases.statuses.draftGenerated")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">10 May 2025</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-text-muted hover:text-brand-primary rounded-lg hover:bg-brand-primary/10 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-6 py-4 font-medium">Cyber Harassment</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      {t("recentCases.statuses.evidenceCollected")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">08 May 2025</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-text-muted hover:text-brand-primary rounded-lg hover:bg-brand-primary/10 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-bold mb-4">{t("activity.title")}</h2>
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="space-y-6">
              
              <div className="flex gap-4">
                <div className="mt-1 shrink-0">
                  <FileCheck2 size={20} className="text-text-main" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("activity.items.doc")}</p>
                  <p className="text-xs text-text-muted mt-1">12 May 2025</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 shrink-0">
                  <FileQuestion size={20} className="text-text-main" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("activity.items.evidence")}</p>
                  <p className="text-xs text-text-muted mt-1">11 May 2025</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 shrink-0">
                  <Folder size={20} className="text-text-main" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("activity.items.new")}</p>
                  <p className="text-xs text-text-muted mt-1">10 May 2025</p>
                </div>
              </div>

            </div>

            <button className="w-full mt-8 py-3 text-sm font-semibold border border-border-main rounded-xl hover:bg-bg-subtle transition-colors shadow-sm flex items-center justify-center gap-2">
              {t("activity.viewAll")}
              <span className="text-lg leading-none">→</span>
            </button>
          </div>
        </div>

      </div>

      {/* Quote Footer */}
      <div className="flex items-center justify-center gap-4 py-8 opacity-60">
        <Scale size={28} />
        <div>
          <p className="font-bold text-sm">{t("quote")}</p>
          <p className="text-xs">{t("quoteSub")}</p>
        </div>
      </div>

    </main>
  );
}
