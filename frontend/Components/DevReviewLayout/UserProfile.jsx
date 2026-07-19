"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageSquare, ExternalLink, GitBranch,
  Globe, Mail, CheckCircle2,
  Calendar, Layers, User, Activity,
  AlertCircle, Code2, ArrowUpRight, ArrowLeft
} from "lucide-react";
import { getUserProfile } from "@/services/usersApi";
import { getProjectByUsername } from "@/services/getProjectsByUsernameApi";
import { toggleLikes } from "@/services/toggleLikesApi";
import { useAuth } from "@/context/AuthContext";

export default function UserProfile() {
  const router = useRouter();
  const { username } = useParams();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");

  const [stats, setStats] = useState({
    totalLikes: 0,
    totalProjects: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [userRes, projectsRes] = await Promise.all([
          getUserProfile(username),
          getProjectByUsername(username)
        ]);

        if (!abortController.signal.aborted) {
          if (!userRes?.user) {
            setError("User not found.");
            return;
          }

          setUser(userRes.user);
          setStats({
            totalLikes: userRes.totalLikes || 0,
            totalProjects: userRes.totalProjects || 0,
            totalReviews: userRes.totalReviews || 0,
          });

          setProjects(projectsRes?.projects || []);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError("Failed to load profile data.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (username) {
      fetchProfileData();
    }

    return () => {
      abortController.abort();
    };
  }, [username]);

  const handleLikeButton = async (e, projectId) => {
    e.stopPropagation();

    const previousProjects = [...projects];

    setProjects(current =>
      current.map(p => {
        if (p._id === projectId) {
          const hasLiked = p.isLiked || (p.likes && p.likes.includes(authUser?._id));
          return {
            ...p,
            isLiked: !hasLiked,
            likes: hasLiked 
              ? (p.likes || []).filter(id => id !== authUser?._id && id !== "temp-like")
              : [...(p.likes || []), authUser?._id || "temp-like"]
          };
        }
        return p;
      })
    );

    try {
      await toggleLikes(projectId);
      const freshProjects = await getProjectByUsername(username);
      setProjects(freshProjects.projects);
    } catch (err) {
      setProjects(previousProjects);
    }
  };

  const joinedDate = user?.createdAt
    ? `Joined ${new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}`
    : "New member";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 25 } }
  };

  if (loading || error) {
    return (
      <div className="p-4 md:p-8 bg-page min-h-screen max-w-7xl mx-auto space-y-8">
        <style jsx global>{`
          .shimmer {
            background: linear-gradient(90deg, var(--color-surface-2) 25%, var(--color-line) 37%, var(--color-surface-2) 63%);
            background-size: 400% 100%;
            animation: shimmer 1.4s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        <button
          onClick={() => router.back()}
          className="relative z-10 flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-danger/10 border border-danger/40 rounded-3xl p-8 text-center max-w-2xl mx-auto mt-20 shadow-sm"
          >
            <AlertCircle className="w-10 h-10 text-danger mx-auto mb-4" />
            <h3 className="text-lg font-bold text-danger mb-2">{error}</h3>
            <p className="text-sm text-danger/90 mb-6">The profile you are looking for might have been removed or is temporarily unavailable.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/')}
              className="bg-danger text-accent-ink px-6 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-colors cursor-pointer"
            >
              Return Home
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="bg-surface border border-line rounded-[32px] p-8 h-64 shadow-sm flex items-center gap-8">
              <div className="w-28 h-28 rounded-full shimmer" />
              <div className="space-y-4 flex-1">
                <div className="h-8 shimmer rounded-lg w-1/4" />
                <div className="h-4 shimmer rounded w-1/3" />
                <div className="h-4 shimmer rounded w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-12 shimmer rounded-2xl w-full max-w-sm" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[380px] shimmer rounded-[24px]" />
                  ))}
                </div>
              </div>
              <div className="h-[600px] shimmer rounded-[24px]" />
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
      className="p-4 md:p-8 bg-page min-h-screen text-ink max-w-7xl mx-auto space-y-8 antialiased relative selection:bg-accent/20 selection:text-accent pb-24"
    >
      <style jsx global>{`
        @keyframes float-ping {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .verified-ping {
          animation: float-ping 2.4s cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes bar-fill {
          from { width: 0%; }
        }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[24px_24px] opacity-40" />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-linear-to-tr from-accent/10 to-accent-2/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-linear-to-bl from-accent/10 to-transparent rounded-full blur-[120px]"
        />
      </div>

      <motion.button
        whileHover={{ x: -3 }}
        onClick={() => router.back()}
        className="relative z-10 flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      <div className="bg-surface border border-line hover:border-accent/20 rounded-[32px] p-8 md:p-10 shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 relative overflow-hidden z-10">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-accent/5 to-accent-2/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10">
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">

            <div className="relative group shrink-0">
              <div className="absolute -inset-2 bg-linear-to-r from-accent to-accent-2 rounded-full blur-md opacity-20 group-hover:opacity-50 transition duration-500" />
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-surface relative z-10 shadow-md bg-surface-2 group-hover:shadow-lg group-hover:shadow-accent/20 transition-shadow duration-500">
                <img
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=F1F5F9&color=111827`}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              {(user.isVerified !== false) && (
                <span className="absolute bottom-1 right-1 z-20 inline-flex">
                  <span className="verified-ping absolute inset-0 rounded-full bg-accent/50" />
                  <span className="relative bg-surface rounded-full p-[2px] shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </span>
                </span>
              )}
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink flex items-center gap-2">
                    {user.name}
                  </h1>
                  <span className="text-xs bg-surface-2 border border-line text-muted font-mono px-2.5 py-1 rounded-lg">
                    @{user.username}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted mt-3 font-medium">
                  {user.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>}
                  {user.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <GitBranch className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {user.portfolioUrl && (
                    <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm md:text-base text-muted font-normal leading-relaxed max-w-xl">
                {user.bio || "This user hasn't added a bio yet."}
              </p>

              <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                {user.skills?.map((skill, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="text-xs bg-surface text-ink border border-line hover:border-accent/40 hover:bg-accent-soft hover:text-accent px-3 py-1.5 rounded-xl font-semibold shadow-sm transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 h-full justify-between lg:border-l lg:border-surface-2 lg:pl-10">
            <div className="grid grid-cols-3 gap-4 w-full">
              {[
                { label: "Projects", val: stats.totalProjects },
                { label: "Reviews", val: stats.totalReviews },
                { label: "Likes", val: stats.totalLikes }
              ].map((st, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="bg-page border border-line rounded-2xl p-4 hover:border-accent/40 hover:bg-accent-soft/50 hover:shadow-md hover:shadow-accent/10 transition-all duration-300 group shadow-sm cursor-default"
                >
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">{st.label}</span>
                  <span className="text-2xl font-bold text-ink group-hover:text-accent transition-colors">{st.val}</span>
                </motion.div>
              ))}
            </div>

            <div className="w-full pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-linear-to-r from-accent to-accent-2 hover:from-accent hover:to-accent text-accent-ink py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-md shadow-accent/25 text-sm transition-all cursor-pointer"
              >
                <span>Follow Developer</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-line flex items-center space-x-8 z-10 relative overflow-x-auto no-scrollbar pt-4">
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
              className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative whitespace-nowrap outline-none cursor-pointer ${isActive
                  ? "text-accent"
                  : "text-muted hover:text-ink"
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "projects" && (
                <span className={`text-xs px-2 py-0.5 rounded-md ml-1 font-bold ${isActive ? "bg-accent/10 text-accent" : "bg-surface-2 text-muted"}`}>
                  {projects.length}
                </span>
              )}
              {isActive && (
                <motion.span
                  layoutId="userProfileTabUnderline"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-linear-to-r from-accent to-accent-2 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">

        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">

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
                  <h2 className="text-lg font-bold text-ink">Public Projects</h2>
                </div>

                {projects.length === 0 ? (
                  <div className="bg-surface border border-line border-dashed rounded-[24px] p-12 text-center flex flex-col items-center justify-center shadow-sm">
                    <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mb-4">
                      <Code2 className="w-8 h-8 text-accent/60" />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-2">No projects available</h3>
                    <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
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
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        onClick={() => router.push(`/projects/${project._id}`)}
                        className="bg-surface border border-line rounded-[24px] flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/40 cursor-pointer transition-all duration-300"
                      >
                        <div className="h-44 bg-page border-b border-line relative flex flex-col overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-line shrink-0 z-10">
                            <div className="flex items-center space-x-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-line group-hover:bg-danger transition-colors" />
                              <span className="w-2.5 h-2.5 rounded-full bg-line group-hover:bg-star transition-colors" />
                              <span className="w-2.5 h-2.5 rounded-full bg-line group-hover:bg-accent transition-colors" />
                            </div>
                            <div className="bg-page rounded-md text-[10px] px-4 py-1 border border-line w-40 text-center text-muted font-mono truncate">
                              {project.title.toLowerCase().replace(/\s+/g, '-')}.io
                            </div>
                            <div className="w-10"></div>
                          </div>

                          <div className="flex-1 relative flex items-center justify-center bg-surface-2">
                            {project.thumbnail ? (
                              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            ) : (
                              <Code2 className="w-8 h-8 text-muted opacity-40" />
                            )}
                            <div className="absolute inset-0 bg-accent/30 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300">
                              <span className="bg-surface text-ink px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                View App <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h3 className="font-bold text-lg text-ink group-hover:text-accent transition-colors line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                              {project.description || "No description provided."}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-1.5">
                              {(project.techStack || []).slice(0, 3).map((t, idx) => (
                                <span key={idx} className="text-[10px] font-bold bg-page border border-line group-hover:border-accent/20 group-hover:bg-accent-soft group-hover:text-accent px-2.5 py-1 rounded-lg text-muted font-mono transition-colors">
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-surface-2 flex justify-between items-center text-xs font-semibold text-muted">
                              <div className="flex space-x-4">
                                <motion.span
                                  whileTap={{ scale: 0.85 }}
                                  onClick={(e) => handleLikeButton(e, project._id)}
                                  className={`flex items-center space-x-1.5 cursor-pointer transition-colors ${project.isLiked || (project.likes && project.likes.includes(authUser?._id)) ? "text-danger" : "text-muted hover:text-danger"
                                    }`}
                                >
                                  <Heart
                                    className={`w-4 h-4 ${project.isLiked || (project.likes && project.likes.includes(authUser?._id)) ? "fill-current" : ""
                                      }`}
                                  />

                                  {(project.likes?.length > 0 || project.isLiked) && (
                                    <span>{project.likes?.length || 0}</span>
                                  )}
                                </motion.span>
                                <span className="flex items-center space-x-1.5">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{project.reviewsCount || 0}</span>
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                {project.githubUrl && <GitBranch className="w-4 h-4 hover:text-accent transition-colors" />}
                                {project.liveUrl && <ExternalLink className="w-4 h-4 hover:text-accent transition-colors" />}
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

            {activeTab === "about" && (
              <motion.div
                key="about-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-surface border border-line rounded-[24px] p-8 space-y-6 shadow-sm"
              >
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-ink">Biography</h3>
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
                    {user.bio || "No biography details published by this user yet."}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-2">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Core Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.length > 0 ? user.skills.map((skill, idx) => (
                      <motion.span
                        key={idx}
                        whileHover={{ y: -2, scale: 1.05 }}
                        className="bg-page border border-line hover:border-accent/40 hover:bg-accent-soft hover:text-accent text-ink px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-default"
                      >
                        {skill}
                      </motion.span>
                    )) : (
                      <span className="text-sm text-muted italic">No skills listed.</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                key="activity-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-surface border border-line rounded-3xl p-8 space-y-3 shadow-sm text-center"
              >
                <div className="w-12 h-12 bg-page border border-line rounded-2xl flex items-center justify-center mx-auto text-muted">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-ink">No activity yet</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  Activity like new project uploads and reviews will show up here as {user.name} uses the platform.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-surface border border-line hover:border-accent/20 rounded-3xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Profile Details</h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-center gap-3 text-muted">
                <Globe className="w-4 h-4 shrink-0 text-accent" />
                <a href={user.portfolioUrl || "#"} className="text-accent hover:underline truncate">
                  {user.portfolioUrl ? new URL(user.portfolioUrl).hostname : "No portfolio added"}
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <Calendar className="w-4 h-4 shrink-0 text-accent" />
                <span className="text-ink">{joinedDate}</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
