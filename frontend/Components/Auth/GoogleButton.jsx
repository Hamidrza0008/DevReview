"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { googleAuth } from "@/services/authApis";

export default function GoogleButton({ onError }) {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();
  const { fetchUser } = useAuth();
  const { theme } = useTheme();
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && !!window.google?.accounts?.id
  );
  const [buttonReady, setButtonReady] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCredentialResponse = async (response) => {
    setIsVerifying(true);
    try {
      const res = await googleAuth(response.credential);

      if (res.success) {
        await fetchUser();
        router.push("/dashboard");
      } else {
        setIsVerifying(false);
        onError?.(res.message || "Google sign-in failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setIsVerifying(false);
      onError?.("Something went wrong with Google sign-in.");
    }
  };

  // Fallback in case the Script component's onLoad fires before this
  // component mounts (e.g. script already cached from an earlier page).
  useEffect(() => {
    if (scriptReady) return;

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        setScriptReady(true);
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [scriptReady]);

  useEffect(() => {
    if (!scriptReady) return;

    const renderButton = () => {
      if (!buttonRef.current || !containerRef.current) return;

      const width = Math.min(Math.floor(containerRef.current.getBoundingClientRect().width) || 320, 400);

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: theme === "dark" ? "filled_black" : "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width,
      });
      setButtonReady(true);
    };

    renderButton();

    const observer = new ResizeObserver(renderButton);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, theme]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="w-full relative">
        {!buttonReady && <div className="w-full h-11 rounded-full bg-line animate-pulse" />}
        <div
          ref={buttonRef}
          className={`w-full flex justify-center transition-opacity ${buttonReady ? "" : "hidden"} ${
            isVerifying ? "opacity-40" : ""
          }`}
        />
        {isVerifying && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-page/80 backdrop-blur-sm text-sm font-semibold text-ink">
            <span className="w-4 h-4 border-2 border-ink/20 border-t-accent rounded-full animate-spin" />
            <span>Signing you in...</span>
          </div>
        )}
      </div>
    </>
  );
}
