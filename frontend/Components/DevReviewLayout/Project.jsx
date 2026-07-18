"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, GitBranch, ExternalLink, Heart, MessageSquare,
  Bookmark, Code2, Eye, Star, CheckCircle2, Edit3, Edit2, Trash2,
  Calendar, Layers, Sparkles, AlertCircle, Loader2, Globe, Flame, ArrowUpRight
} from "lucide-react";
import { getProjectById } from "@/services/getProjectByIdApi";
import { deleteProject } from "@/services/editProjectApi";
import { toggleLikes } from "@/services/toggleLikesApi";
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
        <div className="h-5 w-32 bg-[#E5E7EB] rounded-lg" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="aspect-video bg-[#FFFFFF] border-2 border-[#F1F5F9] rounded-[28px] shadow-sm shimmer" />
          </div>
          
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] border-2 border-[#F1F5F9] rounded-[28px] p-6 shadow-sm space-y-6">
              <div className="space-y-3">
                <div className="h-6 w-24 bg-[#F1F5F9] rounded-md shimmer" />
                <div className="h-10 w-3/4 bg-[#F1F5F9] rounded-xl shimmer" />
              </div>
              <div className="h-16 w-full bg-[#F1F5F9] rounded-xl shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#F1F5F9] rounded shimmer" />
                <div className="h-4 w-5/6 bg-[#F1F5F9] rounded shimmer" />
                <div className="h-4 w-4/6 bg-[#F1F5F9] rounded shimmer" />
              </div>
              <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-2 gap-3">
                <div className="h-12 bg-[#F1F5F9] rounded-xl shimmer" />
                <div className="h-12 bg-[#F1F5F9] rounded-xl shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e5e7eb 37%, #f1f5f9 63%);
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
    <div className="relative bg-[#F8FAFC] min-h-screen w-full overflow-x-hidden [scrollbar-gutter:stable] text-[#111827] font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-700">

      <style jsx>{`
        .shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e5e7eb 37%, #f1f5f9 63%);
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
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-gradient-to-bl from-emerald-400/25 via-teal-300/15 to-cyan-400/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[400px] left-[-200px] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/20 to-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div
        className="fixed inset-0 opacity-[0.35] pointer-events-none z-0"
        style={{ backgroundImage: `radial-gradient(#94A3B8 1px, transparent 1px)`, backgroundSize: "28px 28px" }}
      />

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-2 text-sm font-bold backdrop-blur-md ${
              toast.type === "success" ? "bg-emerald-50/95 border-emerald-200 text-emerald-800" :
              toast.type === "warning" ? "bg-amber-50/95 border-amber-200 text-amber-800" :
              "bg-rose-50/95 border-rose-200 text-rose-800"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toast.type === "warning" && <AlertCircle className="w-5 h-5 text-amber-500" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500" />}
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
              <div className="bg-[#FFFFFF] border-2 border-rose-100 rounded-[28px] p-8 max-w-md w-full text-center shadow-xl shadow-rose-500/5">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-5 border border-rose-100">
                  <AlertCircle className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-xl font-extrabold text-[#111827] mb-2 tracking-tight">Workspace Unavailable</h2>
                <p className="text-sm text-[#6B7280] mb-6 font-medium">{error || "This project may have been deleted or set to private."}</p>
                <button 
                  onClick={() => router.push('/explore')}
                  className="bg-[#111827] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#374151] transition-colors w-full shadow-md cursor-pointer"
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
              <div className="flex items-center justify-between gap-4 border-b-2 border-[#F1F5F9] pb-4">
                <motion.button
                  whileHover={{ x: -4 }}
                  onClick={() => router.push("/projects/explore")}
                  className="inline-flex items-center space-x-2 text-xs font-extrabold text-[#6B7280] hover:text-emerald-600 transition-colors focus:outline-none cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Explore</span>
                </motion.button>

                <span className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Verified Blueprint
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* left column: canvas */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-[#FFFFFF] border-2 border-[#F1F5F9] hover:border-emerald-200 rounded-[28px] overflow-hidden shadow-xl shadow-emerald-500/5 relative aspect-video group flex flex-col justify-between transition-colors duration-300"
                  >
                    
                    <div className="flex items-center justify-between px-5 py-3 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#F1F5F9] shrink-0 z-10">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-rose-400 shadow-sm" />
                        <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
                      </div>
                      <div className="bg-[#F8FAFC] rounded-lg text-xs px-6 py-1.5 border border-[#E5E7EB] text-[#6B7280] font-mono font-bold tracking-tight flex items-center gap-2">
                        <Globe className="w-3 h-3 text-emerald-500" />
                        {project.liveUrl ? new URL(project.liveUrl).hostname : "localhost:3000"}
                      </div>
                      <div className="w-8" />
                    </div>

                    <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-emerald-50/50 to-[#F1F5F9] flex items-center justify-center">
                      {isThumbnailValid ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-emerald-400">
                          <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-emerald-100 flex items-center justify-center shadow-sm mb-4">
                            <Code2 className="w-8 h-8 opacity-60" />
                          </div>
                          <span className="text-xs font-mono font-extrabold uppercase tracking-widest bg-[#FFFFFF] text-emerald-600 border border-emerald-100 px-4 py-1.5 rounded-lg shadow-sm">
                            Source Code Only
                          </span>
                        </div>
                      )}

                      <div className="absolute top-4 left-4">
                        <span
                          className="text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wide text-white bg-gradient-to-r from-orange-500 to-amber-500 inline-flex items-center gap-1.5"
                        >
                          <Flame className="w-3 h-3 fill-white" /> Trending
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-wider bg-[#FFFFFF]/90 backdrop-blur-md text-[#111827] border border-[#E5E7EB] px-3 py-1.5 rounded-xl shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                          <span>Verified</span>
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-emerald-900/30 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center pointer-events-none">
                        {project.liveUrl && (
                          <span className="bg-[#FFFFFF] text-emerald-700 px-5 py-3 rounded-xl text-xs font-extrabold tracking-wide flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto">
                            Open Live Preview <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* right column: primary info */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                  <div className="bg-[#FFFFFF] border-2 border-[#F1F5F9] rounded-[28px] p-6 shadow-xl shadow-emerald-500/5 space-y-5">
                    
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Project Blueprint</span>
                      </div>
                      <h1 className="text-2xl font-extrabold tracking-tight text-[#111827] leading-tight">
                        {project.title}
                      </h1>
                    </div>

                    <div 
                      onClick={() => router.push(`/users/${project.owner?.username}`)}
                      className="flex items-center space-x-3 p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors group"
                    >
                      <img
                        src={project.owner?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.owner?.name || 'U')}&background=E5E7EB&color=111827`}
                        alt={project.owner?.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#FFFFFF] shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-[#111827] truncate group-hover:text-emerald-600 transition-colors">
                          {project.owner?.name || 'Developer'}
                        </h4>
                        <p className="text-xs text-[#6B7280] font-medium font-mono truncate">
                          @{project.owner?.username || 'anonymous'}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-4 font-medium">
                      {project.description || "No description provided for this repository."}
                    </p>

                    <div className="flex items-center space-x-3 pt-2 text-sm font-bold text-[#6B7280]">
                      <span className="flex items-center space-x-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span className="text-[#111827]">{likesCount} Likes</span>
                      </span>
                      <span className="flex items-center space-x-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-[#111827]">{reviews.length} Reviews</span>
                      </span>
                    </div>

                    <div className="space-y-3 pt-5 border-t-2 border-[#F8FAFC]">
                      <div className="grid grid-cols-2 gap-3">
                        <motion.a
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          href={project.liveUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center space-x-2 font-extrabold text-sm py-3 px-4 rounded-xl transition-all ${project.liveUrl ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/25' : 'bg-[#F1F5F9] text-[#94A3B8] pointer-events-none'}`}
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
                          className={`flex items-center justify-center space-x-2 font-extrabold text-sm py-3 px-4 rounded-xl transition-all ${project.githubUrl ? 'bg-[#111827] hover:bg-[#000000] text-white shadow-md' : 'bg-[#F1F5F9] text-[#94A3B8] pointer-events-none'}`}
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
                              ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm shadow-rose-500/10'
                              : 'bg-[#FFFFFF] text-[#111827] border-[#E5E7EB] hover:bg-rose-50/50 hover:border-rose-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{liked ? 'Liked' : 'Like'}</span>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => setBookmarked(!bookmarked)}
                          className={`flex items-center justify-center space-x-2 text-sm font-extrabold py-3 px-4 rounded-xl border-2 transition-all outline-none cursor-pointer ${
                            bookmarked
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-500/10'
                              : 'bg-[#FFFFFF] text-[#111827] border-[#E5E7EB] hover:bg-emerald-50/50 hover:border-emerald-200'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-emerald-500 text-emerald-500' : ''}`} />
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
                  
                  <div className="bg-[#FFFFFF] border-2 border-[#F1F5F9] rounded-[28px] p-6 shadow-sm hover:border-emerald-200 transition-colors space-y-4">
                    <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Layers className="w-4 h-4" /></span>
                      Technology Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.length > 0 ? project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs font-bold font-mono bg-[#F8FAFC] text-[#374151] border border-[#F1F5F9] px-3 py-1.5 rounded-lg select-none hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition-colors capitalize"
                        >
                          {tech}
                        </span>
                      )) : (
                        <span className="text-sm text-[#6B7280] italic">No technologies listed.</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] border-2 border-[#F1F5F9] rounded-[28px] p-6 shadow-sm hover:border-emerald-200 transition-colors space-y-4">
                    <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Code2 className="w-4 h-4" /></span>
                      Implementation Details
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-wrap font-medium">
                      {project.description || "No supplemental details available for this blueprint."}
                    </p>
                  </div>
                </div>

                {/* right column: metadata sidebar (with management controls inside) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#FFFFFF] border-2 border-[#F1F5F9] rounded-[28px] p-6 shadow-sm space-y-5">
                    <h3 className="text-sm font-extrabold text-[#111827]">Repository Metadata</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block">Likes</span>
                        <p className="text-lg font-extrabold text-[#111827]">{likesCount}</p>
                      </div>
                      <div className="space-y-1 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block">Reviews</span>
                        <p className="text-lg font-extrabold text-[#111827]">{reviews.length}</p>
                      </div>
                      <div className="space-y-1 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block">Views</span>
                        <p className="text-lg font-extrabold text-[#111827]">1,402</p>
                      </div>
                      <div className="space-y-1 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block">Saves</span>
                        <p className="text-lg font-extrabold text-[#111827]">{bookmarked ? 43 : 42}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t-2 border-[#F8FAFC] space-y-3 text-sm font-semibold text-[#6B7280]">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-500" /> Version</span>
                        <span className="text-[#111827] font-mono text-xs bg-[#F1F5F9] px-2 py-1 rounded-md">v1.0.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500" /> Deployed</span>
                        <span className="text-[#111827]">
                          {project.createdAt ? new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Integrated Management Actions Layer */}
                    {showManagementActions && (
                      <div className="pt-4 border-t-2 border-[#F8FAFC] space-y-3">
                        <div className="flex flex-col gap-2 w-full">
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.push(`/projects/${id}/edit`)}
                            className="w-full inline-flex items-center justify-center space-x-2 bg-[#FFFFFF] border-2 border-[#E5E7EB] text-[#111827] font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm hover:border-emerald-300 hover:bg-emerald-50/40 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4 text-emerald-600" />
                            <span>Edit Workspace</span>
                          </motion.button>

                          <div className="relative w-full">
                            <AnimatePresence>
                              {showDeleteConfirm && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute left-0 bottom-full mb-2 w-full bg-[#FFFFFF] border-2 border-rose-200 rounded-xl p-4 shadow-xl z-50"
                                >
                                  <p className="text-xs font-bold text-[#111827] mb-3">Permanently delete this project?</p>
                                  <div className="flex gap-2">
                                    <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-[#F1F5F9] text-[#6B7280] text-xs font-bold py-2 rounded-lg hover:bg-[#E5E7EB] transition-colors cursor-pointer">Cancel</button>
                                    <button type="button" onClick={executeDelete} disabled={isDeleting} className="flex-1 bg-rose-500 text-[#FFFFFF] text-xs font-bold py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center cursor-pointer">
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
                              className="w-full inline-flex items-center justify-center space-x-2 bg-rose-50 border-2 border-rose-100 text-rose-600 font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm hover:bg-rose-100 transition-all cursor-pointer"
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
              <div className="bg-[#FFFFFF] border-2 border-[#F1F5F9] rounded-[28px] p-6 md:p-8 shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b-2 border-[#F1F5F9] pb-4 flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#111827] flex items-center gap-2 tracking-tight">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      Peer Reviews
                    </h3>
                    <p className="text-sm text-[#6B7280] mt-1 font-medium">Constructive feedback from the developer community.</p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-extrabold text-[#111827]">{avgRating}</span>
                    <span className="text-xs text-[#6B7280] font-semibold">/ 5.0</span>
                  </div>
                </div>

                {user && !showManagementActions && (
                  <form id="review-form" onSubmit={handleReviewSubmit} className="bg-gradient-to-br from-[#F8FAFC] to-emerald-50/30 border-2 border-[#E5E7EB] rounded-2xl p-6 space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280] block">
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
                              <Star className={`w-6 h-6 transition-colors ${isFilled ? "fill-amber-400 text-amber-400 stroke-amber-400" : "text-[#E5E7EB] stroke-[#9CA3AF]"}`} />
                            </button>
                          );
                        })}
                        {reviewRating > 0 && <span className="text-sm font-extrabold text-[#111827] pl-3">{reviewRating} out of 5</span>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="comment" className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280] block">
                        Written Feedback
                      </label>
                      <textarea
                        id="comment"
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts on the code quality, UX, and architecture..."
                        className="w-full bg-[#FFFFFF] border-2 border-[#E5E7EB] rounded-xl text-sm p-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 placeholder-[#9CA3AF] transition-all resize-none shadow-sm"
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
                          <div className="flex items-start space-x-3 bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-700">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-500" />
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
                          className="mr-3 text-sm font-bold text-[#6B7280] hover:text-[#111827] transition-colors px-4 py-2 cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmittingReview}
                        className={`flex items-center space-x-2 text-[#FFFFFF] font-extrabold text-sm py-2.5 px-6 rounded-xl shadow-md transition-all disabled:opacity-70 cursor-pointer ${editingReview ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25'}`}
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
                        className="p-5 bg-[#FFFFFF] border-2 border-[#F1F5F9] hover:border-emerald-200 rounded-2xl shadow-sm relative group transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'U')}&background=F1F5F9&color=111827`}
                            alt="Reviewer"
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#E5E7EB] shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h5 className="text-sm font-extrabold text-[#111827] inline-block mr-2">
                                  {review.user?.name || "Anonymous Developer"}
                                </h5>
                                <span className="text-xs text-[#6B7280] font-mono font-semibold">
                                  @{review.user?.username || "user"}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                                  {[...Array(5)].map((_, index) => (
                                    <Star key={index} className={`w-3.5 h-3.5 ${index < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB] stroke-[#D1D5DB]'}`} />
                                  ))}
                                </div>
                                <span className="text-xs font-semibold text-[#6B7280]">
                                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Just now"}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-[#475569] leading-relaxed font-medium">
                              {review.review}
                              {review.isEdited && <span className="ml-2 text-xs italic text-emerald-500 font-semibold">(Edited)</span>}
                            </p>

                            {review.user?._id?.toString() === currentLoggedInUserId && (
                              <div className="pt-3 flex items-center gap-2">
                                <button
                                  onClick={() => handleEditReviewSetup(review)}
                                  className="text-xs font-bold text-[#6B7280] hover:text-emerald-600 transition-colors flex items-center gap-1 bg-[#F1F5F9] hover:bg-emerald-50 px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => handleReviewDelete(review._id)}
                                  className="text-xs font-bold text-[#6B7280] hover:text-rose-600 transition-colors flex items-center gap-1 bg-[#F1F5F9] hover:bg-rose-50 px-3 py-1.5 rounded-lg cursor-pointer"
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
                    <div className="text-center py-12 border-2 border-dashed border-[#E5E7EB] rounded-[28px] bg-gradient-to-br from-[#F8FAFC] to-emerald-50/20">
                      <div className="w-14 h-14 bg-[#FFFFFF] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E5E7EB] shadow-sm">
                        <MessageSquare className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-sm font-extrabold text-[#111827]">No reviews yet</p>
                      <p className="text-xs text-[#6B7280] mt-1 font-medium">Be the first to share your thoughts on this project.</p>
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
