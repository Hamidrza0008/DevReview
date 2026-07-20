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
  const [scriptReady, setScriptReady] = useState(false);
  const [width, setWidth] = useState(0);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await googleAuth(response.credential);

      if (res.success) {
        await fetchUser();
        router.push("/dashboard");
      } else {
        onError?.(res.message || "Google sign-in failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      onError?.("Something went wrong with Google sign-in.");
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const measured = Math.floor(entries[0].contentRect.width);
      if (measured > 0) setWidth(Math.min(measured, 400));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scriptReady || !window.google || !buttonRef.current || !width) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, theme, width]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="w-full flex justify-center">
        <div ref={buttonRef} />
      </div>
    </>
  );
}
