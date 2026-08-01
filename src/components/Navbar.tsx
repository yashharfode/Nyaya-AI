"use client";

import React from "react";
import { Link, usePathname, useRouter, routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Scale, Globe, ChevronDown } from "lucide-react";

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

  const [langOpen, setLangOpen] = React.useState(false);

  // Hide this navbar on app routes
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/dashboard')) {
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
  };

  const currentLang = languages.find(l => l.code === locale)?.name || "English";

  return (
    <nav className="border-b border-border-main py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-bg-main/80 backdrop-blur-md z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-brand-primary text-white p-2 rounded-xl">
          <Scale size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-tight">{t("title")}</span>
          <span className="text-text-muted text-[10px] md:text-xs tracking-tight">{t("subtitle")}</span>
        </div>
      </Link>

      <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`pb-1 border-b-2 transition-colors ${
                isActive
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-text-muted hover:text-text-main hover:border-border-main"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-4">
        {/* Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 text-sm font-medium hover:bg-bg-subtle px-3 py-2 rounded-lg transition-colors"
          >
            <Globe size={16} />
            {currentLang}
            <ChevronDown size={14} />
          </button>
          
          {langOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-border-main rounded-xl shadow-lg py-2 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle ${
                    locale === lang.code ? 'font-bold text-brand-primary bg-bg-subtle' : 'text-text-main'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link href="/login" className="px-5 py-2 text-sm font-medium border border-border-main rounded-xl hover:bg-bg-subtle transition-all shadow-sm">
          {t("login")}
        </Link>
        <Link href="/signup" className="px-5 py-2 text-sm font-medium bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-all shadow-md shadow-brand-primary/20">
          {t("getStarted")}
        </Link>
      </div>
    </nav>
  );
}
