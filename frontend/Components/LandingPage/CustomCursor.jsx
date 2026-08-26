'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor], iframe';

// Spring configs
const DOT_SPRING  = { stiffness: 2500, damping: 50,  mass: 0.08 };
const RING_SPRING = { stiffness: 500,  damping: 28,  mass: 0.25 };
const AURA_SPRING = { stiffness: 100,  damping: 22,  mass: 0.6  };

// Half-sizes for centering. These replace CSS "translate: -50% -50%" —
// mixing that CSS shorthand with Framer's x/y (transform) created two
// independent transform chains that broke across the navbar's
// backdrop-filter compositing boundary.
const DOT_HALF  = 4;
const RING_HALF = 18;
const AURA_HALF = 160;

// All CSS scale/rotate is also moved into Framer style props below.
// CSS `scale` and `rotate` are independent transform sources just like
// CSS `translate` — if left in CSS they composite separately from
// Framer's translateX/Y and cause the same jump on hover state changes.
const CURSOR_CSS = `
  .cur-root { display: none; }

  .cur-aura {
    position: fixed; top: 0; left: 0;
    width: 320px; height: 320px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9990;
    opacity: 0.12;
    transition: opacity 0.35s ease;
    will-change: transform, opacity;
  }
  .cur-aura.cur-hidden { opacity: 0 !important; }
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

  .cur-ring {
    position: fixed; top: 0; left: 0;
    width: 36px; height: 36px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9991;
    mix-blend-mode: difference;
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
    will-change: transform, opacity;
    transition: opacity 0.2s ease;
  }
  .cur-ring.cur-hidden { opacity: 0; }

  @keyframes cur-spin { to { rotate: 360deg; } }

  .cur-dot {
    position: fixed; top: 0; left: 0;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #fff;
    pointer-events: none;
    z-index: 9992;
    mix-blend-mode: difference;
    will-change: transform, opacity;
    transition: opacity 0.18s ease;
  }
  .cur-dot.cur-hidden { opacity: 0; }
`;

export default function CustomCursor() {
  // ── Raw mouse position ──────────────────────────────────────────────
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  // ── Dot (fastest spring) ────────────────────────────────────────────
  const dotRawX  = useSpring(mouseX, DOT_SPRING);
  const dotRawY  = useSpring(mouseY, DOT_SPRING);
  const dotX     = useTransform(dotRawX, (v) => v - DOT_HALF);
  const dotY     = useTransform(dotRawY, (v) => v - DOT_HALF);
  const dotScale = useMotionValue(1);

  // ── Ring (medium spring) ────────────────────────────────────────────
  const ringRawX  = useSpring(mouseX, RING_SPRING);
  const ringRawY  = useSpring(mouseY, RING_SPRING);
  const ringX     = useTransform(ringRawX, (v) => v - RING_HALF);
  const ringY     = useTransform(ringRawY, (v) => v - RING_HALF);
  const ringScale = useMotionValue(1);
  const ringRot   = useMotionValue(0);

  // ── Aura (slowest spring) ───────────────────────────────────────────
  const auraRawX = useSpring(mouseX, AURA_SPRING);
  const auraRawY = useSpring(mouseY, AURA_SPRING);
  const auraX    = useTransform(auraRawX, (v) => v - AURA_HALF);
  const auraY    = useTransform(auraRawY, (v) => v - AURA_HALF);

  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const auraRef  = useRef(null);
  const wrapRef  = useRef(null);

  // Track whether the ring spin animation is running
  const spinRef  = useRef(null);

  const rafRef     = useRef(null);
  const pendingPos = useRef({ x: -300, y: -300 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    if (wrapRef.current) wrapRef.current.style.display = 'block';

    // ── Scale helpers — all via Framer motion values ──────────────────
    // By keeping scale in the same Framer style prop object as x/y,
    // the browser sees a single transform: translateX/Y + scale on
    // the element and composites it atomically. This prevents the
    // jump that occurred when CSS `scale:` was used alongside Framer's
    // transform on hover/press.
    const setHover = (on) => {
      // Dot: shrink to 0.5 on hover
      animate(dotScale, on ? 0.5 : 1, {
        type: 'spring',
        stiffness: 400, damping: 28,
      });
      // Ring: grow to 1.9 on hover + start/stop spinning
      animate(ringScale, on ? 1.9 : 1, {
        type: 'spring',
        stiffness: 300, damping: 22,
      });
      if (on) {
        // Continuous 360° spin via Framer animate
        if (!spinRef.current) {
          spinRef.current = animate(ringRot, ringRot.get() + 360, {
            duration: 3,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          });
        }
      } else {
        spinRef.current?.stop();
        spinRef.current = null;
      }
    };

    const setPress = (on) => {
      animate(dotScale,  on ? 0.35 : 1, { type: 'spring', stiffness: 500, damping: 30 });
      animate(ringScale, on ? 0.75 : 1, { type: 'spring', stiffness: 500, damping: 30 });
    };

    const setVisible = (on) => {
      dotRef.current?.classList.toggle('cur-hidden', !on);
      ringRef.current?.classList.toggle('cur-hidden', !on);
      auraRef.current?.classList.toggle('cur-hidden', !on);
    };

    // ── Mouse event handlers ──────────────────────────────────────────
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

    const onOver  = (e) => setHover(!!(e.target?.closest?.(INTERACTIVE_SELECTOR)));
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
      spinRef.current?.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseover',  onOver);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY, dotScale, ringScale, ringRot]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CURSOR_CSS }} />

      <div ref={wrapRef} className="cur-root hidden md:block" aria-hidden="true">

        {/* Aura — slowest */}
        <motion.div
          ref={auraRef}
          className="cur-aura cur-hidden"
          style={{ x: auraX, y: auraY }}
        >
          <div className="cur-aura-inner" />
        </motion.div>

        {/* Ring — medium, scale + rotate now in Framer style (not CSS) */}
        <motion.div
          ref={ringRef}
          className="cur-ring cur-hidden"
          style={{ x: ringX, y: ringY, scale: ringScale, rotate: ringRot }}
        />

        {/* Dot — fastest, scale now in Framer style (not CSS) */}
        <motion.div
          ref={dotRef}
          className="cur-dot cur-hidden"
          style={{ x: dotX, y: dotY, scale: dotScale }}
        />

      </div>
    </>
  );
}
