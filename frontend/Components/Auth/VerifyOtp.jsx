"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOTP } from '@/services/authApis';

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email");
    console.log(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await verifyOTP({
                email,
                otp
            });

            console.log(res);

            if (res.success) {
                router.push("/auth/login");
            } else {
                setError(res.message || "Invalid verification code. Please try again.");
            }
        } catch (error) {
            console.log(error);
            setError("An unexpected network error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { y: 12, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 150, damping: 22 } }
    };

    return (
        <div className="h-screen bg-page flex text-ink font-sans antialiased relative overflow-hidden">
            {/* Background Decorative Blurs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-2/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-accent relative items-center justify-center p-12 overflow-hidden border-r border-line/10">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 max-w-xl w-full text-accent-ink space-y-8">
                    <motion.div variants={itemVariants} className="flex items-center space-x-3 w-fit">
                        <div className="w-9 h-9 bg-accent-ink rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-accent font-black text-xl">&lt;/&gt;</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">DevReview</span>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-3">
                        <h1 className="text-4xl font-extrabold tracking-tight">Secure Your Identity 🔒</h1>
                        <p className="text-accent-ink/80 text-lg">One quick step to confirm it's really you before you get started.</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                            <h3 className="text-xs font-bold tracking-wider font-mono">Security Checkpoint</h3>
                            <div className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-accent-2 animate-pulse" />
                                <span className="text-[11px] font-bold text-accent-ink/70">Awaiting Auth</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs text-accent-ink/80">Verification code sent to your registered email address.</p>
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
                    className="w-full max-w-md bg-surface rounded-2xl border border-line p-8 sm:p-10 shadow-sm"
                >
                    <h2 className="text-2xl font-bold text-ink mb-1">Verify Credentials</h2>
                    <p className="text-sm text-muted mb-6">Input the 6-digit verification code sent to your workspace.</p>

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

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Secure OTP Token</label>
                            <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                type="text"
                                required
                                maxLength={6}
                                placeholder="000000"
                                className="w-full px-4 py-3 bg-page border border-line rounded-lg text-xl font-mono tracking-[0.5em] text-center focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-shadow duration-150"
                            />
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
                                        <span>Authorizing Token...</span>
                                    </motion.div>
                                ) : (
                                    <motion.span
                                        key="text"
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        transition={{ duration: 0.12 }}
                                    >
                                        Authorize Account Token
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </form>

                    <div className="flex flex-col items-center justify-center space-y-2 mt-6">
                        <a href="/auth/signup" className="text-xs text-muted hover:text-ink transition-colors">Back to profile creation</a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}