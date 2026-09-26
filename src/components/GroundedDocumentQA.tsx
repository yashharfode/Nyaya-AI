"use client";

import React, { useState } from "react";
import { 
  Send, 
  Loader2, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Quote, 
  Sparkles, 
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { 
  askDocumentQuestionAction, 
  GroundedAnswer 
} from "@/actions/document-intelligence";

interface GroundedDocumentQAProps {
  documentText: string;
  documentTitle: string;
}

interface QAPair {
  id: string;
  question: string;
  result: GroundedAnswer;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  "What is my mandatory notice period to terminate this agreement?",
  "What happens to my security deposit or pending salary upon exit?",
  "Who is responsible for maintenance, damages, or legal liabilities?",
  "Are there any restrictive covenants, penalties, or non-compete clauses?"
];

export default function GroundedDocumentQA({
  documentText,
  documentTitle
}: GroundedDocumentQAProps) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [qaList, setQaList] = useState<QAPair[]>([]);

  const handleAsk = async (qToAsk?: string) => {
    const targetQuestion = (qToAsk || question).trim();
    if (!targetQuestion || !documentText.trim() || isAsking) return;

    setIsAsking(true);
    if (!qToAsk) setQuestion("");

    try {
      const history = qaList.flatMap(item => [
        { role: "user" as const, content: item.question },
        { role: "assistant" as const, content: item.result.answer }
      ]);

      const res = await askDocumentQuestionAction(documentText, targetQuestion, history);

      if (res.success && res.data) {
        const newPair: QAPair = {
          id: Date.now().toString(),
          question: targetQuestion,
          result: res.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setQaList(prev => [newPair, ...prev]);
      } else {
        alert(res.error || "Failed to get grounded answer from document.");
      }
    } catch (err: any) {
      console.error("QA error:", err);
      alert("Error querying document. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    if (confidence === "High") {
      return (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
          <CheckCircle2 size={12} /> High Grounding (Verified in Text)
        </span>
      );
    }
    if (confidence === "Moderate") {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
          <AlertCircle size={12} /> Moderate (Inferred from Context)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
        <AlertCircle size={12} /> Not Found in Document
      </span>
    );
  };

  return (
    <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-main pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-2">
            <Sparkles size={12} />
            <span>Document-Grounded Q&A</span>
          </div>
          <h3 className="text-xl font-black text-text-main tracking-tight flex items-center gap-2">
            <MessageSquare size={20} className="text-brand-primary" />
            <span>Ask Your Document</span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Interrogate <span className="font-bold text-black font-mono">&ldquo;{documentTitle}&rdquo;</span>. Answers are strictly grounded with exact clause citations and no legal guessing.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-bg-subtle px-3 py-1.5 rounded-xl border border-border-main text-[11px] font-bold text-text-muted shrink-0">
          <ShieldCheck size={14} className="text-green-600" />
          <span>Zero Hallucination Mode</span>
        </div>
      </div>

      {/* Suggested Starter Questions */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-text-muted flex items-center gap-1">
          <HelpCircle size={12} /> Suggested Questions For This Document:
        </span>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(sug)}
              disabled={isAsking}
              className="text-left text-xs font-semibold px-3.5 py-2 bg-bg-subtle hover:bg-black hover:text-white rounded-xl border border-border-main transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isAsking && question.trim()) {
              handleAsk();
            }
          }}
          disabled={isAsking}
          placeholder="Ask anything about this agreement (e.g. Can my landlord evict me in 48 hours?)"
          className="flex-1 px-4 py-3 bg-bg-subtle border border-border-main rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
        />
        <button
          type="button"
          onClick={() => handleAsk()}
          disabled={isAsking || !question.trim()}
          className="px-6 py-3 bg-black text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isAsking ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Verifying Clauses...</span>
            </>
          ) : (
            <>
              <span>Ask</span>
              <Send size={14} />
            </>
          )}
        </button>
      </div>

      {/* Q&A List */}
      {qaList.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border-main">
          <h4 className="text-xs font-black uppercase tracking-wider text-text-muted">
            Recent Grounded Inquiries ({qaList.length})
          </h4>

          <div className="space-y-4">
            {qaList.map((qa) => (
              <div
                key={qa.id}
                className="p-5 rounded-2xl border border-border-main bg-white hover:border-black transition-all shadow-xs space-y-3.5"
              >
                {/* User Question */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      Q
                    </span>
                    <h5 className="font-extrabold text-sm text-text-main leading-snug">
                      {qa.question}
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted shrink-0">
                    {qa.timestamp}
                  </span>
                </div>

                {/* Grounding Confidence Badge */}
                <div className="pl-8.5">
                  {getConfidenceBadge(qa.result.confidence)}
                </div>

                {/* Plain Answer */}
                <div className="pl-8.5 text-xs sm:text-sm font-semibold text-text-main leading-relaxed bg-bg-subtle p-3.5 rounded-xl border border-border-main/70">
                  {qa.result.answer}
                </div>

                {/* Verified Citations Box */}
                {qa.result.citations && qa.result.citations.length > 0 && (
                  <div className="pl-8.5 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-text-muted flex items-center gap-1">
                      <Quote size={12} className="text-brand-primary" /> Verified Source Citations From Document:
                    </span>
                    <div className="space-y-1.5">
                      {qa.result.citations.map((cite, cIdx) => (
                        <div
                          key={cIdx}
                          className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs space-y-1 text-blue-950"
                        >
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-900 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded">
                              {cite.clauseNumber}
                            </span>
                          </div>
                          <p className="font-mono text-[11px] italic text-blue-900 leading-relaxed">
                            &ldquo;{cite.exactSnippet}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contextual Follow-up Chips */}
                {qa.result.suggestedFollowUps && qa.result.suggestedFollowUps.length > 0 && (
                  <div className="pl-8.5 pt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-text-muted">Follow up:</span>
                    {qa.result.suggestedFollowUps.map((fu, fIdx) => (
                      <button
                        key={fIdx}
                        type="button"
                        onClick={() => handleAsk(fu)}
                        disabled={isAsking}
                        className="text-[11px] font-bold text-brand-primary hover:text-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{fu}</span>
                        <ArrowRight size={10} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
