"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorAlert({
  message,
  onRetry,
  retryLabel = "Retry",
  className = "",
}) {
  return (
    <div
      className={`bg-surface border border-line rounded-2xl p-6 sm:p-8 text-center space-y-4 ${className}`}
    >
      <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6 text-danger" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-sm text-ink">Something went wrong</h3>
        <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-accent text-accent-ink text-sm font-bold rounded-xl hover:brightness-110 transition-colors"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
