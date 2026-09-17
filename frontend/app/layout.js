import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://devreview.app"),
  title: {
    default: "DevReview — Get Honest Code Reviews from Developers",
    template: "%s | DevReview",
  },
  description:
    "Showcase your projects, get honest feedback from real developers, and improve your skills. DevReview is a community-driven code review platform.",
  keywords: [
    "code review",
    "developer feedback",
    "project showcase",
    "developer community",
    "code quality",
    "peer review",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevReview",
    title: "DevReview — Get Honest Code Reviews from Developers",
    description:
      "Showcase your projects, get honest feedback from real developers, and improve your skills.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevReview — Get Honest Code Reviews from Developers",
    description:
      "Showcase your projects, get honest feedback from real developers, and improve your skills.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem("devreview-theme");
    var isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head />
      <body
        className="min-h-full flex flex-col bg-page text-ink"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-ink focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
        >
          Skip to content
        </a>
        {/* beforeInteractive script must live outside <head> when using app router */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
