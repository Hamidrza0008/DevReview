"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Heart, MessageSquare, ExternalLink, GitBranch, 
  Globe, Mail, CheckCircle2, Eye, Star, MapPin, 
  Calendar, Award, Bookmark, Layers, User, Activity, Zap 
} from 'lucide-react';
import { getUserProfile } from '@/services/usersApi';

export default function UserProfile() {
  const { username } = useParams();
  console.log(username);

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    getUser(username);
  }, [username]);

  const getUser = async (username) => {
    if (username) {
      const res = await getUserProfile(username);
      setUser(res.user);
    }
  };

  // Beautiful UI placeholders and dummy data inside constants (DO NOT TOUCH BACKEND)
  const stats = {
    projectsCount: 14,
    reviews: 48,
    likes: 342,
    views: '2.8k'
  };

  const rightSidebarData = {
    location: "San Francisco, CA",
    joinedDate: "Joined March 2024",
    languages: [
      { name: "TypeScript", value: 45, color: "#2563EB" },
      { name: "React / Next.js", value: 30, color: "#3B82F6" },
      { name: "Node.js", value: 15, color: "#10B981" },
      { name: "Other", value: 10, color: "#6B7280" }
    ],
    achievements: [
      { label: "Top Creator", desc: "Top 5% contributors this month", icon: Award, color: "text-amber-500 bg-amber-50" },
      { label: "High Reviewer", desc: "45+ constructive reviews given", icon: Star, color: "text-blue-500 bg-blue-50" },
      { label: "100+ Likes", desc: "Community favorite highlights", icon: Heart, color: "text-rose-500 bg-rose-50" },
      { label: "Top Contributor", desc: "Active helper on ecosystems", icon: Zap, color: "text-emerald-500 bg-emerald-50" }
    ]
  };

  const placeholderBookmarks = [
    { title: "Next.js 15 Server Actions Deep Dive", category: "Article", author: "Vercel Team" },
    { title: "Framer Motion Advanced Layout Orchestration", category: "Guide", author: "Matt Perry" }
  ];

  const placeholderActivity = [
    { type: "commit", text: "Pushed 4 commits to E-Commerce Core repository", time: "2 hours ago" },
    { type: "review", text: "Approved pull request #231 in DevReview Dashboard", time: "1 day ago" }
  ];

  const projects = [
    { title: "DevReview Dashboard", desc: "Premium SaaS dashboard engineered for internal engineering metrics.", likes: 42, reviews: 14, views: 890, status: "Published", tech: ["Next.js", "Tailwind"], hasImage: true },
    { title: "E-Commerce Core", desc: "High-performance headless checkout core microservices ecosystem.", likes: 128, reviews: 34, views: 2450, status: "Published", tech: ["Go", "Redis"], hasImage: false },
    { title: "CodeSnippet CLI", desc: "Instantly save, sync, and share terminal configurations via CLI tool.", likes: 19, reviews: 3, views: 180, status: "Draft", tech: ["TypeScript", "Node"], hasImage: false },
    { title: "AI Prompt Engine", desc: "Vector database wrapper for caching frequent LLM responses.", likes: 88, reviews: 21, views: 1210, status: "Published", tech: ["Python", "FastAPI"], hasImage: true }
  ];

  if (!user) {
    return (
      <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 animate-pulse text-[#111827]">
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-3xl p-6 h-64 shadow-sm"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-sm w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-72 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-sm"></div>
              ))}
            </div>
          </div>
          <div className="h-96 bg-[#FFFFFF] border border-[#E5E7EB] rounded-3xl shadow-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen text-[#111827] max-w-7xl mx-auto space-y-8 antialiased relative selection:bg-[#2563EB]/10 selection:text-[#2563EB]"
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-40 right-10 w-[400px] h-[400px] bg-gradient-to-br from-[#3B82F6]/5 to-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ================= PREMIUM MODERN PROFILE HEADER ================= */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative group shrink-0">
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full blur-md opacity-30 group-hover:opacity-50 transition duration-300"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[#FFFFFF] relative z-10 shadow-md">
                <motion.img 
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3 }}
                  src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80"} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
                    {user.name}
                    {user.isVerified && (
                      <CheckCircle2 className="w-5 h-5 text-[#22C55E] fill-[#22C55E]/10 shrink-0" />
                    )}
                  </h1>
                  <span className="text-xs bg-[#F8FAFC] border border-[#E5E7EB] text-[#6B7280] font-mono px-2 py-0.5 rounded-md">
                    @{user.username}
                  </span>
                  <span className="text-[11px] font-semibold bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/10 px-2 py-0.5 rounded-full">
                    Creator Profile
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#6B7280] mt-2.5 font-medium">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#6B7280]" /> {user.email}</span>
                  <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors group">
                    <GitBranch className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB]" /> GitHub
                  </a>
                  <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors group">
                    <Globe className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB]" /> Website
                  </a>
                </div>
              </div>

              <p className="text-sm text-[#6B7280] font-normal leading-relaxed max-w-xl">
                {user.bio || "No biography details published by this user yet."}
              </p>

              <div className="pt-1">
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {user.skills?.map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-[#F8FAFC] text-[#111827] border border-[#E5E7EB] px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE STATS CARD LINKED BEAUTIFULLY */}
          <div className="flex flex-col gap-4 h-full justify-between lg:border-l lg:border-[#E5E7EB] lg:pl-8">
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-3 text-center sm:text-left">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">Projects</span>
                <span className="text-xl font-bold mt-1 block text-[#111827]">{stats.projectsCount}</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-3 text-center sm:text-left">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">Reviews</span>
                <span className="text-xl font-bold mt-1 block text-[#111827]">{stats.reviews}</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-3 text-center sm:text-left">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">Likes</span>
                <span className="text-xl font-bold mt-1 block text-[#111827]">{stats.likes}</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-3 text-center sm:text-left">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">Profile Views</span>
                <span className="text-xl font-bold mt-1 block text-[#111827]">{stats.views}</span>
              </div>
            </div>

            <div className="w-full pt-2">
              <motion.button 
                whileHover={{ scale: 1.01, backgroundColor: '#2563EB' }}
                whileTap={{ scale: 0.99 }}
                className="w-full text-white bg-[#3B82F6] py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-2xs text-xs tracking-wide transition-all"
              >
                <span>CONNECT WITH USER</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS NAVIGATION SECTION ================= */}
      <div className="border-b border-[#E5E7EB] flex items-center space-x-6 z-10 relative overflow-x-auto scrollbar-none">
        {[
          { id: 'projects', label: 'Showcase Projects', icon: Layers },
          { id: 'about', label: 'About', icon: User },
          { id: 'activity', label: 'Activity Logs', icon: Activity },
          { id: 'bookmarks', label: 'Curated Saves', icon: Bookmark }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all relative whitespace-nowrap outline-none ${
                isActive 
                  ? 'border-[#2563EB] text-[#2563EB]' 
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'projects' && (
                <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-md ${isActive ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-[#F8FAFC] text-[#6B7280]'}`}>
                  {projects.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= MAIN CONTENT GRID (LEFT TAB CONTENT + RIGHT SIDEBAR) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        
        {/* LEFT COMPONENT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'projects' && (
              <motion.div
                key="projects-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-[#111827]">Engineering Repositories</h2>
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: '#1D4ED8' }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#2563EB] text-white px-3.5 py-2 rounded-xl font-semibold flex items-center space-x-1.5 shadow-sm text-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> <span>Follow Space</span>
                  </motion.button>
                </div>

                {/* REDESIGNED PROJECT CARDS IN TWO COLUMN GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((project, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl flex flex-col justify-between overflow-hidden group shadow-xs hover:border-[#2563EB]/50 transition-all"
                    >
                      {/* Browser Screenshot Area Mockup */}
                      <div className="h-36 bg-[#F8FAFC] border-b border-[#E5E7EB] relative flex flex-col overflow-hidden select-none">
                        {/* Browser Top Header Controls */}
                        <div className="flex items-center justify-between px-3 py-2 bg-[#FFFFFF] border-b border-[#E5E7EB] shrink-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB] group-hover:bg-rose-400 transition-colors" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB] group-hover:bg-amber-400 transition-colors" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB] group-hover:bg-emerald-400 transition-colors" />
                          </div>
                          <div className="bg-[#F8FAFC] rounded-md text-[10px] px-4 py-0.5 border border-[#E5E7EB] w-36 text-center text-[#6B7280] font-mono truncate">
                            localhost:3000
                          </div>
                          <Bookmark className="w-3.5 h-3.5 text-[#6B7280] hover:text-[#2563EB] cursor-pointer transition-colors" />
                        </div>
                        {/* Mockup Body Rendering */}
                        <div className="p-4 flex-1 flex flex-col justify-center items-center relative">
                          {project.hasImage ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/5 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                              <Layers className="w-8 h-8 text-[#2563EB]/20" />
                            </div>
                          ) : (
                            <div className="font-mono text-[10px] text-[#6B7280] bg-[#FFFFFF] border border-[#E5E7EB] p-3 rounded-lg shadow-2xs max-w-[80%] truncate">
                              {"const UserNode = () => <Renderer />;"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Details Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2">
                            <h3 className="font-bold text-sm text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                              {project.title}
                            </h3>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                              project.status === 'Published' 
                                ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' 
                                : 'bg-[#6B7280]/10 text-[#6B7280] border-[#E5E7EB]'
                            }`}>
                              {project.status}
                            </span>
                          </div>

                          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                            {project.desc}
                          </p>
                        </div>

                        <div className="space-y-3 pt-1">
                          {/* Tech badges */}
                          <div className="flex flex-wrap gap-1">
                            {project.tech.map((t, idx) => (
                              <span key={idx} className="text-[10px] font-medium bg-[#F8FAFC] border border-[#E5E7EB] px-2 py-0.5 rounded text-[#111827]">
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Action footer counter elements */}
                          <div className="pt-2.5 border-t border-[#E5E7EB] flex justify-between items-center text-[11px] text-[#6B7280]">
                            <div className="flex space-x-3">
                              <span className="flex items-center space-x-1 font-medium hover:text-rose-600 cursor-pointer transition-colors">
                                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/5" /> 
                                <span>{project.likes}</span>
                              </span>
                              <span className="flex items-center space-x-1 font-medium">
                                <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" /> 
                                <span>{project.reviews}</span>
                              </span>
                              <span className="flex items-center space-x-1 font-medium">
                                <Eye className="w-3.5 h-3.5 text-[#6B7280]" /> 
                                <span>{project.views}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a href="#" className="hover:text-[#2563EB] transition-colors"><GitBranch className="w-3.5 h-3.5" /></a>
                              <a href="#" className="hover:text-[#2563EB] transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PLACEHOLDER ABOUT TAB */}
            {activeTab === 'about' && (
              <motion.div
                key="about-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs"
              >
                <h3 className="text-base font-bold text-[#111827]">Biography / Overview</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Highly strategic developer focused on creating clean interactive experiences. Proven track record in orchestrating design libraries, performance-critical server components, and dynamic system frameworks.
                </p>
                <div className="h-[1px] bg-[#E5E7EB] w-full my-2" />
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Primary Framework Focus</h4>
                <p className="text-xs text-[#6B7280]">React Server Ecosystem, Micro-frontends, Distributed backend coordination frameworks, Edge systems optimizations.</p>
              </motion.div>
            )}

            {/* PLACEHOLDER ACTIVITY TAB */}
            {activeTab === 'activity' && (
              <motion.div
                key="activity-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs"
              >
                <h3 className="text-base font-bold text-[#111827]">Recent Contribution Timeline</h3>
                <div className="space-y-4">
                  {placeholderActivity.map((act, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1 shrink-0" />
                      <div>
                        <p className="text-[#111827] font-medium">{act.text}</p>
                        <p className="text-[#6B7280] text-[10px] mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PLACEHOLDER BOOKMARKS TAB */}
            {activeTab === 'bookmarks' && (
              <motion.div
                key="bookmarks-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 space-y-3 shadow-xs"
              >
                <h3 className="text-base font-bold text-[#111827]">Saved Curations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {placeholderBookmarks.map((book, idx) => (
                    <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold bg-[#E5E7EB] px-1.5 py-0.2 rounded text-[#6B7280] uppercase tracking-wide">{book.category}</span>
                        <h4 className="text-xs font-bold text-[#111827] mt-1 line-clamp-1">{book.title}</h4>
                        <p className="text-[10px] text-[#6B7280] mt-0.5">{book.author}</p>
                      </div>
                      <Bookmark className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]/10 shrink-0" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR COMPONENT */}
        <div className="space-y-6">
          {/* ABOUT ME / META INFO */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Metadata Information</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#6B7280]">
                <MapPin className="w-4 h-4 text-[#6B7280] shrink-0" />
                <span className="font-medium text-[#111827]">{rightSidebarData.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#6B7280]">
                <Globe className="w-4 h-4 text-[#6B7280] shrink-0" />
                <a href={user.portfolioUrl || "#"} className="font-medium text-[#2563EB] hover:underline truncate">{user.portfolioUrl || "portfolio-link.dev"}</a>
              </div>
              <div className="flex items-center gap-2.5 text-[#6B7280]">
                <Calendar className="w-4 h-4 text-[#6B7280] shrink-0" />
                <span className="font-medium text-[#111827]">{rightSidebarData.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* LANGUAGES CHART DONUT MOCKUP */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Ecosystem Metrics</h3>
            <div className="flex items-center justify-between gap-4">
              {/* Custom SVG Donut Display Mockup */}
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path className="text-[#E5E7EB]" strokeDasharray="100, 100" stroke="currentColor" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#2563EB]" strokeDasharray="45, 100" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                  <path className="text-[#3B82F6]" strokeDasharray="30, 100" strokeDashoffset="-45" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                  <path className="text-[#10B981]" strokeDasharray="15, 100" strokeDashoffset="-75" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-[10px] font-bold text-[#111827]">Core</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {rightSidebarData.languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                      <span className="text-[#6B7280] font-medium truncate">{lang.name}</span>
                    </div>
                    <span className="font-mono text-[#111827] font-semibold">{lang.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS MOCKUP CARDS */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Achievements</h3>
            <div className="space-y-2.5">
              {rightSidebarData.achievements.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded-xl border border-[#E5E7EB]/40 hover:bg-[#F8FAFC] transition-colors">
                    <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#111827]">{item.label}</h4>
                      <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}