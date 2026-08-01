"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle,
  Scale,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, increment, arrayUnion, getDoc, setDoc } from "firebase/firestore";

export default function QuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  // Hardcoded scenarios for the hackathon demo
  const scenarios: Record<string, any> = {
    "cyber-fraud": {
      title: "The Fake UPI Message",
      category: "Cyber Security",
      xp: 50,
      situation: "You receive a message saying your electricity bill is pending and your power will be cut tonight. It includes a link to pay immediately via UPI.",
      options: [
        { id: "A", text: "Click the link and pay immediately to avoid power cut." },
        { id: "B", text: "Ignore the message completely." },
        { id: "C", text: "Do not click, check official electricity app, and report the message to Cyber Crime portal." }
      ],
      correctOption: "C",
      explanation: "Scammers create urgency (power cut) to force you into clicking malicious links. Official authorities never send unverified payment links via SMS.",
      law: "Section 66D of the Information Technology Act, 2000 (Punishment for cheating by personation by using computer resource)."
    },
    "traffic-stop": {
      title: "Traffic Police Stop",
      category: "Citizen Rights",
      xp: 75,
      situation: "You are stopped by a traffic police officer for a routine check. The officer demands to take your phone and car keys immediately.",
      options: [
        { id: "A", text: "Refuse to give your keys and argue loudly." },
        { id: "B", text: "Politely decline giving the keys, show digital documents via DigiLocker, and record if harassed." },
        { id: "C", text: "Hand over the keys and phone immediately to avoid trouble." }
      ],
      correctOption: "B",
      explanation: "Under the Motor Vehicles Act, traffic police cannot seize your keys or phone without a valid warrant or formal seizure memo. You are legally allowed to present documents via DigiLocker or mParivahan.",
      law: "Motor Vehicles (Amendment) Act, 2019 and IT Act, 2000 (Validity of Electronic Records)."
    }
  };

  const currentQuest = questId ? scenarios[questId] : null;

  if (!currentQuest) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Quest not found</h2>
        <Link href="/dashboard/academy" className="text-brand-primary underline">Return to Academy</Link>
      </main>
    );
  }

  const handleSelect = async (id: string) => {
    if (showResult) return;
    setSelectedOption(id);
    setShowResult(true);

    if (id === currentQuest.correctOption) {
      if (auth.currentUser && questId) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            const completed = data.completedQuests || [];
            
            // Only award XP if they haven't completed this quest before
            if (!completed.includes(questId)) {
              await updateDoc(userRef, {
                xp: increment(currentQuest.xp),
                completedQuests: arrayUnion(questId)
              });
              setXpEarned(true);
            }
          }
        } catch (error) {
          console.error("Failed to update XP:", error);
        }
      }
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6 font-sans">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted font-semibold">
        <Link href="/dashboard/academy" className="hover:text-text-main">Academy</Link>
        <ChevronRight size={14} />
        <span className="text-text-main">{currentQuest.title}</span>
      </div>

      <div className="bg-white border border-border-main rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {currentQuest.category}
          </span>
          <span className="text-brand-primary font-bold text-sm flex items-center gap-1">
            <Star size={16} fill="currentColor" /> {currentQuest.xp} XP
          </span>
        </div>

        {/* Situation */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-text-main leading-tight mb-4">
            {currentQuest.situation}
          </h2>
          <p className="text-text-muted font-medium">What is the legally correct action to take?</p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-12">
          {currentQuest.options.map((option: any) => {
            
            const isSelected = selectedOption === option.id;
            const isCorrect = option.id === currentQuest.correctOption;
            
            let bgClass = "bg-white hover:bg-bg-subtle border-border-main";
            let icon = null;

            if (showResult) {
              if (isCorrect) {
                bgClass = "bg-green-50 border-green-500 text-green-900";
                icon = <CheckCircle2 size={24} className="text-green-600" />;
              } else if (isSelected && !isCorrect) {
                bgClass = "bg-red-50 border-red-500 text-red-900 opacity-70";
                icon = <XCircle size={24} className="text-red-600" />;
              } else {
                bgClass = "bg-white border-border-main opacity-40";
              }
            } else if (isSelected) {
              bgClass = "bg-bg-subtle border-brand-primary";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={showResult}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between gap-4 ${bgClass}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 ${showResult && isCorrect ? 'border-green-500 bg-green-100' : 'border-text-light'}`}>
                    {option.id}
                  </div>
                  <span className="font-semibold text-lg">{option.text}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Result & Explanation */}
        {showResult && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className={`p-6 rounded-2xl border-2 mb-6 ${selectedOption === currentQuest.correctOption ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${selectedOption === currentQuest.correctOption ? 'text-green-800' : 'text-red-800'}`}>
                {selectedOption === currentQuest.correctOption ? "Correct Action!" : "Incorrect Action"}
                {xpEarned && (
                  <span className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 animate-bounce">
                    <Star size={16} fill="currentColor" /> +{currentQuest.xp} XP Earned!
                  </span>
                )}
              </h3>
              <p className="text-gray-800 font-medium leading-relaxed mb-4">
                {currentQuest.explanation}
              </p>
              
              <div className="bg-white/60 p-4 rounded-xl flex items-start gap-3 border border-black/5">
                <Scale size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Applicable Law</h4>
                  <p className="text-sm font-bold text-indigo-900">{currentQuest.law}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/dashboard/academy" className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
                Continue to Academy <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
