"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, MessageSquare, ExternalLink, GitBranch, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMyProjects } from '@/services/getMyProjectsApi';

// Fallback gradient filters using your design palette variations
const getFallbackGradient = (title) => {
  const gradients = [
    'from-[#2563EB]/20 to-[#3882F6]/40 text-[#2563EB]',
    'from-[#22C55E]/20 to-[#3882F6]/30 text-[#3882F6]',
    'from-[#2563EB]/10 via-[#3882F6]/20 to-[#22C55E]/10 text-[#111827]',
    'from-[#3882F6]/20 to-[#111827]/10 text-[#2563EB]'
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
        // console.log(res.projects)
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

  // COMPACT SKELETON LOADING UI
  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2 w-1/4">
            <div className="h-7 bg-[#E5E7EB] rounded w-3/4"></div>
            <div className="h-3 bg-[#E5E7EB] rounded w-1/2"></div>
          </div>
          <div className="h-9 bg-[#E5E7EB] rounded-lg w-28"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen text-[#111827]"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            My Projects
          </h1>
          <p className="text-xs md:text-sm text-[#6B7280] mt-0.5">Manage, deploy, and inspect your creative submissions.</p>
        </div>
        <motion.button 
          onClick={() => router.push("/createproject")}  
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="bg-[#2563EB] text-[#FFFFFF] px-4 py-2 rounded-lg font-medium flex items-center space-x-1.5 shadow-sm hover:bg-[#3882F6] transition-colors text-xs w-full sm:w-auto justify-center"
        >
          <Plus className="w-3.5 h-3.5" /> 
          <span>Upload Project</span>
        </motion.button>
      </div>

      {/* NO PROJECTS STATE */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-[#E5E7EB] rounded-xl bg-[#FFFFFF]">
          <Layers className="w-10 h-10 text-[#6B7280]/40 mb-2" />
          <p className="text-[#6B7280] text-sm font-medium">No projects found. Start by uploading one!</p>
        </div>
      )}

      {/* COMPACT PROJECTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {projects.map((project, i) => {
          const hasThumbnail = project.thumbnail && project.thumbnail.trim() !== "";
          const fallbackGradient = getFallbackGradient(project.title);

          return (
            <motion.div
              key={project._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(17, 24, 39, 0.05)' }}
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col justify-between group transition-all duration-200"
            >
              <div>
                {/* COMPACT IMAGE / GRADIENT BANNER */}
                <div                 onClick={() => router.push(`/projects/${project._id}`)}  className="h-32 w-full relative overflow-hidden bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  {hasThumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex flex-col items-center justify-center p-3 relative`}>
                      <span className="text-2xl font-black tracking-wider select-none uppercase opacity-40">
                        {project.title ? project.title.slice(0, 2) : 'PR'}
                      </span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                    project.status === 'Published' 
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' 
                      : 'bg-[#F8FAFC] text-[#6B7280] border-[#E5E7EB]'
                  }`}>
                    {project.status || 'Active'}
                  </span>
                </div>

                {/* CARD BODY */}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-base text-[#111827] tracking-tight line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-[#F8FAFC] rounded text-[#6B7280] hover:text-[#111827] transition-colors">
                          <GitBranch className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-[#F8FAFC] rounded text-[#6B7280] hover:text-[#2563EB] transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#6B7280] mb-3 line-clamp-2 leading-relaxed min-h-[32px]">
                    {project.description || "No description provided for this project."}
                  </p>

                  {/* TECH STACK - LIGHT GREEN BACKGROUND & BORDER APPLIED HERE */}
                  <div className="flex flex-wrap gap-1">
                    {project.techStack && project.techStack.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/25 px-2 py-0.5 rounded-md shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="px-4 py-2.5 border-t border-[#E5E7EB] bg-[#F8FAFC]/60 flex justify-between items-center text-[11px] text-[#6B7280] font-medium rounded-b-xl">
                <div className="flex space-x-3">
                  <span className="flex items-center space-x-1 cursor-pointer group/heart">
                    <Heart className="w-3.5 h-3.5 text-[#6B7280] group-hover/heart:text-rose-500 group-hover/heart:fill-rose-500 transition-colors" /> 
                    <span className="text-[#111827]">{project.likes || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1 cursor-pointer group/msg">
                    <MessageSquare className="w-3.5 h-3.5 text-[#6B7280] group-hover/msg:text-[#2563EB] transition-colors" /> 
                    <span className="text-[#111827]">{project.reviews || 0}</span>
                  </span>
                </div>
                
                <span className="text-[10px] text-[#6B7280]/70 font-normal">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}