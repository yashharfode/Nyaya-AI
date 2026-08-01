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
  GraduationCap,
  Newspaper,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useSidebar } from "@/components/SidebarContext";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, isCollapsed, toggleCollapse } = useSidebar();

  const navLinks = [
    { name: "Home", href: "/dashboard", icon: <Home size={20} /> },
    { name: "Describe Issue", href: "/dashboard/describe-issue", icon: <MessageSquare size={20} /> },
    { name: "AI Legal Interview", href: "/dashboard/legal-interview", icon: <Bot size={20} />, badge: "NEW" },
    { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: <Headphones size={20} /> },
    { name: "My Cases", href: "/dashboard/cases", icon: <Folder size={20} /> },
    { name: "Documents", href: "/dashboard/documents", icon: <FileText size={20} /> },
    { name: "Evidence Checklist", href: "/dashboard/evidence", icon: <CheckSquare size={20} /> },
    { name: "Government Navigator", href: "/dashboard/navigator", icon: <Landmark size={20} /> },
    { name: "Legal Services & Costs", href: "/dashboard/services", icon: <Briefcase size={20} /> },
    { name: "Resources", href: "/dashboard/resources", icon: <BookOpen size={20} /> },
    { name: "Know Your Rights", href: "/dashboard/rights", icon: <ShieldCheck size={20} /> },
    { name: "Legal News & Courts", href: "/dashboard/news", icon: <Newspaper size={20} /> },
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
        className={`${
          isCollapsed ? "w-[76px]" : "w-[280px]"
        } h-screen bg-bg-main border-r border-border-main flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        
        {/* Logo Area */}
        <div className={`h-20 flex items-center ${isCollapsed ? "justify-center px-3" : "justify-between px-6"} border-b border-transparent lg:border-none`}>
          <Link href="/" className="flex items-center gap-2 group overflow-hidden" onClick={() => setIsOpen(false)}>
            <div className="bg-black text-white p-2 rounded-xl group-hover:bg-gray-800 transition-colors shrink-0">
              <Scale size={24} strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-bold text-lg text-text-main leading-tight">NyayaAI</span>
                <span className="text-[9px] text-text-muted leading-tight">From Legal Confusion to Legal Action.</span>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <button 
              className="lg:hidden p-2 text-text-muted hover:bg-bg-subtle rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? link.name : undefined}
                className={`flex items-center ${
                  isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
                } rounded-2xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-black text-white shadow-md" 
                    : "text-text-main hover:bg-bg-subtle"
                }`}
              >
                <span className={isActive ? "text-white" : "text-text-main"}>{link.icon}</span>
                {!isCollapsed && (
                  <span className="truncate flex-1">{link.name}</span>
                )}
                {!isCollapsed && (link as any).badge && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive ? "bg-white text-black" : "bg-black text-white"
                  }`}>{(link as any).badge}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Collapse/Expand Toggle Button (Desktop) */}
        <div className={`px-4 py-2 ${isCollapsed ? "flex justify-center px-2" : ""}`}>
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar (⌘B)" : "Minimize Sidebar (⌘B)"}
            className={`hidden lg:flex items-center gap-3 w-full p-2.5 rounded-xl border border-border-main bg-white hover:bg-bg-subtle hover:border-black transition-all text-xs font-bold text-text-main ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2">
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              {!isCollapsed && <span>Minimize Sidebar</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] bg-bg-subtle px-2 py-0.5 rounded text-text-muted font-mono">⌘B</span>
            )}
          </button>
        </div>

        {/* Upgrade Block & Help */}
        {isCollapsed ? (
          <div className="p-3 space-y-2 mb-2">
            <Link
              href="/dashboard/upgrade"
              title="Upgrade to Pro"
              className="flex items-center justify-center p-3 w-full bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M2 20h20v2H2v-2zm1.5-2L2 9l5 3 5-7 5 7 5-3-1.5 9h-17z" />
              </svg>
            </Link>
            <button
              title="Need Help? Contact Support"
              className="w-full bg-bg-subtle border border-border-main text-text-main p-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center shadow-sm"
            >
              <Headphones size={18} />
            </button>
          </div>
        ) : (
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
        )}
      </aside>
    </>
  );
}

