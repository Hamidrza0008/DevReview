'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor], iframe';

// Spring configs — tuned for buttery smooth feel
const DOT_SPRING   = { stiffness: 2500, damping: 50,  mass: 0.08 };
const RING_SPRING  = { stiffness: 500,  damping: 28,  mass: 0.25 };
const AURA_SPRING  = { stiffness: 100,  damping: 22,  mass: 0.6  };

export default function CustomCursor() {
  // Motion values — never cause React re-renders
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  const dotX  = useSpring(mouseX, DOT_SPRING);
  const dotY  = useSpring(mouseY, DOT_SPRING);

  const ringX = useSpring(mouseX, RING_SPRING);
  const ringY = useSpring(mouseY, RING_SPRING);

  const auraX = useSpring(mouseX, AURA_SPRING);
  const auraY = useSpring(mouseY, AURA_SPRING);

  // Refs for DOM nodes — avoid React re-renders for hover/press/visible
  const dotRef    = useRef(null);
  const ringRef   = useRef(null);
  const auraRef   = useRef(null);
  const wrapRef   = useRef(null);

  // rAF throttle
  const rafRef     = useRef(null);
  const pendingPos = useRef({ x: -300, y: -300 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // Show the cursor wrapper
    if (wrapRef.current) wrapRef.current.style.display = 'block';

    /* ── helpers that directly mutate DOM classes ── */
    const setHover = (on) => {
      dotRef.current?.classList.toggle('cur-hover', on);
      ringRef.current?.classList.toggle('cur-hover', on);
    };
    const setPress = (on) => {
      dotRef.current?.classList.toggle('cur-press', on);
      ringRef.current?.classList.toggle('cur-press', on);
    };
    const setVisible = (on) => {
      dotRef.current?.classList.toggle('cur-hidden', !on);
      ringRef.current?.classList.toggle('cur-hidden', !on);
      auraRef.current?.classList.toggle('cur-hidden', !on);
    };

    /* ── event handlers ── */
    const onMove = (e) => {
      pendingPos.current.x = e.clientX;
      pendingPos.current.y = e.clientY;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          mouseX.set(pendingPos.current.x);
          mouseY.set(pendingPos.current.y);
          rafRef.current = null;
        });
      }
      setVisible(true);
    };

    const onOver = (e) => {
      setHover(!!(e.target?.closest?.(INTERACTIVE_SELECTOR)));
    };

    const onDown  = () => setPress(true);
    const onUp    = () => setPress(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mouseover',  onOver,  { passive: true });
    window.addEventListener('mousedown',  onDown,  { passive: true });
    window.addEventListener('mouseup',    onUp,    { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseover',  onOver);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Inject cursor CSS once — no JS animation overhead */}
      <style>{`
        .cur-root { display: none; }

        /* ── aura ── */
        .cur-aura {
          position: fixed; top: 0; left: 0;
          width: 320px; height: 320px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9990;
          translate: -50% -50%;
          opacity: 0.12;
          transition: opacity 0.35s ease, scale 0.35s ease;
          will-change: transform, opacity;
        }
        .cur-aura.cur-hidden  { opacity: 0 !important; }
        .cur-aura .cur-aura-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          filter: blur(60px);
          background: radial-gradient(
            circle,
            var(--color-accent) 0%,
            var(--color-accent-2) 45%,
            transparent 70%
          );
        }

        /* ── ring ── */
        .cur-ring {
          position: fixed; top: 0; left: 0;
          width: 36px; height: 36px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9991;
          translate: -50% -50%;
          mix-blend-mode: difference;
          /* conic ring via mask */
          background: conic-gradient(
            from 0deg,
            transparent 0deg, #fff 70deg,
            transparent 180deg, #fff 260deg,
            transparent 360deg
          );
          -webkit-mask: radial-gradient(
            farthest-side,
            transparent calc(100% - 2px),
            #000 calc(100% - 2px)
          );
          mask: radial-gradient(
            farthest-side,
            transparent calc(100% - 2px),
            #000 calc(100% - 2px)
          );
          transition: scale 0.22s cubic-bezier(0.34,1.56,0.64,1),
                      opacity 0.2s ease;
          will-change: transform, scale, opacity;
        }
        .cur-ring.cur-hover  { scale: 1.9; animation: cur-spin 3s linear infinite; }
        .cur-ring.cur-press  { scale: 0.75 !important; }
        .cur-ring.cur-hidden { opacity: 0; }

        @keyframes cur-spin { to { rotate: 360deg; } }

        /* ── dot ── */
        .cur-dot {
          position: fixed; top: 0; left: 0;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #fff;
          pointer-events: none;
          z-index: 9992;
          translate: -50% -50%;
          mix-blend-mode: difference;
          transition: scale 0.18s cubic-bezier(0.34,1.56,0.64,1),
                      opacity 0.18s ease;
          will-change: transform, scale, opacity;
        }
        .cur-dot.cur-hover  { scale: 0.5; }
        .cur-dot.cur-press  { scale: 0.35 !important; }
        .cur-dot.cur-hidden { opacity: 0; }
      `}</style>

      <div ref={wrapRef} className="cur-root hidden md:block" aria-hidden="true">

        {/* Aura — slowest spring follow */}
        <motion.div
          ref={auraRef}
          className="cur-aura cur-hidden"
          style={{ x: auraX, y: auraY }}
        >
          <div className="cur-aura-inner" />
        </motion.div>

        {/* Ring — medium spring follow */}
        <motion.div
          ref={ringRef}
          className="cur-ring cur-hidden"
          style={{ x: ringX, y: ringY }}
        />

        {/* Dot — fastest spring, near-instant */}
        <motion.div
          ref={dotRef}
          className="cur-dot cur-hidden"
          style={{ x: dotX, y: dotY }}
        />

      </div>
    </>
  );
}
