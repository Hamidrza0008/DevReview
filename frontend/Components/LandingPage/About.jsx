'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users2, Sparkles } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Honest over hype',
      desc: 'No fake stats, no bot reviews. Every number and every project on this platform is real, even on day one.',
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      title: 'Built by developers',
      desc: 'DevReview exists because getting real feedback on side projects is hard. We built the tool we wished existed.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Open to everyone',
      desc: "Beginner or senior engineer — if you ship code and want honest eyes on it, this platform is for you.",
    },
  ];

  return (
    <section id="about" className="w-full px-6 md:px-12 py-24 bg-page border-b border-line">
      <div className="max-w-7xl mx-auto">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent-soft border border-accent/20 px-4 py-1.5 rounded-full shadow-sm">
            About DevReview
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mt-5 tracking-tight">
            Why we're building this
          </h2>
          <p className="text-base md:text-lg text-muted mt-4 font-medium leading-relaxed">
            Most side projects never get seen, let alone reviewed. DevReview is a place to put your work in front of other developers and get feedback that actually helps you improve.
          </p>
        </motion.div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 bg-surface border border-line rounded-2xl shadow-sm flex flex-col gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center border border-accent/20">
                {value.icon}
              </div>
              <h3 className="font-bold text-ink">{value.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-surface border border-line rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left shadow-sm"
        >
          <div className="w-16 h-16 shrink-0 rounded-full bg-linear-to-br from-accent to-accent-2 text-accent-ink flex items-center justify-center font-bold text-lg">
            HR
          </div>
          <div>
            <h3 className="font-bold text-ink">Hamid Raza</h3>
            <p className="text-sm text-accent font-semibold">Founder, DevReview</p>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              Building DevReview solo, in the open, starting with the very first project on the platform.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
