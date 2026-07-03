"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Flame, Code, Heart, MessageSquare, ExternalLink, GitBranch, ArrowUpRight } from 'lucide-react';
import { getExploreProjects } from '@/services/getExploreProjectsApi';
import { useRouter } from 'next/navigation';

export default function ExploreProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getProjects = async () => {
    try {
      const res = await getExploreProjects();
      setProjects(res?.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  // Compact Skeleton Loader
  if (loading) {
    return (
      <div className="p-6 bg-[#F8FAFC] min-h-screen space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded-lg w-1/5"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
        <div className="h-11 bg-gray-200 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl h-[340px] p-4 space-y-3 shadow-sm">
              <div className="h-40 bg-gray-200 rounded-xl w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-12"></div>
                <div className="h-5 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 bg-[#F8FAFC] min-h-screen text-[#111827]"
    >
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Explore Ecosystems
        </h1>
        <p className="text-[#6B7280] text-sm mt-0.5 font-medium">Discover modern developer code solutions, boilerplate, and design templates.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 w-4 h-4 text-[#6B7280]" />
          <input 
            type="text" 
            placeholder="Search language stack, frameworks, platforms..." 
            className="w-full bg-white border border-[#E5E7EB] pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-[#111827] placeholder-[#6B7280] shadow-sm transition-all"
          />
        </div>
        <button className="bg-white border border-[#E5E7EB] px-4 py-2.5 rounded-xl text-sm font-medium text-[#111827] flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors shadow-sm">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span>Filters</span>
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Trending", "React", "Next.js", "MERN", "Web3", "Tailwind"].map((chip, idx) => (
          <span 
            key={idx} 
            className={`cursor-pointer text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ${
              idx === 0 
                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Grid Header */}
      <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800 tracking-tight">
        <Flame className="w-4 h-4 text-orange-500 mr-1.5 fill-orange-500" /> 
        Trending Showcases
      </h3>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
          <Code className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-semibold text-sm">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="bg-white border border-gray-100 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <div>
                {/* Thumbnail Div with precise hover animation */}
                <div 
                  onClick={() => router.push(`/projects/${project._id}`)}
                  className="relative h-40 w-full overflow-hidden cursor-pointer border-b border-gray-50 bg-slate-50 group/thumb"
                >
                  {/* View Project Only Appears On Thumbnail Hover */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 backdrop-blur-[1px] transition-all duration-300 ease-out z-10 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-md transform translate-y-2 group-hover/thumb:translate-y-0 transition-all duration-300 ease-out">
                      View Project <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  </div>

                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/thumb:scale-105"
                    />
                  ) : (
                    /* Minimal Gradient Fallback */
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-blue-500 via-indigo-500 to-indigo-600 text-white p-4 transition-transform duration-500 ease-out group-hover/thumb:scale-105">
                      <Code className="w-10 h-10 mb-1 stroke-[1.5] opacity-90" />
                      <span className="text-[9px] font-mono font-bold tracking-wider bg-black/15 px-2 py-0.5 rounded uppercase">
                        {project.techStack?.[0] || 'BUILD'}
                      </span>
                    </div>
                  )}
                  
                  {/* Top Creator Overlay */}
                  {project.owner && (
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm border border-gray-100 z-20">
                      {project.owner.profileImage && (
                        <img 
                          src={project.owner.profileImage} 
                          alt={project.owner.username} 
                          className="w-3.5 h-3.5 rounded-full object-cover"
                        />
                      )}
                      <span className="text-[10px] font-bold text-gray-600">@{project.owner.username}</span>
                    </div>
                  )}
                </div>

                {/* Content Area - Compact Padding */}
                <div className="p-4">
                  <h4 className="font-bold text-base mb-1 text-gray-800 line-clamp-1 capitalize tracking-tight">
                    {project.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] mb-3 leading-normal">
                    {project.description || "No description provided. Click above to view the layout details."}
                  </p>

                  {/* Tech Stack Tags - Minty Emerald Look */}
                  <div className="flex flex-wrap gap-1">
                    {project.techStack?.map((tech, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-bold font-mono bg-emerald-50/80 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100/50 shadow-sm capitalize"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="px-4 pb-4 pt-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                {/* Likes and Reviews */}
                <div className="flex space-x-3 text-gray-400">
                  <span className="flex items-center text-[11px] font-semibold hover:text-red-500 cursor-pointer transition-colors group/like">
                    <Heart className="w-3.5 h-3.5 mr-1 stroke-[2] group-hover/like:fill-red-500 group-hover/like:text-red-500" /> {project.likes || 0}
                  </span>
                  <span className="flex items-center text-[11px] font-semibold hover:text-blue-500 cursor-pointer transition-colors">
                    <MessageSquare className="w-3.5 h-3.5 mr-1 stroke-[2]" /> {project.reviews || 0}
                  </span>
                </div>

                {/* Project Links */}
                <div className="flex items-center space-x-1.5">
                  {project.GitBranchUrl && (
                    <a 
                      href={project.GitBranchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-gray-800 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-1.5 rounded-lg flex items-center transition-all duration-200"
                    >
                      Live <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}