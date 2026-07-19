'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    { 
      number: '01', 
      title: 'Create Profile', 
      desc: 'Sign up and sync your GitHub credentials.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      number: '02', 
      title: 'Upload Project', 
      desc: 'Provide links, markdown READMEs, and mock snapshots.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    },
    { 
      number: '03', 
      title: 'Receive Reviews', 
      desc: 'Get targeted, deep architectural notes from peers.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      number: '04', 
      title: 'Improve & Grow', 
      desc: 'Refactor code safely and update your status logs.',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 80, damping: 15 } 
    }
  };

  return (
    <section id="how-it-works" className="relative w-full px-6 md:px-12 py-24 bg-page border-b border-line overflow-hidden">

      {/* Subtle Premium Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-linear-to-tr from-accent/15 to-accent-2/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Heading */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent-soft border border-accent/20 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
              Workflow
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-ink mt-5 tracking-tight">
              How it <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-2">works</span>
            </h2>
            <p className="text-muted mt-4 text-base md:text-lg max-w-md mx-auto font-medium">
              Supercharge your development process in four simple stages.
            </p>
          </motion.div>
        </div>

        {/* Steps Flex Layout Layer */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 relative"
        >
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              {/* Step Card Element */}
              <motion.div
                variants={cardVariants}
                className="group flex flex-col items-center text-center p-8 bg-surface/80 backdrop-blur-xl border border-surface rounded-[2rem] shadow-[0_8px_30px_rgba(47,111,78,0.06)] hover:shadow-[0_20px_40px_rgba(47,111,78,0.12)] hover:-translate-y-2 hover:border-accent/30 transition-all duration-500 relative z-10 w-full lg:w-[280px] min-h-[280px] overflow-hidden cursor-default"
              >
                {/* Subtle top border highlight on hover */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-accent to-accent-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Large Background Watermark Number */}
                <div className="absolute -top-4 -right-2 text-[100px] font-black text-accent-soft group-hover:text-accent/10 transition-colors duration-500 pointer-events-none select-none z-0">
                  {step.number}
                </div>

                {/* Step Icon Container */}
                <div className="relative mb-6 mt-2 z-10">
                  <div className="relative w-16 h-16 bg-accent-soft border-2 border-accent/20 text-accent rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:border-accent/50 overflow-hidden">

                    {/* Background fill animation on hover */}
                    <div className="absolute inset-0 bg-linear-to-br from-accent to-accent-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

                    <div className="relative z-10 group-hover:text-accent-ink group-hover:scale-110 transition-all duration-500">
                      {step.icon}
                    </div>
                  </div>

                  {/* Number Badge */}
                  <span className="absolute -top-3 -right-3 bg-surface text-accent group-hover:text-accent-ink group-hover:bg-accent border border-accent/20 text-xs font-black w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all duration-500">
                    {step.number}
                  </span>
                </div>

                {/* Step Info */}
                <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-accent transition-colors duration-300 z-10 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed font-medium z-10">
                  {step.desc}
                </p>
              </motion.div>

              {/* Modern Animated Connecting Arrow Indicator */}
              {idx !== steps.length - 1 && (
                <div className="flex items-center justify-center z-0 my-4 lg:my-0 text-accent/30 shrink-0">

                  {/* Horizontal Arrow for Desktop Screens */}
                  <motion.svg
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-8 h-8 hidden lg:block text-accent/30 drop-shadow-sm"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </motion.svg>

                  {/* Vertical Arrow for Mobile/Tablet Screens */}
                  <motion.svg
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-7 h-7 lg:hidden text-accent/30 drop-shadow-sm"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

      </div>
    </section>
  );
}