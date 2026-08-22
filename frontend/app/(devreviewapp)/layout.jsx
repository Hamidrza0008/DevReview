"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Sidebar from "@/Components/DevReviewLayout/Sidebar";
import AppShellSkeleton from "@/Components/Skeleton/AppShellSkeleton";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function DashboardLayoutInner({ children }) {
  const { user, loading } = useAuth();
  const { collapsed } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading]);

  if (loading) return <AppShellSkeleton />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-page">
      <Sidebar />
      <div
        className={`min-h-screen flex flex-col pt-14 md:pt-0 transition-all duration-300 ${
          collapsed ? "md:pl-16" : "md:pl-64"
        }`}
      >
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SidebarProvider>
  );
}
