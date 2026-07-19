"use client";

import React from "react";
import { motion } from "framer-motion";
import SkeletonBox from "./SkeletonBox";

// Mirrors the real Sidebar.jsx menuItems array exactly (order + which item
// carries a badge). Only used here to know how many rows to render and
// where the badge skeleton goes — no icons/text are needed for a skeleton.
const menuItems = [
  { name: "Dashboard", hasBadge: false },
  { name: "Explore Projects", hasBadge: false },
  { name: "Users", hasBadge: false },
  { name: "My Projects", hasBadge: false },
  { name: "Reviews Received", hasBadge: true },
  { name: "Saved Projects", hasBadge: false },
  { name: "Community", hasBadge: false },
  { name: "Profile", hasBadge: false },
  { name: "Settings", hasBadge: false },
];

// Dashboard is shown active while data is loading, matching the real
// sidebar's default active route.
const ACTIVE_INDEX = 0;

const sidebarVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function SidebarSkeleton() {
  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-64 bg-page border-r border-line fixed top-0 bottom-0 left-0 z-40 flex-col justify-between hidden md:flex"
    >
      <div>
        {/* Logo Branding */}
        <div className="h-16 flex items-center px-6 border-b border-line">
          <div className="flex items-center gap-2.5">
            <SkeletonBox className="w-8 h-8 rounded-lg" />
            <div className="flex flex-col gap-1.5">
              <SkeletonBox className="w-20 h-3.5 rounded" />
              <SkeletonBox className="w-12 h-2.5 rounded" />
            </div>
          </div>
        </div>

        {/* Navigation Map */}
        <motion.nav
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="p-4 space-y-1"
        >
          {menuItems.map((item, index) => {
            const isActive = index === ACTIVE_INDEX;

            return (
              <motion.div
                key={item.name}
                variants={itemVariants}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl relative ${
                  isActive ? "bg-accent/5" : ""
                }`}
              >
                {/* Active left indicator, identical to the real sidebar */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-accent" />
                )}

                <div className="flex items-center gap-3">
                  <SkeletonBox className="w-4 h-4 rounded" />
                  <SkeletonBox
                    className={`h-3.5 rounded ${
                      isActive ? "w-24" : "w-20"
                    }`}
                  />
                </div>

                {item.hasBadge && (
                  <SkeletonBox className="w-5 h-4 rounded-full" />
                )}
              </motion.div>
            );
          })}
        </motion.nav>
      </div>

      {/* Embedded Fixed Mini Profile Summary skeleton */}
      <div className="p-4 border-t border-line bg-page/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <SkeletonBox className="w-9 h-9 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <SkeletonBox className="w-20 h-3 rounded" />
            <SkeletonBox className="w-24 h-2.5 rounded" />
          </div>
        </div>

        <SkeletonBox className="w-8 h-8 rounded-lg flex-shrink-0" />
      </div>
    </motion.aside>
  );
}
