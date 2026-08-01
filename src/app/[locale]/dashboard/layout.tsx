import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardContentWrapper from "@/components/DashboardContentWrapper";
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
        
        {/* Main Content Area with Dynamic Padding */}
        <DashboardContentWrapper user={session}>
          {children}
        </DashboardContentWrapper>
      </div>
    </SidebarProvider>
  );
}
