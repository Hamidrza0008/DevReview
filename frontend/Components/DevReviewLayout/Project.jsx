"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, GitBranch, ExternalLink, Heart, MessageSquare,
  Bookmark, Code2, Star, CheckCircle2, Edit3, Edit2, Trash2,
  Calendar, Layers, Sparkles, AlertCircle, Loader2, Globe, Flame, ArrowUpRight
} from "lucide-react";
import { getProjectById } from "@/services/getProjectByIdApi";
import { deleteProject } from "@/services/editProjectApi";
import { toggleLikes } from "@/services/toggleLikesApi";
import { toggleSaveProject } from "@/services/savedProjectsApi";
import { addReviews, deleteReview, editReview, getReviews } from "@/services/reviewApis";

function ProjectSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="w-full py-6 animate-pulse"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-5 w-32 bg-line rounded-lg" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="aspect-video bg-surface border-2 border-surface-2 rounded-[28px] shadow-sm shimmer" />
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-surface border-2 border-surface-2 rounded-[28px] p-6 shadow-sm space-y-6">
              <div className="space-y-3">
                <div className="h-6 w-24 bg-surface-2 rounded-md shimmer" />
                <div className="h-10 w-3/4 bg-surface-2 rounded-xl shimmer" />
              </div>
              <div className="h-16 w-full bg-surface-2 rounded-xl shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-surface-2 rounded shimmer" />
                <div className="h-4 w-5/6 bg-surface-2 rounded shimmer" />
                <div className="h-4 w-4/6 bg-surface-2 rounded shimmer" />
              </div>
              <div className="pt-4 border-t border-surface-2 grid grid-cols-2 gap-3">
                <div className="h-12 bg-surface-2 rounded-xl shimmer" />
                <div className="h-12 bg-surface-2 rounded-xl shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
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
      `}</style>
    </motion.div>
  );
}

export default function SingleProject() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const currentLoggedInUserId = user?._id;
  const ownerId = project?.owner?._id?.toString();
  const showManagementActions = ownerId && currentLoggedInUserId && ownerId === currentLoggedInUserId;

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3500);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchInitialData = async () => {
      if (!id) return;
      
      const startTime = Date.now(); 
      
      try {
        setLoading(true);
        const [projectRes, reviewsRes] = await Promise.all([
          getProjectById(id),
          getReviews(id)
        ]);
        
        if (isMounted) {
          if (projectRes?.project) {
            setProject(projectRes.project);
            setLiked(projectRes.isLiked);
            setLikesCount(projectRes.likesCount || 0);
          } else {
            setError("Blueprint not found.");
          }
          if (reviewsRes?.reviews) {
            setReviews(reviewsRes.reviews);
          }
        }
      } catch (err) {
        if (isMounted) setError("Failed to fetch project details.");
      } finally {
        if (isMounted) {
          const elapsedTime = Date.now() - startTime;
          const minLoadingTime = 1200;
          const delay = Math.max(0, minLoadingTime - elapsedTime);
          
          setTimeout(() => {
            if (isMounted) setLoading(false);
          }, delay);
        }
      }
    };

    fetchInitialData();
    return () => { isMounted = false; };
  }, [id]);

  const refreshReviews = async () => {
    try {
      const res = await getReviews(id);
      if (res?.reviews) setReviews(res.reviews);
    } catch (err) {
      console.error("Failed to refresh reviews", err);
    }
  };

  const handleLikeButton = async () => {
    const previousLiked = liked;
    const previousCount = likesCount;
    
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await toggleLikes(id);
      if (!res.success) throw new Error("Toggle failed");
    } catch (err) {
      setLiked(previousLiked);
      setLikesCount(previousCount);
      showToast("error", "Action failed. Please try again.");
    }
  };

  const handleSaveButton = async () => {
    const previousBookmarked = bookmarked;
    setBookmarked(!bookmarked);

    try {
      const res = await toggleSaveProject(id);
      if (!res?.success) throw new Error("Toggle failed");
    } catch (err) {
      setBookmarked(previousBookmarked);
      showToast("error", "Action failed. Please try again.");
    }
  };

  const executeDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteProject(id);

      if (response?.success) {
        showToast("success", "Project deleted successfully.");
        setTimeout(() => router.push("/projects/my"), 1000);
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
      showToast("error", "Failed to delete project workspace.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!reviewComment.trim() || reviewRating === 0) {
      showToast("warning", "Please provide both a rating and a comment.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      if (editingReview) {
        const res = await editReview(project._id, reviewRating, reviewComment);
        if (res && res.success === false) {
          setReviewError(res.message || "Failed to update review.");
          return;
        }
        showToast("success", "Review updated successfully.");
      } else {
        const res = await addReviews(id, reviewRating, reviewComment);
        if (res && res.success === false) {
          setReviewError(res.message || "You have already submitted a review for this project.");
          return;
        }
        showToast("success", "Review published.");
      }
      
      setReviewComment("");
      setReviewRating(0);
      setEditingReview(null);
      await refreshReviews();
    } catch (err) {
      setReviewError("An unexpected error occurred while processing your review.");
      showToast("error", "Failed to process review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditReviewSetup = (review) => {
    setReviewError("");
    setReviewComment(review.review);
    setReviewRating(review.rating);
    setEditingReview(review);
    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      showToast("success", "Review removed.");
      await refreshReviews();
    } catch (err) {
      showToast("error", "Failed to delete review.");
    }
  };

  const isThumbnailValid = project?.thumbnail && project.thumbnail.trim() !== "";
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="relative bg-page min-h-screen w-full overflow-x-hidden [scrollbar-gutter:stable] text-ink font-sans antialiased selection:bg-accent/20 selection:text-accent">

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

      {/* Vibrant "Hara Bahra" Background Orbs — matches Explore page energy */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-linear-to-bl from-accent/25 via-accent-2/15 to-accent-2/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[400px] left-[-200px] w-[500px] h-[500px] bg-linear-to-tr from-accent-2/20 to-info/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div
        className="fixed inset-0 opacity-[0.35] pointer-events-none z-0"
        style={{ backgroundImage: `radial-gradient(var(--color-muted) 1px, transparent 1px)`, backgroundSize: "28px 28px" }}
      />

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-2 text-sm font-bold backdrop-blur-md ${
              toast.type === "success" ? "bg-accent-soft/95 border-accent/30 text-accent" :
              toast.type === "warning" ? "bg-star/10 border-star/30 text-star" :
              "bg-danger/10 border-danger/30 text-danger"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-accent" />}
            {toast.type === "warning" && <AlertCircle className="w-5 h-5 text-star" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-danger" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full pb-24">
        <AnimatePresence mode="wait">
          {loading ? (
            <ProjectSkeleton key="skeleton" />
          ) : error || !project ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="flex items-center justify-center p-6 h-[80vh]"
            >
              <div className="bg-surface border-2 border-danger/20 rounded-[28px] p-8 max-w-md w-full text-center shadow-xl shadow-danger/5">
                <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-5 border border-danger/20">
                  <AlertCircle className="w-8 h-8 text-danger" />
                </div>
                <h2 className="text-xl font-extrabold text-ink mb-2 tracking-tight">Workspace Unavailable</h2>
                <p className="text-sm text-muted mb-6 font-medium">{error || "This project may have been deleted or set to private."}</p>
                <button 
                  onClick={() => router.push('/explore')}
                  className="bg-ink text-page px-6 py-3 rounded-xl font-bold hover:brightness-125 transition-colors w-full shadow-md cursor-pointer"
                >
                  Return to Explore
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8"
            >
              <div className="flex items-center justify-between gap-4 border-b-2 border-surface-2 pb-4">
                <motion.button
                  whileHover={{ x: -4 }}
                  onClick={() => router.push("/projects/explore")}
                  className="inline-flex items-center space-x-2 text-xs font-extrabold text-muted hover:text-accent transition-colors focus:outline-none cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Explore</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* left column: canvas */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-surface border-2 border-surface-2 hover:border-accent/30 rounded-[28px] overflow-hidden shadow-xl shadow-accent/5 relative aspect-video group flex flex-col justify-between transition-colors duration-300"
                  >
                    
                    <div className="flex items-center justify-between px-5 py-3 bg-surface/90 backdrop-blur-md border-b border-surface-2 shrink-0 z-10">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-like shadow-sm" />
                        <span className="w-3 h-3 rounded-full bg-star shadow-sm" />
                        <span className="w-3 h-3 rounded-full bg-accent-2 shadow-sm" />
                      </div>
                      <div className="bg-page rounded-lg text-xs px-6 py-1.5 border border-line text-muted font-mono font-bold tracking-tight flex items-center gap-2">
                        <Globe className="w-3 h-3 text-accent" />
                        {project.liveUrl ? new URL(project.liveUrl).hostname : "localhost:3000"}
                      </div>
                      <div className="w-8" />
                    </div>

                    <div className="flex-1 relative overflow-hidden bg-linear-to-br from-accent-soft/50 to-surface-2 flex items-center justify-center">
                      {isThumbnailValid ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-accent-2">
                          <div className="w-16 h-16 rounded-2xl bg-surface border border-accent/20 flex items-center justify-center shadow-sm mb-4">
                            <Code2 className="w-8 h-8 opacity-60" />
                          </div>
                          <span className="text-xs font-mono font-extrabold uppercase tracking-widest bg-surface text-accent border border-accent/20 px-4 py-1.5 rounded-lg shadow-sm">
                            Source Code Only
                          </span>
                        </div>
                      )}

                      {likesCount > 5 && (
                        <div className="absolute top-4 left-4">
                          <span className="text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wide text-ink bg-star inline-flex items-center gap-1.5">
                            <Flame className="w-3 h-3 fill-ink" /> Trending
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center pointer-events-none">
                        {project.liveUrl && (
                          <span className="bg-surface text-accent px-5 py-3 rounded-xl text-xs font-extrabold tracking-wide flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto">
                            Open Live Preview <ArrowUpRight className="w-4 h-4 text-accent stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* right column: primary info */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                  <div className="bg-surface border-2 border-surface-2 rounded-[28px] p-6 shadow-xl shadow-accent/5 space-y-5">
                    
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-linear-to-r from-accent/10 to-accent-2/10 border border-accent/30 text-accent font-extrabold text-xs uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Project Blueprint</span>
                      </div>
                      <h1 className="text-2xl font-extrabold tracking-tight text-ink leading-tight">
                        {project.title}
                      </h1>
                    </div>

                    <div 
                      onClick={() => router.push(`/users/${project.owner?.username}`)}
                      className="flex items-center space-x-3 p-3.5 bg-page border border-line rounded-2xl cursor-pointer hover:border-accent/40 hover:bg-accent-soft/40 transition-colors group"
                    >
                      <img
                        src={project.owner?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.owner?.name || 'U')}&background=E5E7EB&color=111827`}
                        alt={project.owner?.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-surface shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-ink truncate group-hover:text-accent transition-colors">
                          {project.owner?.name || 'Developer'}
                        </h4>
                        <p className="text-xs text-muted font-medium font-mono truncate">
                          @{project.owner?.username || 'anonymous'}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted leading-relaxed line-clamp-4 font-medium">
                      {project.description || "No description provided for this repository."}
                    </p>

                    <div className="flex items-center space-x-3 pt-2 text-sm font-bold text-muted">
                      <span className="flex items-center space-x-1.5 bg-like/10 px-3 py-1.5 rounded-lg border border-like/20">
                        <Heart className="w-4 h-4 text-like fill-like" />
                        <span className="text-ink">{likesCount} Likes</span>
                      </span>
                      <span className="flex items-center space-x-1.5 bg-info/10 px-3 py-1.5 rounded-lg border border-info/20">
                        <MessageSquare className="w-4 h-4 text-info" />
                        <span className="text-ink">{reviews.length} Reviews</span>
                      </span>
                    </div>

                    <div className="space-y-3 pt-5 border-t-2 border-page">
                      <div className="grid grid-cols-2 gap-3">
                        <motion.a
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          href={project.liveUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center space-x-2 font-extrabold text-sm py-3 px-4 rounded-xl transition-all ${project.liveUrl ? 'bg-linear-to-r from-accent to-accent-2 hover:brightness-110 text-accent-ink shadow-md shadow-accent/25' : 'bg-surface-2 text-muted pointer-events-none'}`}
                        >
                          <span>View Live</span>
                          <ExternalLink className="w-4 h-4" />
                        </motion.a>

                        <motion.a
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          href={project.githubUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center space-x-2 font-extrabold text-sm py-3 px-4 rounded-xl transition-all ${project.githubUrl ? 'bg-ink hover:brightness-125 text-page shadow-md' : 'bg-surface-2 text-muted pointer-events-none'}`}
                        >
                          <GitBranch className="w-4 h-4" />
                          <span>Source</span>
                        </motion.a>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={handleLikeButton}
                          className={`flex items-center justify-center space-x-2 text-sm font-extrabold py-3 px-4 rounded-xl border-2 transition-all outline-none cursor-pointer ${
                            liked
                              ? 'bg-like/10 text-like border-like/30 shadow-sm shadow-like/10'
                              : 'bg-surface text-ink border-line hover:bg-like/5 hover:border-like/30'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${liked ? 'fill-like text-like' : ''}`} />
                          <span>{liked ? 'Liked' : 'Like'}</span>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={handleSaveButton}
                          className={`flex items-center justify-center space-x-2 text-sm font-extrabold py-3 px-4 rounded-xl border-2 transition-all outline-none cursor-pointer ${
                            bookmarked
                              ? 'bg-accent-soft text-accent border-accent/30 shadow-sm shadow-accent/10'
                              : 'bg-surface text-ink border-line hover:bg-accent-soft/50 hover:border-accent/30'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-accent text-accent' : ''}`} />
                          <span>{bookmarked ? 'Saved' : 'Save'}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* left column: long-form details */}
                <div className="lg:col-span-8 space-y-6">
                  
                  <div className="bg-surface border-2 border-surface-2 rounded-[28px] p-6 shadow-sm hover:border-accent/30 transition-colors space-y-4">
                    <h3 className="text-sm font-extrabold text-ink flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-accent-soft text-accent"><Layers className="w-4 h-4" /></span>
                      Technology Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.length > 0 ? project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs font-bold font-mono bg-page text-ink border border-surface-2 px-3 py-1.5 rounded-lg select-none hover:border-accent/30 hover:bg-accent-soft hover:text-accent transition-colors capitalize"
                        >
                          {tech}
                        </span>
                      )) : (
                        <span className="text-sm text-muted italic">No technologies listed.</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-surface border-2 border-surface-2 rounded-[28px] p-6 shadow-sm hover:border-accent/30 transition-colors space-y-4">
                    <h3 className="text-sm font-extrabold text-ink flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-info/10 text-info"><Code2 className="w-4 h-4" /></span>
                      Implementation Details
                    </h3>
                    <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap font-medium">
                      {project.description || "No supplemental details available for this blueprint."}
                    </p>
                  </div>
                </div>

                {/* right column: metadata sidebar (with management controls inside) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-surface border-2 border-surface-2 rounded-[28px] p-6 shadow-sm space-y-5">
                    <h3 className="text-sm font-extrabold text-ink">Repository Metadata</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 bg-page border border-surface-2 rounded-xl p-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block">Likes</span>
                        <p className="text-lg font-extrabold text-ink">{likesCount}</p>
                      </div>
                      <div className="space-y-1 bg-page border border-surface-2 rounded-xl p-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block">Reviews</span>
                        <p className="text-lg font-extrabold text-ink">{reviews.length}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t-2 border-page space-y-3 text-sm font-semibold text-muted">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> Deployed</span>
                        <span className="text-ink">
                          {project.createdAt ? new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Integrated Management Actions Layer */}
                    {showManagementActions && (
                      <div className="pt-4 border-t-2 border-page space-y-3">
                        <div className="flex flex-col gap-2 w-full">
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.push(`/projects/${id}/edit`)}
                            className="w-full inline-flex items-center justify-center space-x-2 bg-surface border-2 border-line text-ink font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm hover:border-accent/40 hover:bg-accent-soft/40 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4 text-accent" />
                            <span>Edit Workspace</span>
                          </motion.button>

                          <div className="relative w-full">
                            <AnimatePresence>
                              {showDeleteConfirm && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute left-0 bottom-full mb-2 w-full bg-surface border-2 border-danger/30 rounded-xl p-4 shadow-xl z-50"
                                >
                                  <p className="text-xs font-bold text-ink mb-3">Permanently delete this project?</p>
                                  <div className="flex gap-2">
                                    <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-surface-2 text-muted text-xs font-bold py-2 rounded-lg hover:bg-line transition-colors cursor-pointer">Cancel</button>
                                    <button type="button" onClick={executeDelete} disabled={isDeleting} className="flex-1 bg-danger text-accent-ink text-xs font-bold py-2 rounded-lg hover:brightness-110 transition-colors flex items-center justify-center cursor-pointer">
                                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm"}
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setShowDeleteConfirm(true)}
                              className="w-full inline-flex items-center justify-center space-x-2 bg-danger/10 border-2 border-danger/20 text-danger font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm hover:bg-danger/20 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Project</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* peer feedback / reviews block */}
              <div className="bg-surface border-2 border-surface-2 rounded-[28px] p-6 md:p-8 shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b-2 border-surface-2 pb-4 flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-ink flex items-center gap-2 tracking-tight">
                      <MessageSquare className="w-5 h-5 text-info" />
                      Peer Reviews
                    </h3>
                    <p className="text-sm text-muted mt-1 font-medium">Constructive feedback from the developer community.</p>
                  </div>
                  <div className="bg-star/10 border border-star/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <Star className="w-5 h-5 text-star fill-star" />
                    <span className="font-extrabold text-ink">{avgRating}</span>
                    <span className="text-xs text-muted font-semibold">/ 5.0</span>
                  </div>
                </div>

                {user && !showManagementActions && (
                  <form id="review-form" onSubmit={handleReviewSubmit} className="bg-linear-to-br from-page to-accent-soft/30 border-2 border-line rounded-2xl p-6 space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-muted block">
                        Overall Rating
                      </label>
                      <div className="flex items-center space-x-1 cursor-pointer">
                        {[1, 2, 3, 4, 5].map((starValue) => {
                          const isFilled = hoveredRating ? starValue <= hoveredRating : starValue <= reviewRating;
                          return (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() => setReviewRating(starValue)}
                              onMouseEnter={() => setHoveredRating(starValue)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                            >
                              <Star className={`w-6 h-6 transition-colors ${isFilled ? "fill-star text-star stroke-star" : "text-line stroke-muted"}`} />
                            </button>
                          );
                        })}
                        {reviewRating > 0 && <span className="text-sm font-extrabold text-ink pl-3">{reviewRating} out of 5</span>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="comment" className="text-xs font-extrabold uppercase tracking-wider text-muted block">
                        Written Feedback
                      </label>
                      <textarea
                        id="comment"
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts on the code quality, UX, and architecture..."
                        className="w-full bg-surface border-2 border-line rounded-xl text-sm p-4 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent-2 placeholder-muted transition-all resize-none shadow-sm"
                      />
                    </div>

                    {/* Integrated Framer Motion Error Component inside Form */}
                    <AnimatePresence mode="wait">
                      {reviewError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -8 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -8 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start space-x-3 bg-danger/10 border border-danger/30 p-3.5 rounded-xl text-danger">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-danger" />
                            <div className="flex-1 text-sm font-semibold tracking-wide leading-relaxed">
                              {reviewError}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-end pt-2">
                      {editingReview && (
                        <button 
                          type="button" 
                          onClick={() => { setEditingReview(null); setReviewComment(""); setReviewRating(0); setReviewError(""); }}
                          className="mr-3 text-sm font-bold text-muted hover:text-ink transition-colors px-4 py-2 cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmittingReview}
                        className="flex items-center space-x-2 text-accent-ink font-extrabold text-sm py-2.5 px-6 rounded-xl shadow-md shadow-accent/25 transition-all disabled:opacity-70 cursor-pointer bg-linear-to-r from-accent to-accent-2 hover:brightness-110"
                      >
                        {isSubmittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{editingReview ? "Update Review" : "Publish Review"}</span>
                      </motion.button>
                    </div>
                  </form>
                )}

                <div className="space-y-5">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-surface border-2 border-surface-2 hover:border-accent/30 rounded-2xl shadow-sm relative group transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'U')}&background=F1F5F9&color=111827`}
                            alt="Reviewer"
                            className="w-10 h-10 rounded-full object-cover border-2 border-line shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h5 className="text-sm font-extrabold text-ink inline-block mr-2">
                                  {review.user?.name || "Anonymous Developer"}
                                </h5>
                                <span className="text-xs text-muted font-mono font-semibold">
                                  @{review.user?.username || "user"}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-star/10 border border-star/30 rounded-lg px-2 py-1">
                                  {[...Array(5)].map((_, index) => (
                                    <Star key={index} className={`w-3.5 h-3.5 ${index < review.rating ? 'fill-star text-star' : 'text-line stroke-line'}`} />
                                  ))}
                                </div>
                                <span className="text-xs font-semibold text-muted">
                                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Just now"}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted leading-relaxed font-medium">
                              {review.review}
                              {review.isEdited && <span className="ml-2 text-xs italic text-accent font-semibold">(Edited)</span>}
                            </p>

                            {review.user?._id?.toString() === currentLoggedInUserId && (
                              <div className="pt-3 flex items-center gap-2">
                                <button
                                  onClick={() => handleEditReviewSetup(review)}
                                  className="text-xs font-bold text-muted hover:text-accent transition-colors flex items-center gap-1 bg-surface-2 hover:bg-accent-soft px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => handleReviewDelete(review._id)}
                                  className="text-xs font-bold text-muted hover:text-danger transition-colors flex items-center gap-1 bg-surface-2 hover:bg-danger/10 px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-line rounded-[28px] bg-linear-to-br from-page to-accent-soft/20">
                      <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4 border border-line shadow-sm">
                        <MessageSquare className="w-6 h-6 text-accent-2" />
                      </div>
                      <p className="text-sm font-extrabold text-ink">No reviews yet</p>
                      <p className="text-xs text-muted mt-1 font-medium">Be the first to share your thoughts on this project.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
