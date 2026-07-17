'use client';

import React, { useState, useEffect } from 'react';
import { DevReviewLogo, PrimaryButton } from './atoms';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const loggedIn = !!user;

  // Track scroll for dynamic navbar background blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated links with their target section IDs
  const navLinks = [
    { name: 'Explore Projects', href: '#explore' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Community', href: '#community' },
    { name: 'About', href: '#about' },
  ];

  // Smooth Scroll Function
  const handleScrollToSection = (e, href) => {
    e.preventDefault();
    setIsOpen(false); // Mobile menu band karne ke liye
    
    // Agar href '#' se start hota hai, toh smooth scroll karo
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);
      
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Agar element current page par nahi hai, toh home page + hash par bhej do
        router.push(`/${href}`);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <nav 
      className={`w-full fixed top-0 left-0 z-[100] transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' 
          : 'bg-transparent border-b-transparent'
      }`}
    >
      {/* Navbar Container */}
      <div className="max-w-7xl mx-auto h-16 px-6 md:px-12 flex items-center justify-between">

        {/* Logo */}
        <div 
          onClick={() => router.push('/')} 
          className="hover:scale-[1.02] transition-transform duration-200 active:scale-[0.98] cursor-pointer"
        >
          <DevReviewLogo />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollToSection(e, link.href)}
              className="relative text-sm font-medium text-gray-500 hover:text-gray-900 py-2 transition-colors duration-200 group"
            >
              {link.name}
              {/* Premium Animated Underline */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out group-hover:w-full opacity-0 group-hover:opacity-100" />
            </a>
          ))}
        </div>

        {/* Desktop Buttons (Logged In vs Logged Out) */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center gap-2 py-2 px-5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <svg className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span className="relative z-10">Dashboard</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold text-gray-600 border border-transparent hover:border-gray-200 hover:bg-white/60 active:bg-gray-100 transition-all duration-200"
              >
                Login
              </button>
              <PrimaryButton
                onClick={() => router.push("/auth/signup")}
                className="!py-2 px-4 rounded-xl text-sm shadow-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Get Started
              </PrimaryButton>
            </>
          )}
        </div>

        {/* Hamburger Menu (Mobile Only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors gap-[5px] z-50 relative"
        >
          <span className={`bg-gray-800 h-[2px] w-5 rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`bg-gray-800 h-[2px] w-5 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`bg-gray-800 h-[2px] w-5 rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Drawer (Framer Motion setup for smooth dropdown) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-2xl absolute w-full left-0 shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollToSection(e, link.href)}
                  className="text-base font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}

              <hr className="border-gray-200 my-2" />

              {/* Mobile Buttons */}
              <div className="flex items-center gap-3 w-full">
                {loggedIn ? (
                  <button
                    onClick={() => { setIsOpen(false); router.push("/dashboard"); }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm"
                  >
                    <span>Go to Dashboard</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setIsOpen(false); router.push("/auth/login"); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all"
                    >
                      Login
                    </button>
                    <PrimaryButton
                      onClick={() => { setIsOpen(false); router.push("/auth/signup"); }}
                      className="flex-1 !justify-center !py-3 rounded-xl text-sm shadow-md bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Get Started
                    </PrimaryButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}