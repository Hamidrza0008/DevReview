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
  Code2
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
  const router = useRouter()

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
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] px-4 py-12 md:px-8 max-w-7xl mx-auto selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/5 border border-[#2563EB]/10 text-[#2563EB] font-medium text-xs mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover Elite Tech Talent</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#111827] via-[#111827] to-[#2563EB]"
        >
          Explore Top Developers
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base text-[#6B7280] font-medium"
        >
          Connect, review, and collaborate with standard-setting creators from around the world.
        </motion.p>
      </div>

      {/* SEARCH BAR */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="max-w-2xl mx-auto mb-8 relative group"
      >
        <div className="absolute inset-0 bg-[#2563EB]/5 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#2563EB] transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, username or skill..."
          className="w-full pl-12 pr-4 py-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl text-sm font-medium placeholder:text-[#6B7280]/70 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 transition-all shadow-sm"
        />
      </motion.div>

      {/* CATEGORY FILTERS */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar mask-image-edge"
      >
        {categories.map((category) => {
          const isActive = selectedFilter === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] shadow-md shadow-[#2563EB]/10 scale-105"
                  : "bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:bg-[#F1F5F9] hover:text-[#111827] hover:border-[#6B7280]/20"
              }`}
            >
              {category}
            </button>
          );
        })}
      </motion.div>

      {/* MAIN DATA LAYER */}
      <AnimatePresence mode="wait">
        {loading ? (
          /* LOADING SKELETON LAYER */
          <motion.div
            key="skeleton-grid"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <div 
                key={idx} 
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between h-[360px] overflow-hidden relative shadow-sm"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent" />
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#F1F5F9] animate-pulse" />
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded bg-[#F1F5F9] animate-pulse" />
                      <div className="w-6 h-6 rounded bg-[#F1F5F9] animate-pulse" />
                    </div>
                  </div>
                  <div className="w-2/3 h-5 bg-[#F1F5F9] rounded animate-pulse mb-1.5" />
                  <div className="w-1/3 h-3.5 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <div className="w-full h-3 bg-[#F1F5F9] rounded animate-pulse mb-2" />
                  <div className="w-5/6 h-3 bg-[#F1F5F9] rounded animate-pulse mb-5" />
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <div className="w-14 h-5 bg-[#F1F5F9] rounded-md animate-pulse" />
                    <div className="w-12 h-5 bg-[#F1F5F9] rounded-md animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="w-full h-[1px] bg-[#F1F5F9] mb-4" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 bg-[#F1F5F9] rounded-lg animate-pulse" />
                    <div className="h-9 bg-[#F1F5F9] rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* ACTUAL RENDERED DEVELOPERS GRID FROM DB */
          <motion.div
            key="real-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredDevelopers.map((dev) => {
              const isFollowing = followingState[dev._id] || false;
              const devSkills = dev.skills || [];
              const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name || 'User')}&background=random`;

              return (
                <motion.div
                  key={dev._id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -6, 
                    borderColor: "#2563EB", 
                    boxShadow: "0 12px 30px -10px rgba(37,99,235,0.12)" 
                  }}
                  className="group bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative shadow-sm hover:z-10 h-[360px]"
                >
                  <div>
                    {/* Card Top Section (Image, Icons) */}
                    <div className="flex justify-between items-start mb-3.5">
                      <div className="relative rounded-full overflow-hidden w-14 h-14 border-2 border-transparent group-hover:border-[#2563EB]/10 transition-colors duration-300">
                        <img
                          src={dev.profileImage || defaultAvatar}
                          alt={dev.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex gap-1">
                        {dev.githubUrl && (
                          <a 
                            href={dev.githubUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg border border-[#E5E7EB] transition-colors"
                          >
                            <GitBranch className="w-4 h-4" />
                          </a>
                        )}
                        {dev.portfolioUrl && (
                          <a 
                            href={dev.portfolioUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1.5 text-[#6B7280] hover:text-[#3B82F6] bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg border border-[#E5E7EB] transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Developer Metadata */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-[#111827] text-[15px] tracking-tight group-hover:text-[#2563EB] transition-colors duration-200 truncate max-w-[150px]">
                        {dev.name || "Anonymous User"}
                      </h3>
                      <BadgeCheck className="w-4 h-4 text-[#2563EB] fill-[#2563EB]/10 flex-shrink-0" />
                    </div>
                    <p className="text-xs font-semibold text-[#6B7280] mb-3">@{dev.username || "user"}</p>
                    
                    {/* Bio */}
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 min-h-[36px] mb-4">
                      {dev.bio || "No bio added yet. Just a passionate builder crafting amazing web solutions."}
                    </p>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5 min-h-[26px] content-start">
                      {devSkills.length > 0 ? (
                        <>
                          {devSkills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#111827] text-[10px] font-bold border border-[#E5E7EB] group-hover:border-[#2563EB]/20 group-hover:bg-[#2563EB]/5 transition-colors duration-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {devSkills.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#F8FAFC] text-[#6B7280] text-[10px] font-medium border border-[#E5E7EB]">
                              +{devSkills.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[11px] italic text-[#9CA3AF]">No skills listed</span>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* CTA Actions Block */}
                    <div className="grid grid-cols-2 gap-2 border-t border-[#F1F5F9] pt-4">
                      <button
                        onClick={() => toggleFollow(dev._id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all duration-300 ${
                          isFollowing
                            ? "bg-[#22C55E] text-[#FFFFFF] border-[#22C55E] shadow-sm shadow-[#22C55E]/10"
                            : "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] hover:bg-[#3B82F6] hover:border-[#3B82F6] shadow-sm shadow-[#2563EB]/10"
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

                      <button onClick={() => router.push(`/users/${dev.username}`)} className="w-full py-2 px-3 bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-xs font-bold rounded-xl hover:bg-[#F1F5F9] hover:text-[#2563EB] hover:border-[#2563EB]/30 flex items-center justify-center gap-1 transition-all duration-200">
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

      {/* EMPTY STATE */}
      {!loading && filteredDevelopers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-24 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] border-dashed max-w-xl mx-auto p-8 shadow-sm mt-6"
        >
          <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center mx-auto mb-4 text-[#6B7280]">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#111827] mb-1">No developers found.</h3>
          <p className="text-xs text-[#6B7280] font-medium">Try searching another skill, domain, or developer moniker.</p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedFilter("All"); }}
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#3B82F6] transition-colors"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
}