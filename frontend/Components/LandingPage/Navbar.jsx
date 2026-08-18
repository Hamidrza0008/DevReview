'use client';

import React, { useState, useEffect } from 'react';
import { DevReviewLogo, PrimaryButton, ThemeToggle } from './atoms';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { user } = useAuth();
  const loggedIn = !!user;


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navLinks = [
    { name: 'Explore Projects', href: '#explore' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Community', href: '#community' },
    { name: 'About', href: '#about' },
  ];


  useEffect(() => {
    const sectionIds = navLinks
      .filter((link) => link.href.startsWith('#'))
      .map((link) => link.href.replace('#', ''));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  const handleScrollToSection = (e, href) => {
    e.preventDefault();
    setIsOpen(false); // Mobile menu band karne ke liye


    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);

      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {

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
          ? 'bg-page/70 md:backdrop-blur-xl border-b border-line shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
          : 'bg-transparent border-b-transparent'
      }`}
    >

      <div className="max-w-7xl mx-auto h-16 px-6 md:px-12 flex items-center justify-between">


        <div
          onClick={() => router.push('/')}
          className="hover:scale-[1.02] transition-transform duration-200 active:scale-[0.98] cursor-pointer"
        >
          <DevReviewLogo />
        </div>


        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollToSection(e, link.href)}
                className={`relative text-sm font-medium py-2 transition-colors duration-200 group ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {link.name}

                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-linear-to-r from-accent to-accent-2 rounded-full transition-all duration-300 ease-out ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}
                />
              </a>
            );
          })}
        </div>


        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          {loggedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center gap-2 py-2 px-5 rounded-xl text-sm font-semibold text-accent-ink bg-accent hover:brightness-110 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <svg className="w-4 h-4 text-accent-ink/70 group-hover:text-accent-ink transition-colors relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold text-muted border border-transparent hover:border-line hover:bg-surface/60 active:bg-surface transition-all duration-200"
              >
                Login
              </button>
              <PrimaryButton
                onClick={() => router.push("/auth/signup")}
                className="!py-2 px-4 rounded-xl text-sm shadow-sm"
              >
                Get Started
              </PrimaryButton>
            </>
          )}
        </div>


        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col justify-center items-center w-9 h-9 rounded-xl hover:bg-surface transition-colors gap-[5px] z-50 relative"
          >
            <span className={`bg-ink h-[2px] w-5 rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`bg-ink h-[2px] w-5 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`bg-ink h-[2px] w-5 rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-line bg-page/95 md:backdrop-blur-2xl absolute w-full left-0 shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollToSection(e, link.href)}
                    className={`flex items-center gap-2 text-base font-semibold transition-colors duration-200 ${
                      isActive ? 'text-accent' : 'text-muted hover:text-accent'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full bg-accent transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    {link.name}
                  </a>
                );
              })}

              <hr className="border-line my-2" />


              <div className="flex items-center gap-3 w-full">
                {loggedIn ? (
                  <button
                    onClick={() => { setIsOpen(false); router.push("/dashboard"); }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-accent-ink bg-accent hover:brightness-110 transition-all duration-200 shadow-sm"
                  >
                    <span>Go to Dashboard</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setIsOpen(false); router.push("/auth/login"); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-ink border border-line hover:bg-surface active:bg-surface-2 transition-all"
                    >
                      Login
                    </button>
                    <PrimaryButton
                      onClick={() => { setIsOpen(false); router.push("/auth/signup"); }}
                      className="flex-1 !justify-center !py-3 rounded-xl text-sm shadow-md"
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
