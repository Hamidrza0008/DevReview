'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { PrimaryButton } from './atoms';
import { useRouter } from 'next/navigation';

export default function Community() {
  const router = useRouter();

  return (
    <section id="community" className="w-full px-6 md:px-12 py-20 bg-page border-b border-line">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">Community Feedback Feed</h2>
          <p className="text-sm text-muted mt-1">This is where reviews from the community will show up</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-surface border border-dashed border-line rounded-xl p-8 shadow-sm flex flex-col items-center text-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-accent-soft text-accent flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-ink">No reviews yet — yours could be the first</h3>
          <p className="text-sm text-muted max-w-sm">
            We just launched. Upload a project or review someone else's, and your feedback will be the first thing new developers see here.
          </p>
          <PrimaryButton onClick={() => router.push('/auth/signup')} className="mt-2">
            Get Started
          </PrimaryButton>
        </motion.div>
      </div>
    </section>
  );
}
