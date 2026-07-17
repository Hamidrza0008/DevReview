'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PrimaryButton, SecondaryButton } from './atoms';

export default function Hero() {
  const springConfig = { type: 'spring', stiffness: 100, damping: 20 };

  return (
    <section className="relative w-full min-h-screen bg-[#F8FAFC] px-6 md:px-16 lg:px-24 pt-20 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center overflow-hidden select-none z-10">
      
      {/* 🌌 KHATARNAK ANIMATED LIGHT BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Animated Moving Grid */}
        <motion.div 
          animate={{ backgroundPosition: ['0px 0px', '48px 48px'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-70" 
        />
        
        {/* Dynamic Glowing Aurora Blobs (Light Version) */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-60">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-300/40 to-cyan-300/30 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"
          />
        </div>
      </div>
      
      {/* 📝 LEFT SIDE: TYPOGRAPHY & CONTROLS */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-6 lg:col-span-6 z-10 text-center lg:text-left items-center lg:items-start"
      >
        {/* Animated Trusted Tagline */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gray-200 backdrop-blur-md text-xs text-gray-600 font-medium shadow-sm"
        >
          <span className="text-blue-600 font-bold">★</span> 
          Trusted by 10K+ developers worldwide
        </motion.div>

        {/* Premium Light Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-[52px] lg:text-[58px] font-extrabold text-gray-900 tracking-tight leading-[1.1]">
          Showcase your projects. <br />
          Get feedback from <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">
            developers.
          </span>
        </h1>
        
        {/* Description Text */}
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg font-normal">
          Share your work, receive honest reviews, improve your skills, and build amazing things together within an elite community.
        </p>

        {/* Actions Buttons with Floating Hover */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
          <motion.div className="w-full sm:w-auto group relative" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={springConfig}>
            {/* Soft Glow Behind Primary Button */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <PrimaryButton className="relative w-full !px-8 !py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Explore Projects
            </PrimaryButton>
          </motion.div>
          
          <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={springConfig}>
            <SecondaryButton className="w-full !px-8 !py-3.5 bg-white/80 text-gray-700 font-semibold text-sm border border-gray-200 rounded-lg hover:bg-gray-50 backdrop-blur-md transition-colors shadow-sm">
              Upload Project
            </SecondaryButton>
          </motion.div>
        </div>

        {/* Metrics Section */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-10 pt-6 border-t border-gray-200/80 w-full text-left">
          <div>
            <div className="text-3xl font-bold text-gray-900">10K+</div>
            <div className="text-xs text-gray-500 mt-1 font-semibold tracking-wide uppercase">Developers</div>
          </div>
          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block" />
          <div>
            <div className="text-3xl font-bold text-gray-900">25K+</div>
            <div className="text-xs text-gray-500 mt-1 font-semibold tracking-wide uppercase">Reviews</div>
          </div>
          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block" />
          <div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">4.9/5 ★</div>
            <div className="text-xs text-gray-500 mt-1 font-semibold tracking-wide uppercase">Rating</div>
          </div>
        </div>
      </motion.div>
      
      {/* 🖼️ RIGHT SIDE: 3D GLASSMORPHISM MOCKUP (LIGHT THEME) */}
      <div 
        className="w-full lg:col-span-6 flex justify-center lg:justify-end relative z-10 px-2 sm:px-0 lg:pl-10 mt-10 lg:mt-0"
        style={{ perspective: 1200 }}
      >
        {/* Floating Animation for the whole 3D block */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-[460px] relative"
        >
          {/* Main 3D Container Layout - Clean Light Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: 15, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: -8, rotateX: 8 }}
            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02, transition: { duration: 0.4 } }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-white p-5 flex flex-col gap-4 relative group"
          >
            {/* Card Title Header Layout */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  HR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Finance Tracker Dashboard</h4>
                  <p className="text-[11px] font-medium text-gray-500">by Hamid Raza</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 rounded-full shadow-sm">
                Live Demo
              </span>
            </div>

            {/* Inner Preview Screenshot Card Mock */}
            <div className="w-full h-48 bg-gray-50/80 rounded-xl border border-gray-200/60 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              <div className="flex items-center justify-between text-[9px] text-gray-500 font-mono font-bold tracking-widest">
                <span>METRICS // REVENUE</span>
                <span className="text-blue-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> LIVE
                </span>
              </div>
              
              {/* Vibrant Visual Analytics Bar Graph lines */}
              <div className="w-full flex items-end justify-between h-24 gap-2 px-2 opacity-90 mt-2">
                <motion.div initial={{ height: 0 }} animate={{ height: '30%' }} transition={{ duration: 1, delay: 0.1 }} className="w-full bg-blue-200 rounded-t-sm" />
                <motion.div initial={{ height: 0 }} animate={{ height: '65%' }} transition={{ duration: 1, delay: 0.2 }} className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm relative shadow-md">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow-md">82%</div>
                </motion.div>
                <motion.div initial={{ height: 0 }} animate={{ height: '45%' }} transition={{ duration: 1, delay: 0.3 }} className="w-full bg-blue-300 rounded-t-sm" />
                <motion.div initial={{ height: 0 }} animate={{ height: '20%' }} transition={{ duration: 1, delay: 0.4 }} className="w-full bg-blue-100 rounded-t-sm" />
                <motion.div initial={{ height: 0 }} animate={{ height: '75%' }} transition={{ duration: 1, delay: 0.5 }} className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-sm shadow-md" />
                <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} transition={{ duration: 1, delay: 0.6 }} className="w-full bg-green-300 rounded-t-sm" />
              </div>

              {/* Design Badges */}
              <div className="flex flex-wrap gap-2 z-10 mt-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-gray-700 border border-gray-200 shadow-sm">Next.js</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-gray-700 border border-gray-200 shadow-sm">TailwindCSS</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-gray-700 border border-gray-200 shadow-sm">MongoDB</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-5 text-[12px] font-semibold text-gray-500 pt-1">
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">💬 12 Reviews</span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">❤️ 24 Likes</span>
            </div>
          </motion.div>

          {/* 🏆 FLOATING CARD 1: Top Right Score Box */}
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-4 md:right-[-20px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_15px_35px_rgba(0,0,0,0.06)] px-4 py-2 rounded-full flex items-center gap-2 z-20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[11px] font-bold text-gray-900 tracking-tight">Project Verified</span>
          </motion.div>

          {/* 💬 FLOATING CARD 2: Review Box */}
          <motion.div 
            animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 -left-6 md:-left-16 max-w-[240px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-4 rounded-xl hidden md:flex items-start gap-3 z-20"
          >
            {/* Mock Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-[11px] font-bold text-gray-600">RS</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between w-full gap-3">
                <span className="text-[11px] font-bold text-gray-900">Rahul Sharma</span>
                <span className="text-[9px] text-gray-500">2h ago</span>
              </div>
              <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                "Great UI and clean code! Maybe improve the mobile responsive part..."
              </p>
              <div className="text-[10px] text-yellow-500 tracking-tighter">★★★★☆</div>
            </div>
          </motion.div>

          {/* 📈 FLOATING CARD 3: Central Growth XP Tracker */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-8 right-10 bg-white/90 backdrop-blur-xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] px-5 py-3 rounded-xl hidden sm:flex flex-col gap-1.5 z-20 min-w-[150px]"
          >
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Views Summary</span>
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-bold text-gray-900">152 <span className="text-[10px] text-gray-500 font-normal">Views</span></span>
              <svg className="w-12 h-5 text-green-500" viewBox="0 0 50 20" fill="none">
                <path d="M0 15 Q12 5 25 10 T50 2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}