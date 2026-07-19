"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword } from '@/services/authApis';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await forgotPassword({
        email
      });
      console.log(res);

      if (res.success) {
        setIsSent(true);
        setTimeout(() => {
          router.push(`/auth/reset-password?email=${email}`);
        }, 1500);
      } else {
        setError(res.message || "Failed to initiate recovery. Please verify the email address.");
      }
    } catch (error) {
      console.log(error);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex text-ink font-sans antialiased relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-2/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent relative items-center justify-center p-12 overflow-hidden border-r border-line/10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative z-10 max-w-xl w-full text-accent-ink space-y-8">
          <div className="flex items-center space-x-3 w-fit">
            <div className="w-9 h-9 bg-accent-ink rounded-xl flex items-center justify-center shadow-md">
              <span className="text-accent font-black text-xl">&lt;/&gt;</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">DevReview</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">Forgot your password?</h1>
            <p className="text-accent-ink/80 text-lg">No worries, we will help you get back to your DevReview account.</p>
          </div>

          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl flex flex-col items-center justify-center py-14">
            <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-accent-ink" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs font-mono text-accent-ink/70 tracking-widest uppercase">Cryptographic Key Vault Recovery</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-surface rounded-2xl border border-line p-8 sm:p-10 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-ink mb-1">Key Recovery</h2>
          <p className="text-sm text-muted mb-6">Input your registered email matrix node to transmit link instructions.</p>

          <AnimatePresence mode="wait">
            {error && !isSent && (
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

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.form
                key="recovery-form"
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.12 }}
              >
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Account Node Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full px-4 py-3 bg-page border border-line rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-shadow duration-150" />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-3 px-4 bg-accent hover:brightness-110 text-accent-ink font-bold text-sm rounded-lg transition-colors duration-150 flex items-center justify-center overflow-hidden"
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
                        <span>Transmitting Data...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        Transmit Reset Link
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.98, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                className="p-5 bg-ok/10 border border-ok/30 rounded-2xl mb-4"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 bg-ok rounded-full flex items-center justify-center text-accent-ink text-base font-bold shadow-sm">✓</div>
                  <div>
                    <h4 className="text-base font-bold text-ok">Transmission Successful</h4>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">
                      A recovery path was routed to <span className="font-semibold break-all">{email}</span> if it matches our registration nodes.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-line text-center">
            <a href="/auth/login" className="inline-flex items-center space-x-2 text-sm font-bold text-accent hover:brightness-110">
              <span>Return to Core Login</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}