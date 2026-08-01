"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Scale, Bell, Search, LayoutDashboard, FileText, Briefcase, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

export default function DashboardNavbar({ user }: { user?: { name: string; email: string } | null }) {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  const navLinks = [
    { name: t("nav.home"), href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: t("nav.cases"), href: "/dashboard/cases", icon: <Briefcase size={18} /> },
    { name: t("nav.documents"), href: "/dashboard/documents", icon: <FileText size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-border-main shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Main Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-brand-primary text-white p-1.5 rounded-lg group-hover:bg-brand-primary/90 transition-colors">
              <Scale size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-text-main hidden sm:block">NyayaAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-bg-subtle text-brand-primary font-bold shadow-sm" 
                      : "text-text-muted hover:bg-bg-subtle hover:text-text-main"
                  }`}
                >
                  <span className={isActive ? "text-brand-primary" : "text-text-light"}>{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Global Search & Profile */}
        <div className="flex items-center gap-4">
          
          <button className="relative p-2 text-text-light hover:text-text-main hover:bg-bg-subtle rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-6 w-px bg-border-main mx-1"></div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-text-main leading-tight">{user?.name || "User"}</p>
              <p className="text-xs text-text-muted">{t("role")}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-md shadow-brand-primary/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <button onClick={handleLogout} className="p-2 text-text-light hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
