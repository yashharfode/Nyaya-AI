"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  ShoppingCart, 
  Home, 
  Briefcase, 
  CreditCard, 
  ShieldAlert, 
  ChevronRight,
  PieChart,
  PlusSquare,
  Upload,
  MessageSquare,
  ShieldCheck,
  Headphones,
  Calendar,
  ArrowRight,
  Scale,
  Loader2
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function MyCasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We must wait for auth state to resolve
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(
          collection(db, "cases"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const fetchedCases = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCases(fetchedCases);
          setIsLoading(false);
        }, (error) => {
          console.error("Error fetching cases:", error);
          setIsLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setCases([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const getIconForCategory = (category: string) => {
    const c = category?.toLowerCase() || "";
    if (c.includes("cyber") || c.includes("fraud")) return <ShieldAlert size={20} className="text-red-600" />;
    if (c.includes("property") || c.includes("tenant") || c.includes("landlord")) return <Home size={20} className="text-blue-600" />;
    if (c.includes("work") || c.includes("employment")) return <Briefcase size={20} className="text-green-600" />;
    if (c.includes("consumer") || c.includes("product")) return <ShoppingCart size={20} className="text-orange-600" />;
    return <Scale size={20} className="text-indigo-600" />;
  };

  const getBgForCategory = (category: string) => {
    const c = category?.toLowerCase() || "";
    if (c.includes("cyber") || c.includes("fraud")) return "bg-red-50 border-red-100";
    if (c.includes("property") || c.includes("tenant") || c.includes("landlord")) return "bg-blue-50 border-blue-100";
    if (c.includes("work") || c.includes("employment")) return "bg-green-50 border-green-100";
    if (c.includes("consumer") || c.includes("product")) return "bg-orange-50 border-orange-100";
    return "bg-indigo-50 border-indigo-100";
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight mb-2">My Cases</h1>
          <p className="text-sm text-text-muted">Track, manage and take action on all your legal matters in one place.</p>
        </div>
        <button 
          onClick={() => router.push("/dashboard/describe-issue")}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} />
          New Case
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="space-y-6">
          
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button className="px-4 py-2 rounded-full text-sm font-bold bg-black text-white shrink-0">All Cases</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">In Progress</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-bg-subtle text-text-muted hover:text-text-main transition-colors shrink-0">Draft</button>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                <Loader2 size={32} className="animate-spin mb-4" />
                <p>Loading your cases...</p>
              </div>
            ) : cases.length === 0 ? (
              <div className="bg-white border border-border-main rounded-2xl p-12 shadow-sm text-center">
                <Scale size={48} className="mx-auto text-text-light mb-4" />
                <h3 className="text-xl font-bold text-text-main mb-2">⚖ You haven't created your first case.</h3>
                <p className="text-text-muted mb-6">Describe your issue to get started with NyayaAI analysis.</p>
                <button 
                  onClick={() => router.push("/dashboard/describe-issue")}
                  className="bg-black text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <Plus size={18} /> Create Now
                </button>
              </div>
            ) : (
              cases.map((caseItem) => {
                const date = caseItem.createdAt ? new Date(caseItem.createdAt.toMillis()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Just now";
                const categoryClass = getBgForCategory(caseItem.category);
                
                return (
                  <div 
                    key={caseItem.id}
                    onClick={() => {
                      sessionStorage.setItem("nyaya_ai_analysis", JSON.stringify(caseItem));
                      router.push("/dashboard/ai-assistant");
                    }}
                    className="bg-white border border-border-main rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${categoryClass}`}>
                        {getIconForCategory(caseItem.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-text-main mb-1 line-clamp-1">{caseItem.originalIssue || caseItem.category}</h3>
                        <p className="text-[11px] text-text-muted mb-2">Category: {caseItem.category}</p>
                        <div className="flex items-center gap-4 text-[11px] font-semibold">
                          <div className="flex items-center gap-1 text-text-muted">
                            <Calendar size={12} /> {date}
                          </div>
                          <div className="flex items-center gap-1 text-text-main">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            {caseItem.status || "Analyzed"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col gap-2 shrink-0">
                      <div className="flex items-center justify-end w-full">
                        <span className="bg-bg-subtle text-text-main px-3 py-1 rounded-full text-[10px] font-bold border border-border-main">
                          {caseItem.severity || "Medium"} Severity
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <ChevronRight size={18} className="text-text-light" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>

        </div>

        {/* Sidebar Content (Right) */}
        <div className="space-y-6 hidden lg:block">
          
          {/* Case Overview Placeholder */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={20} className="text-text-main" />
              <h3 className="font-bold text-sm text-text-main">Case Overview</h3>
            </div>
            
            <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-8 border-gray-100 border-t-yellow-400"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black leading-none">{cases.length}</span>
                <span className="text-[10px] text-text-muted font-bold mt-1">Total</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PlusSquare size={20} className="text-text-main" />
              <h3 className="font-bold text-sm text-text-main">Quick Actions</h3>
            </div>
            
            <div className="space-y-4">
              <div onClick={() => router.push("/dashboard/describe-issue")} className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md bg-bg-subtle border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Plus size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">File a New Case</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Start a new legal case</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-6 h-6 rounded-md bg-bg-subtle border border-border-main flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Upload size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-text-main group-hover:text-black transition-colors">Upload Documents</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Add documents to a case</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
