'use client';

import React, { useState } from 'react';
import Preloader from '@/Components/LandingPage/Preloader';
import Navbar from '@/Components/LandingPage/Navbar';
import Hero from '@/Components/LandingPage/Hero';
import Features from '@/Components/LandingPage/Features';
import HowItWorks from '@/Components/LandingPage/HowItWorks';
import FeaturedProjects from '@/Components/LandingPage/FeaturedProjects';
import Community from '@/Components/LandingPage/Community';
import FinalCTA from '@/Components/LandingPage/FinalCTA';

export default function DevReviewLandingPage() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <div className="relative w-full min-h-screen bg-page font-sans antialiased text-ink">
      
      {/* 1. Preloader Slide-Up Layer */}
      {showLoader && (
        <Preloader onComplete={() => setShowLoader(false)} />
      )}

      {/* 2. Main Content Wrapper */}
      <div className="w-full relative">
        
        {/* Navbar ko absolute/fixed context ke liye top par rakha hai.
          Aap apne Navbar component ke andar se 'bg-white/70' hata kar use 
          'bg-transparent' ya 'bg-white/10' kar dena jaisa aapko transparent chahiye!
        */}
        <Navbar />
        
        <main>
          {/* Bhai, ab Hero section automatic screen ke sabse top se shuru hoga,
            aur iska background pure Navbar ke peeche dikhega.
          */}
          <Hero />
          
          <Features />
          <HowItWorks />
          <FeaturedProjects />
          <Community />
          <FinalCTA />
        </main>
        
        <footer className="w-full py-8 border-t border-line text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} DevReview. All rights reserved.
        </footer>
      </div>
    </div>
  );
}