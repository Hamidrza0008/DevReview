'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TechBadge } from './atoms';
import { useAuth } from '@/context/AuthContext';
import { getFeaturedProjects } from '@/services/landingApi';
import SkeletonBox from '@/Components/Skeleton/SkeletonBox';
import ErrorAlert from '@/Components/shared/ErrorAlert';
import EmptyState from '@/Components/shared/EmptyState';

export default function FeaturedProjects() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      const data = await getFeaturedProjects();
      if (cancelled) return;
      if (data.success) {
        setProjects(data.projects || []);
      } else {
        setError(data.message || "Failed to load projects");
      }
      setLoading(false);
    }
    fetchProjects();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="w-full px-6 md:px-12 py-20 bg-surface border-b border-line">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-ink tracking-tight">Featured Projects</h2>
            <p className="text-sm text-muted mt-1">Fresh off the platform — be one of the first to get featured</p>
          </div>
          <Link
            href="/projects/explore"
            className="text-sm font-semibold text-accent hover:brightness-110 flex items-center gap-1 group/btn transition-colors duration-200"
          >
            View all
            <span className="transform group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1].map((i) => (
              <div key={i} className="bg-surface border border-line rounded-2xl overflow-hidden">
                <SkeletonBox className="h-48 rounded-none" />
                <div className="p-6 space-y-3">
                  <SkeletonBox className="h-5 w-3/4" />
                  <div className="flex gap-2">
                    <SkeletonBox className="h-6 w-16" rounded="rounded-md" />
                    <SkeletonBox className="h-6 w-20" rounded="rounded-md" />
                  </div>
                  <SkeletonBox className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <ErrorAlert message={error} onRetry={() => {
            setLoading(true);
            setError(null);
            getFeaturedProjects().then((data) => {
              if (data.success) setProjects(data.projects || []);
              else setError(data.message);
              setLoading(false);
            });
          }} />
        )}

        {!loading && !error && projects.length === 0 && (
          <EmptyState
            title="No projects yet"
            description="Be the first to share your project with the community."
            action={() => router.push(user ? '/projects/create' : '/auth/login')}
            actionLabel="Upload Project"
          />
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, type: 'spring', stiffness: 80, damping: 15 }}
              >
                <Link href={`/projects/${project._id}`} className="block bg-surface border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1.5 group cursor-pointer flex flex-col h-full">
                  <div className="h-48 bg-ink border-b border-line relative overflow-hidden flex items-center justify-center">
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt={`${project.title} Preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04] opacity-85 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="flex items-center justify-center text-muted text-4xl font-bold opacity-30">
                        {project.title?.charAt(0) || '/'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3 w-7 h-7 border border-white/10 rounded-lg bg-ink/60 md:backdrop-blur-md flex items-center justify-center font-mono text-[9px] text-accent-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      &lt;/&gt;
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                    <div>
                      <h3 className="text-lg font-bold text-ink group-hover:text-accent transition-colors duration-200 mb-2">
                        {project.title}
                      </h3>
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <TechBadge key={tech} name={tech} />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-accent-soft text-accent font-bold flex items-center justify-center text-[10px] border border-accent/20">
                          {project.owner?.name?.charAt(0) || 'U'}
                        </div>
                        <span>
                          by <strong className="text-ink font-semibold">{project.owner?.name || project.owner?.username || 'Developer'}</strong>
                        </span>
                      </div>
                      {(project.reviewsCount > 0 || project.likesCount > 0) && (
                        <div className="flex items-center gap-3">
                          {project.reviewsCount > 0 && <span>{project.reviewsCount} review{project.reviewsCount !== 1 ? 's' : ''}</span>}
                          {project.likesCount > 0 && <span>{project.likesCount} like{project.likesCount !== 1 ? 's' : ''}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: projects.length * 0.1 }}
              onClick={() => router.push(user ? '/projects/create' : '/auth/login')}
              className="border-2 border-dashed border-line rounded-2xl flex flex-col items-center justify-center gap-3 py-16 text-muted hover:text-accent hover:border-accent/40 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">Your project could go here</span>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
