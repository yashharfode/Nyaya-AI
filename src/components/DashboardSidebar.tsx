"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { 
  Scale, 
  Home, 
  MessageSquare, 
  Bot, 
  Folder, 
  FileText, 
  CheckSquare, 
  Landmark, 
  BookOpen, 
  ShieldCheck, 
  Settings 
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/dashboard", icon: <Home size={20} /> },
    { name: "Describe Issue", href: "/dashboard/describe-issue", icon: <MessageSquare size={20} /> },
    { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: <Bot size={20} /> },
    { name: "My Cases", href: "/dashboard/cases", icon: <Folder size={20} /> },
    { name: "Documents", href: "/dashboard/documents", icon: <FileText size={20} /> },
    { name: "Evidence Checklist", href: "/dashboard/evidence", icon: <CheckSquare size={20} /> },
    { name: "Government Navigator", href: "/dashboard/navigator", icon: <Landmark size={20} /> },
    { name: "Resources", href: "/dashboard/resources", icon: <BookOpen size={20} /> },
    { name: "Know Your Rights", href: "/dashboard/rights", icon: <ShieldCheck size={20} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-[280px] h-screen bg-bg-main border-r border-border-main flex flex-col fixed left-0 top-0 z-40 hidden lg:flex">
      
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-black text-white p-2 rounded-xl group-hover:bg-gray-800 transition-colors">
            <Scale size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-text-main leading-tight">NyayaAI</span>
            <span className="text-[9px] text-text-muted leading-tight">From Legal Confusion to Legal Action.</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isActive 
                  ? "bg-black text-white shadow-md" 
                  : "text-text-main hover:bg-bg-subtle"
              }`}
            >
              <span className={isActive ? "text-white" : "text-text-main"}>{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Upgrade Block */}
      <div className="p-4 mb-4">
        <div className="bg-white border border-border-main rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M2 20h20v2H2v-2zm1.5-2L2 9l5 3 5-7 5 7 5-3-1.5 9h-17z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm text-text-main">Upgrade to Pro</h4>
          </div>
          <p className="text-xs text-text-muted mb-4 leading-tight">
            Unlock advanced drafting, case research & priority support.
          </p>
          <button className="w-full bg-black text-white text-xs font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
