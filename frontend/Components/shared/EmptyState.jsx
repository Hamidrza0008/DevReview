"use client";

import React from "react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className = "",
}) {
  return (
    <div
      className={`bg-surface border border-dashed border-line rounded-2xl p-8 sm:p-10 text-center space-y-4 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-page border border-line rounded-2xl flex items-center justify-center mx-auto text-muted">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="font-bold text-sm sm:text-base text-ink">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto">
            {description}
          </p>
        )}
      </div>
      {action && actionLabel && (
        <button
          onClick={action}
          className="mt-3 sm:mt-4 bg-ink hover:brightness-125 text-page text-xs font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
