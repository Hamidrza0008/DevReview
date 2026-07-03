"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  GitBranch, 
  Globe, 
  BadgeCheck, 
  Users, 
  FolderGit2, 
  Star, 
  UserPlus, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Code2
} from "lucide-react";

// ==========================================
// DUMMY DATA (20 Realistic Developers)
// ==========================================
const developersData = [
  {
    name: "Alex Rivera",
    username: "alexr_dev",
    email: "alex@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Building the future of open-source design systems. Ex-Vercel. Obsessed with micro-interactions and performance.",
    skills: ["Frontend", "React", "Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "42", reviews: "128", followers: "12.4k", joined: "Joined 2 years ago" }
  },
  {
    name: "Marcus Chen",
    username: "marcus_codes",
    email: "marcus@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Distributed systems engineer. Writing highly concurrent Go microservices and optimizing database queries.",
    skills: ["Backend", "Go", "Kubernetes", "PostgreSQL", "Docker", "gRPC"],
    githubUrl: "https://github.com",
    portfolioUrl: "",
    isVerified: true,
    stats: { projects: "19", reviews: "94", followers: "8.1k", joined: "Joined 1 year ago" }
  },
  {
    name: "Sarah Jenkins",
    username: "sarah_ai",
    email: "sarah@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Training LLMs to understand code intent. Researcher turned Full Stack ML builder. Open source enthusiast.",
    skills: ["AI/ML", "Python", "PyTorch", "Next.js", "TypeScript", "FastAPI"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "31", reviews: "210", followers: "15.9k", joined: "Joined 3 years ago" }
  },
  {
    name: "Elena Rostova",
    username: "elena_ux",
    email: "elena@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "Crafting beautiful, accessible digital products. Bridging the gap between UI design and production React code.",
    skills: ["UI/UX", "Figma", "React", "CSS Architecture", "Tailwind CSS"],
    githubUrl: "",
    portfolioUrl: "https://portfolio.com",
    isVerified: false,
    stats: { projects: "56", reviews: "88", followers: "4.3k", joined: "Joined 6 months ago" }
  },
  {
    name: "David Kim",
    username: "davidk_mobile",
    email: "david@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Cross-platform mobile architect. Crafting 60fps animations in React Native and Flutter. Swift contributor.",
    skills: ["Mobile", "React Native", "Flutter", "SwiftUI", "Kotlin", "Firebase"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "24", reviews: "65", followers: "6.2k", joined: "Joined 1 year ago" }
  },
  {
    name: "Amara Okafor",
    username: "amara_codes",
    email: "amara@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80",
    bio: "Full Stack Engineer building web scale infrastructure. Core Maintainer of multiple open-source utilities.",
    skills: ["Full Stack", "Open Source", "Node.js", "GraphQL", "React", "AWS"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "68", reviews: "340", followers: "22.1k", joined: "Joined 4 years ago" }
  },
  {
    name: "Lucas Becker",
    username: "lucas_dev",
    email: "lucas@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    bio: "Computer Science Major & Indie Hacker. Building micro-SAAS products while mastering backend architecture.",
    skills: ["Student", "Backend", "Node.js", "Express", "MongoDB", "Vue.js"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: false,
    stats: { projects: "12", reviews: "14", followers: "920", joined: "Joined 3 months ago" }
  },
  {
    name: "Sofia Martinez",
    username: "sofia_ml",
    email: "sofia@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    bio: "Data Scientist passionate about computer vision and generative art. Teaching models how to create.",
    skills: ["AI/ML", "Python", "TensorFlow", "OpenCV", "Scikit-Learn"],
    githubUrl: "https://github.com",
    portfolioUrl: "",
    isVerified: true,
    stats: { projects: "27", reviews: "102", followers: "7.8k", joined: "Joined 2 years ago" }
  },
  {
    name: "James Wilson",
    username: "jwilson_stack",
    email: "james@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    bio: "Pragmatic full stack developer focused on business outcomes. Creating clean dashboards and APIs.",
    skills: ["Full Stack", "Laravel", "Vue.js", "Tailwind CSS", "MySQL", "InertiaJS"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: false,
    stats: { projects: "45", reviews: "115", followers: "5.4k", joined: "Joined 1 year ago" }
  },
  {
    name: "Yuki Tanaka",
    username: "yuki_oss",
    email: "yuki@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    bio: "Linux kernel tinkerer and system level Rust programmer. Loving memory safety without GC.",
    skills: ["Open Source", "Backend", "Rust", "C++", "WebAssembly", "Linux"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "89", reviews: "412", followers: "31.5k", joined: "Joined 5 years ago" }
  },
  {
    name: "Chloe Dupont",
    username: "chloe_ui",
    email: "chloe@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    bio: "Obsessed with layouts, motion design, and typography. Creating web experiences that feel alive.",
    skills: ["UI/UX", "Frontend", "Svelte", "Three.js", "WebGL", "Framer Motion"],
    githubUrl: "",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "34", reviews: "96", followers: "9.3k", joined: "Joined 1 year ago" }
  },
  {
    name: "Ryan Patel",
    username: "ryan_dev",
    email: "ryan@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&auto=format&fit=crop&q=80",
    bio: "Senior iOS Engineer. Architecting swift workflows and offline-first reactive mobile applications.",
    skills: ["Mobile", "Swift", "Objective-C", "CoreData", "Combine"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "21", reviews: "73", followers: "4.9k", joined: "Joined 2 years ago" }
  },
  {
    name: "Emma Watson",
    username: "emma_codes",
    email: "emma@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80",
    bio: "CS Sophomore learning the ropes of cloud architecture. AWS certification aspirant.",
    skills: ["Student", "Frontend", "React", "JavaScript", "HTML/CSS"],
    githubUrl: "https://github.com",
    portfolioUrl: "",
    isVerified: false,
    stats: { projects: "6", reviews: "5", followers: "340", joined: "Joined 2 months ago" }
  },
  {
    name: "Liam O'Connor",
    username: "liam_backend",
    email: "liam@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
    bio: "API reliability enthusiast. Building resilient software backends with enterprise Java & Spring Boot.",
    skills: ["Backend", "Java", "Spring Boot", "Kafka", "Redis", "Elasticsearch"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "18", reviews: "61", followers: "3.7k", joined: "Joined 1 year ago" }
  },
  {
    name: "Zoe Wang",
    username: "zoe_fullstack",
    email: "zoe@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&auto=format&fit=crop&q=80",
    bio: "Full Stack Wizard. Shipping highly stable products with Next.js, Prisma, and serverless edge functions.",
    skills: ["Full Stack", "Next.js", "Prisma", "PostgreSQL", "Tailwind CSS", "GraphQL"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "41", reviews: "144", followers: "11.2k", joined: "Joined 2 years ago" }
  },
  {
    name: "Niko Tesla",
    username: "niko_ml",
    email: "niko@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    bio: "Deep learning engineer specialized in natural language processing and transformer architectures.",
    skills: ["AI/ML", "NLP", "Transformers", "Python", "HuggingFace"],
    githubUrl: "https://github.com",
    portfolioUrl: "",
    isVerified: false,
    stats: { projects: "15", reviews: "49", followers: "2.8k", joined: "Joined 8 months ago" }
  },
  {
    name: "Nina Simone",
    username: "nina_oss",
    email: "nina@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "DevOps specialist turned open source developer. Making CI/CD pipelines blazingly fast.",
    skills: ["Open Source", "GitHub Actions", "Terraform", "Bash", "Docker"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "52", reviews: "198", followers: "14.1k", joined: "Joined 3 years ago" }
  },
  {
    name: "Vikram Singh",
    username: "vikram_ui",
    email: "vikram@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    bio: "Creative Developer crafting immersive interactive WebGL spaces. Blending engineering and fine art.",
    skills: ["UI/UX", "Frontend", "Three.js", "WebGPU", "Blender", "GSAP"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "29", reviews: "112", followers: "8.7k", joined: "Joined 1 year ago" }
  },
  {
    name: "Owen Wright",
    username: "owen_mobile",
    email: "owen@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Android fanatic. Building hyper-optimized Kotlin applications with modern Jetpack Compose layouts.",
    skills: ["Mobile", "Kotlin", "Jetpack Compose", "Coroutines", "Dagger Hilt"],
    githubUrl: "https://github.com",
    portfolioUrl: "",
    isVerified: false,
    stats: { projects: "14", reviews: "32", followers: "1.9k", joined: "Joined 10 months ago" }
  },
  {
    name: "Maya Lin",
    username: "maya_student",
    email: "maya@devreview.io",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "Final year student experimenting with systems programming and full-stack TypeScript engineering.",
    skills: ["Student", "Full Stack", "TypeScript", "Node.js", "React", "Rust"],
    githubUrl: "https://github.com",
    portfolioUrl: "https://portfolio.com",
    isVerified: true,
    stats: { projects: "11", reviews: "23", followers: "1.2k", joined: "Joined 7 months ago" }
  }
];

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "AI/ML",
  "UI/UX",
  "Open Source",
  "Student"
];

// ==========================================
// MAIN EXPLORE COMPONENT
// ==========================================
export default function ExploreUsers() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [followingState, setFollowingState] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter Logic: Instantly filter based on category pills and search inputs
  const filteredDevelopers = developersData.filter((dev) => {
    const matchesCategory =
      selectedFilter === "All" || dev.skills.includes(selectedFilter);

    const normQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !normQuery ||
      dev.name.toLowerCase().includes(normQuery) ||
      dev.username.toLowerCase().includes(normQuery) ||
      dev.skills.some((skill) => skill.toLowerCase().includes(normQuery));

    return matchesCategory && matchesSearch;
  });

  const toggleFollow = (username) => {
    setFollowingState((prev) => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  // Animation variants for Staggered list
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] px-4 py-12 md:px-8 max-w-7xl mx-auto selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      
      {/* ==========================================
          HEADER SECTION
         ========================================== */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/5 border border-[#2563EB]/10 text-[#2563EB] font-medium text-xs mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover Elite Tech Talent</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#111827] via-[#111827] to-[#2563EB]"
        >
          Explore Top Developers
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base text-[#6B7280] font-medium"
        >
          Connect, review, and collaborate with standard-setting creators from around the world.
        </motion.p>
      </div>

      {/* ==========================================
          SEARCH BAR
         ========================================== */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="max-w-2xl mx-auto mb-8 relative group"
      >
        <div className="absolute inset-0 bg-[#2563EB]/5 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#2563EB] transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, username or skill..."
          className="w-full pl-12 pr-4 py-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl text-sm font-medium placeholder:text-[#6B7280]/70 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/5 transition-all shadow-sm"
        />
      </motion.div>

      {/* ==========================================
          CATEGORY FILTERS
         ========================================== */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar mask-image-edge"
      >
        {categories.map((category) => {
          const isActive = selectedFilter === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] shadow-md shadow-[#2563EB]/10 scale-105"
                  : "bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:bg-[#F1F5F9] hover:text-[#111827] hover:border-[#6B7280]/20"
              }`}
            >
              {category}
            </button>
          );
        })}
      </motion.div>

      {/* ==========================================
          LOADING SKELETON LAYER
         ========================================== */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton-grid"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <div 
                key={idx} 
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between h-[380px] overflow-hidden relative shadow-sm"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent" />
                
                <div>
                  {/* Top Stats Skeleton */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#F1F5F9] animate-pulse" />
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded bg-[#F1F5F9] animate-pulse" />
                      <div className="w-6 h-6 rounded bg-[#F1F5F9] animate-pulse" />
                    </div>
                  </div>

                  {/* Name & Username */}
                  <div className="w-2/3 h-5 bg-[#F1F5F9] rounded animate-pulse mb-1.5" />
                  <div className="w-1/3 h-3.5 bg-[#F1F5F9] rounded animate-pulse mb-4" />

                  {/* Bio */}
                  <div className="w-full h-3 bg-[#F1F5F9] rounded animate-pulse mb-2" />
                  <div className="w-5/6 h-3 bg-[#F1F5F9] rounded animate-pulse mb-5" />

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <div className="w-14 h-5 bg-[#F1F5F9] rounded-md animate-pulse" />
                    <div className="w-12 h-5 bg-[#F1F5F9] rounded-md animate-pulse" />
                    <div className="w-16 h-5 bg-[#F1F5F9] rounded-md animate-pulse" />
                  </div>
                </div>

                <div>
                  {/* Divider */}
                  <div className="w-full h-[1px] bg-[#F1F5F9] mb-4" />
                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 bg-[#F1F5F9] rounded-lg animate-pulse" />
                    <div className="h-9 bg-[#F1F5F9] rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* ==========================================
              ACTUAL RENDERED DEVELOPERS GRID
             ========================================== */
          <motion.div
            key="real-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredDevelopers.map((dev) => {
              const isFollowing = followingState[dev.username] || false;
              
              return (
                <motion.div
                  key={dev.username}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -6, 
                    borderColor: "#2563EB", 
                    boxShadow: "0 12px 30px -10px rgba(37,99,235,0.12)" 
                  }}
                  className="group bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative shadow-sm hover:z-10"
                >
                  <div>
                    {/* Card Top Section (Image, Icons, Verified Badge) */}
                    <div className="flex justify-between items-start mb-3.5">
                      <div className="relative rounded-full overflow-hidden w-14 h-14 border-2 border-transparent group-hover:border-[#2563EB]/10 transition-colors duration-300">
                        <img
                          src={dev.profileImage}
                          alt={dev.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex gap-1">
                        {dev.githubUrl && (
                          <a 
                            href={dev.githubUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg border border-[#E5E7EB] transition-colors"
                          >
                            <GitBranch className="w-4 h-4" />
                          </a>
                        )}
                        {dev.portfolioUrl && (
                          <a 
                            href={dev.portfolioUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1.5 text-[#6B7280] hover:text-[#3B82F6] bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg border border-[#E5E7EB] transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Developer Metadata */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-[#111827] text-[15px] tracking-tight group-hover:text-[#2563EB] transition-colors duration-200">
                        {dev.name}
                      </h3>
                      {dev.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-[#2563EB] fill-[#2563EB]/10 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#6B7280] mb-3">@{dev.username}</p>
                    
                    {/* Bio */}
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 min-h-[36px] mb-4">
                      {dev.bio}
                    </p>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5 min-h-[54px] content-start">
                      {dev.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#111827] text-[10px] font-bold border border-[#E5E7EB] group-hover:border-[#2563EB]/20 group-hover:bg-[#2563EB]/5 transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {dev.skills.length > 5 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#F8FAFC] text-[#6B7280] text-[10px] font-medium border border-[#E5E7EB]">
                          +{dev.skills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* Dummy Metrics Tracker Row */}
                    <div className="grid grid-cols-3 gap-1 border-t border-[#F1F5F9] pt-3.5 mb-4 text-center">
                      <div>
                        <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Proj</p>
                        <p className="text-xs font-bold text-[#111827] mt-0.5">{dev.stats.projects}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Rev</p>
                        <p className="text-xs font-bold text-[#111827] mt-0.5 flex items-center justify-center gap-0.5">
                          {dev.stats.reviews}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Fol</p>
                        <p className="text-xs font-bold text-[#111827] mt-0.5">{dev.stats.followers}</p>
                      </div>
                    </div>

                    {/* CTA Actions Block */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => toggleFollow(dev.username)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all duration-300 ${
                          isFollowing
                            ? "bg-[#22C55E] text-[#FFFFFF] border-[#22C55E] shadow-sm shadow-[#22C55E]/10"
                            : "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] hover:bg-[#3B82F6] hover:border-[#3B82F6] shadow-sm shadow-[#2563EB]/10"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>

                      <button className="w-full py-2 px-3 bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-xs font-bold rounded-xl hover:bg-[#F1F5F9] hover:text-[#2563EB] hover:border-[#2563EB]/30 flex items-center justify-center gap-1 transition-all duration-200">
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                    
                    <div className="text-[10px] text-[#6B7280]/70 text-center mt-3 font-medium">
                      {dev.stats.joined}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          EMPTY STATE DESIGNED FOR SEARCH REJECTIONS
         ========================================== */}
      {!loading && filteredDevelopers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-24 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] border-dashed max-w-xl mx-auto p-8 shadow-sm mt-6"
        >
          <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center mx-auto mb-4 text-[#6B7280]">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#111827] mb-1">No developers found.</h3>
          <p className="text-xs text-[#6B7280] font-medium">Try searching another skill, domain, or developer moniker.</p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedFilter("All"); }}
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#3B82F6] transition-colors"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
}