"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { 
  GraduationCap, 
  Gamepad2, 
  BookOpen, 
  Trophy, 
  Star,
  ShieldAlert,
  Car,
  Home,
  CheckCircle2,
  Lock,
  Loader2,
  ShoppingBag,
  Briefcase,
  FileText,
  Plane,
  HeartPulse,
  CreditCard,
  Gavel,
  Scale,
  Award,
  Unlock,
  Play,
  CheckCircle
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function AcademyPage() {
  const [xp, setXp] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubscribeDoc = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setXp(data.xp || 0);
            setCompletedQuests(data.completedQuests || []);
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Failed to fetch user progress:", error);
          setIsLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setXp(0);
        setCompletedQuests([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const quests = [
    {
      id: "cyber-fraud",
      title: "The Fake UPI Message",
      category: "Cyber Security",
      xp: 50,
      icon: <ShieldAlert size={24} className="text-red-600" />,
      completed: completedQuests.includes("cyber-fraud"),
      locked: false
    },
    {
      id: "traffic-stop",
      title: "Traffic Police Stop",
      category: "Citizen Rights",
      xp: 75,
      icon: <Car size={24} className="text-amber-600" />,
      completed: completedQuests.includes("traffic-stop"),
      locked: false
    },
    {
      id: "tenant-dispute",
      title: "The Eviction Notice",
      category: "Property Law",
      xp: 100,
      icon: <Home size={24} className="text-blue-600" />,
      completed: completedQuests.includes("tenant-dispute"),
      locked: false
    },
    {
      id: "consumer-refund",
      title: "The Damaged Electronics Parcel",
      category: "Consumer Law",
      xp: 100,
      icon: <ShoppingBag size={24} className="text-green-600" />,
      completed: completedQuests.includes("consumer-refund"),
      locked: false
    },
    {
      id: "workplace-harassment",
      title: "Overtime Without Pay",
      category: "Labour Law",
      xp: 120,
      icon: <Briefcase size={24} className="text-purple-600" />,
      completed: completedQuests.includes("workplace-harassment"),
      locked: false
    },
    {
      id: "police-fir",
      title: "Police Refusal to File FIR",
      category: "Criminal Law",
      xp: 150,
      icon: <Gavel size={24} className="text-indigo-600" />,
      completed: completedQuests.includes("police-fir"),
      locked: false
    },
    {
      id: "airline-delay",
      title: "Flight Cancellation Compensation",
      category: "Aviation Rights",
      xp: 120,
      icon: <Plane size={24} className="text-sky-600" />,
      completed: completedQuests.includes("airline-delay"),
      locked: false
    },
    {
      id: "rti-application",
      title: "Government Hospital Records Query",
      category: "RTI & Transparency",
      xp: 100,
      icon: <FileText size={24} className="text-teal-600" />,
      completed: completedQuests.includes("rti-application"),
      locked: false
    },
    {
      id: "women-safety",
      title: "Maternity Leave Denial",
      category: "Women Rights",
      xp: 150,
      icon: <HeartPulse size={24} className="text-pink-600" />,
      completed: completedQuests.includes("women-safety"),
      locked: false
    },
    {
      id: "loan-harassment",
      title: "Recovery Agent Threat at Midnight",
      category: "Banking & RBI Rules",
      xp: 125,
      icon: <CreditCard size={24} className="text-orange-600" />,
      completed: completedQuests.includes("loan-harassment"),
      locked: false
    }
  ];

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="animate-spin text-brand-primary mb-4" />
        <p className="text-text-muted font-semibold">Loading Academy Profile...</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 font-sans">
      
      {/* Header Profile */}
      <div className="bg-gradient-to-br from-indigo-900 via-black to-black text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-border-main">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <GraduationCap size={200} />
        </div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <Trophy size={38} className="text-yellow-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-400/40 inline-flex items-center gap-1">
                <Unlock size={12} /> All 10 Quests Unlocked
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                {completedQuests.length} / {quests.length} Completed
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-1">Legal Academy</h1>
            <p className="text-indigo-200 text-sm">Master your citizen rights across 10 real-world Indian legal scenarios.</p>
          </div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center w-full md:w-auto min-w-[200px]">
          <p className="text-indigo-200 text-xs font-bold mb-1 uppercase tracking-wider">Total XP Earned</p>
          <div className="text-4xl font-extrabold flex items-center justify-center gap-2 text-yellow-400">
            {xp} <Star size={26} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        
        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 size={24} className="text-text-main" />
              <h2 className="text-2xl font-bold text-text-main">Academy Quests</h2>
            </div>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-3.5 py-1.5 rounded-full border border-green-200">
              ● Open Access • No Prerequisites
            </span>
          </div>

          <div className="space-y-4">
            {quests.map((quest) => (
              <div 
                key={quest.id} 
                className={`border-2 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${
                  quest.completed
                    ? "bg-green-50/40 border-green-400/80 shadow-2xs"
                    : "bg-white border-border-main hover:shadow-md hover:border-black"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-bg-subtle border border-border-main shadow-sm">
                      {quest.icon}
                    </div>
                    
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-main px-2.5 py-0.5 rounded-full border border-border-main">
                          {quest.category}
                        </span>
                        {quest.completed && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full border border-green-300 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Completed (+{quest.xp} XP)
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-text-main leading-snug">
                        {quest.title}
                      </h3>
                      <p className="text-xs font-bold text-brand-primary flex items-center gap-1 mt-1">
                        <Star size={14} fill="currentColor" /> +{quest.xp} XP Reward
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <Link 
                      href={`/dashboard/academy/quest?id=${quest.id}`} 
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 ${
                        quest.completed
                          ? "bg-white text-text-main border-2 border-black hover:bg-bg-subtle"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      <Play size={14} fill="currentColor" />
                      {quest.completed ? "Practice Again" : "Play Now"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-text-main mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-yellow-500" />
              Legal Ranks & Badges
            </h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${xp >= 50 ? 'bg-yellow-50 border-yellow-400' : 'bg-bg-subtle border-border-main opacity-60'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${xp >= 50 ? 'bg-yellow-100' : 'bg-gray-200 grayscale'}`}>
                  🏅
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-main">First Case Solved</h4>
                  <p className="text-[11px] text-text-muted">Earn 50 XP</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${xp >= 150 ? 'bg-yellow-50 border-yellow-400' : 'bg-bg-subtle border-border-main opacity-60'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${xp >= 150 ? 'bg-yellow-100' : 'bg-gray-200 grayscale'}`}>
                  🛡️
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-main">Citizen Defender</h4>
                  <p className="text-[11px] text-text-muted">Earn 150 XP</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${xp >= 400 ? 'bg-yellow-50 border-yellow-400' : 'bg-bg-subtle border-border-main opacity-60'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${xp >= 400 ? 'bg-yellow-100' : 'bg-gray-200 grayscale'}`}>
                  ⚖️
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-main">Legal Scholar</h4>
                  <p className="text-[11px] text-text-muted">Earn 400 XP</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${xp >= 750 ? 'bg-yellow-50 border-yellow-400' : 'bg-bg-subtle border-border-main opacity-60'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${xp >= 750 ? 'bg-yellow-100' : 'bg-gray-200 grayscale'}`}>
                  👑
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-main">Constitutional Master</h4>
                  <p className="text-[11px] text-text-muted">Earn 750 XP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-subtle border-2 border-black rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-text-main mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-brand-primary" />
              Why Solve Quests?
            </h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed font-medium">
              Every quest teaches you practical Indian statutory rights—from the IT Act and Consumer Protection Act to police procedures and RBI lending guidelines.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-green-800 bg-green-100 p-3 rounded-xl border border-green-300">
              <CheckCircle size={16} className="text-green-700 shrink-0" />
              <span>All 10 scenarios are open immediately. Start anywhere!</span>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
