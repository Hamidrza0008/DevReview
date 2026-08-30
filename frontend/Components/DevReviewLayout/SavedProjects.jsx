"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SavedProjectCard, { SavedProjectsEmptyState } from "@/Components/DevReviewLayout/SavedProjectCard";
import { getSavedProjects, toggleSaveProject } from "@/services/savedProjectsApi";

export default function SavedProjects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);

  useEffect(() => {
    getSavedProjects()
      .then((res) => {
        if (res?.success) {
          setSavedProjects(res.savedProjects || []);
        } else {
          setError("Failed to load saved projects.");
        }
      })
      .catch(() => setError("Failed to load saved projects. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (event, projectId) => {
    event.stopPropagation();
    const previousProjects = savedProjects;
    setSavedProjects((projects) => projects.filter((project) => project._id !== projectId));

    const res = await toggleSaveProject(projectId);
    if (!res?.success || res.saved !== false) setSavedProjects(previousProjects);
  };

  if (loading) {
    return <div className="p-8 bg-page min-h-screen space-y-6 animate-pulse"><div className="h-10 bg-line rounded w-1/4 mb-8" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map((item) => <div key={item} className="h-80 bg-surface border border-line rounded-[24px]" />)}</div></div>;
  }

  if (error) {
    return (
      <div className="p-8 bg-page min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-sm text-danger font-semibold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-accent text-accent-ink text-sm font-bold rounded-xl">Retry</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-page min-h-screen text-ink">
      <div className="mb-8"><h1 className="text-3xl font-bold tracking-tight">Saved Projects</h1><p className="text-muted">Your curated bookmarks, patterns, and reference architectures.</p></div>
      {savedProjects.length === 0 ? <SavedProjectsEmptyState /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProjects.map((project) => <SavedProjectCard key={project._id} project={project} onRemove={handleRemove} />)}
        </div>
      )}
    </motion.div>
  );
}
