"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";

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
  Scale
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

export default function DescribeIssuePage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isRecording, interimText, toggleRecording } = useVoiceRecording({
    onTranscript: (chunk) => {
      setText((prev) => (prev ? prev.trim() + " " : "") + chunk);
    },
  });
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [attachedDocText, setAttachedDocText] = useState<string | null>(null);
  const [showDemoDocs, setShowDemoDocs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

        // Save the AI response and original text to sessionStorage for immediate UI
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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4 font-semibold">
        <span>Home</span>
        <ChevronRight size={14} />
        <span className="text-text-main">Describe Issue</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        
        {/* Left Main Content */}
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-main mb-2 tracking-tight">Describe Your Issue</h1>
              <p className="text-text-muted">Tell us your legal problem in your own words. Our AI will analyze it and guide you.</p>
            </div>
            <div className="flex items-center gap-2 bg-bg-subtle border border-border-main px-4 py-2.5 rounded-xl shrink-0">
              <ShieldCheck size={20} className="text-text-main" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-tight text-text-muted">Your information is</span>
                <span className="text-xs font-bold leading-tight">100% secure & private</span>
              </div>
            </div>
          </div>

          {/* Text Area Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col relative focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
            <label className="text-sm font-bold text-text-main mb-4 flex items-center gap-1">
              Describe your legal issue <span className="text-red-500">*</span>
            </label>
            {isRecording && (
              <div className="flex items-center justify-between bg-red-50 border-2 border-red-400 text-red-900 px-4 py-2.5 rounded-xl mb-3 shadow-xs animate-pulse">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="text-xs sm:text-sm font-bold">
                    Listening to microphone... {interimText ? `"${interimText}"` : "Speak your issue clearly now"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className="text-red-700 underline text-xs font-black hover:opacity-80"
                >
                  Stop Recording
                </button>
              </div>
            )}
            <textarea 
              className="w-full h-48 resize-none bg-transparent outline-none text-text-main placeholder:text-text-light text-sm"
              placeholder="Example: My landlord is not returning my security deposit and not responding to my messages."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={3000}
              disabled={isLoading}
            />
            <div className="self-end text-xs font-semibold text-text-light mt-2">
              {text.length} / 3000
            </div>
          </div>

          {/* Add more details */}
          <div>
            <h3 className="text-sm font-bold text-text-main mb-3">Add more details <span className="text-text-muted font-semibold">(Optional)</span></h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-start p-4 border rounded-2xl hover:shadow-md transition-all text-left ${attachedFile ? 'bg-green-50 border-green-500' : 'bg-white border-border-main hover:border-text-light'}`}
              >
                <Upload size={20} className={`${attachedFile ? 'text-green-700' : 'text-text-main'} mb-3`} />
                <span className={`text-sm font-bold ${attachedFile ? 'text-green-800' : 'text-text-main'}`}>
                  {attachedFile ? 'Document Attached' : 'Upload Document'}
                </span>
                <span className="text-[10px] text-text-muted mt-1 leading-snug line-clamp-2">
                  {attachedFile ? attachedFile : 'Attach screenshots, notice, agreements, etc.'}
                </span>
              </button>
              
              <button 
                type="button"
                onClick={toggleRecording}
                className={`flex flex-col items-start p-4 border rounded-2xl transition-all text-left ${
                  isRecording 
                    ? "bg-red-50 border-red-500 animate-pulse shadow-md" 
                    : "bg-white border-border-main hover:border-text-light hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <Mic size={20} className={isRecording ? "text-red-600 animate-bounce" : "text-text-main"} />
                  {isRecording && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  )}
                </div>
                <span className={`text-sm font-bold ${isRecording ? "text-red-700" : "text-text-main"}`}>
                  {isRecording ? "Stop Recording" : "Record Voice"}
                </span>
                <span className="text-[10px] text-text-muted mt-1 leading-snug">
                  {isRecording ? "Listening to microphone..." : "Explain your issue using voice"}
                </span>
              </button>
              
              <button 
                onClick={() => setText(prev => prev + (prev ? "\n" : "") + "[Category: Property Dispute]")}
                className="flex flex-col items-start p-4 bg-white border border-border-main rounded-2xl hover:border-text-light hover:shadow-md transition-all text-left"
              >
                <LayoutGrid size={20} className="text-text-main mb-3" />
                <span className="text-sm font-bold text-text-main">Select Category</span>
                <span className="text-[10px] text-text-muted mt-1 leading-snug">Choose the best matching category</span>
              </button>
              
              <button 
                onClick={() => setText(prev => prev + (prev ? "\n" : "") + `[Date: ${new Date().toLocaleDateString()}, Place: Mumbai, India]`)}
                className="flex flex-col items-start p-4 bg-white border border-border-main rounded-2xl hover:border-text-light hover:shadow-md transition-all text-left"
              >
                <Calendar size={20} className="text-text-main mb-3" />
                <span className="text-sm font-bold text-text-main">Add Date & Place</span>
                <span className="text-[10px] text-text-muted mt-1 leading-snug">Help us understand better</span>
              </button>
            </div>

            {/* Readymade Demo Documents for AI Clause & Loophole Analysis */}
            <div className="mt-4 p-5 rounded-2xl bg-bg-subtle border border-border-main">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-primary" />
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
                      onClick={() => {
                        setAttachedFile(doc.title);
                        setAttachedDocText(doc.content);
                        if (!text.trim()) {
                          setText(doc.samplePrompt);
                        }
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-black text-white border-black shadow-md scale-[1.02]"
                          : "bg-white text-text-main border-border-main hover:border-black hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                        }`}>
                          {doc.category}
                        </span>
                        {isSelected && <Check size={14} className="text-green-400" />}
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
                <div className="mt-4 p-4 rounded-xl bg-white border-2 border-black/80 flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-text-main">
                      <FileText size={16} className="text-brand-primary" />
                      <span>Attached: {attachedFile}</span>
                      <span className="text-[10px] bg-green-100 text-green-800 border border-green-300 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                        Ready for AI Loophole & Clause Analysis
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setAttachedFile(null);
                        setAttachedDocText(null);
                      }}
                      className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1"
                    >
                      <X size={14} /> Remove Doc
                    </button>
                  </div>
                  {attachedDocText && (
                    <div className="bg-bg-subtle/60 border border-border-main rounded-lg p-3 font-mono text-xs text-text-main max-h-36 overflow-y-auto whitespace-pre-wrap">
                      {attachedDocText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-bold text-text-main mb-3">Popular Categories</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Cyber Crime
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Consumer Dispute
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Property Dispute
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Employment Issue
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-main rounded-full text-sm font-medium hover:bg-bg-subtle transition-colors">
                <LayoutGrid size={14} /> Harassment
              </button>
              <button className="p-2 bg-white border border-border-main rounded-full text-text-main hover:bg-bg-subtle transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col items-center mt-6 max-w-sm mx-auto w-full">
            <button 
              onClick={handleAnalyze}
              disabled={isLoading || !text.trim()}
              className="w-full bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing Issue...
                </>
              ) : (
                <>
                  Analyze My Issue <ArrowRight size={18} />
                </>
              )}
            </button>
            <div className="flex items-center gap-1.5 mt-3 text-text-muted text-xs font-semibold">
              <Lock size={12} />
              <span>No personal data is stored or shared</span>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* How it works */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-6">How it works?</h3>
            <div className="relative pl-6 space-y-6">
              {/* Vertical line */}
              <div className="absolute left-10 top-6 bottom-6 w-px bg-border-main border-dashed border-l-2"></div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center border border-border-main shrink-0">
                  <BrainCircuit size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Describe Your Issue</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Share your problem in simple words.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center border border-border-main shrink-0">
                  <Search size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AI Analyzes</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Our AI understands your issue and finds relevant laws.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center border border-border-main shrink-0">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Get Guidance</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Receive step-by-step guidance, evidence checklist & more.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center border border-border-main shrink-0">
                  <Rocket size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Take Action</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Generate documents and get directed to the right authority.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-4">Tips for better results</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check size={16} className="text-text-main mt-0.5 shrink-0" />
                <span className="text-[12px] text-text-muted leading-relaxed font-medium">Provide clear and specific details.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-text-main mt-0.5 shrink-0" />
                <span className="text-[12px] text-text-muted leading-relaxed font-medium">Attach relevant documents or screenshots.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-text-main mt-0.5 shrink-0" />
                <span className="text-[12px] text-text-muted leading-relaxed font-medium">Mention dates, amounts and names if possible.</span>
              </li>
            </ul>
          </div>

          {/* Urgent Help */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-text-main" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Need urgent help?</h4>
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Contact the relevant authorities immediately if it's an emergency.</p>
              </div>
            </div>
            <a href="tel:112" className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">
              <PhoneCall size={16} />
              Call 112 (National Emergency)
            </a>
            <a href="tel:1091" className="w-full flex items-center justify-center gap-2 bg-white text-text-main border border-border-main py-2.5 rounded-xl text-sm font-bold hover:bg-bg-subtle transition-colors mt-2">
              <PhoneCall size={16} />
              Women Helpline (1091)
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Legal Disclaimer */}
      <div className="mt-8 bg-bg-subtle rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden border border-border-main">
        <div className="relative z-10 flex items-start gap-4 flex-1">
          <div className="bg-white p-2 rounded-xl border border-border-main shadow-sm shrink-0">
            <ShieldCheck size={24} className="text-text-main" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-text-main">We are here to help you understand your rights, not replace legal professionals.</h4>
            <p className="text-xs text-text-muted mt-1">For complex legal matters, we recommend consulting a qualified lawyer.</p>
          </div>
        </div>
        {/* Placeholder graphic for gavel/books */}
        <div className="hidden md:block w-32 h-20 bg-gray-200/50 rounded-lg shrink-0 relative z-10 flex items-center justify-center border border-border-main text-text-light text-xs font-bold uppercase">
          Graphic
        </div>
      </div>

    </main>
  );
}
