"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ArrowDownLeft, ArrowUpRight, Heart, Folder, Activity } from 'lucide-react';
import { getMyReviews } from '@/services/reviewApis';

export default function ReviewsDashboard() {
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
      console.log(res)
      // Assuming 'res' is directly the object you provided: { success: true, stats: {...}, givenReviews: [...], ... }
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

  useEffect(() => {
    fetchDashboardData();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Framer Motion Variants
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
      <div className="p-8 bg-page min-h-screen space-y-6 animate-pulse">
        <div className="h-10 bg-line rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-line rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-surface rounded-xl border border-line"></div>)}
        </div>
        <div className="h-40 bg-surface rounded-xl border border-line"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-surface rounded-xl border border-line"></div>
          <div className="h-96 bg-surface rounded-xl border border-line"></div>
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

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: "Total Projects", val: data.stats.totalProjects, icon: <Folder className="text-info w-5 h-5" />, bg: "bg-info/10" },
            { label: "Total Likes", val: data.stats.totalLikes, icon: <Heart className="text-like w-5 h-5" />, bg: "bg-like/10" },
            { label: "Reviews Received", val: data.stats.totalReceivedReviews, icon: <ArrowDownLeft className="text-accent w-5 h-5" />, bg: "bg-accent-soft" },
            { label: "Reviews Given", val: data.stats.totalGivenReviews, icon: <ArrowUpRight className="text-star w-5 h-5" />, bg: "bg-star/10" }
          ].map((item, idx) => (
            <div key={idx} className="bg-surface border border-line p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold text-muted uppercase tracking-wider">{item.label}</p>
                <p className="text-2xl font-black mt-1 text-ink group-hover:scale-105 transition-transform origin-left">{item.val}</p>
              </div>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                {item.icon}
              </div>
            </div>
          ))}
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
                <div key={rev._id || i} className="p-4 rounded-xl border border-surface-2 bg-surface-2 hover:bg-surface hover:border-accent/40 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-ink">Project: {rev.project?.title || "Unknown"}</h4>
                      <p className="text-xs text-muted">From User</p>
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
                <div key={rev._id || i} className="p-4 rounded-xl border border-surface-2 bg-surface-2 hover:bg-surface hover:border-star/40 hover:shadow-md transition-all duration-300">
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