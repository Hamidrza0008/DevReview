"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SavedProjectCard, { SavedProjectsEmptyState } from "@/Components/DevReviewLayout/SavedProjectCard";
import { getSavedProjects, toggleSaveProject } from "@/services/savedProjectsApi";
import { ConfirmDialog, ErrorAlert } from "@/Components/shared";

export default function SavedProjects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const [retrying, setRetrying] = useState(false);
  const [projectToRemove, setProjectToRemove] = useState(null);

  const fetchSavedProjects = async () => {
    try {
      const res = await getSavedProjects();
      if (res?.success) {
        setSavedProjects(res.savedProjects || []);
        setError(null);
      } else {
        setError(res?.message || "Failed to load saved projects.");
      }
    } catch {
      setError("Failed to load saved projects. Please try again.");
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await fetchSavedProjects();
    setRetrying(false);
  };

  useEffect(() => {
    const load = async () => {
      await fetchSavedProjects();
      setLoading(false);
    };
    load();
  }, []);

  const handleRemove = async (event, projectId) => {
    event.stopPropagation();
    setProjectToRemove(projectId);
  };

  const confirmRemove = async () => {
    if (!projectToRemove) return;
    const previousProjects = savedProjects;
    setSavedProjects((projects) => projects.filter((project) => project._id !== projectToRemove));

    const res = await toggleSaveProject(projectToRemove);
    if (!res?.success || res.saved !== false) setSavedProjects(previousProjects);
    setProjectToRemove(null);
  };

  if (loading) {
    return <div className="p-4 sm:p-8 bg-page min-h-screen space-y-6 animate-pulse"><div className="h-10 bg-line rounded w-1/4 mb-8" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map((item) => <div key={item} className="h-80 bg-surface border border-line rounded-[24px]" />)}</div></div>;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 bg-page min-h-screen flex items-center justify-center">
        <ErrorAlert
          message={error}
          onRetry={handleRetry}
          retryLabel={retrying ? "Retrying..." : "Retry"}
        />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 sm:p-8 bg-page min-h-screen text-ink">
      <div className="mb-8"><h1 className="text-3xl font-bold tracking-tight">Saved Projects</h1><p className="text-muted">Your curated bookmarks, patterns, and reference architectures.</p></div>
      {savedProjects.length === 0 ? <SavedProjectsEmptyState /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProjects.map((project) => <SavedProjectCard key={project._id} project={project} onRemove={handleRemove} />)}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!projectToRemove}
        onClose={() => setProjectToRemove(null)}
        onConfirm={confirmRemove}
        title="Remove from saved?"
        message="This project will be removed from your saved list. You can always save it again later."
        confirmLabel="Remove"
        variant="danger"
      />
    </motion.div>
  );
}
