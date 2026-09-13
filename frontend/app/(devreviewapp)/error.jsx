"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function AppError({ error, reset }) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-danger" />
        </div>
        <h2 className="text-lg font-bold text-ink mb-2">Something went wrong</h2>
        <p className="text-sm text-muted mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-accent text-accent-ink text-sm font-bold rounded-xl hover:brightness-110 transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
