'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), reduceMotion ? 80 : 1450);
    const completeTimer = setTimeout(onComplete, reduceMotion ? 140 : 2050);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isExiting ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.65, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-page"
      role="status"
      aria-label="Loading DevReview"
    >
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[80px]" />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-5"
        >
          <motion.div
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-[22px] border border-dashed border-accent/25"
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink shadow-[0_18px_45px_rgba(24,43,33,0.18)]">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path d="M14 10L7 17L14 24" className="stroke-accent-2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 18L22 22L28 12" className="stroke-accent-ink" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.45 }}
          className="text-center"
        >
          <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-ink">
            Dev<span className="text-accent">Review</span>
          </h1>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted/70">
            Build · Share · Improve
          </p>
        </motion.div>

        <div className="mt-8 h-px w-40 overflow-hidden bg-line">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: reduceMotion ? 0.01 : 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full bg-linear-to-r from-accent to-accent-2"
          />
        </div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.65, 0.65] }}
          transition={{ duration: reduceMotion ? 0.01 : 1.1, times: [0, 0.5, 1] }}
          className="mt-3 text-[10px] font-medium tracking-wide text-muted"
        >
          Preparing your workspace
        </motion.span>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isExiting ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
      />
    </motion.div>
  );
}
