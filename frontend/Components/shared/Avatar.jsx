"use client";

import React, { useState } from "react";
import Image from "next/image";

const SIZE_CLASSES = {
  xs: "w-6 h-6 text-[9px]",
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-12 h-12 text-sm",
  xl: "w-16 h-16 text-base",
};

export default function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
  ...props
}) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const sizeClasses = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={name || "Avatar"}
        width={64}
        height={64}
        className={`rounded-full object-cover ${sizeClasses} ${className}`}
        onError={() => setImgError(true)}
        {...props}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-accent-soft text-accent font-bold flex items-center justify-center ${sizeClasses} ${className}`}
      {...props}
    >
      {initials}
    </div>
  );
}
