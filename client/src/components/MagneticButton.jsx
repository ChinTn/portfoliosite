import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const FIELD = 96;
const STRENGTH = 0.5;
const FOLLOW = { stiffness: 180, damping: 14, mass: 0.2 };
const LABEL_DEPTH = 0.5;
const STRETCH_PER_PX = 1 / 120;
const MAX_STRETCH = 0.12;
const WOBBLE = { stiffness: 320, damping: 10, mass: 0.5 };

export function MagneticButton({
  children,
  className = "",
  ...props
}) {
  const reduceMotion = false;
  const buttonRef = useRef(null);
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const x = useSpring(pullX, FOLLOW);
  const y = useSpring(pullY, FOLLOW);
  
  const stretchTarget = useTransform(() =>
    Math.min(Math.hypot(x.get(), y.get()) * STRETCH_PER_PX, MAX_STRETCH)
  );
  const stretch = useSpring(stretchTarget, WOBBLE);
  
  const heading = useRef(0);
  const angle = useTransform(() => {
    const dx = x.get();
    const dy = y.get();
    if (Math.hypot(dx, dy) > 1) heading.current = Math.atan2(dy, dx);
    return heading.current;
  });
  
  const transform = useTransform(() => {
    const s = stretch.get();
    const a = angle.get();
    return `translate(${x.get()}px, ${y.get()}px) rotate(${a}rad) scale(${1 + s}, ${1 - s / 2}) rotate(${-a}rad)`;
  });
  
  const labelTransform = useTransform(() => {
    const s = stretch.get();
    const a = angle.get();
    return `translate(${x.get() * LABEL_DEPTH}px, ${y.get() * LABEL_DEPTH}px) rotate(${a}rad) scale(${1 / (1 + s)}, ${1 / (1 - s / 2)}) rotate(${-a}rad)`;
  });

  const release = () => {
    pullX.set(0);
    pullY.set(0);
  };

  return (
    <div
      style={{ padding: FIELD, margin: -FIELD, pointerEvents: 'auto' }}
      onPointerMove={(e) => {
        if (reduceMotion || e.pointerType === "touch") return;
        const box = buttonRef.current?.getBoundingClientRect();
        if (!box) return;
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        const reach = Math.max(box.width, box.height) / 2 + FIELD;
        const t = Math.min(Math.hypot(dx, dy) / reach, 1);
        const strength = STRENGTH * (1 - t) ** 2;
        pullX.set(dx * strength);
        pullY.set(dy * strength);
      }}
      onPointerLeave={release}
    >
      <motion.div style={{ transform }}>
        <button
          ref={buttonRef}
          className={`transition-[scale] duration-150 ease-out active:scale-[0.96] ${className}`}
          {...props}
        >
          <motion.span
            className="flex items-center gap-2"
            style={{ transform: labelTransform }}
          >
            {children}
          </motion.span>
        </button>
      </motion.div>
    </div>
  );
}
