"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Sidebar from "@/Components/DevReviewLayout/Sidebar";
import AppShellSkeleton from "@/Components/Skeleton/AppShellSkeleton";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading]);

  if (loading) return <AppShellSkeleton/>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-page">
      <Sidebar />

      <div className="md:pl-64 min-h-screen flex flex-col pt-14 md:pt-0">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}