"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Heart, MessageSquare, ExternalLink, Edit3, GitBranch, 
  Globe, Mail, CheckCircle2, Save, X, Eye, Star, MapPin, 
  Calendar, Award, Bookmark, Layers, User, Activity, Zap, Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/authApis';
import { getMyProjects } from '@/services/getMyProjectsApi';

export default function MyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const { user, fetchUser } = useAuth();
  const [myProjects, setMyProjects] = useState([]);

  const getMyProject = async() => {
    try {
      const res = await getMyProjects();
      setMyProjects(res?.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    skillsString: '',
    profileImage: '',
    githubUrl: '',
    portfolioUrl: ''
  });

  useEffect(() => {
    getMyProject();
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        skillsString: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        profileImage: user.profileImage || '',
        githubUrl: user.githubUrl || user.GitBranchUrl || '', 
        portfolioUrl: user.portfolioUrl || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    projectsCount: myProjects?.length || user?.projects?.length || 0,
    reviews: 48,
    likes: myProjects.reduce((acc, curr) => acc + (curr.likesCount || 0), 0) || 342,
    views: '2.8k'
  };

  const rightSidebarData = {
    location: "Mumbai, India",
    joinedDate: "Joined March 2026",
    languages: [
      { name: "TypeScript / JavaScript", value: 55, color: "#3178c6" },
      { name: "React / Next.js", value: 30, color: "#0070f3" },
      { name: "Node.js & Express", value: 10, color: "#339933" },
      { name: "Other stacks", value: 5, color: "#6B7280" }
    ],
    achievements: [
      { label: "Elite Engineer", desc: "Top 5% contributors this month", icon: Award, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
      { label: "Review Catalyst", desc: "45+ clean code reviews approved", icon: Star, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
      { label: "Community Pick", desc: "Highly liked feature blueprints", icon: Heart, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
      { label: "Velocity Master", desc: "Rapid feature shipping patterns", icon: Zap, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" }
    ]
  };

  const placeholderBookmarks = [
    { title: "Next.js 15 Deep Dive & Architecture", category: "Framework", author: "Vercel Core" },
    { title: "Framer Motion Layout ID Orchestration", category: "UI/UX", author: "Matt Perry" }
  ];

  const placeholderActivity = [
    { type: "commit", text: "Pushed 4 main branch updates to Production Ecosystem", time: "2 hours ago" },
    { type: "review", text: "Approved pull request #231 architecture standard changes", time: "1 day ago" }
  ];

  if (loading || !user) {
    return (
      <div className="p-4 md:p-8 bg-[#FAFBFC] min-h-screen space-y-8 animate-pulse max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 h-64 shadow-xs"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 bg-white border border-slate-200/60 rounded-2xl w-2/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-72 bg-white border border-slate-200/60 rounded-3xl"></div>
              ))}
            </div>
          </div>
          <div className="h-96 bg-white border border-slate-200/60 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async(e) => {
    e.preventDefault();
    const parsedSkills = formData.skillsString
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill !== '');

    const { skillsString, ...restOfData } = formData;
    const finalFormData = { ...restOfData, skills: parsedSkills };

    Object.keys(finalFormData).forEach((key) => {
      if (finalFormData[key] === undefined) delete finalFormData[key];
    });

    const res = await updateProfile(finalFormData);
    if(res?.success){
      setIsEditing(false);
      fetchUser();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      skillsString: Array.isArray(user.skills) ? user.skills.join(', ') : '',
      profileImage: user.profileImage || '',
      githubUrl: user.githubUrl || user.GitBranchUrl || '',
      portfolioUrl: user.portfolioUrl || ''
    });
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 md:p-8 bg-[#FAFBFC] min-h-screen text-slate-900 max-w-7xl mx-auto space-y-8 antialiased relative selection:bg-blue-600/10 selection:text-blue-600"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-70 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/5 to-indigo-600/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ================= PREMIUM MODERN HEADER HERO ================= */}
      <div className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden z-10 backdrop-blur-md">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div 
              key="view"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10"
            >
              <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500" />
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white relative z-10 shadow-md">
                    <img 
                      src={user.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"} 
                      alt={user.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        {user.name}
                        <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600/10 shrink-0" />
                      </h1>
                      <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 font-mono px-2 py-0.5 rounded-md shadow-2xs">
                        @{user.username}
                      </span>
                      <span className="text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Senior Developer
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 mt-3 font-medium">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}</span>
                      <a href={user.githubUrl || user.GitBranchUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group">
                        <GitBranch className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" /> GitHub
                      </a>
                      <a href={user.portfolioUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group">
                        <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" /> System Ecosystem
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
                    {user.bio || "No system logs injected yet. Hit Edit Profile to craft a specialized bio outline."}
                  </p>

                  <div className="pt-1">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                      {user.skills?.map((skill, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-white text-slate-800 border border-slate-200 px-2.5 py-1 rounded-xl font-medium shadow-3xs hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* STATS AREA */}
              <div className="flex flex-col gap-4 h-full justify-between lg:border-l lg:border-slate-100 lg:pl-8">
                <div className="grid grid-cols-2 gap-3 w-full">
                  {[
                    { label: "Repositories", val: stats.projectsCount },
                    { label: "Code Reviews", val: stats.reviews },
                    { label: "Appreciations", val: stats.likes },
                    { label: "Profile Views", val: stats.views }
                  ].map((st, idx) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-3.5 hover:bg-white hover:border-blue-200 transition-all duration-300 group shadow-3xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{st.label}</span>
                      <span className="text-xl font-extrabold mt-1 block text-slate-900 group-hover:text-blue-600 transition-colors">{st.val}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full pt-1">
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsEditing(true)}
                    className="w-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-2xs text-xs tracking-wider transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" /> 
                    <span>MODIFY DESIGN CONFIG</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ================= EDIT CONFIG FORM ================= */
            <motion.form 
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSave}
              className="space-y-6 relative z-10"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4 shrink-0 bg-slate-50/80 border border-slate-200/80 p-5 rounded-2xl">
                  <div className="relative">
                    <img 
                      src={formData.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10"
                    />
                  </div>
                  <div className="w-full max-w-xs space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avatar Asset CDN URL</label>
                    <input 
                      type="text" 
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleInputChange}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 bg-white transition-all font-mono"
                      placeholder="https://domain.com/avatar.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Public Core Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unique Node Handle</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-sm text-slate-400 font-mono">@</span>
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full text-sm pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 bg-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bio Overview Outline</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 bg-white resize-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Technology Badges (Comma Separated)</label>
                    <input 
                      type="text" 
                      name="skillsString"
                      value={formData.skillsString}
                      onChange={handleInputChange}
                      placeholder="React, Next.js, TypeScript, TailwindCSS"
                      className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">GitHub Branch Target Link</label>
                    <input 
                      type="url" 
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 bg-white transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live System Core Link</label>
                    <input 
                      type="url" 
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 bg-white transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-1.5 text-xs tracking-wider transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>ABORT CHANGES</span>
                </button>
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-1.5 text-xs tracking-wider shadow-md hover:shadow-blue-600/10 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>COMMIT CHANGES</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* ================= TABS DESIGN ================= */}
      <div className="border-b border-slate-200 flex items-center space-x-6 z-10 relative overflow-x-auto scrollbar-none">
        {[
          { id: 'projects', label: 'Engineering Showcase', icon: Layers },
          { id: 'about', label: 'Systems Overview', icon: User },
          { id: 'activity', label: 'Telemetry Log', icon: Activity },
          { id: 'bookmarks', label: 'Saved Repos', icon: Bookmark }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3.5 text-xs uppercase tracking-wider font-bold border-b-2 transition-all relative whitespace-nowrap outline-none ${
                isActive 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'projects' && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ml-1 font-bold ${isActive ? 'bg-blue-600/10 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  {myProjects.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= MAIN SPLIT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        
        {/* LEFT COMPONENT */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-sm uppercase tracking-wider font-extrabold text-slate-400">Production Deployments</h2>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1.5 shadow-sm hover:shadow-blue-600/10 text-xs tracking-wider transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> <span>INITIALIZE REPO</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {myProjects.map((project, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      onClick={() => router.push(`/projects/${project._id || project.id}`)}
                      className="bg-white border border-slate-200/80 rounded-3xl flex flex-col justify-between overflow-hidden group shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:border-blue-600/30 hover:shadow-[0_12px_30px_rgba(37,99,235,0.04)] cursor-pointer transition-all duration-300"
                    >
                      {/* BROWSER WORKSPACE HEADER MOCKUP */}
                      <div className="h-40 bg-slate-50 border-b border-slate-100 relative flex flex-col overflow-hidden select-none">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-100 shrink-0 z-20">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-rose-400 transition-colors" />
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-amber-400 transition-colors" />
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-emerald-400 transition-colors" />
                          </div>
                          <div className="bg-slate-50 rounded-md text-[10px] px-3 py-0.5 border border-slate-200/70 w-40 text-center text-slate-400 font-mono truncate">
                            localhost:3000
                          </div>
                          <Bookmark className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                        </div>

                        {/* HOVER INTERFACE FOR CONTENT IMAGES */}
                        <div className="p-4 flex-1 flex flex-col justify-center items-center relative overflow-hidden bg-slate-50/50">
                          {project.thumbnail ? (
                            <div className="absolute inset-0 bg-white transition-transform duration-700 ease-out group-hover:scale-105">
                              <img className='w-full h-full object-cover' src={project.thumbnail} alt={project.title} />
                            </div>
                          ) : (
                            <div className="font-mono text-[10px] text-slate-400 bg-white border border-slate-200/60 p-3.5 rounded-xl shadow-3xs max-w-[85%] truncate transition-all duration-300 group-hover:border-blue-200 group-hover:text-blue-600">
                              {"⚙️ system_core.init({ edge: true });"}
                            </div>
                          )}

                          {/* Simplified clean minimal solid text overlay */}
                          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                            <motion.span 
                              initial={{ scale: 0.95 }}
                              whileHover={{ scale: 1.05 }}
                              className="bg-white text-slate-900 px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest shadow-md border border-white/20"
                            >
                              OPEN
                            </motion.span>
                          </div>
                        </div>
                      </div>

                      {/* WORKSPACE META DETAILS */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                        <div className="space-y-1.5">
                          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight">
                            {project.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                            {project.description || "No customized configuration layout variables description provided for this microservice stack."}
                          </p>
                        </div>

                        <div className="space-y-3.5 pt-1">
                          <div className="flex flex-wrap gap-1">
                            {(project.techStack || ["Next.js", "TailwindCSS"]).map((t, idx) => (
                              <span key={idx} className="text-[10px] font-bold bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md text-slate-600 font-mono">
                                {t}
                              </span>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-semibold">
                            <div className="flex space-x-3">
                              <span className="flex items-center space-x-1 hover:text-rose-600 cursor-pointer transition-colors group/heart">
                                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/5 group-hover/heart:fill-rose-500 transition-all" /> 
                                <span className="text-slate-500">{project.likesCount || 0}</span>
                              </span>
                              <span className="flex items-center space-x-1 text-slate-500">
                                <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> 
                                <span>12</span>
                              </span>
                              <span className="flex items-center space-x-1 text-slate-400">
                                <Eye className="w-3.5 h-3.5" /> 
                                <span>140</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2.5 text-slate-400" onClick={(e) => e.stopPropagation()}>
                              <a href="#" className="hover:text-blue-600 transition-colors"><GitBranch className="w-3.5 h-3.5" /></a>
                              <a href="#" className="hover:text-blue-600 transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SYSTEMS OVERVIEW TAB */}
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Overview Logs</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {user.bio || "No specific detailed structural architecture logged."}
                </p>
                <div className="h-[1px] bg-slate-100 w-full my-2" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Primary System Core Paradigms</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">React Server Execution Trees, Complex Layout Orchestration, Fullstack Network Bridge Formulations, Vercel Middleware Edge Optimizations.</p>
              </motion.div>
            )}

            {/* TELEMETRY ACTIVITY TAB */}
            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live System Pipeline Telemetry</h3>
                <div className="space-y-4 relative pl-4 border-l border-slate-100 ml-2">
                  {placeholderActivity.map((act, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-50" />
                      <div>
                        <p className="text-slate-800 font-semibold">{act.text}</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SAVED REPOS BOOKMARKS TAB */}
            {activeTab === 'bookmarks' && (
              <motion.div
                key="bookmarks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curated System Blueprints</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {placeholderBookmarks.map((book, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200/70 rounded-2xl flex justify-between items-start hover:bg-white hover:border-blue-200 transition-all shadow-3xs">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold bg-slate-200/60 px-2 py-0.5 rounded-md text-slate-500 font-mono tracking-wide">{book.category}</span>
                        <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 pt-1 tracking-tight">{book.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{book.author}</p>
                      </div>
                      <Bookmark className="w-4 h-4 text-blue-600 fill-blue-600/10 shrink-0" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <div className="space-y-6">
          {/* META INFO */}
          <div className="bg-white border border-slate-200/70 rounded-3xl p-5 space-y-4 shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Node Properties</h3>
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex items-center gap-3 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-800">{rightSidebarData.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={user.portfolioUrl || "#"} className="text-blue-600 hover:underline truncate">{user.portfolioUrl || "core-engine.dev"}</a>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-800">{rightSidebarData.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* LANGUAGES CHART MOCKUP */}
          <div className="bg-white border border-slate-200/70 rounded-3xl p-5 space-y-4 shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ecosystem Allocation</h3>
            <div className="flex items-center justify-between gap-5">
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path className="text-slate-100" strokeDasharray="100, 100" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-blue-600" strokeDasharray="55, 100" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                  <path className="text-cyan-500" strokeDasharray="30, 100" strokeDashoffset="-55" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                  <path className="text-emerald-500" strokeDasharray="10, 100" strokeDashoffset="-85" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-800 tracking-tight">Stack</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {rightSidebarData.languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] font-semibold">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                      <span className="text-slate-500 truncate">{lang.name}</span>
                    </div>
                    <span className="font-mono text-slate-800">{lang.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS CARDS */}
          <div className="bg-white border border-slate-200/70 rounded-3xl p-5 space-y-3 shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Achievements</h3>
            <div className="space-y-2.5">
              {rightSidebarData.achievements.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3.5 p-2 rounded-2xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 transition-colors duration-200">
                    <div className={`p-2 rounded-xl shrink-0 border ${item.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">{item.label}</h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}