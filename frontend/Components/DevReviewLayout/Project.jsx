"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, GitBranch, ExternalLink, Heart, MessageSquare,
  Bookmark, Code2, Eye, Star, CheckCircle2, Edit3, Trash2,
  Calendar, Layers, Sparkles, ArrowUpRight, Edit2, AlertCircle,
  Loader2, Globe
} from "lucide-react";
import { getProjectById } from "@/services/getProjectByIdApi";
import { deleteProject } from "@/services/editProjectApi";
import { toggleLikes } from "@/services/toggleLikesApi";
import { addReviews, deleteReview, editReview, getReviews } from "@/services/reviewApis";

// perfectly mapped skeleton to prevent layout shift
function ProjectSkeleton() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 md:py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="h-5 w-32 bg-[#E5E7EB] rounded-lg" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="aspect-video bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] shadow-sm" />
          </div>
          
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm space-y-6">
              <div className="space-y-3">
                <div className="h-6 w-24 bg-[#F1F5F9] rounded-md" />
                <div className="h-10 w-3/4 bg-[#F1F5F9] rounded-xl" />
              </div>
              <div className="h-16 w-full bg-[#F1F5F9] rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#F1F5F9] rounded" />
                <div className="h-4 w-5/6 bg-[#F1F5F9] rounded" />
                <div className="h-4 w-4/6 bg-[#F1F5F9] rounded" />
              </div>
              <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-2 gap-3">
                <div className="h-12 bg-[#F1F5F9] rounded-xl" />
                <div className="h-12 bg-[#F1F5F9] rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SingleProject() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // interaction states
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  // management states
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // review states
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // custom toast system replacing ugly alerts
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
        if (isMounted) setLoading(false);
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

  // optimistic update for perceived speed
  const handleLikeButton = async () => {
    const previousLiked = liked;
    const previousCount = likesCount;
    
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await toggleLikes(id);
      if (!res.success) throw new Error("Toggle failed");
    } catch (err) {
      // revert on failure
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
    if (!reviewComment.trim() || reviewRating === 0) {
      showToast("warning", "Please provide both a rating and a comment.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      if (editingReview) {
        await editReview(project._id, reviewRating, reviewComment);
        showToast("success", "Review updated successfully.");
      } else {
        await addReviews(id, reviewRating, reviewComment);
        showToast("success", "Review published.");
      }
      
      setReviewComment("");
      setReviewRating(0);
      setEditingReview(null);
      await refreshReviews();
    } catch (err) {
      showToast("error", "Failed to process review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditReviewSetup = (review) => {
    setReviewComment(review.review);
    setReviewRating(review.rating);
    setEditingReview(review);
    // scroll to form
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

  if (loading) return <ProjectSkeleton />;

  if (error || !project) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-8 max-w-md w-full text-center shadow-sm"
        >
          <AlertCircle className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#111827] mb-2">Workspace Unavailable</h2>
          <p className="text-sm text-[#6B7280] mb-6">{error || "This project may have been deleted or set to private."}</p>
          <button 
            onClick={() => router.push('/explore')}
            className="bg-[#F1F5F9] text-[#111827] px-6 py-2.5 rounded-xl font-semibold hover:bg-[#E5E7EB] transition-colors w-full"
          >
            Return to Explore
          </button>
        </motion.div>
      </div>
    );
  }

  const isThumbnailValid = project.thumbnail && project.thumbnail.trim() !== "";

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#111827] antialiased selection:bg-[#2563EB]/20 selection:text-[#2563EB] relative pb-24">
      
      {/* background textures */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* global toast layer */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg border flex items-center gap-2 text-sm font-semibold backdrop-blur-md ${
              toast.type === "success" ? "bg-[#22C55E]/10 border-[#22C55E]/20 text-[#111827]" :
              toast.type === "warning" ? "bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#111827]" :
              "bg-[#EF4444]/10 border-[#EF4444]/20 text-[#111827]"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />}
            {toast.type === "warning" && <AlertCircle className="w-5 h-5 text-[#F59E0B]" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-[#EF4444]" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 z-10 relative space-y-8">

        {/* top navigation bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E5E7EB] pb-6">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => router.push("/explore")}
            className="inline-flex items-center space-x-2 text-sm font-bold text-[#6B7280] hover:text-[#111827] transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </motion.button>

          {showManagementActions && (
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/projects/${id}/edit`)}
                className="inline-flex items-center space-x-2 bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] font-semibold text-sm py-2 px-4 rounded-xl shadow-sm hover:border-[#2563EB]/40 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Project</span>
              </motion.button>

              <div className="relative">
                <AnimatePresence>
                  {showDeleteConfirm && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-[#FFFFFF] border border-[#EF4444]/20 rounded-xl p-4 shadow-xl z-50"
                    >
                      <p className="text-xs font-bold text-[#111827] mb-3">Permanently delete this project?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-[#F1F5F9] text-[#6B7280] text-xs font-semibold py-2 rounded-lg hover:bg-[#E5E7EB] transition-colors">Cancel</button>
                        <button onClick={executeDelete} disabled={isDeleting} className="flex-1 bg-[#EF4444] text-[#FFFFFF] text-xs font-semibold py-2 rounded-lg hover:bg-[#DC2626] transition-colors flex items-center justify-center">
                          {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center space-x-2 bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] font-semibold text-sm py-2 px-4 rounded-xl shadow-sm hover:bg-[#FEE2E2] transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* main visual layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* left column: canvas */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-sm relative aspect-video group flex flex-col justify-between">
              
              {/* premium browser chrome */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#FFFFFF] border-b border-[#E5E7EB] shrink-0 z-10">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#E5E7EB] group-hover:bg-[#EF4444] transition-colors duration-300" />
                  <span className="w-3 h-3 rounded-full bg-[#E5E7EB] group-hover:bg-[#F59E0B] transition-colors duration-300" />
                  <span className="w-3 h-3 rounded-full bg-[#E5E7EB] group-hover:bg-[#22C55E] transition-colors duration-300" />
                </div>
                <div className="bg-[#F8FAFC] rounded-lg text-xs px-6 py-1.5 border border-[#E5E7EB] text-[#6B7280] font-mono tracking-tight flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  {project.liveUrl ? new URL(project.liveUrl).hostname : "localhost:3000"}
                </div>
                <div className="w-8" />
              </div>

              {/* presentation area */}
              <div className="flex-1 relative overflow-hidden bg-[#F1F5F9] flex items-center justify-center">
                {isThumbnailValid ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-[#6B7280]">
                    <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center shadow-sm mb-4">
                      <Code2 className="w-8 h-8 opacity-50" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest bg-[#E5E7EB]/50 px-3 py-1 rounded-md">
                      Source Code Only
                    </span>
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider bg-[#FFFFFF]/90 backdrop-blur-md text-[#111827] border border-[#E5E7EB] px-3 py-1.5 rounded-xl shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* right column: primary info */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm space-y-5">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2563EB]/5 border border-[#2563EB]/10 text-[#2563EB] font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Project Blueprint</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827] leading-tight">
                  {project.title}
                </h1>
              </div>

              {/* maintainer block */}
              <div 
                onClick={() => router.push(`/users/${project.owner?.username}`)}
                className="flex items-center space-x-3 p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl cursor-pointer hover:border-[#2563EB]/30 transition-colors group"
              >
                <img
                  src={project.owner?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.owner?.name || 'U')}&background=E5E7EB&color=111827`}
                  alt={project.owner?.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#FFFFFF] shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#111827] truncate group-hover:text-[#2563EB] transition-colors">
                    {project.owner?.name || 'Developer'}
                  </h4>
                  <p className="text-xs text-[#6B7280] font-medium font-mono truncate">
                    @{project.owner?.username || 'anonymous'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-4">
                {project.description || "No description provided for this repository."}
              </p>

              {/* quick stats */}
              <div className="flex items-center space-x-5 pt-2 text-sm font-semibold text-[#6B7280]">
                <span className="flex items-center space-x-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#F1F5F9]">
                  <Heart className="w-4 h-4 text-[#EF4444] fill-[#EF4444]" />
                  <span className="text-[#111827]">{likesCount} Likes</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#F1F5F9]">
                  <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-[#111827]">{reviews.length} Reviews</span>
                </span>
              </div>

              {/* action dispatch lines */}
              <div className="space-y-3 pt-5 border-t border-[#F1F5F9]">
                <div className="grid grid-cols-2 gap-3">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={project.liveUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-center space-x-2 font-bold text-sm py-3 px-4 rounded-xl shadow-sm transition-all ${project.liveUrl ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF]' : 'bg-[#F1F5F9] text-[#6B7280] pointer-events-none'}`}
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={project.githubUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-center space-x-2 font-bold text-sm py-3 px-4 rounded-xl shadow-sm transition-all ${project.githubUrl ? 'bg-[#111827] hover:bg-[#000000] text-[#FFFFFF]' : 'bg-[#F1F5F9] text-[#6B7280] pointer-events-none'}`}
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Source</span>
                  </motion.a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleLikeButton}
                    className={`flex items-center justify-center space-x-2 text-sm font-bold py-3 px-4 rounded-xl border transition-all shadow-sm outline-none ${
                      liked
                        ? 'bg-[#FEF2F2] text-[#EF4444] border-[#FCA5A5]'
                        : 'bg-[#FFFFFF] text-[#111827] border-[#E5E7EB] hover:bg-[#F8FAFC] hover:border-[#E5E7EB]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-[#EF4444]' : ''}`} />
                    <span>{liked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`flex items-center justify-center space-x-2 text-sm font-bold py-3 px-4 rounded-xl border transition-all shadow-sm outline-none ${
                      bookmarked
                        ? 'bg-[#EFF6FF] text-[#2563EB] border-[#93C5FD]'
                        : 'bg-[#FFFFFF] text-[#111827] border-[#E5E7EB] hover:bg-[#F8FAFC] hover:border-[#E5E7EB]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#2563EB]' : ''}`} />
                    <span>{bookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* secondary detailed information grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* long-form details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* tech stack */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2563EB]" />
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.length > 0 ? project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs font-bold bg-[#F8FAFC] text-[#111827] border border-[#E5E7EB] px-3 py-1.5 rounded-lg select-none"
                  >
                    {tech}
                  </span>
                )) : (
                  <span className="text-sm text-[#6B7280] italic">No technologies listed.</span>
                )}
              </div>
            </div>

            {/* detailed description */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#2563EB]" />
                Implementation Details
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">
                {project.description || "No supplemental details available for this blueprint."}
              </p>
            </div>
          </div>

          {/* metadata sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-[#111827]">Repository Metadata</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Likes</span>
                  <p className="text-lg font-bold text-[#111827]">{likesCount}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Reviews</span>
                  <p className="text-lg font-bold text-[#111827]">{reviews.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Views</span>
                  <p className="text-lg font-bold text-[#111827]">1,402</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Saves</span>
                  <p className="text-lg font-bold text-[#111827]">{bookmarked ? 43 : 42}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9] space-y-3 text-sm font-medium text-[#6B7280]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> Version</span>
                  <span className="text-[#111827] font-mono text-xs">v1.0.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Deployed</span>
                  <span className="text-[#111827]">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* peer feedback / reviews block */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 md:p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#111827]">Peer Reviews</h3>
              <p className="text-sm text-[#6B7280] mt-1">Constructive feedback from the developer community.</p>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] px-4 py-2 rounded-xl flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="font-bold text-[#111827]">{reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0"}</span>
            </div>
          </div>

          {/* write review form */}
          {user && !showManagementActions && (
            <form id="review-form" onSubmit={handleReviewSubmit} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block">
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
                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star className={`w-6 h-6 transition-colors ${isFilled ? "fill-[#F59E0B] text-[#F59E0B] stroke-[#F59E0B]" : "text-[#E5E7EB] stroke-[#9CA3AF]"}`} />
                      </button>
                    );
                  })}
                  {reviewRating > 0 && <span className="text-sm font-bold text-[#111827] pl-3">{reviewRating} out of 5</span>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="comment" className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block">
                  Written Feedback
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts on the code quality, UX, and architecture..."
                  className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl text-sm p-4 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] placeholder-[#9CA3AF] transition-all resize-none shadow-sm"
                />
              </div>

              <div className="flex justify-end pt-2">
                {editingReview && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingReview(null); setReviewComment(""); setReviewRating(0); }}
                    className="mr-3 text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors px-4 py-2"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className={`flex items-center space-x-2 text-[#FFFFFF] font-semibold text-sm py-2.5 px-6 rounded-xl shadow-sm transition-all disabled:opacity-70 ${editingReview ? 'bg-[#10B981] hover:bg-[#059669]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'}`}
                >
                  {isSubmittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingReview ? "Update Review" : "Publish Review"}</span>
                </button>
              </div>
            </form>
          )}

          {/* review listing */}
          <div className="space-y-5">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-sm relative group">
                  <div className="flex items-start space-x-4">
                    <img
                      src={review.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'U')}&background=F1F5F9&color=111827`}
                      alt="Reviewer"
                      className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB] shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h5 className="text-sm font-bold text-[#111827] inline-block mr-2">
                            {review.user?.name || "Anonymous Developer"}
                          </h5>
                          <span className="text-xs text-[#6B7280] font-mono">
                            @{review.user?.username || "user"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-[#FFFBEB] border border-[#FDE68A] rounded-lg px-2 py-1">
                            {[...Array(5)].map((_, index) => (
                              <Star key={index} className={`w-3.5 h-3.5 ${index < review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E5E7EB] stroke-[#D1D5DB]'}`} />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-[#6B7280]">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Just now"}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-[#475569] leading-relaxed">
                        {review.review}
                        {review.isEdited && <span className="ml-2 text-xs italic text-[#10B981]">(Edited)</span>}
                      </p>

                      {/* owner controls */}
                      {review.user?._id?.toString() === currentLoggedInUserId && (
                        <div className="pt-3 flex items-center gap-2">
                          <button
                            onClick={() => handleEditReviewSetup(review)}
                            className="text-xs font-semibold text-[#6B7280] hover:text-[#2563EB] transition-colors flex items-center gap-1 bg-[#F1F5F9] hover:bg-[#EFF6FF] px-3 py-1.5 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleReviewDelete(review._id)}
                            className="text-xs font-semibold text-[#6B7280] hover:text-[#EF4444] transition-colors flex items-center gap-1 bg-[#F1F5F9] hover:bg-[#FEF2F2] px-3 py-1.5 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-[#E5E7EB] rounded-[24px] bg-[#F8FAFC]">
                <MessageSquare className="w-8 h-8 text-[#6B7280] opacity-50 mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#111827]">No reviews yet</p>
                <p className="text-xs text-[#6B7280] mt-1">Be the first to share your thoughts on this project.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}