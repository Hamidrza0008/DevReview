"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Heart,
  MessageSquareText,
  Star,
  UserPlus,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "like",
    name: "Aarav Mehta",
    initials: "AM",
    message: "liked your project",
    target: "TaskFlow — Team Workspace",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "review",
    name: "Priya Sharma",
    initials: "PS",
    message: "left a 5-star review on",
    target: "Finance Tracker",
    review: "The dashboard feels polished and the data visualization is super clear!",
    time: "18 min ago",
    unread: true,
  },
  {
    id: 3,
    type: "follow",
    name: "Kabir Singh",
    initials: "KS",
    message: "started following you",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 4,
    type: "review",
    name: "Neha Verma",
    initials: "NV",
    message: "reviewed your project",
    target: "DevPortfolio",
    review: "Beautiful UI and great attention to responsive details.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    type: "like",
    name: "Rohan Gupta",
    initials: "RG",
    message: "liked your project",
    target: "Realtime Chat App",
    time: "2 days ago",
    unread: false,
  },
];

const typeStyles = {
  like: { icon: Heart, color: "text-like", bg: "bg-like/10", label: "Like" },
  review: { icon: MessageSquareText, color: "text-accent", bg: "bg-accent-soft", label: "Review" },
  follow: { icon: UserPlus, color: "text-info", bg: "bg-info/10", label: "Follow" },
};

function NotificationItem({ item, index, onRead, compact = false }) {
  const style = typeStyles[item.type];
  const TypeIcon = style.icon;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onRead(item.id)}
      className={`relative flex gap-3 sm:gap-4 cursor-pointer transition-colors group ${compact ? "p-4" : "p-4 sm:p-5"} ${item.unread ? "bg-accent-soft/35 hover:bg-accent-soft/55" : "hover:bg-page/70"}`}
    >
      {item.unread && <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-accent" />}
      <div className="relative shrink-0">
        <div className={`${compact ? "w-10 h-10 rounded-xl" : "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl"} bg-linear-to-br from-accent/15 to-accent-2/15 border border-line flex items-center justify-center text-sm font-extrabold text-accent`}>
          {item.initials}
        </div>
        <span className={`absolute -right-1.5 -bottom-1.5 w-6 h-6 rounded-lg ${style.bg} ${style.color} border-2 border-surface flex items-center justify-center`}>
          <TypeIcon className={`w-3.5 h-3.5 ${item.type === "like" ? "fill-current" : ""}`} />
        </span>
      </div>
      <div className="min-w-0 flex-1 sm:pr-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm leading-6 text-muted">
            <span className="font-extrabold text-ink group-hover:text-accent transition-colors">{item.name}</span>{" "}
            {item.message}{" "}
            {item.target && <span className="font-bold text-ink">{item.target}</span>}
          </p>
          {item.unread && <span className="mt-2 w-2 h-2 rounded-full bg-accent shrink-0 shadow-[0_0_8px_rgba(47,111,78,0.45)]" />}
        </div>
        {item.review && (
          <div className="mt-2.5 p-3 rounded-xl bg-page border border-line text-xs sm:text-sm text-muted leading-relaxed">
            <span className="inline-flex mr-2 align-middle">
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-3 h-3 text-star fill-star" />)}
            </span>
            &ldquo;{item.review}&rdquo;
          </div>
        )}
        <div className="mt-2.5 flex items-center gap-3">
          <span className="text-[11px] font-semibold text-muted">{item.time}</span>
          <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>{style.label}</span>
        </div>
      </div>
      {!item.unread && <Check className="hidden sm:block absolute right-4 top-5 w-4 h-4 text-muted/50" />}
    </motion.article>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter((item) => item.unread).length;
  const filtered = useMemo(() => {
    if (filter === "Unread") return notifications.filter((item) => item.unread);
    return notifications;
  }, [filter, notifications]);
  const projectActivity = filtered.filter((item) => item.type !== "follow");
  const follows = filtered.filter((item) => item.type === "follow");

  const markRead = (id) => {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  return (
    <div className="min-h-screen bg-page text-ink p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-accent-soft text-accent flex items-center justify-center border border-accent/15">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-ink text-[10px] font-extrabold flex items-center justify-center ring-2 ring-page">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Notifications</h1>
                <p className="text-sm text-muted mt-1">Your latest project and community activity.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))}
            disabled={!unreadCount}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-surface text-xs font-bold text-muted hover:text-accent hover:border-accent/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        </motion.header>

        <div className="border-b border-line flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-6">
              {["All", "Unread"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`relative pb-3 text-xs font-bold transition-colors cursor-pointer ${filter === tab ? "text-accent" : "text-muted hover:text-ink"}`}
                >
                  {tab} {tab === "Unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
                  {filter === tab && (
                    <motion.span layoutId="notification-tab" className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-accent" />
                  )}
                </button>
              ))}
            </div>
            <span className="hidden sm:block pb-3 text-[10px] font-bold uppercase tracking-widest text-muted">Recent activity</span>
        </div>

        {filtered.length ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <section className="xl:col-span-2">
              <div className="flex items-center gap-2 mb-3 px-1">
                <Heart className="w-4 h-4 text-like" />
                <h2 className="text-sm font-extrabold">Likes &amp; Reviews</h2>
                <span className="text-[10px] font-bold text-muted bg-surface border border-line rounded-full px-2 py-0.5">{projectActivity.length}</span>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.div layout className="bg-surface border-y sm:border border-line sm:rounded-2xl overflow-hidden divide-y divide-line">
                  {projectActivity.map((item, index) => <NotificationItem key={item.id} item={item} index={index} onRead={markRead} />)}
                </motion.div>
              </AnimatePresence>
            </section>

            <section className="xl:col-span-1">
              <div className="flex items-center gap-2 mb-3 px-1">
                <UserPlus className="w-4 h-4 text-info" />
                <h2 className="text-sm font-extrabold">New Followers</h2>
                <span className="text-[10px] font-bold text-muted bg-surface border border-line rounded-full px-2 py-0.5">{follows.length}</span>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.div layout className="bg-surface border-y sm:border border-line sm:rounded-2xl overflow-hidden divide-y divide-line">
                  {follows.length ? follows.map((item, index) => <NotificationItem key={item.id} item={item} index={index} onRead={markRead} compact />) : (
                    <p className="p-8 text-center text-sm text-muted">No new followers.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>
        ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-page border border-line flex items-center justify-center mx-auto text-muted mb-4">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-ink">You&apos;re all caught up</h2>
                <p className="text-sm text-muted mt-1">No unread notifications right now.</p>
              </motion.div>
        )}

        <p className="text-center text-[11px] text-muted mt-5">Showing your 5 most recent notifications</p>
      </div>
    </div>
  );
}
