"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bot, ArrowRight, ArrowLeft, CheckCircle, Loader2, AlertTriangle,
  FileText, Shield, Clock, BarChart2, MapPin, ChevronDown, ChevronUp,
  Download, Copy, Check, RotateCcw, Mic, MicOff, Zap, Target, Users,
  Lightbulb, AlertOctagon, Phone, Building2
} from "lucide-react";
import {
  LegalCategory,
  InterviewAnswer,
  LegalInterviewPlan,
  getInterviewQuestion,
  generateLegalActionPlan,
} from "@/actions/legal-interview";

const CATEGORIES: { id: LegalCategory; label: string; emoji: string; description: string }[] = [
  { id: "cyber_fraud", label: "Cyber Fraud", emoji: "🔐", description: "UPI scam, phishing, online fraud, blackmail" },
  { id: "landlord_tenant", label: "Landlord / Tenant", emoji: "🏠", description: "Deposit issue, illegal eviction, rent dispute" },
  { id: "consumer_complaint", label: "Consumer Complaint", emoji: "🛒", description: "Defective product, service failure, refund denied" },
  { id: "employment", label: "Employment Issue", emoji: "💼", description: "Salary unpaid, wrongful termination, harassment" },
  { id: "property_dispute", label: "Property Dispute", emoji: "🏗️", description: "Illegal encroachment, builder fraud, inheritance" },
  { id: "domestic_violence", label: "Domestic Violence", emoji: "🛡️", description: "Physical, emotional or financial abuse" },
  { id: "motor_accident", label: "Motor Accident", emoji: "🚗", description: "Road accident, insurance claim, FIR" },
  { id: "cheque_bounce", label: "Cheque Bounce", emoji: "📄", description: "Dishonoured cheque, recovery, Section 138" },
  { id: "other", label: "Other Issue", emoji: "⚖️", description: "Any other civil or criminal legal matter" },
];

const TOTAL_QUESTIONS = 8;

// Radial Progress Circle
function RadialProgress({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const strokeDash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} stroke="#E5E7EB" strokeWidth="6" fill="none" />
        <circle
          cx="36" cy="36" r={r}
          stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={`${strokeDash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>{value}%</text>
      </svg>
      <span className="text-xs font-bold text-text-muted text-center">{label}</span>
    </div>
  );
}

export default function LegalInterviewPage() {
  const router = useRouter();

  // Stage: "intro" | "category" | "description" | "interview" | "loading" | "result"
  const [stage, setStage] = useState<"intro" | "category" | "description" | "interview" | "loading" | "result">("intro");
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | null>(null);
  const [initialDescription, setInitialDescription] = useState("");
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [plan, setPlan] = useState<LegalInterviewPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string>("steps");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const answerRef = useRef<HTMLTextAreaElement>(null);

  // Progress animation during loading
  useEffect(() => {
    if (stage === "loading") {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 92) { clearInterval(interval); return 92; }
          return prev + Math.random() * 8;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Focus answer input when question changes
  useEffect(() => {
    if (stage === "interview" && answerRef.current) {
      setTimeout(() => answerRef.current?.focus(), 100);
    }
  }, [stage, currentQuestionIndex]);

  const handleStartCategory = async (cat: LegalCategory) => {
    setSelectedCategory(cat);
    setStage("description");
  };

  const handleStartInterview = async () => {
    if (!selectedCategory) return;
    const { question } = await getInterviewQuestion(selectedCategory, 0);
    setCurrentQuestion(question);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer("");
    setStage("interview");
  };

  const handleNextQuestion = async () => {
    if (!selectedCategory || !currentAnswer.trim()) return;

    const newAnswers = [...answers, { question: currentQuestion, answer: currentAnswer.trim() }];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= TOTAL_QUESTIONS) {
      // Generate plan
      setStage("loading");
      setLoadingProgress(5);
      const result = await generateLegalActionPlan(selectedCategory, newAnswers, initialDescription);
      setLoadingProgress(100);
      if (result.success && result.plan) {
        setPlan(result.plan);
        setStage("result");
      } else {
        setError(result.error || "Failed to generate plan");
        setStage("result");
      }
    } else {
      const { question } = await getInterviewQuestion(selectedCategory, nextIndex);
      setCurrentQuestion(question);
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleReset = () => {
    setStage("intro");
    setSelectedCategory(null);
    setInitialDescription("");
    setAnswers([]);
    setCurrentQuestion("");
    setCurrentQuestionIndex(0);
    setCurrentAnswer("");
    setPlan(null);
    setError(null);
  };

  const severityConfig = {
    low: { color: "text-green-700", bg: "bg-green-50 border-green-200", label: "Low Risk", icon: <CheckCircle size={16} className="text-green-600" /> },
    medium: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Medium Risk", icon: <AlertTriangle size={16} className="text-amber-600" /> },
    high: { color: "text-red-700", bg: "bg-red-50 border-red-200", label: "High Risk", icon: <AlertTriangle size={16} className="text-red-600" /> },
    emergency: { color: "text-red-800", bg: "bg-red-100 border-red-400", label: "EMERGENCY", icon: <AlertOctagon size={16} className="text-red-700" /> },
  };

  const catInfo = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">

      {/* ── INTRO STAGE ── */}
      {stage === "intro" && (
        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black text-white rounded-3xl shadow-lg mb-2">
            <Bot size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-text-main mb-3">AI Legal Interview</h1>
            <p className="text-text-muted font-semibold text-lg max-w-lg mx-auto">
              I act like a lawyer. I ask <strong className="text-text-main">8 targeted questions</strong>, then generate your complete legal action plan.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: <Target size={22} className="text-black" />, title: "Select Category", desc: "Choose your legal issue type" },
              { icon: <Bot size={22} className="text-black" />, title: "Answer 8 Questions", desc: "AI asks like a lawyer, step by step" },
              { icon: <FileText size={22} className="text-black" />, title: "Get Action Plan", desc: "Complaint draft, rights, timeline & score" },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border-2 border-border-main shadow-xs">
                <div className="w-10 h-10 bg-bg-subtle rounded-xl flex items-center justify-center mb-3">{step.icon}</div>
                <p className="font-black text-sm text-text-main">{step.title}</p>
                <p className="text-xs text-text-muted font-semibold mt-1">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-bg-subtle rounded-2xl p-5 border-2 border-border-main text-left space-y-2">
            <p className="text-xs font-black text-text-muted uppercase tracking-wider">What you will get after interview:</p>
            <div className="grid grid-cols-2 gap-2">
              {["✓ Complaint Draft Ready", "✓ Your Legal Rights", "✓ Evidence Checklist", "✓ Authority to Contact", "✓ Step-by-Step Timeline", "✓ Legal Readiness Score"].map(item => (
                <div key={item} className="text-sm font-bold text-text-main">{item}</div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStage("category")}
            className="inline-flex items-center gap-3 bg-black text-white font-black px-8 py-4 rounded-2xl text-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Bot size={22} />
            Start Legal Interview
            <ArrowRight size={22} />
          </button>
        </div>
      )}

      {/* ── CATEGORY STAGE ── */}
      {stage === "category" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setStage("intro")} className="w-9 h-9 rounded-xl border-2 border-border-main bg-white flex items-center justify-center hover:bg-bg-subtle">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-text-main">Select Your Issue</h2>
              <p className="text-text-muted text-sm font-semibold">AI will tailor questions based on your selection</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleStartCategory(cat.id)}
                className="group p-5 bg-white border-2 border-border-main rounded-2xl hover:border-black hover:shadow-md transition-all text-left flex items-start gap-4"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <div className="flex-1">
                  <p className="font-black text-text-main text-sm">{cat.label}</p>
                  <p className="text-xs text-text-muted font-semibold mt-0.5">{cat.description}</p>
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── DESCRIPTION STAGE ── */}
      {stage === "description" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setStage("category")} className="w-9 h-9 rounded-xl border-2 border-border-main bg-white flex items-center justify-center hover:bg-bg-subtle">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{catInfo?.emoji}</span>
                <h2 className="text-2xl font-black text-text-main">{catInfo?.label}</h2>
              </div>
              <p className="text-text-muted text-sm font-semibold">Briefly describe your situation (optional but recommended)</p>
            </div>
          </div>

          <div className="bg-white border-2 border-border-main rounded-3xl p-6 space-y-4">
            <label className="block text-sm font-black text-text-main">What happened? (In your own words)</label>
            <textarea
              value={initialDescription}
              onChange={e => setInitialDescription(e.target.value)}
              placeholder={`E.g. "My landlord is refusing to return my ₹50,000 security deposit even after I vacated the flat 2 months ago..."`}
              rows={4}
              className="w-full border-2 border-border-main rounded-2xl p-4 text-sm font-semibold text-text-main bg-bg-subtle focus:outline-none focus:border-black resize-none"
            />
            <p className="text-xs text-text-muted font-semibold">This helps AI understand context before asking questions. You can skip this.</p>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full flex items-center justify-center gap-3 bg-black text-white font-black py-4 rounded-2xl text-base hover:bg-gray-800 transition-all shadow-md"
          >
            <Bot size={20} />
            Begin Interview — AI will ask 8 questions
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* ── INTERVIEW STAGE ── */}
      {stage === "interview" && (
        <div className="space-y-6">
          {/* Progress header */}
          <div className="bg-white border-2 border-border-main rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="font-black text-sm text-text-main">NyayaAI Legal Interview</p>
                  <p className="text-[11px] text-text-muted font-semibold">{catInfo?.emoji} {catInfo?.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-text-main">{currentQuestionIndex + 1}<span className="text-base font-semibold text-text-muted">/{TOTAL_QUESTIONS}</span></p>
                <p className="text-[11px] text-text-muted font-semibold">Questions</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex) / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>

            {/* Previous answers mini-log */}
            {answers.length > 0 && (
              <div className="mt-4 space-y-1.5 max-h-32 overflow-y-auto">
                {answers.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle size={13} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-text-muted font-semibold truncate">{a.answer}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Question */}
          <div className="bg-black text-white rounded-3xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-white/60 mb-1">Question {currentQuestionIndex + 1}</p>
                <p className="text-base font-bold text-white leading-relaxed">{currentQuestion}</p>
              </div>
            </div>

            <textarea
              ref={answerRef}
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && currentAnswer.trim()) {
                  handleNextQuestion();
                }
              }}
              placeholder="Type your answer here..."
              rows={3}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-2xl p-4 text-sm font-semibold focus:outline-none focus:border-white/60 resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40 font-semibold">Ctrl + Enter to continue</span>
              <button
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className="flex items-center gap-2 bg-white text-black font-black px-5 py-2.5 rounded-xl hover:bg-gray-100 disabled:opacity-40 transition-all"
              >
                {currentQuestionIndex + 1 >= TOTAL_QUESTIONS ? (
                  <>Generate Plan <Zap size={16} /></>
                ) : (
                  <>Next <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>

          {/* Quick answers */}
          {currentQuestionIndex === 7 && (
            <div className="bg-bg-subtle border-2 border-border-main rounded-2xl p-4">
              <p className="text-xs font-black text-text-muted mb-2 uppercase tracking-wider">Quick City Options:</p>
              <div className="flex flex-wrap gap-2">
                {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"].map(city => (
                  <button
                    key={city}
                    onClick={() => setCurrentAnswer(city)}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-border-main rounded-lg hover:border-black transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LOADING STAGE ── */}
      {stage === "loading" && (
        <div className="text-center py-16 space-y-8">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-black rounded-3xl animate-pulse" />
            <div className="relative flex items-center justify-center h-full">
              <Bot size={40} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-main mb-2">Analyzing Your Case</h2>
            <p className="text-text-muted font-semibold">AI is preparing your complete legal action plan...</p>
          </div>
          <div className="max-w-sm mx-auto space-y-3">
            <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-sm font-bold text-text-muted">{Math.round(loadingProgress)}% — Drafting complaint letter...</p>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {["Identifying Rights", "Drafting Complaint", "Scoring Readiness"].map((step, i) => (
              <div key={i} className="bg-white border border-border-main rounded-xl p-3 text-center">
                <Loader2 size={16} className="animate-spin mx-auto mb-1 text-black" />
                <p className="text-[11px] font-bold text-text-muted">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULT STAGE ── */}
      {stage === "result" && (
        <div className="space-y-6">
          {/* Error state */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-red-800">Failed to generate plan</p>
                <p className="text-sm text-red-700 font-semibold mt-1">{error}</p>
                <button onClick={handleReset} className="mt-3 text-sm font-black text-black underline">Try Again</button>
              </div>
            </div>
          )}

          {plan && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-text-main">Legal Action Plan</h2>
                  <p className="text-text-muted text-sm font-semibold">{catInfo?.emoji} {catInfo?.label} · {answers.length} questions answered</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border-2 ${severityConfig[plan.severity].bg} ${severityConfig[plan.severity].color}`}>
                    {severityConfig[plan.severity].icon}
                    {severityConfig[plan.severity].label}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-black text-white rounded-3xl p-6">
                <p className="text-[11px] font-black uppercase tracking-wider text-white/60 mb-2">Case Summary</p>
                <p className="text-sm font-semibold leading-relaxed text-white/90">{plan.summary}</p>
              </div>

              {/* Readiness Score */}
              <div className="bg-white border-2 border-border-main rounded-3xl p-6">
                <p className="text-sm font-black text-text-main mb-5 flex items-center gap-2">
                  <BarChart2 size={18} />
                  Legal Readiness Score
                </p>
                <div className="flex flex-wrap justify-around gap-4">
                  <RadialProgress value={plan.readinessScore.complaint} label="Complaint" color="#000000" />
                  <RadialProgress value={plan.readinessScore.evidence} label="Evidence" color="#D97706" />
                  <RadialProgress value={plan.readinessScore.witnesses} label="Witnesses" color="#7C3AED" />
                  <RadialProgress value={plan.readinessScore.documents} label="Documents" color="#059669" />
                  <RadialProgress value={plan.readinessScore.overall} label="Overall Ready" color="#DC2626" />
                </div>
              </div>

              {/* Accordion Sections */}
              {[
                {
                  key: "steps",
                  icon: <Zap size={16} />,
                  title: "Immediate Action Steps",
                  content: (
                    <ol className="space-y-2">
                      {plan.immediateSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-semibold">
                          <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  )
                },
                {
                  key: "rights",
                  icon: <Shield size={16} />,
                  title: "Your Legal Rights",
                  content: (
                    <ul className="space-y-2">
                      {plan.rights.map((right, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-semibold">
                          <CheckCircle size={15} className="text-green-600 shrink-0 mt-0.5" />
                          {right}
                        </li>
                      ))}
                    </ul>
                  )
                },
                {
                  key: "evidence",
                  icon: <Target size={16} />,
                  title: "Evidence Checklist",
                  content: (
                    <ul className="space-y-2">
                      {plan.evidenceChecklist.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-semibold">
                          <input type="checkbox" className="rounded" readOnly />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )
                },
                {
                  key: "timeline",
                  icon: <Clock size={16} />,
                  title: "Action Timeline",
                  content: (
                    <div className="space-y-3">
                      {plan.timeline.map((t, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-28 shrink-0">
                            <span className="text-xs font-black bg-black text-white px-2 py-1 rounded-lg">{t.day}</span>
                          </div>
                          <p className="text-sm font-semibold text-text-main leading-relaxed">{t.action}</p>
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  key: "authority",
                  icon: <Building2 size={16} />,
                  title: "Authority to Contact",
                  content: (
                    <div className="bg-bg-subtle rounded-2xl p-4">
                      <p className="font-black text-text-main text-sm">{plan.authorityToContact}</p>
                    </div>
                  )
                },
                {
                  key: "complaint",
                  icon: <FileText size={16} />,
                  title: "Complaint Draft",
                  copyText: plan.complaintDraft,
                  content: (
                    <div className="relative">
                      <pre className="text-sm font-semibold text-text-main whitespace-pre-wrap leading-relaxed">{plan.complaintDraft}</pre>
                    </div>
                  )
                },
              ].map(section => (
                <div key={section.key} className="bg-white border-2 border-border-main rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenSection(openSection === section.key ? "" : section.key)}
                    className="w-full flex items-center justify-between p-5 hover:bg-bg-subtle transition-colors"
                  >
                    <span className="flex items-center gap-2 font-black text-sm text-text-main">
                      {section.icon}
                      {section.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {section.copyText && openSection === section.key && (
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleCopy(section.copyText!, section.key); }}
                          className="flex items-center gap-1 text-xs font-black px-2.5 py-1 bg-black text-white rounded-lg"
                        >
                          {copiedSection === section.key ? <Check size={12} /> : <Copy size={12} />}
                          {copiedSection === section.key ? "Copied!" : "Copy"}
                        </button>
                      )}
                      {openSection === section.key ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  {openSection === section.key && (
                    <div className="px-5 pb-5 border-t border-border-main pt-4">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}

              {/* Disclaimer */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                  <strong>Legal Disclaimer:</strong> This analysis is generated by AI and is for informational purposes only. It does not constitute legal advice. Please consult a qualified legal professional before taking action.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-black text-white font-black px-5 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Download size={16} />
                  Download / Print
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-white text-text-main font-black px-5 py-3 rounded-xl border-2 border-border-main hover:border-black transition-colors"
                >
                  <RotateCcw size={16} />
                  New Interview
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
