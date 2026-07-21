"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMyProjects } from "@/services/getMyProjectsApi";
import { useAuth } from "@/context/AuthContext";
import {
  FolderGit2,
  MessageSquare,
  ThumbsUp,
  Star,
  Plus,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
  FileCode,
  AlertCircle,
  Users,
  UserPlus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getMyReviews } from "@/services/reviewApis";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("My Projects");
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const [data, setData] = useState({
    stats: { totalProjects: 0, totalLikes: 0, totalGivenReviews: 0, totalReceivedReviews: 0 },
    projectLikes: [],
    receivedReviews: [],
    givenReviews: []
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetching both APIs in parallel to save time
        const [projectsRes, reviewsRes] = await Promise.all([
          getMyProjects().catch(err => {
            console.error("Error fetching projects:", err);
            return null;
          }),
          getMyReviews().catch(err => {
            console.error("Error fetching reviews:", err);
            return null;
          })
        ]);

        if (projectsRes && projectsRes.projects) {
          setProjects(projectsRes.projects);
        }

        if (reviewsRes && reviewsRes.success) {
          setData({
            stats: reviewsRes.stats || { totalProjects: 0, totalLikes: 0, totalGivenReviews: 0, totalReceivedReviews: 0 },
            projectLikes: reviewsRes.projectLikes || [],
            receivedReviews: reviewsRes.receivedReviews || [],
            givenReviews: reviewsRes.givenReviews || []
          });
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } }
  };

  return (
    <div className="min-h-screen bg-page text-ink font-sans antialiased relative selection:bg-accent/20 selection:text-accent">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none z-0" />

      <div className="relative z-10">
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton-view"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="space-y-6 animate-pulse"
              >
                <div className="bg-surface border border-line rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-surface-2 shrink-0" />
                    <div className="space-y-3 w-full max-w-md">
                      <div className="flex items-center gap-2">
                        <div className="h-6 bg-surface-2 rounded-lg w-48" />
                      </div>
                      <div className="h-4 bg-surface-2 rounded-lg w-full" />
                    </div>
                  </div>
                  <div className="h-10 bg-surface-2 rounded-xl w-full md:w-36 shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-surface border border-line rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-surface-2 rounded w-20" />
                        <div className="w-8 h-8 bg-surface-2 rounded-xl" />
                      </div>
                      <div className="h-8 bg-surface-2 rounded-lg w-16" />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-5">
                    <div className="flex items-center gap-6 border-b border-line pb-3">
                      <div className="h-4 bg-surface-2 rounded w-24" />
                      <div className="h-4 bg-surface-2 rounded w-32" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-surface border border-line rounded-2xl overflow-hidden flex flex-col">
                          <div className="aspect-video bg-surface-2 w-full" />
                          <div className="p-4 space-y-4">
                            <div className="h-4 bg-surface-2 rounded w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard-content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="bg-surface border border-line rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs relative overflow-hidden group"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none"
                  />

                  <div className="flex items-center gap-5 z-10">
                    <div className="relative shrink-0">
                      <div className="absolute -inset-0.5 bg-linear-to-r from-accent to-accent-2 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
                      <img
                        src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=2F6F4E&color=fff`}
                        alt="Avatar"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-surface relative z-10 shadow-sm"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=2F6F4E&color=fff`; }}
                      />
                      <span className="absolute -bottom-1 -right-1 bg-accent text-accent-ink text-[9px] font-extrabold px-1 py-0.2 rounded-md tracking-wider shadow-sm z-20">
                        DEV
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-ink">
                          Welcome back, {user?.name || "Developer"}
                        </h1>
                        <CheckCircle2 className="w-4 h-4 text-ok fill-ok/10" />
                        <span className="text-[10px] bg-page border border-line font-mono text-muted px-1.5 py-0.2 rounded">
                          @{user?.username || "dev_user"}
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-2 max-w-xl font-medium">
                        {user?.bio || "Building modern, scalable applications step by step."}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-ink hover:brightness-125 text-page px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm shrink-0 self-stretch md:self-auto justify-center"
                    onClick={() => router.push('/projects/create')}
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                  </motion.button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {[
                    { title: "Total Projects", value: data.stats?.totalProjects || 0, label: "Deployed", icon: FolderGit2, colorVar: "accent" },
                    { title: "Project Likes", value: data.stats?.totalLikes || 0, label: "Appreciations", icon: ThumbsUp, colorVar: "like" },
                    { title: "Reviews Received", value: data.stats?.totalReceivedReviews || 0, label: "Feedback", icon: MessageSquare, colorVar: "info" },
                    { title: "Reviews Given", value: data.stats?.totalGivenReviews || 0, label: "Community", icon: Star, colorVar: "star" },
                    { title: "Followers", value: user?.followers?.length || 0, label: "Following you", icon: Users, colorVar: "accent-2" },
                    { title: "Following", value: user?.following?.length || 0, label: "You follow", icon: UserPlus, colorVar: "accent" },
                  ].map((card, i) => {
                    const IconComponent = card.icon;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ y: -3 }}
                        className="bg-surface border border-line rounded-2xl p-5 shadow-2xs group relative overflow-hidden transition-all duration-300 hover:border-accent/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{card.title}</span>
                          <div
                            className="p-2 rounded-xl transition-all duration-300 group-hover:scale-105 border"
                            style={{
                              color: `var(--color-${card.colorVar})`,
                              backgroundColor: `color-mix(in srgb, var(--color-${card.colorVar}) 12%, transparent)`,
                              borderColor: `color-mix(in srgb, var(--color-${card.colorVar}) 25%, transparent)`
                            }}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-2xl font-bold tracking-tight text-ink font-sans tabular-nums">
                            {card.value}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted mt-1 font-medium flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3 text-muted" /> {card.label}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
                    <div className="flex items-center gap-6 border-b border-line pb-px">
                      {["My Projects", "Feedback Received"].map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative outline-none ${isActive ? "text-accent" : "text-muted hover:text-ink"
                              }`}
                          >
                            <span>{tab}</span>
                            {isActive && (
                              <motion.div
                                layoutId="premiumLineHighlight"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

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
                            <div className="bg-surface border border-line rounded-2xl p-10 text-center space-y-4 shadow-2xs">
                              <div className="w-14 h-14 bg-page border border-line rounded-2xl flex items-center justify-center mx-auto text-muted">
                                <FileCode className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-bold text-base text-ink">No projects indexed yet</h3>
                                <p className="text-sm text-muted max-w-sm mx-auto">Upload your first project to start tracking likes and receiving reviews from the community.</p>
                              </div>
                              <button
                                onClick={() => router.push('/projects/create')}
                                className="mt-4 bg-ink hover:brightness-125 text-page text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                              >
                                Upload Project
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {projects.map((project, idx) => (
                                <motion.div
                                  key={project._id || idx}
                                  whileHover={{ y: -4 }}
                                  className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-accent/40 flex flex-col justify-between group cursor-pointer transition-all duration-300"
                                >
                                  <div className="relative aspect-video w-full bg-page border-b border-line overflow-hidden">
                                    <img
                                      onClick={() => router.push(`/projects/${project._id}`)}
                                      src={project.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"}
                                      alt={project.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>

                                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1">
                                      <h3
                                        onClick={() => router.push(`/projects/${project._id}`)}
                                        className="font-bold text-sm text-ink group-hover:text-accent transition-colors flex items-center gap-1.5"
                                      >
                                        <span>{project.title}</span>
                                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted" />
                                      </h3>
                                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                                        {project.techStack?.slice(0,3).map((tech, tIdx) => (
                                          <span key={tIdx} className="text-[10px] font-medium bg-surface-2 text-muted px-2 py-0.5 rounded-md">
                                            {tech}
                                          </span>
                                        ))}
                                        {project.techStack?.length > 3 && (
                                          <span className="text-[10px] font-medium bg-surface-2 text-muted px-2 py-0.5 rounded-md">+{project.techStack.length - 3}</span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-line text-[11px] font-semibold text-muted">
                                      <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 hover:text-like transition-colors">
                                          <ThumbsUp className="w-3.5 h-3.5 text-like/80" /> {project.likes?.length || 0}
                                        </span>
                                        <span className="flex items-center gap-1.5 hover:text-accent transition-colors">
                                          <MessageSquare className="w-3.5 h-3.5 text-accent/80" /> {project.reviews?.length || 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="feedback-view"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="space-y-4"
                        >
                          {data.receivedReviews && data.receivedReviews.length > 0 ? (
                            data.receivedReviews.map((feedback, fIdx) => (
                              <div key={feedback._id || fIdx} className="bg-surface border border-line rounded-2xl p-5 shadow-2xs space-y-3 transition-all hover:border-accent/20 hover:shadow-sm">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-accent/10 to-accent-2/10 border border-line flex items-center justify-center text-sm font-bold text-accent">
                                      {feedback.user?.name ? feedback.user.name.substring(0, 2).toUpperCase() : "US"}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-sm text-ink">{feedback.user?.name || "Community Member"}</h4>
                                      <p className="text-[11px] text-muted font-medium mt-0.5">
                                        Reviewed <span className="text-accent hover:underline cursor-pointer">{feedback.project?.title || "Project"}</span>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-1 pt-1">
                                  {[...Array(5)].map((_, sIdx) => (
                                    <Star key={sIdx} className={`w-3.5 h-3.5 ${sIdx < feedback.rating ? "text-star fill-star" : "text-line"}`} />
                                  ))}
                                </div>
                                <p className="text-sm text-muted leading-relaxed font-normal bg-page p-3 rounded-xl border border-line">
                                  "{feedback.review}"
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="bg-surface border border-line rounded-2xl p-10 text-center space-y-3 shadow-2xs">
                              <AlertCircle className="w-10 h-10 text-muted mx-auto mb-2" />
                              <h3 className="font-bold text-ink">No feedback received</h3>
                              <p className="text-sm text-muted">Share your projects to get reviews and ratings from other developers.</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="hidden lg:block lg:col-span-1 space-y-5">
                    <div className="bg-linear-to-b from-surface to-page border border-line rounded-2xl p-6 text-center space-y-4 shadow-sm">
                       <div className="w-12 h-12 bg-star/10 text-star rounded-full flex items-center justify-center mx-auto mb-2 border border-star/20">
                          <Star className="w-6 h-6 fill-star" />
                       </div>
                       <h3 className="font-bold text-sm text-ink">Community Rank</h3>
                       <p className="text-xs text-muted leading-relaxed">Give reviews and share projects to increase your visibility on the developer leaderboard.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
