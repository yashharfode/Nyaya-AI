"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/routing";
import { 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle,
  Scale,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  BookOpen
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, increment, arrayUnion, getDoc, setDoc } from "firebase/firestore";

export default function QuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  // All 10 comprehensive Indian legal scenarios
  const scenarios: Record<string, any> = {
    "cyber-fraud": {
      title: "The Fake UPI Message",
      category: "Cyber Security",
      xp: 50,
      situation: "You receive a message saying your electricity bill is pending and your power will be cut tonight. It includes a link to pay immediately via UPI.",
      options: [
        { id: "A", text: "Click the link and pay immediately to avoid power cut." },
        { id: "B", text: "Ignore the message completely." },
        { id: "C", text: "Do not click, check official electricity app, and report the message to the Cyber Crime portal (1930)." }
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
    },
    "tenant-dispute": {
      title: "The Eviction Notice",
      category: "Property Law",
      xp: 100,
      situation: "Your landlord suddenly locks your residential apartment and demands you vacate within 24 hours over a minor argument regarding water charges.",
      options: [
        { id: "A", text: "Leave immediately and abandon your security deposit." },
        { id: "B", text: "Break the lock and stop paying monthly rent." },
        { id: "C", text: "Inform the landlord that 30-day formal written notice is mandatory and file an injunction complaint if harassed." }
      ],
      correctOption: "C",
      explanation: "A residential landlord cannot evict a tenant without a statutory formal written notice of at least 30 days under rent control laws. Cutting essential utilities or locking doors is illegal.",
      law: "Model Tenancy Act, 2021 & Section 106 of the Transfer of Property Act, 1882."
    },
    "consumer-refund": {
      title: "The Damaged Electronics Parcel",
      category: "Consumer Law",
      xp: 100,
      situation: "You order an expensive laptop online, but it arrives with a cracked screen. The seller customer care says 'No Cash Refund, only replacement is permitted.'",
      options: [
        { id: "A", text: "Accept a replacement even though you no longer trust the seller." },
        { id: "B", text: "Assert your statutory right to a full refund within 7 days under CPA 2019 and file on the National Consumer Helpline (1915)." },
        { id: "C", text: "Throw away the laptop and accept the loss." }
      ],
      correctOption: "B",
      explanation: "Under the Consumer Protection (E-Commerce) Rules, 2020, sellers cannot force mandatory replacement-only clauses when goods arrive damaged or defective. Consumers are entitled to a full monetary refund.",
      law: "Consumer Protection Act, 2019 & Consumer Protection (E-Commerce) Rules, 2020."
    },
    "workplace-harassment": {
      title: "Overtime Without Pay",
      category: "Labour Law",
      xp: 120,
      situation: "Your employer forces you to work 12 hours a day for 6 days a week without paying any statutory overtime wages.",
      options: [
        { id: "A", text: "Keep silent out of fear of losing your job." },
        { id: "B", text: "Demand double the normal wage rate for hours worked beyond statutory limits and file a complaint with the Labour Commissioner." },
        { id: "C", text: "Stop working in the middle of the day without notice." }
      ],
      correctOption: "B",
      explanation: "Under Indian labour statutes, any work exceeding 48 hours per week or 9 hours per day must be compensated at twice the ordinary rate of wages.",
      law: "Section 59 of the Factories Act, 1948 & Code on Wages, 2019."
    },
    "police-fir": {
      title: "Police Refusal to File FIR",
      category: "Criminal Law",
      xp: 150,
      situation: "You visit a police station to report a cognizable offence (like snatching or burglary), but the duty officer refuses to register an FIR saying 'it happened outside our area.'",
      options: [
        { id: "A", text: "Insist on filing a 'Zero FIR' which any police station is legally bound to register regardless of jurisdiction." },
        { id: "B", text: "Go back home and give up on reporting the crime." },
        { id: "C", text: "Pay a bribe to get the FIR registered." }
      ],
      correctOption: "A",
      explanation: "Police cannot refuse to register an FIR for a cognizable offence on territorial grounds. They must register a 'Zero FIR' and transfer it to the concerned police station.",
      law: "Section 173 of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 / Section 154 CrPC & Lalita Kumari Supreme Court guidelines."
    },
    "airline-delay": {
      title: "Flight Cancellation Compensation",
      category: "Aviation Rights",
      xp: 120,
      situation: "Your domestic flight is cancelled by the airline 2 hours before departure without any prior notice. The airline only offers a voucher for future travel.",
      options: [
        { id: "A", text: "Accept the travel voucher silently." },
        { id: "B", text: "Demand either an alternate flight or a full cash refund plus statutory DGCA compensation of up to Rs. 10,000." },
        { id: "C", text: "Argue with airport security staff." }
      ],
      correctOption: "B",
      explanation: "Under DGCA Civil Aviation Requirements (CAR), if an airline cancels a flight without informing passengers at least 24 hours prior, passengers are entitled to full refund plus financial compensation.",
      law: "DGCA Civil Aviation Requirements (CAR) Section 3, Series M, Part IV."
    },
    "rti-application": {
      title: "Government Hospital Records Query",
      category: "RTI & Transparency",
      xp: 100,
      situation: "A government hospital refuses to disclose details of medicine procurement funds and patient waiting lists, claiming it is 'confidential hospital data.'",
      options: [
        { id: "A", text: "File a Right to Information (RTI) application with the Public Information Officer (PIO) with a Rs. 10 fee." },
        { id: "B", text: "Accept the verbal refusal." },
        { id: "C", text: "Protest inside the hospital wards." }
      ],
      correctOption: "A",
      explanation: "Public procurement and hospital administrative data are public records under the RTI Act. Any citizen can inspect records and obtain certified copies within 30 days.",
      law: "Right to Information (RTI) Act, 2005 (Sections 3 & 6)."
    },
    "women-safety": {
      title: "Maternity Leave Denial",
      category: "Women Rights",
      xp: 150,
      situation: "A female employee on an 11-month contract is denied maternity leave by HR, who claims maternity benefits apply only to permanent employees.",
      options: [
        { id: "A", text: "Resign from the company." },
        { id: "B", text: "Cite the Maternity Benefit Act which grants 26 weeks paid leave to contractual, ad-hoc, and permanent women workers alike." },
        { id: "C", text: "Take unpaid medical leave." }
      ],
      correctOption: "B",
      explanation: "The Supreme Court and High Courts have repeatedly held that contractual and daily wage female employees are entitled to full 26 weeks paid maternity leave under the Act.",
      law: "Maternity Benefit Act, 1961 & Bombay/Delhi High Court rulings."
    },
    "loan-harassment": {
      title: "Recovery Agent Threat at Midnight",
      category: "Banking & RBI Rules",
      xp: 125,
      situation: "A bank debt recovery agent calls your phone at 11:30 PM, uses abusive language, and threatens to visit your office to humiliate you over a delayed EMI.",
      options: [
        { id: "A", text: "Switch off your phone and stop answering all calls." },
        { id: "B", text: "Record the call, remind them of RBI rules prohibiting calls outside 8 AM – 7 PM, and lodge a formal complaint on the RBI Ombudsman portal." },
        { id: "C", text: "Pay the agent in cash immediately without a receipt." }
      ],
      correctOption: "B",
      explanation: "The Reserve Bank of India strictly prohibits recovery agents from calling before 8 AM or after 7 PM, using abusive language, or contacting family members/employers.",
      law: "RBI Fair Practices Code for Lenders & RBI Guidelines on Managing Risks in Outsourcing (2022)."
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
      setXpEarned(true);
      if (auth.currentUser && questId) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            const completed = data.completedQuests || [];
            
            if (!completed.includes(questId)) {
              await updateDoc(userRef, {
                xp: increment(currentQuest.xp),
                completedQuests: arrayUnion(questId)
              });
            }
          } else {
            await setDoc(userRef, {
              xp: currentQuest.xp,
              completedQuests: [questId]
            }, { merge: true });
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
      <div className="flex items-center gap-2 text-sm text-text-muted font-bold">
        <Link href="/dashboard/academy" className="hover:text-black">Academy</Link>
        <ChevronRight size={14} />
        <span className="text-text-main">{currentQuest.title}</span>
      </div>

      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 border-b-2 border-black pb-5">
          <div className="flex items-center gap-3">
            <span className="bg-black text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {currentQuest.category}
            </span>
            <span className="bg-yellow-100 text-yellow-900 border border-yellow-300 px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star size={14} fill="currentColor" className="text-yellow-600" /> +{currentQuest.xp} XP Reward
            </span>
          </div>
          <Link 
            href="/dashboard/academy" 
            className="text-xs font-bold text-text-muted hover:text-black transition-colors"
          >
            Back to All Quests
          </Link>
        </div>

        {/* Situation */}
        <div className="mb-10">
          <p className="text-xs font-black uppercase tracking-wider text-brand-primary mb-2 flex items-center gap-1.5">
            <BookOpen size={15} />
            LEGAL SCENARIO BRIEF:
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-text-main leading-tight mb-3">
            {currentQuest.situation}
          </h2>
          <p className="text-text-muted font-bold text-sm">
            What is the legally correct action to take under Indian Law?
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-10">
          {currentQuest.options.map((option: any) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.id === currentQuest.correctOption;
            
            let bgClass = "bg-white hover:bg-bg-subtle border-2 border-border-main";
            let icon = null;

            if (showResult) {
              if (isCorrect) {
                bgClass = "bg-green-50 border-2 border-green-600 text-green-950 shadow-sm";
                icon = <CheckCircle2 size={24} className="text-green-600 shrink-0" />;
              } else if (isSelected && !isCorrect) {
                bgClass = "bg-red-50 border-2 border-red-600 text-red-950 opacity-80";
                icon = <XCircle size={24} className="text-red-600 shrink-0" />;
              } else {
                bgClass = "bg-white border-2 border-border-main opacity-40";
              }
            } else if (isSelected) {
              bgClass = "bg-bg-subtle border-2 border-black";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={showResult}
                className={`w-full text-left p-5 sm:p-6 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 ${bgClass}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0 border-2 ${
                    showResult && isCorrect 
                      ? 'border-green-600 bg-green-100 text-green-900' 
                      : 'border-black bg-white text-black'
                  }`}>
                    {option.id}
                  </div>
                  <span className="font-extrabold text-base sm:text-lg text-text-main leading-snug">{option.text}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Result & Explanation */}
        {showResult && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className={`p-6 sm:p-7 rounded-3xl border-2 mb-6 ${
              selectedOption === currentQuest.correctOption 
                ? 'bg-green-50/80 border-green-700' 
                : 'bg-red-50/80 border-red-700'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h3 className={`text-xl font-black flex items-center gap-2 ${
                  selectedOption === currentQuest.correctOption ? 'text-green-900' : 'text-red-900'
                }`}>
                  {selectedOption === currentQuest.correctOption ? "✅ Correct Citizen Action!" : "❌ Incorrect Action"}
                </h3>
                {xpEarned && (
                  <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <Trophy size={14} /> +{currentQuest.xp} XP AWARDED TO YOUR PROFILE!
                  </span>
                )}
              </div>

              <p className="text-text-main font-bold text-sm sm:text-base leading-relaxed mb-5">
                {currentQuest.explanation}
              </p>
              
              <div className="bg-white p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 border-2 border-black shadow-2xs">
                <Scale size={22} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-text-muted mb-1">
                    APPLICABLE INDIAN STATUTE & LAW
                  </h4>
                  <p className="text-sm font-black text-indigo-950 leading-snug">{currentQuest.law}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link 
                href="/dashboard/academy" 
                className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md"
              >
                Continue to Legal Academy <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
