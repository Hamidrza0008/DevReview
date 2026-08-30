"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ArrowDownLeft, ArrowUpRight, Heart, Activity } from 'lucide-react';
import { getMyReviews, markReviewAsReadApi } from '@/services/reviewApis';
import { useRouter } from 'next/navigation';

export default function ReviewsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { totalProjects: 0, totalLikes: 0, totalGivenReviews: 0, totalReceivedReviews: 0 },
    projectLikes: [],
    receivedReviews: [],
    givenReviews: []
  });

  const fetchDashboardData = async () => {
    try {
      const res = await getMyReviews();
      if (res && res.success) {
        setData({
          stats: res.stats || data.stats,
          projectLikes: res.projectLikes || [],
          receivedReviews: res.receivedReviews || [],
          givenReviews: res.givenReviews || []
        });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewRead = async (reviewId) => {
    setData(prev => ({
      ...prev,
      receivedReviews: prev.receivedReviews.map(r =>
        r._id === reviewId ? { ...r, isRead: true } : r
      )
    }));
    markReviewAsReadApi(reviewId);
  };

  useEffect(() => {
    fetchDashboardData();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-page min-h-screen space-y-6 animate-pulse">
        <div className="h-8 md:h-10 bg-line rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-line rounded w-1/4 mb-6"></div>
        <div className="bg-surface border border-line rounded-2xl px-6 py-5 mb-8">
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-8 bg-line rounded w-12"></div>
                <div className="h-3 bg-line rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-surface rounded-xl border border-line"></div>
          <div className="h-64 bg-surface rounded-xl border border-line"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-page min-h-screen text-ink">
      <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Activity Dashboard</h1>
          <p className="text-muted mt-2">Track your project likes, reviews received, and feedback given.</p>
        </motion.div>

        {/* Stats - Instagram style compact */}
        <motion.div variants={itemVariants} className="bg-surface border border-line rounded-2xl px-4 sm:px-6 py-4 shadow-sm mb-10">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {[
              { label: "projects", val: data.stats.totalProjects },
              { label: "likes", val: data.stats.totalLikes },
              { label: "reviews received", val: data.stats.totalReceivedReviews },
              { label: "reviews given", val: data.stats.totalGivenReviews }
            ].map((st, idx) => (
              <div key={idx} className="flex flex-col items-center group cursor-default">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-ink group-hover:text-accent transition-colors tabular-nums">{st.val}</span>
                <span className="text-[11px] sm:text-xs font-semibold text-muted lowercase">{st.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project Likes Section */}
        <motion.div variants={itemVariants} className="mb-10">
          <h3 className="font-bold text-xl mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-info"/> Top Projects Engagement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.projectLikes.map((proj, idx) => (
              <div key={idx} className="bg-surface border border-line p-4 rounded-xl shadow-sm hover:border-info/50 hover:-translate-y-1 transition-all duration-300 flex justify-between items-center">
                <span className="font-semibold text-ink truncate pr-2">{proj.title || "Untitled Project"}</span>
                <span className="flex items-center text-like font-bold bg-like/10 px-3 py-1 rounded-full text-sm">
                  <Heart className="w-4 h-4 fill-current mr-1.5" /> {proj.likesCount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Received Reviews Column */}
          <motion.div variants={itemVariants} className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center text-accent">
              <ArrowDownLeft className="w-5 h-5 mr-2"/> Feedback Received
            </h3>
            <div className="space-y-4">
              {data.receivedReviews.length > 0 ? data.receivedReviews.map((rev, i) => (
                <div
                  key={rev._id || i}
                  role={rev.project?._id ? "link" : undefined}
                  tabIndex={rev.project?._id ? 0 : undefined}
                  onClick={() => {
                    if (!rev.isRead) handleReviewRead(rev._id);
                    if (rev.project?._id) router.push(`/projects/${rev.project._id}`);
                  }}
                  onKeyDown={(event) => {
                    if (rev.project?._id && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      if (!rev.isRead) handleReviewRead(rev._id);
                      router.push(`/projects/${rev.project._id}`);
                    }
                  }}
                  className={`relative p-4 rounded-xl border transition-all duration-300 ${rev.project?._id ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent" : ""} ${!rev.isRead ? "bg-accent-soft/35 border-accent/20" : "bg-surface-2 border-surface-2 hover:bg-surface hover:border-accent/40 hover:shadow-md"}`}
                >
                  {!rev.isRead && <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-accent" />}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-ink">Project: {rev.project?.title || "Unknown"}</h4>
                      <p className="text-xs text-muted">From User</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!rev.isRead && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                      <div className="flex items-center text-star bg-star/10 px-2 py-0.5 rounded text-xs font-bold border border-star/30">
                        <Star className="w-3.5 h-3.5 fill-current mr-1" /> {rev.rating}/5
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2 italic flex">
                    <MessageSquare className="w-4 h-4 mr-2 text-muted shrink-0 mt-0.5"/> 
                    "{rev.review}"
                  </p>
                </div>
              )) : (
                <p className="text-muted text-sm text-center py-6">No reviews received yet.</p>
              )}
            </div>
          </motion.div>

          {/* Given Reviews Column */}
          <motion.div variants={itemVariants} className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center text-star">
              <ArrowUpRight className="w-5 h-5 mr-2"/> Feedback Given
            </h3>
            <div className="space-y-4">
              {data.givenReviews.length > 0 ? data.givenReviews.map((rev, i) => (
                <div
                  key={rev._id || i}
                  role={rev.project?._id ? "link" : undefined}
                  tabIndex={rev.project?._id ? 0 : undefined}
                  onClick={() => rev.project?._id && router.push(`/projects/${rev.project._id}`)}
                  onKeyDown={(event) => {
                    if (rev.project?._id && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      router.push(`/projects/${rev.project._id}`);
                    }
                  }}
                  className={`p-4 rounded-xl border border-surface-2 bg-surface-2 hover:bg-surface hover:border-star/40 hover:shadow-md transition-all duration-300 ${rev.project?._id ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-star" : ""}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-ink">Project: {rev.project?.title || "Unknown"}</h4>
                      <p className="text-xs text-muted">You Reviewed</p>
                    </div>
                    <div className="flex items-center text-star bg-star/10 px-2 py-0.5 rounded text-xs font-bold border border-star/30">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" /> {rev.rating}/5
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2 italic flex">
                    <MessageSquare className="w-4 h-4 mr-2 text-muted shrink-0 mt-0.5"/> 
                    "{rev.review}"
                  </p>
                </div>
              )) : (
                <p className="text-muted text-sm text-center py-6">You haven't given any reviews yet.</p>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
