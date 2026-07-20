"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { login } from "@/services/authApis";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "./GoogleButton";

// Isolated Premium Skeleton Component to use inside Next.js Suspense Fallback
export function LoginSkeleton() {
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
          <div className="h-40 bg-white/10 rounded-2xl w-full border border-white/10" />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-surface border border-line rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="h-7 bg-line rounded-lg w-1/2" />
            <div className="h-4 bg-line rounded w-3/4" />
          </div>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="h-3 bg-line rounded w-28" />
              <div className="h-11 bg-line rounded-lg w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-line rounded w-28" />
              <div className="h-11 bg-line rounded-lg w-full" />
            </div>
          </div>
          <div className="h-11 bg-line rounded-lg w-full pt-2" />
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const { fetchUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [error, setError] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); 

    try {
      const res = await login({
        email,
        password
      });

      console.log(res);
      if (res.success) {
        await fetchUser();
        router.push("/dashboard");
      } else {
        setError(res.message || "Invalid email or access key. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please check your network connection.");
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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 22 }
    }
  };

  if (isPageLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="h-screen bg-page flex text-ink font-sans antialiased relative overflow-hidden selection:bg-accent/10 selection:text-accent">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-2/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent relative items-center justify-center p-12 overflow-hidden border-r border-line/10 z-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-xl w-full text-accent-ink space-y-8"
        >
          <motion.div variants={itemVariants} className="flex items-center space-x-3 w-fit">
            <div className="w-9 h-9 bg-accent-ink rounded-xl flex items-center justify-center shadow-xs">
              <span className="text-accent font-black text-xl">&lt;/&gt;</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">DevReview</span>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">Welcome Back Developer 👋</h1>
            <p className="text-accent-ink/80 text-lg font-normal">Continue your journey with developers who build amazing things.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex space-x-2">
                <span className="w-3 h-3 bg-like rounded-full" />
                <span className="w-3 h-3 bg-star rounded-full" />
                <span className="w-3 h-3 bg-ok rounded-full" />
              </div>
              <span className="text-xs text-accent-ink/60 font-mono">ProjectReviewer.tsx</span>
            </div>

            <div className="font-mono text-sm text-blue-50 space-y-2.5">
              <p><span className="text-orange-300">import</span> &#123; community, reviews &#125; <span className="text-orange-300">from</span> <span className="text-green-300">'@devreview/core'</span>;</p>
              <p><span className="text-orange-300">const</span> activeDev = <span className="text-yellow-200">getCurrentUser</span>();</p>
              <p className="pt-2"><span className="text-blue-300">function</span> <span className="text-yellow-300">syncWorkspace</span>() &#123;</p>
              <p className="pl-5 text-slate-300/60">// Optimizing repo components...</p>
              <p className="pl-5">return community.<span className="text-yellow-200">optimizeMetrics</span>(activeDev.projects);</p>
              <p>&#125;</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-surface rounded-2xl border border-line p-8 sm:p-10 shadow-2xs"
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>

          <div className="mb-8 lg:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-ink font-black text-sm">&lt;/&gt;</span>
            </div>
            <span className="text-xl font-bold text-ink">DevReview</span>
          </div>

          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-ink">Welcome Back</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-accent/10 text-accent rounded-full uppercase tracking-wide">Recommended</span>
          </div>
          <p className="text-sm text-muted mb-6">Continue with Google — instant, secure, no password to remember.</p>

          {/* Premium Dynamic Error Alert UI */}
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

          <GoogleButton onError={setError} />

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!showEmailForm ? (
              <motion.div
                key="toggle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full py-3 px-4 bg-page border border-line hover:border-accent text-ink font-semibold text-sm rounded-lg transition-colors"
                >
                  Continue with Email &amp; Password
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Developer Identity Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 bg-page border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider">Access Key / Password</label>
                      <a href="/auth/forgot-password" className="text-xs font-bold text-accent hover:underline">Lost Key?</a>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-page border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center select-none"
                      >
                        <span className="text-muted hover:text-ink text-xs font-bold transition-colors">{showPassword ? "HIDE" : "SHOW"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-accent border-line focus:ring-accent/20"
                      />
                      <label htmlFor="remember-me" className="ml-2 text-sm text-muted select-none cursor-pointer font-medium hover:text-ink transition-colors">Keep identity verified</label>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full py-3 px-4 bg-page border border-line hover:border-accent text-ink font-bold text-sm rounded-lg transition-colors flex items-center justify-center overflow-hidden"
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
                          <span className="w-4 h-4 border-2 border-ink/20 border-t-accent rounded-full animate-spin" />
                          <span>Verifying Identity...</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                          transition={{ duration: 0.12 }}
                        >
                          Authenticate Account
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-muted mt-8">New to the ecosystem? <a href="/auth/signup" className="font-bold text-accent hover:underline">Create Account</a></p>
        </motion.div>
      </div>
    </div>
  );
}