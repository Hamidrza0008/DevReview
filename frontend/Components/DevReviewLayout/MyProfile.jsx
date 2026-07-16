"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Heart, MessageSquare, ExternalLink, Edit3, GitBranch,
  Globe, Mail, CheckCircle2, Save, X, Eye, Star, MapPin,
  Calendar, Award, Bookmark, Layers, User, Activity, Zap, Sparkles,
  Loader2, AlertCircle, Code2, Briefcase
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/services/authApis";
import { getMyProjects } from "@/services/getMyProjectsApi";

export default function MyProfile() {
  const router = useRouter();
  const { user, fetchUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [myProjects, setMyProjects] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role: "",
    bio: "",
    skillsString: "",
    profileImage: "",
    githubUrl: "",
    portfolioUrl: ""
  });

  // fetch projects on mount
  const getMyProject = async () => {
    try {
      const res = await getMyProjects();
      setMyProjects(res?.projects || []);
      console.log(res)
    } catch (err) {
      console.error(err);
    }
  };

  // sync form data when user context updates
  useEffect(() => {
    getMyProject();
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        role: user.role || "",
        bio: user.bio || "",
        skillsString: Array.isArray(user.skills) ? user.skills.join(", ") : "",
        profileImage: user.profileImage || "",
        githubUrl: user.githubUrl || user.GitBranchUrl || "",
        portfolioUrl: user.portfolioUrl || ""
      });
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [user]);

  // artificial delay for premium skeleton demonstration
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // auto-dismiss toasts
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const stats = {
    projectsCount: myProjects?.length || user?.projects?.length || 0,
    reviews: myProjects.reduce((acc , curr) => acc + (curr.reviewsCount || 0) , 0) || 0,
    likes: myProjects.reduce((acc, curr) => acc + (curr.likesCount || 0), 0) || 0,
    views: "2.8k"
  };

  const rightSidebarData = {
    location: "Mumbai, India",
    joinedDate: "Joined March 2026",
    languages: [
      { name: "TypeScript / JavaScript", value: 55, color: "#2563EB" },
      { name: "React / Next.js", value: 30, color: "#3B82F6" },
      { name: "Node.js & Express", value: 10, color: "#22C55E" },
      { name: "Other stacks", value: 5, color: "#6B7280" }
    ],
    achievements: [
      { label: "Elite Engineer", desc: "Top 5% contributors this month", icon: Award, color: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20" },
      { label: "Review Catalyst", desc: "45+ clean code reviews approved", icon: Star, color: "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20" },
      { label: "Velocity Master", desc: "Rapid feature shipping patterns", icon: Zap, color: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20" }
    ]
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = formData.profileImage;

      // 1. Upload image if a new one was selected
      if (selectedImage) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedImage);

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: uploadFormData,
          credentials: "include",
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload profile image.");
        }

        const data = await uploadResponse.json();
        finalImageUrl = data.imageUrl;
      }
      
      // 2. Prepare remaining profile data
      const parsedSkills = formData.skillsString
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const { skillsString, profileImage, ...restOfData } = formData;
      const finalFormData = { 
        ...restOfData, 
        skills: parsedSkills,
        profileImage: finalImageUrl 
      };

      // Strip undefined values before sending payload
      Object.keys(finalFormData).forEach((key) => {
        if (finalFormData[key] === undefined) delete finalFormData[key];
      });

      // 3. Update profile
      const res = await updateProfile(finalFormData);
      if (res?.success) {
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview(null);
        fetchUser();
        showToast("success", "Profile updated successfully.");
      } else {
        showToast("error", "Failed to update profile. Please try again.");
      }
    } catch (err) {
      showToast("error", err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert changes if aborted
    setFormData({
      name: user.name || "",
      username: user.username || "",
      role: user.role || "",
      bio: user.bio || "",
      skillsString: Array.isArray(user.skills) ? user.skills.join(", ") : "",
      profileImage: user.profileImage || "",
      githubUrl: user.githubUrl || user.GitBranchUrl || "",
      portfolioUrl: user.portfolioUrl || ""
    });
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  if (loading || !user) {
    return (
      <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 max-w-7xl mx-auto">
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[32px] p-8 h-64 shadow-sm animate-pulse">
          <div className="flex gap-6 items-center h-full">
            <div className="w-28 h-28 rounded-full bg-[#F1F5F9] border-4 border-[#FFFFFF]" />
            <div className="space-y-4 flex-1">
              <div className="h-8 bg-[#F1F5F9] rounded-lg w-1/3" />
              <div className="h-4 bg-[#F1F5F9] rounded w-1/4" />
              <div className="h-4 bg-[#F1F5F9] rounded w-1/2" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl w-full max-w-md animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-[420px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] shadow-sm animate-pulse" />
              ))}
            </div>
          </div>
          <div className="h-[600px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen text-[#111827] max-w-7xl mx-auto space-y-8 antialiased relative selection:bg-[#2563EB]/20 selection:text-[#2563EB] pb-24"
    >
      {/* background textures */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* global toast notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg border flex items-center gap-2 text-sm font-semibold backdrop-blur-md ${
              toast.type === "success" 
                ? "bg-[#22C55E]/10 border-[#22C55E]/20 text-[#111827]" 
                : "bg-[#EF4444]/10 border-[#EF4444]/20 text-[#111827]"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#EF4444]" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* header profile card */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#2563EB]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10"
            >
              <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
                
                {/* avatar */}
                <div className="relative group shrink-0">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] rounded-full blur-md opacity-30 group-hover:opacity-50 transition duration-500" />
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#FFFFFF] relative z-10 shadow-lg bg-[#F1F5F9]">
                    <img
                      src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=F1F5F9&color=111827`}
                      alt={user.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>

                {/* bio & links (Enhanced UI) */}
                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111827] flex items-center gap-2">
                        {user.name}
                        <CheckCircle2 className="w-7 h-7 text-[#2563EB] drop-shadow-sm" />
                      </h1>
                      <span className="text-sm bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 font-bold px-3 py-1 rounded-full shadow-sm">
                        @{user.username}
                      </span>
                    </div>

                    {user.role && (
                      <div className="mt-3 flex justify-center sm:justify-start">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#2563EB] text-[#FFFFFF] text-sm font-bold shadow-md shadow-[#2563EB]/20">
                          {user.role}
                        </span>
                      </div>
                    )}

                    {/* Links - Now as sleek pills */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm mt-4">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] text-[#111827] rounded-lg border border-[#E5E7EB] font-semibold">
                        <Mail className="w-4 h-4 text-[#6B7280]" /> {user.email}
                      </span>
                      {user.githubUrl && (
                        <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#2563EB]/10 text-[#6B7280] hover:text-[#2563EB] rounded-lg border border-[#E5E7EB] hover:border-[#2563EB]/30 transition-all font-semibold group">
                          <GitBranch className="w-4 h-4 group-hover:scale-110 transition-transform" /> GitHub
                        </a>
                      )}
                      {user.portfolioUrl && (
                        <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#22C55E]/10 text-[#6B7280] hover:text-[#22C55E] rounded-lg border border-[#E5E7EB] hover:border-[#22C55E]/30 transition-all font-semibold group">
                          <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bio - Enhanced readability with subtle background */}
                  <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-2xl">
                    <p className="text-[15px] text-[#374151] font-medium leading-relaxed">
                      {user.bio || "Craft a professional summary here to stand out to recruiters and collaborators. Highlight your core competencies and career trajectory."}
                    </p>
                  </div>

                  {/* Skills map - Premium tags */}
                  <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                    {user.skills?.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-[#FFFFFF] text-[#2563EB] border border-[#3B82F6]/30 px-3 py-1.5 rounded-lg font-bold shadow-sm hover:bg-[#2563EB] hover:text-[#FFFFFF] transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#6B7280] italic px-1">No skills listed yet. Add them in settings.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* metrics overview */}
              <div className="flex flex-col gap-4 h-full justify-between lg:border-l lg:border-[#F1F5F9] lg:pl-10">
                <div className="grid grid-cols-2 gap-4 w-full">
                  {[
                    { label: "Repositories", val: stats.projectsCount },
                    { label: "Code Reviews", val: stats.reviews },
                    { label: "Likes", val: stats.likes },
                    { label: "Profile Views", val: stats.views }
                  ].map((st, idx) => (
                    <div key={idx} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-4 hover:border-[#2563EB]/30 transition-all duration-300 group shadow-sm text-center lg:text-left">
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">{st.label}</span>
                      <span className="text-2xl font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">{st.val}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="w-full border border-[#E5E7EB] text-[#111827] bg-[#FFFFFF] hover:bg-[#F8FAFC] hover:border-[#2563EB]/40 hover:text-[#2563EB] py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-sm text-sm transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* inline edit form */
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSave}
              className="space-y-6 relative z-10"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* visual settings */}
                <div className="flex flex-col items-center space-y-5 shrink-0 bg-[#F8FAFC] border border-[#E5E7EB] p-6 rounded-[24px]">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <img
                        src={imagePreview || formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'U')}&background=E5E7EB&color=111827`}
                        alt="Avatar Preview"
                        className="w-28 h-28 rounded-full object-cover border-4 border-[#FFFFFF] shadow-md bg-[#FFFFFF] group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-[#111827]/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-6 h-6 text-[#FFFFFF]" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#2563EB]/40 text-[#111827] px-4 py-2 rounded-xl font-semibold flex items-center space-x-1.5 shadow-sm text-xs transition-all"
                    >
                      <Plus className="w-4 h-4 text-[#2563EB]" /> <span>Upload Avatar</span>
                    </button>
                  </div>
                </div>

                {/* textual settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] bg-[#FFFFFF] transition-all shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6B7280] font-mono">@</span>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full text-sm pl-8 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] bg-[#FFFFFF] transition-all font-mono font-medium shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">Professional Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Describe your expertise, current role, or professional goals..."
                      className="w-full text-sm px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] bg-[#FFFFFF] resize-none transition-all shadow-sm placeholder:text-[#6B7280]/60 font-medium"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">Professional Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. Full Stack Developer, UI/UX Designer"
                      className="w-full text-sm px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] bg-[#FFFFFF] transition-all shadow-sm font-medium"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">Tech Stack (Comma Separated)</label>
                    <input
                      type="text"
                      name="skillsString"
                      value={formData.skillsString}
                      onChange={handleInputChange}
                      placeholder="React, Next.js, Node.js, System Design"
                      className="w-full text-sm px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] bg-[#FFFFFF] transition-all shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">GitHub URL</label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/..."
                      className="w-full text-sm px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] bg-[#FFFFFF] transition-all font-mono font-medium shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">Portfolio URL</label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full text-sm px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] bg-[#FFFFFF] transition-all font-mono font-medium shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* form controls */}
              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full sm:w-auto border border-[#E5E7EB] text-[#6B7280] bg-[#FFFFFF] hover:bg-[#F8FAFC] hover:text-[#111827] px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] px-8 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 text-sm shadow-sm shadow-[#2563EB]/30 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* primary navigation tabs */}
      <div className="border-b border-[#E5E7EB] flex items-center space-x-8 z-10 relative overflow-x-auto no-scrollbar pt-4">
        {[
          { id: "projects", label: "Projects", icon: Layers },
          { id: "about", label: "Resume / Bio", icon: Briefcase },
          { id: "bookmarks", label: "Bookmarks", icon: Bookmark }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all relative whitespace-nowrap outline-none ${
                isActive
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "projects" && (
                <span className={`text-xs px-2 py-0.5 rounded-md ml-1 font-bold ${isActive ? "bg-[#2563EB]/10 text-[#2563EB]" : "bg-[#F1F5F9] text-[#6B7280]"}`}>
                  {myProjects.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        
        {/* left column content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* projects tab view */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-[#111827]">Your Uploads</h2>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/projects/create')}
                    className="bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#2563EB]/40 hover:text-[#2563EB] text-[#111827] px-4 py-2 rounded-xl font-bold flex items-center space-x-1.5 shadow-sm text-sm transition-all"
                  >
                    <Plus className="w-4 h-4 text-[#2563EB]" /> <span>New Project</span>
                  </motion.button>
                </div>

                {myProjects.length === 0 ? (
                  /* premium empty state integrating resume/professional intent */
                  <div className="bg-[#FFFFFF] border border-[#E5E7EB] border-dashed rounded-[24px] p-12 text-center flex flex-col items-center justify-center shadow-sm">
                    <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mb-4">
                      <Code2 className="w-8 h-8 text-[#6B7280]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111827] mb-2">No projects uploaded yet</h3>
                    <p className="text-[#6B7280] max-w-md mx-auto text-sm leading-relaxed mb-6 font-medium">
                      Upload your first repository to build a compelling, ATS-friendly portfolio. Showcasing real code is the best way to stand out to recruiters and peers.
                    </p>
                    <button 
                      onClick={() => router.push('/projects/create')}
                      className="bg-[#2563EB] text-[#FFFFFF] px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#2563EB]/30 hover:bg-[#1D4ED8] transition-colors"
                    >
                      Upload First Project
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myProjects.map((project) => (
                      <motion.div
                        key={project._id || project.id}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onClick={() => router.push(`/projects/${project._id || project.id}`)}
                        className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/5 hover:border-[#2563EB]/30 cursor-pointer transition-all duration-300"
                      >
                        {/* thumbnail area */}
                        <div className="h-44 bg-[#F1F5F9] border-b border-[#E5E7EB] relative flex flex-col overflow-hidden">
                          {project.thumbnail ? (
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src={project.thumbnail} alt={project.title} />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[#6B7280]">
                              <Code2 className="w-8 h-8 opacity-40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-[#111827]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <span className="bg-[#FFFFFF] text-[#111827] px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                              View Details
                            </span>
                          </div>
                        </div>

                        {/* project details */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h3 className="font-bold text-lg text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-1 tracking-tight">
                              {project.title}
                            </h3>
                            <p className="text-sm text-[#6B7280] font-medium line-clamp-2 leading-relaxed">
                              {project.description || "No detailed description provided for this repository."}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-1.5">
                              {(project.techStack || ["React", "Node.js"]).slice(0, 3).map((t, idx) => (
                                <span key={idx} className="text-[10px] font-bold bg-[#F8FAFC] border border-[#E5E7EB] px-2.5 py-1 rounded-lg text-[#6B7280] font-mono">
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-[#F1F5F9] flex justify-between items-center text-xs font-bold text-[#6B7280]">
                              <div className="flex space-x-4">
                                <span className="flex items-center space-x-1.5">
                                  <Heart className="w-4 h-4 text-[#EF4444]" /> 
                                  <span>{project.likesCount || 0}</span>
                                </span>
                                <span className="flex items-center space-x-1.5">
                                  <MessageSquare className="w-4 h-4 text-[#2563EB]" /> 
                                  <span>{project.reviewsCount || 0}</span>
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                {project.githubUrl && <GitBranch className="w-4 h-4 hover:text-[#111827] transition-colors" />}
                                {project.liveUrl && <ExternalLink className="w-4 h-4 hover:text-[#111827] transition-colors" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* resume / bio tab view */}
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-8 space-y-6 shadow-sm"
              >
                <div className="flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
                  <Briefcase className="w-5 h-5 text-[#2563EB]" />
                  <h3 className="text-base font-bold text-[#111827]">{user.role ? user.role : "Professional Summary"}</h3>
                </div>
                <p className="text-[15px] text-[#374151] font-medium leading-relaxed whitespace-pre-wrap">
                  {user.bio || "Crafting an ATS-optimized professional summary will increase your visibility on the platform. Head to 'Edit Profile' to add your career background, current objectives, and core strengths."}
                </p>
                
                <div className="pt-4">
                  <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Core Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.length > 0 ? user.skills.map((skill, idx) => (
                       <span key={idx} className="bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] px-3 py-1.5 rounded-lg text-xs font-bold">{skill}</span>
                    )) : (
                      <span className="text-sm text-[#6B7280] italic">No competencies listed.</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* bookmarks tab view */}
            {activeTab === "bookmarks" && (
              <motion.div
                key="bookmarks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-8 text-center shadow-sm"
              >
                 <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="w-8 h-8 text-[#6B7280]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2">No Bookmarks Found</h3>
                  <p className="text-[#6B7280] font-medium max-w-sm mx-auto text-sm leading-relaxed mb-6">
                    Save top-tier projects while browsing to keep a curated list of architectural references and design inspiration.
                  </p>
                  <button 
                    onClick={() => router.push('/')}
                    className="bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#F1F5F9] hover:border-[#2563EB]/30 transition-colors shadow-sm"
                  >
                    Explore Projects
                  </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* right sidebar statistics */}
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Profile Details</h3>
            <div className="space-y-4 text-sm font-semibold">
              <div className="flex items-center gap-3 text-[#6B7280]">
                <MapPin className="w-4 h-4 shrink-0 text-[#2563EB]" />
                <span className="text-[#111827]">{rightSidebarData.location}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Globe className="w-4 h-4 shrink-0 text-[#2563EB]" />
                <a href={user.portfolioUrl || "#"} className="text-[#2563EB] hover:underline truncate">
                  {user.portfolioUrl ? new URL(user.portfolioUrl).hostname : "Add portfolio link"}
                </a>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Calendar className="w-4 h-4 shrink-0 text-[#2563EB]" />
                <span className="text-[#111827]">{rightSidebarData.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[24px] p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Platform Badges</h3>
            <div className="space-y-3">
              {rightSidebarData.achievements.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] hover:bg-[#F1F5F9] hover:border-[#E5E7EB] transition-colors cursor-default">
                    <div className={`p-2.5 rounded-xl shrink-0 border ${item.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#111827] tracking-tight">{item.label}</h4>
                      <p className="text-xs text-[#6B7280] font-medium truncate mt-0.5">{item.desc}</p>
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