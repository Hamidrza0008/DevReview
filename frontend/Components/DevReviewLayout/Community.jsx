"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Rocket,
  MessageSquare,
  Sparkles,
  Compass,
  Users,
  LifeBuoy,
  Share2,
  ThumbsUp,
  GraduationCap,
} from "lucide-react";
import SupportModal from "./SupportModal";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

const HIGHLIGHTS = [
  { icon: Share2, label: "Share projects" },
  { icon: Compass, label: "Explore other developers' work" },
  { icon: ThumbsUp, label: "Give meaningful feedback" },
  { icon: GraduationCap, label: "Learn from the community" },
];

const FEATURES = [
  {
    icon: Rocket,
    title: "Showcase Projects",
    description: "Share your work with the community and put your builds in front of developers who genuinely care.",
    accent: "accent",
  },
  {
    icon: MessageSquare,
    title: "Get Feedback",
    description: "Receive constructive, actionable reviews from real developers to sharpen every project you ship.",
    accent: "info",
  },
  {
    icon: Sparkles,
    title: "Learn & Improve",
    description: "Discover ideas, techniques, and inspiration from projects across the community to level up your craft.",
    accent: "star",
  },
];

const ACCENT_STYLES = {
  accent: {
    iconWrap: "bg-accent-soft border-accent/20 text-accent",
    glow: "bg-accent/20",
    ring: "group-hover:border-accent/40",
    title: "group-hover:text-accent",
  },
  info: {
    iconWrap: "bg-info/10 border-info/20 text-info",
    glow: "bg-info/20",
    ring: "group-hover:border-info/40",
    title: "group-hover:text-info",
  },
  star: {
    iconWrap: "bg-star/10 border-star/20 text-star",
    glow: "bg-star/20",
    ring: "group-hover:border-star/40",
    title: "group-hover:text-star",
  },
};

function FeatureCard({ icon: Icon, title, description, accent }) {
  const styles = ACCENT_STYLES[accent];
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden group bg-surface border border-line rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-lg transition-shadow duration-300 ${styles.ring}`}
    >
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${styles.glow}`}
      />

      <div className={`relative z-10 w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center border ${styles.iconWrap} mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
        <Icon className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
      </div>

      <h3 className={`relative z-10 text-base lg:text-lg font-bold text-ink tracking-tight mb-1.5 transition-colors duration-300 ${styles.title}`}>
        {title}
      </h3>
      <p className="relative z-10 text-sm text-muted leading-relaxed">{description}</p>
    </motion.div>
  );
}

function FloatingHelpButton({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.7, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40"
    >
      <motion.span
        animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.1, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-accent blur-xl -z-10"
      />
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Need help? Contact support"
        title="Need Help?"
        className="flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-accent text-accent-ink font-semibold text-sm shadow-lg shadow-accent/30 hover:brightness-110 transition-all cursor-pointer"
      >
        <LifeBuoy className="w-5 h-5" />
        <span className="hidden sm:inline">Need Help?</span>
      </motion.button>
    </motion.div>
  );
}

export default function Community() {
  const router = useRouter();
  const { user } = useAuth();
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <div className="h-[calc(100dvh-3.5rem)] md:h-dvh w-full bg-page text-ink font-sans antialiased relative overflow-hidden selection:bg-accent/20 selection:text-accent flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none z-0" />

      <motion.div
        animate={{ y: [0, 30, 0], scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 left-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[110px] pointer-events-none z-0"
      />
      <motion.div
        animate={{ y: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 right-0 w-72 h-72 bg-info/10 rounded-full blur-[110px] pointer-events-none z-0"
      />

      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center gap-4 md:gap-6 lg:gap-7 px-4 py-3 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto w-full overflow-hidden">
        {/* ---- HERO ---- */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto space-y-2.5 sm:space-y-3.5 shrink-0"
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-soft border border-accent/20 text-accent text-[11px] font-bold uppercase tracking-wider"
          >
            <Users className="w-3 h-3" /> Community
          </motion.span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black tracking-tight leading-[1.1]">
            Welcome to the{" "}
            <span className="bg-linear-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              DevReview Community
            </span>{" "}
            🚀
          </h1>

          <p className="hidden sm:block text-sm md:text-[15px] text-muted leading-relaxed max-w-3xl mx-auto font-medium">
            DevReview is a platform where developers can showcase their projects, receive valuable feedback,
            discover inspiring work, and connect with fellow developers. Whether you&apos;re building your first
            project or your hundredth, this community is designed to help you grow through collaboration and
            constructive reviews.
          </p>
          <p className="sm:hidden text-xs text-muted leading-snug max-w-sm mx-auto font-medium">
            Showcase your projects, get honest feedback, and grow alongside fellow developers.
          </p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="hidden sm:flex flex-wrap items-center justify-center gap-2"
          >
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <motion.span
                key={label}
                variants={itemVariants}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line text-xs font-semibold text-ink shadow-2xs hover:border-accent/40 hover:text-accent transition-colors"
              >
                <Icon className="w-3 h-3 text-accent" /> {label}
              </motion.span>
            ))}
          </motion.div>

          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/projects/explore")}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-accent hover:brightness-110 text-accent-ink px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-accent/20 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Explore Projects
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/users/explore")}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-surface border border-line hover:bg-page text-ink px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Find Developers
            </motion.button>
          </div>
        </motion.section>

        {/* ---- FEATURE CARDS ---- */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 shrink-0"
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </motion.section>
      </div>

      <FloatingHelpButton onClick={() => setSupportOpen(true)} />
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} user={user} />
    </div>
  );
}
