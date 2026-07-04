"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMyProjects } from "@/services/getMyProjectsApi";
import { useAuth } from "@/context/AuthContext";
import {
  FolderGit2,
  MessageSquare,
  ThumbsUp,
  Eye,
  Star,
  Plus,
  ExternalLink,
  ArrowUpRight,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Zap,
  Activity,
  Layers,
  FileCode
} from "lucide-react";
import Sidebar from "./Sidebar";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("My Projects");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const totalNumberOfProjects = projects.length.toString();
  const totalLikes = projects.reduce((total, project) => total + (project.likes || 0), 0);
  const totalReviews = projects.reduce((total, project) => total + (project.reviews || 0), 0);

  // Premium Custom Mock Data Elements (Inside Constants for Safety)
  const rightSidebarWidgets = {
    completion: 82,
    streak: "18 Days",
    rank: "Top 4%",
    recentActivity: [
      { text: "Merged pull request #109 in E-Commerce Core", time: "10m ago", icon: GitBranch },
      { text: "Sarah Jenkins approved DevReview Dashboard", time: "2h ago", icon: ShieldCheck },
      { text: "Achieved 'Top Contributor' status tier", time: "1d ago", icon: Zap }
    ]
  };

  const getProjects = async () => {
    const res = await getMyProjects();
    setProjects(res.projects);
  };

  useEffect(() => {
    getProjects();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased flex relative selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      {/* GRID LAYOUT BACKGROUND PATTERN */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />

      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* MAIN CONTAINER WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 z-10">
        
        {/* PREMIUM STICKY NAVBAR */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-30 px-6 md:px-8 flex items-center justify-between gap-4">
          <div className="w-96 relative group hidden sm:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#2563EB] transition-colors" />
            <input
              type="text"
              placeholder="Search components, code reviews..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#6B7280]/70 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all duration-200 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto sm:ml-0">
            <button className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] rounded-xl transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#2563EB] rounded-full ring-2 ring-white" />
            </button>
            <div className="h-4 w-px bg-[#E5E7EB]" />
            <button className="flex items-center gap-2 p-1 hover:bg-[#F8FAFC] rounded-xl transition-all border border-transparent hover:border-[#E5E7EB]">
              <img
                src={user?.profileImage || "/default-avatar.png"}
                alt="User Profile Anchor"
                className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB]"
                onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
              />
              <span className="text-xs font-semibold text-[#111827] hidden sm:inline">@{user?.username || "user"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
          </div>
        </header>

        {/* WORKSPACE VIEWPORTS CONTAINER */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              /* ================= SKELETON LOADING FRAMEWORK ================= */
              <motion.div
                key="skeleton-view"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="space-y-6"
              >
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 h-36 shadow-2xs animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 h-28 shadow-2xs animate-pulse" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="h-60 bg-white border border-[#E5E7EB] rounded-2xl animate-pulse" />
                  </div>
                  <div className="h-60 bg-white border border-[#E5E7EB] rounded-2xl animate-pulse" />
                </div>
              </motion.div>
            ) : (
              /* ================= PRIMARY CONTENT DASHBOARD LAYER ================= */
              <motion.div
                key="dashboard-content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {/* 1. REDESIGNED HERO COMPONENT */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="flex items-center gap-5 z-10">
                    <div className="relative shrink-0">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
                      <img
                        src={user?.profileImage || "/default-avatar.png"}
                        alt="Ecosystem Avatar Identity"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white relative z-10 shadow-sm"
                        onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                      />
                      <span className="absolute -bottom-1 -right-1 bg-[#2563EB] text-white text-[9px] font-extrabold px-1 py-0.2 rounded-md tracking-wider shadow-sm z-20">
                        PRO
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-[#111827]">
                          Welcome back, {user?.name || "Developer"}
                        </h1>
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] fill-[#22C55E]/10" />
                        <span className="text-[10px] bg-[#F1F5F9] border border-[#E5E7EB] font-mono text-[#6B7280] px-1.5 py-0.2 rounded">
                          @{user?.username || "user"}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] line-clamp-2 max-w-xl font-medium">
                        {user?.bio || "No system logs written under biography metadata settings panel."}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 self-stretch md:self-auto justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Submit Architecture</span>
                  </motion.button>
                </motion.div>

                {/* 2. REDESIGNED METRIC ANALYTICS CARDS */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  {[
                    { title: "Total Repos", value: totalNumberOfProjects, trend: "+2 this cycle", icon: FolderGit2, color: "text-[#2563EB] bg-[#2563EB]/5 border-[#2563EB]/10" },
                    { title: "Ecosystem Views", value: "2.4K", trend: "+12.4% velocity", icon: Eye, color: "text-[#111827] bg-[#111827]/5 border-[#111827]/5" },
                    { title: "Likes Tracked", value: totalLikes, trend: "+18 new hits", icon: ThumbsUp, color: "text-[#22C55E] bg-[#22C55E]/5 border-[#22C55E]/10" },
                    { title: "Audit Reviews", value: totalReviews, trend: "+4 open tasks", icon: MessageSquare, color: "text-[#3B82F6] bg-[#3B82F6]/5 border-[#3B82F6]/10" },
                  ].map((card, i) => {
                    const IconComponent = card.icon;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ y: -3, borderColor: "#2563EB/30" }}
                        className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs group relative overflow-hidden transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{card.title}</span>
                          <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-105 border ${card.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-2xl font-bold tracking-tight text-[#111827] font-sans tabular-nums">
                            {card.value}
                          </span>
                          <span className="text-[10px] font-semibold text-[#22C55E] flex items-center bg-[#22C55E]/5 px-1.5 py-0.2 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                            {card.trend.split(" ")[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] mt-1 font-medium">{card.trend.substring(card.trend.indexOf(" ") + 1)}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* 3. CORE MANAGEMENT GRID HUB */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* LEFT COMPONENT COLUMN */}
                  <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
                    
                    {/* NAV TABS SELECTORS */}
                    <div className="flex items-center gap-6 border-b border-[#E5E7EB] pb-px">
                      {["My Projects", "Feedback Received"].map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative outline-none ${
                              isActive ? "text-[#2563EB]" : "text-[#6B7280] hover:text-[#111827]"
                            }`}
                          >
                            <span>{tab}</span>
                            {isActive && (
                              <motion.div
                                layoutId="premiumLineHighlight"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* DYNAMIC RENDERING BLOCK CONTEXT */}
                    <AnimatePresence mode="wait">
                      {activeTab === "My Projects" ? (
                        <motion.div
                          key="projects-view"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="space-y-4"
                        >
                          {projects.length === 0 ? (
                            /* REDESIGNED EMPTY STATE CARD */
                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center space-y-4 shadow-2xs">
                              <div className="w-12 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-center mx-auto text-[#6B7280]">
                                <FileCode className="w-5 h-5" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-bold text-sm text-[#111827]">No projects indexed yet</h3>
                                <p className="text-xs text-[#6B7280] max-w-xs mx-auto">Get started by linking your primary development repositories directly.</p>
                              </div>
                              <button className="bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs">
                                Add Initial Repository
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {projects.map((project, idx) => (
                                <motion.div
                                  key={idx}
                                  whileHover={{ y: -3 }}
                                  className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-2xs hover:border-[#2563EB]/40 flex flex-col justify-between group cursor-pointer transition-all duration-300"
                                >
                                  {/* Thumbnail Layout Browser Mockup Area */}
                                  <div className="relative aspect-video w-full bg-[#F8FAFC] border-b border-[#E5E7EB] overflow-hidden">
                                    <img
                                      src={project.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"}
                                      alt={project.title}
                                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                    />
                                  </div>

                                  {/* Details Area */}
                                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1">
                                      <h3 className="font-bold text-sm text-[#111827] group-hover:text-[#2563EB] transition-colors flex items-center gap-1.5">
                                        <span>{project.title}</span>
                                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#6B7280]" />
                                      </h3>
                                      <div className="flex flex-wrap gap-1 pt-1">
                                        {project.techStack?.map((tech, tIdx) => (
                                          <span key={tIdx} className="text-[10px] font-medium bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] px-2 py-0.5 rounded-md shadow-2xs">
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2.5 border-t border-[#F1F5F9] text-[11px] font-semibold text-[#6B7280]">
                                      <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                                          <ThumbsUp className="w-3.5 h-3.5 text-rose-500/80 fill-rose-500/5" /> {project.likes || 0}
                                        </span>
                                        <span className="flex items-center gap-1 hover:text-[#2563EB] transition-colors">
                                          <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]/80" /> {project.reviews || 0}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5">
                                        <span>View Code</span>
                                        <ArrowUpRight className="w-3 h-3" />
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        /* ================= REDESIGNED FEEDBACK TAB ================= */
                        <motion.div
                          key="feedback-view"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="space-y-3"
                        >
                          {[
                            { reviewer: "Sarah Jenkins", role: "Lead Architect", company: "Vercel", message: "The database configuration models layout built across this finance platform looks extremely modular. Production grade performance optimization indices executed cleanly.", rating: 5, date: "2 hours ago" },
                            { reviewer: "Alex Rivera", role: "Senior Specialist", company: "GitHub Ecosystems", message: "Brilliant UI modular parsing rules implemented. State synchronization bounds look solid, responsive break lines are perfectly crisp.", rating: 4, date: "Yesterday" }
                          ].map((feedback, fIdx) => (
                            <div key={fIdx} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs space-y-3 transition-all hover:border-[#E5E7EB]">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563EB]/10 to-[#3B82F6]/10 border border-[#E5E7EB] flex items-center justify-center text-xs font-bold text-[#2563EB]">
                                    {feedback.reviewer.split(" ").map(n => n[0]).join("")}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-xs text-[#111827]">{feedback.reviewer}</h4>
                                    <p className="text-[10px] text-[#6B7280] font-medium">{feedback.role} · <span className="text-[#2563EB]">{feedback.company}</span></p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-semibold text-[#6B7280] bg-[#F8FAFC] border border-[#E5E7EB] px-2 py-0.5 rounded-md">{feedback.date}</span>
                              </div>
                              
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, sIdx) => (
                                  <Star key={sIdx} className={`w-3 h-3 ${sIdx < feedback.rating ? "text-amber-400 fill-current" : "text-[#E5E7EB]"}`} />
                                ))}
                              </div>
                              <p className="text-xs text-[#6B7280] leading-relaxed font-normal">"{feedback.message}"</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* 4. REDESIGNED PREMIUM RIGHT SIDEBAR WIDGETS */}
                  <motion.div variants={itemVariants} className="space-y-5 w-full">
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Ecosystem Metrics</h2>
                    </div>

                    {/* Profile Setup Widget Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#111827]">Profile Integrity Index</span>
                        <span className="text-[#2563EB] font-mono">{rightSidebarWidgets.completion}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${rightSidebarWidgets.completion}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#6B7280] pt-1 font-semibold">
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-[#22C55E]" /> {rightSidebarWidgets.rank} Global</span>
                        <span>Streak: {rightSidebarWidgets.streak}</span>
                      </div>
                    </div>

                    {/* Live Contribution Feed Widget */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                        <Activity className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Recent Architecture Stream</span>
                      </div>
                      
                      <div className="space-y-3">
                        {rightSidebarWidgets.recentActivity.map((act, aIdx) => {
                          const ActIcon = act.icon;
                          return (
                            <div key={aIdx} className="flex gap-3 text-[11px] items-start">
                              <div className="p-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg shrink-0 mt-0.5 text-[#6B7280]">
                                <ActIcon className="w-3 h-3" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[#111827] font-medium leading-normal line-clamp-2">{act.text}</p>
                                <span className="text-[9px] font-mono text-[#6B7280] block mt-0.5">{act.time}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="h-px bg-[#F1F5F9] w-full" />
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/5 border border-[#22C55E]/10 px-3 py-2 rounded-xl justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                        <span>All verification metrics synchronized operational</span>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}