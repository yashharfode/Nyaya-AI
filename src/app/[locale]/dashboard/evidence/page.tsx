"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronRight, 
  ShoppingCart,
  Eye,
  Image as ImageIcon,
  CheckCircle2,
  Package,
  MessageSquare,
  Upload,
  AlertTriangle,
  IdCard,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Headphones,
  Check,
  X,
  Download,
  Trash2,
  Plus,
  Cloud,
  HardDrive,
  FileText,
  FileCheck,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export interface EvidenceItem {
  id: string;
  title: string;
  isMandatory: boolean;
  description: string;
  whyNeeded: string;
  iconType: "image" | "package" | "message" | "alert" | "idcard" | "file";
  status: "collected" | "pending";
  fileData?: {
    name: string;
    size: string;
    sizeBytes: number;
    uploadedOn: string;
    dataUrl?: string;
    storageTarget: "firebase" | "localstorage" | "both";
  };
}

const INITIAL_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: "payment-proof",
    title: "Payment Proof",
    isMandatory: true,
    description: "Screenshot or download of the payment confirmation, transaction ID, amount, date and time.",
    whyNeeded: "Proves money was transferred under Indian Evidence Act.",
    iconType: "image",
    status: "collected",
    fileData: {
      name: "Payment_Receipt_UPI_REF84192.png",
      size: "1.2 MB",
      sizeBytes: 1258291,
      uploadedOn: "12 May 2025, 11:30 AM",
      storageTarget: "both"
    }
  },
  {
    id: "order-invoice",
    title: "Order Details / Invoice",
    isMandatory: true,
    description: "Screenshot or PDF of the order details, invoice, or any purchase receipt from seller.",
    whyNeeded: "Proves the commercial transaction and contractual agreement.",
    iconType: "package",
    status: "collected",
    fileData: {
      name: "Invoice_INV-99201.pdf",
      size: "845 KB",
      sizeBytes: 865280,
      uploadedOn: "12 May 2025, 11:28 AM",
      storageTarget: "both"
    }
  },
  {
    id: "seller-chat",
    title: "Conversation with Seller",
    isMandatory: true,
    description: "Chats, emails or WhatsApp messages where you discussed the payment, promises or complaint.",
    whyNeeded: "Proves seller's acknowledgment and subsequent breach of promise.",
    iconType: "message",
    status: "pending"
  },
  {
    id: "deficiency-proof",
    title: "Proof of Non-Delivery / Deficiency",
    isMandatory: false,
    description: "Any evidence showing the product/service was not delivered or was defective. (Photos, video unboxing, etc.)",
    whyNeeded: "Proves deficiency in service under Consumer Protection Act 2019.",
    iconType: "alert",
    status: "pending"
  },
  {
    id: "identity-proof",
    title: "Your Identity Proof",
    isMandatory: false,
    description: "Aadhaar card, PAN card, or any government ID proof.",
    whyNeeded: "Required by police cyber cell and consumer dispute commissions for verification.",
    iconType: "idcard",
    status: "pending"
  }
];

const LOCAL_STORAGE_EVIDENCE_KEY = "nyaya_evidence_checklist_items";

export default function EvidenceChecklistPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [activeUploadTargetId, setActiveUploadTargetId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);
  const [statusNotice, setStatusNotice] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Custom Evidence Item Form State
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customIsMandatory, setCustomIsMandatory] = useState(false);

  // Hidden File Input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load and synchronize with Firebase Firestore & LocalStorage
  useEffect(() => {
    const localSaved = localStorage.getItem(LOCAL_STORAGE_EVIDENCE_KEY);
    if (localSaved) {
      try {
        setEvidenceItems(JSON.parse(localSaved));
      } catch {
        setEvidenceItems(INITIAL_EVIDENCE_ITEMS);
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync with Firestore subcollection: users/{userId}/evidence
        const evidenceRef = collection(db, "users", user.uid, "evidence");
        const unsubscribeFirestore = onSnapshot(evidenceRef, (snapshot) => {
          if (!snapshot.empty) {
            const remoteMap = new Map();
            snapshot.docs.forEach(d => {
              remoteMap.set(d.id, d.data());
            });

            setEvidenceItems(prev => {
              const updated = prev.map(item => {
                if (remoteMap.has(item.id)) {
                  const r = remoteMap.get(item.id);
                  return {
                    ...item,
                    status: "collected",
                    fileData: {
                      name: r.fileName || r.name || "Uploaded Evidence",
                      size: r.size || "Unknown",
                      sizeBytes: r.sizeBytes || 1024,
                      uploadedOn: r.uploadedOn || new Date().toLocaleString(),
                      dataUrl: r.dataUrl || "",
                      storageTarget: "firebase"
                    }
                  } as EvidenceItem;
                }
                return item;
              });
              localStorage.setItem(LOCAL_STORAGE_EVIDENCE_KEY, JSON.stringify(updated));
              return updated;
            });
          }
        }, (err) => {
          console.warn("Firestore evidence sync notice:", err);
        });

        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 KB";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Trigger file upload for a specific evidence requirement
  const handleInitiateUpload = (itemId: string) => {
    setActiveUploadTargetId(itemId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Handle File Selected
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTargetId) return;

    setIsUploading(true);
    setStatusNotice(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }) + ", " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const sizeFormatted = formatBytes(file.size);
        const targetItem = evidenceItems.find(i => i.id === activeUploadTargetId);

        const fileRecord = {
          name: file.name,
          size: sizeFormatted,
          sizeBytes: file.size,
          uploadedOn: formattedDate,
          dataUrl: base64Data,
          storageTarget: currentUser ? ("both" as const) : ("localstorage" as const)
        };

        // 1. Save to Firebase Firestore if logged in
        let firestoreOk = false;
        if (currentUser) {
          try {
            await addDoc(collection(db, "users", currentUser.uid, "evidence"), {
              evidenceId: activeUploadTargetId,
              title: targetItem?.title || "Evidence Document",
              fileName: file.name,
              size: sizeFormatted,
              sizeBytes: file.size,
              uploadedOn: formattedDate,
              dataUrl: file.size < 700000 ? base64Data : "",
              caseId: "NYA-2025-0512-001",
              createdAt: serverTimestamp()
            });
            firestoreOk = true;
          } catch (fbErr) {
            console.warn("Firestore save notice:", fbErr);
          }
        }

        // 2. Update local state & localStorage
        const updatedItems = evidenceItems.map(item => {
          if (item.id === activeUploadTargetId) {
            return {
              ...item,
              status: "collected" as const,
              fileData: fileRecord
            };
          }
          return item;
        });

        setEvidenceItems(updatedItems);
        localStorage.setItem(LOCAL_STORAGE_EVIDENCE_KEY, JSON.stringify(updatedItems));

        setStatusNotice({
          message: firestoreOk 
            ? `"${file.name}" uploaded & saved to Firebase Cloud & LocalStorage!` 
            : `"${file.name}" saved to LocalStorage!`,
          type: "success"
        });
        setTimeout(() => setStatusNotice(null), 4000);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setStatusNotice({ message: err?.message || "Failed to process file", type: "error" });
    } finally {
      setIsUploading(false);
      setActiveUploadTargetId(null);
    }
  };

  // Remove uploaded evidence
  const handleRemoveEvidence = (itemId: string) => {
    const updated = evidenceItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: "pending" as const,
          fileData: undefined
        };
      }
      return item;
    });

    setEvidenceItems(updated);
    localStorage.setItem(LOCAL_STORAGE_EVIDENCE_KEY, JSON.stringify(updated));
    if (previewItem?.id === itemId) setPreviewItem(null);

    setStatusNotice({ message: "Evidence file removed", type: "success" });
    setTimeout(() => setStatusNotice(null), 3000);
  };

  // Download evidence file
  const handleDownloadEvidence = (item: EvidenceItem) => {
    if (item.fileData?.dataUrl) {
      const a = document.createElement("a");
      a.href = item.fileData.dataUrl;
      a.download = item.fileData.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const text = `EVIDENCE RECORD: ${item.title}\nStatus: Verified Collected\nCase: Online Transaction Fraud\nUploaded On: ${item.fileData?.uploadedOn || "Recorded"}`;
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Add custom evidence checklist item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newItem: EvidenceItem = {
      id: "custom-" + Date.now(),
      title: customTitle.trim(),
      isMandatory: customIsMandatory,
      description: customDescription.trim() || "Additional case document specified by applicant.",
      whyNeeded: "Submitted as supplementary corroborating evidence.",
      iconType: "file",
      status: "pending"
    };

    const updated = [...evidenceItems, newItem];
    setEvidenceItems(updated);
    localStorage.setItem(LOCAL_STORAGE_EVIDENCE_KEY, JSON.stringify(updated));

    setCustomTitle("");
    setCustomDescription("");
    setCustomIsMandatory(false);
    setIsAddCustomOpen(false);

    setStatusNotice({ message: "New evidence checklist requirement added!", type: "success" });
    setTimeout(() => setStatusNotice(null), 3000);
  };

  // Compute metrics
  const collectedCount = evidenceItems.filter(i => i.status === "collected").length;
  const totalCount = evidenceItems.length;
  const progressPercent = totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;
  const mandatoryItems = evidenceItems.filter(i => i.isMandatory);
  const mandatoryCollected = mandatoryItems.filter(i => i.status === "collected").length;
  const allMandatoryCollected = mandatoryCollected === mandatoryItems.length && mandatoryItems.length > 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,image/*" 
        className="hidden" 
      />

      {/* Toast Notice */}
      {statusNotice && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold transition-all shadow-md ${
          statusNotice.type === "success" 
            ? "bg-emerald-50 border border-emerald-300 text-emerald-900" 
            : "bg-red-50 border border-red-300 text-red-900"
        }`}>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-600" />
            <span>{statusNotice.message}</span>
          </div>
          <button onClick={() => setStatusNotice(null)} className="hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4 font-semibold">
        <span className="hover:text-text-main cursor-pointer" onClick={() => router.push("/dashboard")}>Home</span>
        <ChevronRight size={14} />
        <span className="hover:text-text-main cursor-pointer" onClick={() => router.push("/dashboard/ai-assistant")}>Case Analysis</span>
        <ChevronRight size={14} />
        <span className="text-text-main">Evidence Checklist</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* Main Content (Left) */}
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-black text-text-main tracking-tight">Evidence Checklist</h1>
                <div className="bg-bg-subtle text-text-main px-3 py-1 rounded-full text-xs font-bold border border-border-main">
                  Step 2 of 5
                </div>
              </div>
              <p className="text-text-muted text-sm font-medium">
                Upload and organize all proofs directly to strengthen your case before filing.
              </p>
            </div>
            
            <button
              onClick={() => setIsAddCustomOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-border-main hover:border-black rounded-xl text-xs font-bold text-text-main hover:bg-bg-subtle transition-all shrink-0 shadow-2xs"
            >
              <Plus size={15} /> Add Custom Item
            </button>
          </div>

          {/* Top Case Details Card */}
          <div className="bg-white border border-border-main rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-bg-subtle rounded-xl flex items-center justify-center shrink-0 border border-border-main">
                <ShoppingCart size={24} className="text-text-main" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-text-main">Case: Online Transaction Fraud</h3>
                <p className="text-xs text-text-muted font-mono">Case ID: NYA-2025-0512-001</p>
              </div>
            </div>
            <button 
              onClick={() => router.push("/dashboard/ai-assistant")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border-main rounded-xl text-xs font-bold hover:bg-bg-subtle transition-colors shrink-0 shadow-2xs"
            >
              <Eye size={15} />
              View Case Analysis
            </button>
          </div>

          {/* Evidence Checklist Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-text-main">Required Evidence Items</h3>
              <span className="text-xs font-bold text-text-muted">
                {collectedCount} of {totalCount} Collected
              </span>
            </div>
            
            <div className="space-y-3">
              {evidenceItems.map((item) => (
                <div 
                  key={item.id}
                  className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-xs transition-all ${
                    item.status === "collected" ? "border-emerald-200 bg-emerald-50/10" : "border-border-main hover:border-black"
                  }`}
                >
                  {/* Left Info */}
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      item.status === "collected"
                        ? "bg-emerald-100/60 border-emerald-300 text-emerald-800"
                        : "bg-bg-subtle border-border-main text-text-main"
                    }`}>
                      {item.iconType === "package" ? <Package size={20} /> :
                       item.iconType === "message" ? <MessageSquare size={20} /> :
                       item.iconType === "alert" ? <AlertTriangle size={20} /> :
                       item.iconType === "idcard" ? <IdCard size={20} /> :
                       item.iconType === "file" ? <FileText size={20} /> :
                       <ImageIcon size={20} />}
                    </div>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-sm text-text-main">{item.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isMandatory 
                            ? "bg-black text-white" 
                            : "bg-bg-subtle border border-border-main text-text-muted"
                        }`}>
                          {item.isMandatory ? "Mandatory" : "Recommended"}
                        </span>
                      </div>
                      
                      <p className="text-xs text-text-muted mb-2 max-w-lg leading-relaxed">{item.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
                        <span className="text-text-main">
                          <strong className="text-text-muted">Why needed:</strong> {item.whyNeeded}
                        </span>
                        
                        {item.fileData && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Cloud size={11} className="text-blue-600" /> {item.fileData.name} ({item.fileData.size})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action / Upload Button */}
                  <div className="flex items-center gap-3 sm:border-l border-border-main sm:pl-6 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0">
                    {item.status === "collected" && item.fileData ? (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end sm:items-center gap-0.5 mr-2">
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 size={16} className="text-emerald-600" />
                            Collected
                          </div>
                          <span className="text-[10px] text-text-muted font-medium">{item.fileData.uploadedOn}</span>
                        </div>

                        <button 
                          onClick={() => setPreviewItem(item)}
                          className="p-2 rounded-xl border border-border-main text-text-muted hover:text-black hover:bg-bg-subtle transition-all"
                          title="Preview Evidence"
                        >
                          <Eye size={15} />
                        </button>

                        <button 
                          onClick={() => handleDownloadEvidence(item)}
                          className="p-2 rounded-xl border border-border-main text-text-muted hover:text-black hover:bg-bg-subtle transition-all"
                          title="Download Evidence"
                        >
                          <Download size={15} />
                        </button>

                        <button 
                          onClick={() => handleRemoveEvidence(item.id)}
                          className="p-2 rounded-xl border border-border-main text-text-muted hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Remove file"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleInitiateUpload(item.id)}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-black text-white hover:bg-neutral-800 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 disabled:opacity-50"
                      >
                        {isUploading && activeUploadTargetId === item.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={14} /> Upload Proof
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button 
              onClick={() => router.push("/dashboard/ai-assistant")}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-border-main rounded-xl text-xs font-bold hover:bg-bg-subtle transition-colors shadow-2xs"
            >
              <ArrowLeft size={16} />
              Previous: Case Analysis
            </button>
            <button 
              onClick={() => router.push("/dashboard/documents")}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Next: Documents Repository
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* Sidebar Content (Right) */}
        <div className="space-y-6">
          
          {/* Progress Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-bold text-sm text-text-main self-start mb-6">Evidence Readiness</h3>
            
            {/* Circular Progress */}
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-emerald-600 transition-all duration-500"
                  strokeDasharray={`${progressPercent}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black">{collectedCount}/{totalCount}</span>
                <span className="text-[10px] text-text-muted font-bold">{progressPercent}%</span>
              </div>
            </div>

            <h4 className="font-bold text-sm text-text-main mb-1">
              {allMandatoryCollected ? "Mandatory Evidence Complete!" : "Evidence Incomplete"}
            </h4>
            <p className="text-[11px] text-text-muted">
              {allMandatoryCollected 
                ? "All mandatory evidence collected. You are legally ready to serve notice or file a petition."
                : `Please collect all ${mandatoryItems.length} mandatory evidence items before legal submission.`}
            </p>
          </div>

          {/* Tips Card */}
          <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-amber-600" />
              <h3 className="font-bold text-sm text-amber-900">Legal Evidentiary Tips</h3>
            </div>
            <ul className="space-y-3 text-xs text-amber-950 list-disc list-outside pl-4 font-medium">
              <li className="leading-relaxed">Keep original uncropped screenshots with visible timestamp & URL.</li>
              <li className="leading-relaxed">Section 65B Certificate under Indian Evidence Act is generated automatically for digital chat exports.</li>
              <li className="leading-relaxed">Never edit or alter receipts; electronic transaction IDs are verified by the court with the bank.</li>
            </ul>
          </div>

          {/* Need Help Card */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Headphones size={20} className="text-text-main" />
              <h3 className="font-bold text-sm text-text-main">Need Help?</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Ask NyayaAI legal assistant what evidence is admissible for your specific incident.
            </p>
            <button 
              onClick={() => router.push("/dashboard/ai-assistant")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-border-main rounded-xl text-xs font-bold hover:bg-bg-subtle transition-colors shadow-2xs"
            >
              <MessageSquare size={16} />
              Ask AI Assistant
            </button>
          </div>

        </div>

      </div>

      {/* Add Custom Evidence Item Modal */}
      {isAddCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-border-main rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-main">
              <h3 className="font-black text-base text-text-main">Add Custom Evidence Item</h3>
              <button onClick={() => setIsAddCustomOpen(false)} className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-text-main mb-1">Evidence Title *</label>
                <input 
                  type="text" 
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Bank Call Recording or Delivery CCTV"
                  className="w-full px-3.5 py-2.5 bg-bg-subtle border border-border-main rounded-xl font-semibold outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-text-main mb-1">Description</label>
                <textarea 
                  rows={2}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Explain why this proof is important for your case..."
                  className="w-full px-3.5 py-2 bg-bg-subtle border border-border-main rounded-xl font-semibold outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="mandatoryCheck"
                  checked={customIsMandatory}
                  onChange={(e) => setCustomIsMandatory(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="mandatoryCheck" className="font-bold text-text-main cursor-pointer">
                  Mark as Mandatory Evidence
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-main">
                <button
                  type="button"
                  onClick={() => setIsAddCustomOpen(false)}
                  className="px-4 py-2 border border-border-main rounded-xl font-bold hover:bg-bg-subtle"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-xl font-bold hover:bg-neutral-800"
                >
                  Add to Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evidence Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-border-main rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-border-main">
              <div>
                <h3 className="font-black text-base text-text-main">{previewItem.title}</h3>
                <p className="text-xs text-text-muted">{previewItem.description}</p>
              </div>
              <button onClick={() => setPreviewItem(null)} className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center">
                <X size={15} />
              </button>
            </div>

            <div className="bg-bg-subtle p-4 rounded-2xl border border-border-main space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted font-bold">File Name:</span>
                <span className="font-extrabold text-text-main">{previewItem.fileData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-bold">File Size:</span>
                <span className="font-extrabold text-text-main">{previewItem.fileData?.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-bold">Uploaded On:</span>
                <span className="font-extrabold text-text-main">{previewItem.fileData?.uploadedOn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-bold">Storage:</span>
                <span className="font-extrabold text-text-main">Google Cloud Firestore & LocalStorage</span>
              </div>
            </div>

            {previewItem.fileData?.dataUrl && previewItem.fileData.dataUrl.startsWith("data:image") ? (
              <div className="border border-border-main rounded-2xl overflow-hidden max-h-56 flex items-center justify-center bg-gray-50">
                <img src={previewItem.fileData.dataUrl} alt={previewItem.title} className="max-h-56 object-contain" />
              </div>
            ) : (
              <div className="border border-dashed border-border-main rounded-2xl p-4 text-center bg-bg-subtle/50">
                <FileCheck size={28} className="mx-auto text-emerald-600 mb-1" />
                <p className="font-bold text-xs text-text-main">Verified Evidence File Attached</p>
                <p className="text-[10px] text-text-muted">Compliant with Section 65B digital evidence admissibility rules.</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-main">
              <button
                onClick={() => handleDownloadEvidence(previewItem)}
                className="px-4 py-2 border border-border-main rounded-xl text-xs font-bold hover:bg-bg-subtle flex items-center gap-1.5"
              >
                <Download size={14} /> Download File
              </button>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
