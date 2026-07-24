"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Lightbulb, HelpCircle, MessageCircle, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Inbox } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const categories = [
  { id: "bug", label: "Bug Report", icon: Bug },
  { id: "feature", label: "Feature Request", icon: Lightbulb },
  { id: "query", label: "Query", icon: HelpCircle },
  { id: "feedback", label: "General Feedback", icon: MessageCircle },
];

const STORAGE_KEY = "devreview_feedback_submissions";

function formatTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function Feedback() {
  const { user } = useAuth();

  const [category, setCategory] = useState("feedback");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [submissions, setSubmissions] = useState([]);

  // Load past submissions (this browser only — no backend yet)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSubmissions(stored);
    } catch {
      setSubmissions([]);
    }
  }, []);

  // Prefill from the logged-in user, still editable
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, type: "", message: "" }), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Enter a valid email";
    if (!formData.subject.trim()) next.subject = "Subject is required";
    if (!formData.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      id: `${Date.now()}`,
      category,
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    // No backend yet — logging so the developer can see submissions in the console for now.
    console.log("📩 New Feedback Submitted:", payload);

    setTimeout(() => {
      setSubmitting(false);
      setSubmissions((prev) => {
        const next = [payload, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      setToast({ show: true, type: "success", message: "Thanks! Your message has been logged — we'll get back to you." });
      setFormData((prev) => ({ ...prev, subject: "", message: "" }));
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100dvh-3.5rem)] md:h-screen flex flex-col overflow-hidden p-3 md:p-6 w-full text-ink"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-100 px-5 py-3 rounded-2xl shadow-lg border flex items-center gap-2 text-sm font-semibold md:backdrop-blur-md ${
              toast.type === "success"
                ? "bg-ok/10 border-ok/20 text-ink"
                : "bg-danger/10 border-danger/20 text-ink"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-ok shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-danger shrink-0" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="shrink-0 mb-2 md:mb-3">
        <h1 className="text-lg md:text-2xl font-bold tracking-tight">Feedback &amp; Support</h1>
        <p className="text-muted text-xs md:text-sm mt-0.5">
          Got a problem, a question, or an idea? Send it straight to the developer.
        </p>
      </div>

      {/* Body: submissions on the left, form on the right */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">

        {/* LEFT: What you've sent */}
        <div className="order-2 lg:order-1 min-h-0 flex flex-col bg-surface border border-line rounded-2xl p-3 md:p-4 overflow-hidden">
          <div className="shrink-0 flex items-center justify-between mb-2">
            <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted">Your Submissions</h2>
            {submissions.length > 0 && (
              <span className="text-[10px] text-muted">{submissions.length} sent</span>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">
            {submissions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-muted py-8">
                <Inbox className="w-7 h-7 opacity-40" />
                <p className="text-xs">Nothing sent yet — your messages will show up here.</p>
              </div>
            ) : (
              submissions.map((s) => {
                const cat = categories.find((c) => c.id === s.category);
                return (
                  <div key={s.id} className="shrink-0 bg-page border border-line rounded-xl p-2.5 md:p-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      {cat && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-soft text-accent border border-accent/20 shrink-0">
                          <cat.icon className="w-3 h-3" />
                          {cat.label}
                        </span>
                      )}
                      <span className="text-[10px] text-muted shrink-0">{formatTime(s.submittedAt)}</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-ink truncate">{s.subject}</p>
                    <p className="text-[11px] md:text-xs text-muted line-clamp-2 leading-relaxed">{s.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Form — sits opposite the sidebar */}
        <form
          onSubmit={handleSubmit}
          className="order-1 lg:order-2 min-h-0 bg-surface border border-line rounded-2xl shadow-sm p-3 md:p-5 flex flex-col gap-2.5 md:gap-3 overflow-y-auto"
        >
          {/* Category Pills */}
          <div className="shrink-0">
            <label className="text-[10px] font-bold uppercase tracking-wide text-muted mb-1.5 block">
              What's this about?
            </label>
            <div className="grid grid-cols-4 gap-1.5 md:gap-2">
              {categories.map((c) => {
                const Icon = c.icon;
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`flex flex-col items-center justify-center gap-1 py-1.5 md:py-2 px-1 rounded-lg border text-[10px] md:text-xs font-semibold transition-all duration-200 ${
                      active
                        ? "bg-accent-soft border-accent/40 text-accent shadow-sm"
                        : "bg-page border-line text-muted hover:border-accent/30 hover:text-ink"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="leading-tight text-center">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prefill notice — makes it explicit where Name/Email came from */}
          {user && (
            <div className="shrink-0 flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-accent bg-accent-soft border border-accent/20 rounded-lg px-2.5 py-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Auto-filled from your profile — feel free to edit
            </div>
          )}

          {/* Name + Email */}
          <div className="shrink-0 grid grid-cols-2 gap-2 md:gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted mb-1 block">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={`w-full px-3 py-1.5 md:py-2 bg-page border rounded-lg text-xs md:text-sm transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${
                  errors.name ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                }`}
              />
              {errors.name && <p className="text-[10px] text-danger mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-3 py-1.5 md:py-2 bg-page border rounded-lg text-xs md:text-sm transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${
                  errors.email ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                }`}
              />
              {errors.email && <p className="text-[10px] text-danger mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Subject */}
          <div className="shrink-0">
            <label className="text-[10px] font-bold uppercase tracking-wide text-muted mb-1 block">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Short summary"
              className={`w-full px-3 py-1.5 md:py-2 bg-page border rounded-lg text-xs md:text-sm transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${
                errors.subject ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
              }`}
            />
            {errors.subject && <p className="text-[10px] text-danger mt-1">{errors.subject}</p>}
          </div>

          {/* Message — fills whatever space is left so the card never overflows */}
          <div className="flex-1 min-h-0 flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wide text-muted mb-1 block shrink-0">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what's up..."
              className={`w-full flex-1 min-h-11 px-3 py-2 bg-page border rounded-lg text-xs md:text-sm resize-none transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${
                errors.message ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
              }`}
            />
            {errors.message && <p className="text-[10px] text-danger mt-1 shrink-0">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="shrink-0 px-5 py-2 md:py-2.5 bg-accent text-accent-ink font-semibold text-xs md:text-sm rounded-lg shadow-sm hover:brightness-110 transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Message
              </>
            )}
          </button>

          <p className="shrink-0 text-[10px] md:text-xs text-muted text-center">
            We're early stage — this currently logs to the developer directly, no ticket system yet.
          </p>
        </form>
      </div>
    </motion.div>
  );
}
