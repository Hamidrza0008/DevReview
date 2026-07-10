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
      <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-6 animate-pulse">
        <div className="h-10 bg-[#E5E7EB] rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-[#E5E7EB] rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white rounded-xl border border-[#E5E7EB]"></div>)}
        </div>
        <div className="h-40 bg-white rounded-xl border border-[#E5E7EB]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-white rounded-xl border border-[#E5E7EB]"></div>
          <div className="h-96 bg-white rounded-xl border border-[#E5E7EB]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen text-[#111827]">
      <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Activity Dashboard</h1>
          <p className="text-[#6B7280] mt-2">Track your project likes, reviews received, and feedback given.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: "Total Projects", val: data.stats.totalProjects, icon: <Folder className="text-blue-500 w-5 h-5" />, bg: "bg-blue-50" },
            { label: "Total Likes", val: data.stats.totalLikes, icon: <Heart className="text-rose-500 w-5 h-5" />, bg: "bg-rose-50" },
            { label: "Reviews Received", val: data.stats.totalReceivedReviews, icon: <ArrowDownLeft className="text-emerald-500 w-5 h-5" />, bg: "bg-emerald-50" },
            { label: "Reviews Given", val: data.stats.totalGivenReviews, icon: <ArrowUpRight className="text-amber-500 w-5 h-5" />, bg: "bg-amber-50" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{item.label}</p>
                <p className="text-2xl font-black mt-1 text-gray-900 group-hover:scale-105 transition-transform origin-left">{item.val}</p>
              </div>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                {item.icon}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Project Likes Section */}
        <motion.div variants={itemVariants} className="mb-10">
          <h3 className="font-bold text-xl mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-indigo-600"/> Top Projects Engagement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.projectLikes.map((proj, idx) => (
              <div key={idx} className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300 flex justify-between items-center">
                <span className="font-semibold text-gray-800 truncate pr-2">{proj.title || "Untitled Project"}</span>
                <span className="flex items-center text-rose-500 font-bold bg-rose-50 px-3 py-1 rounded-full text-sm">
                  <Heart className="w-4 h-4 fill-current mr-1.5" /> {proj.likesCount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Received Reviews Column */}
          <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center text-emerald-600">
              <ArrowDownLeft className="w-5 h-5 mr-2"/> Feedback Received
            </h3>
            <div className="space-y-4">
              {data.receivedReviews.length > 0 ? data.receivedReviews.map((rev, i) => (
                <div key={rev._id || i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Project: {rev.project?.title || "Unknown"}</h4>
                      <p className="text-xs text-gray-500">From User</p>
                    </div>
                    <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" /> {rev.rating}/5
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 italic flex">
                    <MessageSquare className="w-4 h-4 mr-2 text-gray-400 shrink-0 mt-0.5"/> 
                    "{rev.review}"
                  </p>
                </div>
              )) : (
                <p className="text-gray-500 text-sm text-center py-6">No reviews received yet.</p>
              )}
            </div>
          </motion.div>

          {/* Given Reviews Column */}
          <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center text-amber-600">
              <ArrowUpRight className="w-5 h-5 mr-2"/> Feedback Given
            </h3>
            <div className="space-y-4">
              {data.givenReviews.length > 0 ? data.givenReviews.map((rev, i) => (
                <div key={rev._id || i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Project: {rev.project?.title || "Unknown"}</h4>
                      <p className="text-xs text-gray-500">You Reviewed</p>
                    </div>
                    <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" /> {rev.rating}/5
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 italic flex">
                    <MessageSquare className="w-4 h-4 mr-2 text-gray-400 shrink-0 mt-0.5"/> 
                    "{rev.review}"
                  </p>
                </div>
              )) : (
                <p className="text-gray-500 text-sm text-center py-6">You haven't given any reviews yet.</p>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}