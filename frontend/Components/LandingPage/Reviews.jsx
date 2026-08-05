'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, Star, ShieldCheck } from 'lucide-react';

export default function Reviews() {
  const points = [
    {
      icon: <GitPullRequest className="w-6 h-6" />,
      title: 'Line-by-line feedback',
      desc: 'Reviewers comment on what you actually shipped — real notes on your code and structure, not generic praise.',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Structured ratings',
      desc: 'Every review scores clarity, design, and code quality, so feedback is easy to compare and act on.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Public reputation',
      desc: 'Reviews you give and receive build a visible track record — helpful reviewers get noticed too.',
    },
  ];

  return (
    <section id="reviews" className="relative w-full px-6 md:px-12 py-24 bg-surface border-b border-line overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT: Copy + Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent-soft border border-accent/20 px-4 py-1.5 rounded-full shadow-sm">
              Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mt-5 tracking-tight">
              Feedback that actually{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-2">
                makes you better
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted mt-4 font-medium leading-relaxed">
              No star-rating spam. Reviews on DevReview are written by developers who actually read your code and tell you what to fix.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {points.map((point) => (
              <div key={point.title} className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-accent-soft text-accent flex items-center justify-center border border-accent/20">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-bold text-ink">{point.title}</h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Example Review Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative flex justify-center"
        >
          <div className="w-full max-w-sm bg-page border border-line rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-accent to-accent-2 text-accent-ink flex items-center justify-center font-bold text-xs">
                  HS
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">Hariom Singh</p>
                  <p className="text-[11px] text-muted font-medium">reviewed Finance Tracker</p>
                </div>
              </div>
              <div className="text-star text-sm tracking-tighter">★★★★☆</div>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              "Clean component structure and good use of hooks. The dashboard chart re-renders on every keystroke though — worth memoizing."
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-muted pt-4 border-t border-line">
              <span className="flex items-center gap-1.5">Code Quality <span className="text-ink">8/10</span></span>
              <span className="flex items-center gap-1.5">Clarity <span className="text-ink">9/10</span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
