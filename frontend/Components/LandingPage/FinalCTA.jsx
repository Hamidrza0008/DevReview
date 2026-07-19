'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function FinalCTA() {
  const router = useRouter();

  return (
    <section className="w-full px-6 md:px-12  bg-surface">
      {/* Max container to balance sizing like the screenshot */}
      <div className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl bg-linear-to-r from-accent via-accent to-accent-2 p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl shadow-accent/10">

        {/* Decorative Grid & Abstract BG Elements inside the banner */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[20px_20px]" />
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-5 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT ALIGNED CONTENT BLOCK */}
        <div className="flex flex-col gap-4 text-left items-start max-w-xl relative z-10 w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-accent-ink tracking-tight leading-[1.2]">
            Ready to present your builds <br className="hidden sm:inline" /> to the network?
          </h2>
          <p className="text-accent-ink/80 text-sm md:text-base leading-relaxed max-w-md font-medium">
            We just launched — be one of the first developers to share your work and get honest feedback.
          </p>

          <button
            onClick={() => router.push('/auth/signup')}
            className="mt-4 px-6 py-3.5 bg-accent-ink text-accent font-bold text-sm rounded-xl shadow-md hover:brightness-95 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center gap-2 group"
          >
            Join DevReview Today
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>

        {/* RIGHT FLOATING VISUAL ASSETS CONTAINER */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center lg:justify-end h-64 lg:h-auto z-10">

          {/* Main Simulated Futuristic Laptop Element using motion */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-72 h-56 md:w-80 md:h-64 flex items-center justify-center"
          >
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
              alt="Isometric Code Showcase Visual"
              className="w-full h-full object-contain rounded-2xl mix-blend-screen brightness-125 select-none"
            />

            {/* Glowing Backdrop behind the main mock object */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl -z-10 scale-75" />
          </motion.div>

          {/* FLOATING MICRO NODE: Code Symbol (Left side floating tag) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute left-4 top-12 p-2 px-3 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md shadow-lg font-mono text-xs text-accent-ink/80 hidden sm:block"
          >
            &lt;/&gt;
          </motion.div>

          {/* FLOATING MICRO NODE: Shield/Reputation Badge (Right side floating tag) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-4 bottom-12 p-2.5 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md shadow-lg text-xs text-accent-ink/80 hidden sm:block"
          >
            🛡️
          </motion.div>
        </div>

      </div>
    </section>
  );
}