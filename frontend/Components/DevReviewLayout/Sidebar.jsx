"use client";

import React, { useState } from "react";
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
  LogOut,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/Components/LandingPage/atoms";

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

function isMenuActive(item, pathname) {
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
}

function NavList({ onNavigate }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-1.5">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = isMenuActive(item, pathname);

        return (
          <button
            key={item.name}
            onClick={() => { router.push(item.path); onNavigate?.(); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden ${
              isActive
                ? "font-bold shadow-sm border border-accent/15 bg-surface/80 backdrop-blur-sm"
                : "text-muted hover:bg-surface/80 backdrop-blur-sm hover:text-ink hover:shadow-sm border border-transparent"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="sidebarActivePill"
                className="absolute inset-0 bg-accent-soft -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            {isActive && (
              <motion.div
                layoutId="sidebarActiveBorder"
                className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-accent shadow-[1px_0_8px_rgba(47,111,78,0.4)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <div className="flex items-center gap-3 transition-transform duration-200 group-hover:translate-x-0.5">
              <Icon
                className={`w-4 h-4 transition-all duration-200 ${
                  isActive ? "text-accent" : "text-muted group-hover:text-accent"
                }`}
              />
              <span className={`tracking-wide transition-colors ${isActive ? "text-accent" : ""}`}>
                {item.name}
              </span>
            </div>

            {item.badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-wide uppercase transition-all duration-300 ${
                isActive
                  ? "bg-accent text-accent-ink shadow-md"
                  : "bg-accent-soft text-accent group-hover:bg-accent group-hover:text-accent-ink"
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function ProfileFooter() {
  const { user, logout } = useAuth();
  return (
    <div className="p-4 border-t border-line bg-surface/60 backdrop-blur-xl flex items-center justify-between gap-2 group/profile relative z-10">
      <div className="flex items-center gap-3 min-w-0 transition-transform duration-200 group-hover/profile:translate-x-0.5">
        <div className="relative shrink-0">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=2F6F4E&color=fff`}
            alt="Profile avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-surface shadow-sm border border-line transition-all duration-300 group-hover/profile:ring-accent-2/50"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-ok rounded-full ring-2 ring-surface shadow-[0_0_8px_rgba(47,111,78,0.5)] animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-ink truncate tracking-wide group-hover/profile:text-accent transition-colors">
            {user?.username || "Guest User"}
          </p>
          <p className="text-[10px] text-muted font-medium truncate tracking-tight">
            {user?.email || "guest@devreview.com"}
          </p>
        </div>
      </div>

      <button
        onClick={() => logout()}
        className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all duration-200 shrink-0 group/logout"
        title="Log Out"
      >
        <LogOut className="w-4 h-4 transition-transform duration-200 group-hover/logout:-translate-x-0.5" />
      </button>
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ---- MOBILE TOP BAR ---- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-page/90 backdrop-blur-xl border-b border-line">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-accent-2 flex items-center justify-center shadow-sm">
            <Terminal className="w-4 h-4 text-accent-ink" />
          </div>
          <span className="text-lg font-black tracking-tight text-ink">
            Dev<span className="text-accent">Review</span>
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-line bg-surface text-ink"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ---- MOBILE DRAWER ---- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-72 max-w-[80vw] bg-page z-50 flex flex-col justify-between shadow-2xl"
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="h-14 flex items-center justify-between px-4 border-b border-line">
                  <span className="text-lg font-black tracking-tight text-ink">
                    Dev<span className="text-accent">Review</span>
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-surface"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <NavList onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="flex items-center gap-2 px-4 pb-3">
                <ThemeToggle className="w-full! rounded-xl! flex-row gap-2" />
              </div>
              <ProfileFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ---- DESKTOP SIDEBAR ---- */}
      <aside className="w-64 bg-page/80 border-r border-line fixed top-0 bottom-0 left-0 z-30 flex-col justify-between hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] backdrop-blur-2xl">

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{ y: [0, 40, 0], scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 -left-16 w-64 h-64 bg-accent rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ y: [0, -50, 0], scale: [1, 1.3, 1], opacity: [0.08, 0.16, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 -right-20 w-64 h-64 bg-accent-2 rounded-full blur-[80px]"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="h-16 flex items-center px-6 border-b border-line bg-surface/40 backdrop-blur-md sticky top-0 z-20">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => router.push("/dashboard")}
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-accent-2 flex items-center justify-center shadow-lg shadow-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Terminal className="w-4 h-4 text-accent-ink" />
              </div>
              <span className="text-xl font-black tracking-tight text-ink">
                Dev<span className="bg-linear-to-r from-accent to-accent-2 bg-clip-text text-transparent">Review</span>
              </span>
            </div>
          </div>

          <NavList />
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-line relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Appearance</span>
          <ThemeToggle />
        </div>

        <ProfileFooter />
      </aside>
    </>
  );
}
