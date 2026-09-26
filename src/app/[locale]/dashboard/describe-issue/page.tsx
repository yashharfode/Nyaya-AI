"use client";

import React, { useState, useRef } from "react";
import { useRouter, Link } from "@/i18n/routing";

import { 
  ShieldCheck, 
  Upload, 
  Mic, 
  LayoutGrid, 
  Calendar, 
  ArrowRight, 
  Lock,
  ChevronRight,
  BrainCircuit,
  Search,
  ClipboardList,
  Rocket,
  Check,
  AlertTriangle,
  PhoneCall,
  Loader2,
  FileText,
  X,
  Sparkles,
  Scale,
  MapPin,
  HelpCircle
} from "lucide-react";
import { analyzeLegalIssueAction } from "@/actions/ai";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";

import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const DEMO_LEGAL_DOCUMENTS = [
  {
    id: "job-offer",
    title: "Standard_Employment_Agreement_2026.pdf",
    category: "Employment Issue",
    description: "Tech startup offer letter with non-compete & salary forfeiture clauses.",
    samplePrompt: "I received this employment agreement from a tech company. Can you analyze the non-compete and notice period clauses to tell me if they are enforceable and what loopholes exist?",
    content: `[DOCUMENT: EMPLOYMENT & NON-COMPETE AGREEMENT - TECH STARTUP INDIA]
1. Probation & Termination: Employer reserves the unilateral right to terminate the Employee during the 6-month probation period without notice or compensation.
2. Non-Compete Clause: Employee agrees not to work for any software company in India or globally for a period of 2 (two) years after termination of employment.
3. Salary Forfeiture: If the Employee resigns without serving the full 90-day notice period, all pending salary, bonus, and provident fund contributions shall be forfeited.
4. Intellectual Property: Any invention, software, or project created by Employee even outside office hours and on personal devices shall be the sole property of Employer.`
  },
  {
    id: "rental-lease",
    title: "Residential_Lease_Agreement_11Months.pdf",
    category: "Property Dispute",
    description: "11-month residential lease with 10-month deposit & 48-hour eviction clause.",
    samplePrompt: "My landlord wants me to sign this rental agreement. Please check if the 50% painting deduction and 48-hour eviction notice are legal under Indian rent laws.",
    content: `[DOCUMENT: 11-MONTH RESIDENTIAL LEASE AGREEMENT - BENGALURU]
1. Security Deposit: Tenant shall deposit 10 (ten) months rent amounting to INR 3,00,000. Landlord may deduct up to 50% for painting and cleaning upon vacation.
2. Lock-in Period: Tenant cannot vacate the premises before 11 months. If vacated early, the entire security deposit shall be forfeited.
3. Eviction Notice: Landlord reserves the right to evict Tenant within 48 hours without assigning any reason if rent is delayed by more than 3 days.
4. Maintenance & Repairs: Tenant shall bear all costs for major plumbing, electrical, and structural repairs during the tenancy period.`
  },
  {
    id: "consumer-invoice",
    title: "Electronics_Invoice_Warranty_Policy.pdf",
    category: "Consumer Dispute",
    description: "Invoice with 'No refund under any circumstances' and Delhi court exclusivity.",
    samplePrompt: "I bought a defective laptop and the shop is refusing a refund citing these invoice terms. Are these 'no refund' and 'jurisdiction' clauses valid under the Consumer Protection Act 2019?",
    content: `[DOCUMENT: CONSUMER ELECTRONICS INVOICE & WARRANTY TERMS]
1. No Refund Policy: Goods once sold will not be taken back, exchanged, or refunded under any circumstances.
2. Warranty Exclusions: Warranty is void if the product has minor scratches, voltage fluctuations, or if service is claimed after 7 days of purchase.
3. Jurisdiction: All disputes arising out of this sale shall be subject exclusively to the courts of New Delhi, irrespective of where the customer resides.
4. Limitation of Liability: Seller liability shall not exceed 10% of the product invoice price for any defect or hazard caused by the product.`
  },
  {
    id: "freelance-contract",
    title: "Freelance_Service_Contract_V2.doc",
    category: "Employment Issue",
    description: "Consulting agreement with unlimited free revisions and INR 50L indemnity.",
    samplePrompt: "I am a freelancer and a client sent me this consulting agreement. Please review the payment terms and indemnity clause for risks and loopholes.",
    content: `[DOCUMENT: FREELANCE SOFTWARE CONSULTING AGREEMENT]
1. Payment Terms: Payment of INR 1,50,000 shall be made within 120 days after final client approval. Client may reject work without payment at its sole discretion.
2. Unlimited Revisions: Contractor shall provide unlimited design and code revisions until Client is satisfied, without any additional fees.
3. Indemnity Clause: Contractor agrees to indemnify Client for up to INR 50,00,000 against any third-party claims or bugs in the deliverable.`
  }
];

const POPULAR_CATEGORIES = [
  "Cyber Crime",
  "Consumer Dispute",
  "Property Dispute",
  "Employment Issue",
  "Harassment",
  "Cheating & Financial Fraud"
];

export default function DescribeIssuePage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Voice Recording Hook
  const { isRecording, interimText, toggleRecording } = useVoiceRecording({
    onTranscript: (chunk) => {
      setText((prev) => (prev ? prev.trim() + " " : "") + chunk);
    },
  });

  // Attached File State
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [attachedDocText, setAttachedDocText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Date & Place Input Form State
  const [showDatePlace, setShowDatePlace] = useState(false);
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentPlace, setIncidentPlace] = useState("");

  const router = useRouter();

  const handleToggleCategory = (cat: string) => {
    if (selectedCategory === cat) {
      setSelectedCategory(null);
      setText((prev) => prev.replace(`[Category: ${cat}]\n`, "").replace(`[Category: ${cat}]`, "").trim());
    } else {
      const prevCat = selectedCategory;
      setSelectedCategory(cat);
      let cleaned = text;
      if (prevCat) {
        cleaned = cleaned.replace(`[Category: ${prevCat}]\n`, "").replace(`[Category: ${prevCat}]`, "").trim();
      }
      setText(`[Category: ${cat}]\n` + (cleaned ? cleaned.trim() : ""));
    }
  };

  const handleApplyDatePlace = () => {
    const parts = [];
    if (incidentDate.trim()) parts.push(`Date: ${incidentDate.trim()}`);
    if (incidentPlace.trim()) parts.push(`Place: ${incidentPlace.trim()}`);
    if (parts.length > 0) {
      const tag = `[${parts.join(", ")}]`;
      setText((prev) => (prev.trim() ? `${prev.trim()}\n${tag}` : tag));
      setShowDatePlace(false);
      setIncidentDate("");
      setIncidentPlace("");
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim() && !attachedDocText) return;
    
    setIsLoading(true);
    try {
      const promptToAnalyze = attachedDocText
        ? `USER LEGAL ISSUE DESCRIPTION:\n${text || "Please analyze the attached document for loopholes, risks, and important clauses."}\n\nATTACHED LEGAL DOCUMENT FOR CLAUSE & LOOPHOLE ANALYSIS:\n${attachedDocText}`
        : text;

      const res = await analyzeLegalIssueAction(promptToAnalyze);
      if (res.success && res.data) {
        
        const payload = {
          originalIssue: text,
          attachedDocumentName: attachedFile || null,
          attachedDocumentText: attachedDocText || null,
          category: selectedCategory || res.data.category || null,
          ...res.data
        };

        // If user is logged in, save to Firestore
        if (auth.currentUser) {
          try {
            await addDoc(collection(db, "cases"), {
              ...payload,
              userId: auth.currentUser.uid,
              createdAt: serverTimestamp(),
              status: "Analyzed"
            });
          } catch (e) {
            console.error("Failed to save case to Firestore:", e);
          }
        }

        // Save AI response and original text to sessionStorage for immediate UI
        sessionStorage.setItem("nyaya_ai_analysis", JSON.stringify(payload));
        // Navigate to the case analysis page
        router.push("/dashboard/ai-assistant");
      } else {
        alert(res.error || "Failed to analyze issue.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-text-muted font-semibold">
        <Link href="/dashboard" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight size={13} className="text-gray-400" />
        <span className="text-text-main font-bold">Describe Issue</span>
      </nav>

      {/* Main Grid: Left Column (Inputs) & Right Column (Guides) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
        
        {/* Left Main Content */}
        <div className="space-y-6 sm:space-y-7">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">Describe Your Issue</h1>
              <p className="text-xs sm:text-sm text-text-muted mt-1">Tell us your legal problem in your own words. Our AI will analyze it and guide you.</p>
            </div>
            <div className="flex items-center gap-2.5 bg-white border border-border-main px-3.5 py-2 rounded-xl shrink-0 shadow-2xs self-start sm:self-auto">
              <ShieldCheck size={18} className="text-green-600 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Privacy Protection</p>
                <p className="text-xs font-bold text-text-main">100% Secure & Private</p>
              </div>
            </div>
          </div>

          {/* Text Area Card */}
          <div className="bg-white border border-border-main rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col relative focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-text-main flex items-center gap-1">
                <span>Describe your legal issue</span>
                <span className="text-red-500 font-black">*</span>
              </label>
              <div className="flex items-center gap-3">
                {text.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setText(""); setSelectedCategory(null); }}
                    className="text-xs text-text-muted hover:text-red-600 font-semibold transition-colors"
                  >
                    Clear text
                  </button>
                )}
                <span className="text-xs font-semibold text-text-muted">{text.length} / 3000</span>
              </div>
            </div>

            {/* Microphone Recording Banner */}
            {isRecording && (
              <div className="flex items-center justify-between bg-red-50 border border-red-300 text-red-900 px-3.5 py-2 rounded-xl mb-3 shadow-xs animate-pulse">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                  <span className="text-xs sm:text-sm font-bold truncate">
                    Listening to microphone... {interimText ? `"${interimText}"` : "Speak your issue clearly now"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className="text-red-700 underline text-xs font-black hover:opacity-80 shrink-0 ml-2"
                >
                  Stop Recording
                </button>
              </div>
            )}

            <textarea 
              className="w-full h-44 sm:h-48 resize-none bg-transparent outline-none text-text-main placeholder:text-text-muted text-sm leading-relaxed"
              placeholder="Example: My landlord is not returning my security deposit and not responding to my messages."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={3000}
              disabled={isLoading}
            />
          </div>

          {/* Add more details (Interactive Action Tiles) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main">
                Add more details <span className="text-text-muted font-normal">(Optional)</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Upload Document */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    setAttachedFile(file.name);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setAttachedDocText(
                        (event.target?.result as string) ||
                        `[DOCUMENT: ${file.name}]\nUploaded document content loaded for AI analysis.`
                      );
                    };
                    reader.readAsText(file);
                  }
                }} 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-start p-3.5 sm:p-4 border rounded-2xl transition-all text-left group shadow-2xs hover:shadow-xs ${
                  attachedFile 
                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950' 
                    : 'bg-white border-border-main hover:border-black'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                  attachedFile ? 'bg-emerald-600 text-white' : 'bg-bg-subtle text-text-main group-hover:bg-black group-hover:text-white transition-colors'
                }`}>
                  <Upload size={16} />
                </div>
                <span className="text-xs sm:text-sm font-bold leading-snug">
                  {attachedFile ? 'Doc Attached' : 'Upload Document'}
                </span>
                <span className="text-[10px] text-text-muted mt-1 leading-tight line-clamp-2">
                  {attachedFile ? attachedFile : 'Attach notices, bills or agreements'}
                </span>
              </button>
              
              {/* 2. Record Voice */}
              <button 
                type="button"
                onClick={toggleRecording}
                className={`flex flex-col items-start p-3.5 sm:p-4 border rounded-2xl transition-all text-left group shadow-2xs hover:shadow-xs ${
                  isRecording 
                    ? "bg-red-50 border-red-500 animate-pulse" 
                    : "bg-white border-border-main hover:border-black"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                  isRecording ? 'bg-red-600 text-white' : 'bg-bg-subtle text-text-main group-hover:bg-black group-hover:text-white transition-colors'
                }`}>
                  <Mic size={16} />
                </div>
                <span className={`text-xs sm:text-sm font-bold leading-snug ${isRecording ? "text-red-700" : ""}`}>
                  {isRecording ? "Listening..." : "Record Voice"}
                </span>
                <span className="text-[10px] text-text-muted mt-1 leading-tight">
                  {isRecording ? "Click to stop" : "Speak your issue naturally"}
                </span>
              </button>
              
              {/* 3. Select Category */}
              <button 
                type="button"
                onClick={() => categoriesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className={`flex flex-col items-start p-3.5 sm:p-4 border rounded-2xl transition-all text-left group shadow-2xs hover:shadow-xs ${
                  selectedCategory 
                    ? 'bg-blue-50/80 border-blue-400 text-blue-950' 
                    : 'bg-white border-border-main hover:border-black'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                  selectedCategory ? 'bg-blue-600 text-white' : 'bg-bg-subtle text-text-main group-hover:bg-black group-hover:text-white transition-colors'
                }`}>
                  <LayoutGrid size={16} />
                </div>
                <span className="text-xs sm:text-sm font-bold leading-snug truncate w-full">
                  {selectedCategory ? selectedCategory : 'Select Category'}
                </span>
                <span className="text-[10px] text-text-muted mt-1 leading-tight truncate w-full">
                  {selectedCategory ? 'Category selected' : 'Choose matching domain'}
                </span>
              </button>
              
              {/* 4. Add Date & Place */}
              <button 
                type="button"
                onClick={() => setShowDatePlace(prev => !prev)}
                className={`flex flex-col items-start p-3.5 sm:p-4 border rounded-2xl transition-all text-left group shadow-2xs hover:shadow-xs ${
                  showDatePlace 
                    ? 'bg-purple-50/80 border-purple-400 text-purple-950' 
                    : 'bg-white border-border-main hover:border-black'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                  showDatePlace ? 'bg-purple-600 text-white' : 'bg-bg-subtle text-text-main group-hover:bg-black group-hover:text-white transition-colors'
                }`}>
                  <Calendar size={16} />
                </div>
                <span className="text-xs sm:text-sm font-bold leading-snug">
                  {showDatePlace ? 'Close Details' : 'Add Date & Place'}
                </span>
                <span className="text-[10px] text-text-muted mt-1 leading-tight">
                  Help establish jurisdiction
                </span>
              </button>
            </div>

            {/* Expandable Date & Place Interactive Form */}
            {showDatePlace && (
              <div className="p-4 bg-white border border-border-main rounded-2xl shadow-xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <MapPin size={14} className="text-purple-600" />
                    Specify Incident Date & Location
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowDatePlace(false)}
                    className="text-text-muted hover:text-black text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-muted block mb-1">Date of Incident</label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full px-3 py-2 bg-bg-subtle border border-border-main rounded-xl text-xs font-semibold text-text-main outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-muted block mb-1">City / State</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={incidentPlace}
                      onChange={(e) => setIncidentPlace(e.target.value)}
                      className="w-full px-3 py-2 bg-bg-subtle border border-border-main rounded-xl text-xs font-semibold text-text-main outline-none focus:border-black"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleApplyDatePlace}
                    disabled={!incidentDate && !incidentPlace}
                    className="px-4 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-40"
                  >
                    Apply to Issue
                  </button>
                </div>
              </div>
            )}

            {/* Readymade Demo Documents for AI Clause & Loophole Analysis */}
            <div className="p-4 sm:p-5 rounded-2xl bg-bg-subtle border border-border-main space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-brand-primary shrink-0" />
                  <span className="text-xs font-bold text-text-main uppercase tracking-wider">
                    Demo Legal Documents (Optional Readymade Uploads)
                  </span>
                </div>
                <span className="text-[11px] text-text-muted font-medium">
                  Click any document to load & test AI clause/loophole analysis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {DEMO_LEGAL_DOCUMENTS.map((doc) => {
                  const isSelected = attachedFile === doc.title;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        setAttachedFile(doc.title);
                        setAttachedDocText(doc.content);
                        if (!text.trim()) {
                          setText(doc.samplePrompt);
                        }
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all shadow-2xs ${
                        isSelected
                          ? "bg-black text-white border-black shadow-xs scale-[1.01]"
                          : "bg-white text-text-main border-border-main hover:border-black hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                        }`}>
                          {doc.category}
                        </span>
                        {isSelected && <Check size={14} className="text-green-400 shrink-0" />}
                      </div>
                      <span className="text-xs font-bold truncate w-full mt-1">{doc.title}</span>
                      <span className={`text-[10px] line-clamp-2 mt-1 leading-snug ${
                        isSelected ? "text-gray-300" : "text-text-muted"
                      }`}>
                        {doc.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Attached Document Banner & Text Preview */}
              {attachedFile && (
                <div className="p-3.5 rounded-xl bg-white border border-border-main flex flex-col gap-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-text-main min-w-0">
                      <FileText size={16} className="text-brand-primary shrink-0" />
                      <span className="truncate">Attached: {attachedFile}</span>
                      <span className="text-[10px] bg-green-100 text-green-800 border border-green-300 px-2 py-0.5 rounded-full font-bold uppercase shrink-0 hidden sm:inline">
                        Ready for AI Analysis
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachedFile(null);
                        setAttachedDocText(null);
                      }}
                      className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1 shrink-0"
                    >
                      <X size={14} /> Remove Doc
                    </button>
                  </div>
                  {attachedDocText && (
                    <div className="bg-bg-subtle/70 border border-border-main rounded-lg p-3 font-mono text-[11px] text-text-main max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {attachedDocText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Popular Categories */}
          <div ref={categoriesRef} className="space-y-2.5 pt-1">
            <h3 className="text-sm font-bold text-text-main">Popular Categories</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {POPULAR_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isActive 
                        ? 'bg-black text-white border-black shadow-xs' 
                        : 'bg-white border-border-main text-text-main hover:border-black hover:bg-bg-subtle'
                    }`}
                  >
                    <LayoutGrid size={12} className={isActive ? 'text-white' : 'text-text-muted'} />
                    <span>{cat}</span>
                    {isActive && <Check size={12} className="text-green-400 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 space-y-3">
            <button 
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || (!text.trim() && !attachedDocText)}
              className="w-full bg-black hover:bg-neutral-800 text-white font-extrabold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Analyzing Issue with NyayaAI...</span>
                </>
              ) : (
                <>
                  <span>Analyze My Issue</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-text-muted text-xs font-medium">
              <Lock size={12} />
              <span>No personal data is stored or shared with external third parties</span>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Guide & Helplines */}
        <div className="space-y-5 lg:space-y-6">
          
          {/* How it works */}
          <div className="bg-white border border-border-main rounded-2xl p-5 sm:p-6 shadow-xs">
            <h3 className="font-bold text-text-main text-sm sm:text-base mb-5">How it works?</h3>
            <div className="relative space-y-5">
              {/* Vertical connecting line down the center of 36px circles */}
              <div className="absolute left-[17px] top-4 bottom-4 w-px bg-gray-200 border-l border-dashed border-gray-300"></div>
              
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border-2 border-black text-black font-extrabold text-xs shrink-0 shadow-2xs">
                  1
                </div>
                <div className="pt-0.5 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-text-main">Describe Your Issue</h4>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">Share your problem in simple words or voice.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border-2 border-black text-black font-extrabold text-xs shrink-0 shadow-2xs">
                  2
                </div>
                <div className="pt-0.5 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-text-main">AI Analyzes</h4>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">Our AI identifies legal rights, acts, and statutory rules.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border-2 border-black text-black font-extrabold text-xs shrink-0 shadow-2xs">
                  3
                </div>
                <div className="pt-0.5 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-text-main">Get Guidance</h4>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">Receive evidence checklists, forum jurisdiction & timelines.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center border-2 border-black font-extrabold text-xs shrink-0 shadow-xs">
                  4
                </div>
                <div className="pt-0.5 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-text-main">Take Action</h4>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">Generate ready-to-use complaint notices & formal letters.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips for better results */}
          <div className="bg-white border border-border-main rounded-2xl p-5 sm:p-6 shadow-xs">
            <h3 className="font-bold text-text-main text-xs sm:text-sm mb-3.5 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <span>Tips for better results</span>
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} />
                </div>
                <span className="text-xs text-text-muted leading-relaxed font-medium">Provide clear chronological sequence of events.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} />
                </div>
                <span className="text-xs text-text-muted leading-relaxed font-medium">Attach contracts, invoices, or screenshots if available.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} />
                </div>
                <span className="text-xs text-text-muted leading-relaxed font-medium">Mention monetary amounts, dates, and names if possible.</span>
              </li>
            </ul>
          </div>

          {/* Need Urgent Help */}
          <div className="bg-white border border-border-main rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-text-main">Need urgent help?</h4>
                <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">Contact relevant authorities immediately in emergencies.</p>
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <a 
                href="tel:112" 
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <PhoneCall size={14} />
                  <span>Call 112 (National Emergency)</span>
                </span>
                <ArrowRight size={13} />
              </a>
              <a 
                href="tel:1091" 
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-bg-subtle hover:bg-gray-200 text-text-main border border-border-main rounded-xl text-xs font-bold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <PhoneCall size={14} className="text-purple-600" />
                  <span>Women Helpline (1091)</span>
                </span>
                <ArrowRight size={13} className="text-text-muted" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Disclaimer */}
      <div className="bg-bg-subtle rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border-main">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-border-main flex items-center justify-center shrink-0 shadow-2xs">
            <Scale size={20} className="text-text-main" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-text-main leading-snug">
              We are here to help you understand your rights, not replace legal professionals.
            </h4>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              For complex litigation and court representation, we recommend consulting a qualified advocate enrolled under the Bar Council.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-border-main text-xs font-bold text-text-muted shrink-0 shadow-2xs">
          <ShieldCheck size={16} className="text-green-600" />
          <span>Legal Citizen Advisory</span>
        </div>
      </div>

    </main>
  );
}
