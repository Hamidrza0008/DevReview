"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Flame,
  Code,
  Heart,
  MessageSquare,
  ExternalLink,
  GitBranch,
  ArrowUpRight,
  Layers,
  Users,
  Star,
  Bookmark,
  CheckCircle,
  Eye,
  AlertCircle
} from "lucide-react";
import { getExploreProjects } from "@/services/getExploreProjectsApi";
import { toggleLikes } from "@/services/toggleLikesApi";
import { getStats } from "@/services/statsApi";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "All", 
  "Trending", 
  "React", 
  "Next.js", 
  "Node", 
  "TypeScript", 
  "MERN", 
  "Tailwind"
];

export default function ExploreProjects() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ projects: 0, developers: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isPinned, setIsPinned] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const router = useRouter();

  // fetch projects silently if background refresh is needed
  const fetchProjects = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const res = await getExploreProjects();
      if (res?.projects) {
        setProjects(res.projects);
      }
    } catch (err) {
      setError("Failed to load projects. Please check your connection or try again.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getStats();
      if (res) setStats(res);
    } catch (err) {
      // fail silently for stats to not block main UI
      console.error("Failed to load platform stats:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      fetchProjects();
      fetchStats();
    }

    // handle floating search bar on scroll
    const handleScroll = () => {
      setIsPinned(window.scrollY > 420);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // optimistic ui update for instant feedback
  const handleLike = async (e, projectId) => {
    e.stopPropagation(); // prevent card click
    
    const previousProjects = [...projects];
    
    // instantly update local state
    setProjects(currentProjects => 
      currentProjects.map(p => {
        if (p._id === projectId) {
          const isCurrentlyLiked = p.isLiked;
          return {
            ...p,
            isLiked: !isCurrentlyLiked,
            // visually adjust array length for immediate counter update
            likes: isCurrentlyLiked ? p.likes.slice(0, -1) : [...(p.likes || []), 'temp-like']
          };
        }
        return p;
      })
    );

    try {
      await toggleLikes(projectId);
      // resync with server in background to ensure data integrity
      fetchProjects(false); 
    } catch (err) {
      // revert if api fails
      setProjects(previousProjects);
    }
  };

  // memoize heavy array filtering to maintain 60fps
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.toLowerCase().trim();
      
      const matchesSearch = !query ||
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(query));

      let matchesCategory = true;
      if (selectedCategory !== "All") {
        if (selectedCategory === "Trending") {
          matchesCategory = (project.likes?.length || 0) > 2 || parseFloat(project.averageRating || 0) >= 4.0;
        } else {
          matchesCategory = project.techStack?.some(
            tech => tech.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  // fluid stagger animations for grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#111827] font-sans selection:bg-[#2563EB]/20 selection:text-[#2563EB] pb-24">
      
      {/* premium background artifacts */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[400px] left-[-200px] w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{ backgroundImage: `radial-gradient(#E5E7EB 1px, transparent 1px)`, backgroundSize: "24px 24px" }}
      />

      {/* smart pinned top navigation */}
      <AnimatePresence>
        {isPinned && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed top-0 inset-x-0 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#E5E7EB] z-50 py-3 shadow-sm px-6"
          >
            <div className="max-w-4xl mx-auto w-full flex items-center bg-[#F1F5F9] border border-[#E5E7EB] rounded-2xl p-1.5 shadow-sm transition-all focus-within:ring-4 focus-within:ring-[#2563EB]/10 focus-within:border-[#2563EB]">
              <div className="pl-3 pr-2 text-[#6B7280]">
                <Search className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                type="text"
                aria-label="Global search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, frameworks, tech stack..."
                className="flex-1 bg-transparent pl-2 pr-4 py-2 focus:outline-none text-sm text-[#111827] placeholder-[#6B7280]"
              />
              <button className="bg-[#FFFFFF] border border-[#E5E7EB] px-3 py-2 rounded-xl text-xs font-semibold text-[#111827] flex items-center space-x-1.5 shadow-sm hover:bg-[#F8FAFC] transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Filters</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 relative z-10">

        {/* hero section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4 mb-16">
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2563EB]/5 text-[#2563EB] border border-[#2563EB]/10 mb-5 shadow-sm">
                <Layers className="w-3.5 h-3.5" /> Built for Creators
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.1]">
                Explore Open Source <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent">
                  Projects.
                </span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[#6B7280] text-base sm:text-lg max-w-xl font-normal leading-relaxed"
            >
              Discover production-ready projects built by developers around the world. Level up your stack with clean architecture.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E5E7EB]/60 mt-6"
            >
              {[
                { label: "Projects", value: stats.projects || "1,204", icon: Layers },
                { label: "Developers", value: stats.developers || "8,430", icon: Users },
                { label: "Reviews", value: stats.reviews || "24.5K", icon: MessageSquare },
                { label: "Avg Rating", value: "4.92", icon: Star, isRating: true },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-4 shadow-sm backdrop-blur-md hover:border-[#3B82F6]/30 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">{stat.label}</span>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.isRating ? "text-amber-500 fill-amber-500" : "text-[#2563EB]"}`} />
                  </div>
                  <div className="text-xl font-bold tracking-tight text-[#111827]">{stat.value}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* interactive hero illustration */}
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center select-none">
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-[#2563EB]/10 to-[#3B82F6]/10 rounded-full blur-3xl -z-10" />
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [0.5, -0.5, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[420px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] shadow-xl shadow-[#2563EB]/5 p-5 space-y-4 backdrop-blur-md"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E7EB]">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                  <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                  <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                </div>
                <div className="h-5 bg-[#F1F5F9] rounded-md px-6 text-[10px] text-[#6B7280] flex items-center justify-center font-mono font-medium">
                  devreview.app/deploy
                </div>
                <div className="w-6" />
              </div>
              <div className="space-y-4 pt-1">
                <div className="h-32 bg-gradient-to-br from-[#F1F5F9] to-[#FFFFFF] rounded-xl border border-dashed border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                  <div className="w-full px-5 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <div className="h-3 bg-[#E5E7EB] rounded-full w-1/3" />
                      <div className="h-5 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold px-2 py-0.5 rounded-md">+24.5%</div>
                    </div>
                    <div className="h-5 bg-[#E5E7EB] rounded-md w-1/2" />
                    <div className="flex items-end space-x-1.5 h-10 pt-2">
                      {[40, 65, 35, 80, 55, 95, 70, 85].map((h, idx) => (
                        <div key={idx} className="bg-[#2563EB]/80 rounded-t-sm flex-1" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-[#E5E7EB] rounded-xl space-y-2">
                    <div className="h-2 bg-[#E5E7EB] rounded-full w-2/3" />
                    <div className="h-4 bg-[#E5E7EB] rounded-md w-1/2" />
                  </div>
                  <div className="p-3 border border-[#E5E7EB] rounded-xl space-y-2">
                    <div className="h-2 bg-[#E5E7EB] rounded-full w-1/2" />
                    <div className="h-4 bg-[#E5E7EB] rounded-md w-3/4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* main search controls */}
        <section className="max-w-4xl mx-auto w-full mb-8 relative z-20">
          <div className="relative bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-2 shadow-sm transition-all duration-300 flex items-center focus-within:ring-4 focus-within:ring-[#2563EB]/10 focus-within:border-[#2563EB]">
            <div className="pl-4 pr-2 text-[#6B7280]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              aria-label="Search projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, frameworks, tech stack..."
              className="flex-1 bg-transparent pl-2 pr-4 py-3.5 focus:outline-none text-sm font-medium text-[#111827] placeholder-[#6B7280]"
            />
            <button className="bg-[#FFFFFF] border border-[#E5E7EB] px-5 py-3 rounded-xl text-sm font-semibold text-[#111827] flex items-center space-x-2 hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors shadow-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </section>

        {/* filter pills */}
        <section className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-16">
          {CATEGORIES.map((chip) => {
            const isActive = selectedCategory === chip;
            return (
              <button
                key={chip}
                onClick={() => setSelectedCategory(chip)}
                className={`text-xs px-4 py-2.5 rounded-xl font-semibold tracking-wide transition-all outline-none ${
                  isActive
                    ? "bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/20 border border-[#2563EB]"
                    : "bg-[#FFFFFF] border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </section>

        {/* main grid area */}
        <section className="space-y-6">
          
          {/* dynamic header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
            <h3 className="font-bold text-xl flex items-center text-[#111827] tracking-tight">
              <Flame className="w-5 h-5 text-orange-500 mr-2 fill-orange-500/20" />
              Project Showcases
            </h3>
            {!loading && !error && (
              <span className="text-xs text-[#6B7280] font-semibold bg-[#FFFFFF] border border-[#E5E7EB] px-3 py-1 rounded-lg">
                {filteredProjects.length} results
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            
            {/* global error state */}
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#FEF2F2] border border-[#F87171] rounded-2xl p-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-10 shadow-sm"
              >
                <AlertCircle className="w-8 h-8 text-[#EF4444] mb-3" />
                <h3 className="text-base font-bold text-[#991B1B]">Connection Issue</h3>
                <p className="text-sm text-[#B91C1C] mt-1 mb-4">{error}</p>
                <button 
                  onClick={() => fetchProjects()}
                  className="px-5 py-2 bg-[#EF4444] text-[#FFFFFF] text-xs font-bold rounded-xl hover:bg-[#DC2626] transition-colors shadow-sm"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* polished skeleton loaders */}
            {loading && !error && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] h-[440px] flex flex-col justify-between overflow-hidden shadow-sm animate-pulse">
                    <div>
                      <div className="h-48 bg-[#F1F5F9] w-full" />
                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-[#E5E7EB]" />
                          <div className="h-3 bg-[#E5E7EB] rounded w-24" />
                        </div>
                        <div className="space-y-2.5">
                          <div className="h-5 bg-[#F1F5F9] rounded-md w-3/4" />
                          <div className="h-3 bg-[#F1F5F9] rounded w-full" />
                          <div className="h-3 bg-[#F1F5F9] rounded w-5/6" />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <div className="h-5 w-16 bg-[#F1F5F9] rounded-md" />
                          <div className="h-5 w-16 bg-[#F1F5F9] rounded-md" />
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-between items-center bg-[#F8FAFC]">
                      <div className="h-4 bg-[#E5E7EB] rounded w-24" />
                      <div className="h-8 bg-[#E5E7EB] rounded-xl w-20" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* empty state */}
            {!loading && !error && filteredProjects.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-[#FFFFFF] rounded-[24px] border border-dashed border-[#E5E7EB] shadow-sm max-w-2xl mx-auto mt-8"
              >
                <div className="w-14 h-14 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-[#6B7280]" />
                </div>
                <h3 className="text-[#111827] font-bold text-lg mb-1">No blueprints found</h3>
                <p className="text-[#6B7280] text-sm max-w-sm mx-auto mb-6">
                  We couldn't find any projects matching your exact criteria. Try adjusting your search query or filters.
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                  className="px-5 py-2.5 bg-[#F1F5F9] text-[#111827] text-sm font-semibold rounded-xl hover:bg-[#E5E7EB] transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}

            {/* dynamic project grid */}
            {!loading && !error && filteredProjects.length > 0 && (
              <motion.div
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((project, index) => {
                  const badgeTypes = ["Trending", "New", "Staff Pick"];
                  const cardBadge = badgeTypes[index % badgeTypes.length];

                  return (
                    <motion.div
                      key={project._id}
                      variants={itemVariants}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className="group bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#2563EB]/40 rounded-[24px] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/5 transition-all duration-300"
                    >
                      <div>
                        {/* thumbnail container */}
                        <div
                          onClick={() => router.push(`/projects/${project._id}`)}
                          className="relative h-48 w-full overflow-hidden cursor-pointer border-b border-[#E5E7EB] bg-[#F1F5F9] group/thumb"
                        >
                          <div className="absolute top-0 inset-x-0 h-8 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E5E7EB] flex items-center justify-between px-4 z-30 transition-colors group-hover/thumb:bg-[#F8FAFC]">
                            <div className="flex items-center space-x-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                            </div>
                            <div className="text-[10px] font-mono text-[#6B7280] tracking-tight max-w-[140px] truncate">
                              {project.title.toLowerCase().replace(/\s+/g, '-')}.io
                            </div>
                            <Bookmark className="w-3.5 h-3.5 text-[#6B7280] opacity-40 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()} />
                          </div>

                          {/* hover overlay */}
                          <div className="absolute inset-0 bg-[#111827]/40 opacity-0 group-hover/thumb:opacity-100 backdrop-blur-[2px] transition-all duration-300 z-20 flex items-center justify-center">
                            <span className="bg-[#FFFFFF] text-[#111827] px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-lg transform translate-y-4 group-hover/thumb:translate-y-0 transition-all duration-300">
                              View Blueprint <ArrowUpRight className="w-3.5 h-3.5 text-[#2563EB]" />
                            </span>
                          </div>

                          <div className="absolute top-11 left-3 z-20 pointer-events-none">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm tracking-wide text-[#FFFFFF] ${
                              cardBadge === "Trending" ? "bg-orange-500" : cardBadge === "New" ? "bg-[#22C55E]" : "bg-[#2563EB]"
                            }`}>
                              {cardBadge}
                            </span>
                          </div>

                          {project.thumbnail ? (
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover pt-8 transition-transform duration-700 ease-out group-hover/thumb:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full pt-8 flex flex-col items-center justify-center bg-gradient-to-tr from-[#F1F5F9] to-[#F8FAFC] text-[#2563EB] p-4 transition-transform duration-700 group-hover/thumb:scale-105">
                              <Code className="w-8 h-8 mb-2 opacity-50" />
                              <span className="text-[10px] font-mono font-bold tracking-widest bg-[#E5E7EB]/50 text-[#6B7280] px-3 py-1 rounded-md uppercase">
                                {project.techStack?.[0] || "SOURCE"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* info body */}
                        <div className="p-6 space-y-4">
                          {project.owner && (
                            <div 
                              onClick={() => router.push(`/users/${project.owner.username}`)}
                              className="flex items-center space-x-2.5 cursor-pointer group/owner w-fit"
                            >
                              <div className="relative">
                                {project.owner.profileImage ? (
                                  <img
                                    src={project.owner.profileImage}
                                    alt={project.owner.username}
                                    className="w-7 h-7 rounded-full object-cover border-2 border-[#FFFFFF] shadow-sm"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-[#F1F5F9] border-2 border-[#FFFFFF] shadow-sm flex items-center justify-center text-[10px] font-bold text-[#111827] uppercase">
                                    {project.owner.username?.slice(0, 2)}
                                  </div>
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 bg-[#FFFFFF] rounded-full p-0.5">
                                  <CheckCircle className="w-2.5 h-2.5 text-[#2563EB] fill-[#2563EB] stroke-[#FFFFFF]" />
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-[#6B7280] group-hover/owner:text-[#2563EB] transition-colors">
                                @{project.owner.username}
                              </span>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <h4 
                              onClick={() => router.push(`/projects/${project._id}`)}
                              className="font-bold text-lg text-[#111827] line-clamp-1 capitalize tracking-tight group-hover:text-[#2563EB] cursor-pointer transition-colors"
                            >
                              {project.title}
                            </h4>
                            <p className="text-sm text-[#6B7280] line-clamp-2 min-h-[40px] leading-relaxed">
                              {project.description || "Production-ready codebase. Review architectures and implementation frameworks."}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {project.techStack?.slice(0, 4).map((tech, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-semibold font-mono bg-[#F1F5F9] text-[#111827] px-2.5 py-1 rounded-lg border border-transparent group-hover:border-[#E5E7EB] transition-colors capitalize"
                              >
                                {tech}
                              </span>
                            ))}
                            {(project.techStack?.length || 0) > 4 && (
                              <span className="text-[10px] font-semibold font-mono bg-[#F1F5F9] text-[#6B7280] px-2.5 py-1 rounded-lg">
                                +{(project.techStack.length - 4)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* card footer */}
                      <div className="px-6 py-4 border-t border-[#F1F5F9] flex items-center justify-between bg-[#FFFFFF] rounded-b-[24px]">
                        <div className="flex items-center space-x-3.5 text-[#6B7280]">
                          <motion.button 
                            whileTap={{ scale: 0.85 }}
                            onClick={(e) => handleLike(e, project._id)} 
                            className="flex items-center text-[11px] font-bold hover:text-rose-500 transition-colors group/like outline-none"
                            aria-label="Like project"
                          >
                            <Heart
                              className={`w-4 h-4 mr-1.5 transition-all ${
                                project.isLiked
                                  ? "fill-rose-500 text-rose-500"
                                  : "stroke-[2] text-[#6B7280] group-hover/like:text-rose-500"
                              }`}
                            />
                            {project.likes?.length || 0}
                          </motion.button>
                          
                          <button 
                            onClick={() => router.push(`/projects/${project._id}`)} 
                            className="flex items-center text-[11px] font-bold hover:text-[#2563EB] transition-colors outline-none"
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5 stroke-[2]" />
                            {project.reviewsCount || 0}
                          </button>

                          {project.averageRating && (
                            <div className="hidden sm:flex items-center text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Star className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" />
                              {project.averageRating}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="View source code on GitHub"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 text-[#6B7280] hover:text-[#111827] bg-[#F8FAFC] hover:bg-[#E5E7EB] rounded-xl transition-all active:scale-95"
                            >
                              <GitBranch className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="View live project"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-bold text-[#FFFFFF] bg-[#2563EB] hover:bg-[#1D4ED8] px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm transition-all active:scale-95"
                            >
                              <span>Live</span>
                              <ExternalLink className="w-3 h-3 stroke-[2]" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </div>
  );
}