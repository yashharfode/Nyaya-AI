"use client";

import React, { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { 
  Scale, 
  Globe, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight,
  Check
} from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "mr", name: "मराठी" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "bn", name: "বাংলা" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "ml", name: "മലയാളം" },
  { code: "or", name: "ଓଡ଼ିଆ" },
  { code: "as", name: "অসমীয়া" },
  { code: "ur", name: "اردو" },
  { code: "sa", name: "संस्कृतम्" },
  { code: "ks", name: "कॉशुर" }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navbar");

  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide public navbar on authentication and dashboard routes
  if (pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/dashboard")) {
    return null;
  }

  const links = [
    { name: t("links.home"), href: "/" },
    { name: t("links.howItWorks"), href: "/how-it-works" },
    { name: t("links.features"), href: "/features" },
    { name: t("links.knowYourRights"), href: "/know-your-rights" },
    { name: t("links.resources"), href: "/resources" },
    { name: t("links.aboutUs"), href: "/about-us" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
    setMobileMenuOpen(false);
  };

  const currentLang = languages.find((l) => l.code === locale)?.name || "English";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo (Left) */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs group-hover:bg-black group-hover:scale-105 transition-all">
            <Scale size={18} strokeWidth={2.3} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-zinc-900 tracking-tight">
              Nyaya<span className="text-zinc-500 font-semibold">AI</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200/90 tracking-wider uppercase">
              IN
            </span>
            <span className="hidden xl:inline-block text-[11px] text-zinc-400 font-normal pl-2.5 border-l border-zinc-200 leading-none">
              {t("subtitle")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Center) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-900 text-white font-semibold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions: Language Selector, Login & Signup (Right) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400"
              aria-label="Select Language"
            >
              <Globe size={13} className="text-zinc-500" />
              <span className="font-semibold">{currentLang}</span>
              <ChevronDown size={12} className={`text-zinc-400 transition-transform duration-150 ${langOpen ? "rotate-180" : ""}`} />
            </button>
            
            {langOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg py-1.5 max-h-72 overflow-y-auto z-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-zinc-400 tracking-wider border-b border-zinc-100 mb-1">
                    Select Language / भाषा
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 transition-colors text-left ${
                        locale === lang.code ? "bg-zinc-100 text-zinc-950 font-bold" : "text-zinc-700"
                      }`}
                    >
                      <span>{lang.name}</span>
                      {locale === lang.code && <Check size={13} className="text-zinc-900" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link 
            href="/login" 
            className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            {t("login")}
          </Link>

          <Link 
            href="/signup" 
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-black transition-all shadow-xs hover:shadow active:scale-95"
          >
            <span>{t("getStarted")}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile / Tablet Controls (Visible on < lg) */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Quick Mobile Language Button */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-2.5 py-1.5 rounded-lg transition-colors"
              aria-label="Select Language"
            >
              <Globe size={13} className="text-zinc-500" />
              <span className="text-[11px] font-bold uppercase">{locale}</span>
              <ChevronDown size={11} className={`text-zinc-400 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg py-1.5 max-h-64 overflow-y-auto z-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-zinc-400 tracking-wider border-b border-zinc-100 mb-1">
                    Select Language / भाषा
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 transition-colors text-left ${
                        locale === lang.code ? "bg-zinc-100 text-zinc-950 font-bold" : "text-zinc-700"
                      }`}
                    >
                      <span>{lang.name}</span>
                      {locale === lang.code && <Check size={13} className="text-zinc-900" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer (Visible on < lg when opened) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 px-4 py-5 space-y-4 shadow-xl">
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white font-semibold"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <Check size={16} />}
                </Link>
              );
            })}
          </nav>

          {/* Language Selector Grid */}
          <div className="pt-3 border-t border-zinc-100 space-y-2">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Choose Language / भाषा चुनें:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {languages.slice(0, 9).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    locale === lang.code
                      ? "bg-zinc-900 text-white border-zinc-900 font-semibold"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Action Buttons */}
          <div className="pt-3 border-t border-zinc-100 flex gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 text-center text-xs font-semibold border border-zinc-200 rounded-xl text-zinc-800 hover:bg-zinc-50 transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 text-center text-xs font-semibold bg-zinc-900 text-white rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{t("getStarted")}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
