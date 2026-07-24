'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// DevReview Premium Logo - Meaningful Code Bracket & Checkmark Design
export const DevReviewLogo = () => (
  <div className="flex items-center gap-2 select-none cursor-pointer">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Premium Dark Background Node */}
      <rect width="28" height="28" rx="8" className="fill-ink"/>

      {/* Code Terminal Bracket Element (<) in Accent Green */}
      <path
        d="M11 10L7 14L11 18"
        className="stroke-accent-2"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Review Verified Checkmark in Accent Ink */}
      <path
        d="M15 15L18 18L22 11"
        className="stroke-accent-ink"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-xl font-bold tracking-tight text-ink">
      Dev<span className="text-accent">Review</span>
    </span>
  </div>
);


// Premium Primary Button
export const PrimaryButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 bg-accent text-accent-ink font-medium text-sm rounded-lg shadow-sm hover:brightness-110 transition-all duration-150 active:scale-[0.98] ${className}`}
  >
    {children}
  </button>
);

// Premium Secondary Button
export const SecondaryButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 bg-surface text-muted border border-line font-medium text-sm rounded-lg shadow-sm hover:bg-page hover:text-ink transition-all duration-150 active:scale-[0.98] ${className}`}
  >
    {children}
  </button>
);

// Tech Stack Tag Badge
export const TechBadge = ({ name }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-2 text-muted border border-line">
    {name}
  </span>
);

// Light/Dark theme toggle — used in Navbar and Sidebar
export const ThemeToggle = ({ className = '' }) => {
  const theme = useTheme();
  if (!theme) return null;
  const { theme: mode, toggleTheme } = theme;
  const isDark = mode === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group flex items-center justify-center w-9 h-9 rounded-xl border border-line bg-surface text-muted transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 ${
        isDark
          ? 'hover:bg-amber-400 hover:border-amber-400 hover:text-black hover:shadow-[0_0_18px_rgba(251,191,36,0.55)]'
          : 'hover:bg-black hover:border-black hover:text-amber-300 hover:shadow-[0_0_18px_rgba(0,0,0,0.35)]'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-12" />
      )}
    </button>
  );
};
