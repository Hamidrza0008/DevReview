"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectDetails, updateProject } from "@/services/editProjectApi";
import {
  Type,
  FileText,
  Image as ImageIcon,
  GitBranch,
  Globe,
  Code2,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Save,
  Lock
} from "lucide-react";
import { ConfirmDialog } from "@/Components/shared";

export default function EditProject() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    githubUrl: "",
    liveUrl: "",
  });

  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const originalDataRef = useRef(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setHasError(false);
        const res = await getProjectDetails(id);

        if (res && res.success && res.project) {
          setIsAuthorized(true);
          const initialData = {
            title: res.project.title || "",
            description: res.project.description || "",
            thumbnail: res.project.thumbnail || "",
            githubUrl: res.project.githubUrl || "",
            liveUrl: res.project.liveUrl || "",
          };
          const initialTech = res.project.techStack || [];
          setFormData(initialData);
          setTechStack(initialTech);
          originalDataRef.current = { formData: initialData, techStack: initialTech };
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const hasUnsavedChanges = originalDataRef.current && (
    formData.title !== originalDataRef.current.formData.title ||
    formData.description !== originalDataRef.current.formData.description ||
    formData.thumbnail !== originalDataRef.current.formData.thumbnail ||
    formData.githubUrl !== originalDataRef.current.formData.githubUrl ||
    formData.liveUrl !== originalDataRef.current.formData.liveUrl ||
    JSON.stringify(techStack) !== JSON.stringify(originalDataRef.current.techStack)
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addTechTag = () => {
    const trimmedValue = techInput.trim().replace(/,$/, "");

    if (trimmedValue && !techStack.includes(trimmedValue)) {
      setTechStack([...techStack, trimmedValue]);
      setTechInput("");
      setErrors((prev) => ({ ...prev, techStack: "" }));
    }
  };

  const handleTechKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTechTag();
    }
  };

  const removeTechTag = (indexToRemove) => {
    setTechStack(techStack.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.description.trim()) newErrors.description = "Project description is required";
    if (techStack.length === 0) newErrors.techStack = "Please add at least one technology";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    const updatedProjectPayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      thumbnail: formData.thumbnail.trim() || null,
      techStack: techStack,
      githubUrl: formData.githubUrl.trim() || null,
      liveUrl: formData.liveUrl.trim() || null,
    };

    try {
      const res = await updateProject(id, updatedProjectPayload);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Failed to update project:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex flex-col items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 text-accent animate-spin" />
          <p className="text-sm font-medium text-muted">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-page py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-surface border border-line rounded-xl shadow-sm p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-danger" />
          </div>
          <h2 className="text-xl font-bold text-ink">An unexpected error occurred</h2>
          <p className="text-sm text-muted">We could not fetch the project details. Please try again later.</p>
          <button
            onClick={() => router.back()}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-accent-ink bg-accent border border-transparent rounded-lg shadow-sm hover:brightness-110 transition-all focus:outline-none"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-page py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-surface border border-line rounded-xl shadow-sm p-6 sm:p-8 text-center space-y-5">
          <div className="mx-auto w-14 h-14 bg-accent/5 rounded-full flex items-center justify-center border border-accent/10">
            <Lock className="h-6 w-6 text-accent" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-ink tracking-tight">
              You are not authorized to edit this project
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Only the creator or owner has permissions to modify this project's details.
            </p>
          </div>
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-muted bg-surface border border-line rounded-lg hover:bg-page hover:text-ink transition-all focus:outline-none"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push(`/projects/${id}`)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-accent-ink bg-accent border border-transparent rounded-lg shadow-sm hover:brightness-110 transition-all focus:outline-none"
            >
              View Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen w-full bg-page flex items-center justify-center p-4 sm:p-6 md:overflow-hidden relative selection:bg-accent/20">

      <div className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[24px_24px] opacity-50 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Floating Notifications */}
      <AnimatePresence>
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-ok/10 border border-ok/30 rounded-xl flex items-center gap-3 shadow-lg shadow-ok/10"
          >
            <CheckCircle2 className="w-5 h-5 text-ok" />
            <span className="text-sm font-bold text-ok">Project updated successfully!</span>
          </motion.div>
        )}
        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-danger/10 border border-danger/30 rounded-xl flex items-center gap-3 shadow-lg shadow-danger/10"
          >
            <AlertCircle className="w-5 h-5 text-danger" />
            <span className="text-sm font-bold text-danger">Failed to update project. Please try again.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl md:max-h-[92vh] flex flex-col bg-surface border border-line rounded-3xl shadow-xl relative z-10 overflow-hidden"
      >
          <div className="px-4 sm:px-6 py-4 border-b border-line bg-surface flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (hasUnsavedChanges) {
                  setPendingNavigation(() => () => router.back());
                  setShowUnsavedConfirm(true);
                } else {
                  router.back();
                }
              }}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-2 border border-line text-muted hover:bg-line hover:text-ink transition-all focus:outline-none focus:ring-2 focus:ring-line shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
                <span>Projects</span>
                <span className="text-muted/50">/</span>
                <span className="truncate">Edit</span>
              </nav>
              <h1 className="text-lg font-extrabold text-ink tracking-tight truncate">Edit Project</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5 lg:h-full">

                <div className="flex flex-col gap-5 h-full justify-start">

                  <div>
                    <label htmlFor="title" className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                      Title <span className="text-danger">*</span>
                    </label>
                    <div className="relative group">
                      <Type className={`absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 transition-colors ${errors.title ? 'text-danger' : 'text-muted group-focus-within:text-accent'}`} />
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., DevReview Dashboard"
                        className={`w-full pl-9 pr-3 py-2 bg-page border rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${
                          errors.title ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                        }`}
                      />
                    </div>
                    {errors.title && (
                      <p className="mt-1 text-xs font-medium text-danger">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                      Description <span className="text-danger">*</span>
                    </label>
                    <div className="relative group">
                      <FileText className={`absolute top-2.5 left-3 w-4 h-4 transition-colors ${errors.description ? 'text-danger' : 'text-muted group-focus-within:text-accent'}`} />
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Explain features and problem solved..."
                        className={`w-full pl-9 pr-3 py-2 bg-page border rounded-lg text-sm resize-none transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${
                          errors.description ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                        }`}
                      />
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-xs font-medium text-danger">{errors.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <label htmlFor="techStack" className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                      Tech Stack <span className="text-danger">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <div className="relative group flex-grow">
                        <Code2 className={`absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 transition-colors ${errors.techStack ? 'text-danger' : 'text-muted group-focus-within:text-accent'}`} />
                        <input
                          type="text"
                          id="techStack"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={handleTechKeyDown}
                          placeholder="e.g., React, Node"
                          className={`w-full pl-9 pr-3 py-2 bg-page border rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${
                            errors.techStack ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addTechTag}
                        className="px-4 bg-accent-soft text-accent font-semibold text-xs border border-accent/20 rounded-lg hover:bg-accent/20 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    <div className={`flex-1 min-h-[60px] max-h-[100px] overflow-y-auto p-2 border rounded-lg bg-surface flex flex-wrap gap-1.5 content-start ${errors.techStack ? 'border-danger/30 bg-danger/5' : 'border-line'}`}>
                      {techStack.length === 0 ? (
                        <span className="text-xs text-muted w-full text-center mt-2">No tech added</span>
                      ) : (
                        techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 pl-2 pr-1 py-1 bg-surface-2 border border-line rounded text-[11px] font-bold text-ink"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTechTag(index)}
                              className="w-4 h-4 hover:bg-surface hover:text-danger rounded flex items-center justify-center transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    {errors.techStack && (
                      <p className="mt-1 text-xs font-medium text-danger">{errors.techStack}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-5 h-full justify-start">

                  <div>
                    <label htmlFor="githubUrl" className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">GitBranch Repo</label>
                    <div className="relative group">
                      <GitBranch className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-muted group-focus-within:text-ink transition-colors" />
                      <input
                        type="url"
                        id="githubUrl"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        placeholder="https://github.com/..."
                        className="w-full pl-9 pr-3 py-2 bg-page border border-line rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:border-ink focus:ring-2 focus:ring-line"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="liveUrl" className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">Live Demo</label>
                    <div className="relative group">
                      <Globe className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-muted group-focus-within:text-ok transition-colors" />
                      <input
                        type="url"
                        id="liveUrl"
                        name="liveUrl"
                        value={formData.liveUrl}
                        onChange={handleInputChange}
                        placeholder="https://yourproject.com"
                        className="w-full pl-9 pr-3 py-2 bg-page border border-line rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:border-ok focus:ring-2 focus:ring-ok/20"
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label htmlFor="thumbnail" className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">Thumbnail (Optional)</label>
                    <div className="relative group mb-3">
                      <ImageIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-muted group-focus-within:text-info transition-colors" />
                      <input
                        type="url"
                        id="thumbnail"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.png"
                        className="w-full pl-9 pr-3 py-2 bg-page border border-line rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:border-info focus:ring-2 focus:ring-info/20"
                      />
                    </div>

                    <div className="flex-1 bg-page border border-dashed border-line rounded-lg overflow-hidden flex items-center justify-center min-h-[100px]">
                      {formData.thumbnail ? (
                        <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <div className="text-center text-muted">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">No Preview</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-page border-t border-line flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (hasUnsavedChanges) {
                    setPendingNavigation(() => () => router.push(`/projects/${id}`));
                    setShowUnsavedConfirm(true);
                  } else {
                    router.push(`/projects/${id}`);
                  }
                }}
                className="px-5 py-2 text-sm font-semibold text-muted bg-surface border border-line rounded-lg hover:bg-page hover:text-ink transition-all"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-page bg-ink rounded-lg shadow hover:brightness-125 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 min-w-[140px] justify-center"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving</> : <>Save <Save className="w-4 h-4" /></>}
              </button>
            </div>

          </form>

      </motion.div>

      <ConfirmDialog
        isOpen={showUnsavedConfirm}
        onClose={() => { setShowUnsavedConfirm(false); setPendingNavigation(null); }}
        onConfirm={() => { setShowUnsavedConfirm(false); if (pendingNavigation) pendingNavigation(); }}
        title="Unsaved changes"
        message="You have unsaved changes that will be lost. Do you want to leave without saving?"
        confirmLabel="Leave without saving"
        cancelLabel="Stay"
        variant="warning"
      />
    </div>
  );
}