'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PrimaryButton, SecondaryButton } from './atoms';

export default function Hero() {
  const springConfig = { type: 'spring', stiffness: 100, damping: 20 };

  return (
    <section className="relative w-full min-h-screen bg-page px-6 md:px-16 lg:px-24 pt-20 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center overflow-hidden select-none z-10">

      {/* Ambient animated background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

        {/* Animated Moving Grid */}
        <motion.div
          animate={{ backgroundPosition: ['0px 0px', '48px 48px'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] bg-size-[3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-70"
        />

        {/* Dynamic Glowing Aurora Blobs */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-60">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] bg-accent/25 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-[500px] h-[500px] bg-accent-2/25 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"
          />
        </div>
      </div>

      {/* LEFT: TYPOGRAPHY & CONTROLS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-6 lg:col-span-6 z-10 text-center lg:text-left items-center lg:items-start"
      >
        {/* Honest early-stage tagline instead of fake social proof */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/80 border border-line backdrop-blur-md text-xs text-muted font-medium shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ok opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ok" />
          </span>
          Just launched — be one of our first reviewers
        </motion.div>

        {/* Premium Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-[52px] lg:text-[58px] font-extrabold text-ink tracking-tight leading-[1.1]">
          Showcase your projects. <br />
          Get feedback from <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-2 drop-shadow-sm">
            developers.
          </span>
        </h1>

        {/* Description Text */}
        <p className="text-base sm:text-lg text-muted leading-relaxed max-w-lg font-normal">
          Share your work, receive honest reviews, improve your skills, and build amazing things together — right from day one of this community.
        </p>

        {/* Actions Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
          <motion.div className="w-full sm:w-auto group relative" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={springConfig}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-accent to-accent-2 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <PrimaryButton className="relative w-full !px-8 !py-3.5 text-sm rounded-lg shadow-md">
              Explore Projects
            </PrimaryButton>
          </motion.div>

          <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={springConfig}>
            <SecondaryButton className="w-full !px-8 !py-3.5 text-sm backdrop-blur-md">
              Upload Project
            </SecondaryButton>
          </motion.div>
        </div>

        {/* Honest early-stage status row instead of fake metrics */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-10 pt-6 border-t border-line/80 w-full text-left">
          <div>
            <div className="text-3xl font-bold text-ink">Day 1</div>
            <div className="text-xs text-muted mt-1 font-semibold tracking-wide uppercase">Just Getting Started</div>
          </div>
          <div className="h-8 w-[1px] bg-line hidden sm:block" />
          <div>
            <div className="text-3xl font-bold text-ink">100%</div>
            <div className="text-xs text-muted mt-1 font-semibold tracking-wide uppercase">Real Feedback</div>
          </div>
          <div className="h-8 w-[1px] bg-line hidden sm:block" />
          <div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-2">Open ★</div>
            <div className="text-xs text-muted mt-1 font-semibold tracking-wide uppercase">To All Developers</div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT: 3D GLASSMORPHISM MOCKUP */}
      <div
        className="w-full lg:col-span-6 flex justify-center lg:justify-end relative z-10 px-2 sm:px-0 lg:pl-10 mt-10 lg:mt-0"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-[460px] relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: 15, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: -8, rotateX: 8 }}
            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02, transition: { duration: 0.4 } }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full bg-surface/70 backdrop-blur-2xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-surface p-5 flex flex-col gap-4 relative group"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-accent to-accent-2 text-accent-ink flex items-center justify-center font-bold text-xs shadow-md">
                  HR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">Finance Tracker Dashboard</h4>
                  <p className="text-[11px] font-medium text-muted">by Hamid Raza — Founder</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-ok/10 text-ok border border-ok/20 rounded-full shadow-sm">
                Live Demo
              </span>
            </div>

            {/* Inner Preview Screenshot Card Mock */}
            <div className="w-full h-48 bg-page/80 rounded-xl border border-line/60 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              <div className="flex items-center justify-between text-[9px] text-muted font-mono font-bold tracking-widest">
                <span>METRICS // REVENUE</span>
                <span className="text-accent flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> LIVE
                </span>
              </div>

              {/* Vibrant Visual Analytics Bar Graph lines */}
              <div className="w-full flex items-end justify-between h-24 gap-2 px-2 opacity-90 mt-2">
                <motion.div initial={{ height: 0 }} animate={{ height: '30%' }} transition={{ duration: 1, delay: 0.1 }} className="w-full bg-accent/25 rounded-t-sm" />
                <motion.div initial={{ height: 0 }} animate={{ height: '65%' }} transition={{ duration: 1, delay: 0.2 }} className="w-full bg-linear-to-t from-accent to-accent-2 rounded-t-sm relative shadow-md">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink text-page text-[9px] px-1.5 py-0.5 rounded font-bold shadow-md">82%</div>
                </motion.div>
                <motion.div initial={{ height: 0 }} animate={{ height: '45%' }} transition={{ duration: 1, delay: 0.3 }} className="w-full bg-accent/35 rounded-t-sm" />
                <motion.div initial={{ height: 0 }} animate={{ height: '20%' }} transition={{ duration: 1, delay: 0.4 }} className="w-full bg-accent/15 rounded-t-sm" />
                <motion.div initial={{ height: 0 }} animate={{ height: '75%' }} transition={{ duration: 1, delay: 0.5 }} className="w-full bg-linear-to-t from-accent-2 to-accent rounded-t-sm shadow-md" />
                <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} transition={{ duration: 1, delay: 0.6 }} className="w-full bg-star/40 rounded-t-sm" />
              </div>

              {/* Design Badges */}
              <div className="flex flex-wrap gap-2 z-10 mt-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface text-muted border border-line shadow-sm">Next.js</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface text-muted border border-line shadow-sm">TailwindCSS</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface text-muted border border-line shadow-sm">MongoDB</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-5 text-[12px] font-semibold text-muted pt-1">
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-ink transition-colors">💬 12 Reviews</span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-ink transition-colors">❤️ 24 Likes</span>
            </div>
          </motion.div>

          {/* FLOATING CARD 1: Top Right Verified Badge */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-4 md:right-[-20px] bg-surface/90 backdrop-blur-xl border border-surface shadow-[0_15px_35px_rgba(0,0,0,0.06)] px-4 py-2 rounded-full flex items-center gap-2 z-20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-ok shadow-[0_0_8px_rgba(47,111,78,0.5)]" />
            <span className="text-[11px] font-bold text-ink tracking-tight">Project Verified</span>
          </motion.div>

          {/* FLOATING CARD 2: Review Box */}
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 -left-6 md:-left-16 max-w-[240px] bg-surface/90 backdrop-blur-xl border border-surface shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-4 rounded-xl hidden md:flex items-start gap-3 z-20"
          >
            <div className="w-8 h-8 rounded-full bg-page border border-line shrink-0 flex items-center justify-center text-[11px] font-bold text-muted">RS</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between w-full gap-3">
                <span className="text-[11px] font-bold text-ink">Rahul Sharma</span>
                <span className="text-[9px] text-muted">2h ago</span>
              </div>
              <p className="text-[10px] text-muted leading-relaxed font-medium">
                "Great UI and clean code! Maybe improve the mobile responsive part..."
              </p>
              <div className="text-[10px] text-star tracking-tighter">★★★★☆</div>
            </div>
          </motion.div>

          {/* FLOATING CARD 3: Views tracker */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-8 right-10 bg-surface/90 backdrop-blur-xl border border-surface shadow-[0_20px_40px_rgba(0,0,0,0.08)] px-5 py-3 rounded-xl hidden sm:flex flex-col gap-1.5 z-20 min-w-[150px]"
          >
            <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Views Summary</span>
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-bold text-ink">152 <span className="text-[10px] text-muted font-normal">Views</span></span>
              <svg className="w-12 h-5 text-ok" viewBox="0 0 50 20" fill="none">
                <path d="M0 15 Q12 5 25 10 T50 2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
