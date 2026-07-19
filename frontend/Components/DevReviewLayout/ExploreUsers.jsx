"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star,
  GitBranch, 
  Globe, 
  BadgeCheck, 
  UserPlus, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Code2,
  SlidersHorizontal,
  Layers,
  MessageSquare,
  Users2,
  AlertCircle
} from "lucide-react";
import { getAllUsers } from "@/services/usersApi";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "All",
  "MERN",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "AI/ML",
  "UI/UX",
  "Open Source",
  "Student"
];

// Live platform metrics — populated from real user data below, no placeholders.

function Shimmer({ className = "" }) {
  return <div className={`shimmer rounded-md ${className}`} />;
}

export default function ExploreUsers() {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");
  const [followingState, setFollowingState] = useState({});
  const [isPinned, setIsPinned] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchUsersList = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllUsers();
        
        if (isMounted && res?.users) {
          setUsers(res.users);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load developers. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsersList();

    const handleScroll = () => {
      setIsPinned(window.scrollY > 420);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredDevelopers = useMemo(() => {
    return users
      .filter((dev) => {
        const devSkills = dev.skills || [];
        const normQuery = searchQuery.toLowerCase().trim();
        
        const matchesCategory = selectedFilter === "All" || 
          devSkills.some((skill) => skill.toLowerCase() === selectedFilter.toLowerCase());

        const matchesSearch = !normQuery ||
          (dev.name?.toLowerCase().includes(normQuery)) ||
          (dev.username?.toLowerCase().includes(normQuery)) ||
          devSkills.some((skill) => skill.toLowerCase().includes(normQuery));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "Newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === "Top Rated") {
          return (b.reviews?.length || 0) - (a.reviews?.length || 0);
        }
        return (b.projects?.length || 0) - (a.projects?.length || 0);
      });
  }, [users, searchQuery, selectedFilter, sortBy]);

  // Real, live numbers only — no placeholder platform stats.
  const liveStats = useMemo(() => {
    const totalProjects = users.reduce((sum, u) => sum + (u.totalProjects || 0), 0);
    const totalReviews = users.reduce((sum, u) => sum + (u.totalReviews || 0), 0);
    return [
      { label: "Developers", value: users.length, icon: Users2 },
      { label: "Projects Shared", value: totalProjects, icon: Layers },
      { label: "Reviews Given", value: totalReviews, icon: MessageSquare }
    ];
  }, [users]);

  const toggleFollow = (id) => {
    setFollowingState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 20 } }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="relative min-h-screen bg-page text-ink font-sans selection:bg-accent/20 selection:text-accent pb-24 overflow-hidden">
      <style jsx>{`
        .shimmer {
          background: linear-gradient(90deg, var(--color-surface-2) 25%, var(--color-line) 37%, var(--color-surface-2) 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .card-glow::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent), var(--color-accent-2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .card-glow:hover::before {
          opacity: 1;
        }
        @keyframes float-ping {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }
        .verified-ping {
          animation: float-ping 2.4s cubic-bezier(0,0,0.2,1) infinite;
        }
      `}</style>

      {/* --- CONTINUOUS BACKGROUND LIGHTS & ANIMATIONS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Left Animated Blob */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"
        />
        {/* Center Right Animated Blob */}
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] -right-[10%] w-[600px] h-[600px] bg-accent-2/20 rounded-full blur-[120px]"
        />
        {/* Bottom Left Animated Blob */}
        <motion.div
          animate={{ x: [-50, 50, -50], y: [50, -50, 50], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] left-[10%] w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px]"
        />
        {/* Minimal Dotted Background Overlay */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{ backgroundImage: `radial-gradient(var(--color-muted) 1px, transparent 1px)`, backgroundSize: "28px 28px" }}
        />
      </div>

      {/* Floating Sticky Search Bar */}
      <AnimatePresence>
        {isPinned && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 inset-x-0 bg-surface/80 backdrop-blur-xl border-b border-line z-50 py-3 shadow-lg shadow-accent/5 px-4 sm:px-6"
          >
            <div className="max-w-4xl mx-auto w-full flex items-center bg-surface-2 border border-line rounded-2xl p-1.5 shadow-sm transition-all focus-within:ring-4 focus-within:ring-accent/15 focus-within:border-accent">
              <div className="pl-3 pr-2 text-accent">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search developers, frameworks..."
                className="flex-1 bg-transparent pl-2 pr-4 py-2 focus:outline-none text-sm font-semibold text-ink placeholder-muted"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-12 relative z-10">
        
        {/* MATCHED HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4 mb-20">
          <motion.div 
            className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={heroTextVariants} className="flex justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface border border-accent/20 text-accent mb-2 shadow-sm shadow-accent/10"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.span>
                Developer Discovery Engine
              </motion.div>
            </motion.div>

            <motion.h1 variants={heroTextVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink leading-[1.1]">
              Connect with <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-accent via-accent to-accent-2 bg-clip-text text-transparent animate-gradient-x">
                Elite Developers.
              </span>
            </motion.h1>

            <motion.p variants={heroTextVariants} className="text-muted text-lg max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
              Find talented developers, collaborate on open-source, review production-ready systems, and scale ecosystems together.
            </motion.p>

            <motion.div variants={heroTextVariants} className="grid grid-cols-3 gap-4 pt-6 mt-6">
              {liveStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="bg-surface/90 backdrop-blur-sm border border-line rounded-2xl p-4 shadow-sm hover:border-accent-2/60 hover:shadow-xl hover:shadow-accent/15 transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left group cursor-default"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted group-hover:text-accent transition-colors">
                      {stat.label}
                    </span>
                    <div className="text-accent bg-accent/5 rounded p-1 group-hover:scale-125 group-hover:bg-accent/10 transition-transform">
                      <stat.icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold tracking-tight text-ink group-hover:text-accent transition-colors tabular-nums">
                    {loading ? "—" : stat.value.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Animated Hero Illustration */}
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center select-none perspective-1000">
            <div className="absolute w-[420px] h-[420px] bg-gradient-to-tr from-accent/20 via-accent-2/15 to-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />

            {/* Floating rating chip */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 -left-6 z-20 bg-surface border border-line rounded-2xl shadow-xl shadow-accent/10 px-4 py-2.5 flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-star fill-star" />
              <span className="text-sm font-extrabold text-ink">4.9</span>
              <span className="text-[10px] font-semibold text-muted">rating</span>
            </motion.div>

            {/* Floating commits chip */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 -right-4 z-20 bg-surface border border-line rounded-2xl shadow-xl shadow-accent/10 px-4 py-2.5 flex items-center gap-2"
            >
              <GitBranch className="w-4 h-4 text-accent" />
              <span className="text-sm font-extrabold text-ink">2.4K</span>
              <span className="text-[10px] font-semibold text-muted">commits</span>
            </motion.div>

            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.02 }}
              className="w-full max-w-[420px] bg-surface border border-line rounded-[32px] shadow-2xl shadow-accent/15 overflow-hidden relative z-10"
            >
              <div className="h-32 bg-gradient-to-br from-accent via-accent to-accent-2 relative flex flex-col items-center justify-end pb-8 overflow-hidden">
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.white/30)_0,transparent_100%)]"
                />
                <div
                  className="absolute inset-0 opacity-[0.15]"
                  style={{ backgroundImage: `radial-gradient(#FFFFFF 1.5px, transparent 1.5px)`, backgroundSize: "18px 18px" }}
                />
                
                <div className="absolute -bottom-8 w-16 h-16 rounded-full bg-gradient-to-br from-accent-2 to-accent border-4 border-surface shadow-lg flex items-center justify-center text-accent-ink z-10">
                  <Code2 className="w-6 h-6" />
                  <div className="absolute bottom-0 right-0 bg-surface rounded-full p-[2px]">
                    <span className="relative inline-flex">
                      <BadgeCheck className="w-4 h-4 text-accent relative z-10" />
                      <span className="verified-ping absolute inset-0 rounded-full bg-accent/50" />
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-8 pb-8 pt-12 relative flex flex-col items-center bg-surface">
                <h4 className="text-base font-extrabold text-ink tracking-tight">Hamid Rza</h4>
                <p className="text-xs font-semibold text-accent mt-0.5 mb-5">Full Stack Engineer</p>

                <div className="w-full grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Repos", val: "18" },
                    { label: "Reviews", val: "56" },
                    { label: "Likes", val: "132" }
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -3 }}
                      className="bg-page border border-surface-2 rounded-xl py-2.5 flex flex-col items-center justify-center gap-0.5 shadow-sm hover:border-accent/30 hover:bg-accent-soft transition-colors"
                    >
                      <span className="text-sm font-extrabold text-ink">{s.val}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{s.label}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full h-11 bg-gradient-to-r from-accent to-accent-2 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-accent/25 text-white text-xs font-bold"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Follow Developer</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="max-w-4xl mx-auto w-full mb-8 relative z-20">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors z-20">
                <Search className="w-5 h-5 stroke-[2.5]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search developers, username or skills..."
                className="w-full pl-14 pr-4 py-4 bg-surface/90 backdrop-blur-md border border-line rounded-2xl text-base font-semibold text-ink placeholder-muted shadow-sm hover:shadow-md focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-surface/90 backdrop-blur-md border border-line hover:bg-page hover:border-accent/40 hover:text-accent text-sm font-bold px-6 py-4 rounded-2xl text-muted shadow-sm transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </motion.button>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface/90 backdrop-blur-md border border-line text-sm font-bold pl-5 pr-10 py-4 rounded-2xl text-muted shadow-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 hover:border-accent/40 transition-all cursor-pointer appearance-none min-w-[140px]"
                >
                  <option value="Trending">Trending</option>
                  <option value="Newest">Newest</option>
                  <option value="Top Rated">Top Rated</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                  <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Category Pills */}
        <section className="flex flex-wrap items-center justify-start sm:justify-center gap-2.5 max-w-4xl mx-auto mb-16 px-2">
          {CATEGORIES.map((category) => {
            const isActive = selectedFilter === category;
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(category)}
                className={`relative text-xs px-5 py-2.5 rounded-xl font-bold tracking-wide transition-all duration-300 outline-none border cursor-pointer ${
                  isActive
                    ? "text-accent-ink border-transparent shadow-md shadow-accent/25"
                    : "bg-surface/80 backdrop-blur-sm border-line text-muted hover:bg-surface hover:text-accent hover:border-accent/30"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="categoryPillUsers"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute inset-0 bg-gradient-to-r from-accent to-accent-2 rounded-xl -z-10"
                  />
                )}
                {category}
              </motion.button>
            );
          })}
        </section>

        {/* Main Grid Area */}
        <section className="space-y-6 relative z-10">
          <div className="flex items-center justify-between pb-4">
            <h3 className="font-extrabold text-2xl flex items-center text-ink tracking-tight">
              Discover Talent
            </h3>
            {!loading && !error && (
              <motion.span
                key={filteredDevelopers.length}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-accent font-bold bg-accent/10 border border-accent/20 px-3.5 py-1.5 rounded-xl shadow-sm"
              >
                {filteredDevelopers.length} developers
              </motion.span>
            )}
          </div>

          <AnimatePresence mode="wait">
            
            {/* Error State */}
            {error && !loading && (
              <motion.div
                key="error-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-danger/10 border border-danger/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-10 shadow-sm"
              >
                <AlertCircle className="w-10 h-10 text-danger mb-4" />
                <h3 className="text-lg font-bold text-danger">Connection Issue</h3>
                <p className="text-sm text-danger/90 mt-2 mb-6">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-danger text-accent-ink text-sm font-bold rounded-xl hover:brightness-110 transition-colors shadow-md cursor-pointer"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}

            {/* Loading Skeletons */}
            {loading && !error && (
              <motion.div
                key="skeleton-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="bg-surface/90 backdrop-blur-sm border border-line rounded-[28px] h-[480px] shadow-sm flex flex-col overflow-hidden">
                    <Shimmer className="h-20 w-full rounded-none" />
                    <div className="px-6 flex-1 flex flex-col relative">
                      <Shimmer className="w-20 h-20 rounded-full border-4 border-surface -mt-10 mb-4 mx-auto" />
                      <Shimmer className="w-2/3 h-6 mb-2 mx-auto" />
                      <Shimmer className="w-1/3 h-4 mb-6 mx-auto" />
                      <Shimmer className="w-full h-4 mb-2" />
                      <Shimmer className="w-4/5 h-4 mb-6 mx-auto" />
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <Shimmer className="h-16 rounded-xl" />
                        <Shimmer className="h-16 rounded-xl" />
                        <Shimmer className="h-16 rounded-xl" />
                      </div>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                      <div className="grid grid-cols-2 gap-3">
                        <Shimmer className="h-11 rounded-xl" />
                        <Shimmer className="h-11 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredDevelopers.length === 0 && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-surface/80 backdrop-blur-md rounded-[32px] border border-dashed border-line shadow-sm max-w-2xl mx-auto mt-8"
              >
                <div className="w-16 h-16 bg-page rounded-2xl flex items-center justify-center mx-auto mb-5 border border-line">
                  <Search className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-ink font-extrabold text-xl mb-2">No developers found</h3>
                <p className="text-muted text-sm max-w-sm mx-auto mb-8 font-medium">
                  We couldn't find anyone matching your exact criteria. Try adjusting your search query or filters.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSearchQuery(""); setSelectedFilter("All"); }}
                  className="px-6 py-3 bg-gradient-to-r from-accent to-accent-2 text-accent-ink text-sm font-bold rounded-xl hover:from-accent hover:to-accent transition-all shadow-md cursor-pointer"
                >
                  Clear all filters
                </motion.button>
              </motion.div>
            )}

            {/* Populated Grid */}
            {!loading && !error && filteredDevelopers.length > 0 && (
              <motion.div
                key="real-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredDevelopers.map((dev) => {
                  const isFollowing = followingState[dev._id] || false;
                  const devSkills = dev.skills || [];
                  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name || 'User')}&background=F1F5F9&color=111827&bold=true`;

                  return (
                    <motion.div
                      key={dev._id}
                      variants={itemVariants}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      // STRICT FORMATTING: flex-col with explicit height and mt-auto guarantees alignment
                      className="card-glow group bg-surface/95 backdrop-blur-sm border border-line hover:border-transparent rounded-[24px] flex flex-col transition-all duration-300 relative shadow-sm hover:shadow-2xl hover:shadow-accent/20 h-[480px] overflow-hidden"
                    >
                      {/* Top Banner */}
                      <div className="h-20 bg-gradient-to-b from-accent to-accent-2 relative overflow-hidden transition-colors">
                        <motion.div
                          animate={{ opacity: [0.15, 0.4, 0.15] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.white/30)_0,transparent_100%)]"
                        />
                      </div>

                      <div className="px-5 flex-1 flex flex-col relative z-10">
                        {/* Avatar */}
                        <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden border-[5px] border-surface shadow-md -mt-10 mb-3 bg-surface group-hover:shadow-lg group-hover:shadow-accent/20 transition-shadow">
                          <img
                            src={dev.profileImage || defaultAvatar}
                            alt={`${dev.name}'s profile`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = defaultAvatar;
                            }}
                          />
                        </div>

                        {/* Centered Name & Username */}
                        <div className="text-center space-y-0.5 mb-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <h3 
                              onClick={() => router.push(`/users/${dev.username}`)}
                              className="font-extrabold text-ink text-[18px] tracking-tight truncate max-w-[180px] group-hover:text-accent transition-colors cursor-pointer"
                            >
                              {dev.name || "Anonymous Developer"}
                            </h3>
                            {(dev.isVerified !== false) && (
                              <BadgeCheck className="w-4 h-4 text-accent group-hover:scale-125 transition-transform" />
                            )}
                          </div>
                          
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-xs font-semibold text-muted">@{dev.username || "user"}</span>
                            {/* Hover Social Links */}
                            <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                              {dev.githubUrl && (
                                <a 
                                  href={dev.githubUrl} 
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-muted hover:text-ink hover:scale-125 transition-all inline-block cursor-pointer"
                                >
                                  <GitBranch className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {dev.portfolioUrl && (
                                <a 
                                  href={dev.portfolioUrl} 
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-muted hover:text-accent hover:scale-125 transition-all inline-block cursor-pointer"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Bio */}
                        <p className="text-[13px] text-muted font-medium leading-relaxed line-clamp-2 min-h-[40px] mb-5 text-center px-2">
                          {dev.bio || "Software engineer passionate about building scalable, production-ready applications."}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-1 bg-page rounded-xl p-3 text-center mb-5 border border-surface-2 group-hover:border-accent/25 group-hover:bg-accent-soft/60 transition-colors">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Repos</span>
                            <span className="text-sm font-extrabold text-ink group-hover:text-accent transition-colors">{dev.totalProjects || 0}</span>
                          </div>
                          <div className="space-y-1 border-l border-r border-line group-hover:border-accent/20 transition-colors">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Reviews</span>
                            <span className="text-sm font-extrabold text-ink group-hover:text-accent transition-colors">{dev.totalReviews || 0}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Likes</span>
                            <span className="text-sm font-extrabold text-ink group-hover:text-accent transition-colors">{dev.totalLikes || 0}</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap justify-center gap-1.5 pb-2">
                          {devSkills.length > 0 ? (
                            <>
                              {devSkills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1 rounded-full bg-surface text-accent text-[11px] font-bold border border-line group-hover:border-accent/40 group-hover:bg-accent-soft transition-colors"
                                >
                                  {skill}
                                </span>
                              ))}
                              {devSkills.length > 3 && (
                                <span className="px-3 py-1 rounded-full bg-surface-2 text-muted text-[11px] font-bold border border-line">
                                  +{devSkills.length - 3}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs italic font-medium text-muted">No specific skills listed</span>
                          )}
                        </div>

                        {/* Button Actions - ALWAYS sticks to bottom due to mt-auto */}
                        <div className="mt-auto pb-5 pt-2">
                          <div className="grid grid-cols-2 gap-3">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleFollow(dev._id)}
                              className={`w-full py-2.5 px-2 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                                isFollowing
                                  ? "bg-accent text-accent-ink hover:brightness-90 shadow-accent/25"
                                  : "bg-gradient-to-r from-accent to-accent-2 text-accent-ink hover:from-accent hover:to-accent shadow-accent/25"
                              }`}
                            >
                              <AnimatePresence mode="wait" initial={false}>
                                {isFollowing ? (
                                  <motion.span
                                    key="following"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-1.5"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    <span>Following</span>
                                  </motion.span>
                                ) : (
                                  <motion.span
                                    key="follow"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-1.5"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Follow</span>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => router.push(`/users/${dev.username}`)} 
                              className="w-full py-2.5 px-2 bg-surface border border-line text-ink text-[13px] font-bold rounded-xl hover:bg-page hover:border-accent/30 flex items-center justify-center gap-1.5 transition-all group/btn shadow-sm cursor-pointer"
                            >
                              <span>Profile</span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted group-hover/btn:text-accent group-hover/btn:translate-x-1 transition-transform" />
                            </motion.button>
                          </div>
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
