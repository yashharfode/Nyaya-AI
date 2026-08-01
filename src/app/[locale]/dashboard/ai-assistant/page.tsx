"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  ChevronRight, CheckCircle2, Download,
  ShoppingCart, ShieldAlert, Clock, Bot,
  ArrowRight, ShieldCheck, PhoneCall, Star, Loader2,
  FileText, CheckSquare, Landmark, Scale, Plus, Send, MessageSquare,
  Gavel, AlertTriangle, Rocket, MapPin, Copy, Search, HelpCircle, BookOpen,
  PanelLeftClose, PanelLeftOpen, Menu
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { chatWithAiAction } from "@/actions/ai";

export default function CaseAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  // Chat History State
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Active Chat State
  const activeChat = chats.find(c => c.id === currentChatId) || null;
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState<"smart" | "chat">("smart"); // Toggle between Smart Analysis & Free Chat
  
  // Smart Analysis Animation State
  const [revealStep, setRevealStep] = useState(15); 
  const printRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Geo Location State
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [manualCity, setManualCity] = useState("");
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");

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
          title: parsed?.caseOverview?.title || "Smart Analysis",
          createdAt: serverTimestamp(),
          analysisData: parsed,
          isNewAnalysis: true,
          messages: []
        });
        setCurrentChatId(docRef.id);
        setMode("smart");
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
      const steps = 15;
      const timers = Array.from({length: steps}).map((_, i) => 
        setTimeout(() => setRevealStep(i + 1), (i + 1) * 800)
      );
      
      // Mark as not new after animations start
      if (user && currentChatId) {
         updateDoc(doc(db, `users/${user.uid}/ai_chats`, currentChatId), {
           isNewAnalysis: false
         });
      }
      return () => timers.forEach(clearTimeout);
    } else if (activeChat) {
      setRevealStep(15); // Show everything if it's an old chat
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.id, activeChat?.isNewAnalysis]);

  useEffect(() => {
    if (mode === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages, mode]);

  const handleNewChat = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, `users/${user.uid}/ai_chats`), {
      title: "New Conversation",
      createdAt: serverTimestamp(),
      messages: []
    });
    setCurrentChatId(docRef.id);
    setMode("chat");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !currentChatId) return;
    
    const userMessage = { role: "user", content: inputText, timestamp: Date.now() };
    setInputText("");
    setIsSending(true);

    try {
      const chatRef = doc(db, `users/${user.uid}/ai_chats`, currentChatId);
      const updates: Record<string, unknown> = { messages: arrayUnion(userMessage) };
      
      if (activeChat?.title === "New Conversation" && ((activeChat.messages as any[]) || []).length === 0) {
         updates.title = inputText.substring(0, 30) + "...";
      }
      await updateDoc(chatRef, updates);

      // Call Real AI
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const history = ((activeChat?.messages as any[]) || []).map((m: any) => ({ role: m.role, content: m.content }));
      if (activeChat?.analysisData) {
        history.unshift({ 
          role: "user", 
          content: `Here is the context of my legal issue: ${JSON.stringify(activeChat.analysisData)}` 
        });
      }
      history.push({ role: "user", content: inputText });
      
      const res = await chatWithAiAction(history);
      
      if (res.success && res.text) {
        const aiMessage = { role: "ai", content: res.text, timestamp: Date.now() };
        await updateDoc(chatRef, { messages: arrayUnion(aiMessage) });
      } else {
        const aiMessage = { role: "ai", content: "Sorry, I am having trouble connecting to the AI network right now.", timestamp: Date.now() };
        await updateDoc(chatRef, { messages: arrayUnion(aiMessage) });
      }
      
      setIsSending(false);
    } catch (err) {
      console.error(err);
      setIsSending(false);
    }
  };

  const requestLocation = () => {
    setLocationStatus("requesting");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationStatus("granted");
        },
        (error) => {
          console.error("Location error", error);
          setLocationStatus("denied");
        }
      );
    } else {
      setLocationStatus("denied");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  
  const renderSmartAnalysis = (analysis: any) => {
    if (!analysis) return null;

    const { 
      caseOverview, incidentSummary, applicableRights, applicableLaws, 
      riskAnalysis, evidenceManager, actionRoadmap, governmentPortals, 
      complaintDraft, documentChecklist, nextBestActions, faqs, 
      legalEducation, similarScenarios 
    } = analysis;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-8 pb-20 print:w-full print:max-w-full font-sans text-text-main">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-border-main pb-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <Scale size={24} className="text-brand-primary" />
            Analysis Complete
          </h2>
          <div className="flex gap-3">
             <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
               <Download size={16} /> Download PDF
             </button>
          </div>
        </div>

        {/* 1. CASE OVERVIEW */}
        {caseOverview && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-bold text-text-muted mb-1">Your Issue</p>
                 <h3 className="text-2xl font-bold text-text-main">{caseOverview.title}</h3>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="border border-border-main rounded-xl p-4 bg-bg-subtle">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Category</p>
                <p className="font-bold text-sm">{caseOverview.category}</p>
              </div>
              <div className="border border-border-main rounded-xl p-4 bg-bg-subtle">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Severity</p>
                <p className={`font-bold text-sm ${caseOverview.severity === 'High' ? 'text-red-600' : 'text-text-main'}`}>{caseOverview.severity}</p>
              </div>
              <div className="border border-border-main rounded-xl p-4 bg-bg-subtle">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Confidence</p>
                <p className="font-bold text-sm text-brand-primary">{caseOverview.confidenceScore}%</p>
              </div>
              <div className="border border-border-main rounded-xl p-4 bg-bg-subtle">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Urgency</p>
                <p className="font-bold text-sm">{caseOverview.urgency}</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. INCIDENT SUMMARY */}
        {incidentSummary && (
          <div className="space-y-2 border-b border-border-main pb-8">
             <h4 className="text-lg font-bold flex items-center gap-2">
               <FileText size={18} className="text-text-muted" /> Incident Summary
             </h4>
             <p className="text-sm leading-relaxed text-text-muted bg-white border border-border-main p-4 rounded-xl shadow-sm">
               {incidentSummary}
             </p>
          </div>
        )}

        {/* 3. RISK ANALYSIS */}
        {riskAnalysis && (
          <div className="space-y-4 border-b border-border-main pb-8">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle size={18} className="text-text-muted" /> Risk Assessment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-border-main p-4 rounded-xl">
                <p className="text-xs font-bold text-text-muted mb-1">Financial Risk</p>
                <p className="font-bold text-sm">{riskAnalysis.financialRisk}</p>
              </div>
              <div className="border border-border-main p-4 rounded-xl">
                <p className="text-xs font-bold text-text-muted mb-1">Legal Complexity</p>
                <p className="font-bold text-sm">{riskAnalysis.legalComplexity}</p>
              </div>
              <div className="border border-border-main p-4 rounded-xl">
                <p className="text-xs font-bold text-text-muted mb-1">Evidence Risk</p>
                <p className="font-bold text-sm">{riskAnalysis.evidenceRisk}</p>
              </div>
            </div>
            {riskAnalysis.immediateThreat && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                <ShieldAlert size={18} /> IMMEDIATE THREAT DETECTED. TAKE ACTION NOW.
              </div>
            )}
            {riskAnalysis.needLawyer && (
              <div className="bg-bg-subtle border border-border-main text-text-main p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                <Gavel size={18} /> Professional Lawyer Recommended for this case.
              </div>
            )}
          </div>
        )}

        {/* 4. APPLICABLE RIGHTS & LAWS */}
        {(applicableRights || applicableLaws) && (
          <div className="space-y-6 border-b border-border-main pb-8">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck size={18} className="text-text-muted" /> Applicable Rights & Laws
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {applicableRights && applicableRights.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Your Rights</p>
                  <ul className="space-y-2">
                    {applicableRights.map((right: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 bg-white border border-border-main p-3 rounded-xl shadow-sm">
                        <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm">{right.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">{right.explanation}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {applicableLaws && applicableLaws.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Applicable Laws</p>
                  <ul className="space-y-2">
                    {applicableLaws.map((law: any, idx: number) => (
                      <li key={idx} className="bg-white border border-border-main p-3 rounded-xl shadow-sm">
                        <p className="font-bold text-sm">{law.name}</p>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">{law.whyApplies}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. EVIDENCE CHECKLIST */}
        {evidenceManager && (
          <div className="space-y-4 border-b border-border-main pb-8">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <CheckSquare size={18} className="text-text-muted" /> Evidence Checklist
            </h4>
            <div className="bg-white border border-border-main rounded-xl p-4 shadow-sm">
              <ul className="space-y-3">
                {(evidenceManager.required || []).map((ev: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border border-border-main flex items-center justify-center shrink-0 mt-0.5"></div>
                    <span className="text-sm font-medium">{ev}</span>
                  </li>
                ))}
              </ul>
              {documentChecklist && documentChecklist.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border-main">
                  <p className="text-xs font-bold text-text-muted mb-3">Additional Documents</p>
                  <ul className="space-y-3">
                    {documentChecklist.map((docItem: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border border-border-main flex items-center justify-center shrink-0 mt-0.5"></div>
                        <span className="text-sm font-medium">{docItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. ACTION ROADMAP */}
        {actionRoadmap && actionRoadmap.length > 0 && (
          <div className="space-y-4 border-b border-border-main pb-8">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Rocket size={18} className="text-text-muted" /> Action Roadmap
            </h4>
            <div className="relative ml-2">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border-main"></div>
              <div className="space-y-6">
                {actionRoadmap.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2 bg-white ${item.status === "done" ? "border-brand-primary" : "border-border-main text-text-muted"}`}>
                      {item.status === "done" && <div className="w-2 h-2 rounded-full bg-brand-primary"></div>}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className={`font-bold text-sm ${item.status === "pending" ? "text-text-muted" : "text-text-main"}`}>{item.step}</p>
                      <span className="text-[10px] text-text-muted">{item.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. RECOMMENDED AUTHORITY */}
        <div className="space-y-4 border-b border-border-main pb-8">
          <h4 className="text-lg font-bold flex items-center gap-2">
            <Landmark size={18} className="text-text-muted" /> Recommended Authority
          </h4>
          <div className="bg-bg-subtle border border-border-main p-5 rounded-xl">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
               <p className="text-sm font-medium">You should file your complaint with the relevant local authority.</p>
               {locationStatus === "idle" && (
                 <button onClick={requestLocation} className="bg-white border border-border-main text-text-main px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 shrink-0">
                   <MapPin size={14} /> Detect Location
                 </button>
               )}
             </div>
             
             {locationStatus === "requesting" && (
               <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                 <Loader2 size={16} className="animate-spin" /> Detecting location...
               </div>
             )}
             
             {locationStatus === "granted" && (
               <div className="bg-white border border-border-main p-3 rounded-lg flex flex-col gap-2">
                 <span className="text-xs font-bold text-green-600">Location Found</span>
                 <a href={`https://www.google.com/maps/search/police+station+or+court/@${userLocation?.lat},${userLocation?.lng},14z`} target="_blank" rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors self-start">
                   <Search size={16} /> Search Local Authorities
                 </a>
               </div>
             )}

             {(locationStatus === "denied" || locationStatus === "idle") && (
               <div className="flex gap-2 max-w-sm mt-2">
                 <input type="text" value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder="Enter your city (e.g., Mumbai)" className="flex-1 border border-border-main rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                 <a href={`https://www.google.com/maps/search/police+station+or+court+in+${manualCity || 'India'}`} target="_blank" rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center">
                   Search
                 </a>
               </div>
             )}
          </div>
        </div>

        {/* 8. GENERATED COMPLAINT DRAFT */}
        {complaintDraft && (
          <div className="space-y-4 pb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <FileText size={18} className="text-text-muted" /> Generated Complaint Draft
              </h4>
              <button onClick={() => {navigator.clipboard.writeText(complaintDraft)}} className="flex items-center gap-2 bg-white text-text-main px-4 py-2 rounded-lg text-xs font-bold hover:bg-bg-subtle transition-colors border border-border-main shadow-sm">
                <Copy size={14} /> Copy Text
              </button>
            </div>
            <textarea 
              defaultValue={complaintDraft} 
              className="w-full h-[400px] bg-white border border-border-main rounded-xl p-6 font-mono text-sm leading-relaxed text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-sm resize-y"
            />
          </div>
        )}

      </div>
    );
  };

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex gap-6 overflow-hidden print:h-auto print:block bg-bg-main">
      
      {/* Sidebar - Toggleable */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0 opacity-0'} shrink-0 flex flex-col bg-white border border-border-main rounded-3xl overflow-hidden transition-all duration-300 print:hidden relative`}>
        <div className="p-4 border-b border-border-main shrink-0">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-2">Your Cases</p>
          {chats.length === 0 && <p className="text-sm text-text-muted px-2">No history yet.</p>}
          {chats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => { setCurrentChatId(chat.id); setMode(chat.analysisData ? "smart" : "chat"); if(window.innerWidth < 768) setSidebarOpen(false); }}
              className={`w-full text-left flex flex-col gap-1 p-3 rounded-xl transition-colors ${
                currentChatId === chat.id ? "bg-bg-subtle font-bold border border-border-main" : "text-text-muted hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <MessageSquare size={14} className={currentChatId === chat.id ? "text-brand-primary shrink-0" : "shrink-0"} />
                <span className="truncate text-sm flex-1 text-text-main">{chat.title}</span>
              </div>
              {chat.analysisData && (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full self-start ml-6">Smart Analysis</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white border border-border-main rounded-3xl overflow-hidden relative shadow-sm min-w-0">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-main flex items-center justify-between bg-white z-10 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
             <button onClick={toggleSidebar} className="p-2 hover:bg-bg-subtle rounded-xl text-text-muted hover:text-text-main transition-colors mr-1">
               {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
             </button>
             <div className="hidden sm:flex w-10 h-10 bg-bg-subtle rounded-xl items-center justify-center border border-border-main">
                <Bot size={20} className="text-brand-primary" />
             </div>
             <div>
                <h2 className="font-bold text-text-main text-sm sm:text-base">{activeChat?.title || "NyayaAI Assistant"}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-[10px] sm:text-xs text-text-muted font-semibold uppercase tracking-wider">AI Online</p>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2 bg-bg-subtle p-1 rounded-xl border border-border-main">
            {activeChat?.analysisData && (
              <button 
                onClick={() => setMode("smart")} 
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "smart" ? "bg-white text-text-main shadow-sm" : "text-text-muted hover:text-text-main"}`}
              >
                Smart Analysis
              </button>
            )}
            <button 
              onClick={() => setMode("chat")} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "chat" ? "bg-white text-text-main shadow-sm" : "text-text-muted hover:text-text-main"}`}
            >
              Free Chat
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-bg-main/30 print:p-0 relative" ref={printRef}>
          
          {!activeChat ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto p-6">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 border border-border-main shadow-sm">
                <Scale size={36} className="text-brand-primary" />
              </div>
              <h2 className="text-3xl font-black text-text-main mb-3">NyayaAI Legal OS</h2>
              <p className="text-text-muted mb-8 leading-relaxed font-medium">Your personal legal operating system. Start a Free Chat or generate a comprehensive Smart Analysis for a specific case.</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button onClick={handleNewChat} className="flex-1 bg-white border-2 border-border-main text-text-main px-6 py-4 rounded-xl font-bold hover:border-text-main hover:bg-bg-subtle transition-all flex items-center justify-center gap-2">
                  <MessageSquare size={18} /> Start Free Chat
                </button>
                <button onClick={() => router.push("/dashboard/describe-issue")} className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md flex items-center justify-center gap-2">
                  <Rocket size={18} /> Smart Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6 md:p-8">
              {mode === "smart" && activeChat.analysisData ? (
                renderSmartAnalysis(activeChat.analysisData)
              ) : (
                <div className="max-w-3xl mx-auto space-y-6 pb-20">
                  {((activeChat.messages as any[]) || []).length === 0 && (
                    <div className="text-center py-12 text-text-muted">
                      <Bot size={40} className="mx-auto mb-4 opacity-50" />
                      <p className="font-medium">I am your legal AI assistant. Ask me anything.</p>
                    </div>
                  )}
                  {((activeChat.messages as any[]) || []).map((msg: any, idx: number) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 border border-border-main shadow-sm ${
                        msg.role === "user" ? "bg-white text-text-main" : "bg-black text-white"
                      }`}>
                        {msg.role === "user" ? user?.displayName?.charAt(0) || "U" : <Bot size={16} />}
                      </div>
                      <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                        msg.role === "user" 
                          ? "bg-brand-primary text-white rounded-tr-sm" 
                          : "bg-white text-text-main border border-border-main rounded-tl-sm"
                      } whitespace-pre-wrap`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex gap-4 flex-row">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white text-text-main rounded-2xl rounded-tl-sm border border-border-main p-4 flex items-center gap-3 shadow-sm">
                        <Loader2 size={16} className="animate-spin text-brand-primary" />
                        <span className="text-sm font-semibold">Analyzing...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Input (Only show if an active chat exists) */}
        {activeChat && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg-main via-bg-main to-transparent shrink-0 print:hidden z-20 pointer-events-none">
            <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto pointer-events-auto">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === "smart" ? "Ask a follow-up question about this case..." : "Message NyayaAI..."}
                className="w-full bg-white border border-border-main rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm shadow-lg"
                disabled={isSending}
                onClick={() => { if (mode === "smart") setMode("chat"); }}
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}
