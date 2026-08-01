"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  ChevronRight, CheckCircle2, Download, Share2, Pencil,
  ShoppingCart, ShieldAlert, Clock, Bot, Lightbulb,
  ArrowRight, ShieldCheck, PhoneCall, Star, Loader2,
  FileText, CheckSquare, Landmark, Scale, Plus, Send, MessageSquare, Trash2
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { chatWithAiAction } from "@/actions/ai";

export default function CaseAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  
  // Chat History State
  const [chats, setChats] = useState<Record<string, unknown>[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  // Active Chat State
  const activeChat = chats.find(c => c.id === currentChatId) || null;
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  
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

  const checkSessionStorageForNewAnalysis = async (userId: string) => {
    const data = sessionStorage.getItem("nyaya_ai_analysis");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        sessionStorage.removeItem("nyaya_ai_analysis");
        
        const docRef = await addDoc(collection(db, `users/${userId}/ai_chats`), {
          title: parsed.category || "Smart Analysis",
          createdAt: serverTimestamp(),
          analysisData: parsed,
          isNewAnalysis: true,
          messages: []
        });
        setCurrentChatId(docRef.id);
      } catch (e) {
        console.error("Failed to parse analysis data", e);
      }
    }
  };

  // 2. Fetch Chat History
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/ai_chats`), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(chatList);
      
      if (!currentChatId && chatList.length === 0) {
        checkSessionStorageForNewAnalysis(user.uid);
      } else if (!currentChatId && chatList.length > 0) {
        const stored = sessionStorage.getItem("nyaya_ai_analysis");
        if(stored) {
            checkSessionStorageForNewAnalysis(user.uid);
        } else {
            setCurrentChatId(chatList[0].id);
        }
      } else if (currentChatId && chatList.length > 0) {
          const stored = sessionStorage.getItem("nyaya_ai_analysis");
          if(stored) {
              checkSessionStorageForNewAnalysis(user.uid);
          }
      }
    }, (error) => {
      console.error("Firestore error:", error);
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Call Real AI
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const history = ((activeChat?.messages as any[]) || []).map((m: any) => ({ role: m.role, content: m.content }));
      
      // If there is an analysisData, inject it as context
      if (activeChat?.analysisData) {
        history.unshift({ 
          role: "user", 
          content: `Here is the context of my legal issue: ${JSON.stringify(activeChat.analysisData)}` 
        });
      }
      
      history.push({ role: "user", content: inputText });
      
      const res = await chatWithAiAction(history);
      
      if (res.success && res.text) {
        const aiMessage = { 
          role: "ai", 
          content: res.text,
          // eslint-disable-next-line react-hooks/purity
          timestamp: Date.now() 
        };
        await updateDoc(chatRef, {
          messages: arrayUnion(aiMessage)
        });
      } else {
        const aiMessage = { 
          role: "ai", 
          content: "Sorry, I am having trouble connecting to the AI network right now. Please try again later.",
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

  const renderSmartAnalysis = (analysis: Record<string, unknown>) => {
    if (!analysis) return null;
    return (
      <div className="space-y-6 mb-8 w-full max-w-4xl mx-auto print:max-w-full">
         <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm print:shadow-none print:border-b">
            <h3 className="font-bold text-text-main text-lg flex items-center gap-2 mb-3">
              <FileText size={20} className="text-brand-primary" />
              Your Issue
            </h3>
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
              {analysis.originalIssue}
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
                  <p className="font-bold text-text-main">{analysis.category || "General Dispute"}</p>
                </div>
              </div>
            </div>

            <div className={`bg-white border border-border-main rounded-2xl p-5 shadow-sm flex flex-col transition-all duration-700 ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <ShieldAlert size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-semibold">Severity</p>
                  <div className="inline-block bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-200 mt-1">
                    {analysis.severity || "Medium"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {revealStep >= 3 && (
            <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 print:shadow-none print:border-b">
              <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
                <Scale size={20} className="text-indigo-600" />
                Applicable Rights & Laws
              </h3>
              <ul className="space-y-3">
                {(analysis.applicableRights || analysis.implications || []).map((right: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-main bg-bg-subtle/50 p-3 rounded-xl border border-border-main">
                    <ShieldCheck size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {revealStep >= 4 && (
            <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 print:shadow-none print:border-b">
              <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
                <CheckSquare size={20} className="text-amber-600" />
                Evidence Checklist
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {(analysis.evidenceChecklist || []).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border border-border-main rounded-xl hover:bg-bg-subtle transition-colors cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-text-light group-hover:border-brand-primary flex items-center justify-center bg-white shrink-0"></div>
                    <span className="text-sm font-medium text-text-main line-clamp-2">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {revealStep >= 5 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 print:bg-none print:border-b print:shadow-none">
              <h3 className="font-bold text-text-main text-lg mb-2 flex items-center gap-2">
                <Landmark size={20} className="text-blue-700" />
                Recommended Authority
              </h3>
              <div className="bg-white border border-blue-200 p-4 rounded-xl shadow-sm inline-block font-bold text-blue-900">
                {analysis.recommendedAuthority || "Appropriate Legal Forum"}
              </div>
            </div>
          )}

          {revealStep >= 6 && analysis.complaintDraft && (
            <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 print:shadow-none print:border-0 print:pt-4">
              <h3 className="font-bold text-text-main text-lg flex items-center gap-2 mb-4">
                <FileText size={20} className="text-text-main" />
                Generated Complaint Draft
              </h3>
              <div className="bg-bg-subtle/30 border border-border-main rounded-xl p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-text-main max-h-[400px] overflow-y-auto print:max-h-none print:border-0 print:bg-transparent print:p-0">
                {analysis.complaintDraft}
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex gap-6 overflow-hidden print:h-auto print:block">
      
      {/* Sidebar - History */}
      <div className="w-64 shrink-0 flex flex-col bg-white border border-border-main rounded-3xl overflow-hidden print:hidden">
        <div className="p-4 border-b border-border-main">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-2">Recent Chats</p>
          {chats.length === 0 && (
            <p className="text-sm text-text-muted px-2">No history yet.</p>
          )}
          {chats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-colors ${
                currentChatId === chat.id ? "bg-bg-subtle font-bold text-text-main" : "text-text-muted hover:bg-gray-50"
              }`}
            >
              <MessageSquare size={16} className={currentChatId === chat.id ? "text-brand-primary shrink-0" : "shrink-0"} />
              <span className="truncate text-sm flex-1">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white border border-border-main rounded-3xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 border-b border-border-main flex items-center justify-between bg-white z-10 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-bg-subtle rounded-full flex items-center justify-center">
                <Bot size={20} className="text-text-main" />
             </div>
             <div>
                <h2 className="font-bold text-text-main">NyayaAI Legal Assistant</h2>
                <p className="text-xs text-text-muted">Powered by AI</p>
             </div>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-text-main text-white rounded-xl text-sm font-bold hover:bg-black transition-colors">
            <Download size={16} />
            Export
          </button>
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
              
              {((activeChat.messages as Record<string, unknown>[]) || []).map((msg: Record<string, unknown>, idx: number) => (
                <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} print:flex-row print:mb-4`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === "user" ? "bg-black text-white" : "bg-brand-primary text-white"
                  }`}>
                    {msg.role === "user" ? user?.displayName?.charAt(0) || "U" : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-black text-white rounded-tr-sm" 
                      : "bg-bg-subtle text-text-main rounded-tl-sm border border-border-main"
                  } print:bg-white print:border print:border-gray-300 print:text-black print:max-w-full`}>
                    {msg.content}
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
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}

        </div>

        {/* Chat Input */}
        {activeChat && (
          <div className="p-4 border-t border-border-main bg-white shrink-0 print:hidden">
            <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a follow-up question about your case..."
                className="w-full bg-bg-subtle border border-border-main rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm shadow-sm"
                disabled={isSending}
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="text-center text-[10px] text-text-light mt-3">
              NyayaAI can make mistakes. Always verify with a legal professional.
            </p>
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
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Ref:</strong> NYA-X7V2M9</p>
          </div>
        </div>
        {/* Note: The Smart Analysis + Chat Messages are rendered in the main flow and will be printed because of `ref={printRef}`. */}
      </div>

    </main>
  );
}
