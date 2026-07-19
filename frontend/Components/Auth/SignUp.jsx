"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { signUp } from '@/services/authApis';
import { useRouter } from 'next/navigation';

// Isolated Premium Skeleton Component for Next.js Suspense Fallback
export function SignUpSkeleton() {
  return (
    <div className="h-screen bg-page flex text-ink font-sans antialiased relative overflow-hidden animate-pulse">
      <div className="hidden lg:flex lg:w-1/2 bg-accent/90 relative items-center justify-center p-12">
        <div className="max-w-xl w-full space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl" />
            <div className="h-6 bg-white/20 rounded w-32" />
          </div>
          <div className="space-y-3">
            <div className="h-10 bg-white/20 rounded-xl w-3/4" />
            <div className="h-5 bg-white/20 rounded-lg w-5/6" />
          </div>
          <div className="h-32 bg-white/10 rounded-2xl w-full border border-white/10" />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-surface border border-line rounded-2xl p-8 sm:p-10 space-y-5">
          <div className="space-y-2">
            <div className="h-7 bg-line rounded-lg w-1/2" />
            <div className="h-4 bg-line rounded w-3/4" />
          </div>
          <div className="space-y-3 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 bg-line rounded w-20" />
                <div className="h-10 bg-line rounded-lg w-full" />
              </div>
            ))}
          </div>
          <div className="h-11 bg-line rounded-lg w-full pt-1" />
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your credentials.");
      return;
    }
    
    setIsLoading(true);

    try {
      console.log({
        name,
        username,
        email,
        password
      });
      const res = await signUp({
        name,
        username,
        email,
        password,
      });

      console.log(res);

      if (res.success) {
        router.push(`verify-otp?email=${email}`);
      } else {
        setError(res.message || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 150, damping: 22 } }
  };

  if (isPageLoading) {
    return <SignUpSkeleton />;
  }

  return (
    <div className="h-screen bg-page flex text-ink font-sans antialiased relative overflow-hidden selection:bg-accent/10 selection:text-accent">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-2/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent relative items-center justify-center p-12 overflow-hidden border-r border-line/10 z-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 max-w-xl w-full text-accent-ink space-y-8">
          <motion.div variants={itemVariants} className="flex items-center space-x-3 w-fit">
            <div className="w-9 h-9 bg-accent-ink rounded-xl flex items-center justify-center shadow-xs">
              <span className="text-accent font-black text-xl">&lt;/&gt;</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">DevReview</span>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">Build. Share. Grow. 🚀</h1>
            <p className="text-accent-ink/80 text-lg">We just launched — be one of the first developers showcasing your projects here.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <h3 className="text-xs font-bold tracking-wider font-mono">Peer Network Graph</h3>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
                <span className="text-[11px] font-bold">Live</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-2 flex items-center justify-center text-xs font-mono">FT</div>
                  <div>
                    <p className="text-xs font-bold">Finance Tracker app</p>
                    <p className="text-[10px] text-accent-ink/60">Next.js • MongoDB</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 bg-ok/20 text-ok rounded-md font-bold">Published</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-surface rounded-2xl border border-line p-8 sm:p-10 shadow-2xs my-auto"
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>

          <h2 className="text-2xl font-bold text-ink mb-1">Join Community</h2>
          <p className="text-sm text-muted mb-6">Create your profile workspace setup to initiate sharing.</p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="overflow-hidden mb-5"
              >
                <div className="flex items-start space-x-3 bg-danger/10 border border-danger/30 p-3.5 rounded-xl text-danger">
                  <svg className="w-5 h-5 mt-0.5 shrink-0 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1 text-sm font-semibold tracking-wide leading-relaxed">
                    {error}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Hamid Rza" className="w-full px-4 py-2.5 bg-page border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Handle Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="HamidRza0008" className="w-full px-4 py-2.5 bg-page border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Developer Communications Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full px-4 py-2.5 bg-page border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Secure Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-page border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Confirm Credentials Match</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-page border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all" />
            </div>

            <div className="flex items-start pt-1">
              <input id="terms-check" type="checkbox" required checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4 mt-0.5 rounded text-accent border-line focus:ring-accent/20" />
              <label htmlFor="terms-check" className="ml-2 text-xs text-muted font-medium cursor-pointer hover:text-ink transition-colors">I authorize access terms and agree to code review policies.</label>
            </div>

            <motion.button
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 px-4 bg-accent hover:brightness-110 text-accent-ink font-bold text-sm rounded-lg transition-colors flex items-center justify-center overflow-hidden shadow-xs"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deploying Profile...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    Initialize System Account
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted mt-6">Already verified? <a href="/auth/login" className="font-bold text-accent hover:underline">Log In</a></p>
        </motion.div>
      </div>
    </div>
  );
}