"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, MessageSquare, ExternalLink, Edit3, GitBranch, Globe, Mail, CheckCircle2, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/authApi';

export default function MyProfile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { user , fetchUser } = useAuth();

  // State object standard JSX dynamic values ke liye
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    skillsString: '', // Comma-separated string to array handling ke liye
    profileImage: '',
    githubUrl: '',
    portfolioUrl: ''
  });

  // Auth context data ready hote hi state sync karne ke liye
  useEffect(() => {
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
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !user) {
    return (
      <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 animate-pulse text-[#111827]">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 h-60 shadow-sm"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  // Controlled inputs change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async(e) => {
    e.preventDefault();

    // Comma-separated string ko array me clean format me split karna
    const parsedSkills = formData.skillsString
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill !== '');

    // skillsString ko nikal kar final payload build karna
    const { skillsString, ...restOfData } = formData;

    const finalFormData = {
      ...restOfData,
      skills: parsedSkills
    };

    // Kuch undefined na jaye filters clear karne ke liye
    Object.keys(finalFormData).forEach((key) => {
      if (finalFormData[key] === undefined) {
        delete finalFormData[key];
      }
    });

    const res =await updateProfile(finalFormData);
    console.log(res)
    if(res.success){
      console.log('Final Form Data Saved Locally:', finalFormData);
      setIsEditing(false);
      fetchUser();
    }

  };

  const handleCancel = () => {
    // Auth context ki original values wapas restore karna
    setFormData({
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      skillsString: Array.isArray(user.skills) ? user.skills.join(', ') : '',
      profileImage: user.profileImage || "/default-avatar.png",
      githubUrl: user.githubUrl || user.GitBranchUrl || '',
      portfolioUrl: user.portfolioUrl || ''
    });
    setIsEditing(false);
  };

  const projects = [
    { title: "DevReview Dashboard", desc: "Premium SaaS dashboard engineered for internal engineering metrics.", likes: 42, reviews: 14, status: "Published", tech: ["Next.js", "Tailwind"] },
    { title: "E-Commerce Core", desc: "High-performance headless checkout core microservices ecosystem.", likes: 128, reviews: 34, status: "Published", tech: ["Go", "Redis"] },
    { title: "CodeSnippet CLI", desc: "Instantly save, sync, and share terminal configurations via CLI tool.", likes: 19, reviews: 3, status: "Draft", tech: ["TypeScript", "Node"] },
    { title: "AI Prompt Engine", desc: "Vector database wrapper for caching frequent LLM responses.", likes: 88, reviews: 21, status: "Published", tech: ["Python", "FastAPI"] }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen text-[#111827] max-w-6xl mx-auto space-y-6 antialiased"
    >
      
      {/* ================= PREMIUM MODERN PROFILE SECTION ================= */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#2563EB]/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            /* ================= VIEW MODE ================= */
            <motion.div 
              key="view-mode"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left w-full">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                  <img 
                    src={user.profileImage || "/default-avatar.png"} 
                    alt={user.name} 
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[#FFFFFF] relative z-10 shadow-md"
                  />
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827] flex items-center gap-2">
                        {user.name}
                        {user.isVerified && (
                          <CheckCircle2 className="w-5 h-5 text-[#22C55E] fill-[#22C55E]/10" />
                        )}
                      </h1>
                      <span className="text-xs bg-[#F1F5F9] border border-[#E2E8F0] text-[#6B7280] font-mono px-2 py-0.5 rounded-md">
                        @{user.username}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#6B7280] mt-2 font-medium">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#2563EB]" /> {user.email}</span>
                      <a href={user.githubUrl || user.GitBranchUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors group">
                        <GitBranch className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB]" /> GitHub
                      </a>
                      <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors group">
                        <Globe className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB]" /> Website
                      </a>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-[#475569] font-normal leading-relaxed max-w-3xl">
                    {user.bio}
                  </p>

                  <div className="pt-2">
                    <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                      {user.skills?.map((skill, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/15 font-semibold px-2.5 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex justify-center md:justify-end shrink-0">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: '#F1F5F9' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="w-full md:w-auto border border-[#E2E8F0] text-[#111827] bg-[#FFFFFF] px-4 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-sm text-xs tracking-wide transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#2563EB]" /> 
                  <span>EDIT PROFILE</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ================= EDIT MODE ================= */
            <motion.form 
              key="edit-mode"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSave}
              className="space-y-6 relative z-10"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Image Dynamic Preview input */}
                <div className="flex flex-col items-center space-y-3 shrink-0">
                  <img 
                    src={formData.profileImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80'} 
                    alt="Preview avatar" 
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[#2563EB]/20 shadow-md"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80';
                    }}
                  />
                  <div className="w-full max-w-xs">
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Profile Image URL</label>
                    <input 
                      type="text" 
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleInputChange}
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-[#F8FAFC]"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>

                {/* Form fields inputs grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm px-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-[#94A3B8] font-mono">@</span>
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full text-sm pl-7 pr-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full text-sm px-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-y"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Skills (comma separated)</label>
                    <input 
                      type="text" 
                      name="skillsString"
                      value={formData.skillsString}
                      onChange={handleInputChange}
                      placeholder="React, Next.js, Node.js, TypeScript"
                      className="w-full text-sm px-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">GitHub URL</label>
                    <input 
                      type="url" 
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Portfolio URL</label>
                    <input 
                      type="url" 
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>
                </div>

              </div>

              {/* Action Operations Buttons */}
              <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-4 border-t border-[#F1F5F9]">
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto border border-[#E2E8F0] text-[#475569] bg-[#FFFFFF] hover:bg-[#F8FAFC] px-4 py-2 rounded-xl font-medium flex items-center justify-center space-x-1.5 text-xs transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>CANCEL</span>
                </button>
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center space-x-1.5 text-xs shadow-md transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE CHANGES</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* ================= COMPACT & CLEAN PROJECTS SECTION ================= */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
              Showcase Projects 
              <span className="text-xs bg-[#E2E8F0] text-[#6B7280] px-2 py-0.5 rounded-full font-mono font-normal">
                {projects.length}
              </span>
            </h2>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: '#1D4ED8' }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#2563EB] text-white px-3.5 py-2 rounded-xl font-medium flex items-center space-x-1.5 shadow-md text-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> <span>Add New</span>
          </motion.button>
        </div>

        {/* COMPACT THREE-COL GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, borderColor: '#2563EB', boxShadow: '0 10px 25px -15px rgba(37,99,235,0.2)' }}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between transition-all shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-[#111827] line-clamp-1 hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1">
                    {project.title}
                  </h3>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border tracking-wider shrink-0 uppercase ${
                    project.status === 'Published' 
                      ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' 
                      : 'bg-[#F1F5F9] text-[#6B7280] border-[#E2E8F0]'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-[#F8FAFC] border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[#475569]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] mt-3 flex justify-between items-center text-[11px] text-[#6B7280]">
                <div className="flex space-x-3">
                  <span className="flex items-center space-x-1 font-medium hover:text-rose-600 transition-colors cursor-pointer">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10" /> 
                    <span>{project.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1 font-medium">
                    <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" /> 
                    <span>{project.reviews}</span>
                  </span>
                </div>
                <a href="#" className="hover:text-[#2563EB] transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#6B7280] hover:text-[#2563EB] cursor-pointer transition-colors" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}