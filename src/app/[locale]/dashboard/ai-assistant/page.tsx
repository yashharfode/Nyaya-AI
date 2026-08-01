"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  ChevronRight, CheckCircle2, Download, Share2, Pencil,
  ShoppingCart, ShieldAlert, Clock, Bot, Lightbulb,
  ArrowRight, ShieldCheck, PhoneCall, Star, Loader2,
  FileText, CheckSquare, Landmark, Scale, Plus, Send, MessageSquare, Trash2,
  Zap, Brain, ChevronDown, ChevronUp, AlertTriangle, Menu, X, History, Copy, Check, Mic, MicOff
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { chatWithAiAction, correctSpeechSpellingAction } from "@/actions/ai";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";

function FormattedLegalText({ text, isUser }: { text: string; isUser?: boolean }) {
  if (!text) return null;

  const formatInline = (str: string) => {
    const parts = str.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, index) => {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary underline hover:opacity-80 font-bold break-all"
          >
            {linkMatch[1]}
          </a>
        );
      }
      if (part.startsWith("***") && part.endsWith("***")) {
        return <strong key={index} className={`font-black italic ${isUser ? "text-white" : "text-black"}`}>{part.slice(3, -3)}</strong>;
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className={`font-black ${isUser ? "text-white" : "text-black"}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={index} className="italic font-semibold">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={index} className="bg-bg-subtle border border-border-main px-1.5 py-0.5 rounded text-xs font-mono font-bold text-indigo-900">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // Normalize string so headings, tables, disclaimers, and lists start on fresh lines even if collapsed
  const normalizedText = text
    .replace(/\|\s+\|/g, "|\n|")
    .replace(/\s*(###\s+)/g, "\n$1")
    .replace(/\s*(##\s+)/g, "\n$1")
    .replace(/\s*(#\s+)/g, "\n$1")
    .replace(/\s*(\*\*\*Disclaimer)/i, "\n$1")
    .replace(/\s*(\*\*Disclaimer)/i, "\n$1")
    .replace(/\s*(\*\s+\*\*)/g, "\n$1")
    .replace(/\s*(-\s+\*\*)/g, "\n$1")
    .replace(/\s*(\d+\.\s+\*\*)/g, "\n$1");

  const lines = normalizedText.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // Horizontal Rule (---, ***, ___)
    if (/^[-*_]{3,}$/.test(line)) {
      blocks.push(<hr key={i} className="my-5 border-t-2 border-black/20" />);
      i++;
      continue;
    }

    // Disclaimer Callout
    if (line.includes("Disclaimer:") || line.startsWith("***Disclaimer") || line.startsWith("> [!") || line.startsWith("> ⚠️") || line.startsWith("> Disclaimer")) {
      const cleanDisclaimer = line
        .replace(/^\**Disclaimer:\**\s*/i, "")
        .replace(/^> \[!.*?\]\s*/, "")
        .replace(/^> ⚠️\s*/, "")
        .replace(/^>\s*/, "")
        .replace(/\*\*\*$/, "")
        .trim();
      blocks.push(
        <div key={i} className="bg-amber-50 border-2 border-amber-600 rounded-2xl p-4 my-4 flex items-start gap-3.5 shadow-sm text-amber-950">
          <AlertTriangle size={20} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">LEGAL ADVISORY & DISCLAIMER</p>
            <p className="text-xs sm:text-sm font-bold leading-relaxed">{formatInline(cleanDisclaimer || line)}</p>
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const cleanQuote = line.replace(/^>\s*/, "").trim();
      if (cleanQuote) {
        blocks.push(
          <blockquote key={i} className="border-l-4 border-black pl-4 py-2 my-3 bg-bg-subtle/70 rounded-r-xl italic font-semibold text-text-main">
            {formatInline(cleanQuote)}
          </blockquote>
        );
      }
      i++;
      continue;
    }

    // Markdown Table (| ... |)
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      const parseRow = (rowStr: string) => 
        rowStr.split("|").map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

      if (tableLines.length >= 2) {
        const headers = parseRow(tableLines[0]);
        const rows = tableLines
          .slice(1)
          .filter(r => !r.includes("---"))
          .map(parseRow);

        blocks.push(
          <div key={`table-${i}`} className="overflow-x-auto my-4 border-2 border-black rounded-2xl shadow-xs bg-white text-black">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-black text-white">
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="py-3 px-4 font-black uppercase tracking-wider border-b-2 border-black">
                      {formatInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main bg-white">
                {rows.map((r, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white hover:bg-bg-subtle/50" : "bg-bg-subtle/30 hover:bg-bg-subtle/80"}>
                    {r.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 font-bold text-text-main border-r last:border-r-0 border-border-main">
                        {formatInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Robust Headings (# to ######) - Skip vacant/empty headings
    if (/^#{1,6}\s+/.test(line)) {
      const cleanHeading = line.replace(/^#{1,6}\s+/, "").trim();
      if (!cleanHeading) {
        i++;
        continue;
      }
      const levelMatch = line.match(/^#+/);
      const level = levelMatch ? levelMatch[0].length : 1;

      if (level === 1) {
        blocks.push(
          <h2 key={i} className="text-xl sm:text-2xl font-black text-black mt-7 mb-4 pb-2 border-b-2 border-black">
            {formatInline(cleanHeading)}
          </h2>
        );
      } else if (level === 2) {
        blocks.push(
          <h3 key={i} className="text-lg sm:text-xl font-black text-black mt-6 mb-3 pb-2 border-b-2 border-black">
            {formatInline(cleanHeading)}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={i} className="text-base sm:text-lg font-black text-black mt-5 mb-2.5 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-black shadow-2xs">
            {formatInline(cleanHeading)}
          </h4>
        );
      }
      i++;
      continue;
    }

    // Lists (*, -, +, 1., 2.) - Skip vacant/empty bullet points
    if (/^[\*\-\+]\s+/.test(line)) {
      const cleanBullet = line.replace(/^[\*\-\+]\s+/, "").trim();
      if (!cleanBullet) {
        i++;
        continue;
      }
      blocks.push(
        <div key={i} className="flex items-start gap-2.5 my-1.5 ml-2">
          <span className={`${isUser ? "text-white" : "text-black"} font-black text-base leading-none mt-0.5`}>●</span>
          <p className="text-sm font-bold leading-relaxed flex-1">
            {formatInline(cleanBullet)}
          </p>
        </div>
      );
      i++;
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const match = line.match(/^(\d+)\.\s+(.*)/);
      const numberText = match ? match[1] : "•";
      const cleanText = match ? match[2].trim() : line;
      if (!cleanText) {
        i++;
        continue;
      }
      blocks.push(
        <div key={i} className="flex items-start gap-2.5 my-2 ml-1">
          <span className="bg-black text-white px-2 py-0.5 rounded-md text-xs font-black shrink-0 mt-0.5">
            {numberText}
          </span>
          <p className="text-sm font-bold leading-relaxed flex-1">
            {formatInline(cleanText)}
          </p>
        </div>
      );
      i++;
      continue;
    }

    // Default paragraph
    blocks.push(
      <p key={i} className="text-sm font-bold leading-relaxed my-2">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{blocks}</div>;
}

export default function CaseAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  
  // Chat History State
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const currentChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);
  
  // Active Chat State
  const activeChat = chats.find(c => c.id === currentChatId) || null;
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const [isPolishingSpelling, setIsPolishingSpelling] = useState(false);
  const [autoCorrectSpelling, setAutoCorrectSpelling] = useState(true);

  const {
    isRecording: isVoiceRecording,
    interimText: voiceInterim,
    toggleRecording: toggleVoice,
  } = useVoiceRecording({
    lang: voiceLang,
    onTranscript: async (chunk) => {
      const updatedText = (inputText ? inputText.trim() + " " : "") + chunk;
      setInputText(updatedText);
      if (autoCorrectSpelling && updatedText.trim().length > 3) {
        setIsPolishingSpelling(true);
        try {
          const res = await correctSpeechSpellingAction(updatedText);
          if (res.success && res.text) {
            setInputText(res.text);
          }
        } catch (e) {
          // fallback to raw speech
        } finally {
          setIsPolishingSpelling(false);
        }
      }
    },
  });

  const handleCorrectSpelling = async () => {
    if (!inputText.trim() || isPolishingSpelling) return;
    setIsPolishingSpelling(true);
    try {
      const res = await correctSpeechSpellingAction(inputText);
      if (res.success && res.text) {
        setInputText(res.text);
      }
    } catch (err) {
      console.error("Spelling polish error:", err);
    } finally {
      setIsPolishingSpelling(false);
    }
  };
  
  // OpenRouter Model & Reasoning State
  const [selectedModel, setSelectedModel] = useState<string>("inclusionai/ling-3.0-flash:free");
  const [enableReasoning, setEnableReasoning] = useState<boolean>(true);
  const [openReasoningMsg, setOpenReasoningMsg] = useState<Record<number, boolean>>({});

  const toggleReasoningMsg = (index: number) => {
    setOpenReasoningMsg(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const [copiedMsgIdx, setCopiedMsgIdx] = useState<number | null>(null);

  const handleCopyText = async (content: any, idx: number) => {
    const textToCopy = typeof content === "object" ? (content?.name || content?.explanation || JSON.stringify(content, null, 2)) : String(content || "");
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedMsgIdx(idx);
      setTimeout(() => setCopiedMsgIdx(null), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  // Smart Analysis Animation State
  const [revealStep, setRevealStep] = useState(7); 
  const printRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return () => unsub();
  }, []);

  // Check sessionStorage once when user loads (from Customize with AI button on Resources page)
  useEffect(() => {
    if (!user) return;
    const data = sessionStorage.getItem("nyaya_ai_analysis");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        sessionStorage.removeItem("nyaya_ai_analysis");
        
        addDoc(collection(db, `users/${user.uid}/ai_chats`), {
          title: parsed.category || "Smart Analysis",
          createdAt: serverTimestamp(),
          analysisData: parsed,
          isNewAnalysis: true,
          messages: []
        }).then(docRef => {
          setCurrentChatId(docRef.id);
        });
      } catch (e) {
        console.error("Failed to parse analysis data", e);
        sessionStorage.removeItem("nyaya_ai_analysis");
      }
    }
  }, [user]);

  // 2. Fetch Chat History
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/ai_chats`), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(chatList);
      
      // If no chat is currently selected, select the most recent one
      if (!currentChatIdRef.current && chatList.length > 0) {
        setCurrentChatId(chatList[0].id);
      }
    }, (error) => {
      console.error("Firestore error:", error);
    });
    return () => unsub();
  }, [user]); 

  // 3. Animation Effect for New Analysis
  useEffect(() => {
    if (activeChat && activeChat.isNewAnalysis) {
      setRevealStep(0);
      const timers = [
        setTimeout(() => setRevealStep(1), 500),
        setTimeout(() => setRevealStep(2), 1500),
        setTimeout(() => setRevealStep(3), 2500),
        setTimeout(() => setRevealStep(4), 3500),
        setTimeout(() => setRevealStep(5), 4500),
        setTimeout(() => setRevealStep(6), 6000),
        setTimeout(() => setRevealStep(7), 7500),
      ];
      return () => timers.forEach(clearTimeout);
    } else if (activeChat) {
      setRevealStep(7);
    }
  }, [activeChat?.id, activeChat?.isNewAnalysis]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleNewChat = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, `users/${user.uid}/ai_chats`), {
      title: "New Conversation",
      createdAt: serverTimestamp(),
      messages: []
    });
    setCurrentChatId(docRef.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !currentChatId) return;
    
    // eslint-disable-next-line react-hooks/purity
    const userMessage = { role: "user", content: inputText, timestamp: Date.now() };
    setInputText("");
    setIsSending(true);

    try {
      const chatRef = doc(db, `users/${user.uid}/ai_chats`, currentChatId);
      
      const updates: Record<string, unknown> = {
        messages: arrayUnion(userMessage),
        isNewAnalysis: false
      };
      
      if (activeChat?.title === "New Conversation" && activeChat.messages?.length === 0) {
         updates.title = inputText.substring(0, 30) + "...";
      }
      
      await updateDoc(chatRef, updates);

      // Call Real AI with Model Choice and Reasoning
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const history: any[] = ((activeChat?.messages as any[]) || []).map((m: any) => ({ 
        role: m.role, 
        content: typeof m.content === 'object' ? JSON.stringify(m.content) : m.content,
        reasoning_details: m.reasoning_details || undefined
      }));
      
      // If there is an analysisData, inject it as context
      if (activeChat?.analysisData) {
        history.unshift({ 
          role: "user", 
          content: `Here is the context of my legal issue: ${JSON.stringify(activeChat.analysisData)}` 
        });
      }
      
      history.push({ role: "user", content: inputText });
      
      const res = await chatWithAiAction(history, selectedModel, enableReasoning);
      
      if (res.success && res.text) {
        const aiMessage = { 
          role: "ai", 
          content: res.text,
          reasoning: res.reasoning || null,
          reasoning_details: res.reasoning_details || null,
          modelUsed: res.modelUsed || selectedModel,
          // eslint-disable-next-line react-hooks/purity
          timestamp: Date.now() 
        };
        await updateDoc(chatRef, {
          messages: arrayUnion(aiMessage)
        });
      } else {
        const aiMessage = { 
          role: "ai", 
          content: "Sorry, I am having trouble connecting to the AI network right now. Please check your OPENROUTER_API_KEY or try again later.",
          // eslint-disable-next-line react-hooks/purity
          timestamp: Date.now() 
        };
        await updateDoc(chatRef, {
          messages: arrayUnion(aiMessage)
        });
      }
      
      setIsSending(false);

    } catch (err) {
      console.error(err);
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!activeChat) return;
    const analysis = activeChat.analysisData || {};
    const title = activeChat.title || "Legal Case Analysis";
    const category = analysis.category || "General Dispute";
    const severity = analysis.severity || "Medium";
    const summary = typeof analysis.originalIssue === "string" ? analysis.originalIssue : (analysis.originalIssue?.explanation || "");
    const authority = analysis.recommendedAuthority || "Appropriate Legal Forum";

    const text = `*⚖ NyayaAI Case Analysis Report*\n\n` +
      `*Title:* ${title}\n` +
      `*Category:* ${category}\n` +
      `*Severity:* ${severity}\n` +
      `*Recommended Forum:* ${authority}\n\n` +
      `*Incident Summary:*\n${summary}\n\n` +
      `_Generated via NyayaAI - AI Legal Operating System_`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const renderSmartAnalysis = (analysis: any) => {
    if (!analysis) return null;
    const renderItemText = (item: any) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      if (typeof item === "object") {
        return item.name || item.title || item.explanation || item.description || JSON.stringify(item);
      }
      return String(item);
    };
    return (
      <div className="space-y-6 mb-8 w-full max-w-4xl mx-auto print:max-w-full">
         <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm print:shadow-none print:border-b">
            <h3 className="font-bold text-text-main text-lg flex items-center gap-2 mb-3">
              <FileText size={20} className="text-brand-primary" />
              Incident Summary
            </h3>
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
              {renderItemText(analysis.originalIssue)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
            <div className={`bg-white border border-border-main rounded-2xl p-5 shadow-sm flex flex-col transition-all duration-700 ${revealStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-bg-subtle rounded-xl flex items-center justify-center">
                  <ShoppingCart size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-semibold">Case Category</p>
                  <p className="font-bold text-text-main">{renderItemText(analysis.category || "General Dispute")}</p>
                </div>
              </div>
            </div>

            <div className={`bg-white border border-border-main rounded-2xl p-5 shadow-sm flex flex-col transition-all duration-700 ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-bg-subtle rounded-xl flex items-center justify-center">
                  <ShieldAlert size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-semibold">Severity Assessment</p>
                  <p className="font-bold text-text-main">{renderItemText(analysis.severity || "Medium")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Analysis Card (Loopholes & Important Points) */}
          {(analysis.documentAnalysis || analysis.attachedDocumentName) && (
            <div className={`bg-white border-2 border-black rounded-2xl p-6 shadow-sm transition-all duration-700 ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-border-main">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-brand-primary" />
                  <h3 className="font-bold text-text-main text-base">
                    Document Evaluation: {renderItemText(analysis.documentAnalysis?.title || analysis.attachedDocumentName || "Attached Contract/Agreement")}
                  </h3>
                </div>
                {analysis.documentAnalysis?.riskLevel && (
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase self-start sm:self-auto ${
                    String(analysis.documentAnalysis.riskLevel).toLowerCase().includes("high")
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : String(analysis.documentAnalysis.riskLevel).toLowerCase().includes("moderate")
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-green-100 text-green-800 border border-green-300"
                  }`}>
                    {renderItemText(analysis.documentAnalysis.riskLevel)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loopholes & Red Flags */}
                <div className="bg-red-50/70 border border-red-200 rounded-xl p-4">
                  <h4 className="font-bold text-red-900 text-sm flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-red-600 shrink-0" />
                    Identified Loopholes & Red Flags
                  </h4>
                  <ul className="space-y-2.5">
                    {(Array.isArray(analysis.documentAnalysis?.loopholes) && analysis.documentAnalysis.loopholes.length > 0) ? (
                      analysis.documentAnalysis.loopholes.map((item: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-semibold text-red-950 leading-relaxed">
                          <span className="text-red-600 font-black shrink-0">•</span>
                          <span>{renderItemText(item)}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2 text-xs font-semibold text-red-950 leading-relaxed">
                          <span className="text-red-600 font-black shrink-0">•</span>
                          <span>Unilateral termination clause without mutual notice or severance compensation.</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs font-semibold text-red-950 leading-relaxed">
                          <span className="text-red-600 font-black shrink-0">•</span>
                          <span>Overly restrictive non-compete terms that may violate Section 27 of the Indian Contract Act.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Important Points & Key Clauses */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                    Important Points & Favorable Rights
                  </h4>
                  <ul className="space-y-2.5">
                    {(Array.isArray(analysis.documentAnalysis?.importantPoints) && analysis.documentAnalysis.importantPoints.length > 0) ? (
                      analysis.documentAnalysis.importantPoints.map((item: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-semibold text-blue-950 leading-relaxed">
                          <span className="text-blue-600 font-black shrink-0">•</span>
                          <span>{renderItemText(item)}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2 text-xs font-semibold text-blue-950 leading-relaxed">
                          <span className="text-blue-600 font-black shrink-0">•</span>
                          <span>Statutory protection applies regarding payment timelines and provident fund rules.</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs font-semibold text-blue-950 leading-relaxed">
                          <span className="text-blue-600 font-black shrink-0">•</span>
                          <span>Arbitration and dispute resolution venue must comply with territorial jurisdiction of your workplace.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {analysis.applicableRights && Array.isArray(analysis.applicableRights) && (
            <div className={`bg-white border border-border-main rounded-2xl p-6 shadow-sm transition-all duration-700 ${revealStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="font-bold text-text-main text-base flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-green-600" />
                Applicable Legal Rights & Acts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.applicableRights.map((right: any, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-bg-subtle border border-border-main">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-text-main">{renderItemText(right)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.evidenceChecklist && Array.isArray(analysis.evidenceChecklist) && (
            <div className={`bg-white border border-border-main rounded-2xl p-6 shadow-sm transition-all duration-700 ${revealStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="font-bold text-text-main text-base flex items-center gap-2 mb-4">
                <CheckSquare size={18} className="text-amber-600" />
                Required Evidence Checklist
              </h3>
              <div className="space-y-2">
                {analysis.evidenceChecklist.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg-subtle border border-border-main">
                    <div className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                    <span className="text-sm text-text-main font-medium">{renderItemText(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
            <div className={`bg-white border border-border-main rounded-2xl p-5 shadow-sm transition-all duration-700 ${revealStep >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="font-bold text-text-main text-sm flex items-center gap-2 mb-2">
                <Landmark size={16} className="text-indigo-600" />
                Recommended Forum
              </h3>
              <p className="text-sm text-text-muted">{renderItemText(analysis.recommendedAuthority || "Appropriate Civil/Consumer Court")}</p>
            </div>

            <div className={`bg-white border border-border-main rounded-2xl p-5 shadow-sm transition-all duration-700 ${revealStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="font-bold text-text-main text-sm flex items-center gap-2 mb-2">
                <Clock size={16} className="text-blue-600" />
                Estimated Timeline
              </h3>
              <p className="text-sm text-text-muted">{renderItemText(analysis.resolutionTime || "30 - 90 Days")}</p>
            </div>
          </div>

          {analysis.complaintDraft && (
            <div className={`bg-white border border-border-main rounded-2xl p-6 shadow-sm transition-all duration-700 ${revealStep >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-text-main text-base flex items-center gap-2">
                  <Scale size={18} className="text-brand-primary" />
                  Generated Complaint Draft
                </h3>
                <button
                  onClick={() => handleCopyText(renderItemText(analysis.complaintDraft), -1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-sm"
                  title="Copy complaint draft"
                >
                  {copiedMsgIdx === -1 ? (
                    <>
                      <Check size={14} className="text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-bg-subtle/30 border border-border-main rounded-xl p-5 font-mono text-sm leading-relaxed text-text-main max-h-[400px] overflow-y-auto print:max-h-none print:border-0 print:bg-transparent print:p-0">
                <FormattedLegalText text={renderItemText(analysis.complaintDraft)} />
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex gap-6 overflow-hidden print:h-auto print:block">
      
      {/* Sidebar - History (Desktop) */}
      <div className="hidden lg:flex w-72 shrink-0 flex-col bg-white border-2 border-border-main rounded-3xl overflow-hidden print:hidden shadow-xs">
        <div className="p-4 border-b-2 border-border-main">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-black py-3.5 rounded-2xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            New Conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-black text-text-muted uppercase tracking-wider mb-4 px-2">Recent Chats</p>
          {chats.length === 0 && (
            <p className="text-sm text-text-muted px-2">No history yet.</p>
          )}
          {chats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl transition-colors ${
                currentChatId === chat.id ? "bg-bg-subtle font-black text-text-main border-2 border-black shadow-2xs" : "text-text-muted hover:bg-gray-50 font-bold"
              }`}
            >
              <MessageSquare size={16} className={currentChatId === chat.id ? "text-black shrink-0" : "shrink-0"} />
              <span className="truncate text-sm flex-1">{typeof chat.title === 'object' ? (chat.title?.name || chat.title?.title || JSON.stringify(chat.title)) : chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setShowMobileSidebar(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl z-10">
            <div className="p-4 border-b-2 border-black flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <History size={18} className="text-black" />
                <span className="font-black text-base text-black">Conversation History</span>
              </div>
              <button 
                onClick={() => setShowMobileSidebar(false)}
                className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-text-main hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 border-b border-border-main">
              <button 
                onClick={() => {
                  handleNewChat();
                  setShowMobileSidebar(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-black text-white font-black py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Plus size={18} />
                New Conversation
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <p className="text-xs font-black text-text-muted uppercase tracking-wider mb-2 px-2">Recent Chats</p>
              {chats.length === 0 && (
                <p className="text-sm text-text-muted px-2">No history yet.</p>
              )}
              {chats.map(chat => (
                <button 
                  key={chat.id}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl transition-colors ${
                    currentChatId === chat.id ? "bg-bg-subtle font-black text-text-main border-2 border-black" : "text-text-muted hover:bg-gray-50 font-bold"
                  }`}
                >
                  <MessageSquare size={16} className={currentChatId === chat.id ? "text-black shrink-0" : "shrink-0"} />
                  <span className="truncate text-sm flex-1">{typeof chat.title === 'object' ? (chat.title?.name || chat.title?.title || JSON.stringify(chat.title)) : chat.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white border-2 border-border-main rounded-3xl overflow-hidden relative shadow-xs">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-border-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white z-10 shrink-0 print:hidden">
          <div className="flex items-center justify-between w-full sm:w-auto">
             <div className="flex items-center gap-3">
               <button
                 onClick={() => setShowMobileSidebar(true)}
                 className="lg:hidden w-10 h-10 rounded-xl bg-bg-subtle border border-border-main flex items-center justify-center text-text-main hover:bg-gray-200 shrink-0 shadow-2xs"
                 title="View Conversation History"
               >
                 <Menu size={20} />
               </button>
               <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Bot size={20} />
               </div>
               <div>
                  <h2 className="font-extrabold text-text-main text-base sm:text-lg">NyayaAI Legal Assistant</h2>
                  <p className="text-xs text-text-muted font-semibold">Powered by OpenRouter AI • Reasoning OS</p>
               </div>
             </div>

             <button
               onClick={handleNewChat}
               className="lg:hidden flex items-center gap-1.5 bg-black text-white px-3 py-2 rounded-xl text-xs font-bold shrink-0 shadow-sm"
             >
               <Plus size={14} />
               New Chat
             </button>
          </div>

          {/* OpenRouter Model Selector & Reasoning Toggle */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-bg-subtle border border-border-main rounded-xl px-3 py-1.5 text-xs font-bold text-text-main shadow-sm">
              <Zap size={14} className="text-amber-500 shrink-0" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent outline-none font-bold text-text-main cursor-pointer pr-1"
                title="Select OpenRouter model for fast reasoning"
              >
                <option value="inclusionai/ling-3.0-flash:free">⚡ ling-3.0-flash (Fast + Reasoning)</option>
                <option value="google/gemma-4-26b-a4b-it:free">🌐 gemma-4-26b-it</option>
                <option value="meta-llama/llama-3.3-70b-instruct:free">🦙 llama-3.3-70b-instruct</option>
                <option value="deepseek/deepseek-r1:free">🧠 deepseek-r1 (Deep Reasoning)</option>
              </select>
            </div>

            <button
              onClick={() => setEnableReasoning(!enableReasoning)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                enableReasoning
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-text-muted border-border-main hover:bg-bg-subtle"
              }`}
              title="Enable step-by-step reasoning tokens from OpenRouter"
            >
              <Brain size={14} className={enableReasoning ? "text-green-400" : "text-text-muted"} />
              <span>Reasoning: {enableReasoning ? "ON" : "OFF"}</span>
            </button>

            <button 
              onClick={handleShareWhatsApp} 
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#1ebd5b] transition-colors shadow-sm"
              title="Share report via WhatsApp"
            >
              <Share2 size={14} />
              WhatsApp
            </button>

            <button onClick={handlePrint} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-text-main text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 print:p-0" ref={printRef}>
          
          {!activeChat ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-bg-subtle rounded-2xl flex items-center justify-center mb-6 border border-border-main shadow-sm">
                <Bot size={32} className="text-text-main" />
              </div>
              <h2 className="text-2xl font-bold mb-2">How can I help you?</h2>
              <p className="text-text-muted mb-8 leading-relaxed">Start a new conversation or select a previous Smart Analysis to continue your legal journey.</p>
              <button 
                onClick={() => router.push("/dashboard/describe-issue")}
                className="bg-black text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-md hover:scale-105"
              >
                Generate New Smart Analysis <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <>
              {activeChat.analysisData && renderSmartAnalysis(activeChat.analysisData)}
              
              {((activeChat.messages as any[]) || []).map((msg: any, idx: number) => (
                <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} print:flex-row print:mb-4`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === "user" ? "bg-black text-white" : "bg-brand-primary text-white"
                  }`}>
                    {msg.role === "user" ? user?.displayName?.charAt(0) || "U" : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[88%] rounded-2xl p-5 text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-black text-white rounded-tr-sm" 
                      : "bg-bg-subtle text-text-main rounded-tl-sm border-2 border-border-main shadow-xs"
                  } print:bg-white print:border print:border-gray-300 print:text-black print:max-w-full`}>
                    
                    {/* Copy Button for AI response */}
                    {msg.role !== "user" && (
                      <div className="flex items-center justify-end mb-3 pb-2 border-b border-border-main">
                        <button
                          onClick={() => handleCopyText(msg.content, idx)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-black text-white hover:bg-gray-800 rounded-lg text-xs font-bold shadow-2xs transition-all"
                          title="Copy message to clipboard"
                        >
                          {copiedMsgIdx === idx ? (
                            <>
                              <Check size={13} className="text-green-400" />
                              <span className="text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Expandable Step-by-Step Reasoning Token Box */}
                    {msg.reasoning && msg.role !== "user" && (
                      <div className="mb-4 border-2 border-black rounded-xl overflow-hidden bg-white shadow-xs">
                        <button
                          onClick={() => toggleReasoningMsg(idx)}
                          className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-text-main hover:bg-bg-subtle transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Brain size={14} className="text-green-600" />
                            <span>Model&apos;s Step-by-Step Reasoning Process</span>
                            <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border">
                              {msg.modelUsed || "inclusionai/ling-3.0-flash"}
                            </span>
                          </span>
                          {openReasoningMsg[idx] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {openReasoningMsg[idx] && (
                          <div className="p-3 border-t-2 border-black text-xs text-text-muted font-mono whitespace-pre-wrap leading-relaxed bg-[#F8FAFC]">
                            {msg.reasoning}
                          </div>
                        )}
                      </div>
                    )}

                    {typeof msg.content === 'object' ? (
                      <FormattedLegalText text={msg.content?.name || msg.content?.explanation || JSON.stringify(msg.content)} isUser={msg.role === "user"} />
                    ) : (
                      <FormattedLegalText text={String(msg.content || "")} isUser={msg.role === "user"} />
                    )}
                  </div>
                </div>
              ))}
              
              {isSending && (
                <div className="flex gap-4 flex-row">
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} />
                  </div>
                  <div className="bg-bg-subtle text-text-main rounded-2xl rounded-tl-sm border border-border-main p-4 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-brand-primary" />
                    <span className="text-sm font-semibold">
                      Reasoning with {selectedModel.split("/")[1]?.replace(":free", "") || "ling-3.0-flash"}...
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}

        </div>

        {/* Chat Input */}
        {activeChat && (
          <div className="p-3 sm:p-4 border-t-2 border-border-main bg-white shrink-0 print:hidden shadow-lg">
            {isVoiceRecording && (
              <div className="flex items-center justify-between bg-red-50 border-2 border-red-400 text-red-900 px-4 py-2 rounded-xl mb-2.5 shadow-xs animate-pulse max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                  <span className="text-xs sm:text-sm font-bold truncate">
                    Listening to microphone... {voiceInterim ? `"${voiceInterim}"` : "Speak your question now"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleVoice}
                  className="text-red-700 underline text-xs font-black hover:opacity-80 shrink-0 ml-2"
                >
                  Stop
                </button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask a legal question (Reasoning: ${enableReasoning ? "ON" : "OFF"} • ${selectedModel.split("/")[1]?.replace(":free", "")})...`}
                className="w-full bg-white border-2 border-black/80 rounded-2xl pl-5 pr-44 sm:pr-56 py-4 focus:outline-none focus:ring-4 focus:ring-black/10 focus:border-black text-sm font-semibold text-text-main placeholder:text-text-light shadow-sm transition-all"
                disabled={isSending}
              />
              {inputText.trim() && (
                <button
                  type="button"
                  onClick={handleCorrectSpelling}
                  disabled={isPolishingSpelling || isSending}
                  className="absolute right-28 sm:right-32 top-2 bottom-2 px-2.5 flex items-center gap-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 rounded-xl text-[10px] sm:text-xs font-extrabold transition-all shadow-sm shrink-0"
                  title="Correct spelling for English and Hinglish speech"
                >
                  {isPolishingSpelling ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <span className="text-sm">✨</span>
                  )}
                  <span className="hidden sm:inline">Correct Spelling</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setVoiceLang(prev => prev === "en-IN" ? "hi-IN" : "en-IN")}
                className="absolute right-14 sm:right-16 top-2 bottom-2 px-2 flex items-center justify-center bg-bg-subtle hover:bg-gray-200 border border-border-main rounded-xl text-[10px] font-black tracking-tight text-text-main transition-all shadow-sm shrink-0"
                title="Switch voice recognition between English/Hinglish and Hindi"
              >
                {voiceLang === "en-IN" ? "EN/Hinglish" : "हिंदी"}
              </button>
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isSending}
                className={`absolute right-12 sm:right-14 top-2 bottom-2 aspect-square flex items-center justify-center rounded-xl transition-all shadow-sm ${
                  isVoiceRecording
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-bg-subtle text-text-main hover:bg-gray-200 border border-border-main"
                }`}
                title={isVoiceRecording ? "Stop microphone recording" : "Record question with microphone"}
              >
                {isVoiceRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button 
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 transition-all shadow-sm"
                title="Send legal inquiry to NyayaAI"
              >
                {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2.5 text-[10px] sm:text-xs font-semibold text-text-muted">
              <span>Model: <strong className="text-black font-extrabold">{selectedModel.split("/")[1]?.replace(":free", "") || "ling-3.0-flash"}</strong></span>
              <span>•</span>
              <span>Reasoning: <strong className={enableReasoning ? "text-green-700 font-extrabold" : "text-text-main"}>{enableReasoning ? "Enabled" : "Disabled"}</strong></span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setAutoCorrectSpelling(prev => !prev)}
                className="flex items-center gap-1 hover:text-black transition-colors"
                title="Toggle automatic spelling correction for spoken Hinglish & English"
              >
                <span>Voice Auto Spell-Check:</span>
                <strong className={autoCorrectSpelling ? "text-brand-primary font-extrabold" : "text-text-light"}>
                  {autoCorrectSpelling ? "ON (EN/Hinglish)" : "OFF"}
                </strong>
              </button>
              <span>•</span>
              <span className="text-text-light">NyayaAI can make mistakes. Verify with an advocate.</span>
            </div>
          </div>
        )}

      </div>

      {/* --- PROFESSIONAL PRINT LAYOUT --- */}
      <div className="hidden print:block font-serif text-black max-w-4xl mx-auto p-8 bg-white">
         <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-1">NyayaAI</h1>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">Official Legal Analysis Report</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p suppressHydrationWarning><strong>Date:</strong> {new Date().toLocaleDateString("en-GB")}</p>
            <p><strong>Ref:</strong> NYA-X7V2M9</p>
          </div>
        </div>
        {/* Note: The Smart Analysis + Chat Messages are rendered in the main flow and will be printed because of `ref={printRef}`. */}
      </div>

    </main>
  );
}
