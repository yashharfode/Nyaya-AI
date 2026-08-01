"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Bell, Search, LogOut, Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { useSidebar } from "@/components/SidebarContext";

export default function DashboardNavbar({ user }: { user?: { name: string; email: string } | null }) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const { toggle, isCollapsed, toggleCollapse } = useSidebar();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-bg-main border-b border-border-main flex items-center justify-between h-20 px-4 sm:px-6 lg:px-10">
      
      {/* Left Side: Mobile Menu & Search Bar */}
      <div className="flex-1 max-w-xl flex items-center gap-2">
        <button 
          onClick={toggle}
          className="lg:hidden p-2 text-text-main hover:bg-bg-subtle rounded-xl transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
        
        {/* Desktop Sidebar Collapse / Expand Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex p-2.5 text-text-main hover:bg-bg-subtle border border-border-main hover:border-black rounded-xl transition-all"
          title={isCollapsed ? "Expand Sidebar (⌘B)" : "Minimize Sidebar (⌘B)"}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>

        <div className="relative flex items-center w-full">
          <Search size={18} className="absolute left-4 text-text-light" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
          />
        </div>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-6 ml-4">
        
        {/* Upgrade Button */}
        <button className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M2 20h20v2H2v-2zm1.5-2L2 9l5 3 5-7 5 7 5-3-1.5 9h-17z" />
          </svg>
          Upgrade to Pro
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-text-light hover:text-text-main hover:bg-bg-subtle rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-text-main rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 text-text-main flex items-center justify-center font-bold overflow-hidden border border-border-main">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-semibold text-text-main">{user?.name?.split(" ")[0] || "User"}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-light">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
          <button onClick={handleLogout} className="p-2 text-text-light hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
