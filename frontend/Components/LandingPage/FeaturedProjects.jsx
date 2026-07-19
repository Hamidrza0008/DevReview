'use client';

import React from 'react';
import { TechBadge } from './atoms';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FeaturedProjects() {
  // Real founder project — everything else is an open invite slot until
  // the community starts uploading, so we never fake activity here.
  const showcase = {
    title: 'Finance Tracker',
    stack: ['Next.js', 'MongoDB', 'Tailwind'],
    dev: 'Hamid Raza',
    role: 'Founder',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  };

  const router = useRouter();

  return (
    <section className="w-full px-6 md:px-12 py-20 bg-surface border-b border-line">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-12 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-ink tracking-tight">Featured Projects</h2>
          <p className="text-sm text-muted mt-1">Fresh off the platform — be one of the first to get featured</p>
        </div>
        <a
          href="#"
          className="text-sm font-semibold text-accent hover:brightness-110 flex items-center gap-1 group/btn transition-colors duration-200"
        >
          View all
          <span className="transform group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
        </a>
      </div>

      {/* Grid Layout: 1 real project + 2 open invite slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1.5 group cursor-pointer flex flex-col">
          <div className="h-48 bg-ink border-b border-line relative overflow-hidden flex items-center justify-center">
            <img
              src={showcase.imageUrl}
              alt={`${showcase.title} Preview`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] opacity-85 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-3 right-3 w-7 h-7 border border-white/10 rounded-lg bg-ink/60 backdrop-blur-md flex items-center justify-center font-mono text-[9px] text-accent-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              &lt;/&gt;
            </div>
          </div>

          <div className="p-6 flex flex-col flex-1 justify-between gap-5">
            <div>
              <h3 className="text-lg font-bold text-ink group-hover:text-accent transition-colors duration-200 mb-2">
                {showcase.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {showcase.stack.map(tech => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-accent-soft text-accent font-bold flex items-center justify-center text-[10px] border border-accent/20">
                  {showcase.dev.charAt(0)}
                </div>
                <span>by <strong className="text-ink font-semibold">{showcase.dev}</strong> · {showcase.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Open invite slots — honestly labeled instead of fake dev cards */}
        {[1, 2].map((slot) => (
          <button
            key={slot}
            onClick={() => router.push('/auth/signup')}
            className="border-2 border-dashed border-line rounded-2xl flex flex-col items-center justify-center gap-3 py-16 text-muted hover:text-accent hover:border-accent/40 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-accent-soft text-accent flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold">Your project could go here</span>
          </button>
        ))}
      </div>
    </section>
  );
}
