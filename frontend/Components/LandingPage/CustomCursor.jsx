'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor], iframe';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Dot — near-instant, almost no lag
  const dotX = useSpring(mouseX, { stiffness: 3000, damping: 60, mass: 0.1 });
  const dotY = useSpring(mouseY, { stiffness: 3000, damping: 60, mass: 0.1 });

  // Ring — snappy but with a slight trail feel
  const ringX = useSpring(mouseX, { stiffness: 600, damping: 30, mass: 0.3 });
  const ringY = useSpring(mouseY, { stiffness: 600, damping: 30, mass: 0.3 });

  // Aura — smooth and floaty, but noticeably faster now
  const auraX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.8 });
  const auraY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.8 });

  // rAF ref for throttling mousemove
  const rafRef = useRef(null);
  const pendingPos = useRef({ x: -200, y: -200 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    setEnabled(true);

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
      setHovering(
        !!(e.target && e.target.closest && e.target.closest(INTERACTIVE_SELECTOR))
      );
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <div className="hidden md:block" aria-hidden="true">
      {/* Slow-following aura glow */}
      <motion.div
        style={{ x: auraX, y: auraY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? (hovering ? 0.22 : 0.12) : 0,
          scale: hovering ? 1.25 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 left-0 z-[9990] pointer-events-none w-[340px] h-[340px] rounded-full"
        data-cursor-aura
      >
        <div
          className="w-full h-full rounded-full blur-[70px]"
          style={{
            background:
              'radial-gradient(circle, var(--color-accent) 0%, var(--color-accent-2) 45%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: pressed ? 0.75 : hovering ? 1.9 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.2 }}
        className="fixed top-0 left-0 z-[9991] pointer-events-none"
      >
        <motion.div
          animate={{ rotate: hovering ? 360 : 0 }}
          transition={
            hovering
              ? { duration: 3, repeat: Infinity, ease: 'linear' }
              : { duration: 0.3, ease: 'easeOut' }
          }
          className="w-9 h-9 rounded-full mix-blend-difference"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, #fff 70deg, transparent 180deg, #fff 260deg, transparent 360deg)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
          }}
        />
      </motion.div>

      {/* Instant dot */}
      <motion.div
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.4 : hovering ? 0.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 30, mass: 0.1 }}
        className="fixed top-0 left-0 z-[9992] pointer-events-none w-2 h-2 rounded-full bg-white mix-blend-difference"
      />
    </div>
  );
}
