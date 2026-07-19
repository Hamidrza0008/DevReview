"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, MessageSquare, ExternalLink, GitBranch, Layers, FolderGit2, Search, SlidersHorizontal, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMyProjects } from '@/services/getMyProjectsApi';
import { toggleLikes } from '@/services/toggleLikesApi';

// Fallback gradient filters using the design palette variations
const getFallbackGradient = (title) => {
  const gradients = [
    'from-accent/10 to-accent-2/20 text-accent',
    'from-ok/10 to-accent-2/10 text-accent-2',
    'from-accent/5 via-accent-2/10 to-ok/5 text-ink',
    'from-accent-2/10 to-ink/5 text-accent'
  ];
  const index = title ? title.length % gradients.length : 0;
  return gradients[index];
};

export default function MyProjects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  const handleLike = async (id) => {
    const res = await toggleLikes(id);
    getProjects();
  }

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
      <div className="p-6 md:p-8 bg-page min-h-screen space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 w-1/3">
            <div className="h-7 bg-line rounded-xl w-3/4"></div>
            <div className="h-3 bg-line rounded w-1/2"></div>
          </div>
          <div className="h-10 bg-line rounded-xl w-full sm:w-32"></div>
        </div>
        <div className="h-px bg-line w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-surface border border-line rounded-2xl shadow-2xs"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-8 bg-page min-h-screen text-ink max-w-7xl mx-auto space-y-6 antialiased relative selection:bg-accent/10 selection:text-accent"
    >
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-linear-to-br from-accent/5 to-accent-2/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-line z-10 relative">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            My Projects
          </h1>
          <p className="text-xs text-muted">Manage, deploy, and inspect your creative submissions metrics logs.</p>
        </div>
        <motion.button
          onClick={() => router.push("/projects/create")}
          whileHover={{ scale: 1.01, y: -0.5 }}
          whileTap={{ scale: 0.99 }}
          className="bg-accent hover:brightness-110 text-accent-ink px-4 py-2.5 rounded-xl font-semibold flex items-center space-x-1.5 shadow-2xs transition-all text-xs w-full sm:w-auto justify-center shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Project</span>
        </motion.button>
      </div>

      {/* NO PROJECTS STATE */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 border border-dashed border-line rounded-2xl bg-surface shadow-2xs max-w-xl mx-auto p-6 text-center space-y-3 z-10 relative"
        >
          <div className="w-12 h-12 bg-page border border-line rounded-xl flex items-center justify-center mx-auto text-muted">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-ink text-sm font-bold">No projects discovered</p>
            <p className="text-xs text-muted max-w-xs mx-auto">Start building your portfolio stack by submitting your first application deployment log.</p>
          </div>
          <button onClick={() => router.push("/projects/create")} className="mt-2 bg-accent text-accent-ink text-xs font-semibold px-4 py-2 rounded-xl">
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
              whileHover={{ y: -4 }}
              className="bg-surface border border-line hover:border-accent/40 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-2xs hover:shadow-[0_10px_20px_-12px_rgba(47,111,78,0.15)]"
            >
              <div>
                {/* COMPACT BROWSER SCREENSHOT BAR AREA */}
                <div className="h-32 w-full relative overflow-hidden bg-page border-b border-line flex flex-col justify-between select-none">
                  {/* Mock Browser Header Top Layer */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-surface border-b border-line/60 shrink-0 z-10">
                    <div className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-line group-hover:bg-like transition-colors" />
                      <span className="w-1.5 h-1.5 rounded-full bg-line group-hover:bg-star transition-colors" />
                      <span className="w-1.5 h-1.5 rounded-full bg-line group-hover:bg-ok transition-colors" />
                    </div>
                    <div onClick={() => router.push(`/projects/${project._id}`)} className="bg-page rounded border border-line text-[9px] px-3 py-0.2 text-muted font-mono w-24 text-center truncate cursor-pointer hover:border-accent/30">
                      inspect://app
                    </div>
                    <div className="w-4" />
                  </div>

                  {/* Body Canvas Wrapper */}
                  <div onClick={() => router.push(`/projects/${project._id}`)} className="flex-1 w-full relative overflow-hidden bg-page cursor-pointer flex items-center justify-center">
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
                      <div className={`w-full h-full bg-linear-to-br ${fallbackGradient} flex items-center justify-center p-3 absolute inset-0 group-hover:scale-105 transition-transform duration-500`}>
                        <span className="text-xl font-black tracking-wider uppercase opacity-20 font-sans">
                          {project.title ? project.title.slice(0, 2) : 'PR'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span className={`absolute bottom-2 right-2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${project.status === 'Published'
                      ? 'bg-ok/10 text-ok border-ok/20'
                      : 'bg-muted/10 text-muted border-line'
                    }`}>
                    {project.status || 'Active'}
                  </span>
                </div>

                {/* CARD BODY TEXT LAYOUT */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 onClick={() => router.push(`/projects/${project._id}`)} className="font-bold text-sm text-ink tracking-tight line-clamp-1 group-hover:text-accent cursor-pointer transition-colors flex items-center gap-1">
                        {project.title}
                      </h3>

                      {/* Anchor Links Blocks */}
                      <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-page rounded-md text-muted hover:text-ink border border-transparent hover:border-line transition-colors">
                            <GitBranch className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-page rounded-md text-muted hover:text-accent border border-transparent hover:border-line transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted line-clamp-2 leading-relaxed min-h-[32px] font-normal">
                      {project.description || "No dynamic log description provided for this repository."}
                    </p>
                  </div>

                  {/* TECH STACK CHIPS */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {project.techStack && project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-semibold bg-surface-2 text-muted border border-line px-2 py-0.5 rounded-md shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* MOCK CARD METRICS FOOTER */}
              <div className="px-4 py-2.5 border-t border-line bg-page/50 flex justify-between items-center text-[11px] text-muted font-medium rounded-b-2xl">
                <div className="flex space-x-3">
                  <span onClick={() => handleLike(project._id)} className="flex items-center text-[11px] font-bold hover:text-like cursor-pointer transition-colors group/like select-none">
                    <Heart
                      className={`w-3.5 h-3.5 mr-1 stroke-[2] transition-all ${project.isLiked
                        ? "fill-like text-like"
                        : "fill-none text-current group-hover/like:fill-like group-hover/like:text-like"
                        }`}
                    />
                    {project.likes.length || 0}
                  </span>
                  <span className="flex items-center space-x-1 cursor-pointer group/msg transition-colors">
                    <MessageSquare className="w-3.5 h-3.5 text-muted group-hover/msg:text-accent transition-colors" />
                    <span className="text-ink font-semibold">{project.reviewsCount || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-muted/60 select-none">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{Math.floor(((project.likes.length || 0) * 4) + ((project.reviewsCount || 0) * 3) + 12)}</span>
                  </span>
                </div>

                <span className="text-[10px] text-muted/70 font-normal font-sans">
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
