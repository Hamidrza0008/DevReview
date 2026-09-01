"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MOCK_LEADERBOARD = [
  { rank: 1, _id: "u1", name: "Rahul Sharma", username: "rahul", profileImage: "", score: 950, projectPoints: 320, reviewPoints: 280, likePoints: 250, followerPoints: 100 },
  { rank: 2, _id: "u2", name: "Aman Verma", username: "aman", profileImage: "", score: 820, projectPoints: 280, reviewPoints: 240, likePoints: 200, followerPoints: 100 },
  { rank: 3, _id: "u3", name: "Hamid Raza", username: "hamid", profileImage: "", score: 760, projectPoints: 260, reviewPoints: 200, likePoints: 200, followerPoints: 100 },
  { rank: 4, _id: "u4", name: "Ankit Sharma", username: "ankit", profileImage: "", score: 720, projectPoints: 240, reviewPoints: 220, likePoints: 180, followerPoints: 80 },
  { rank: 5, _id: "u5", name: "Priya Singh", username: "priya", profileImage: "", score: 680, projectPoints: 220, reviewPoints: 200, likePoints: 180, followerPoints: 80 },
  { rank: 6, _id: "u6", name: "Arjun Kumar", username: "arjun", profileImage: "", score: 640, projectPoints: 200, reviewPoints: 180, likePoints: 180, followerPoints: 80 },
  { rank: 7, _id: "u7", name: "Rohit Verma", username: "rohit", profileImage: "", score: 610, projectPoints: 200, reviewPoints: 160, likePoints: 170, followerPoints: 80 },
  { rank: 8, _id: "u8", name: "Neha Gupta", username: "neha", profileImage: "", score: 590, projectPoints: 180, reviewPoints: 180, likePoints: 160, followerPoints: 70 },
  { rank: 9, _id: "u9", name: "Vikram Patel", username: "vikram", profileImage: "", score: 560, projectPoints: 180, reviewPoints: 160, likePoints: 150, followerPoints: 70 },
  { rank: 10, _id: "u10", name: "Sneha Reddy", username: "sneha", profileImage: "", score: 530, projectPoints: 160, reviewPoints: 150, likePoints: 150, followerPoints: 70 },
  { rank: 11, _id: "u11", name: "Karan Mehta", username: "karan", profileImage: "", score: 510, projectPoints: 160, reviewPoints: 140, likePoints: 140, followerPoints: 70 },
  { rank: 12, _id: "u12", name: "Ishita Jain", username: "ishita", profileImage: "", score: 490, projectPoints: 150, reviewPoints: 140, likePoints: 140, followerPoints: 60 },
  { rank: 13, _id: "u13", name: "Aditya Nair", username: "aditya", profileImage: "", score: 470, projectPoints: 140, reviewPoints: 130, likePoints: 140, followerPoints: 60 },
  { rank: 14, _id: "u14", name: "Pooja Das", username: "pooja", profileImage: "", score: 450, projectPoints: 140, reviewPoints: 120, likePoints: 130, followerPoints: 60 },
  { rank: 15, _id: "u15", name: "Sahil Khan", username: "sahil", profileImage: "", score: 430, projectPoints: 130, reviewPoints: 120, likePoints: 120, followerPoints: 60 },
];

const MOCK_MY_RANKING = {
  rank: 27,
  score: 485,
  projectPoints: 100,
  reviewPoints: 150,
  likePoints: 200,
  followerPoints: 35,
};

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarUrl(profileImage, name) {
  if (profileImage) return profileImage;
  const encoded = encodeURIComponent(name || "U");
  return `https://ui-avatars.com/api/?name=${encoded}&background=2F6F4E&color=fff&bold=true&size=128`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

const heroTextVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

function PodiumCard({ developer, position, isCurrentUser }) {
  const isFirst = position === 1;
  const medal = position === 1 ? Crown : position === 2 ? Medal : Medal;
  const medalColor = position === 1 ? "text-star" : position === 2 ? "text-muted" : "text-star/70";
  const medalLabel = position === 1 ? "1st" : position === 2 ? "2nd" : "3rd";
  const borderClass = position === 1 ? "border-star/30 shadow-star/10" : position === 2 ? "border-line shadow-2xs" : "border-line shadow-2xs";
  const sizeClass = isFirst
    ? "w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36"
    : "w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28";
  const nameSize = isFirst ? "text-sm sm:text-base lg:text-lg" : "text-xs sm:text-sm";
  const scoreSize = isFirst ? "text-lg sm:text-xl" : "text-sm sm:text-base";
  const Wrapper = isFirst ? "div" : "div";

  return (
    <Wrapper className={`flex flex-col items-center ${isFirst ? "order-2 -mt-4 sm:-mt-6 lg:-mt-8" : position === 2 ? "order-1" : "order-3"}`}>
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group"
      >
        <div className={`absolute -inset-2 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${position === 1 ? "bg-star/20" : "bg-accent/10"}`} />

        <div className={`relative ${sizeClass} rounded-full overflow-hidden border-4 ${borderClass} transition-all duration-300 ${isFirst ? "ring-4 ring-star/20" : ""}`}>
          <Image
            src={getAvatarUrl(developer.profileImage, developer.name)}
            alt={`${developer.name}'s avatar`}
            fill
            sizes="144px"
            className="object-cover"
          />
        </div>

        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wide uppercase ${
          position === 1
            ? "bg-linear-to-r from-star to-amber-400 text-white shadow-lg shadow-star/30"
            : position === 2
              ? "bg-surface-2 text-ink border border-line"
              : "bg-surface-2 text-ink border border-line"
        }`}>
          {React.createElement(medal, { className: `w-3 h-3 ${medalColor}` })}
          {medalLabel}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mt-4 sm:mt-5">
        <p className={`${nameSize} font-bold text-ink tracking-tight`}>{developer.name}</p>
        <p className="text-xs text-muted font-medium">@{developer.username}</p>
        <p className={`${scoreSize} font-extrabold text-accent mt-1 tabular-nums`}>{developer.score} pts</p>
      </motion.div>
    </Wrapper>
  );
}

function LeaderboardRow({ developer, index }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2, backgroundColor: "var(--color-surface)" }}
      className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-colors duration-200 group"
    >
      <span className="w-7 sm:w-8 text-center text-sm font-extrabold text-muted tabular-nums">
        {developer.rank}
      </span>

      <div className="relative shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-surface shadow-sm">
          <Image
            src={getAvatarUrl(developer.profileImage, developer.name)}
            alt={`${developer.name}'s avatar`}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{developer.name}</p>
        <p className="text-[11px] text-muted font-medium truncate">@{developer.username}</p>
      </div>

      <div className="text-right shrink-0">
        <span className="text-sm font-extrabold text-accent tabular-nums">{developer.score}</span>
        <span className="text-[10px] text-muted font-semibold ml-1">pts</span>
      </div>
    </motion.div>
  );
}

function MyRankingCard({ ranking }) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-2xs"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent-soft border border-accent/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-accent" />
        </div>
        <h3 className="text-sm font-bold text-ink tracking-tight">Your Ranking</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-soft border border-accent/20 text-accent font-extrabold text-lg">
          #{ranking.rank}
        </div>
        <div>
          <p className="text-2xl font-extrabold text-accent tabular-nums">{ranking.score} <span className="text-sm font-semibold text-muted">pts</span></p>
          <p className="text-xs text-muted font-medium">Keep building to climb higher</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-page rounded-xl p-3 border border-line">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">Projects</p>
          <p className="text-sm font-extrabold text-ink tabular-nums">{ranking.projectPoints}</p>
        </div>
        <div className="bg-page rounded-xl p-3 border border-line">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">Reviews</p>
          <p className="text-sm font-extrabold text-ink tabular-nums">{ranking.reviewPoints}</p>
        </div>
        <div className="bg-page rounded-xl p-3 border border-line">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">Likes</p>
          <p className="text-sm font-extrabold text-ink tabular-nums">{ranking.likePoints}</p>
        </div>
        <div className="bg-page rounded-xl p-3 border border-line">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">Followers</p>
          <p className="text-sm font-extrabold text-ink tabular-nums">{ranking.followerPoints}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboardData] = useState(MOCK_LEADERBOARD);
  const [myRanking] = useState(MOCK_MY_RANKING);

  const topThree = useMemo(() => leaderboardData.slice(0, 3), [leaderboardData]);
  const restOfList = useMemo(() => leaderboardData.slice(3), [leaderboardData]);

  return (
    <div className="min-h-screen bg-page text-ink font-sans antialiased relative selection:bg-accent/20 selection:text-accent">
      <style jsx>{`
        .shimmer {
          background: linear-gradient(90deg, var(--color-surface-2) 25%, var(--color-line) 37%, var(--color-surface-2) 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none z-0" />

      <div className="hidden md:block fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] -right-[10%] w-[600px] h-[600px] bg-accent-2/20 rounded-full blur-[120px]"
        />
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{ backgroundImage: `radial-gradient(var(--color-muted) 1px, transparent 1px)`, backgroundSize: "28px 28px" }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-12">

        {/* Hero Section */}
        <motion.section
          className="text-center mb-10 lg:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={heroTextVariants} className="flex justify-center mb-4">
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface border border-accent/20 text-accent shadow-sm shadow-accent/10"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </motion.span>
              Community Rankings
            </motion.div>
          </motion.div>

          <motion.h1
            variants={heroTextVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight mb-3"
          >
            Developer{" "}
            <span className="bg-gradient-to-r from-accent via-accent to-accent-2 bg-clip-text text-transparent animate-gradient-x">
              Leaderboard
            </span>
          </motion.h1>

          <motion.p
            variants={heroTextVariants}
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed"
          >
            Discover the top developers making an impact on DevReview.
            See where you rank in the community.
          </motion.p>
        </motion.section>

        {/* Top 3 Podium */}
        <motion.section
          className="mb-10 lg:mb-14"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="flex items-end justify-center gap-4 sm:gap-6 lg:gap-10 mb-8">
            {topThree.map((dev) => (
              <PodiumCard
                key={dev._id}
                developer={dev}
                position={dev.rank}
              />
            ))}
          </motion.div>
        </motion.section>

        {/* Main Content: Leaderboard List + My Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Leaderboard List */}
          <motion.div
            className="lg:col-span-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-soft border border-accent/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-accent" />
              </div>
              <h2 className="text-sm font-bold text-ink tracking-tight">All Developers</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-accent-soft text-accent">{leaderboardData.length}</span>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-surface border border-line rounded-2xl overflow-hidden shadow-2xs">
              <div className="px-4 sm:px-5 py-3 border-b border-line flex items-center text-[10px] font-bold uppercase tracking-wider text-muted">
                <span className="w-7 sm:w-8 text-center">Rank</span>
                <span className="ml-3 sm:ml-4 flex-1">Developer</span>
                <span className="text-right">Score</span>
              </div>

              <div className="divide-y divide-line">
                {restOfList.map((dev, i) => (
                  <LeaderboardRow key={dev._id} developer={dev} index={i} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* My Ranking Sidebar */}
          <motion.div
            className="lg:col-span-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <MyRankingCard ranking={myRanking} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
