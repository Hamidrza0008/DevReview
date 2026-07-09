"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
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

// mock platform metrics for hero section
const PLATFORM_STATS = [
  { label: "Elite Developers", value: "12,480+", icon: Users2 },
  { label: "Active Projects", value: "38,290+", icon: Layers },
  { label: "Constructive Reviews", value: "142K+", icon: MessageSquare },
  { label: "Global Commits", value: "1.2M+", icon: GitBranch }
];

export default function ExploreUsers() {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");
  const [followingState, setFollowingState] = useState({});
  
  const router = useRouter();

  // fetch and hydrate users list
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

    return () => {
      isMounted = false;
    };
  }, []);

  // memoize expensive filter and sort operations
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
        // fallback to trending
        return (b.projects?.length || 0) - (a.projects?.length || 0);
      });
  }, [users, searchQuery, selectedFilter, sortBy]);

  // optimistic update for follow state
  const toggleFollow = (id) => {
    setFollowingState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // snappy spring animations for the grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 25 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] px-4 py-8 md:py-14 md:px-8 max-w-7xl mx-auto space-y-10 antialiased relative selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
      
      {/* ambient background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* hero section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[32px] p-8 md:p-12 shadow-sm relative overflow-hidden z-10 flex flex-col lg:flex-row items-center justify-between gap-10"
      >
        <div className="space-y-5 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/5 border border-[#2563EB]/10 text-[#2563EB] font-semibold text-xs mx-auto lg:mx-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Discovery Engine</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.1]">
            Discover Amazing <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#3B82F6]">Developers.</span>
          </h1>
          
          <p className="text-base md:text-lg text-[#6B7280] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            Find talented developers, collaborate on open-source, review production-ready systems, and scale ecosystems together.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#F1F5F9] mt-8">
            {PLATFORM_STATS.map((stat, idx) => (
              <div key={idx} className="text-center lg:text-left space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[#6B7280]">
                  <stat.icon className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-xl font-bold text-[#111827]">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* decorative floating code block */}
        <div className="relative w-full max-w-[320px] h-64 hidden lg:flex items-center justify-center shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
          <motion.div 
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 shadow-lg w-56 relative z-10 space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
            </div>
            <div className="space-y-2.5">
              <div className="h-2 w-3/4 bg-[#F1F5F9] rounded-full" />
              <div className="h-2 w-1/2 bg-[#F1F5F9] rounded-full" />
              <div className="h-2 w-5/6 bg-[#F1F5F9] rounded-full" />
            </div>
            <div className="h-20 bg-gradient-to-tr from-[#2563EB]/5 to-[#3B82F6]/5 border border-[#2563EB]/10 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-[#2563EB]" />
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [8, -8, 8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 bottom-8 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-3 shadow-md flex items-center gap-2 z-20"
          >
            <BadgeCheck className="w-5 h-5 text-[#22C55E]" />
            <span className="text-xs font-semibold text-[#111827]">Verified Profile</span>
          </motion.div>
        </div>
      </motion.div>

      {/* controls: search & filters */}
      <div className="space-y-6 z-10 relative">
        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto items-center">
          <div className="relative flex-1 w-full group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#2563EB] transition-colors z-20">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              aria-label="Search developers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by developer, username or skills..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl text-sm font-medium placeholder:text-[#6B7280] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto shrink-0">
            <button className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] text-sm font-semibold px-5 py-3.5 rounded-2xl text-[#111827] shadow-sm transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
              <span>Filters</span>
            </button>
            <div className="relative">
              <select 
                aria-label="Sort developers"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E5E7EB] text-sm font-semibold pl-4 pr-10 py-3.5 rounded-2xl text-[#111827] shadow-sm focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all cursor-pointer appearance-none min-w-[130px]"
              >
                <option value="Trending">Trending</option>
                <option value="Newest">Newest</option>
                <option value="Top Rated">Top Rated</option>
              </select>
              {/* custom select chevron */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* horizontal scrollable categories */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar max-w-5xl mx-auto px-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border outline-none ${
                selectedFilter === category
                  ? "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] shadow-md shadow-[#2563EB]/20"
                  : "bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:bg-[#F1F5F9] hover:text-[#111827]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* main view logic */}
      <div className="z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* api error state */}
          {error && !loading && (
            <motion.div
              key="error-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#FEF2F2] border border-[#F87171] rounded-2xl p-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-8"
            >
              <AlertCircle className="w-8 h-8 text-[#EF4444] mb-3" />
              <h3 className="text-base font-bold text-[#991B1B]">Something went wrong</h3>
              <p className="text-sm text-[#B91C1C] mt-1">{error}</p>
            </motion.div>
          )}

          {/* skeleton loaders */}
          {loading && !error && (
            <motion.div
              key="skeleton-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl h-[420px] shadow-sm animate-pulse flex flex-col overflow-hidden"
                >
                  <div className="h-24 bg-[#F1F5F9] w-full" />
                  <div className="px-6 flex-1 flex flex-col relative">
                    <div className="w-16 h-16 rounded-full bg-[#E5E7EB] border-4 border-[#FFFFFF] -mt-8 mb-4" />
                    <div className="w-3/4 h-5 bg-[#F1F5F9] rounded-md mb-2" />
                    <div className="w-1/2 h-4 bg-[#F1F5F9] rounded-md mb-6" />
                    <div className="w-full h-4 bg-[#F1F5F9] rounded-md mb-2" />
                    <div className="w-4/5 h-4 bg-[#F1F5F9] rounded-md mb-6" />
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="h-10 bg-[#F1F5F9] rounded-lg" />
                      <div className="h-10 bg-[#F1F5F9] rounded-lg" />
                      <div className="h-10 bg-[#F1F5F9] rounded-lg" />
                    </div>
                  </div>
                  <div className="p-6 pt-0 mt-auto">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-10 bg-[#F1F5F9] rounded-xl" />
                      <div className="h-10 bg-[#F1F5F9] rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* empty state */}
          {!loading && !error && filteredDevelopers.length === 0 && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] border-dashed max-w-2xl mx-auto p-10 shadow-sm"
            >
              <div className="w-14 h-14 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-6 h-6 text-[#6B7280]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">No developers found</h3>
              <p className="text-sm text-[#6B7280] max-w-sm mx-auto mb-6">
                We couldn't find anyone matching your current filters. Try adjusting your search query or removing categories.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedFilter("All"); }}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#F1F5F9] hover:bg-[#E5E7EB] text-[#111827] text-sm font-semibold rounded-xl transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}

          {/* populated grid */}
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
                // fallback to explicit reliable avatar generation
                const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name || 'User')}&background=F1F5F9&color=111827&bold=true`;

                // mock stats - replace with real data when available
                const stats = {
                  projects: dev.projects?.length || 0,
                  reviews: dev.reviews?.length || 0,
                  likes: dev.likes || 0
                };

                return (
                  <motion.div
                    key={dev._id}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -4, 
                      transition: { duration: 0.2 } 
                    }}
                    className="group bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#2563EB]/40 rounded-2xl flex flex-col transition-all duration-200 relative shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/5 h-[420px]"
                  >
                    {/* banner */}
                    <div className="h-24 bg-gradient-to-r from-[#F1F5F9] to-[#F8FAFC] border-b border-[#E5E7EB] rounded-t-2xl relative overflow-hidden group-hover:from-[#2563EB]/5 group-hover:to-[#3B82F6]/5 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div className="px-6 flex-1 flex flex-col relative">
                      {/* avatar */}
                      <div className="relative inline-block w-16 h-16 rounded-full overflow-hidden border-4 border-[#FFFFFF] shadow-sm -mt-8 mb-3 z-10 bg-[#FFFFFF]">
                        <img
                          src={dev.profileImage || defaultAvatar}
                          alt={`${dev.name}'s profile`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = defaultAvatar;
                          }}
                        />
                      </div>

                      {/* header info */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-[#111827] text-base tracking-tight truncate max-w-[180px] group-hover:text-[#2563EB] transition-colors">
                            {dev.name || "Anonymous Developer"}
                          </h3>
                          {(dev.isVerified !== false) && (
                            <BadgeCheck className="w-4 h-4 text-[#2563EB]" />
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-[#6B7280]">@{dev.username || "user"}</span>
                          
                          {/* social links */}
                          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <a 
                              href={dev.githubUrl || "#"} 
                              target={dev.githubUrl ? "_blank" : "_self"}
                              rel="noreferrer"
                              aria-label="GitHub Profile"
                              className={`text-[#6B7280] transition-colors ${dev.githubUrl ? "hover:text-[#111827]" : "pointer-events-none opacity-40"}`}
                            >
                              <GitBranch className="w-4 h-4" />
                            </a>
                            <a 
                              href={dev.portfolioUrl || "#"} 
                              target={dev.portfolioUrl ? "_blank" : "_self"}
                              rel="noreferrer"
                              aria-label="Portfolio Website"
                              className={`text-[#6B7280] transition-colors ${dev.portfolioUrl ? "hover:text-[#2563EB]" : "pointer-events-none opacity-40"}`}
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      {/* bio */}
                      <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2 min-h-[40px] mb-4">
                        {dev.bio || "Software engineer passionate about building scalable, production-ready web applications."}
                      </p>

                      {/* metrics */}
                      <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-3 text-center mb-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Repos</span>
                          <span className="text-sm font-bold text-[#111827]">{stats.projects}</span>
                        </div>
                        <div className="space-y-0.5 border-l border-r border-[#E5E7EB]">
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Reviews</span>
                          <span className="text-sm font-bold text-[#111827]">{stats.reviews}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Likes</span>
                          <span className="text-sm font-bold text-[#111827]">{stats.likes}</span>
                        </div>
                      </div>

                      {/* skills map */}
                      <div className="flex flex-wrap gap-1.5 mt-auto pb-4">
                        {devSkills.length > 0 ? (
                          <>
                            {devSkills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#111827] text-[11px] font-semibold border border-transparent group-hover:border-[#E5E7EB] transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                            {devSkills.length > 3 && (
                              <span className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#6B7280] text-[11px] font-semibold">
                                +{devSkills.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs italic text-[#6B7280]/70">No specific skills listed</span>
                        )}
                      </div>
                    </div>

                    {/* actions */}
                    <div className="p-5 pt-0 mt-auto border-t border-[#F1F5F9] bg-[#FFFFFF] rounded-b-2xl">
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleFollow(dev._id)}
                          className={`w-full py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                            isFollowing
                              ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 hover:bg-[#22C55E]/20"
                              : "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] hover:bg-[#1D4ED8] hover:border-[#1D4ED8] shadow-sm hover:shadow"
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              <span>Follow</span>
                            </>
                          )}
                        </motion.button>

                        <button 
                          onClick={() => router.push(`/users/${dev.username}`)} 
                          className="w-full py-2.5 px-3 bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-sm font-semibold rounded-xl hover:bg-[#F8FAFC] hover:border-[#2563EB]/40 flex items-center justify-center gap-1.5 transition-all group/btn shadow-sm hover:shadow"
                        >
                          <span>Profile</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover/btn:text-[#2563EB] group-hover/btn:translate-x-1 transition-all" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}