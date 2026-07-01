"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Heart, MessageSquare, ExternalLink, GitBranch, Globe, Mail, CheckCircle2 } from 'lucide-react';
import { getUserProfile } from '@/services/usersApi';

export default function UserProfile() {

  const { username } = useParams()
  console.log(username);

  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(username);
    // console.log("useEffect")

  }, [username])

  const getUser = async (username) => {
    if (username) {
      const res = await getUserProfile(username)
      setUser(res.user)
      // console.log(res)
    }
  }

  const projects = [
    { title: "DevReview Dashboard", desc: "Premium SaaS dashboard engineered for internal engineering metrics.", likes: 42, reviews: 14, status: "Published", tech: ["Next.js", "Tailwind"] },
    { title: "E-Commerce Core", desc: "High-performance headless checkout core microservices ecosystem.", likes: 128, reviews: 34, status: "Published", tech: ["Go", "Redis"] },
    { title: "CodeSnippet CLI", desc: "Instantly save, sync, and share terminal configurations via CLI tool.", likes: 19, reviews: 3, status: "Draft", tech: ["TypeScript", "Node"] },
    { title: "AI Prompt Engine", desc: "Vector database wrapper for caching frequent LLM responses.", likes: 88, reviews: 21, status: "Published", tech: ["Python", "FastAPI"] }
  ];

  if (!user) {
    return (
      <div>
        Loading profile...
      </div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen text-[#111827] max-w-6xl mx-auto space-y-6 antialiased"
    >

      {/* ================= PREMIUM MODERN PROFILE SECTION ================= */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#2563EB]/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left w-full">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full blur opacity-30 transition duration-300"></div>
              <img
                src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80"}
                alt={user.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[#FFFFFF] relative z-10 shadow-md"
              />
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827] flex items-center gap-2">
                    {user.name}
                    {user.isVerified && (
                      <CheckCircle2 className="w-5 h-5 text-[#22C55E] fill-[#22C55E]/10" />
                    )}
                  </h1>
                  <span className="text-xs bg-[#F1F5F9] border border-[#E2E8F0] text-[#6B7280] font-mono px-2 py-0.5 rounded-md">
                    @{user.username}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#6B7280] mt-2 font-medium">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#2563EB]" /> {user.email}</span>
                  <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors group">
                    <GitBranch className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB]" /> GitHub
                  </a>
                  <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors group">
                    <Globe className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB]" /> Website
                  </a>
                </div>
              </div>

              <p className="text-sm md:text-base text-[#475569] font-normal leading-relaxed max-w-3xl">
                {user.bio}
              </p>

              <div className="pt-2">
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/15 font-semibold px-2.5 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COMPACT & CLEAN PROJECTS SECTION ================= */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
              Showcase Projects
              <span className="text-xs bg-[#E2E8F0] text-[#6B7280] px-2 py-0.5 rounded-full font-mono font-normal">
                {projects.length}
              </span>
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#1D4ED8' }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#2563EB] text-white px-3.5 py-2 rounded-xl font-medium flex items-center space-x-1.5 shadow-md text-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> <span>Add New</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, borderColor: '#2563EB', boxShadow: '0 10px 25px -15px rgba(37,99,235,0.2)' }}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between transition-all shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-[#111827] line-clamp-1 hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1">
                    {project.title}
                  </h3>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border tracking-wider shrink-0 uppercase ${project.status === 'Published'
                    ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
                    : 'bg-[#F1F5F9] text-[#6B7280] border-[#E2E8F0]'
                    }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-[#F8FAFC] border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[#475569]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] mt-3 flex justify-between items-center text-[11px] text-[#6B7280]">
                <div className="flex space-x-3">
                  <span className="flex items-center space-x-1 font-medium hover:text-rose-600 transition-colors cursor-pointer">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10" />
                    <span>{project.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1 font-medium">
                    <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{project.reviews}</span>
                  </span>
                </div>
                <a href="#" className="hover:text-[#2563EB] transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#6B7280] hover:text-[#2563EB] cursor-pointer transition-colors" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}