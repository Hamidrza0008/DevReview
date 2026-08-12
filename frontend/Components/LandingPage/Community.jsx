'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Code2, MessageSquare, Sparkles, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function Community() {
  const router = useRouter();

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
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_24px_70px_rgba(22,42,31,0.12)]">
            <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink font-mono text-xs font-bold text-accent-2">&lt;/&gt;</div>
                <div>
                  <p className="text-sm font-bold text-ink">Project review</p>
                  <p className="text-xs text-muted">A preview of useful feedback</p>
                </div>
              </div>
              <span className="hidden rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent sm:inline-flex">Constructive</span>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent to-accent-2 text-sm font-bold text-accent-ink">DR</div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-ink">DevReview community</p>
                    <span className="text-xs text-muted">Architecture feedback</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                    “The project structure is clean and easy to follow. Consider separating the data-fetching logic into a reusable hook so the UI stays focused and future features are easier to test.”
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-page p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-ink">
                    <CheckCircle2 className="h-4 w-4 text-accent" /> What works well
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted">Clear component structure and consistent naming across the project.</p>
                </div>
                <div className="rounded-2xl border border-line bg-page p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-ink">
                    <Sparkles className="h-4 w-4 text-accent-2" /> Next improvement
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted">Extract shared logic and add focused tests for the main user flow.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
