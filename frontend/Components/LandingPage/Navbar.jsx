'use client';

import React, { useState } from 'react';
import { DevReviewLogo, PrimaryButton } from './atoms';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const links = ['Explore Projects', 'Reviews', 'Community', 'About'];
  const { user } = useAuth();
  const loggedIn = !!user;

  return (
    <nav className="w-full fixed top-0 left-0 z-[100] bg-white/70 backdrop-blur-md border-b border-[#E5E7EB]/50 transition-all duration-300">
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
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="relative text-sm font-medium text-[#6B7280] hover:text-[#111827] py-2 transition-colors duration-200 group"
            >
              {link}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#2563EB] rounded-full transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop Buttons (Logged In vs Logged Out) */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center gap-2 py-2 px-5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] shadow-sm shadow-blue-100 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 text-blue-100 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Go to Dashboard</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium text-[#475569] border border-[#E5E7EB] hover:bg-slate-50 hover:text-[#111827] active:bg-slate-100 transition-all duration-200"
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

        {/* Hamburger Menu (Mobile Only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors gap-[4px]"
        >
          <span className={`bg-[#111827] h-0.5 w-5 rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`bg-[#111827] h-0.5 w-5 rounded transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : ''}`} />
          <span className={`bg-[#111827] h-0.5 w-5 rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-[#E5E7EB]/50 bg-white/95 backdrop-blur-xl ${isOpen ? 'max-h-[340px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-6 py-5 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-[#6B7280] hover:text-[#111827] transition-all duration-200"
            >
              {link}
            </a>
          ))}

          <hr className="border-[#E5E7EB]/60 my-1" />

          {/* Mobile Buttons */}
          <div className="flex items-center gap-3 pt-1 w-full">
            {loggedIn ? (
              <button
                onClick={() => { setIsOpen(false); router.push("/dashboard"); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-200"
              >
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setIsOpen(false); router.push("/auth/login"); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-[#475569] border border-[#E5E7EB] hover:bg-slate-50"
                >
                  Login
                </button>
                <PrimaryButton
                  onClick={() => { setIsOpen(false); router.push("/auth/signup"); }}
                  className="flex-1 !justify-center !py-2.5 rounded-xl text-sm shadow-sm"
                >
                  Get Started
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}