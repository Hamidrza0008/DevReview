"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Tag, FileText, MessageSquare, Send, CheckCircle2, LifeBuoy, ChevronDown, LoaderCircle } from "lucide-react";
import { supportRequestsApi } from "@/services/supportApis";

const CATEGORIES = [
  { label: "Bug", value: "bug" },
  { label: "Feature", value: "feature" },
  { label: "Feedback", value: "feedback" },
  { label: "Support", value: "support" },
];

const buildInitialForm = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  category: CATEGORIES[0].value,
  subject: "",
  message: "",
});

export default function SupportModal({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState(() => buildInitialForm(user));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFormData(buildInitialForm(user));
      setErrors({});
      setSubmitted(false);
      setIsSubmitting(false);
      setSubmitError("");
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => onClose(), 2200);
    return () => clearTimeout(timer);
  }, [submitted, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.subject.trim()) newErrors.subject = "Required";
    if (!formData.message.trim()) newErrors.message = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await supportRequestsApi(formData);
      console.log(res)
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Unable to send your support request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 md:backdrop-blur-sm z-100"
          />

          <div className="fixed inset-0 z-101 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="pointer-events-auto w-full sm:max-w-lg max-h-[92vh] overflow-y-auto custom-scrollbar bg-surface border border-line rounded-t-3xl sm:rounded-3xl shadow-2xl relative"
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-modal-title"
            >
              <div className="flex items-center gap-3 px-5 sm:px-6 py-5 border-b border-line sticky top-0 bg-surface z-10 rounded-t-3xl">
                <div className="w-10 h-10 bg-accent-soft border border-accent/20 rounded-xl flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 id="support-modal-title" className="text-base font-extrabold text-ink tracking-tight">
                    Contact Support
                  </h2>
                  <p className="text-xs text-muted">We usually respond within a day.</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-page transition-all shrink-0 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="px-6 py-14 text-center space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
                      className="w-16 h-16 bg-ok/10 text-ok rounded-full flex items-center justify-center mx-auto"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-ink">Message sent!</h3>
                      <p className="text-sm text-muted leading-relaxed max-w-sm mx-auto">
                        Thank you for reaching out! We&apos;ve received your request and will contact you via email if needed.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="px-5 sm:px-6 py-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                          Name <span className="text-danger">*</span>
                        </label>
                        <div className="relative group">
                          <User
                            className={`absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 transition-colors ${errors.name ? "text-danger" : "text-muted group-focus-within:text-accent"
                              }`}
                          />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className={`w-full pl-9 pr-3 py-2 bg-page border rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${errors.name ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                              }`}
                          />
                        </div>
                        {errors.name && <p className="text-[11px] text-danger font-semibold mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                          Email <span className="text-danger">*</span>
                        </label>
                        <div className="relative group">
                          <Mail
                            className={`absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 transition-colors ${errors.email ? "text-danger" : "text-muted group-focus-within:text-accent"
                              }`}
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`w-full pl-9 pr-3 py-2 bg-page border rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${errors.email ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                              }`}
                          />
                        </div>
                        {errors.email && <p className="text-[11px] text-danger font-semibold mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">Category</label>
                      <div className="relative group">
                        <Tag className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-muted group-focus-within:text-accent transition-colors pointer-events-none" />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full pl-9 pr-8 py-2 bg-page border border-line rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:border-accent focus:ring-2 focus:ring-accent/20 appearance-none cursor-pointer"
                        >
                          {CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-muted pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                        Subject <span className="text-danger">*</span>
                      </label>
                      <div className="relative group">
                        <FileText
                          className={`absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 transition-colors ${errors.subject ? "text-danger" : "text-muted group-focus-within:text-accent"
                            }`}
                        />
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Brief summary of your request"
                          className={`w-full pl-9 pr-3 py-2 bg-page border rounded-lg text-sm transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${errors.subject ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                            }`}
                        />
                      </div>
                      {errors.subject && <p className="text-[11px] text-danger font-semibold mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                        Message <span className="text-danger">*</span>
                      </label>
                      <div className="relative group">
                        <MessageSquare
                          className={`absolute top-2.5 left-3 w-4 h-4 transition-colors ${errors.message ? "text-danger" : "text-muted group-focus-within:text-accent"
                            }`}
                        />
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more..."
                          className={`w-full pl-9 pr-3 py-2 bg-page border rounded-lg text-sm resize-none transition-all focus:outline-none focus:bg-surface focus:ring-2 focus:ring-accent/20 ${errors.message ? "border-danger/40 focus:border-danger bg-danger/5" : "border-line focus:border-accent"
                            }`}
                        />
                      </div>
                      {errors.message && <p className="text-[11px] text-danger font-semibold mt-1">{errors.message}</p>}
                    </div>

                    {submitError && (
                      <p role="alert" className="text-sm font-semibold text-danger">
                        {submitError}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-muted bg-surface border border-line rounded-lg hover:bg-page hover:text-ink transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-accent-ink bg-accent rounded-lg shadow-sm hover:brightness-110 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
