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
  Lock
} from "lucide-react";

export default function AcademyPage() {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const savedXp = localStorage.getItem("nyaya_ai_xp");
    if (savedXp) {
      setXp(parseInt(savedXp));
    }
  }, []);

  const quests = [
    {
      id: "cyber-fraud",
      title: "The Fake UPI Message",
      category: "Cyber Security",
      xp: 50,
      icon: <ShieldAlert size={24} className="text-red-600" />,
      completed: xp >= 50,
      locked: false
    },
    {
      id: "traffic-stop",
      title: "Traffic Police Stop",
      category: "Citizen Rights",
      xp: 75,
      icon: <Car size={24} className="text-amber-600" />,
      completed: xp >= 125,
      locked: xp < 50
    },
    {
      id: "tenant-dispute",
      title: "The Eviction Notice",
      category: "Property Law",
      xp: 100,
      icon: <Home size={24} className="text-blue-600" />,
      completed: false,
      locked: xp < 125
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 font-sans">
      
      {/* Header Profile */}
      <div className="bg-gradient-to-br from-indigo-900 to-black text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <GraduationCap size={200} />
        </div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <Trophy size={36} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Legal Academy</h1>
            <p className="text-indigo-200">Learn your rights by solving real-life scenarios.</p>
          </div>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center w-full md:w-auto min-w-[200px]">
          <p className="text-indigo-200 text-sm font-semibold mb-1 uppercase tracking-wider">Total XP</p>
          <div className="text-4xl font-extrabold flex items-center justify-center gap-2 text-yellow-400">
            {xp} <Star size={24} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        
        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 size={24} className="text-text-main" />
            <h2 className="text-2xl font-bold text-text-main">Active Quests</h2>
          </div>

          <div className="space-y-4">
            {quests.map((quest) => (
              <div 
                key={quest.id} 
                className={`border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${
                  quest.locked 
                    ? "bg-bg-subtle border-border-main opacity-70 cursor-not-allowed" 
                    : "bg-white border-border-main hover:shadow-md hover:border-brand-primary/50 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                    quest.locked ? "bg-gray-100 border-gray-200" : "bg-bg-subtle border-border-main"
                  }`}>
                    {quest.locked ? <Lock size={24} className="text-text-light" /> : quest.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-main px-2 py-0.5 rounded-full border border-border-main">
                        {quest.category}
                      </span>
                      {quest.completed && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-1">{quest.title}</h3>
                    <p className="text-sm font-semibold text-brand-primary flex items-center gap-1">
                      +{quest.xp} XP
                    </p>
                  </div>

                  {!quest.locked && !quest.completed && (
                    <Link href={`/dashboard/academy/quest?id=${quest.id}`} className="px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm shrink-0">
                      Play Now
                    </Link>
                  )}
                  {quest.completed && (
                    <button disabled className="px-6 py-3 bg-bg-subtle text-text-muted text-sm font-bold rounded-xl border border-border-main shrink-0">
                      Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${xp >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-bg-subtle border-border-main opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${xp >= 50 ? 'bg-yellow-100' : 'bg-gray-200 grayscale'}`}>
                  🏅
                </div>
                <div>
                  <h4 className="font-bold text-sm">First Case Solved</h4>
                  <p className="text-[10px] text-text-muted">Earn 50 XP</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${xp >= 125 ? 'bg-yellow-50 border-yellow-200' : 'bg-bg-subtle border-border-main opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${xp >= 125 ? 'bg-yellow-100' : 'bg-gray-200 grayscale'}`}>
                  🛡️
                </div>
                <div>
                  <h4 className="font-bold text-sm">Citizen Defender</h4>
                  <p className="text-[10px] text-text-muted">Earn 125 XP</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${xp >= 300 ? 'bg-yellow-50 border-yellow-200' : 'bg-bg-subtle border-border-main opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${xp >= 300 ? 'bg-yellow-100' : 'bg-gray-200 grayscale'}`}>
                  👑
                </div>
                <div>
                  <h4 className="font-bold text-sm">Legal Master</h4>
                  <p className="text-[10px] text-text-muted">Earn 300 XP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-subtle border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-brand-primary" />
              Constitution Explorer
            </h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">Browse fundamental rights and duties in our interactive card explorer.</p>
            <button className="w-full px-4 py-2 bg-white text-text-main border border-border-main rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
              Coming Soon
            </button>
          </div>
        </div>

      </div>

    </main>
  );
}
