import React from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { getSession } from "@/actions/auth";
import { SidebarProvider } from "@/components/SidebarContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-bg-main font-sans selection:bg-black selection:text-white">
        {/* Sidebar - hidden on mobile, block on lg */}
        <DashboardSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-[280px]">
          <DashboardNavbar user={session} />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
