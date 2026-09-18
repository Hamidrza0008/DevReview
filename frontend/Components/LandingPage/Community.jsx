'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, MessageSquare, Sparkles, Users, FolderOpen, Star, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getStats } from '@/services/statsApi';
import SkeletonBox from '@/Components/Skeleton/SkeletonBox';

const highlights = [
  {
    icon: Code2,
    title: 'Code-aware reviews',
    description: 'Get feedback that considers your stack, architecture, and implementation choices.',
  },
  {
    icon: MessageSquare,
    title: 'Actionable feedback',
    description: 'Move beyond vague praise with clear suggestions you can apply to your next iteration.',
  },
  {
    icon: Users,
    title: 'Grow together',
    description: 'Share what you know, learn from other builders, and improve through collaboration.',
  },
];

function StatItem({ icon: Icon, label, value, loading }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-page border border-line">
      <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center border border-accent/20">
        <Icon className="w-5 h-5" />
      </div>
      {loading ? (
        <SkeletonBox className="h-7 w-12" />
      ) : (
        <span className="text-2xl font-bold text-ink">{value.toLocaleString()}</span>
      )}
      <span className="text-[11px] text-muted font-semibold uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function Community() {
  const router = useRouter();
  const [stats, setStats] = useState({ developers: 0, projects: 0, reviews: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      const data = await getStats();
      if (cancelled) return;
      if (data.success) {
        setStats({
          developers: data.developers || 0,
          projects: data.projects || 0,
          reviews: data.reviews || 0,
          likes: data.likes || 0,
        });
      }
      setLoading(false);
    }
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="community" className="relative w-full overflow-hidden border-b border-line bg-page px-6 py-20 md:px-12 md:py-24">
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-accent-2/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Built for builders
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
            Better projects start with{' '}
            <span className="bg-linear-to-r from-accent to-accent-2 bg-clip-text text-transparent">better feedback.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-muted md:text-lg">
            Join a developer community where feedback is thoughtful, practical, and focused on helping your work improve.
          </p>

          <div className="mt-8 space-y-5">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink">{title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => router.push('/auth/signup')}
            className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-ink shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg active:translate-y-0"
          >
            Join the community
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-accent/15 to-accent-2/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink font-mono text-xs font-bold text-accent-2">&lt;/&gt;</div>
                <div>
                  <p className="text-sm font-bold text-ink">Community Stats</p>
                  <p className="text-xs text-muted">Real-time platform metrics</p>
                </div>
              </div>
              <span className="hidden rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent sm:inline-flex">Live</span>
            </div>

            <div className="p-5 sm:p-7">
              <div className="grid grid-cols-2 gap-3">
                <StatItem icon={Users} label="Developers" value={stats.developers} loading={loading} />
                <StatItem icon={FolderOpen} label="Projects" value={stats.projects} loading={loading} />
                <StatItem icon={MessageSquare} label="Reviews" value={stats.reviews} loading={loading} />
                <StatItem icon={Heart} label="Likes" value={stats.likes} loading={loading} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
