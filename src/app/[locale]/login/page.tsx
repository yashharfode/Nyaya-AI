"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Scale, Eye, EyeOff, ShieldCheck, Lock, Users } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { createSessionAction, bypassLoginAction } from "@/actions/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const result = await createSessionAction({
        firebaseUid: userCredential.user.uid,
        email: userCredential.user.email || email,
        name: userCredential.user.displayName
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Incorrect email or password.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "Invalid email or password");
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      const sessionResult = await createSessionAction({
        firebaseUid: result.user.uid,
        email: result.user.email || "",
        name: result.user.displayName
      });

      if (sessionResult.error) {
        setError(sessionResult.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User intentionally closed the popup, so we can just ignore it or show a mild message
        setError(null);
      } else {
        setError(err.message || "Failed to log in with Google");
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col font-sans selection:bg-brand-accent selection:text-white">
      {/* Top Bar Logo */}
      <div className="absolute top-0 left-0 p-6 md:p-8 z-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-brand-primary text-white p-2 rounded-xl">
            <Scale size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col text-text-main">
            <span className="font-bold text-xl leading-tight">NyayaAI</span>
            <span className="text-text-muted text-[10px] md:text-xs tracking-tight">From Legal Confusion to Legal Action.</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Side: Graphic Area */}
        <div className="hidden lg:flex flex-1 relative items-center justify-center bg-bg-subtle overflow-hidden">
          {/* Decorative Background mimicking Lady Justice/Courthouse */}
          <div className="absolute inset-0 bg-gradient-to-br from-bg-subtle to-border-main/50"></div>
          
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 L50,0 L100,100 Z" fill="currentColor" />
            {/* Adding an abstract scale graphic */}
            <path d="M 50 10 L 50 80 M 30 30 L 70 30 M 30 30 L 20 60 L 40 60 Z M 70 30 L 60 60 L 80 60 Z" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          
          <div className="relative z-10 p-12 text-center max-w-lg">
            <Scale size={120} className="mx-auto text-brand-primary opacity-20 mb-8" strokeWidth={1} />
            <h1 className="text-4xl font-extrabold text-brand-primary mb-4">NyayaAI</h1>
            <p className="text-xl text-text-muted">Empowering you with knowledge and tools to get the justice you deserve.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-24 md:px-12 lg:px-24 bg-white relative z-10 shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.05)]">
          
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center">
              <div className="inline-flex bg-brand-primary text-white p-3 rounded-2xl mb-4 shadow-lg shadow-brand-primary/20">
                <Scale size={32} strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-text-main mb-2">{t("title")}</h2>
              <p className="text-text-muted">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-main">{t("emailLabel")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-text-light" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-bg-main border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm" 
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-main">{t("passwordLabel")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-light" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-bg-main border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm" 
                    placeholder={t("passwordPlaceholder")}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-light hover:text-text-main"
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <a href="#" className="text-xs font-semibold text-text-muted hover:text-brand-primary transition-colors">
                  {t("forgotPassword")}
                </a>
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-primary text-white font-bold rounded-xl py-3.5 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? "..." : t("loginButton")}
              </button>
            </form>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-border-main"></div>
              <span className="text-xs text-text-muted font-medium uppercase">{t("or")}</span>
              <div className="flex-1 h-px bg-border-main"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-border-main text-text-main font-semibold rounded-xl py-3 hover:bg-bg-subtle transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              {t("googleButton")}
            </button>

            {process.env.NODE_ENV !== "production" && (
              <button 
                onClick={async () => {
                  await bypassLoginAction();
                  router.push("/dashboard");
                }}
                type="button"
                className="w-full mt-2 flex items-center justify-center gap-3 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-semibold rounded-xl py-3 hover:bg-brand-accent/20 transition-all shadow-sm"
              >
                Bypass Login (Dev Only)
              </button>
            )}

            <p className="text-center text-sm text-text-muted">
              {t("noAccount")} <Link href="/signup" className="font-bold text-brand-primary hover:underline">{t("signUp")}</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Features Strip */}
      <div className="bg-bg-subtle border-t border-border-main py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 md:justify-center">
            <ShieldCheck size={32} className="text-text-main opacity-80" />
            <div>
              <h4 className="font-bold text-sm">{t("features.secure.title")}</h4>
              <p className="text-xs text-text-muted mt-0.5">{t("features.secure.desc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:justify-center border-t md:border-t-0 md:border-l border-border-main pt-6 md:pt-0 md:pl-8">
            <Lock size={32} className="text-text-main opacity-80" />
            <div>
              <h4 className="font-bold text-sm">{t("features.privacy.title")}</h4>
              <p className="text-xs text-text-muted mt-0.5">{t("features.privacy.desc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:justify-center border-t md:border-t-0 md:border-l border-border-main pt-6 md:pt-0 md:pl-8">
            <Users size={32} className="text-text-main opacity-80" />
            <div>
              <h4 className="font-bold text-sm">{t("features.everyone.title")}</h4>
              <p className="text-xs text-text-muted mt-0.5">{t("features.everyone.desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal icon for User
function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
