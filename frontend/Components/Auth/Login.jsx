"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "@/services/authApis";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Isolated Premium Skeleton Component to use inside Next.js Suspense Fallback
export function LoginSkeleton() {
  return (
    <div className="h-screen bg-[#F8FAFC] flex text-[#111827] font-sans antialiased relative overflow-hidden animate-pulse">
      <div className="hidden lg:flex lg:w-1/2 bg-[#2563EB]/90 relative items-center justify-center p-12">
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
        <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="h-7 bg-[#E5E7EB] rounded-lg w-1/2" />
            <div className="h-4 bg-[#E5E7EB] rounded w-3/4" />
          </div>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="h-3 bg-[#E5E7EB] rounded w-28" />
              <div className="h-11 bg-[#E5E7EB] rounded-lg w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-[#E5E7EB] rounded w-28" />
              <div className="h-11 bg-[#E5E7EB] rounded-lg w-full" />
            </div>
          </div>
          <div className="h-11 bg-[#E5E7EB] rounded-lg w-full pt-2" />
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
    <div className="h-screen bg-[#F8FAFC] flex text-[#111827] font-sans antialiased relative overflow-hidden selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2563EB] relative items-center justify-center p-12 overflow-hidden border-r border-[#E5E7EB]/10 z-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-xl w-full text-white space-y-8"
        >
          <motion.div variants={itemVariants} className="flex items-center space-x-3 w-fit">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-xs">
              <span className="text-[#2563EB] font-black text-xl">&lt;/&gt;</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">DevReview</span>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">Welcome Back Developer 👋</h1>
            <p className="text-blue-100 text-lg font-normal">Continue your journey with developers who build amazing things.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex space-x-2">
                <span className="w-3 h-3 bg-[#EF4444] rounded-full" />
                <span className="w-3 h-3 bg-[#F59E0B] rounded-full" />
                <span className="w-3 h-3 bg-[#22C55E] rounded-full" />
              </div>
              <span className="text-xs text-blue-200/70 font-mono">ProjectReviewer.tsx</span>
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
          className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-8 sm:p-10 shadow-2xs"
        >
          <div className="mb-8 lg:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">&lt;/&gt;</span>
            </div>
            <span className="text-xl font-bold text-[#111827]">DevReview</span>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-1">Account Secure Sign In</h2>
          <p className="text-sm text-[#6B7280] mb-6">Enter your credentials below to synchronize access.</p>

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
                <div className="flex items-start space-x-3 bg-red-50 border border-red-200 p-3.5 rounded-xl text-red-700">
                  <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1 text-sm font-semibold tracking-wide leading-relaxed">
                    {error}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Developer Identity Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">Access Key / Password</label>
                <a href="/auth/forgot-password" className="text-xs font-bold text-[#2563EB] hover:underline">Lost Key?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center select-none"
                >
                  <span className="text-[#6B7280] hover:text-[#111827] text-xs font-bold transition-colors">{showPassword ? "HIDE" : "SHOW"}</span>
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
                  className="w-4 h-4 rounded text-[#2563EB] border-[#E5E7EB] focus:ring-[#2563EB]/20"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-[#6B7280] select-none cursor-pointer font-medium hover:text-[#111827] transition-colors">Keep identity verified</label>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 px-4 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center overflow-hidden shadow-xs"
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E7EB]"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-[#6B7280] font-bold tracking-wider">Federated Access</span></div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.99 }}
            type="button" 
            className="w-full py-2.5 px-4 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#111827] font-semibold text-sm rounded-lg flex items-center justify-center space-x-2 transition-all shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.57 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.11 8.78 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.61-.21-2.38H12v4.5h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.6 2.8c2.1-1.94 3.3-4.8 3.3-8.5z"/>
              <path fill="#FBBC05" d="M5.1 14.7c-.24-.71-.38-1.47-.38-2.25s.14-1.54.38-2.25L1.5 7.4C.55 9.3 0 11.4 0 13.5s.55 4.2 1.5 6.1l3.6-2.9z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.5 1.18-4.36 1.18-3.22 0-5.99-2.07-6.96-4.96l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
            </svg>
            <span>Continue via Google API</span>
          </motion.button>

          <p className="text-center text-sm text-[#6B7280] mt-8">New to the ecosystem? <a href="/auth/signup" className="font-bold text-[#2563EB] hover:underline">Create Account</a></p>
        </motion.div>
      </div>
    </div>
  );
}