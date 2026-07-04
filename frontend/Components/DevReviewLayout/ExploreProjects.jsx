"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  Flame, 
  Code, 
  Heart, 
  MessageSquare, 
  ExternalLink, 
  GitBranch, 
  ArrowUpRight, 
  Layers, 
  Users, 
  Star, 
  Bookmark, 
  CheckCircle, 
  Eye 
} from 'lucide-react';
import { getExploreProjects } from '@/services/getExploreProjectsApi';
import { useRouter } from 'next/navigation';

export default function ExploreProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
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

    // स्क्रॉल डिटेक्शन लॉजिक जो बिना CSS नियमों पर निर्भर रहे सर्च बार को स्टिकी बनाएगा
    const handleScroll = () => {
      if (window.scrollY > 420) {
        setIsPinned(true);
      } else {
        setIsPinned(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Premium Skeleton Loader Redesign
  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC] overflow-hidden p-8 lg:p-12 space-y-12 animate-pulse">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 pt-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-14 bg-gray-200 rounded-2xl w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded-lg w-5/6"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block h-[320px] bg-white/60 border border-gray-100 rounded-2xl shadow-sm"></div>
        </div>

        <div className="h-16 bg-white border border-gray-100 rounded-2xl w-full max-w-4xl shadow-sm"></div>

        <div className="space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[24px] h-[450px] p-4 space-y-4 shadow-sm">
                <div className="h-48 bg-gray-200 rounded-2xl w-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="relative min-h-screen bg-[#F8FAFC] text-[#111827] font-sans selection:bg-blue-500 selection:text-white pb-24"
    >
      {/* Premium Background Artifacts */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-200/30 to-indigo-100/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[400px] left-[-200px] w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#2563EB 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Dynamic Smart Pinned Top Navigation Search Bar */}
      <AnimatePresence>
        {isPinned && (
          <motion.div 
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] z-50 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)] px-6"
          >
            <div className="max-w-4xl mx-auto w-full flex items-center bg-gray-50 border border-[#E5E7EB] rounded-2xl p-1.5 shadow-inner">
              <div className="pl-3 pr-2 text-[#6B7280]">
                <Search className="w-4 h-4 stroke-[2]" />
              </div>
              <input 
                type="text" 
                placeholder="Search projects, frameworks, tech stack..." 
                className="flex-1 bg-transparent pl-2 pr-4 py-2 focus:outline-none text-sm text-[#111827] placeholder-[#6B7280]"
              />
              <button className="bg-white border border-[#E5E7EB] px-3 py-2 rounded-xl text-xs font-semibold text-[#111827] flex items-center space-x-1.5 shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Filters</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 relative z-10">
        
        {/* ================= SECTION 1 — HERO ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4 mb-16">
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-100/60 mb-4 shadow-sm">
                <Layers className="w-3.5 h-3.5" /> Built for Creators
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] leading-[1.1]">
                Explore Open Source <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-indigo-500 bg-clip-text text-transparent">
                  Projects
                </span>
              </h1>
            </motion.div>

            <p className="text-[#6B7280] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Discover production-ready projects built by developers around the world. Level up your stack with clean architecture.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[
                { label: 'Projects', value: '12.4k+', icon: Layers },
                { label: 'Developers', value: '8.2k', icon: Users },
                { label: 'Reviews', value: '45.1k', icon: MessageSquare },
                { label: 'Avg Rating', value: '4.92', icon: Star, isRating: true },
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0,02)] backdrop-blur-md hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-[#6B7280]">{stat.label}</span>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.isRating ? 'text-amber-500 fill-amber-500' : 'text-[#6B7280]'}`} />
                  </div>
                  <div className="text-lg font-bold tracking-tight text-[#111827]">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Floating Dashboard Illustration */}
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center">
            <div className="absolute w-[380px] h-[380px] bg-gradient-to-tr from-blue-400/20 to-indigo-300/10 rounded-full blur-3xl -z-10" />
            
            <motion.div 
              initial={{ opacity: 0, x: 30, rotate: 1 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full max-w-[440px] bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_25px_60px_-15px_rgba(37,99,235,0.08)] p-5 space-y-4 backdrop-blur-md relative transform hover:rotate-0 transition-transform duration-500"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="h-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-md px-6 text-[9px] text-[#6B7280] flex items-center justify-center font-mono">
                  vercel.app/analytics
                </div>
                <div className="w-4" />
              </div>

              <div className="space-y-3">
                <div className="h-32 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-dashed border-[#E5E7EB] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <div className="w-full px-4 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-5 bg-[#22C55E]/10 text-[#22C55E] text-[9px] font-bold px-1.5 py-0.5 rounded">+24.5%</div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded-md w-1/2" />
                    <div className="flex items-end space-x-1 h-8 pt-2">
                      {[40, 65, 35, 80, 55, 95, 70, 85].map((h, idx) => (
                        <div key={idx} className="bg-blue-500/80 rounded-t-sm flex-1 transition-all" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border border-[#E5E7EB] rounded-xl space-y-1.5">
                    <div className="h-2 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                  <div className="p-2 border border-[#E5E7EB] rounded-xl space-y-1.5">
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= SECTION 2 — BASE SEARCH BAR ================= */}
        <section className="max-w-4xl mx-auto w-full mb-10">
          <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_-8px_rgba(37,99,235,0.06)] hover:border-blue-300/60 transition-all duration-300 flex items-center">
            <div className="pl-4 pr-2 text-[#6B7280]">
              <Search className="w-5 h-5 stroke-[1.8]" />
            </div>
            <input 
              type="text" 
              placeholder="Search projects, frameworks, tech stack..." 
              className="flex-1 bg-transparent pl-2 pr-4 py-3 focus:outline-none text-base text-[#111827] placeholder-[#6B7280] font-normal"
            />
            <button className="bg-white border border-[#E5E7EB] px-4 py-2.5 rounded-xl text-sm font-semibold text-[#111827] flex items-center space-x-2 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-98">
              <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </section>

        {/* ================= SECTION 3 — CATEGORY FILTERS ================= */}
        <section className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-16">
          {["All", "Trending", "React", "Next.js", "Node", "TypeScript", "MERN", "Tailwind"].map((chip, idx) => (
            <span 
              key={idx} 
              className={`cursor-pointer text-xs px-4 py-2 rounded-full font-semibold tracking-wide transition-all duration-200 select-none active:scale-95 ${
                idx === 0 
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/10 hover:bg-blue-700' 
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#3B82F6] hover:text-[#2563EB] hover:shadow-sm'
              }`}
            >
              {chip}
            </span>
          ))}
        </section>

        {/* ================= SECTION 4 — PROJECT CARDS ================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
            <h3 className="font-bold text-xl flex items-center text-[#111827] tracking-tight">
              <Flame className="w-5 h-5 text-orange-500 mr-2 fill-orange-500 animate-pulse" /> 
              Trending Showcases
            </h3>
            <span className="text-xs text-[#6B7280] font-medium">{projects.length} results found</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[24px] border border-dashed border-[#E5E7EB] shadow-sm max-w-xl mx-auto">
              <Code className="w-12 h-12 text-[#6B7280]/60 mx-auto mb-3 stroke-[1.5]" />
              <p className="text-[#111827] font-bold text-base">No open source blueprints found</p>
              <p className="text-[#6B7280] text-xs mt-1">Check back later or change your search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                const badgeTypes = ['Trending', 'New', 'Staff Pick'];
                const cardBadge = badgeTypes[index % badgeTypes.length];

                return (
                  <motion.div 
                    key={project._id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group bg-white border border-[#E5E7EB] rounded-[24px] flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)] hover:border-[#3B82F6]/40 transition-all duration-300 transform hover:-translate-y-1.5 backdrop-blur-md"
                  >
                    <div>
                      {/* Browser Window Wrapper */}
                      <div 
                        onClick={() => router.push(`/projects/${project._id}`)}
                        className="relative h-48 w-full overflow-hidden cursor-pointer border-b border-[#E5E7EB] bg-slate-50 group/thumb"
                      >
                        {/* Browser Header Bar */}
                        <div className="absolute top-0 inset-x-0 h-7 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]/60 flex items-center justify-between px-3 z-30 transition-colors group-hover/thumb:bg-slate-50">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          </div>
                          <div className="text-[9px] font-mono text-[#6B7280]/80 tracking-tight max-w-[120px] truncate">
                            {project.title}.io
                          </div>
                          <Bookmark className="w-3 h-3 text-[#6B7280] opacity-60 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()} />
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 backdrop-blur-[2px] transition-all duration-300 ease-out z-20 flex items-center justify-center">
                          <span className="bg-white text-[#111827] px-4 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-xl transform translate-y-3 group-hover/thumb:translate-y-0 transition-all duration-300 ease-out">
                            View Blueprint <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-[#2563EB]" />
                          </span>
                        </div>

                        {/* Badges Overlay */}
                        <div className="absolute top-10 left-3 z-20 pointer-events-none">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide text-white ${
                            cardBadge === 'Trending' ? 'bg-orange-500' : cardBadge === 'New' ? 'bg-[#22C55E]' : 'bg-[#2563EB]'
                          }`}>
                            {cardBadge}
                          </span>
                        </div>

                        {project.thumbnail ? (
                          <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="w-full h-full object-cover pt-7 transition-transform duration-700 ease-out group-hover/thumb:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full pt-7 flex flex-col items-center justify-center bg-gradient-to-tr from-[#3B82F6]/10 via-[#2563EB]/5 to-indigo-500/10 text-[#2563EB] p-4 transition-transform duration-700 ease-out group-hover/thumb:scale-105">
                            <Code className="w-8 h-8 mb-1.5 stroke-[1.2] opacity-70" />
                            <span className="text-[10px] font-mono font-bold tracking-widest bg-[#2563EB]/10 text-[#2563EB] px-2.5 py-0.5 rounded-md uppercase">
                              {project.techStack?.[0] || 'SOURCE'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-5 space-y-4">
                        {project.owner && (
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              {project.owner.profileImage ? (
                                <img 
                                  src={project.owner.profileImage} 
                                  alt={project.owner.username} 
                                  className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB]"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold uppercase">{project.owner.username?.slice(0, 2)}</div>
                              )}
                              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                                <CheckCircle className="w-2.5 h-2.5 text-[#2563EB] fill-[#2563EB] stroke-white" />
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer">
                              @{project.owner.username}
                            </span>
                          </div>
                        )}

                        <div className="space-y-1">
                          <h4 className="font-bold text-lg text-[#111827] line-clamp-1 capitalize tracking-tight group-hover:text-[#2563EB] transition-colors">
                            {project.title}
                          </h4>
                          <p className="text-xs text-[#6B7280] line-clamp-2 min-h-[36px] leading-relaxed">
                            {project.description || "No description provided. Click above to view the repository architectures and implementation frameworks."}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.techStack?.map((tech, i) => (
                            <span 
                              key={i} 
                              className="text-[10px] font-semibold font-mono bg-slate-100 text-[#6B7280] px-2 py-0.5 rounded-md border border-[#E5E7EB]/60 shadow-xs capitalize transition-colors group-hover:bg-blue-50/50 group-hover:text-[#2563EB] group-hover:border-blue-100"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 pb-5 pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between bg-[#F8FAFC]/40">
                      <div className="flex items-center space-x-3 text-[#6B7280]">
                        <span className="flex items-center text-[11px] font-bold hover:text-red-500 cursor-pointer transition-colors group/like select-none">
                          <Heart className="w-3.5 h-3.5 mr-1 stroke-[2] group-hover/like:fill-red-500 group-hover/like:text-red-500 transition-all" /> 
                          {project.likes || 0}
                        </span>
                        <span className="flex items-center text-[11px] font-bold hover:text-[#2563EB] cursor-pointer transition-colors select-none">
                          <MessageSquare className="w-3.5 h-3.5 mr-1 stroke-[2]" /> 
                          {project.reviews || 0}
                        </span>
                        <span className="hidden sm:flex items-center text-[11px] font-bold opacity-80">
                          <Eye className="w-3.5 h-3.5 mr-1 stroke-[2]" /> 
                          {((project.likes || 0) * 3) + 12}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {project.GitBranchUrl && (
                          <a 
                            href={project.GitBranchUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-[#6B7280] hover:text-[#111827] bg-white border border-[#E5E7EB] rounded-xl hover:shadow-xs hover:border-gray-300 transition-all active:scale-95"
                          >
                            <GitBranch className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-[#2563EB] hover:text-white bg-blue-50 hover:bg-[#2563EB] px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-xs group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300 active:scale-95"
                          >
                            <span>Live</span> 
                            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </motion.div>
  );
}