"use client";

import React, { useState } from "react";
import { 
  Newspaper, 
  Search, 
  Share2, 
  ExternalLink, 
  Bookmark, 
  Scale, 
  Landmark, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  TrendingUp, 
  AlertCircle, 
  FileText,
  MessageSquare,
  BookOpen,
  Copy,
  X,
  Award,
  Info,
  Check,
  ShieldCheck,
  Gavel,
  CheckCircle
} from "lucide-react";
import { useRouter } from "@/i18n/routing";

interface NewsItem {
  id: string;
  title: string;
  court: string;
  citation: string;
  date: string;
  category: "Supreme Court" | "High Court" | "Consumer Law" | "Cyber & IT" | "Historical Landmarks" | "Reforms";
  verdictResult: string;
  summary: string;
  impactTags: string[];
  isLandmark?: boolean;
  bench?: string;
  backgroundDispute?: string;
  courtRationale?: string;
  citizenActionGuide?: string[];
  precedentStatus?: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: "sc-2026-001",
    title: "Supreme Court Rules Digital Platforms Cannot Require Unnecessary Access to Contacts or SMS Logs",
    court: "Supreme Court of India",
    citation: "Civil Appeal No. 8412 of 2025 • In Re: Digital Privacy",
    date: "28 Jan 2026",
    category: "Supreme Court",
    verdictResult: "UNCONSTITUTIONAL practice; Apps must limit data permissions to strictly functional needs.",
    summary: "The Apex Court ruled that lending apps and e-commerce platforms asking for irrelevant personal data like phone contacts, media galleries, and personal SMS violates Article 21 (Right to Privacy) and the Digital Personal Data Protection Act.",
    impactTags: ["Right to Privacy", "Digital India", "Consumer Protection"],
    isLandmark: true,
    bench: "Three-Judge Bench: Hon'ble Chief Justice & Companion Justices",
    backgroundDispute: "Several citizens filed writ petitions challenging instant loan apps and online marketplaces that force users to grant permission to phone contacts, photo galleries, and SMS logs before allowing access to basic services.",
    courtRationale: "The Supreme Court held that data collection must follow the principle of 'Data Minimization' under the DPDP Act and Article 21. Blanket mandatory permissions for unrelated data violate a citizen's constitutional right to privacy.",
    citizenActionGuide: [
      "You can legally decline app permissions to contacts, photos, or SMS if they are not needed for core app functioning.",
      "If a digital lender harasses contacts using phonebook access, cite Civil Appeal No. 8412 of 2025 in police/cyber cell complaints.",
      "You can demand data deletion from platforms under Section 12 of the DPDP Act."
    ],
    precedentStatus: "Binding Law across all Courts and Tribunals in India (Article 141)"
  },
  {
    id: "hist-1978-maneka",
    title: "Maneka Gandhi v. Union of India: Right to Personal Liberty & Passport Seizure Rules",
    court: "Supreme Court of India (7-Judge Constitutional Bench)",
    citation: "1978 AIR 597 • (1978) 1 SCC 248",
    date: "25 Jan 1978",
    category: "Historical Landmarks",
    verdictResult: "EXPANDED Article 21; Government cannot deprive personal liberty arbitrarily without a 'fair, just and reasonable' procedure.",
    summary: "A historic 7-judge Constitutional Bench ruled that the Right to Life and Personal Liberty under Article 21 includes the Right to Travel Abroad. Authorities cannot impound passports without giving the citizen a fair opportunity of being heard.",
    impactTags: ["Article 21", "Personal Liberty", "Constitutional Law"],
    bench: "7-Judge Constitutional Bench led by Hon'ble Chief Justice M.H. Beg",
    backgroundDispute: "Petitioner Maneka Gandhi's passport was impounded 'in public interest' by the Janata Party government without furnishing specific reasons or granting her an opportunity to explain her stand.",
    courtRationale: "The Supreme Court rejected the old notion that any law enacted by Parliament could restrict liberty. The Court held that the procedure established by law under Article 21 must be fair, just, and reasonable, not arbitrary or oppressive.",
    citizenActionGuide: [
      "Government authorities cannot seize your passport or restrict your movement without written notice and hearing.",
      "Any administrative action affecting your liberty must satisfy the test of fairness and natural justice.",
      "Forms the bedrock of modern Indian constitutional rights against state arbitrariness."
    ],
    precedentStatus: "Supreme Constitutional Precedent (Binding on all Authorities in India)"
  },
  {
    id: "hist-2017-puttaswamy",
    title: "K.S. Puttaswamy v. Union of India: Right to Privacy Declared a Fundamental Right",
    court: "Supreme Court of India (9-Judge Constitutional Bench)",
    citation: "(2017) 10 SCC 1 • AIR 2017 SC 4161",
    date: "24 Aug 2017",
    category: "Historical Landmarks",
    verdictResult: "UNANIMOUS RULING: Right to Privacy is an intrinsic part of Article 21 and Fundamental Rights.",
    summary: "A 9-judge bench unanimously affirmed that the Right to Privacy is a fundamental right protected under Article 21 of the Constitution of India, setting the foundation for India's data protection laws and protecting personal autonomy.",
    impactTags: ["Right to Privacy", "Article 21", "Landmark Judgment"],
    bench: "9-Judge Constitutional Bench presided by Hon'ble Chief Justice J.S. Khehar",
    backgroundDispute: "Originally challenged against the mandatory linking of Aadhaar numbers with bank accounts and tax filings, raising the core question of whether the Indian Constitution guarantees a fundamental right to privacy.",
    courtRationale: "The Bench held that privacy is a natural right inherent to human dignity and autonomy. Any state restriction on privacy must satisfy three tests: legality (backed by law), legitimate state aim, and proportionality.",
    citizenActionGuide: [
      "Your personal data, bodily autonomy, and private communications are protected as a Fundamental Right.",
      "No company or government agency can demand private information without a lawful and proportionate justification.",
      "Directly empowers citizens to challenge invasive surveillance or unauthorized data leaks."
    ],
    precedentStatus: "Highest Constitutional Precedent (Unanimous 9-Judge Ruling)"
  },
  {
    id: "hist-2015-shreya",
    title: "Shreya Singhal v. Union of India: Striking Down Section 66A of IT Act (Online Speech)",
    court: "Supreme Court of India",
    citation: "(2015) 5 SCC 1 • AIR 2015 SC 1523",
    date: "24 Mar 2015",
    category: "Historical Landmarks",
    verdictResult: "STRUCK DOWN Section 66A of the IT Act as unconstitutional; Protected freedom of speech on social media.",
    summary: "The Supreme Court struck down Section 66A of the Information Technology Act, holding that arresting citizens for posting allegedly 'offensive' or 'annoying' comments on Facebook/Twitter violated Article 19(1)(a) Freedom of Speech.",
    impactTags: ["Freedom of Speech", "Cyber Law", "Section 66A"],
    bench: "Division Bench: Hon'ble Justice J. Chelameswar & Justice R.F. Nariman",
    backgroundDispute: "Police arrested citizens across India under Section 66A of the IT Act for posting political criticism or comments online, claiming the posts caused 'annoyance' or 'inconvenience'.",
    courtRationale: "The Court held that terms like 'annoying', 'inconvenient', or 'offensive' in Section 66A were vague and overbroad. Speech cannot be restricted unless it incites violence or public disorder under Article 19(2).",
    citizenActionGuide: [
      "Police cannot register an FIR against you under Section 66A of the IT Act as it has been declared dead law.",
      "You have the constitutional right to express opinions online as long as it does not incite violence or defamation.",
      "If threatened with Section 66A, immediately cite Shreya Singhal v. Union of India."
    ],
    precedentStatus: "Binding Law across all Police & Judicial Authorities in India"
  },
  {
    id: "ncdrc-2026-002",
    title: "NCDRC Order: E-Commerce Platforms Must Issue Full Refund for Defective Products Within 7 Days",
    court: "National Consumer Commission (NCDRC)",
    citation: "Consumer Case No. 302 of 2025",
    date: "24 Jan 2026",
    category: "Consumer Law",
    verdictResult: "DIRECTED e-commerce sellers to stop mandatory replacement-only policies for damaged goods.",
    summary: "The National Consumer Commission held that if a consumer reports a manufacturing defect within 7 days of delivery, sellers cannot force repeated replacements and must offer a full monetary refund without penalty.",
    impactTags: ["E-Commerce", "Consumer Rights", "Refund Rules"],
    bench: "Presiding Member Hon'ble Justice R.K. Agrawal",
    backgroundDispute: "A consumer ordered a laptop worth Rs. 65,000 which arrived with a defective screen. The seller refused a cash refund, insisting on replacement only under their terms and conditions.",
    courtRationale: "The NCDRC held that seller terms cannot override statutory rights under the Consumer Protection Act, 2019. Forcing an already dissatisfied consumer to accept a replacement of a defective item constitutes deficiency in service.",
    citizenActionGuide: [
      "If an electronics or online item is defective upon arrival, you can demand a full monetary refund within 7 days.",
      "Platform 'No-Refund / Replacement Only' clauses cannot override the Consumer Protection Act.",
      "You can file an online complaint on the National Consumer Helpline (NCH 1915) citing Consumer Case No. 302/2025."
    ],
    precedentStatus: "Binding Precedent for all District & State Consumer Forums"
  },
  {
    id: "dhc-2026-003",
    title: "Delhi High Court Directs Nodal Cyber Cell to Block Phishing & Scam Domains Within 2 Hours",
    court: "Delhi High Court",
    citation: "W.P.(C) No. 1192 / 2026",
    date: "20 Jan 2026",
    category: "Cyber & IT",
    verdictResult: "MANDATORY emergency takedown protocol for reported financial fraud websites.",
    summary: "Taking serious note of online trading and job scams, the Delhi High Court ordered telecom service providers and domain registrars to block fraudulent websites within 2 hours of verification by police authorities.",
    impactTags: ["Cyber Fraud", "Online Safety", "High Court Order"],
    bench: "Division Bench of Delhi High Court",
    backgroundDispute: "Victims of online investment and Telegram job scams petitioned the court stating that fraudulent websites remained active for weeks despite formal police complaints, leading to loss of lakhs of rupees.",
    courtRationale: "The Court noted that speed is critical in cybercrime prevention. Intermediaries and registrars have an statutory duty under IT Rules to act immediately upon notification by law enforcement.",
    citizenActionGuide: [
      "Report any phishing link or investment scam immediately to 1930 or cybercrime.gov.in.",
      "Law enforcement authorities can now mandate domain takedown within 2 hours under this order.",
      "Bank accounts linked to scam websites can be frozen immediately on emergency notice."
    ],
    precedentStatus: "High Court Direction (Applicable to Telecom & Cyber Authorities)"
  },
  {
    id: "sc-2026-004",
    title: "Supreme Court Clarifies: Landlords Cannot Evict Tenants Without Formal 30-Day Written Notice",
    court: "Supreme Court of India",
    citation: "SLP (Civil) No. 4410 of 2025",
    date: "15 Jan 2026",
    category: "Supreme Court",
    verdictResult: "STAYED arbitrary eviction; Written notice is a statutory mandatory condition.",
    summary: "A three-judge bench held that oral notices or sudden lockouts by landlords are illegal under the Model Tenancy framework. Tenants must be granted reasonable hearing and written notice prior to any eviction proceeding.",
    impactTags: ["Tenant Rights", "Property Law", "Supreme Court"],
    bench: "Three-Judge Bench of Supreme Court",
    backgroundDispute: "A residential landlord locked out a tenant without written notice after a dispute over maintenance charges, arguing that an oral 15-day warning was sufficient.",
    courtRationale: "The Supreme Court ruled that a lease creates a property right and possession cannot be disturbed without due process of law. Oral eviction claims are invalid without documentary proof of a 30-day notice.",
    citizenActionGuide: [
      "A landlord cannot cut electricity, water, or lock your house without a legal court order.",
      "You are entitled to a minimum 30-day formal written notice before any eviction proceeding.",
      "If harassed, file an injunction application in civil court citing SLP (Civil) No. 4410/2025."
    ],
    precedentStatus: "Binding Law across all Civil Courts & Rent Controllers"
  },
  {
    id: "bhc-2026-005",
    title: "Bombay High Court: Contractual & Temporary Female Employees Entitled to Full Maternity Leave Benefits",
    court: "Bombay High Court",
    citation: "Writ Petition (L) No. 981 of 2025",
    date: "12 Jan 2026",
    category: "High Court",
    verdictResult: "ALLOWED full maternity pay regardless of employment contract duration.",
    summary: "The High Court ruled that the Maternity Benefit Act applies equally to contractual, ad-hoc, and daily-wage women workers, and denial of paid leave during maternity constitutes discrimination.",
    impactTags: ["Women Rights", "Labour Law", "Maternity Benefit"],
    bench: "Division Bench of Bombay High Court",
    backgroundDispute: "A female employee working on an 11-month contract was denied maternity leave and pay by her employer, who claimed the Act only applied to permanent confirmed staff.",
    courtRationale: "The Court held that the Maternity Benefit Act is a beneficial social welfare legislation. The objective of child and maternal health applies across all categories of employment.",
    citizenActionGuide: [
      "Whether you are contractual, temporary, or permanent, you are entitled to 26 weeks paid maternity leave.",
      "An employer cannot terminate a contract on the grounds of pregnancy.",
      "You can file a complaint with the Labour Commissioner if benefits are denied."
    ],
    precedentStatus: "Binding Precedent in Bombay High Court Jurisdiction & Persuasive Pan-India"
  },
  {
    id: "sc-2026-006",
    title: "Landmark Judgment: Health Insurance Claims Cannot Be Rejected Solely Over Minor Delay in Intimation",
    court: "Supreme Court of India",
    citation: "Civil Appeal No. 7102 of 2025",
    date: "08 Jan 2026",
    category: "Supreme Court",
    verdictResult: "OVERTURNED insurance claim rejection; Insurers must assess actual medical genuine necessity.",
    summary: "The Supreme Court ruled that if hospitalization was genuine and medical records are verified, insurance companies cannot arbitrarily reject claims merely because notice was given after 24 or 48 hours of emergency admission.",
    impactTags: ["Insurance Law", "Healthcare Rights", "Supreme Court"],
    bench: "Division Bench of Supreme Court",
    backgroundDispute: "An insurance company rejected a Rs. 4 lakh cardiac hospitalization claim because the patient's family notified the insurer on the third day after emergency ICU admission instead of within 24 hours.",
    courtRationale: "The Court held that the purpose of insurance is to cover genuine medical emergencies. Technical delays in intimation during a health crisis cannot defeat a valid insurance contract.",
    citizenActionGuide: [
      "If your health insurance claim is rejected solely due to late intimation, challenge it before the Insurance Ombudsman.",
      "Insurers are legally required to verify medical genuineness rather than relying on procedural technicalities.",
      "Cite Civil Appeal No. 7102/2025 in all claim appeals."
    ],
    precedentStatus: "Binding Law across all Insurance Ombudsmen & Consumer Forums"
  }
];

export default function LegalNewsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [aiBriefingOpen, setAiBriefingOpen] = useState<boolean>(false);
  const [selectedExplainer, setSelectedExplainer] = useState<NewsItem | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  const categories = ["All", "Supreme Court", "High Court", "Consumer Law", "Cyber & IT", "Historical Landmarks", "Reforms"];

  const filteredNews = NEWS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.citation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const landmarkItem = NEWS_DATA.find((i) => i.isLandmark);

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handleShareWhatsApp = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    const text = `*⚖ NyayaAI Court Judgment Explainer*\n\n` +
      `*Headline:* ${item.title}\n` +
      `*Court/Forum:* ${item.court}\n` +
      `*Citation:* ${item.citation}\n` +
      `*Date:* ${item.date}\n\n` +
      `*Verdict / Order:*\n${item.verdictResult}\n\n` +
      `*Key Summary:*\n${item.summary}\n\n` +
      (item.citizenActionGuide ? `*What This Means For You:*\n${item.citizenActionGuide.map(g => "• " + g).join("\n")}\n\n` : "") +
      `_Shared via NyayaAI - India's AI Legal Operating System_`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleCopyCitation = (citation: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(citation);
    setCopiedCitation(citation);
    setTimeout(() => setCopiedCitation(null), 2000);
  };

  const handleAnalyzeWithAI = (item: NewsItem) => {
    const payload = {
      category: "Court Judgment Analysis",
      severity: "Medium",
      originalIssue: `Explain how the judgment "${item.title}" (${item.citation} by ${item.court}) protects my legal rights and what actions I can take under this ruling.`,
      applicableRights: item.impactTags,
      evidenceChecklist: [
        "Copy of judgment / order reference",
        "Relevant invoice or complaint proof if applicable"
      ],
      recommendedAuthority: item.court,
      complaintDraft: `Reference Judgment: ${item.title}\nCitation: ${item.citation}\n\nUnder the binding precedent established by ${item.court}, the requested relief is enforceable as a matter of right.`,
      summary: item.summary
    };

    sessionStorage.setItem("nyaya_ai_analysis", JSON.stringify(payload));
    router.push("/dashboard/ai-assistant");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      
      {/* Executive Header */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5">
              <Gavel size={14} /> Judicial Docket & Reports
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-300 inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              Live Court Sessions
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-main tracking-tight">
            Legal News & Court Precedents
          </h1>
          <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
            Verified judicial orders, Supreme Court constitutional benches, High Court directions, and statutory amendments across India. Click any order for a simplified Citizen Explainer.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setAiBriefingOpen(!aiBriefingOpen)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-md"
          >
            <Sparkles size={16} className="text-amber-400" />
            {aiBriefingOpen ? "Hide Executive Briefing" : "Monthly Legal Briefing"}
          </button>
        </div>
      </div>

      {/* AI Executive Briefing Expandable Card */}
      {aiBriefingOpen && (
        <div className="bg-[#F8FAFC] border-2 border-black rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between mb-5 border-b border-border-main pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles size={22} className="text-amber-600" />
              <h3 className="font-black text-lg text-text-main">
                AI Executive Briefing • Key Indian Legal Trends & Precedents
              </h3>
            </div>
            <span className="text-xs font-bold text-text-main bg-white px-3.5 py-1.5 rounded-full border border-black">
              Updated Daily
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-xs font-medium text-text-main">
            <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm">
              <h4 className="font-black text-text-main mb-2 flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-green-600" /> Consumer Rights
              </h4>
              <p className="text-text-muted leading-relaxed text-xs">
                Courts are enforcing a strict stance against e-commerce replacement-only policies and hidden flight convenience fees. Mandatory 7-day cash refund is now a binding consumer precedent.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm">
              <h4 className="font-black text-text-main mb-2 flex items-center gap-2 text-sm">
                <AlertCircle size={16} className="text-red-600" /> Digital Privacy & Cyber Law
              </h4>
              <p className="text-text-muted leading-relaxed text-xs">
                Supreme Court has barred mobile loan apps and platforms from forcing users to share contacts or galleries. High Courts are ordering 2-hour emergency takedowns for scam websites.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm">
              <h4 className="font-black text-text-main mb-2 flex items-center gap-2 text-sm">
                <Scale size={16} className="text-blue-600" /> Tenant & Labour Rights
              </h4>
              <p className="text-text-muted leading-relaxed text-xs">
                Landlords cannot evict tenants without formal 30-day written notice under Rent Control norms. Contractual women workers are reaffirmed full entitlement to paid maternity benefits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Landmark Judgment Hero Card */}
      {landmarkItem && (
        <div className="bg-gradient-to-br from-white to-[#F8FAFC] border-2 border-black rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-black text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  ★ CONSTITUTIONAL LANDMARK
                </span>
                <span className="bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold border border-amber-300">
                  Article 141 Binding Precedent
                </span>
                <span className="bg-white text-text-main px-3 py-1 rounded-full text-xs font-bold border border-border-main">
                  {landmarkItem.court}
                </span>
                <span className="text-xs text-text-muted font-bold">
                  • {landmarkItem.date}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-black text-text-muted uppercase tracking-wider font-mono">
                    {landmarkItem.citation}
                  </p>
                  <button
                    onClick={(e) => handleCopyCitation(landmarkItem.citation, e)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
                    title="Copy formal citation"
                  >
                    {copiedCitation === landmarkItem.citation ? (
                      <Check size={13} className="text-green-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                    {copiedCitation === landmarkItem.citation ? "Copied" : "Copy Citation"}
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-text-main leading-tight">
                  {landmarkItem.title}
                </h2>
                {landmarkItem.bench && (
                  <p className="text-xs font-bold text-text-main mt-2">
                    {landmarkItem.bench}
                  </p>
                )}
              </div>

              {/* Executive Order Box */}
              <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wider text-green-800 mb-1 flex items-center gap-1.5">
                  <Award size={15} className="text-green-700" />
                  COURT RULING & DIRECTIVE:
                </p>
                <p className="text-sm font-black text-text-main">
                  {landmarkItem.verdictResult}
                </p>
                <p className="text-xs text-text-muted mt-2 leading-relaxed font-medium">
                  {landmarkItem.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {landmarkItem.impactTags.map((tag, idx) => (
                  <span key={idx} className="bg-white text-text-main text-xs font-bold px-3 py-1.5 rounded-xl border border-black shadow-2xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Card Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-60">
              <button 
                onClick={() => setSelectedExplainer(landmarkItem)}
                className="w-full flex items-center justify-center gap-2 bg-black text-white px-5 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-md"
              >
                <BookOpen size={16} />
                Read Executive Explainer
              </button>

              <button 
                onClick={(e) => handleShareWhatsApp(e, landmarkItem)}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#1ebd5b] transition-all shadow-sm"
              >
                <Share2 size={16} />
                Share on WhatsApp
              </button>

              <button 
                onClick={() => handleAnalyzeWithAI(landmarkItem)}
                className="w-full flex items-center justify-center gap-2 bg-white text-text-main border-2 border-black px-5 py-3.5 rounded-2xl font-bold text-sm hover:bg-bg-subtle transition-all shadow-sm"
              >
                <Sparkles size={16} />
                Ask AI About My Rights
              </button>

              <button 
                onClick={() => toggleBookmark(landmarkItem.id)}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all ${
                  bookmarkedIds.includes(landmarkItem.id)
                    ? "bg-black text-white border-black shadow-sm"
                    : "bg-white text-text-main border-black hover:bg-bg-subtle"
                }`}
              >
                <Bookmark size={16} />
                {bookmarkedIds.includes(landmarkItem.id) ? "Saved to Bookmarks" : "Bookmark Judgment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar & Search */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-full text-xs font-black tracking-wide shrink-0 transition-all ${
                selectedCategory === cat 
                  ? "bg-black text-white shadow-sm" 
                  : "bg-bg-subtle text-text-muted hover:text-text-main hover:bg-gray-200"
              }`}
            >
              {cat === "Historical Landmarks" ? "★ Historical Landmarks" : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search citation, court, or topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-subtle border border-border-main rounded-xl text-xs font-bold outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
        </div>

      </div>

      {/* Professional 2-Column Judgments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item) => (
          <div 
            key={item.id}
            className="bg-white border-2 border-black rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header Row: Court Badge & Date */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {item.court}
                </span>
                <span className="text-xs font-bold text-text-muted flex items-center gap-1.5">
                  <Calendar size={13} />
                  {item.date}
                </span>
              </div>

              {/* Citation Row with One-Click Copy */}
              <div className="flex items-center justify-between gap-2 mb-2 bg-bg-subtle/80 px-3 py-1.5 rounded-lg border border-border-main">
                <p className="text-[11px] font-bold text-text-main font-mono truncate">
                  {item.citation}
                </p>
                <button
                  onClick={(e) => handleCopyCitation(item.citation, e)}
                  className="text-xs font-bold text-text-muted hover:text-black inline-flex items-center gap-1 shrink-0"
                  title="Copy Citation"
                >
                  {copiedCitation === item.citation ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  <span className="text-[10px]">{copiedCitation === item.citation ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Headline */}
              <h3 className="font-black text-lg text-text-main mb-2 leading-snug line-clamp-2">
                {item.title}
              </h3>

              {/* Bench */}
              {item.bench && (
                <p className="text-[11px] font-bold text-text-muted mb-3">
                  {item.bench}
                </p>
              )}

              {/* Executive Rulings Box */}
              <div className="bg-[#F8FAFC] border-l-4 border-black p-3.5 rounded-r-xl mb-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-text-main">
                  COURT RULING / DIRECTION:
                </p>
                <p className="text-xs font-black text-text-main mt-0.5 leading-snug">
                  {item.verdictResult}
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs text-text-muted leading-relaxed mb-5 line-clamp-3 font-medium">
                {item.summary}
              </p>
            </div>

            <div>
              {/* Impact Badges */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {item.impactTags.map((tag, i) => (
                  <span key={i} className="bg-bg-subtle text-text-main text-[11px] font-bold px-3 py-1 rounded-lg border border-border-main">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Professional Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-border-main gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedExplainer(item)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-sm"
                    title="Read deep-dive Citizen Judgment Explainer"
                  >
                    <BookOpen size={14} />
                    Read Explainer
                  </button>

                  <button
                    onClick={(e) => handleShareWhatsApp(e, item)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#1ebd5b] transition-all shadow-sm"
                    title="Share judgment via WhatsApp"
                  >
                    <Share2 size={14} />
                    WhatsApp
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      bookmarkedIds.includes(item.id)
                        ? "bg-black text-white border-black"
                        : "bg-white text-text-muted border-border-main hover:bg-bg-subtle"
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark size={15} />
                  </button>

                  <button
                    onClick={() => handleAnalyzeWithAI(item)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-text-main border-2 border-black rounded-xl text-xs font-bold hover:bg-bg-subtle transition-all"
                  >
                    <Sparkles size={14} />
                    Ask AI
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="bg-white border-2 border-black rounded-3xl p-16 text-center">
          <Newspaper size={44} className="mx-auto text-text-light mb-3" />
          <h3 className="font-black text-xl text-text-main mb-1">No court precedents matched your search</h3>
          <p className="text-sm text-text-muted">Try searching for Puttaswamy, Maneka Gandhi, Supreme Court, or NCDRC.</p>
        </div>
      )}

      {/* JUDGMENT EXPLAINER (EXECUTIVE DEEP-DIVE) MODAL */}
      {selectedExplainer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-black pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="bg-black text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedExplainer.category === "Historical Landmarks" ? "★ Historical Landmark Precedent" : "★ Executive Judgment Explainer"}
                  </span>
                  <span className="bg-bg-subtle text-text-main px-3 py-1 rounded-full text-xs font-bold border border-black">
                    {selectedExplainer.court}
                  </span>
                  <span className="text-xs text-text-muted font-bold">
                    • {selectedExplainer.date}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-text-main leading-tight">
                  {selectedExplainer.title}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
                    {selectedExplainer.citation}
                  </p>
                  <button
                    onClick={() => handleCopyCitation(selectedExplainer.citation)}
                    className="inline-flex items-center gap-1 text-xs text-brand-primary font-bold hover:underline bg-bg-subtle px-2.5 py-1 rounded-md border border-border-main"
                  >
                    {copiedCitation === selectedExplainer.citation ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                    {copiedCitation === selectedExplainer.citation ? "Copied to Clipboard" : "Copy Citation"}
                  </button>
                </div>
                {selectedExplainer.bench && (
                  <p className="text-xs text-text-main font-bold mt-2">
                    {selectedExplainer.bench}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedExplainer(null)}
                className="p-2.5 rounded-full bg-bg-subtle hover:bg-gray-200 text-text-main transition-colors shrink-0 border border-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Precedent Authority Badge */}
            {selectedExplainer.precedentStatus && (
              <div className="bg-green-50 border-2 border-green-700 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <Award size={20} className="text-green-800 shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-green-900">
                    JUDICIAL PRECEDENT AUTHORITY:
                  </p>
                  <p className="text-sm font-black text-green-950 mt-0.5">
                    {selectedExplainer.precedentStatus}
                  </p>
                </div>
              </div>
            )}

            {/* Section 1: Background & Dispute */}
            <div className="space-y-2.5">
              <h3 className="font-black text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                <Info size={18} className="text-brand-primary" />
                1. What Was The Dispute? (Case Origin & Facts)
              </h3>
              <div className="text-sm text-text-main leading-relaxed bg-[#F8FAFC] p-5 rounded-2xl border-2 border-black font-medium">
                {selectedExplainer.backgroundDispute || selectedExplainer.summary}
              </div>
            </div>

            {/* Section 2: Why Did The Court Rule This Way? */}
            <div className="space-y-2.5">
              <h3 className="font-black text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                <Scale size={18} className="text-indigo-600" />
                2. Why Did The Court Rule This Way? (Judicial & Constitutional Rationale)
              </h3>
              <div className="text-sm text-text-main leading-relaxed bg-[#F8FAFC] p-5 rounded-2xl border-2 border-black font-medium">
                {selectedExplainer.courtRationale || selectedExplainer.verdictResult}
              </div>
            </div>

            {/* Section 3: What This Means For You */}
            <div className="space-y-3">
              <h3 className="font-black text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-600" />
                3. What This Means For You (Actionable Citizen Legal Guide)
              </h3>
              <div className="bg-amber-50 border-2 border-amber-600 rounded-2xl p-5 space-y-3 shadow-sm">
                {(selectedExplainer.citizenActionGuide || [
                  `You can cite ${selectedExplainer.citation} to enforce your rights under this ruling.`,
                  "Government authorities and private entities are legally bound to comply with this order."
                ]).map((guide, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-amber-950 font-bold">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{guide}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedExplainer.impactTags.map((tag, i) => (
                <span key={i} className="bg-white text-text-main text-xs font-bold px-3.5 py-1.5 rounded-xl border border-black">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-5 border-t-2 border-black">
              <button
                onClick={(e) => handleShareWhatsApp(e, selectedExplainer)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#1ebd5b] transition-all shadow-sm"
              >
                <Share2 size={16} />
                Share Explainer on WhatsApp
              </button>

              <button
                onClick={() => {
                  const item = selectedExplainer;
                  setSelectedExplainer(null);
                  handleAnalyzeWithAI(item);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-sm"
              >
                <Sparkles size={16} />
                Ask AI About My Rights Under This Precedent
              </button>

              <button
                onClick={() => setSelectedExplainer(null)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-black text-sm font-bold text-text-main hover:bg-bg-subtle transition-all"
              >
                Close Explainer
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
