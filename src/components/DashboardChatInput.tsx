"use client";

import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { analyzeLegalIssueAction } from "@/actions/ai";
import { useTranslations } from "next-intl";

export default function DashboardChatInput() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Dashboard");

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await analyzeLegalIssueAction(text);
      if (res.success && res.data) {
        sessionStorage.setItem("nyaya_ai_analysis", JSON.stringify({
          originalIssue: text,
          ...res.data
        }));
        router.push("/dashboard/ai-assistant");
      } else {
        alert(res.error || "Failed to analyze issue.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border-main rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary transition-all">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              handleAnalyze();
            }
          }}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none focus:ring-0 text-text-main placeholder:text-text-light px-4 py-3 outline-none"
          placeholder={t("searchPlaceholder")}
        />
        <button 
          onClick={handleAnalyze}
          disabled={isLoading || !text.trim()}
          className="bg-text-main text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors shrink-0 disabled:opacity-50 min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send size={16} />
              {t("startChat")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
