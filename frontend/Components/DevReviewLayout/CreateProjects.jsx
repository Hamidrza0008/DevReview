"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createProject } from "@/services/createProjectApi";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Type,
  FileText,
  Image as ImageIcon,
  GitBranch,
  Globe,
  Code2,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

// Form ka initial data alag nikal liya taki baad me reset karne me asani ho
const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  GitBranchUrl: "",
  liveUrl: "",
};

export default function CreateProjects() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Success ya error message ko 5 second baad gayab karne ke liye
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  // Normal text inputs handle karne ke liye
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Agar user ne type karna shuru kar diya to error hata do
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Thumbnail image select hone par ye chalega
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optimize: Agar pehle se koi preview URL hai to use memory se uda do varna browser slow hoga
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  // Tech stack me naya tag add karne ka logic
  const addTechTag = () => {
    const trimmedValue = techInput.trim().replace(/,$/, "");
    if (trimmedValue && !techStack.includes(trimmedValue)) {
      setTechStack([...techStack, trimmedValue]);
      setTechInput("");
      setErrors((prev) => ({ ...prev, techStack: "" }));
    }
  };

  // Enter ya comma dabane par bhi tech tag add ho jaye
  const handleTechKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTechTag();
    }
  };

  const removeTechTag = (indexToRemove) => {
    setTechStack(techStack.filter((_, index) => index !== indexToRemove));
  };

  // Form submit karne se pehle check kar lete hain sab sahi bhara hai ya nahi
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.description.trim()) newErrors.description = "Required";
    if (techStack.length === 0) newErrors.techStack = "Add at least one";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    let imageUrl = null;

    // Agar user ne image dali hai to pehle use server pe upload karte hain
    if (thumbnail) {
      const uploadFormData = new FormData();
      uploadFormData.append("image", thumbnail);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: uploadFormData,
          credentials: "include",
        });
        
        const data = await response.json();
        imageUrl = data.imageUrl;
      } catch (err) {
        console.error("Image upload fat gaya:", err);
      }
    }

    // Final payload jo database me jayega
    const projectPayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      thumbnail: imageUrl || null,
      techStack: techStack,
      GitBranchUrl: formData.GitBranchUrl.trim() || null,
      liveUrl: formData.liveUrl.trim() || null,
    };

    try {
      await createProject(projectPayload);
      setSubmitStatus("success");
      
      // Publish hone ke baad sab kuch properly clear karna hai (Image bhi)
      setFormData(INITIAL_FORM_DATA);
      setTechStack([]);
      setThumbnail(null);
      setPreview(""); // Yahan pe preview image bhi khali ho jayegi
      
    } catch (error) {
      console.error("Project banate time error aagya:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Fixed 100vh container, no scroll
    <div className="h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative selection:bg-blue-100">

      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Floating Notifications (Absolute to avoid pushing layout) */}
      <AnimatePresence>
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 shadow-lg shadow-emerald-500/10"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-900">Project published successfully!</span>
          </motion.div>
        )}
        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 shadow-lg shadow-rose-500/10"
          >
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-bold text-rose-900">Failed to publish project.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-white border border-[#E5E7EB] rounded-3xl shadow-xl relative z-10 overflow-hidden"
      >

        {/* Compact Header with Go Back Button */}
        <div className="px-4 sm:px-6 py-4 border-b border-[#E5E7EB] bg-white flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Rocket className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-[#111827] tracking-tight">Publish Project</h1>
            <p className="text-xs text-[#6B7280]">Share your architecture and gather community feedback.</p>
          </div>
        </div>

        {/* 2-Column Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5 h-full">

              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-5 h-full justify-start">

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <Type className={`absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 transition-colors ${errors.title ? 'text-rose-400' : 'text-[#94A3B8] group-focus-within:text-[#2563EB]'}`} />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., E-Commerce Dashboard"
                      className={`w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border rounded-lg text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 ${errors.title ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-[#E5E7EB] focus:border-[#2563EB]"}`}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <FileText className={`absolute top-2.5 left-3 w-4 h-4 transition-colors ${errors.description ? 'text-rose-400' : 'text-[#94A3B8] group-focus-within:text-[#2563EB]'}`} />
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Explain features and problem solved..."
                      className={`w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border rounded-lg text-sm resize-none transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 ${errors.description ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-[#E5E7EB] focus:border-[#2563EB]"}`}
                    />
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-col flex-1">
                  <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                    Tech Stack <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <div className="relative group flex-grow">
                      <Code2 className={`absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 transition-colors ${errors.techStack ? 'text-rose-400' : 'text-[#94A3B8] group-focus-within:text-[#2563EB]'}`} />
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleTechKeyDown}
                        placeholder="e.g., React, Node"
                        className={`w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border rounded-lg text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 ${errors.techStack ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-[#E5E7EB] focus:border-[#2563EB]"}`}
                      />
                    </div>
                    <button type="button" onClick={addTechTag} className="px-4 bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">Add</button>
                  </div>

                  <div className={`flex-1 min-h-[60px] max-h-[100px] overflow-y-auto p-2 border rounded-lg bg-white flex flex-wrap gap-1.5 content-start ${errors.techStack ? 'border-rose-200 bg-rose-50/20' : 'border-[#E5E7EB]'}`}>
                    {techStack.length === 0 ? (
                      <span className="text-xs text-[#94A3B8] w-full text-center mt-2">No tech added</span>
                    ) : (
                      techStack.map((tech, index) => (
                        <span key={index} className="inline-flex items-center gap-1 pl-2 pr-1 py-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded text-[11px] font-bold text-[#334155]">
                          {tech}
                          <button type="button" onClick={() => removeTechTag(index)} className="w-4 h-4 hover:bg-white hover:text-rose-500 rounded flex items-center justify-center transition-colors">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-5 h-full justify-start">

                {/* Links */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">GitBranch Repo</label>
                  <div className="relative group">
                    <GitBranch className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#111827] transition-colors" />
                    <input
                      type="url"
                      name="GitBranchUrl"
                      value={formData.GitBranchUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/..."
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm transition-all focus:outline-none focus:bg-white focus:border-[#111827] focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">Live Demo</label>
                  <div className="relative group">
                    <Globe className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#22C55E] transition-colors" />
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      placeholder="https://yourproject.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm transition-all focus:outline-none focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                    />
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">Thumbnail (Optional)</label>
                  <div className="relative group mb-3">
                    <ImageIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-[#94A3B8] group-focus-within:text-purple-500 transition-colors" />
                    <input
                      type="file"
                      accept="image/*"
                      name="thumbnail"
                      onChange={handleThumbnailChange}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm transition-all focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Image Preview Box */}
                  <div className="flex-1 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-lg overflow-hidden flex items-center justify-center min-h-[100px]">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div className="text-center text-[#94A3B8]">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">No Preview</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E5E7EB] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                // Yaha bhi jab user Clear button dabaye to image clear honi chahiye
                setFormData(INITIAL_FORM_DATA);
                setTechStack([]); 
                setErrors({}); 
                setSubmitStatus(null);
                setThumbnail(null);
                setPreview("");
              }}
              className="px-5 py-2 text-sm font-semibold text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-slate-50 hover:text-[#111827] transition-all"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#111827] rounded-lg shadow hover:bg-[#1F2937] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 min-w-[140px] justify-center"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing</> : <>Publish <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
}