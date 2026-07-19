"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/services/authApis';

export default function ResetPassword() {
  const router = useRouter();
  const useParams = useSearchParams();
  const email = useParams.get("email");
  console.log(email);
  const [otp, setOtp] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newpassword !== confirmPassword) {
      setError("Passwords do not match. Please verify your new access credentials.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({
        email,
        otp,
        newpassword
      });
      console.log(res);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        setError(res.message || "Failed to reset password. Please check your OTP and try again.");
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
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-2/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />

      {/* Left Branding Panel */}
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
            <h1 className="text-4xl font-extrabold tracking-tight">Reset your password</h1>
            <p className="text-accent-ink/80 text-lg">Establish a secure connection and define your new access credentials.</p>
          </div>

          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl flex flex-col items-center justify-center py-14">
            <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-accent-ink" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <p className="text-xs font-mono text-accent-ink/70 tracking-widest uppercase">Cryptographic Key Override Vault</p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-surface rounded-2xl border border-line p-8 sm:p-10 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-ink mb-1">Override Node Access</h2>
          <p className="text-sm text-muted mb-6">Enter transmission OTP and overwrite target parameter keys.</p>

          <AnimatePresence mode="wait">
            {error && !isSuccess && (
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
            {!isSuccess ? (
              <motion.form
                key="reset-form"
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.12 }}
              >
                {/* Normal Plain OTP Input */}
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Verification Matrix OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 bg-page border border-line rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-shadow duration-150"
                  />
                </div>

                {/* New Password Input */}
                <div className="relative">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">New Access Key</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newpassword}
                      onChange={(e) => setNewpassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-10 py-3 bg-page border border-line rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-shadow duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Confirm Access Key</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-10 py-3 bg-page border border-line rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-shadow duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
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
                        <span>Verifying Nodes...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        Verify & Reset Credentials
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.form>
            ) : (
              /* Success State Card */
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
                    <h4 className="text-base font-bold text-ok">Override Complete</h4>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">
                      Your identity was verified and access credentials have been successfully overwritten.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Link */}
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