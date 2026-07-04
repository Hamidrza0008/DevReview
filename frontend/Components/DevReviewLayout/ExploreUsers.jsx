"use client";

import React, { useState, useEffect } from "react";
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
  Heart,
  MessageSquare,
  Users2,
  Eye,
  Link2Icon
} from "lucide-react";
import { getAllUsers } from "@/services/usersApi";
import { useRouter } from "next/navigation";

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "AI/ML",
  "UI/UX",
  "Open Source",
  "Student"
];

export default function ExploreUsers() {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [followingState, setFollowingState] = useState({});
  const router = useRouter();

  // Premium platform metrics (Dummy for visual enhancement)
  const platformStats = [
    { label: "Elite Developers", value: "12,480+", icon: Users2 },
    { label: "Active Projects", value: "38,290+", icon: Layers },
    { label: "Constructive Reviews", value: "142K+", icon: MessageSquare },
    { label: "Global Commits", value: "1.2M+", icon: GitBranch }
  ];

  const getAllusers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      if (res && res.allUsers) {
        setUsers(res.allUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllusers();
  }, []);

  const filteredDevelopers = users.filter((dev) => {
    const devSkills = dev.skills || [];
    const matchesCategory =
      selectedFilter === "All" || 
      devSkills.some(skill => skill.toLowerCase() === selectedFilter.toLowerCase());

    const normQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !normQuery ||
      (dev.name && dev.name.toLowerCase().includes(normQuery)) ||
      (dev.username && dev.username.toLowerCase().includes(normQuery)) ||
      devSkills.some((skill) => skill.toLowerCase().includes(normQuery));

    return matchesCategory && matchesSearch;
  });

  const toggleFollow = (id) => {
    setFollowingState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] px-4 py-8 md:py-14 md:px-8 max-w-7xl mx-auto space-y-10 antialiased relative selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-[#3B82F6]/5 to-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ================= REDESIGNED HERO SECTION ================= */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/10 text-[#2563EB] font-semibold text-xs mx-auto lg:mx-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Discovery Engine</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827] leading-tight"
          >
            Discover Amazing <br className="hidden md:inline" />
            <span className="text-[#2563EB]">Developers.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm md:text-base text-[#6B7280] font-normal leading-relaxed"
          >
            Find talented developers, collaborate, review production-ready systems and scale ecosystems together.
          </motion.p>

          {/* DUMMY ECOSYSTEM STATS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E5E7EB]/60 mt-6">
            {platformStats.map((stat, sIdx) => {
              const StatIcon = stat.icon;
              return (
                <div key={sIdx} className="text-center lg:text-left space-y-0.5">
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-[#6B7280]">
                    <StatIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className="text-base font-bold text-[#111827]">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ABSTRACT PREMIUM RIGHT SIDE SHAPES GRAPHIC */}
        <div className="relative w-full max-w-[320px] h-48 lg:h-60 flex items-center justify-center select-none hidden sm:flex shrink-0">
          <div className="absolute w-40 h-40 rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] opacity-10 blur-xl animate-pulse" />
          <motion.div 
            animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-4 shadow-md w-48 relative z-10 space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="h-2 w-3/4 bg-[#F8FAFC] border border-[#E5E7EB] rounded" />
            <div className="h-2 w-1/2 bg-[#F8FAFC] border border-[#E5E7EB] rounded" />
            <div className="h-12 bg-gradient-to-tr from-[#2563EB]/5 to-[#3B82F6]/5 border border-[#E5E7EB] rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-[#2563EB]" />
            </div>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-4 bottom-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-2 shadow-sm flex items-center gap-2 z-20"
          >
            <BadgeCheck className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[10px] font-mono font-bold">Verified Logs</span>
          </motion.div>
        </div>
      </div>

      {/* ================= CONTROLS: PREMIUM SEARCH BAR + CONFIG FILTERS ================= */}
      <div className="space-y-4 z-10 relative">
        <div className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto items-center">
          <div className="relative flex-1 w-full group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#2563EB] transition-colors z-20">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by developer, username or skills..."
              className="w-full pl-11 pr-4 py-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl text-sm font-medium placeholder:text-[#6B7280]/70 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 transition-all shadow-2xs"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0">
            <button className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold px-4 py-3 rounded-2xl text-[#111827] shadow-2xs transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Filters</span>
            </button>
            <select className="bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold px-4 py-3 rounded-2xl text-[#111827] shadow-2xs outline-none focus:border-[#2563EB] transition-colors cursor-pointer appearance-none min-w-[110px] text-center">
              <option>Trending</option>
              <option>Newest</option>
              <option>Top Rated</option>
            </select>
          </div>
        </div>

        {/* CATEGORY PILLS FILTER SECTION */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar mask-image-edge max-w-5xl mx-auto">
          {categories.map((category) => {
            const isActive = selectedFilter === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border outline-none ${
                  isActive
                    ? "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] shadow-xs scale-102"
                    : "bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:bg-[#F8FAFC] hover:text-[#111827] hover:border-[#6B7280]/30"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN USERS RENDER INTERFACE LAYER ================= */}
      <div className="z-10 relative">
        <AnimatePresence mode="wait">
          {loading ? (
            /* ================= LOADING SKELETON CARDS LAYER ================= */
            <motion.div
              key="skeleton-grid"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl flex flex-col justify-between h-[390px] overflow-hidden relative shadow-2xs"
                >
                  <div>
                    <div className="h-20 bg-[#F8FAFC] w-full animate-pulse border-b border-[#E5E7EB]/40" />
                    <div className="px-5 pb-2 relative">
                      <div className="w-16 h-16 rounded-full bg-[#E5E7EB] border-4 border-[#FFFFFF] -mt-8 mb-3 animate-pulse" />
                      <div className="w-2/3 h-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded animate-pulse mb-1.5" />
                      <div className="w-1/3 h-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded animate-pulse mb-4" />
                      <div className="w-full h-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded animate-pulse mb-1" />
                      <div className="w-4/5 h-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded animate-pulse mb-5" />
                      <div className="flex gap-1.5">
                        <div className="w-12 h-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-md animate-pulse" />
                        <div className="w-12 h-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-md animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <div className="h-[1px] bg-[#E5E7EB] mb-4" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-9 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl animate-pulse" />
                      <div className="h-9 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* ================= REAL DATA DEVELOPER CARDS GRID ================= */
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
                const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name || 'User')}&background=random`;

                // Custom beautifully randomized UI stats mockup array
                const mockStats = {
                  projects: dev.projects?.length || Math.floor(Math.random() * 12) + 4,
                  reviews: Math.floor(Math.random() * 30) + 12,
                  followers: Math.floor(Math.random() * 200) + 85
                };

                return (
                  <motion.div
                    key={dev._id}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5, 
                      borderColor: "#2563EB", 
                      boxShadow: "0 12px 25px -12px rgba(37,99,235,0.18)" 
                    }}
                    className="group bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-2xs h-[390px]"
                  >
                    <div>
                      {/* Top Gradient Cover Banner */}
                      <div className="h-20 bg-gradient-to-r from-[#2563EB]/5 via-[#3B82F6]/5 to-[#2563EB]/10 border-b border-[#E5E7EB]/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#3B82F6]/10 rounded-full blur-xl pointer-events-none" />
                      </div>

                      {/* Content Area */}
                      <div className="px-5 relative">
                        {/* Profile Image Overlapping Top Banner */}
                        <div className="relative inline-block w-16 h-16 rounded-full overflow-hidden border-4 border-[#FFFFFF] shadow-xs -mt-8 mb-2.5 z-10 bg-[#FFFFFF]">
                          <img
                            src={dev.profileImage || defaultAvatar}
                            alt={dev.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = defaultAvatar;
                            }}
                          />
                        </div>

                        {/* Metadata Identifiers */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-[#111827] text-[14px] sm:text-[15px] tracking-tight truncate max-w-[160px] group-hover:text-[#2563EB] transition-colors">
                              {dev.name || "Anonymous Developer"}
                            </h3>
                            {(dev.isVerified || true) && (
                              <BadgeCheck className="w-4 h-4 text-[#2563EB] fill-[#2563EB]/10 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-[#6B7280]">@{dev.username || "user"}</span>
                            
                            {/* Network Social Links Context */}
                            <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                              <a 
                                href={dev.githubUrl || "#"} 
                                target={dev.githubUrl ? "_blank" : "_self"}
                                rel="noreferrer"
                                className={`text-[#6B7280] transition-colors ${dev.githubUrl ? "hover:text-[#111827]" : "pointer-events-none opacity-30"}`}
                              >
                                <GitBranch className="w-3.5 h-3.5" />
                              </a>
                              <a 
                                href={dev.portfolioUrl || "#"} 
                                target={dev.portfolioUrl ? "_blank" : "_self"}
                                rel="noreferrer"
                                className={`text-[#6B7280] transition-colors ${dev.portfolioUrl ? "hover:text-[#2563EB]" : "pointer-events-none opacity-30"}`}
                              >
                                <Globe className="w-3.5 h-3.5" />
                              </a>
                              <span className="text-[#6B7280] opacity-30 pointer-events-none">
                                <Link2Icon className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Short Abstract Bio */}
                        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 min-h-[36px] mt-2.5">
                          {dev.bio || "No custom log bio published yet. Passionate software architecture engineering architect."}
                        </p>

                        {/* Dynamic Interactive Stats Rows Mockup */}
                        <div className="grid grid-cols-3 gap-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-2 mt-3 text-center">
                          <div>
                            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Repos</span>
                            <span className="text-xs font-bold text-[#111827]">{mockStats.projects}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Reviews</span>
                            <span className="text-xs font-bold text-[#111827]">{mockStats.reviews}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Network</span>
                            <span className="text-xs font-bold text-[#111827]">{mockStats.followers}</span>
                          </div>
                        </div>

                        {/* Skills Badges Render Showcase */}
                        <div className="flex flex-wrap gap-1 mt-3.5 min-h-[24px] content-start overflow-hidden">
                          {devSkills.length > 0 ? (
                            <>
                              {devSkills.slice(0, 2).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 rounded-md bg-[#F8FAFC] text-[#111827] text-[10px] font-semibold border border-[#E5E7EB] group-hover:bg-[#2563EB]/5 group-hover:border-[#2563EB]/20 transition-all"
                                >
                                  {skill}
                                </span>
                              ))}
                              {devSkills.length > 2 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-[#F8FAFC] text-[#6B7280] text-[10px] font-medium border border-[#E5E7EB]">
                                  +{devSkills.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] italic text-[#6B7280]/60">Full-stack Engineer</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Operational Action Footer Buttons */}
                    <div className="p-5 pt-0">
                      <div className="h-[1px] bg-[#E5E7EB]/70 w-full mb-3.5" />
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => toggleFollow(dev._id)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                            isFollowing
                              ? "bg-[#22C55E] text-[#FFFFFF] border-[#22C55E] shadow-2xs"
                              : "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] hover:bg-[#1D4ED8] hover:border-[#1D4ED8] shadow-2xs"
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>

                        <button 
                          onClick={() => router.push(`/users/${dev.username}`)} 
                          className="w-full py-2 px-3 bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-xs font-bold rounded-xl hover:bg-[#F8FAFC] hover:text-[#2563EB] hover:border-[#2563EB]/30 flex items-center justify-center gap-1 transition-all"
                        >
                          <span>Profile</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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

      {/* ================= REDESIGNED EMPTY STATE PLATFORM VIEW ================= */}
      {!loading && filteredDevelopers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] border-dashed max-w-xl mx-auto p-8 shadow-2xs mt-4"
        >
          <div className="w-12 h-12 bg-[#2563EB]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#2563EB]">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#111827] mb-1">No developers found</h3>
          <p className="text-xs text-[#6B7280] font-normal max-w-xs mx-auto">
            Try searching another dynamic keyword, technical framework skill stack or user handle.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedFilter("All"); }}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors border-b border-transparent hover:border-[#2563EB]"
          >
            <span>Reset index parameters</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}