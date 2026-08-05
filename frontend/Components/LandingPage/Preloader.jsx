'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Code2 } from 'lucide-react';

const stages = [
  { at: 250, progress: 24, label: 'Initializing workspace' },
  { at: 650, progress: 52, label: 'Loading developer projects' },
  { at: 1050, progress: 78, label: 'Preparing review experience' },
  { at: 1450, progress: 100, label: 'Everything is ready' },
];

export default function Preloader({ onComplete }) {
  const [stageIndex, setStageIndex] = useState(-1);
  const [isExiting, setIsExiting] = useState(false);
  const reduceMotion = useReducedMotion();
  const currentStage = stages[Math.max(stageIndex, 0)];
  const progress = stageIndex < 0 ? 8 : currentStage.progress;

  useEffect(() => {
    const timers = stages.map((stage, index) => (
      setTimeout(() => setStageIndex(index), reduceMotion ? 40 : stage.at)
    ));

    const exitTimer = setTimeout(() => setIsExiting(true), reduceMotion ? 100 : 1800);
    const completeTimer = setTimeout(onComplete, reduceMotion ? 180 : 2450);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isExiting ? { y: '-100%', opacity: 0.98 } : { y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-page px-5"
      role="status"
      aria-live="polite"
      aria-label={`Loading DevReview: ${progress}%`}
    >
      <div className="absolute inset-0 opacity-60 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] bg-size-[3rem_3rem] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,#000_20%,transparent_75%)]" />

      <motion.div
        animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-[420px] w-[420px] rounded-full bg-accent/15 blur-[90px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[430px]"
      >
        <div className="absolute -inset-px rounded-[2rem] bg-linear-to-br from-accent/45 via-line to-accent-2/30" />
        <div className="relative overflow-hidden rounded-[2rem] bg-surface/95 p-7 shadow-[0_30px_80px_rgba(18,45,31,0.14)] md:p-9 md:backdrop-blur-xl">
          <motion.div
            animate={reduceMotion ? undefined : { x: ['-140%', '220%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
            className="pointer-events-none absolute inset-y-0 w-28 skew-x-[-18deg] bg-linear-to-r from-transparent via-white/25 to-transparent"
          />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
              <motion.div
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border border-dashed border-accent/45"
              />
              <motion.div
                animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-accent-2 shadow-lg shadow-accent/15"
              >
                <Code2 className="h-6 w-6" strokeWidth={2.25} />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.15 }}
            >
              <h1 className="text-2xl font-extrabold tracking-tight text-ink">
                Dev<span className="text-accent">Review</span>
              </h1>
              <p className="mt-1.5 text-sm text-muted">Where projects get better.</p>
            </motion.div>

            <div className="mt-8 w-full">
              <div className="mb-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em]">
                <span className="flex items-center gap-2 text-muted">
                  {progress === 100 ? (
                    <Check className="h-3.5 w-3.5 text-ok" strokeWidth={3} />
                  ) : (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                  )}
                  <span key={currentStage.label} className="animate-[fade-in-up_250ms_ease-out]">
                    {stageIndex < 0 ? 'Starting DevReview' : currentStage.label}
                  </span>
                </span>
                <span className="tabular-nums text-accent">{progress}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-surface-2 ring-1 ring-line/70">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full rounded-full bg-linear-to-r from-accent to-accent-2"
                >
                  <div className="absolute inset-y-0 right-0 w-8 bg-white/35 blur-sm" />
                </motion.div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
              <span>Build</span>
              <span className="text-accent">•</span>
              <span>Share</span>
              <span className="text-accent">•</span>
              <span>Improve</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isExiting ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 left-0 h-1 w-full origin-left bg-linear-to-r from-accent to-accent-2"
      />
    </motion.div>
  );
}
