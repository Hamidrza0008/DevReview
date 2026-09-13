"use client";

import React from "react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center group cursor-default ${className}`}
    >
      {Icon && (
        <Icon
          className={`w-4 h-4 mb-1 ${
            accent ? "text-accent" : "text-muted"
          } group-hover:text-accent transition-colors`}
        />
      )}
      <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-ink group-hover:text-accent transition-colors tabular-nums">
        {value}
      </span>
      <span className="text-[11px] sm:text-xs font-semibold text-muted lowercase">
        {label}
      </span>
    </div>
  );
}
