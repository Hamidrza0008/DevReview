"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Flame, Code, Heart, MessageSquare, ExternalLink, GitBranch } from 'lucide-react';
import { getExploreProjects } from '@/services/getExploreProjectsApi';
import { useRouter } from 'next/navigation';

export default function ExploreProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getProjects = async () => {
    try {
      const res = await getExploreProjects();
      // Agar res.projects array hai to state me set karo, nahi to khaali array
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

  // Mast Skeleton Loader Layout
  if (loading) {
    return (
      <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-9 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-2/5"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl h-[380px] p-5 space-y-4 shadow-sm">
              <div className="h-40 bg-gray-200 rounded-xl w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-8 bg-[#F8FAFC] min-h-screen text-[#111827]"
    >
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Explore Ecosystems
        </h1>
        <p className="text-[#6B7280] mt-1">Discover modern developer code solutions, boilerplate, and design templates.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#6B7280]" />
          <input 
            type="text" 
            placeholder="Search language stack, frameworks, platforms..." 
            className="w-full bg-white border border-[#E5E7EB] pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-[#111827] placeholder-[#6B7280] shadow-sm transition-all"
          />
        </div>
        <button className="bg-white border border-[#E5E7EB] px-5 py-3 rounded-xl text-sm font-medium text-[#111827] flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors shadow-sm">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span>Filters</span>
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["Trending", "React", "Next.js", "MERN", "Web3", "Tailwind"].map((chip, idx) => (
          <span 
            key={idx} 
            className={`cursor-pointer text-xs px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              idx === 0 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Dynamic Projects Grid */}
      <h3 className="font-bold text-xl mb-6 flex items-center text-gray-800">
        <Flame className="w-5 h-5 text-orange-500 mr-2 fill-orange-500 animate-pulse" /> 
        Trending Showcases
      </h3>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No projects found. Add some data to database!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div 
              key={project._id} 
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white border border-gray-100 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Thumbnail / Card Banner */}
                <div 
                onClick={() => router.push(`/projects/${project._id}`)}
                className="relative h-44 w-full bg-slate-100 overflow-hidden group border-b border-gray-50">
                  {project.thumbnail ? (
                    <img 
                    
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-400 p-4">
                      <Code className="w-10 h-10 mb-2 stroke-[1.5]" />
                      <span className="text-xs font-mono font-medium tracking-wider bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                        {project.techStack?.[0] || 'PROJECT'}
                      </span>
                    </div>
                  )}
                  
                  {/* Top Creator Overlay */}
                  {project.owner && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
                      {project.owner.profileImage && (
                        <img 
                          src={project.owner.profileImage} 
                          alt={project.owner.username} 
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span className="text-[11px] font-semibold text-gray-700">@{project.owner.username}</span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-5">
                  <h4 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1 hover:text-blue-600 transition-colors capitalize">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-4">
                    {project.description || "No description provided."}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.techStack?.map((tech, i) => (
                      <span 
                        key={i} 
                        className="text-[11px] font-semibold font-mono bg-blue-50/60 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-100/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="px-5 pb-5 pt-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                {/* Likes and Reviews */}
                <div className="flex space-x-4 text-gray-500">
                  <span className="flex items-center text-xs font-medium hover:text-red-500 cursor-pointer transition-colors">
                    <Heart className="w-4 h-4 mr-1 stroke-[2]" /> {project.likes || 0}
                  </span>
                  <span className="flex items-center text-xs font-medium hover:text-blue-500 cursor-pointer transition-colors">
                    <MessageSquare className="w-4 h-4 mr-1 stroke-[2]" /> {project.reviews || 0}
                  </span>
                </div>

                {/* Project Links */}
                <div className="flex items-center space-x-2">
                  {project.GitBranchUrl && (
                    <a 
                      href={project.GitBranchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all"
                    >
                      <GitBranch className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg flex items-center transition-colors"
                    >
                      Live <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}