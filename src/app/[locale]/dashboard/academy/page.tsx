"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { 
  GraduationCap, 
  Gamepad2, 
  Trophy, 
  Star,
  ShieldAlert,
  Car,
  Home,
  CheckCircle2,
  Lock,
  Loader2,
  Briefcase,
  ShoppingBag,
  FileText,
  Users,
  Scale
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
      description: "Scammers are targeting you via SMS. Make the right call.",
      xp: 50,
      difficulty: "Beginner",
      difficultyColor: "bg-green-100 text-green-700",
      icon: <ShieldAlert size={24} className="text-red-600" />,
      iconBg: "bg-red-50 border-red-100",
      completed: completedQuests.includes("cyber-fraud"),
      locked: false,
    },
    {
      id: "traffic-stop",
      title: "Traffic Police Stop",
      category: "Citizen Rights",
      description: "Know your rights when stopped by a traffic officer.",
      xp: 75,
      difficulty: "Beginner",
      difficultyColor: "bg-green-100 text-green-700",
      icon: <Car size={24} className="text-amber-600" />,
      iconBg: "bg-amber-50 border-amber-100",
      completed: completedQuests.includes("traffic-stop"),
      locked: !completedQuests.includes("cyber-fraud"),
    },
    {
      id: "tenant-dispute",
      title: "The Eviction Notice",
      category: "Property Law",
      description: "Your landlord leaves an illegal eviction notice. What do you do?",
      xp: 100,
      difficulty: "Intermediate",
      difficultyColor: "bg-amber-100 text-amber-700",
      icon: <Home size={24} className="text-blue-600" />,
      iconBg: "bg-blue-50 border-blue-100",
      completed: completedQuests.includes("tenant-dispute"),
      locked: !completedQuests.includes("traffic-stop"),
    },
    {
      id: "workplace-harassment",
      title: "Silent Harassment at Work",
      category: "Workplace Rights",
      description: "Understand POSH Act and protect yourself at the workplace.",
      xp: 125,
      difficulty: "Intermediate",
      difficultyColor: "bg-amber-100 text-amber-700",
      icon: <Briefcase size={24} className="text-purple-600" />,
      iconBg: "bg-purple-50 border-purple-100",
      completed: completedQuests.includes("workplace-harassment"),
      locked: !completedQuests.includes("tenant-dispute"),
    },
    {
      id: "consumer-fraud",
      title: "The Fake Product Scam",
      category: "Consumer Rights",
      description: "You received a counterfeit product. Fight back legally.",
      xp: 100,
      difficulty: "Intermediate",
      difficultyColor: "bg-amber-100 text-amber-700",
      icon: <ShoppingBag size={24} className="text-orange-600" />,
      iconBg: "bg-orange-50 border-orange-100",
      completed: completedQuests.includes("consumer-fraud"),
      locked: !completedQuests.includes("workplace-harassment"),
    },
    {
      id: "rti-filing",
      title: "The RTI Request",
      category: "Government Transparency",
      description: "A government office refuses information. Use RTI to fight back.",
      xp: 150,
      difficulty: "Advanced",
      difficultyColor: "bg-red-100 text-red-700",
      icon: <FileText size={24} className="text-teal-600" />,
      iconBg: "bg-teal-50 border-teal-100",
      completed: completedQuests.includes("rti-filing"),
      locked: !completedQuests.includes("consumer-fraud"),
    },
  ];

  const level = xp < 50 ? 1 : xp < 125 ? 2 : xp < 250 ? 3 : xp < 400 ? 4 : 5;
  const nextLevelXpThresholds = [50, 125, 250, 400, 600];
  const nextLevelXp = nextLevelXpThresholds[level - 1] || 600;
  const levelProgress = Math.min((xp / nextLevelXp) * 100, 100);

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
      <div className="bg-gradient-to-br from-indigo-900 to-black text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <GraduationCap size={200} />
        </div>
        <div className="relative z-10 flex items-start gap-6">
          <div className="w-20 h-20 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <Trophy size={36} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Legal Academy</h1>
            <p className="text-indigo-200 mb-3">Level {level} Legal Scholar — {completedQuests.length} quest{completedQuests.length !== 1 ? "s" : ""} completed</p>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <span className="text-xs text-indigo-200 font-semibold whitespace-nowrap">
                {xp} / {nextLevelXp} XP to Level {level + 1}
              </span>
            </div>
          </div>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center w-full md:w-auto min-w-[200px]">
          <p className="text-indigo-200 text-sm font-semibold mb-1 uppercase tracking-wider">Total XP</p>
          <div className="text-4xl font-extrabold flex items-center justify-center gap-2 text-yellow-400">
            {xp} <Star size={24} fill="currentColor" />
          </div>
          <p className="text-indigo-200 text-xs mt-2">Level {level} • Legal Scholar</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        
        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 size={24} className="text-text-main" />
              <h2 className="text-2xl font-bold text-text-main">Active Quests</h2>
            </div>
            <span className="text-sm font-semibold text-text-muted">{completedQuests.length}/{quests.length} Completed</span>
          </div>

          <div className="space-y-4">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`border rounded-2xl p-5 transition-all duration-300 ${
                  quest.locked
                    ? "bg-bg-subtle border-border-main opacity-60 cursor-not-allowed"
                    : quest.completed
                    ? "bg-green-50/50 border-green-200"
                    : "bg-white border-border-main hover:shadow-md hover:border-brand-primary/50 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                    quest.locked ? "bg-gray-100 border-gray-200" : quest.iconBg
                  }`}>
                    {quest.locked ? <Lock size={24} className="text-text-light" /> : quest.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-main px-2 py-0.5 rounded-full border border-border-main">
                        {quest.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${quest.difficultyColor}`}>
                        {quest.difficulty}
                      </span>
                      {quest.completed && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-text-main">{quest.title}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{quest.description}</p>
                    <p className="text-xs font-bold text-yellow-600 flex items-center gap-1 mt-1.5">
                      <Star size={12} fill="currentColor" /> +{quest.xp} XP
                    </p>
                  </div>

                  <div className="shrink-0">
                    {!quest.locked && !quest.completed && (
                      <Link
                        href={`/dashboard/academy/quest?id=${quest.id}`}
                        className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm block text-center whitespace-nowrap"
                      >
                        Play Now
                      </Link>
                    )}
                    {quest.completed && (
                      <div className="flex flex-col items-center gap-1">
                        <CheckCircle2 size={28} className="text-green-500" />
                        <span className="text-xs text-green-600 font-bold">Done</span>
                      </div>
                    )}
                    {quest.locked && (
                      <Lock size={20} className="text-text-light" />
                    )}
                  </div>
                </div>
                {quest.locked && (
                  <p className="text-[10px] text-text-muted mt-3 pl-[4.5rem] flex items-center gap-1">
                    <Lock size={10} /> Complete the previous quest to unlock
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-3">
              {[
                { emoji: "🏅", title: "First Case Solved", desc: "Earn 50 XP", threshold: 50 },
                { emoji: "🛡️", title: "Citizen Defender", desc: "Earn 125 XP", threshold: 125 },
                { emoji: "⚖️", title: "Rights Champion", desc: "Earn 250 XP", threshold: 250 },
                { emoji: "🎓", title: "Legal Scholar", desc: "Earn 400 XP", threshold: 400 },
                { emoji: "👑", title: "Legal Master", desc: "Earn 600 XP", threshold: 600 },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    xp >= badge.threshold ? "bg-yellow-50 border-yellow-200" : "bg-bg-subtle border-border-main opacity-40"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${xp >= badge.threshold ? "bg-yellow-100" : "bg-gray-200 grayscale"}`}>
                    {badge.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm">{badge.title}</h4>
                    <p className="text-[10px] text-text-muted">{badge.desc}</p>
                  </div>
                  {xp >= badge.threshold && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Community */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-2 flex items-center gap-2">
              <Users size={18} className="text-indigo-600" />
              Legal Community
            </h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">Join thousands of citizens learning their rights through real-life scenarios.</p>
            <div className="space-y-2">
              {[
                { name: "Priya S.", xp: 425, rank: 1, isYou: false },
                { name: "Raj M.", xp: 375, rank: 2, isYou: false },
                { name: "You", xp, rank: "—", isYou: true },
              ].map((entry) => (
                <div
                  key={entry.name}
                  className={`flex items-center gap-3 p-2 rounded-xl ${entry.isYou ? "bg-indigo-600 text-white" : "bg-white/60"}`}
                >
                  <span className={`text-xs font-black w-5 text-center ${entry.isYou ? "text-indigo-200" : "text-text-muted"}`}>#{entry.rank}</span>
                  <span className={`text-sm font-bold flex-1 ${entry.isYou ? "text-white" : "text-text-main"}`}>{entry.name}</span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${entry.isYou ? "text-yellow-300" : "text-yellow-600"}`}>
                    <Star size={12} fill="currentColor" /> {entry.xp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-subtle border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-2 flex items-center gap-2">
              <Scale size={18} className="text-brand-primary" />
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
