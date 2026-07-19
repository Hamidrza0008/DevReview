"use client";

import React from "react";
import { motion } from "framer-motion";
import SidebarSkeleton from "./SidebarSkeleton";
import SkeletonBox from "./SkeletonBox";

// Generic content rows for the main area. Deliberately has no
// Dashboard/Projects/etc-specific shape — this is what renders while we
// don't yet know which route the user is headed to.
const STAT_CARDS = [1, 2, 3];
const CONTENT_CARDS = [1, 2, 3];
const TABLE_ROWS = [1, 2, 3, 4, 5];

const mainVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.05 },
  },
};

const groupVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <SkeletonBox className="w-48 h-6 rounded" />
        <SkeletonBox className="w-72 h-3.5 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <SkeletonBox className="w-24 h-9 rounded-lg" />
        <SkeletonBox className="w-28 h-9 rounded-lg" />
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-surface border border-line rounded-xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <SkeletonBox className="w-9 h-9 rounded-lg" />
        <SkeletonBox className="w-12 h-3 rounded" />
      </div>
      <SkeletonBox className="w-20 h-5 rounded" />
      <SkeletonBox className="w-28 h-3 rounded" />
    </motion.div>
  );
}

function ContentCardSkeleton() {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-surface border border-line rounded-xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <SkeletonBox className="w-32 h-4 rounded" />
        <SkeletonBox className="w-16 h-3 rounded" />
      </div>
      <SkeletonBox className="w-full h-3 rounded" />
      <SkeletonBox className="w-11/12 h-3 rounded" />
      <SkeletonBox className="w-2/3 h-3 rounded" />
    </motion.div>
  );
}

function TableSkeleton() {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-surface border border-line rounded-xl overflow-hidden"
    >
      {/* Table header */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-line bg-page/60">
        <SkeletonBox className="w-1/3 h-3 rounded" />
        <SkeletonBox className="w-1/6 h-3 rounded" />
        <SkeletonBox className="w-1/6 h-3 rounded" />
        <SkeletonBox className="w-1/6 h-3 rounded" />
      </div>

      {/* Table rows */}
      <div className="flex flex-col">
        {TABLE_ROWS.map((row) => (
          <div
            key={row}
            className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-b-0"
          >
            <div className="w-1/3 flex items-center gap-3">
              <SkeletonBox className="w-7 h-7 rounded-full flex-shrink-0" />
              <SkeletonBox className="w-2/3 h-3 rounded" />
            </div>
            <SkeletonBox className="w-1/6 h-3 rounded" />
            <SkeletonBox className="w-1/6 h-3 rounded" />
            <SkeletonBox className="w-1/6 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function AppShellSkeleton() {
  return (
    <div className="min-h-screen bg-page">
      {/* Left: fixed sidebar skeleton, untouched structure/spacing */}
      <SidebarSkeleton />

      {/* Right: neutral generic page skeleton, route-agnostic */}
      <motion.main
        variants={mainVariants}
        initial="hidden"
        animate="visible"
        className="md:ml-64 min-h-screen px-6 md:px-10 py-8 flex flex-col gap-8"
      >
        <PageHeaderSkeleton />

        {/* Top stat row */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {STAT_CARDS.map((id) => (
            <StatCardSkeleton key={id} />
          ))}
        </motion.div>

        {/* Generic content cards */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {CONTENT_CARDS.map((id) => (
            <ContentCardSkeleton key={id} />
          ))}
        </motion.div>

        {/* Generic table placeholder */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          <TableSkeleton />
        </motion.div>
      </motion.main>
    </div>
  );
}
