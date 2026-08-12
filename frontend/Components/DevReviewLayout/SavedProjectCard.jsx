"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, Code2, Heart } from "lucide-react";
import { getProjectLikesCount } from "@/utils/projectCounts";

export function SavedProjectsEmptyState() {
  const router = useRouter();

  return (
    <div className="bg-surface border border-line rounded-[24px] p-8 text-center shadow-sm">
      <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Bookmark className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">No Saved Projects</h3>
      <p className="text-muted font-medium max-w-sm mx-auto text-sm leading-relaxed mb-6">
        Projects you save while browsing will appear here.
      </p>
      <button
        type="button"
        onClick={() => router.push("/projects/explore")}
        className="bg-page border border-line text-ink px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-surface-2 hover:border-accent/30 transition-colors shadow-sm"
      >
        Explore Projects
      </button>
    </div>
  );
}

export default function SavedProjectCard({ project, onRemove }) {
  const router = useRouter();

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => router.push(`/projects/${project._id}`)}
      className="bg-surface border border-line rounded-[24px] overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-accent/5 hover:border-accent/30 cursor-pointer transition-all duration-300"
    >
      <div className="h-44 bg-surface-2 border-b border-line relative overflow-hidden">
        {onRemove && (
          <button
            type="button"
            onClick={(event) => onRemove(event, project._id)}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-xl bg-surface/90 border border-line text-accent flex items-center justify-center shadow-sm hover:bg-accent hover:text-accent-ink transition-colors"
            aria-label="Remove from saved projects"
            title="Remove from saved"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        )}
        {project.thumbnail ? (
          <Image fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src={project.thumbnail} alt={project.title} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted"><Code2 className="w-8 h-8 opacity-40" /></div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-ink group-hover:text-accent transition-colors line-clamp-1">{project.title}</h3>
          <p className="text-sm text-muted font-medium line-clamp-2 mt-1.5 leading-relaxed">{project.description || "No description provided for this project."}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(project.techStack || []).slice(0, 3).map((tech, idx) => (
            <span key={idx} className="text-[10px] font-bold bg-page border border-line px-2.5 py-1 rounded-lg text-muted font-mono">{tech}</span>
          ))}
        </div>
        <div className="pt-4 border-t border-surface-2 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {project.owner?.profileImage ? (
              <Image src={project.owner.profileImage} alt={project.owner.name || "Project owner"} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-surface-2" />
            )}
            <span className="text-xs font-bold text-muted truncate">{project.owner?.name || project.owner?.username || "Developer"}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-muted"><Heart className="w-4 h-4 text-danger" />{getProjectLikesCount(project)}</span>
        </div>
      </div>
    </motion.article>
  );
}
