import React from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { getSession } from "@/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen bg-bg-subtle">
      <DashboardNavbar user={session} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
