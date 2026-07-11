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
  Settings,
  Terminal,
  LogOut // <-- Logout icon import kiya
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const {user , loading , logout} = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Explore Projects", icon: Compass, path: "/projects/explore" },
    { name: "Users", icon: Users, path: "/users/explore" },
    { name: "My Projects", icon: FolderGit2, path: "/projects/my" },
    { name: "Reviews Received", icon: MessageSquare, path: "/review", badge: "" },
    { name: "Saved Projects", icon: Bookmark, path: "/projects/saved" },
    { name: "Community", icon: Users, path: "/community" },
    { name: "Profile", icon: User, path: "/profile/my" },
    // { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const isMenuActive = (item) => {
  switch (item.name) {
    case "Dashboard":
      return pathname === "/dashboard";

    case "Explore Projects":
      return (
        pathname === "/projects/explore" ||
        pathname === "/projects/create" ||
        pathname.startsWith("/projects")
      );

    case "My Projects":
      return (
        pathname === "/projects/my" ||
        pathname.startsWith("/projects/my/")
      );

    case "Users":
      return (
        pathname === "/users/explore" ||
        pathname.startsWith("/users")
      );

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
    <aside className="w-64 bg-white border-r border-[#E5E7EB] fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between hidden md:flex">
      <div>
        {/* Logo Branding */}
        <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => router.push("/dashboard")}>
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-sm shadow-[#2563EB]/20 transition-transform group-hover:scale-105">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111827]">
              Dev<span className="text-[#2563EB]">Review</span>
            </span>
          </div>
        </div>

        {/* Navigation Map */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
           const isActive = isMenuActive(item);

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "text-[#2563EB] bg-[#2563EB]/5 font-semibold"
                    : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"
                }`}
              >
                {/* Active Sidebar Highlight pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-[#2563EB]/5 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-[#2563EB]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-[#2563EB]" : "text-[#6B7280] group-hover:text-[#111827]"
                  }`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-[#2563EB] text-white" : "bg-[#E5E7EB] text-[#111827]"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Embedded Fixed Mini Profile Summary with Logout Action */}
      <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC]/50 flex items-center justify-between gap-2 group/profile">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Hamid profile avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E5E7EB]"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] rounded-full ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#111827] truncate">{user?.username}</p>
            <p className="text-[11px] text-[#6B7280] truncate">{user?.email}</p>
          </div>
        </div>

        {/* Actionable Logout Button */}
        <button 
          onClick={() => logout()}
          className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0"
          title="Log Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}