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
import { onAuthStateChanged } from "firebase/auth";
import { chatWithAiAction } from "@/actions/ai";

export default function CaseAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  
  // Chat History State
  const [chats, setChats] = useState<Record<string, unknown>[]>([]);
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
      
      if (activeChat?.title === "New Conversation" && activeChat.messages?.length === 0) {
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
      <div className="space-y-6 w-full max-w-4xl mx-auto print:max-w-full pb-20">
        
        {/* 1. CASE OVERVIEW */}
        {caseOverview && (
          <div className={`transition-all duration-700 ${revealStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="bg-gradient-to-br from-indigo-900 to-black text-white border border-indigo-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20"><Scale size={150} /></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-indigo-500/30 border border-indigo-400/50 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{caseOverview.category}</span>
                    <span className="bg-black/40 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{caseOverview.subcategory}</span>
                  </div>
                  <h2 className="text-3xl font-black mb-2">{caseOverview.title}</h2>
                  <p className="text-indigo-200 font-semibold mb-4">{caseOverview.urgency}</p>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-indigo-100 uppercase">Severity</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${caseOverview.severity === 'High' ? 'bg-red-500 text-white' : caseOverview.severity === 'Medium' ? 'bg-amber-500 text-black' : 'bg-green-500 text-white'}`}>{caseOverview.severity}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-indigo-100 uppercase">Confidence</span>
                    <span className="text-xl font-black text-yellow-400">{caseOverview.confidenceScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. INCIDENT SUMMARY */}
        {incidentSummary && revealStep >= 2 && (
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-bold text-text-main text-lg flex items-center gap-2 mb-3">
              <FileText size={20} className="text-brand-primary" /> Incident Summary
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">{incidentSummary}</p>
          </div>
        )}

        {/* 5. RISK ANALYSIS (Moved up for visibility) */}
        {riskAnalysis && revealStep >= 3 && (
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-bold text-text-main text-lg flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-amber-600" /> Risk Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-bg-subtle p-3 rounded-xl border border-border-main">
                <p className="text-xs text-text-muted font-semibold uppercase mb-1">Financial Risk</p>
                <p className={`font-bold text-sm ${riskAnalysis.financialRisk === 'High' ? 'text-red-600' : 'text-text-main'}`}>{riskAnalysis.financialRisk}</p>
              </div>
              <div className="bg-bg-subtle p-3 rounded-xl border border-border-main">
                <p className="text-xs text-text-muted font-semibold uppercase mb-1">Legal Complexity</p>
                <p className="font-bold text-sm text-text-main">{riskAnalysis.legalComplexity}</p>
              </div>
              <div className="bg-bg-subtle p-3 rounded-xl border border-border-main">
                <p className="text-xs text-text-muted font-semibold uppercase mb-1">Evidence Risk</p>
                <p className="font-bold text-sm text-text-main">{riskAnalysis.evidenceRisk}</p>
              </div>
              {riskAnalysis.immediateThreat && (
                <div className="col-span-full bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2 text-red-700 font-bold text-sm">
                  <ShieldAlert size={18} /> IMMEDIATE THREAT DETECTED. TAKE ACTION NOW.
                </div>
              )}
              {riskAnalysis.needLawyer && (
                <div className="col-span-full bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <Gavel size={18} /> PROFESSIONAL LAWYER RECOMMENDED FOR THIS CASE.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. APPLICABLE RIGHTS */}
        {applicableRights && applicableRights.length > 0 && revealStep >= 4 && (
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-bold text-text-main text-lg flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-green-600" /> Your Rights
            </h3>
            <div className="space-y-3">
              {applicableRights.map((right: any, idx: number) => (
                <div key={idx} className="bg-green-50/50 border border-green-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{right.type}</span>
                    <h4 className="font-bold text-green-900">{right.name}</h4>
                  </div>
                  <p className="text-xs text-green-800 leading-relaxed">{right.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. APPLICABLE LAWS */}
        {applicableLaws && applicableLaws.length > 0 && revealStep >= 5 && (
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-bold text-text-main text-lg flex items-center gap-2 mb-4">
              <Scale size={20} className="text-purple-600" /> Applicable Laws
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {applicableLaws.map((law: any, idx: number) => (
                <div key={idx} className="bg-bg-subtle border border-border-main p-5 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                  <h4 className="font-bold text-text-main mb-1 group-hover:text-purple-700 transition-colors">{law.name}</h4>
                  <p className="text-xs font-semibold text-brand-primary mb-3">{law.purpose}</p>
                  <p className="text-xs text-text-muted mb-3"><strong className="text-text-main">Why it applies:</strong> {law.whyApplies}</p>
                  {law.maxPunishment && (
                    <div className="bg-purple-50 text-purple-800 text-xs font-bold px-3 py-2 rounded-lg border border-purple-100">
                      Penalty: {law.maxPunishment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. ACTION ROADMAP */}
        {actionRoadmap && actionRoadmap.length > 0 && revealStep >= 6 && (
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-bold text-text-main text-lg mb-6 flex items-center gap-2">
              <Rocket size={20} className="text-teal-600" /> Action Roadmap
            </h3>
            <div className="relative ml-2">
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border-main"></div>
              <div className="space-y-6">
                {actionRoadmap.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 bg-white ${item.status === "done" ? "border-green-500 text-green-500" : item.status === "active" ? "border-brand-primary text-brand-primary" : "border-border-main text-text-muted"}`}>
                      {item.status === "done" ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className={`font-bold text-sm ${item.status === "pending" ? "text-text-muted" : "text-text-main"}`}>{item.step}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === "done" ? "bg-green-100 text-green-700" : item.status === "active" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{item.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. AUTHORITY RECOMMENDATION (Geolocation) */}
        {revealStep >= 7 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                <Landmark size={20} className="text-blue-700" /> Nearby Authorities
              </h3>
              {locationStatus === "idle" && (
                <button onClick={requestLocation} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <MapPin size={14} /> Detect Location
                </button>
              )}
            </div>
            
            {locationStatus === "requesting" && (
              <div className="flex items-center justify-center py-6 text-blue-600">
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}
            
            {locationStatus === "granted" && (
              <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm space-y-3">
                <p className="text-sm font-semibold text-blue-900">Found location: {userLocation?.lat.toFixed(2)}, {userLocation?.lng.toFixed(2)}</p>
                <p className="text-xs text-text-muted">Since we don't have a Maps API key in this demo, click below to search your area.</p>
                <a href={`https://www.google.com/maps/search/police+station+or+court/@${userLocation?.lat},${userLocation?.lng},14z`} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-200 transition-colors">
                  <Search size={16} /> Search on Google Maps
                </a>
              </div>
            )}

            {(locationStatus === "denied" || locationStatus === "idle") && (
              <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm">
                <label className="block text-xs font-bold text-blue-900 mb-2 uppercase tracking-wider">Enter your city manually</label>
                <div className="flex gap-2">
                  <input type="text" value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder="e.g. Mumbai, Delhi" className="flex-1 border border-border-main rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  <a href={`https://www.google.com/maps/search/police+station+or+court+in+${manualCity || 'India'}`} target="_blank" rel="noopener noreferrer"
                     className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center">
                    Search
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. EVIDENCE & 11. DOCUMENTS */}
        {evidenceManager && revealStep >= 8 && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-text-main text-base mb-4 flex items-center gap-2">
                <CheckSquare size={18} className="text-indigo-600" /> Required Evidence
              </h3>
              <ul className="space-y-2">
                {(evidenceManager.required || []).map((ev: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-text-main bg-bg-subtle p-2.5 rounded-lg border border-border-main">
                    <span className="w-2 h-2 bg-red-500 rounded-full shrink-0"></span> {ev}
                  </li>
                ))}
              </ul>
              {documentChecklist && documentChecklist.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border-main">
                  <h4 className="font-bold text-text-main text-sm mb-3">Document Checklist</h4>
                  <div className="space-y-2">
                    {documentChecklist.map((docItem: string, idx: number) => (
                      <label key={idx} className="flex items-center gap-3 p-2 hover:bg-bg-subtle rounded-lg cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-border-main text-brand-primary focus:ring-brand-primary" />
                        <span className="text-sm text-text-main">{docItem}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 12. NEXT BEST ACTIONS */}
            {nextBestActions && (
              <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-text-main text-base mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-amber-600" /> Urgency Planner
                </h3>
                <div className="space-y-4">
                  {nextBestActions.emergency && nextBestActions.emergency.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Emergency (Do Now)</p>
                      {nextBestActions.emergency.map((act: string, idx: number) => (
                        <div key={idx} className="bg-red-50 border border-red-100 p-3 rounded-xl text-sm text-red-900 font-medium mb-2">{act}</div>
                      ))}
                    </div>
                  )}
                  {nextBestActions.today && nextBestActions.today.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Do Today</p>
                      {nextBestActions.today.map((act: string, idx: number) => (
                        <div key={idx} className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-sm text-amber-900 font-medium mb-2">{act}</div>
                      ))}
                    </div>
                  )}
                  {nextBestActions.thisWeek && nextBestActions.thisWeek.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Within One Week</p>
                      {nextBestActions.thisWeek.map((act: string, idx: number) => (
                        <div key={idx} className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-sm text-blue-900 font-medium mb-2">{act}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 10. AI COMPLAINT DRAFT */}
        {complaintDraft && revealStep >= 9 && (
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                <FileText size={20} className="text-text-main" /> Complaint Draft
              </h3>
              <div className="flex gap-2">
                <button onClick={() => {navigator.clipboard.writeText(complaintDraft)}} className="flex items-center gap-2 bg-bg-subtle text-text-main px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors border border-border-main">
                  <Copy size={14} /> Copy
                </button>
                <button onClick={handlePrint} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
                  <Download size={14} /> PDF
                </button>
              </div>
            </div>
            <textarea 
              defaultValue={complaintDraft} 
              className="w-full h-64 bg-bg-subtle/50 border border-border-main rounded-xl p-5 font-mono text-sm leading-relaxed text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        )}

        {/* 9. GOVERNMENT PORTALS */}
        {governmentPortals && governmentPortals.length > 0 && revealStep >= 10 && (
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <Landmark size={20} className="text-indigo-600" /> Important Portals
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {governmentPortals.map((portal: any, idx: number) => (
                <a key={idx} href={portal.url.startsWith('http') ? portal.url : `https://${portal.url}`} target="_blank" rel="noopener noreferrer"
                   className="flex flex-col p-4 border border-border-main rounded-xl hover:border-brand-primary hover:shadow-md transition-all group">
                  <span className="font-bold text-text-main text-sm mb-1 group-hover:text-brand-primary transition-colors">{portal.name}</span>
                  <span className="text-[10px] text-text-muted bg-bg-subtle px-2 py-0.5 rounded-full self-start mb-2">{portal.url}</span>
                  <span className="text-xs text-text-muted mt-auto">{portal.purpose}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 13. FAQs & 15. SIMILAR SCENARIOS */}
        {revealStep >= 11 && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {faqs && faqs.length > 0 && (
              <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-text-main text-base mb-4 flex items-center gap-2">
                  <HelpCircle size={18} className="text-green-600" /> Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq: any, idx: number) => (
                    <div key={idx} className="border-b border-border-main pb-3 last:border-0 last:pb-0">
                      <p className="font-bold text-sm text-text-main mb-1">Q: {faq.question}</p>
                      <p className="text-xs text-text-muted leading-relaxed">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {similarScenarios && similarScenarios.length > 0 && (
              <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-text-main text-base mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-600" /> Similar Legal Scenarios
                </h3>
                <div className="space-y-4">
                  {similarScenarios.map((scen: any, idx: number) => (
                    <div key={idx} className="bg-bg-subtle p-4 rounded-xl border border-border-main">
                      <p className="font-bold text-sm text-text-main mb-2">{scen.scenario}</p>
                      <p className="text-xs text-text-muted"><strong className="text-text-main">Action:</strong> {scen.actionToTake}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 16. AI DISCLAIMER */}
        {revealStep >= 12 && (
          <div className="text-center pt-8 pb-4 animate-in fade-in duration-1000">
            <p className="text-[10px] text-text-light uppercase tracking-widest">
              NyayaAI provides legal information, not formal legal advice. Please consult a qualified advocate for representation.
            </p>
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
