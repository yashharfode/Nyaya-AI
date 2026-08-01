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
  Settings,
  Headphones,
  ArrowRight,
  X,
  GraduationCap
} from "lucide-react";
import { useSidebar } from "@/components/SidebarContext";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

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
    { name: "Legal Academy", href: "/dashboard/academy", icon: <GraduationCap size={20} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside 
        className={`w-[280px] h-screen bg-bg-main border-r border-border-main flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-transparent lg:border-none">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <div className="bg-black text-white p-2 rounded-xl group-hover:bg-gray-800 transition-colors">
              <Scale size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-text-main leading-tight">NyayaAI</span>
              <span className="text-[9px] text-text-muted leading-tight">From Legal Confusion to Legal Action.</span>
            </div>
          </Link>
          <button 
            className="lg:hidden p-2 text-text-muted hover:bg-bg-subtle rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
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

      {/* Upgrade Block & Help */}
      <div className="p-4 mb-4 space-y-4">
        
        {/* Upgrade Button */}
        <Link 
          href="/dashboard/upgrade"
          className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all shadow-sm group ${
            pathname === "/dashboard/upgrade" 
              ? "bg-black text-white" 
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M2 20h20v2H2v-2zm1.5-2L2 9l5 3 5-7 5 7 5-3-1.5 9h-17z" />
            </svg>
            <span className="font-bold text-sm">Upgrade to Pro</span>
          </div>
          <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider">
            PRO
          </span>
        </Link>

        {/* Need Help Card */}
        <div className="bg-bg-subtle border border-border-main rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Headphones size={18} className="text-text-main" />
            <h4 className="font-bold text-sm text-text-main">Need Help?</h4>
          </div>
          <p className="text-[11px] text-text-muted mb-4 leading-relaxed font-medium">
            Our support team is always here for you.
          </p>
          <button className="w-full bg-white border border-border-main text-text-main text-xs font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
            Contact Support <ArrowRight size={14} />
          </button>
        </div>
      </div>
      </aside>
    </>
  );
}
