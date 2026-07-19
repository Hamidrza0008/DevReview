'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Features() {
  const featureList = [
    { 
      title: 'Showcase Your Projects', 
      description: 'Deploy your built work into a clean visual window tailored for dev inspectors.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    { 
      title: 'Get Developer Feedback', 
      description: 'Receive high-quality text, architecture reviews, and optimization thoughts.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      title: 'Discover Amazing Projects', 
      description: 'Browse and explore top-tier frameworks, concepts, and boilerplates.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      )
    },
    { 
      title: 'Build Your Reputation', 
      description: 'Gain review points, secure badges, and rise up the global technical leaderboards.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
  ];

  // Framer Motion Variants for Staggered Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    },
  };

  return (
    <section id="explore" className="relative w-full px-6 md:px-12 py-24 bg-page border-b border-line overflow-hidden">

      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-linear-to-b from-accent/15 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
            Built explicitly for <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-2">developer scale</span>
          </h2>
          <p className="text-base md:text-lg text-muted mt-4 font-medium">
            Everything you need to review code, share logic, and accelerate workflows.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Progress Container */}
      <div className="relative max-w-7xl mx-auto">

        {/* Animated Connecting Line (Now properly hidden behind circles) */}
        <div className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5 hidden lg:block z-0 overflow-hidden">
          <div className="w-full h-full bg-line" />
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 h-full w-[30%] bg-linear-to-r from-transparent via-accent to-transparent blur-[1px]"
          />
        </div>
        
        {/* Horizontal Process Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10"
        >
          {featureList.map((item, idx) => (
            <motion.div variants={itemVariants} key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left group cursor-pointer">
              
              {/* Step Circle */}
              <div className="relative flex items-center justify-center w-20 h-20 mb-8 bg-surface border-2 border-line rounded-full shadow-sm group-hover:border-accent/40 group-hover:shadow-[0_0_20px_rgba(47,111,78,0.2)] transition-all duration-500 z-10 overflow-hidden">

                {/* Background accent fill animation on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-accent to-accent-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

                {/* SVG Icon centered */}
                <div className="relative z-10 text-muted group-hover:text-accent-ink transition-colors duration-500 group-hover:scale-110">
                  {item.icon}
                </div>
              </div>

              {/* Feature Content (Glassmorphism Card) */}
              <div className="p-6 bg-surface/70 backdrop-blur-xl border border-surface rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:shadow-[0_10px_40px_rgba(47,111,78,0.08)] group-hover:-translate-y-1 group-hover:border-accent/30 transition-all duration-300 w-full min-h-[170px] relative overflow-hidden">

                {/* Subtle top border highlight on hover */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-accent to-accent-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Clean Step Number Badge inside card */}
                <span className="text-[11px] font-bold tracking-widest text-accent uppercase mb-2.5 block">
                  Step 0{idx + 1}
                </span>

                <h3 className="text-lg font-bold text-ink mb-3 group-hover:text-accent transition-colors duration-300 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}