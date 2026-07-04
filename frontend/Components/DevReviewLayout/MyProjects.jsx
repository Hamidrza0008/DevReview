"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, MessageSquare, ExternalLink, GitBranch, Layers, FolderGit2, Search, SlidersHorizontal, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMyProjects } from '@/services/getMyProjectsApi';

// Fallback gradient filters using your design palette variations
const getFallbackGradient = (title) => {
  const gradients = [
    'from-[#2563EB]/10 to-[#3B82F6]/20 text-[#2563EB]',
    'from-[#22C55E]/10 to-[#3B82F6]/10 text-[#3B82F6]',
    'from-[#2563EB]/5 via-[#3B82F6]/10 to-[#22C55E]/5 text-[#111827]',
    'from-[#3B82F6]/10 to-[#111827]/5 text-[#2563EB]'
  ];
  const index = title ? title.length % gradients.length : 0;
  return gradients[index];
};

export default function MyProjects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  const getProjects = async () => {
    try {
      const res = await getMyProjects();
      if (res && res.projects) {
        setProjects(res.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  // COMPACT PREMIUM SKELETON LOADING UI
  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 w-1/3">
            <div className="h-7 bg-[#E5E7EB] rounded-xl w-3/4"></div>
            <div className="h-3 bg-[#E5E7EB] rounded w-1/2"></div>
          </div>
          <div className="h-10 bg-[#E5E7EB] rounded-xl w-full sm:w-32"></div>
        </div>
        <div className="h-[1px] bg-[#E5E7EB] w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-2xs"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen text-[#111827] max-w-7xl mx-auto space-y-6 antialiased relative selection:bg-[#2563EB]/10 selection:text-[#2563EB]"
    >
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-[#E5E7EB] z-10 relative">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            My Projects
          </h1>
          <p className="text-xs text-[#6B7280]">Manage, deploy, and inspect your creative submissions metrics logs.</p>
        </div>
        <motion.button 
          onClick={() => router.push("/projects/create")}  
          whileHover={{ scale: 1.01, y: -0.5 }}
          whileTap={{ scale: 0.99 }}
          className="bg-[#2563EB] hover:bg-[#3B82F6] text-[#FFFFFF] px-4 py-2.5 rounded-xl font-semibold flex items-center space-x-1.5 shadow-2xs transition-all text-xs w-full sm:w-auto justify-center shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> 
          <span>Upload Project</span>
        </motion.button>
      </div>

      {/* CONTROLS SEARCH MOCK BAR SEARCH FOR ALIGNMENT */}
      <div className="flex flex-col sm:flex-row gap-3 items-center z-10 relative max-w-xl">
        <div className="relative flex-1 w-full group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input 
            type="text" 
            placeholder="Search matching projects..." 
            disabled
            className="w-full text-xs pl-10 pr-4 py-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl text-[#6B7280] opacity-80 cursor-not-allowed shadow-2xs"
          />
        </div>
        <button disabled className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold px-3 py-2 rounded-xl text-[#6B7280] opacity-70 cursor-not-allowed shrink-0 shadow-2xs">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Sort</span>
        </button>
      </div>

      {/* NO PROJECTS STATE */}
      {projects.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 border border-dashed border-[#E5E7EB] rounded-2xl bg-[#FFFFFF] shadow-2xs max-w-xl mx-auto p-6 text-center space-y-3 z-10 relative"
        >
          <div className="w-12 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-center mx-auto text-[#6B7280]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[#111827] text-sm font-bold">No projects discovered</p>
            <p className="text-xs text-[#6B7280] max-w-xs mx-auto">Start building your portfolio stack by submitting your first application deployment log.</p>
          </div>
          <button onClick={() => router.push("/projects/create")} className="mt-2 bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 rounded-xl">
            Upload Codebase
          </button>
        </motion.div>
      )}

      {/* REDESIGNED COMPACT PROJECTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 z-10 relative">
        {projects.map((project, i) => {
          const hasThumbnail = project.thumbnail && project.thumbnail.trim() !== "";
          const fallbackGradient = getFallbackGradient(project.title);

          return (
            <motion.div
              key={project._id || i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 100, damping: 18 }}
              whileHover={{ y: -4, borderColor: '#2563EB/40', boxShadow: '0 10px 20px -12px rgba(37,99,235,0.15)' }}
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-2xs"
            >
              <div>
                {/* COMPACT BROWSER SCREENSHOT BAR AREA */}
                <div className="h-32 w-full relative overflow-hidden bg-[#F8FAFC] border-b border-[#E5E7EB] flex flex-col justify-between select-none">
                  {/* Mock Browser Header Top Layer */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFFFFF] border-b border-[#E5E7EB]/60 shrink-0 z-10">
                    <div className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB] group-hover:bg-rose-400 transition-colors" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB] group-hover:bg-amber-400 transition-colors" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB] group-hover:bg-emerald-400 transition-colors" />
                    </div>
                    <div onClick={() => router.push(`/projects/${project._id}`)} className="bg-[#F8FAFC] rounded border border-[#E5E7EB] text-[9px] px-3 py-0.2 text-[#6B7280] font-mono w-24 text-center truncate cursor-pointer hover:border-[#2563EB]/30">
                      inspect://app
                    </div>
                    <div className="w-4" />
                  </div>

                  {/* Body Canvas Wrapper */}
                  <div onClick={() => router.push(`/projects/${project._id}`)} className="flex-1 w-full relative overflow-hidden bg-[#F8FAFC] cursor-pointer flex items-center justify-center">
                    {hasThumbnail ? (
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center p-3 relative absolute inset-0 group-hover:scale-105 transition-transform duration-500`}>
                        <span className="text-xl font-black tracking-wider uppercase opacity-20 font-sans">
                          {project.title ? project.title.slice(0, 2) : 'PR'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span className={`absolute bottom-2 right-2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                    project.status === 'Published' 
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' 
                      : 'bg-[#6B7280]/10 text-[#6B7280] border-[#E5E7EB]'
                  }`}>
                    {project.status || 'Active'}
                  </span>
                </div>

                {/* CARD BODY TEXT LAYOUT */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 onClick={() => router.push(`/projects/${project._id}`)} className="font-bold text-sm text-[#111827] tracking-tight line-clamp-1 group-hover:text-[#2563EB] cursor-pointer transition-colors flex items-center gap-1">
                        {project.title}
                      </h3>
                      
                      {/* Anchor Links Blocks */}
                      <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-[#F8FAFC] rounded-md text-[#6B7280] hover:text-[#111827] border border-transparent hover:border-[#E5E7EB] transition-colors">
                            <GitBranch className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-[#F8FAFC] rounded-md text-[#6B7280] hover:text-[#2563EB] border border-transparent hover:border-[#E5E7EB] transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed min-h-[32px] font-normal">
                      {project.description || "No dynamic log description provided for this repository."}
                    </p>
                  </div>

                  {/* TECH STACK CHIPS */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {project.techStack && project.techStack.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="text-[9px] font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 px-2 py-0.5 rounded-md shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* MOCK CARD METRICS FOOTER */}
              <div className="px-4 py-2.5 border-t border-[#E5E7EB] bg-[#F8FAFC]/50 flex justify-between items-center text-[11px] text-[#6B7280] font-medium rounded-b-2xl">
                <div className="flex space-x-3">
                  <span className="flex items-center space-x-1 cursor-pointer group/heart transition-colors">
                    <Heart className="w-3.5 h-3.5 text-[#6B7280] group-hover/heart:text-rose-500 group-hover/heart:fill-rose-500/10 transition-colors" /> 
                    <span className="text-[#111827] font-semibold">{project.likes || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1 cursor-pointer group/msg transition-colors">
                    <MessageSquare className="w-3.5 h-3.5 text-[#6B7280] group-hover/msg:text-[#2563EB] transition-colors" /> 
                    <span className="text-[#111827] font-semibold">{project.reviews || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-[#6B7280]/60 select-none">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{Math.floor(((project.likes || 0) * 4) + ((project.reviews || 0) * 3) + 12)}</span>
                  </span>
                </div>
                
                <span className="text-[10px] text-[#6B7280]/70 font-normal font-sans">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Active'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}