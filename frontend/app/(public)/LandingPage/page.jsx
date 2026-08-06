'use client';

import React, { useState } from 'react';
import Preloader from '@/Components/LandingPage/Preloader';
import Navbar from '@/Components/LandingPage/Navbar';
import Hero from '@/Components/LandingPage/Hero';
import Features from '@/Components/LandingPage/Features';
import HowItWorks from '@/Components/LandingPage/HowItWorks';
import Reviews from '@/Components/LandingPage/Reviews';
import FeaturedProjects from '@/Components/LandingPage/FeaturedProjects';
import Community from '@/Components/LandingPage/Community';
import About from '@/Components/LandingPage/About';
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
        
        <Navbar />
        
        <main>
          <Hero />
          
          <Features />
          <HowItWorks />
          <Reviews />
          <FeaturedProjects />
          <Community />
          <About />
          <FinalCTA />
        </main>
        
        <footer className="w-full py-8 border-t border-line text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} DevReview. All rights reserved.
        </footer>
      </div>
    </div>
  );
}