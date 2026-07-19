"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { MessagesSquare, Compass, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Community() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-8 lg:p-10 bg-page min-h-screen text-ink font-sans flex items-center justify-center"
    >
      <div className="max-w-lg w-full text-center bg-surface border border-line rounded-3xl p-10 shadow-sm space-y-5">
        <div className="w-14 h-14 bg-accent-soft text-accent rounded-2xl flex items-center justify-center mx-auto">
          <MessagesSquare className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Community discussions are coming soon</h1>
          <p className="text-sm text-muted leading-relaxed">
            We're still building out forum-style discussions, tags, and leaderboards. For now, connect with other
            developers through projects and reviews.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => router.push('/projects/explore')}
            className="flex-1 flex items-center justify-center gap-2 bg-accent hover:brightness-110 text-accent-ink px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            <Compass className="w-4 h-4" /> Explore Projects
          </button>
          <button
            onClick={() => router.push('/users/explore')}
            className="flex-1 flex items-center justify-center gap-2 bg-surface border border-line hover:bg-page text-ink px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            <Users className="w-4 h-4" /> Find Developers
          </button>
        </div>
      </div>
    </motion.div>
  );
}
