import React from "react";
import { 
  User, 
  Mail, 
  Smartphone, 
  Lock, 
  Globe, 
  Moon, 
  Type, 
  Bell, 
  Megaphone, 
  Download, 
  Trash2, 
  HelpCircle, 
  Info, 
  Headphones, 
  Crown,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { getSession } from "@/actions/auth";

export default async function SettingsPage() {
  const session = await getSession();
  const userName = session?.name || "Yash Harfode";
  const userEmail = session?.email || "yashharfode@gmail.com";

  const tabs = ["Account", "Preferences", "Notifications", "Privacy & Security", "Billing", "Data & Storage"];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 space-y-6 lg:space-y-8 font-sans selection:bg-black selection:text-white">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-text-muted text-sm">Manage your account, preferences and app settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-border-main">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              idx === 0 
                ? "border-black text-black" 
                : "border-transparent text-text-muted hover:text-text-main"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Information */}
          <div className="bg-white border border-border-main rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-main bg-bg-main/50">
              <h3 className="font-bold text-text-main">Account Information</h3>
            </div>
            <div className="divide-y divide-border-main">
              
              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-subtle transition-colors text-left group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <User size={18} className="text-text-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-main">Profile Information</h4>
                    <p className="text-xs text-text-muted">Update your name, email and profile picture.</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-light group-hover:text-text-main transition-colors" />
              </button>

              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-subtle transition-colors text-left group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Mail size={18} className="text-text-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-main">Email Address</h4>
                    <p className="text-xs text-text-muted">{userEmail}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-light group-hover:text-text-main transition-colors" />
              </button>

              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-subtle transition-colors text-left group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Smartphone size={18} className="text-text-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-main">Phone Number</h4>
                    <p className="text-xs text-text-muted">+91 6261 234 567</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-light group-hover:text-text-main transition-colors" />
              </button>

              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-subtle transition-colors text-left group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Lock size={18} className="text-text-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-main">Change Password</h4>
                    <p className="text-xs text-text-muted">Update your account password.</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-light group-hover:text-text-main transition-colors" />
              </button>

            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-white border border-border-main rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-main bg-bg-main/50">
              <h3 className="font-bold text-text-main">App Preferences</h3>
            </div>
            <div className="divide-y divide-border-main">
              
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Globe size={18} className="text-text-main" />
                  </div>
                  <h4 className="font-semibold text-sm text-text-main">Language</h4>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold cursor-pointer hover:bg-bg-subtle px-3 py-1.5 rounded-lg transition-colors">
                  English (India) <ChevronDown size={16} className="text-text-muted" />
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Moon size={18} className="text-text-main" />
                  </div>
                  <h4 className="font-semibold text-sm text-text-main">Theme</h4>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold cursor-pointer hover:bg-bg-subtle px-3 py-1.5 rounded-lg transition-colors">
                  Light Mode <ChevronDown size={16} className="text-text-muted" />
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Type size={18} className="text-text-main" />
                  </div>
                  <h4 className="font-semibold text-sm text-text-main">Font Size</h4>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold cursor-pointer hover:bg-bg-subtle px-3 py-1.5 rounded-lg transition-colors">
                  Medium <ChevronDown size={16} className="text-text-muted" />
                </div>
              </div>

            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white border border-border-main rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-main bg-bg-main/50">
              <h3 className="font-bold text-text-main">Notification Preferences</h3>
            </div>
            <div className="divide-y divide-border-main">
              
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Bell size={18} className="text-text-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-main">Push Notifications</h4>
                    <p className="text-xs text-text-muted">Receive important updates and reminders.</p>
                  </div>
                </div>
                {/* Custom Toggle Switch */}
                <div className="w-12 h-6 bg-black rounded-full relative cursor-pointer shadow-inner">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Mail size={18} className="text-text-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-main">Email Notifications</h4>
                    <p className="text-xs text-text-muted">Receive email updates about your cases.</p>
                  </div>
                </div>
                {/* Custom Toggle Switch */}
                <div className="w-12 h-6 bg-black rounded-full relative cursor-pointer shadow-inner">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-bg-main rounded-full flex items-center justify-center border border-border-main shrink-0">
                    <Megaphone size={18} className="text-text-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-main">Marketing Emails</h4>
                    <p className="text-xs text-text-muted">Receive news, tips and offers.</p>
                  </div>
                </div>
                {/* Custom Toggle Switch (Off state) */}
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer shadow-inner border border-border-main">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm border border-gray-200"></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Account Summary */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="font-bold text-text-main self-start w-full mb-6">Account Summary</h3>
            
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-gray-500 border-4 border-white shadow-md">
              {userName.charAt(0)}
            </div>
            <h4 className="font-bold text-lg">{userName}</h4>
            <div className="bg-bg-main border border-border-main px-3 py-1 rounded-full text-xs font-semibold text-text-muted mt-2 mb-6">
              Free Plan
            </div>

            <div className="w-full space-y-3 text-sm">
              <div className="flex justify-between border-b border-border-main pb-2">
                <span className="text-text-muted font-medium">Member Since</span>
                <span className="font-semibold">12 May 2025</span>
              </div>
              <div className="flex justify-between border-b border-border-main pb-2">
                <span className="text-text-muted font-medium">Cases Created</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between border-b border-border-main pb-2">
                <span className="text-text-muted font-medium">Documents Uploaded</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-text-muted font-medium">Storage Used</span>
                <span className="font-semibold">2.4 GB of 10 GB</span>
              </div>
            </div>

            <a href="/dashboard/upgrade" className="w-full mt-4 bg-white border border-border-main text-text-main font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-bg-subtle transition-colors shadow-sm text-sm">
              <Crown size={16} className="text-text-main" />
              Upgrade to Pro
            </a>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-4">Quick Actions</h3>
            <div className="space-y-4">
              
              <button className="w-full flex items-start gap-4 text-left group">
                <div className="mt-0.5">
                  <Download size={20} className="text-text-main" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-brand-primary transition-colors">Export My Data</h4>
                  <p className="text-xs text-text-muted">Download your data and documents</p>
                </div>
              </button>

              <button className="w-full flex items-start gap-4 text-left group">
                <div className="mt-0.5">
                  <Trash2 size={20} className="text-text-main" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-red-600 transition-colors">Delete Account</h4>
                  <p className="text-xs text-text-muted">Permanently delete your account</p>
                </div>
              </button>

              <button className="w-full flex items-start gap-4 text-left group">
                <div className="mt-0.5">
                  <HelpCircle size={20} className="text-text-main" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-brand-primary transition-colors">Help & Support</h4>
                  <p className="text-xs text-text-muted">Get help and contact support</p>
                </div>
              </button>

              <button className="w-full flex items-start gap-4 text-left group">
                <div className="mt-0.5">
                  <Info size={20} className="text-text-main" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-brand-primary transition-colors">About NyayaAI</h4>
                  <p className="text-xs text-text-muted">Version 1.0.0</p>
                </div>
              </button>

            </div>
          </div>

          {/* Need Help Box */}
          <div className="bg-white border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="shrink-0">
                <Headphones size={24} className="text-text-main" />
              </div>
              <div>
                <h3 className="font-bold text-text-main mb-1">Need Help?</h3>
                <p className="text-xs text-text-muted mb-4">Our support team is here to help you with any issues.</p>
                <button className="bg-white border border-border-main text-sm font-semibold px-4 py-2 rounded-xl flex items-center justify-between gap-2 hover:bg-bg-subtle transition-colors shadow-sm">
                  Contact Support
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
