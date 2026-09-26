"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  ChevronRight, CheckCircle2, Download, Share2, Pencil,
  ShoppingCart, ShieldAlert, Clock, Bot, Lightbulb, Briefcase,
  ArrowRight, ShieldCheck, PhoneCall, Star, Loader2,
  FileText, CheckSquare, Landmark, Scale, Plus, Send, MessageSquare, Trash2,
  Zap, Brain, ChevronDown, ChevronUp, AlertTriangle, Menu, X, History, Copy, Check, Mic, MicOff, PanelLeftClose, PanelLeftOpen, Maximize2, Minimize2, Search
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, deleteDoc } from "firebase/firestore";
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
  const [autoCorrectSpelling, setAutoCorrectSpelling] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [emergencyDismissed, setEmergencyDismissed] = useState(false);

  // Emergency keyword detector — triggers Emergency Mode overlay
  const EMERGENCY_PATTERNS = [
    /private.{0,15}photo/i, /intimate.{0,15}video/i, /blackmail/i, /sextortion/i,
    /threatening me/i, /threatening to/i, /someone threaten/i,
    /suicide/i, /kill.{0,10}myself/i, /want to die/i,
    /domestic.{0,10}abuse/i, /beating me/i, /husband.{0,10}hit/i, /wife.{0,10}hit/i,
    /someone.{0,15}following/i, /being stalked/i, /stalking me/i,
    /kidnap/i, /abducted/i, /held captive/i,
    /robbery/i, /mugging/i, /at gunpoint/i,
    /child.{0,10}abuse/i, /molest/i,
  ];

  const checkEmergency = (text: string) => {
    if (emergencyDismissed) return false;
    return EMERGENCY_PATTERNS.some(p => p.test(text));
  };

  const {
    isRecording: isVoiceRecording,
    interimText: voiceInterim,
    toggleRecording: toggleVoice,
  } = useVoiceRecording({
    lang: "en-IN",
    onTranscript: async (chunk) => {
      const updatedText = (inputText ? inputText.trim() + " " : "") + chunk;
      setInputText(updatedText);
      if (autoCorrectSpelling && updatedText.trim().length > 3) {
        try {
          const res = await correctSpeechSpellingAction(updatedText);
          if (res.success && res.text) {
            setInputText(res.text);
          }
        } catch {
          // ignore error
        }
      }
    },
  });
  
  // OpenRouter Model & Reasoning State
  const [selectedModel, setSelectedModel] = useState<string>("inclusionai/ling-3.0-flash:free");
  const [enableReasoning, setEnableReasoning] = useState<boolean>(true);
  const [openReasoningMsg, setOpenReasoningMsg] = useState<Record<number, boolean>>({});
  const [showHistorySidebar, setShowHistorySidebar] = useState<boolean>(true);
  const [enableFollowUps, setEnableFollowUps] = useState<boolean>(true);
  const [chatSearchQuery, setChatSearchQuery] = useState<string>("");

  const formatChatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/ai_chats`, chatId));
      if (currentChatIdRef.current === chatId) {
        const remaining = chats.filter(c => c.id !== chatId);
        setCurrentChatId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const filteredChats = chats.filter(chat => {
    if (!chatSearchQuery.trim()) return true;
    const title = typeof chat.title === "object" 
      ? (chat.title?.name || chat.title?.title || JSON.stringify(chat.title)) 
      : String(chat.title || "");
    return title.toLowerCase().includes(chatSearchQuery.toLowerCase());
  });

  const getFollowUpQuestions = (content: any): string[] => {
    const text = typeof content === "object" ? JSON.stringify(content) : String(content || "");
    const lines = text.split("\n");
    const questionBullets = lines
      .filter(l => l.trim().startsWith("- [") && l.trim().endsWith("]"))
      .map(l => l.trim().slice(3, -1));
    if (questionBullets.length > 0) return questionBullets.slice(0, 3);

    const lower = text.toLowerCase();
    if (lower.includes("consumer") || lower.includes("refund")) {
      return [
        "What is the step-by-step procedure to file in Consumer Court?",
        "Can I claim compensation for mental harassment along with a refund?",
        "What documents and bills do I need as evidence?"
      ];
    } else if (lower.includes("tenant") || lower.includes("landlord") || lower.includes("rent")) {
      return [
        "What should I do if my landlord refuses to receive the legal notice?",
        "Can I deduct the security deposit from the last month's rent?",
        "How long does a rent authority dispute usually take?"
      ];
    } else if (lower.includes("cyber") || lower.includes("fraud") || lower.includes("hack") || lower.includes("police")) {
      return [
        "How do I track my complaint status on cybercrime.gov.in?",
        "Can I freeze the fraud bank transaction immediately?",
        "What is the punishment under the IT Act for this crime?"
      ];
    } else if (lower.includes("notice") || lower.includes("draft")) {
      return [
        "How many days should I give the opposite party to respond?",
        "Should I send the notice via Registered Post or Email?",
        "What happens if they do not reply to this legal notice?"
      ];
    } else {
      return [
        "What is the limitation period to file a case for this issue?",
        "What are the immediate legal steps I should take today?",
        "Can you draft a formal follow-up letter or email for this?"
      ];
    }
  };

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
      if (!usr) router.push("/login");
    });
    return () => unsub();
  }, [router]);

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
    
    // Check for emergency keywords before sending
    if (checkEmergency(inputText)) {
      setEmergencyMode(true);
    }

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
      <div className="space-y-4 mb-6 w-full max-w-6xl mx-auto print:max-w-full">
        {/* 1. Incident Summary */}
        <div className="bg-white border border-border-main rounded-2xl p-4 sm:p-5 shadow-xs print:shadow-none print:border-b">
          <h3 className="font-bold text-text-main text-sm sm:text-base flex items-center gap-2 mb-2">
            <FileText size={18} className="text-brand-primary shrink-0" />
            <span>Incident Summary</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
            {renderItemText(analysis.originalIssue)}
          </p>
        </div>

        {/* 2. Key Case Metrics (4-Column Overview) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Case Category */}
          <div className="bg-white border border-border-main rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
              <Briefcase size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] text-text-muted font-bold uppercase tracking-wider">Case Category</p>
              <p className="font-extrabold text-text-main text-xs sm:text-sm truncate" title={renderItemText(analysis.category || "General Dispute")}>
                {renderItemText(analysis.category || "General Dispute")}
              </p>
            </div>
          </div>

          {/* Severity Assessment */}
          <div className="bg-white border border-border-main rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 border border-red-100">
              <ShieldAlert size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] text-text-muted font-bold uppercase tracking-wider">Severity</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  String(analysis.severity).toLowerCase().includes("high") || String(analysis.severity).toLowerCase().includes("critical")
                    ? "bg-red-500"
                    : String(analysis.severity).toLowerCase().includes("low")
                    ? "bg-green-500"
                    : "bg-amber-500"
                }`} />
                <p className="font-extrabold text-text-main text-xs sm:text-sm truncate">
                  {renderItemText(analysis.severity || "Medium")}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Forum */}
          <div className="bg-white border border-border-main rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
              <Landmark size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] text-text-muted font-bold uppercase tracking-wider">Recommended Forum</p>
              <p className="font-extrabold text-text-main text-xs sm:text-sm truncate" title={renderItemText(analysis.recommendedAuthority || "Appropriate Civil Court")}>
                {renderItemText(analysis.recommendedAuthority || "Appropriate Civil Court")}
              </p>
            </div>
          </div>

          {/* Estimated Timeline */}
          <div className="bg-white border border-border-main rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
              <Clock size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] text-text-muted font-bold uppercase tracking-wider">Estimated Timeline</p>
              <p className="font-extrabold text-text-main text-xs sm:text-sm truncate" title={renderItemText(analysis.resolutionTime || "30 - 60 Days")}>
                {renderItemText(analysis.resolutionTime || "30 - 60 Days")}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Document Analysis Card (if document exists) */}
        {(analysis.documentAnalysis || analysis.attachedDocumentName) && (
          <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border-main">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-brand-primary shrink-0" />
                <h3 className="font-bold text-text-main text-sm sm:text-base">
                  Document Evaluation: {renderItemText(analysis.documentAnalysis?.title || analysis.attachedDocumentName || "Attached Contract/Agreement")}
                </h3>
              </div>
              {analysis.documentAnalysis?.riskLevel && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase self-start sm:self-auto ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-3.5 sm:p-4">
                <h4 className="font-bold text-red-900 text-xs sm:text-sm flex items-center gap-2 mb-2.5">
                  <AlertTriangle size={15} className="text-red-600 shrink-0" />
                  Identified Loopholes & Red Flags
                </h4>
                <ul className="space-y-2">
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

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 sm:p-4">
                <h4 className="font-bold text-blue-900 text-xs sm:text-sm flex items-center gap-2 mb-2.5">
                  <ShieldCheck size={15} className="text-blue-600 shrink-0" />
                  Important Points & Favorable Rights
                </h4>
                <ul className="space-y-2">
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

        {/* 4. Side-by-side: Applicable Legal Rights & Required Evidence Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Applicable Rights */}
          {analysis.applicableRights && Array.isArray(analysis.applicableRights) && (
            <div className="bg-white border border-border-main rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col">
              <h3 className="font-bold text-text-main text-sm sm:text-base flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-green-600 shrink-0" />
                <span>Applicable Legal Rights & Acts</span>
              </h3>
              <div className="space-y-2 flex-1">
                {analysis.applicableRights.map((right: any, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-bg-subtle border border-border-main">
                    <CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-text-main leading-relaxed">{renderItemText(right)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Evidence Checklist */}
          {analysis.evidenceChecklist && Array.isArray(analysis.evidenceChecklist) && (
            <div className="bg-white border border-border-main rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col">
              <h3 className="font-bold text-text-main text-sm sm:text-base flex items-center gap-2 mb-3">
                <CheckSquare size={16} className="text-amber-600 shrink-0" />
                <span>Required Evidence Checklist</span>
              </h3>
              <div className="space-y-2 flex-1">
                {analysis.evidenceChecklist.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-bg-subtle border border-border-main">
                    <div className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                    <span className="text-xs sm:text-sm text-text-main font-semibold leading-relaxed">{renderItemText(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Generated Complaint Draft */}
        {analysis.complaintDraft && (
          <div className="bg-white border border-border-main rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-border-main">
              <div className="flex items-center gap-2">
                <Scale size={16} className="text-brand-primary shrink-0" />
                <h3 className="font-bold text-text-main text-sm sm:text-base">
                  Generated Complaint Draft
                </h3>
              </div>
              <button
                onClick={() => handleCopyText(renderItemText(analysis.complaintDraft), -1)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-xs"
                title="Copy complaint draft"
              >
                {copiedMsgIdx === -1 ? (
                  <>
                    <Check size={13} className="text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-bg-subtle/40 border border-border-main rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-text-main print:border-0 print:bg-transparent print:p-0">
              <FormattedLegalText text={renderItemText(analysis.complaintDraft)} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex overflow-hidden p-2.5 sm:p-4 gap-3 sm:gap-4 print:h-auto print:block">
      
      {/* 🚨 EMERGENCY MODE OVERLAY */}
      {emergencyMode && (
        <div className="fixed inset-0 z-[100] bg-red-950/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Red Header */}
            <div className="bg-red-600 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🚨</span>
              </div>
              <h2 className="text-2xl font-black mb-1">EMERGENCY MODE ACTIVATED</h2>
              <p className="text-red-100 text-sm font-semibold">We detected a high-risk situation. Help is available.</p>
            </div>
            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Emergency Helplines */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-black text-red-800 uppercase tracking-wider mb-3">📞 Emergency Helplines — Call Now</p>
                {[
                  { label: "Police Emergency", number: "100", emoji: "🚔" },
                  { label: "Women Helpline", number: "1091", emoji: "👩" },
                  { label: "Cyber Crime", number: "1930", emoji: "🔐" },
                  { label: "National Emergency", number: "112", emoji: "🆘" },
                  { label: "Child Helpline", number: "1098", emoji: "🧒" },
                ].map(h => (
                  <a
                    key={h.number}
                    href={`tel:${h.number}`}
                    className="flex items-center justify-between px-4 py-2.5 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors group"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-text-main">
                      <span>{h.emoji}</span>{h.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-red-700 font-black text-lg group-hover:scale-105 transition-transform">
                      {h.number} <PhoneCall size={16} />
                    </span>
                  </a>
                ))}
              </div>

              {/* Immediate Advice */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">⚠️ Do This Right Now</p>
                {[
                  "DO NOT delete any chats, messages, or photos — they are evidence",
                  "DO NOT pay any money to the blackmailer — it will not stop them",
                  "Screenshot and save all communication immediately",
                  "Tell a trusted family member or friend right now",
                  "Report at cybercrime.gov.in or call 1930 immediately",
                ].map((advice, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-semibold text-amber-900">
                    <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</span>
                    {advice}
                  </div>
                ))}
              </div>

              {/* Cybercrime portal link */}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-colors"
              >
                🌐 File Complaint at cybercrime.gov.in
                <ArrowRight size={16} />
              </a>

              {/* Dismiss */}
              <button
                onClick={() => { setEmergencyMode(false); setEmergencyDismissed(true); }}
                className="w-full py-2.5 border-2 border-border-main rounded-xl text-sm font-black text-text-muted hover:text-text-main hover:border-black transition-colors"
              >
                I understand — Continue to AI Assistant
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar - History (Desktop) */}
      {showHistorySidebar && (
        <div className="hidden lg:flex w-72 xl:w-80 shrink-0 flex-col bg-white border border-border-main rounded-2xl sm:rounded-3xl overflow-hidden print:hidden shadow-xs transition-all">
          {/* Header */}
          <div className="p-3.5 border-b border-border-main space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shadow-2xs">
                  <MessageSquare size={13} />
                </div>
                <span className="font-extrabold text-sm text-text-main">Conversations</span>
                <span className="text-[10px] font-bold bg-bg-subtle text-text-muted px-2 py-0.5 rounded-full border border-border-main">
                  {chats.length}
                </span>
              </div>
              <button
                onClick={() => setShowHistorySidebar(false)}
                className="w-7 h-7 rounded-lg text-text-muted hover:text-black hover:bg-bg-subtle flex items-center justify-center transition-colors"
                title="Hide sidebar"
              >
                <PanelLeftClose size={15} />
              </button>
            </div>

            {/* New Conversation Button */}
            <button 
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-xs hover:shadow group whitespace-nowrap"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
              <span>New Conversation</span>
            </button>

            {/* Search Input */}
            {chats.length > 2 && (
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full bg-bg-subtle/70 hover:bg-bg-subtle focus:bg-white border border-border-main rounded-lg pl-8 pr-7 py-1.5 text-xs font-semibold text-text-main placeholder:text-text-muted outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                />
                {chatSearchQuery && (
                  <button
                    onClick={() => setChatSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-black"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Recent Chats</p>
              {chatSearchQuery && (
                <span className="text-[10px] font-bold text-text-muted">{filteredChats.length} found</span>
              )}
            </div>

            {filteredChats.length === 0 ? (
              <div className="py-8 text-center px-4">
                <p className="text-xs font-semibold text-text-muted">
                  {chatSearchQuery ? "No matching chats found." : "No history yet."}
                </p>
                {!chatSearchQuery && (
                  <button
                    onClick={handleNewChat}
                    className="mt-2 text-xs font-bold text-brand-primary hover:underline"
                  >
                    Start a new conversation
                  </button>
                )}
              </div>
            ) : (
              filteredChats.map(chat => {
                const isSelected = currentChatId === chat.id;
                const title = typeof chat.title === 'object' 
                  ? (chat.title?.name || chat.title?.title || JSON.stringify(chat.title)) 
                  : (chat.title || "New Conversation");
                const dateStr = formatChatDate(chat.createdAt);
                const isAnalysis = !!chat.analysisData;

                return (
                  <div
                    key={chat.id}
                    onClick={() => setCurrentChatId(chat.id)}
                    className={`group relative w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-black text-white shadow-xs" 
                        : "hover:bg-bg-subtle text-text-main"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected 
                        ? "bg-white/15 text-white" 
                        : "bg-bg-subtle text-text-muted group-hover:text-text-main"
                    }`}>
                      {isAnalysis ? <FileText size={12} /> : <MessageSquare size={12} />}
                    </div>

                    <div className="min-w-0 flex-1 pr-6">
                      <p className={`text-xs font-bold truncate leading-snug ${isSelected ? "text-white" : "text-text-main"}`}>
                        {title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {isAnalysis && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            Analysis
                          </span>
                        )}
                        {dateStr && (
                          <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-text-muted"}`}>
                            {dateStr}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className={`absolute right-2 top-2.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                        isSelected 
                          ? "text-white/80 hover:text-white hover:bg-white/20" 
                          : "text-text-muted hover:text-red-600 hover:bg-red-50"
                      }`}
                      title="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

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
            <div className="p-4 border-b border-border-main flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shadow-2xs">
                  <MessageSquare size={13} />
                </div>
                <span className="font-extrabold text-base text-black">Conversations</span>
                <span className="text-[10px] font-bold bg-bg-subtle text-text-muted px-2 py-0.5 rounded-full border border-border-main">
                  {chats.length}
                </span>
              </div>
              <button 
                onClick={() => setShowMobileSidebar(false)}
                className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-text-main hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-3.5 border-b border-border-main space-y-3">
              <button 
                onClick={() => {
                  handleNewChat();
                  setShowMobileSidebar(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-2.5 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <Plus size={16} />
                New Conversation
              </button>

              {chats.length > 2 && (
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="w-full bg-bg-subtle/70 hover:bg-bg-subtle focus:bg-white border border-border-main rounded-lg pl-8 pr-7 py-1.5 text-xs font-semibold text-text-main placeholder:text-text-muted outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                  />
                  {chatSearchQuery && (
                    <button
                      onClick={() => setChatSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-black"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Recent Chats</p>
                {chatSearchQuery && (
                  <span className="text-[10px] font-bold text-text-muted">{filteredChats.length} found</span>
                )}
              </div>

              {filteredChats.length === 0 && (
                <p className="text-xs text-text-muted px-2 py-4 text-center">
                  {chatSearchQuery ? "No matching chats found." : "No history yet."}
                </p>
              )}
              {filteredChats.map(chat => {
                const isSelected = currentChatId === chat.id;
                const title = typeof chat.title === 'object' 
                  ? (chat.title?.name || chat.title?.title || JSON.stringify(chat.title)) 
                  : (chat.title || "New Conversation");
                const dateStr = formatChatDate(chat.createdAt);
                const isAnalysis = !!chat.analysisData;

                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setCurrentChatId(chat.id);
                      setShowMobileSidebar(false);
                    }}
                    className={`group relative w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-black text-white shadow-xs" 
                        : "hover:bg-bg-subtle text-text-main"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected 
                        ? "bg-white/15 text-white" 
                        : "bg-bg-subtle text-text-muted"
                    }`}>
                      {isAnalysis ? <FileText size={12} /> : <MessageSquare size={12} />}
                    </div>

                    <div className="min-w-0 flex-1 pr-6">
                      <p className={`text-xs font-bold truncate leading-snug ${isSelected ? "text-white" : "text-text-main"}`}>
                        {title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {isAnalysis && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            Analysis
                          </span>
                        )}
                        {dateStr && (
                          <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-text-muted"}`}>
                            {dateStr}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className={`absolute right-2 top-2.5 p-1 rounded-md ${
                        isSelected 
                          ? "text-white/80 hover:text-white" 
                          : "text-text-muted hover:text-red-600"
                      }`}
                      title="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 flex flex-col bg-white border border-border-main rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-xs">
        
        {/* Header */}
        <div className="p-2.5 sm:p-3 border-b border-border-main flex items-center justify-between gap-2 bg-white z-10 shrink-0 print:hidden">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setShowMobileSidebar(true);
                } else {
                  setShowHistorySidebar(prev => !prev);
                }
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-bg-subtle border border-border-main flex items-center justify-center text-text-main hover:bg-gray-200 shrink-0 shadow-2xs"
              title={showHistorySidebar ? "Hide Conversation History" : "Show Conversation History"}
            >
              {showHistorySidebar ? <PanelLeftClose size={16} className="hidden lg:block" /> : <PanelLeftOpen size={16} className="hidden lg:block" />}
              <Menu size={16} className="lg:hidden" />
            </button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black text-white rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
              <Bot size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-text-main text-xs sm:text-sm md:text-base leading-tight truncate">NyayaAI Legal Assistant</h2>
              <p className="text-[10px] sm:text-[11px] text-text-muted font-medium truncate hidden sm:block">Powered by Google Gemini & OpenRouter AI • Reasoning OS</p>
            </div>
          </div>

          {/* Model Selector & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-bg-subtle border border-border-main rounded-xl px-2 py-1.5 text-xs font-bold text-text-main shadow-2xs">
              <Zap size={13} className="text-amber-500 shrink-0" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent outline-none font-bold text-xs text-text-main cursor-pointer max-w-[110px] sm:max-w-[140px] truncate pr-0.5"
                title="Select Legal AI model"
              >
                <option value="google/gemini-2.0-flash-exp:free">✨ Gemini 2.0</option>
                <option value="google/gemma-4-26b-a4b-it:free">🌐 Gemma 4 (Google)</option>
                <option value="inclusionai/ling-3.0-flash:free">⚡ ling-3.0-flash</option>
                <option value="meta-llama/llama-3.3-70b-instruct:free">🦙 llama-3.3-70b</option>
                <option value="deepseek/deepseek-r1:free">🧠 deepseek-r1</option>
              </select>
            </div>

            <button
              onClick={() => setEnableReasoning(!enableReasoning)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                enableReasoning
                  ? "bg-black text-white border-black shadow-2xs"
                  : "bg-white text-text-muted border-border-main hover:bg-bg-subtle"
              }`}
              title="Toggle step-by-step reasoning tokens"
            >
              <Brain size={13} className={enableReasoning ? "text-green-400" : "text-text-muted"} />
              <span className="hidden sm:inline">Reasoning:</span>
              <span>{enableReasoning ? "ON" : "OFF"}</span>
            </button>

            {/* Expand to Full Page / Split View Toggle */}
            <button
              onClick={() => setShowHistorySidebar(prev => !prev)}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-bg-subtle hover:bg-gray-200 border border-border-main rounded-xl text-xs font-bold text-text-main transition-colors shadow-2xs"
              title={showHistorySidebar ? "Expand to Full Page View (Hide History)" : "Show Split View with History"}
            >
              {showHistorySidebar ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
              <span className="hidden xl:inline">{showHistorySidebar ? "Full Page" : "Split View"}</span>
            </button>

            <button 
              onClick={handleShareWhatsApp} 
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#1ebd5b] transition-colors shadow-2xs"
              title="Share report via WhatsApp"
            >
              <Share2 size={13} />
              <span className="hidden md:inline">WhatsApp</span>
            </button>

            <button onClick={handlePrint} className="flex items-center gap-1 px-2.5 py-1.5 bg-text-main text-white rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-2xs">
              <Download size={13} />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 print:p-0" ref={printRef}>
          
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

                    {/* Interactive AI Follow-Up Questions */}
                    {msg.role !== "user" && enableFollowUps && (
                      <div className="mt-5 pt-3 border-t border-border-main/60 flex flex-col gap-2 print:hidden">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
                          <Lightbulb size={14} className="text-amber-500 shrink-0" />
                          <span>Recommended Follow-Up Questions (Click to ask):</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {getFollowUpQuestions(msg.content).map((q, qIndex) => (
                            <button
                              key={qIndex}
                              type="button"
                              onClick={() => {
                                setInputText(q);
                                const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
                                if (inputEl) inputEl.focus();
                              }}
                              disabled={isSending}
                              className="px-3.5 py-2 bg-white hover:bg-black hover:text-white border-2 border-border-main rounded-xl text-xs font-bold text-text-main transition-all text-left shadow-2xs flex items-center gap-1.5 group"
                            >
                              <span>{q}</span>
                              <ArrowRight size={13} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
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
          <div className="p-2.5 sm:p-3 border-t border-border-main bg-white shrink-0 print:hidden shadow-sm">
            {isVoiceRecording && (
              <div className="flex items-center justify-between bg-red-50 border border-red-300 text-red-900 px-3 py-1.5 rounded-xl mb-2 shadow-xs animate-pulse max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
                  <span className="text-xs font-bold truncate">
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
                placeholder={`Ask a legal question... (Reasoning: ${enableReasoning ? "ON" : "OFF"})`}
                className="w-full bg-bg-subtle/50 hover:bg-white border-2 border-black/80 rounded-xl pl-4 pr-24 sm:pr-28 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-sm font-semibold text-text-main placeholder:text-text-muted shadow-2xs transition-all"
                disabled={isSending}
              />
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isSending}
                className={`absolute right-12 sm:right-14 top-1.5 bottom-1.5 aspect-square flex items-center justify-center rounded-lg transition-all ${
                  isVoiceRecording
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-white text-text-main hover:bg-gray-100 border border-border-main"
                }`}
                title={isVoiceRecording ? "Stop microphone recording" : "Record question with microphone"}
              >
                {isVoiceRecording ? <MicOff size={15} /> : <Mic size={15} />}
              </button>
              <button 
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square flex items-center justify-center bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-all shadow-xs"
                title="Send legal inquiry to NyayaAI"
              >
                {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </form>
            <div className="flex items-center justify-between max-w-4xl mx-auto mt-2 px-1 text-[10px] sm:text-xs text-text-muted">
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">Model: <strong className="text-text-main font-bold">{selectedModel.split("/")[1]?.replace(":free", "") || "ling-3.0-flash"}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Reasoning: <strong className={enableReasoning ? "text-green-700 font-bold" : "text-text-main"}>{enableReasoning ? "ON" : "OFF"}</strong></span>
                <span className="hidden md:inline">•</span>
                <button
                  type="button"
                  onClick={() => setEnableFollowUps(prev => !prev)}
                  className="hidden md:inline-flex items-center gap-1 hover:text-black transition-colors"
                  title="Toggle interactive AI Follow-Up Question suggestions"
                >
                  <span>Suggestions:</span>
                  <strong className={enableFollowUps ? "text-brand-primary font-bold" : "text-text-muted"}>
                    {enableFollowUps ? "ON" : "OFF"}
                  </strong>
                </button>
              </div>
              <span className="text-[10px] text-text-light shrink-0 ml-2">Verify with an advocate.</span>
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

    </div>
  );
}
