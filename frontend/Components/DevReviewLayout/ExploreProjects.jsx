"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  AlertCircle,
  Sparkles
} from "lucide-react";
import { getExploreProjects } from "@/services/getExploreProjectsApi";
import { toggleLikes } from "@/services/toggleLikesApi";
import { getStats } from "@/services/statsApi";
import { useRouter } from "next/navigation";
import { toggleSaveProject } from "@/services/savedProjectsApi";

const CATEGORIES = [
  "All",
  "Full Stack",
  "Frontend",
  "Backend",
  "MERN",
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Tailwind"
];

// Animated Number Helper
function AnimatedNumber({ value, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const target = typeof value === "number" ? value : parseFloat(value) || 0;
    const from = fromRef.current;
    let start = null;
    let raf;

    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      setDisplay(current);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{Math.round(display).toLocaleString()}</>;
}

// Shimmer Loader
function Shimmer({ className = "" }) {
  return <div className={`shimmer rounded-md ${className}`} />;
}

export default function ExploreProjects() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPinned, setIsPinned] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const router = useRouter();
  const isMountedRef = useRef(true);

  const fetchProjects = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const res = await getExploreProjects();
      if (!isMountedRef.current) return;
      if (res?.projects) {
        setProjects(res.projects);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError("Failed to load projects. Please check your connection or try again.");
    } finally {
      if (isMountedRef.current && showLoader) setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await getStats();
      if (!isMountedRef.current) return;
      if (res) setStats(res);
    } catch (err) {
      console.error("Failed to load platform stats:", err);
    } finally {
      if (isMountedRef.current) setStatsLoading(false);
    }
  };

  const handleSaveButton = async (e, projectId) => {
    e.stopPropagation();
    const previousProjects = [...projects];

    setProjects((current) =>
      current.map((p) => (p._id === projectId ? { ...p, isSaved: !p.isSaved } : p))
    );

    try {
      await toggleSaveProject(projectId);
    } catch (err) {
      setProjects(previousProjects);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchProjects();
    fetchStats();

    const handleScroll = () => {
      setIsPinned(window.scrollY > 420);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      isMountedRef.current = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLike = async (e, projectId) => {
    e.stopPropagation();
    const previousProjects = [...projects];

    setProjects((currentProjects) =>
      currentProjects.map((p) => {
        if (p._id === projectId) {
          const isCurrentlyLiked = p.isLiked;
          return {
            ...p,
            isLiked: !isCurrentlyLiked,
            likes: isCurrentlyLiked ? p.likes.slice(0, -1) : [...(p.likes || []), "temp-like"]
          };
        }
        return p;
      })
    );

    try {
      await toggleLikes(projectId);
      fetchProjects(false);
    } catch (err) {
      setProjects(previousProjects);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.techStack?.some((tech) => tech.toLowerCase().includes(query));

      let matchesCategory = true;
      if (selectedCategory !== "All") {
        if (selectedCategory === "Trending") {
          matchesCategory =
            (project.likes?.length || 0) > 2 || parseFloat(project.averageRating || 0) >= 4.0;
        } else {
          matchesCategory = project.techStack?.some(
            (tech) => tech.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  const derivedAvgRating = useMemo(() => {
    if (stats?.avgRating) return parseFloat(stats.avgRating).toFixed(2);
    if (!projects.length) return null;
    const rated = projects.filter((p) => p.averageRating);
    if (!rated.length) return null;
    const avg = rated.reduce((sum, p) => sum + parseFloat(p.averageRating), 0) / rated.length;
    return avg.toFixed(2);
  }, [stats, projects]);

  const statCards = [
    {
      label: "Projects",
      value: stats?.projects ?? 0,
      icon: Layers,
      color: "text-accent",
      bg: "bg-accent-soft",
      loading: statsLoading
    },
    {
      label: "Developers",
      value: stats?.developers ?? 0,
      icon: Users,
      color: "text-info",
      bg: "bg-info/10",
      loading: statsLoading
    },
    {
      label: "Reviews",
      value: stats?.reviews ?? 0,
      icon: MessageSquare,
      color: "text-accent-2",
      bg: "bg-accent-2/10",
      loading: statsLoading
    },
    {
      label: "Avg Rating",
      value: derivedAvgRating,
      icon: Star,
      color: "text-star fill-star",
      bg: "bg-star/10",
      isRating: true,
      loading: statsLoading || (derivedAvgRating === null && loading)
    }
  ];

  // Hero Text Stagger Animation
  const heroTextVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 20 } }
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
      `}</style>

      {/* Ambient Background Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-linear-to-bl from-accent/25 via-accent-2/15 to-accent-2/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[300px] left-[-200px] w-[500px] h-[500px] bg-linear-to-tr from-accent-2/20 to-info/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[600px] right-[10%] w-[400px] h-[400px] bg-linear-to-l from-accent/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none z-0"
        style={{ backgroundImage: `radial-gradient(var(--color-muted) 1px, transparent 1px)`, backgroundSize: "28px 28px" }}
      />

      {/* Floating Sticky Search */}
      <AnimatePresence>
        {isPinned && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 inset-x-0 bg-surface/80 backdrop-blur-xl border-b border-line z-50 py-3 shadow-sm px-6"
          >
            <div className="max-w-4xl mx-auto w-full flex items-center bg-page border border-line rounded-2xl p-1.5 shadow-sm transition-all focus-within:ring-4 focus-within:ring-accent/10 focus-within:border-accent">
              <div className="pl-3 pr-2 text-accent">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search magical projects, frameworks..."
                className="flex-1 bg-transparent pl-2 pr-4 py-2 focus:outline-none text-sm text-ink placeholder-muted"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 relative z-10">
        
        {/* KHATARNAK HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8 mb-20">
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={heroTextVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-accent-soft text-accent border border-accent/20 mb-5 shadow-[0_0_15px_rgba(47,111,78,0.15)]">
                <Sparkles className="w-4 h-4 text-accent" /> Built for Creators
              </div>
            </motion.div>

            <motion.h1 variants={heroTextVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink leading-[1.1]">
              Explore Open Source <br className="hidden sm:block" />
              <span className="bg-linear-to-r from-accent via-accent to-accent-2 bg-clip-text text-transparent animate-gradient-x drop-shadow-sm">
                Masterpieces.
              </span>
            </motion.h1>

            <motion.p variants={heroTextVariants} className="text-muted text-lg sm:text-xl max-w-xl font-medium leading-relaxed">
              Discover production-ready projects built by passionate developers. Level up your tech stack with clean architecture.
            </motion.p>

            <motion.div variants={heroTextVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6">
              {statCards.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-surface/60 border border-line rounded-2xl p-4 shadow-sm backdrop-blur-md hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted group-hover:text-ink transition-colors">
                      {stat.label}
                    </span>
                    <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {stat.loading ? (
                    <Shimmer className="h-7 w-16" />
                  ) : (
                    <div className="text-2xl font-extrabold tracking-tight text-ink">
                      {stat.isRating ? stat.value ?? "—" : <AnimatedNumber value={stat.value} />}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating Interactive Illustration */}
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center select-none perspective-1000">
            <div className="absolute w-[450px] h-[450px] bg-linear-to-tr from-accent/20 via-accent-2/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse" />

            <motion.div
              animate={{ y: [-10, 10, -10], rotateX: [2, -2, 2], rotateY: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[420px] bg-surface/90 border border-surface rounded-3xl shadow-2xl shadow-accent/10 p-6 space-y-5 backdrop-blur-xl relative z-10"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-like shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-star shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-ok shadow-sm" />
                </div>
                <div className="h-6 bg-page rounded-lg px-6 text-[11px] text-muted flex items-center justify-center font-mono font-semibold border border-line">
                  devreview.app/magic
                </div>
                <div className="w-6" />
              </div>

              <div className="space-y-4 pt-1">
                <div className="h-36 bg-linear-to-br from-accent-soft to-surface rounded-2xl border border-dashed border-accent/30 flex items-center justify-center overflow-hidden relative">
                  <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(63,169,122,0.12)_0,transparent_100%)]"
                  />
                  <div className="w-full px-6 space-y-4 relative z-10">
                    <div className="flex justify-between items-baseline">
                      <div className="h-3 bg-accent/30 rounded-full w-1/3" />
                      <div className="h-6 bg-accent-soft text-accent text-[11px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center">
                        <Flame className="w-3 h-3 mr-1" /> +24.5%
                      </div>
                    </div>
                    <div className="h-6 bg-surface-2 rounded-lg w-1/2" />
                    <div className="flex items-end space-x-2 h-12 pt-2">
                      {[40, 65, 35, 80, 55, 95, 70, 85].map((h, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="bg-linear-to-t from-accent to-accent-2 rounded-t-md flex-1 shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-line bg-page rounded-2xl space-y-2.5">
                    <div className="h-2 bg-line rounded-full w-2/3" />
                    <div className="h-4 bg-line rounded-md w-1/2" />
                  </div>
                  <div className="p-4 border border-line bg-page rounded-2xl space-y-2.5">
                    <div className="h-2 bg-line rounded-full w-1/2" />
                    <div className="h-4 bg-line rounded-md w-3/4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Vibrant Search & Filters */}
        <section className="max-w-4xl mx-auto w-full mb-10 relative z-20">
          <div className="relative bg-surface border-2 border-line rounded-2xl p-2 shadow-lg shadow-accent/5 transition-all duration-300 flex items-center focus-within:ring-4 focus-within:ring-accent/20 focus-within:border-accent">
            <div className="pl-4 pr-2 text-accent">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, tech stack, or framework..."
              className="flex-1 bg-transparent pl-2 pr-4 py-3.5 focus:outline-none text-base font-semibold text-ink placeholder-muted"
            />
          </div>
        </section>

        {/* Dynamic Filter Pills */}
        <section className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto mb-16">
          {CATEGORIES.map((chip) => {
            const isActive = selectedCategory === chip;
            return (
              <button
                key={chip}
                onClick={() => setSelectedCategory(chip)}
                className={`relative text-xs px-5 py-2.5 rounded-xl font-bold tracking-wide transition-all duration-300 outline-none border cursor-pointer ${
                  isActive
                    ? "text-accent-ink border-transparent shadow-md shadow-accent/25"
                    : "bg-surface border-line text-muted hover:bg-accent-soft hover:text-accent hover:border-accent/30"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="categoryPill"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute inset-0 bg-linear-to-r from-accent to-accent-2 rounded-xl -z-10"
                  />
                )}
                {chip}
              </button>
            );
          })}
        </section>

        {/* Project Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-line pb-4">
            <h3 className="font-extrabold text-2xl flex items-center text-ink tracking-tight">
              <Flame className="w-6 h-6 text-star mr-2.5 fill-star/20 animate-pulse" />
              Trending Blueprints
            </h3>
            {!loading && !error && (
              <motion.span
                key={filteredProjects.length}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-accent font-bold bg-accent-soft border border-accent/20 px-3.5 py-1.5 rounded-xl"
              >
                {filteredProjects.length} results
              </motion.span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-danger/10 border border-danger/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-10 shadow-sm"
              >
                <AlertCircle className="w-10 h-10 text-danger mb-4" />
                <h3 className="text-lg font-bold text-danger">Connection Issue</h3>
                <p className="text-sm text-danger/90 mt-2 mb-6">{error}</p>
                <button
                  onClick={() => fetchProjects()}
                  className="px-6 py-2.5 bg-danger text-accent-ink text-sm font-bold rounded-xl hover:brightness-110 transition-colors shadow-md cursor-pointer"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {loading && !error && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-surface border border-line rounded-[28px] h-[450px] flex flex-col justify-between overflow-hidden shadow-sm">
                    <div>
                      <Shimmer className="h-48 w-full rounded-none" />
                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                          <Shimmer className="w-8 h-8 rounded-full" />
                          <Shimmer className="h-3 w-24" />
                        </div>
                        <div className="space-y-3">
                          <Shimmer className="h-6 w-3/4" />
                          <Shimmer className="h-3 w-full" />
                          <Shimmer className="h-3 w-5/6" />
                        </div>
                        <div className="flex gap-2 pt-3">
                          <Shimmer className="h-6 w-16 rounded-md" />
                          <Shimmer className="h-6 w-16 rounded-md" />
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-line flex justify-between items-center bg-page">
                      <Shimmer className="h-5 w-24" />
                      <Shimmer className="h-9 w-24 rounded-xl" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {!loading && !error && filteredProjects.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-surface/80 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-line shadow-sm max-w-2xl mx-auto mt-8"
              >
                <div className="w-16 h-16 bg-accent-soft rounded-2xl flex items-center justify-center mx-auto mb-5 border border-accent/20">
                  <Code className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-ink font-extrabold text-xl mb-2">No blueprints found</h3>
                <p className="text-muted text-sm max-w-md mx-auto mb-8 font-medium">
                  We couldn't find any projects matching your exact criteria. Try adjusting your search query or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-6 py-3 bg-ink text-page text-sm font-bold rounded-xl hover:brightness-125 transition-colors shadow-md cursor-pointer"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}

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
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="group bg-surface border-2 border-line hover:border-accent/50 rounded-[28px] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300"
                    >
                      <div>
                        {/* Thumbnail */}
                        <div
                          onClick={() => router.push(`/projects/${project._id}`)}
                          className="relative h-48 w-full overflow-hidden cursor-pointer border-b border-line bg-page group/thumb"
                        >
                          <div className="absolute top-0 inset-x-0 h-9 bg-surface/90 backdrop-blur-md border-b border-line flex items-center justify-between px-4 z-30 transition-colors group-hover/thumb:bg-surface">
                            <div className="flex items-center space-x-1.5">
                              <div className="w-3 h-3 rounded-full bg-like" />
                              <div className="w-3 h-3 rounded-full bg-star" />
                              <div className="w-3 h-3 rounded-full bg-ok" />
                            </div>
                            <div className="text-[10px] font-mono text-muted tracking-tight max-w-[140px] truncate font-bold">
                              {project.title.toLowerCase().replace(/\s+/g, "-")}.io
                            </div>
                            <Bookmark className="w-4 h-4 text-muted opacity-50 hover:opacity-100 hover:text-accent transition-all" onClick={(e) => e.stopPropagation()} />
                          </div>

                          <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover/thumb:opacity-100 backdrop-blur-[3px] transition-all duration-300 z-20 flex items-center justify-center">
                            <span className="bg-surface text-accent px-5 py-3 rounded-xl text-xs font-extrabold tracking-wide flex items-center gap-2 shadow-xl transform translate-y-6 group-hover/thumb:translate-y-0 transition-all duration-300">
                              View Blueprint <ArrowUpRight className="w-4 h-4 text-accent stroke-[3]" />
                            </span>
                          </div>

                          <div className="absolute top-12 left-4 z-20 pointer-events-none">
                            <span
                              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wide text-accent-ink ${
                                cardBadge === "Trending"
                                  ? "bg-star"
                                  : cardBadge === "New"
                                  ? "bg-linear-to-r from-accent to-accent-2"
                                  : "bg-info"
                              }`}
                            >
                              {cardBadge}
                            </span>
                          </div>

                          {project.thumbnail ? (
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              loading="lazy"
                              className="w-full h-full object-cover pt-9 transition-transform duration-700 ease-out group-hover/thumb:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full pt-9 flex flex-col items-center justify-center bg-linear-to-br from-accent-soft to-accent-2/10 text-accent-2 p-4 transition-transform duration-700 group-hover/thumb:scale-105">
                              <Code className="w-10 h-10 mb-3 opacity-60" />
                              <span className="text-[11px] font-mono font-bold tracking-widest bg-surface text-accent border border-accent/20 px-4 py-1.5 rounded-lg uppercase shadow-sm">
                                {project.techStack?.[0] || "SOURCE"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-4">
                          {project.owner && (
                            <div
                              onClick={() => router.push(`/users/${project.owner.username}`)}
                              className="flex items-center space-x-3 cursor-pointer group/owner w-fit"
                            >
                              <div className="relative">
                                {project.owner.profileImage ? (
                                  <img
                                    src={project.owner.profileImage}
                                    alt={project.owner.username}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-surface shadow-sm group-hover/owner:border-accent/30 transition-colors"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-accent-soft border-2 border-surface shadow-sm flex items-center justify-center text-[10px] font-extrabold text-accent uppercase group-hover/owner:border-accent/30 transition-colors">
                                    {project.owner.username?.slice(0, 2)}
                                  </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-[2px] shadow-sm">
                                  <CheckCircle className="w-3 h-3 text-ok fill-ok stroke-surface" />
                                </div>
                              </div>
                              <span className="text-xs font-bold text-muted group-hover/owner:text-accent transition-colors">
                                @{project.owner.username}
                              </span>
                            </div>
                          )}

                          <div className="space-y-2">
                            <h4
                              onClick={() => router.push(`/projects/${project._id}`)}
                              className="font-extrabold text-[19px] text-ink line-clamp-1 capitalize tracking-tight group-hover:text-accent cursor-pointer transition-colors"
                            >
                              {project.title}
                            </h4>
                            <p className="text-[13px] text-muted line-clamp-2 min-h-[40px] leading-relaxed font-medium">
                              {project.description || "Production-ready codebase. Review architectures and implementation frameworks."}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.techStack?.slice(0, 4).map((tech, i) => (
                              <span
                                key={i}
                                className="text-[11px] font-bold font-mono bg-page text-ink px-3 py-1.5 rounded-lg border border-line group-hover:border-accent/20 group-hover:bg-accent-soft group-hover:text-accent transition-colors capitalize"
                              >
                                {tech}
                              </span>
                            ))}
                            {(project.techStack?.length || 0) > 4 && (
                              <span className="text-[11px] font-bold font-mono bg-surface-2 text-muted px-3 py-1.5 rounded-lg">
                                +{project.techStack.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-6 py-4 border-t-2 border-page flex items-center justify-between bg-surface rounded-b-[28px]">
                        <div className="flex items-center space-x-5 text-muted">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={(e) => handleLike(e, project._id)}
                            className="flex items-center text-[12px] font-extrabold hover:text-like transition-colors group/like outline-none cursor-pointer"
                            aria-label="Like project"
                          >
                            <Heart
                              className={`w-4 h-4 mr-1.5 transition-all ${
                                project.isLiked
                                  ? "fill-like text-like"
                                  : "stroke-[2.5] text-muted group-hover/like:text-like"
                              }`}
                            />
                            {project.likes?.length || 0}
                          </motion.button>

                          <button
                            onClick={() => router.push(`/projects/${project._id}`)}
                            className="flex items-center text-[12px] font-extrabold hover:text-info transition-colors outline-none cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5 stroke-[2.5] text-muted" />
                            {project.reviewsCount || 0}
                          </button>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={(e) => handleSaveButton(e, project._id)}
                            className="flex items-center hover:text-accent transition-colors group/save outline-none cursor-pointer"
                            aria-label="Save project"
                          >
                            <Bookmark
                              className={`w-4 h-4 transition-all ${
                                project.isSaved
                                  ? "fill-accent text-accent"
                                  : "stroke-[2.5] text-muted group-hover/save:text-accent"
                              }`}
                            />
                          </motion.button>
                        </div>

                        <div className="flex items-center space-x-3">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="View source code on GitHub"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2.5 text-muted hover:text-ink bg-surface-2 hover:bg-line rounded-xl transition-all active:scale-95 cursor-pointer"
                            >
                              <GitBranch className="w-4 h-4 stroke-[2.5]" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="View live project"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-extrabold text-accent-ink bg-linear-to-r from-accent to-accent-2 hover:brightness-110 px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-accent/20 transition-all active:scale-95 cursor-pointer"
                            >
                              <span>Live</span>
                              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
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