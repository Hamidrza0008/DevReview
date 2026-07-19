"use client";

export default function SkeletonBox({
  className = "",
  rounded = "rounded-lg",
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-line
        ${rounded}
        ${className}
      `}
    >
      {/* Shimmer */}
      <div
        className="
          absolute
          inset-0
          -translate-x-full
          animate-[shimmer_1.6s_infinite]
          bg-linear-to-r
          from-transparent
          via-surface/70
          to-transparent
        "
      />
    </div>
  );
}
