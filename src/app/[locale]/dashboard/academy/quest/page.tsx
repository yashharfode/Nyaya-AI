"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ChevronRight, 
  Scale,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, increment, arrayUnion, getDoc } from "firebase/firestore";

type QuestOption = { id: string; text: string };
type QuestScenario = {
  title: string;
  category: string;
  xp: number;
  situation: string;
  options: QuestOption[];
  correctOption: string;
  explanation: string;
  law: string;
};

const scenarios: Record<string, QuestScenario> = {
  "cyber-fraud": {
    title: "The Fake UPI Message",
    category: "Cyber Security",
    xp: 50,
    situation: "You receive a message: 'Your electricity bill is pending. Power will be disconnected tonight. Pay now via this UPI link.' The link looks official. What do you do?",
    options: [
      { id: "A", text: "Click the link immediately and pay to avoid power cut." },
      { id: "B", text: "Ignore the message completely and do nothing." },
      { id: "C", text: "Do NOT click the link. Verify through the official electricity app, and report this to cybercrime.gov.in." }
    ],
    correctOption: "C",
    explanation: "This is a phishing scam. Scammers create urgency (power cut) to force you into clicking malicious links. Official authorities NEVER send unverified payment links via SMS. Always verify through official channels before paying.",
    law: "Section 66D of the IT Act, 2000 — Cheating by personation using computer resources, punishable with up to 3 years imprisonment."
  },
  "traffic-stop": {
    title: "Traffic Police Stop",
    category: "Citizen Rights",
    xp: 75,
    situation: "A traffic police officer stops you and immediately asks for your phone and car keys to verify your identity, implying he'll detain you if you don't comply. What do you do?",
    options: [
      { id: "A", text: "Refuse loudly and argue with the officer in public." },
      { id: "B", text: "Politely decline. Show driving license and RC via DigiLocker app. Note officer's badge number if harassed." },
      { id: "C", text: "Hand over your keys and phone immediately to avoid trouble." }
    ],
    correctOption: "B",
    explanation: "Traffic police CANNOT seize your car keys or personal phone without a formal seizure memo or court warrant. Digital documents on DigiLocker/mParivahan are legally valid. Politely asserting your rights is always correct — not compliance out of fear.",
    law: "Motor Vehicles (Amendment) Act, 2019 — Digital documents legally valid. Article 19(1)(a) — Right to record public officials on duty."
  },
  "tenant-dispute": {
    title: "The Eviction Notice",
    category: "Property Law",
    xp: 100,
    situation: "Your landlord slips a note: 'Vacate within 3 days or I'll change the locks and remove your belongings.' You have a valid 11-month rent agreement with 2 months remaining. What is the correct action?",
    options: [
      { id: "A", text: "Pack your belongings immediately and leave to avoid conflict." },
      { id: "B", text: "Confront the landlord aggressively and refuse to open the door." },
      { id: "C", text: "Do NOT vacate. Send a legal notice via lawyer. If forcibly evicted, file under IPC Section 441. Rent Control Act protects you against illegal eviction." }
    ],
    correctOption: "C",
    explanation: "A landlord CANNOT forcibly evict a tenant without a court order, even after lease expiry. Changing locks or removing belongings without a court order is a criminal offense of trespass. The Rent Control Act provides strong protection. Only a Rent Controller or Civil Court can order eviction.",
    law: "Rent Control Act (State-specific), IPC Section 441 (Criminal Trespass), Transfer of Property Act 1882 — Section 106 (Proper notice period required)."
  },
  "workplace-harassment": {
    title: "Silent Harassment at Work",
    category: "Workplace Rights",
    xp: 125,
    situation: "A senior colleague repeatedly makes uncomfortable comments about your appearance, messages you after hours, and hints that your promotion depends on 'being cooperative.' What is the correct legal course of action?",
    options: [
      { id: "A", text: "Ignore it and hope it stops. Avoid risking your job." },
      { id: "B", text: "Confront the colleague alone in private without witnesses." },
      { id: "C", text: "Document all incidents with dates and screenshots. Formally report to your company's Internal Complaints Committee (ICC) under the POSH Act." }
    ],
    correctOption: "C",
    explanation: "This constitutes Sexual Harassment under POSH Act 2013. Every organization with 10+ employees must have an ICC. Quid pro quo harassment (promotion for favors) is a serious criminal offense. You are legally protected from retaliation for filing a complaint. If no ICC exists, report to the Local Committee at District level.",
    law: "POSH Act 2013 — Section 3 (Prohibition), Section 4 (ICC Mandatory). IPC Section 354A — Sexual harassment, punishable up to 3 years."
  },
  "consumer-fraud": {
    title: "The Fake Product Scam",
    category: "Consumer Rights",
    xp: 100,
    situation: "You ordered a branded phone for ₹35,000 online. You received a cheap counterfeit. The seller ignores returns and the e-commerce platform says they cannot help. What do you do?",
    options: [
      { id: "A", text: "Accept the loss since you opened the package — it's your fault." },
      { id: "B", text: "File a bank chargeback without trying other legal remedies first." },
      { id: "C", text: "Document everything with photos/videos. File on National Consumer Helpline (1800-11-4000) and Consumer Court. Also report to cybercrime.gov.in as fraud." }
    ],
    correctOption: "C",
    explanation: "Selling counterfeit products is an offense under the Consumer Protection Act, 2019. You are entitled to a full refund, compensation, and legal costs. The e-commerce platform is also liable as a service provider. Consumer courts are affordable — no lawyer needed for cases under ₹50 lakhs — and cases are often resolved within 3-5 months.",
    law: "Consumer Protection Act, 2019 — Section 2(9) (Consumer Rights), Section 2(47) (Unfair Trade Practice). National Consumer Helpline: 1800-11-4000."
  },
  "rti-filing": {
    title: "The RTI Request",
    category: "Government Transparency",
    xp: 150,
    situation: "You applied for a government scheme 6 months ago with no update. An office clerk says the 'file is under process' and subtly hints at needing a payment to expedite. What is the legally correct approach?",
    options: [
      { id: "A", text: "Pay the unofficial fee to get your work done quickly." },
      { id: "B", text: "Give up and reapply after a few months." },
      { id: "C", text: "File an RTI application (₹10 fee) asking for your file status and responsible officer. Report the bribe demand to Anti-Corruption Bureau. If PIO doesn't respond in 30 days, file a First Appeal." }
    ],
    correctOption: "C",
    explanation: "RTI is one of the most powerful tools a citizen has. Government offices must respond within 30 days or face a ₹250/day penalty on the PIO. Demanding a bribe is a criminal offense under the Prevention of Corruption Act. RTI costs just ₹10 and is filed in writing or online at rtionline.gov.in.",
    law: "Right to Information Act, 2005 — Section 7 (30-day response mandate), Section 20 (Penalty ₹250/day on PIO). Prevention of Corruption Act, 1988 — demanding bribe punishable up to 7 years."
  }
};

export default function QuestPage() {
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
    if (showResult || isUpdating) return;
    setSelectedOption(id);
    setShowResult(true);

    if (auth.currentUser && questId) {
      setIsUpdating(true);
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const completed = userSnap.data().completedQuests || [];
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
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6 font-sans">
      
      <div className="flex items-center gap-2 text-sm text-text-muted font-semibold">
        <Link href="/dashboard/academy" className="hover:text-text-main">Academy</Link>
        <ChevronRight size={14} />
        <span className="text-text-main">{currentQuest.title}</span>
      </div>

      <div className="bg-white border border-border-main rounded-3xl p-8 md:p-12 shadow-sm">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {currentQuest.category}
            </span>
            <span className="text-yellow-600 font-bold text-sm flex items-center gap-1">
              <Star size={16} fill="currentColor" /> +{currentQuest.xp} XP
            </span>
          </div>
          {isUpdating && <Loader2 size={18} className="animate-spin text-text-muted" />}
        </div>

        <div className="mb-10 bg-bg-subtle/60 border border-border-main rounded-2xl p-6">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Scenario</p>
          <h2 className="text-xl font-bold text-text-main leading-relaxed">
            {currentQuest.situation}
          </h2>
          <p className="text-sm text-brand-primary font-bold mt-4">What is the legally correct action to take?</p>
        </div>

        <div className="space-y-4 mb-10">
          {currentQuest.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.id === currentQuest.correctOption;
            
            let bgClass = "bg-white hover:bg-bg-subtle border-border-main cursor-pointer";
            let icon = null;

            if (showResult) {
              if (isCorrect) {
                bgClass = "bg-green-50 border-green-400 cursor-default";
                icon = <CheckCircle2 size={22} className="text-green-600 shrink-0" />;
              } else if (isSelected && !isCorrect) {
                bgClass = "bg-red-50 border-red-400 opacity-80 cursor-default";
                icon = <XCircle size={22} className="text-red-600 shrink-0" />;
              } else {
                bgClass = "bg-white border-border-main opacity-40 cursor-default";
              }
            } else if (isSelected) {
              bgClass = "bg-bg-subtle border-brand-primary cursor-pointer";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={showResult}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between gap-4 ${bgClass}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0 border-2 ${
                    showResult && isCorrect ? 'border-green-500 bg-green-100 text-green-700' :
                    isSelected && !showResult ? 'border-brand-primary bg-brand-primary/10' :
                    'border-text-light bg-bg-subtle'
                  }`}>
                    {option.id}
                  </div>
                  <span className="font-semibold">{option.text}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-4">
            <div className={`p-6 rounded-2xl border-2 ${
              selectedOption === currentQuest.correctOption
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${
                  selectedOption === currentQuest.correctOption ? 'text-green-800' : 'text-red-800'
                }`}>
                  {selectedOption === currentQuest.correctOption
                    ? <><CheckCircle2 size={22} /> Correct! Well done.</>
                    : <><XCircle size={22} /> Not quite right.</>
                  }
                </h3>
                {xpEarned && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 animate-bounce">
                    <Star size={16} fill="currentColor" /> +{currentQuest.xp} XP Earned!
                  </span>
                )}
              </div>
              <p className="text-gray-800 font-medium leading-relaxed mb-4">{currentQuest.explanation}</p>
              <div className="bg-white/70 p-4 rounded-xl flex items-start gap-3 border border-black/5">
                <Scale size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Applicable Law</h4>
                  <p className="text-sm font-bold text-indigo-900">{currentQuest.law}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/dashboard/academy" className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
                Back to Academy <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
