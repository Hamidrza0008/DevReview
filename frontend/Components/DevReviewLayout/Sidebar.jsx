"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  MessageSquare,
  Compass,
  Bookmark,
  Users,
  User,
  Terminal,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Explore Projects", icon: Compass, path: "/projects/explore" },
    { name: "Users", icon: Users, path: "/users/explore" },
    { name: "My Projects", icon: FolderGit2, path: "/projects/my" },
    { name: "Reviews Received", icon: MessageSquare, path: "/review", badge: "New" },
    { name: "Saved Projects", icon: Bookmark, path: "/projects/saved" },
    { name: "Community", icon: Users, path: "/community" },
    { name: "Profile", icon: User, path: "/profile/my" },
  ];

  const isMenuActive = (item) => {
    switch (item.name) {
      case "Dashboard":
        return pathname === "/dashboard";
      case "Explore Projects":
        return (
          pathname === "/projects" ||
          pathname === "/projects/explore" ||
          pathname === "/projects/create" ||
          (pathname.startsWith("/projects/") &&
            !pathname.startsWith("/projects/my") &&
            !pathname.startsWith("/projects/saved"))
        );
      case "My Projects":
        return pathname.startsWith("/projects/my");
      case "Users":
        return pathname.startsWith("/users");
      case "Profile":
        return pathname.startsWith("/profile");
      case "Saved Projects":
        return pathname.startsWith("/projects/saved");
      case "Reviews Received":
        return pathname.startsWith("/review");
      case "Community":
        return pathname.startsWith("/community");
      default:
        return pathname === item.path;
    }
  };

  return (
    <aside className="w-64 bg-slate-50/80 border-r border-[#E2E8F0] fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between hidden md:flex shadow-[1px_0_10px_rgba(0,0,0,0.02)] backdrop-blur-md">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Logo Branding */}
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]/80 bg-white/40 backdrop-blur-md sticky top-0 z-10">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => router.push("/dashboard")}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-md shadow-[#2563EB]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#2563EB]/40 group-hover:-rotate-6">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#0F172A]">
              Dev<span className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent">Review</span>
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isMenuActive(item);

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? "text-[#2563EB] font-bold shadow-xs border border-[#2563EB]/10 bg-white"
                    : "text-[#475569] hover:bg-white hover:text-[#0F172A] hover:shadow-xs border border-transparent"
                }`}
              >
                {/* Active Dynamic Glow Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/8 to-[#2563EB]/2 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Left Indicator bar */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActiveBorder"
                    className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-gradient-to-b from-[#2563EB] to-[#3B82F6] shadow-[1px_0_6px_rgba(37,99,235,0.4)]" 
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Content Area */}
                <div className="flex items-center gap-3 transition-transform duration-200 group-hover:translate-x-0.5">
                  <Icon 
                    className={`w-4 h-4 transition-all duration-200 ${
                      isActive 
                        ? "text-[#2563EB] drop-shadow-[0_2px_4px_rgba(37,99,235,0.2)]" 
                        : "text-[#64748B] group-hover:text-[#2563EB]"
                    }`} 
                  />
                  <span className="tracking-wide">{item.name}</span>
                </div>

                {/* Premium Gradient Badge */}
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-wide uppercase transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white shadow-xs" 
                      : "bg-[#EF4444]/10 text-[#EF4444] group-hover:bg-[#EF4444] group-hover:text-white"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Footer Area */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white/60 backdrop-blur-md flex items-center justify-between gap-2 group/profile">
        <div className="flex items-center gap-3 min-w-0 transition-transform duration-200 group-hover/profile:translate-x-0.5">
          <div className="relative flex-shrink-0">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=2563EB&color=fff`}
              alt="Profile avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs border border-[#E2E8F0] transition-all duration-200 group-hover/profile:ring-[#2563EB]/20"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#0F172A] truncate tracking-wide">{user?.username || "Guest User"}</p>
            <p className="text-[10px] text-[#64748B] font-medium truncate tracking-tight">{user?.email || "guest@devreview.com"}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="p-2 text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/8 rounded-xl transition-all duration-200 flex-shrink-0 group/logout"
          title="Log Out"
        >
          <LogOut className="w-4 h-4 transition-transform duration-200 group-hover/logout:-translate-x-0.5" />
        </button>
      </div>
    </aside>
  );
}