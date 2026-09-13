"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    if (dialog) {
      const focusable = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialog) {
        const focusable = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocusRef.current) previousFocusRef.current.focus();
    };
  }, [isOpen, onClose]);

  const confirmStyles = {
    danger: "bg-danger text-accent-ink hover:brightness-110",
    warning: "bg-star text-ink hover:brightness-110",
    default: "bg-accent text-accent-ink hover:brightness-110",
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
            className="fixed inset-0 bg-black/50 md:backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="pointer-events-auto w-full sm:max-w-md bg-surface border border-line rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 space-y-5"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-desc"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  variant === "danger" ? "bg-danger/10" : variant === "warning" ? "bg-star/10" : "bg-accent-soft"
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    variant === "danger" ? "text-danger" : variant === "warning" ? "text-star" : "text-accent"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 id="confirm-dialog-title" className="text-base font-extrabold text-ink tracking-tight">
                    {title}
                  </h2>
                  <p id="confirm-dialog-desc" className="text-sm text-muted mt-1 leading-relaxed">
                    {message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-page transition-all shrink-0 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-muted bg-surface border border-line rounded-lg hover:bg-page hover:text-ink transition-all cursor-pointer"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => { onConfirm(); onClose(); }}
                  className={`px-5 py-2 text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer ${confirmStyles[variant] || confirmStyles.default}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
