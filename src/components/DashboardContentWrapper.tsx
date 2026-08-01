"use client";

import React from "react";
import { useSidebar } from "@/components/SidebarContext";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardContentWrapper({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: { name: string; email: string } | null;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`flex-1 flex flex-col transition-all duration-300 ${
        isCollapsed ? "lg:pl-[76px]" : "lg:pl-[280px]"
      }`}
    >
      <DashboardNavbar user={user} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
