import Link from "next/link";
import { FileQuestion } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-surface-2 border border-line rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-7 h-7 text-muted" />
        </div>
        <h2 className="text-lg font-bold text-ink mb-2">Page not found</h2>
        <p className="text-sm text-muted mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-5 py-2.5 bg-accent text-accent-ink text-sm font-bold rounded-xl hover:brightness-110 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
