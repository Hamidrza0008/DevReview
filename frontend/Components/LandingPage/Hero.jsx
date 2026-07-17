'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PrimaryButton, SecondaryButton } from './atoms';

export default function Hero() {
  const springConfig = { type: 'spring', stiffness: 100, damping: 20 };

  return (
    <section className="relative w-full min-h-screen bg-white px-6 md:px-16 lg:px-24 pt-36 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center overflow-hidden select-none z-10">
      
      {/* 🌌 PREMIUM MINIMAL LIGHT BACKGROUND MESH */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle Light Mesh Grid - Exact matching the spec theme */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#F1F5F9_1px,transparent_1px),linear-gradient(to_bottom,#F1F5F9_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-70" />
        
        {/* Soft Ambient Fluid Blur 1 - Light Blue */}
        <motion.div 
          animate={{ 
            x: [0, 40, -20, 0], 
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-[100px]"
        />
        
        {/* Soft Ambient Fluid Blur 2 - Success Green Subtle Glow */}
        <motion.div 
          animate={{ 
            x: [0, -30, 40, 0], 
            y: [0, 50, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-[120px]"
        />

        {/* Clean Radial Dots Pattern from Image Spec */}
        <div className="absolute top-24 right-1/3 w-36 h-36 opacity-30 bg-[radial-gradient(#6B7280_1.5px,transparent_1.5px)] bg-[size:16px_16px]" />
      </div>
      
      {/* 📝 LEFT SIDE: TYPOGRAPHY & CONTROLS */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-6 lg:col-span-6 z-10 text-center lg:text-left items-center lg:items-start"
      >
        {/* Trusted Tagline */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#6B7280] font-medium shadow-sm">
          <span className="text-[#2563EB] font-bold">★</span> Trusted by 10K+ developers worldwide
        </div>

        {/* Heading matching the original screen typography */}
        <h1 className="text-4xl sm:text-5xl md:text-[52px] lg:text-[58px] font-extrabold text-[#111827] tracking-tight leading-[1.1]">
          Showcase your projects. <br />
          Get feedback from <span className="text-[#2563EB]">developers.</span>
        </h1>
        
        {/* Description Text */}
        <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-lg">
          Share your work, receive honest reviews, improve your skills, and build amazing things together within an elite community.
        </p>

        {/* Actions Buttons with Exact Colors */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
          <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} transition={springConfig}>
            <PrimaryButton className="w-full !px-8 !py-3.5 bg-[#2563EB] text-white font-semibold text-sm rounded-lg shadow-md hover:bg-[#1D4ED8] transition-colors">
              Explore Projects
            </PrimaryButton>
          </motion.div>
          
          <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} transition={springConfig}>
            <SecondaryButton className="w-full !px-8 !py-3.5 bg-white text-[#2563EB] font-semibold text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F8FAFC] transition-colors">
              Upload Project
            </SecondaryButton>
          </motion.div>
        </div>

        {/* Metrics Section */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-8 pt-6 border-t border-[#E5E7EB] w-full text-left">
          <div>
            <div className="text-2xl font-bold text-[#111827]">10K+</div>
            <div className="text-xs text-[#6B7280] mt-0.5 font-medium">Developers</div>
          </div>
          <div className="h-8 w-[1px] bg-[#E5E7EB] hidden sm:block" />
          <div>
            <div className="text-2xl font-bold text-[#111827]">25K+</div>
            <div className="text-xs text-[#6B7280] mt-0.5 font-medium">Reviews Received</div>
          </div>
          <div className="h-8 w-[1px] bg-[#E5E7EB] hidden sm:block" />
          <div>
            <div className="text-2xl font-bold text-[#2563EB]">4.9/5 ★</div>
            <div className="text-xs text-[#6B7280] mt-0.5 font-medium">Community Rating</div>
          </div>
        </div>
      </motion.div>
      
      {/* 🖼️ RIGHT SIDE: INTERACTIVE INTERACTIVE MOCKUP */}
      <div 
        className="w-full lg:col-span-6 flex justify-center lg:justify-end relative z-10 px-2 sm:px-0 lg:pl-10"
        style={{ perspective: 1000 }}
      >
        {/* 3D Container Layout */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotateY: 8, rotateX: 5 }}
          animate={{ opacity: 1, scale: 1, rotateY: -6, rotateX: 6 }}
          whileHover={{ rotateY: 0, rotateX: 2, scale: 1.02, transition: { duration: 0.3 } }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full max-w-[460px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-[#E5E7EB] p-5 flex flex-col gap-4 relative group"
        >
          {/* Card Title Header Layout */}
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                HR
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Finance Tracker Dashboard</h4>
                <p className="text-[10px] font-medium text-[#6B7280]">by Hamid Raza</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-[#E8F5E9] text-[#22C55E] border border-[#22C55E]/20 rounded-full">
              Live Demo
            </span>
          </div>

          {/* Inner Preview Screenshot Card Mock */}
          <div className="w-full h-44 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] relative overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center justify-between text-[8px] text-[#6B7280] font-mono font-bold tracking-wider">
              <span>PROJECT METRICS // REVENUE LAYER</span>
              <span className="text-[#2563EB]">● ANALYSIS</span>
            </div>
            
            {/* Visual Analytics Bar Graph lines */}
            <div className="w-full flex items-end justify-between h-20 gap-2 px-2 opacity-90">
              <div className="w-full bg-[#3B82F6]/20 h-[30%] rounded-t-sm" />
              <div className="w-full bg-[#2563EB] h-[65%] rounded-t-sm relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[8px] px-1 rounded font-bold shadow-sm">82%</div>
              </div>
              <div className="w-full bg-[#3B82F6]/30 h-[45%] rounded-t-sm" />
              <div className="w-full bg-[#3B82F6]/10 h-[20%] rounded-t-sm" />
              <div className="w-full bg-[#2563EB]/70 h-[75%] rounded-t-sm" />
              <div className="w-full bg-[#22C55E]/40 h-[40%] rounded-t-sm" />
            </div>

            {/* Design Badges from the spec sheet */}
            <div className="flex flex-wrap gap-1.5 z-10">
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white text-[#111827] border border-[#E5E7EB] shadow-sm">Next.js</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white text-[#111827] border border-[#E5E7EB] shadow-sm">TailwindCSS</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white text-[#111827] border border-[#E5E7EB] shadow-sm">MongoDB</span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center gap-4 text-[11px] font-semibold text-[#6B7280] pt-0.5">
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#111827] transition-colors">💬 12 Reviews</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#111827] transition-colors">👍 24 Likes</span>
          </div>
        </motion.div>

        {/* 🏆 FLOATING CARD 1: Top Right Score Box */}
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-5 right-16 bg-white border border-[#E5E7EB] shadow-[0_8px_20px_rgba(0,0,0,0.04)] px-3.5 py-1.5 rounded-full flex items-center gap-2 z-20"
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-[10px] font-bold text-[#111827] tracking-tight">Project Verified</span>
        </motion.div>

        {/* 💬 FLOATING CARD 2: Rahul Sharma Review Box (Strictly Matched from Image) */}
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 -left-12 max-w-[220px] bg-white border border-[#E5E7EB] shadow-[0_15px_35px_rgba(0,0,0,0.05)] p-3.5 rounded-xl hidden md:flex items-start gap-2.5 z-20"
        >
          {/* Mock Avatar */}
          <div className="w-6 h-6 rounded-full bg-[#F1F5F9] border border-[#E5E7EB] shrink-0 flex items-center justify-center text-[10px] font-bold text-[#6B7280]">RS</div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-[10px] font-bold text-[#111827]">Rahul Sharma</span>
              <span className="text-[8px] text-[#6B7280]">2h ago</span>
            </div>
            <p className="text-[9px] text-[#6B7280] leading-snug font-medium">
              "Great UI and clean code! Maybe improve the mobile responsive part..."
            </p>
            <div className="text-[8px] text-[#2563EB] tracking-tighter">★★★★☆</div>
          </div>
        </motion.div>

        {/* 📈 FLOATING CARD 3: Central Growth XP Tracker */}
        <motion.div 
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-16px] right-20 bg-white border border-[#E5E7EB] shadow-[0_15px_35px_rgba(0,0,0,0.05)] px-4 py-2.5 rounded-xl hidden sm:flex flex-col gap-1 z-20 min-w-[140px]"
        >
          <span className="text-[9px] text-[#6B7280] font-semibold">Views Summary</span>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-[#111827]">152 Views</span>
            <svg className="w-10 h-4 text-[#22C55E]" viewBox="0 0 50 20" fill="none">
              <path d="M0 15 Q12 5 25 10 T50 2" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </motion.div>

      </div>
    </section>
  );
}