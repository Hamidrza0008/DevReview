"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getProjectDetails, updateProject } from "@/services/editProjectApi";

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

  // Authorization, loader and error hook states
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setHasError(false);
        const res = await getProjectDetails(id);
        console.log("API Response Received:", res);

        if (res && res.success && res.project) {
          setIsAuthorized(true);
          setFormData({
            title: res.project.title || "",
            description: res.project.description || "",
            thumbnail: res.project.thumbnail || "",
            githubUrl: res.project.githubUrl || "",
            liveUrl: res.project.liveUrl || "",
          });
          setTechStack(res.project.techStack || []);
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

    console.log("=== SUBMITTED FORM DATA PAYLOAD ===");
    console.log(updatedProjectPayload);

    try {
      const res = await updateProject(id, updatedProjectPayload);
      console.log(res);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Failed to update project:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading Screen View
  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex flex-col items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium text-muted">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // 2. Unexpected Error View
  if (hasError) {
    return (
      <div className="min-h-screen bg-page py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-surface border border-line rounded-xl shadow-sm p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
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

  // 3. Beautiful Centered Unauthorized View
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-page py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-surface border border-line rounded-xl shadow-sm p-6 sm:p-8 text-center space-y-5">
          <div className="mx-auto w-14 h-14 bg-accent/5 rounded-full flex items-center justify-center border border-accent/10">
            <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
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

  // 4. Authorized Edit Form Component
  return (
    <div className="min-h-screen bg-page py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-ink tracking-tight sm:text-3xl">
            Edit Your Project
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Update your project details and keep your showcase fresh.
          </p>
        </div>

        {submitStatus === "success" && (
          <div className="mb-4 p-3.5 bg-ok/10 border border-ok/20 rounded-lg flex items-center gap-2.5 text-sm font-medium text-ok transition-all duration-300">
            <svg className="h-4 w-4 text-ok flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Project updated successfully! Check your browser console to see the updated payload.
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-4 p-3.5 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2.5 text-sm font-medium text-danger transition-all duration-300">
            <svg className="h-4 w-4 text-danger flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Failed to update project. Please try again.
          </div>
        )}

        <div className="bg-surface border border-line rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                    Project Title <span className="text-danger font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., DevReview Dashboard"
                    className={`w-full px-3 py-2 bg-surface border rounded-lg text-sm text-ink placeholder-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent ${
                      errors.title ? "border-danger focus:ring-danger/10 focus:border-danger" : "border-line"
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs font-medium text-danger">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="thumbnail" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                    Thumbnail Image URL
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      id="thumbnail"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.png"
                      className="w-full pl-9 pr-3 py-2 bg-surface border border-line rounded-lg text-sm text-ink placeholder-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="techStack" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                  Tech Stack <span className="text-danger font-normal">*</span>
                </label>
                <div className="space-y-2 flex-grow flex flex-col justify-between">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        id="techStack"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleTechKeyDown}
                        placeholder="Type and press Add or Enter"
                        className={`w-full px-3 py-2 bg-surface border rounded-lg text-sm text-ink placeholder-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent ${
                          errors.techStack ? "border-danger focus:ring-danger/10 focus:border-danger" : "border-line"
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addTechTag}
                      className="inline-flex items-center justify-center px-3.5 py-2 text-sm font-medium text-accent bg-accent/5 border border-accent/10 rounded-lg hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex-grow min-h-[84px] md:h-[84px] p-2 bg-page border border-line rounded-lg flex flex-wrap gap-1.5 content-start overflow-y-auto">
                    {techStack.length === 0 ? (
                      <span className="text-xs text-muted italic self-center mx-auto select-none">No technologies added yet.</span>
                    ) : (
                      techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded bg-surface text-accent border border-accent/10 shadow-sm text-xs font-medium"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechTag(index)}
                            className="w-3.5 h-3.5 inline-flex items-center justify-center rounded text-muted hover:bg-line hover:text-danger transition-colors focus:outline-none"
                          >
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l18 18" />
                            </svg>
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
                {errors.techStack && (
                  <p className="mt-1 text-xs font-medium text-danger">{errors.techStack}</p>
                )}
              </div>

            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                Description <span className="text-danger font-normal">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What problem does your project solve? Describe features and architecture..."
                className={`w-full px-3 py-2 bg-surface border rounded-lg text-sm text-ink placeholder-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent resize-y ${
                  errors.description ? "border-danger focus:ring-danger/10 focus:border-danger" : "border-line"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs font-medium text-danger">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="githubUrl" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                  GitHub Repository URL
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-muted" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                    className="w-full pl-9 pr-3 py-2 bg-surface border border-line rounded-lg text-sm text-ink placeholder-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="liveUrl" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                  Live Demo URL
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="liveUrl"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    placeholder="https://yourproject.com"
                    className="w-full pl-9 pr-3 py-2 bg-surface border border-line rounded-lg text-sm text-ink placeholder-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={() => console.log("Edit cancelled")}
                className="px-4 py-2 text-sm font-medium text-muted bg-surface border border-line rounded-lg hover:bg-page hover:text-ink transition-all focus:outline-none"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-accent-ink bg-accent border border-transparent rounded-lg shadow-sm hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent disabled:opacity-75 disabled:cursor-not-allowed min-w-[130px]"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4 text-accent-ink" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

          </form>
        </div>
        
      </div>
    </div>
  );
}