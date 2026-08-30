"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck, Heart, MessageSquareText, UserPlus, AlertCircle } from "lucide-react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/getNotificationsApi";

const typeStyles = {
  like: { icon: Heart, color: "text-like", bg: "bg-like/10", label: "Like", message: "liked your project" },
  review: { icon: MessageSquareText, color: "text-accent", bg: "bg-accent-soft", label: "Review", message: "reviewed your project" },
  follow: { icon: UserPlus, color: "text-info", bg: "bg-info/10", label: "Follow", message: "started following you" },
};

function formatTime(date) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function NotificationItem({ item, index, compact = false, onRead }) {
  const router = useRouter();
  const style = typeStyles[item.type];
  if (!style) return null;
  const Icon = style.icon;
  const name = item.sender?.name || "A developer";
  const initials = name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const destination = item.type === "follow"
    ? item.sender?.username && `/users/${item.sender.username}`
    : item.project?._id && `/projects/${item.project._id}`;

  const openNotification = async () => {
    if (!item.isRead) await onRead(item._id);
    if (destination) router.push(destination);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={openNotification}
      onKeyDown={(event) => {
        if (destination && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          openNotification();
        }
      }}
      role={destination ? "link" : undefined}
      tabIndex={destination ? 0 : undefined}
      className={`relative flex gap-3 sm:gap-4 transition-colors group ${destination ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent" : ""} ${compact ? "p-4" : "p-4 sm:p-5"} ${!item.isRead ? "bg-accent-soft/35" : "hover:bg-page/70"}`}
    >
      {!item.isRead && <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-accent" />}
      <div className="relative shrink-0">
        {item.sender?.profileImage ? (
          <Image src={item.sender.profileImage} alt={name} width={48} height={48} className={`${compact ? "w-10 h-10 rounded-xl" : "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl"} object-cover border border-line`} />
        ) : (
          <div className={`${compact ? "w-10 h-10 rounded-xl" : "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl"} bg-linear-to-br from-accent/15 to-accent-2/15 border border-line flex items-center justify-center text-sm font-extrabold text-accent`}>{initials}</div>
        )}
        <span className={`absolute -right-1.5 -bottom-1.5 w-6 h-6 rounded-lg ${style.bg} ${style.color} border-2 border-surface flex items-center justify-center`}>
          <Icon className={`w-3.5 h-3.5 ${item.type === "like" ? "fill-current" : ""}`} />
        </span>
      </div>
      <div className="min-w-0 flex-1 sm:pr-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm leading-6 text-muted">
            <span className="font-extrabold text-ink group-hover:text-accent transition-colors">{name}</span>{" "}
            {style.message}{" "}
            {item.project?.title && <span className="font-bold text-ink">{item.project.title}</span>}
          </p>
          {!item.isRead && <span className="mt-2 w-2 h-2 rounded-full bg-accent shrink-0" />}
        </div>
        <div className="mt-2.5 flex items-center gap-3">
          <span className="text-[11px] font-semibold text-muted">{formatTime(item.createdAt)}</span>
          <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>{style.label}</span>
        </div>
      </div>
      {item.isRead && <Check className="hidden sm:block absolute right-4 top-5 w-4 h-4 text-muted/50" />}
    </motion.article>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getNotifications()
      .then((response) => {
        if (response?.success && Array.isArray(response.notifications)) {
          setNotifications(response.notifications);
        } else {
          setError("Failed to load notifications.");
        }
      })
      .catch(() => setError("Failed to load notifications. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const filtered = useMemo(() => filter === "Unread" ? notifications.filter((item) => !item.isRead) : notifications, [filter, notifications]);
  const projectActivity = filtered.filter((item) => item.type === "like" || item.type === "review");
  const follows = filtered.filter((item) => item.type === "follow");

  const handleRead = async (id) => {
    setNotifications((items) => items.map((item) => item._id === id ? { ...item, isRead: true } : item));
    const res = await markNotificationRead(id);
    if (!res?.success) {
      setNotifications((items) => items.map((item) => item._id === id ? { ...item, isRead: false } : item));
    }
  };

  const handleReadAll = async () => {
    const previous = notifications;
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    const res = await markAllNotificationsRead();
    if (!res?.success) setNotifications(previous);
  };

  return (
    <div className="min-h-screen bg-page text-ink p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="relative w-11 h-11 rounded-2xl bg-accent-soft text-accent flex items-center justify-center border border-accent/15">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-ink text-[10px] font-extrabold flex items-center justify-center ring-2 ring-page">{unreadCount}</span>}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted mt-1">Your latest project and community activity.</p>
          </div>
          {unreadCount > 0 && <button type="button" onClick={handleReadAll} className="ml-auto text-xs font-bold text-accent hover:underline">Mark all as read</button>}
        </motion.header>

        <div className="border-b border-line flex items-center gap-6 mb-6">
          {["All", "Unread"].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className={`relative pb-3 text-xs font-bold cursor-pointer ${filter === tab ? "text-accent" : "text-muted hover:text-ink"}`}>
              {tab} {tab === "Unread" && unreadCount ? `(${unreadCount})` : ""}
              {filter === tab && <motion.span layoutId="notification-tab" className="absolute bottom-0 inset-x-0 h-0.5 bg-accent" />}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-pulse"><div className="xl:col-span-2 h-64 rounded-2xl bg-surface border border-line" /><div className="h-40 rounded-2xl bg-surface border border-line" /></div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-7 h-7 text-danger mx-auto mb-3" />
            <h2 className="font-bold text-danger">{error}</h2>
            <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-accent text-accent-ink text-xs font-bold rounded-xl">Retry</button>
          </div>
        ) : filtered.length ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <section className="xl:col-span-2">
              <div className="flex items-center gap-2 mb-3 px-1"><Heart className="w-4 h-4 text-like" /><h2 className="text-sm font-extrabold">Likes &amp; Reviews</h2><span className="text-[10px] font-bold text-muted bg-surface border border-line rounded-full px-2 py-0.5">{projectActivity.length}</span></div>
              <div className="bg-surface border border-line rounded-2xl overflow-hidden divide-y divide-line">
                {projectActivity.length ? projectActivity.map((item, index) => <NotificationItem key={item._id} item={item} index={index} onRead={handleRead} />) : <p className="p-10 text-center text-sm text-muted">No likes or reviews yet.</p>}
              </div>
            </section>
            <section>
              <div className="flex items-center gap-2 mb-3 px-1"><UserPlus className="w-4 h-4 text-info" /><h2 className="text-sm font-extrabold">New Followers</h2><span className="text-[10px] font-bold text-muted bg-surface border border-line rounded-full px-2 py-0.5">{follows.length}</span></div>
              <div className="bg-surface border border-line rounded-2xl overflow-hidden divide-y divide-line">
                {follows.length ? follows.map((item, index) => <NotificationItem key={item._id} item={item} index={index} compact onRead={handleRead} />) : <p className="p-10 text-center text-sm text-muted">No new followers yet.</p>}
              </div>
            </section>
          </div>
        ) : (
          <div className="py-16 text-center"><CheckCheck className="w-7 h-7 text-muted mx-auto mb-3" /><h2 className="font-bold">No notifications yet</h2><p className="text-sm text-muted mt-1">Your new activity will appear here.</p></div>
        )}
      </div>
    </div>
  );
}
