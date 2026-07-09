"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Heart, MessageSquare, ExternalLink, GitBranch,
  Globe, Mail, CheckCircle2, Eye, Star, MapPin,
  Calendar, Award, Bookmark, Layers, User, Activity, Zap,
  AlertCircle, Code2, ArrowUpRight
} from "lucide-react";
import { getUserProfile } from "@/services/usersApi";
import { getProjectByUsername } from "@/services/getProjectsByUsernameApi";
import { toggleLikes } from "@/services/toggleLikesApi";

export default function UserProfile() {
  const router = useRouter();
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalProjects: 0,
    totalReviews: 0,
    profileView: 0,
  });

  // fetch user profile and associated projects
  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [userRes, projectsRes] = await Promise.all([
          getUserProfile(username),
          getProjectByUsername(username)
        ]);

        if (isMounted) {
          if (!userRes?.user) {
            setError("User not found.");
            return;
          }

          setUser(userRes.user);
          setStats({
            totalLikes: userRes.totalLikes || 0,
            totalProjects: userRes.totalProjects || 0,
            totalReviews: userRes.totalReviews || 0,
            profileView: userRes.user.views || 0,
          });
          
          setProjects(projectsRes?.projects || []);
        }
      } catch (err) {
        if (isMounted) setError("Failed to load profile data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (username) fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [username]);

  // optimistic update for perceived speed
  const handleLikeButton = async (e, projectId) => {
    e.stopPropagation();
    
    // store previous state to revert if api fails
    const previousProjects = [...projects];
    
    // instantly update UI
    setProjects(current => 
      current.map(p => {
        if (p._id === projectId) {
          const isLiked = p.isLiked;
          return {
            ...p,
            isLiked: !isLiked,
            likes: isLiked ? p.likes.slice(0, -1) : [...(p.likes || []), "temp-like"]
          };
        }
        return p;
      })
    );

    try {
      await toggleLikes(projectId);
      // background sync to ensure data accuracy
      const freshProjects = await getProjectByUsername(username);
      setProjects(freshProjects.projects);
    } catch (err) {
      // revert on failure
      setProjects(previousProjects);
    }
  };

  // mockup data for sidebar
  const rightSidebarData = {
    location: "San Francisco, CA",
    joinedDate: "Joined March 2024",
    languages: [
      { name: "TypeScript", value: 45, color: "#2563EB" },
      { name: "React / Next.js", value: 30, color: "#3B82F6" },
      { name: "Node.js", value: 15, color: "#22C55E" },
      { name: "Other", value: 10, color: "#6B7280" }
    ],
    achievements: [
      { label: "Top Creator", desc: "Top 5% contributors this month", icon: Award, color: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20" },
      { label: "High Reviewer", desc: "45+ constructive reviews given", icon: Star, color: "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20" },
      { label: "Community Favorite", desc: "Highly starred blueprints", icon: Heart, color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20" }
    ]
  };

  const placeholderActivity = [
    { type: "commit", text: "Pushed updates to E-Commerce Core repository", time: "2 hours ago" },
    { type: "review", text: "Approved pull request #231 in DevReview", time: "1 day ago" }
  ];

  // framer variants for staggered lists
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 25 } }
  };

  // handle loading and error states cleanly
  if (loading || error) {
    return (
      <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen max-w-7xl mx-auto space-y-8">
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FEF2F2] border border-[#F87171] rounded-[24px] p-8 text-center max-w-2xl mx-auto mt-20 shadow-sm"
          >
            <AlertCircle className="w-10 h-10 text-[#EF4444] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#991B1B] mb-2">{error}</h3>
            <p className="text-sm text-[#B91C1C] mb-6">The profile you are looking for might have been removed or is temporarily unavailable.</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-[#EF4444] text-[#FFFFFF] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#DC2626] transition-colors"
            >
              Return Home
            </button>
          </motion.div>
        ) : (
          /* layout-matched skeleton */
          <div className="animate-pulse space-y-8">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[32px] p-8 h-64 shadow-sm flex items-center gap-8">
              <div className="w-28 h-28 rounded-full bg-[#F1F5F9]" />
              <div className="space-y-4 flex-1">
                <div className="h-8 bg-[#F1F5F9] rounded-lg w-1/4" />
                <div className="h-4 bg-[#F1F5F9] rounded w-1/3" />
                <div className="h-4 bg-[#F1F5F9] rounded w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-12 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl w-full max-w-sm" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[380px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] shadow-sm" />
                  ))}
                </div>
              </div>
              <div className="h-[600px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] shadow-sm" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen text-[#111827] max-w-7xl mx-auto space-y-8 antialiased relative selection:bg-[#2563EB]/20 selection:text-[#2563EB] pb-24"
    >
      {/* background textures */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* header card */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10">
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
            
            {/* avatar */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full blur-md opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#FFFFFF] relative z-10 shadow-md bg-[#F1F5F9]">
                <img
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=F1F5F9&color=111827`}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            {/* user info */}
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111827] flex items-center gap-2">
                    {user.name}
                    {(user.isVerified !== false) && (
                      <CheckCircle2 className="w-6 h-6 text-[#2563EB]" />
                    )}
                  </h1>
                  <span className="text-xs bg-[#F1F5F9] border border-[#E5E7EB] text-[#6B7280] font-mono px-2.5 py-1 rounded-lg">
                    @{user.username}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[#6B7280] mt-3 font-medium">
                  {user.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>}
                  {user.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors">
                      <GitBranch className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {user.portfolioUrl && (
                    <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors">
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm md:text-base text-[#6B7280] font-normal leading-relaxed max-w-xl">
                {user.bio || "This user hasn't added a bio yet."}
              </p>

              <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs bg-[#FFFFFF] text-[#111827] border border-[#E5E7EB] px-3 py-1.5 rounded-xl font-semibold shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* metrics layout */}
          <div className="flex flex-col gap-4 h-full justify-between lg:border-l lg:border-[#F1F5F9] lg:pl-10">
            <div className="grid grid-cols-2 gap-4 w-full">
              {[
                { label: "Projects", val: stats.totalProjects },
                { label: "Reviews", val: stats.totalReviews },
                { label: "Likes", val: stats.totalLikes },
                { label: "Views", val: stats.profileView }
              ].map((st, idx) => (
                <div key={idx} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-4 hover:border-[#2563EB]/30 transition-all duration-300 group shadow-sm">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">{st.label}</span>
                  <span className="text-2xl font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">{st.val}</span>
                </div>
              ))}
            </div>

            <div className="w-full pt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-sm text-sm transition-colors"
              >
                <span>Follow Developer</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* tab navigation */}
      <div className="border-b border-[#E5E7EB] flex items-center space-x-8 z-10 relative overflow-x-auto no-scrollbar pt-4">
        {[
          { id: "projects", label: "Repositories", icon: Layers },
          { id: "about", label: "About", icon: User },
          { id: "activity", label: "Activity", icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all relative whitespace-nowrap outline-none ${
                isActive
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "projects" && (
                <span className={`text-xs px-2 py-0.5 rounded-md ml-1 font-bold ${isActive ? "bg-[#2563EB]/10 text-[#2563EB]" : "bg-[#F1F5F9] text-[#6B7280]"}`}>
                  {projects.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">

        {/* left column content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* projects tab */}
            {activeTab === "projects" && (
              <motion.div
                key="projects-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-[#111827]">Public Projects</h2>
                </div>

                {projects.length === 0 ? (
                  <div className="bg-[#FFFFFF] border border-[#E5E7EB] border-dashed rounded-[24px] p-12 text-center flex flex-col items-center justify-center shadow-sm">
                    <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mb-4">
                      <Code2 className="w-8 h-8 text-[#6B7280]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111827] mb-2">No projects available</h3>
                    <p className="text-[#6B7280] max-w-md mx-auto text-sm leading-relaxed">
                      {user.name} hasn't published any public projects yet.
                    </p>
                  </div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {projects.map((project) => (
                      <motion.div
                        key={project._id}
                        variants={itemVariants}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onClick={() => router.push(`/projects/${project._id}`)}
                        className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/5 hover:border-[#2563EB]/30 cursor-pointer transition-all duration-300"
                      >
                        {/* simulated browser chrome header */}
                        <div className="h-44 bg-[#F8FAFC] border-b border-[#E5E7EB] relative flex flex-col overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2.5 bg-[#FFFFFF] border-b border-[#E5E7EB] shrink-0 z-10">
                            <div className="flex items-center space-x-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB] group-hover:bg-[#EF4444] transition-colors" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB] group-hover:bg-[#F59E0B] transition-colors" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB] group-hover:bg-[#10B981] transition-colors" />
                            </div>
                            <div className="bg-[#F8FAFC] rounded-md text-[10px] px-4 py-1 border border-[#E5E7EB] w-40 text-center text-[#6B7280] font-mono truncate">
                              {project.title.toLowerCase().replace(/\s+/g, '-')}.io
                            </div>
                            <div className="w-10"></div>
                          </div>
                          
                          <div className="flex-1 relative flex items-center justify-center bg-[#F1F5F9]">
                            {project.thumbnail ? (
                              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            ) : (
                              <Code2 className="w-8 h-8 text-[#6B7280] opacity-40" />
                            )}
                            <div className="absolute inset-0 bg-[#111827]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                              <span className="bg-[#FFFFFF] text-[#111827] px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5">
                                View App <ArrowUpRight className="w-3.5 h-3.5 text-[#2563EB]" />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* card body */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h3 className="font-bold text-lg text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed">
                              {project.description || "No description provided."}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-1.5">
                              {(project.techStack || []).slice(0, 3).map((t, idx) => (
                                <span key={idx} className="text-[10px] font-bold bg-[#F8FAFC] border border-[#E5E7EB] px-2.5 py-1 rounded-lg text-[#6B7280] font-mono">
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-[#F1F5F9] flex justify-between items-center text-xs font-semibold text-[#6B7280]">
                              <div className="flex space-x-4">
                                <motion.span 
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => handleLikeButton(e, project._id)} 
                                  className="flex items-center space-x-1.5 hover:text-[#EF4444] cursor-pointer transition-colors"
                                >
                                  <Heart className={`w-4 h-4 ${project.isLiked ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} /> 
                                  <span className={project.isLiked ? 'text-[#EF4444]' : ''}>{project.likes?.length || 0}</span>
                                </motion.span>
                                <span className="flex items-center space-x-1.5">
                                  <MessageSquare className="w-4 h-4" /> 
                                  <span>{project.reviewsCount || 0}</span>
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                {project.githubUrl && <GitBranch className="w-4 h-4 hover:text-[#111827] transition-colors" />}
                                {project.liveUrl && <ExternalLink className="w-4 h-4 hover:text-[#111827] transition-colors" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* about tab */}
            {activeTab === "about" && (
              <motion.div
                key="about-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-8 space-y-6 shadow-sm"
              >
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#111827]">Biography</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-wrap">
                    {user.bio || "No biography details published by this user yet."}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-[#F1F5F9]">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Core Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.length > 0 ? user.skills.map((skill, idx) => (
                       <span key={idx} className="bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-lg text-xs font-semibold">{skill}</span>
                    )) : (
                      <span className="text-sm text-[#6B7280] italic">No skills listed.</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* activity tab */}
            {activeTab === "activity" && (
              <motion.div
                key="activity-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-8 space-y-6 shadow-sm"
              >
                <h3 className="text-base font-bold text-[#111827]">Recent Activity</h3>
                <div className="space-y-6 pl-2 border-l border-[#F1F5F9] ml-2">
                  {placeholderActivity.map((act, idx) => (
                    <div key={idx} className="relative text-sm pl-6">
                      <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-[#2563EB] border-4 border-[#FFFFFF] shadow-sm" />
                      <div>
                        <p className="text-[#111827] font-medium">{act.text}</p>
                        <p className="text-[#6B7280] text-xs mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* right sidebar elements */}
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Profile Details</h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-center gap-3 text-[#6B7280]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-[#111827]">{rightSidebarData.location}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Globe className="w-4 h-4 shrink-0" />
                <a href={user.portfolioUrl || "#"} className="text-[#2563EB] hover:underline truncate">
                  {user.portfolioUrl ? new URL(user.portfolioUrl).hostname : "No portfolio added"}
                </a>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="text-[#111827]">{rightSidebarData.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Platform Badges</h3>
            <div className="space-y-3">
              {rightSidebarData.achievements.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                    <div className={`p-2.5 rounded-xl shrink-0 border ${item.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#111827] tracking-tight">{item.label}</h4>
                      <p className="text-xs text-[#6B7280] truncate mt-0.5">{item.desc}</p>
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