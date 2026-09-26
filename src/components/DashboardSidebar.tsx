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
  X,
  GraduationCap,
  Newspaper,
  Briefcase
} from "lucide-react";
import { useSidebar } from "@/components/SidebarContext";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, isCollapsed } = useSidebar();

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
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-extrabold text-lg text-text-main tracking-tight">NyayaAI</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase">
                  IN
                </span>
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

      </aside>
    </>
  );
}

