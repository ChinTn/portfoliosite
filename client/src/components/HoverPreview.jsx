import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const CARD_W = 232;
const CARD_H = 160; // Approximate height of the popup
const GAP = 20; // Offset from cursor
const GUTTER = 8;
const EASE_OUT = [0.23, 1, 0.32, 1];
const FOLLOW = { stiffness: 260, damping: 26, mass: 0.6 };
const MAX_TILT = 7;
const TILT_AT_SPEED = 1400;
const TOUCH_LINGER = 1400;

export function HoverPreviewLink({
  title,
  domain,
  imageUrl,
  children,
  className = "",
  onClick
}) {
  const wrap = useRef(null);
  const [open, setOpen] = useState(null);
  const linger = useRef(undefined);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, FOLLOW);
  const y = useSpring(targetY, FOLLOW);
  const speed = useVelocity(x);
  
  const tilt = useSpring(
    useTransform(speed, [-TILT_AT_SPEED, TILT_AT_SPEED], [MAX_TILT, -MAX_TILT], {
      clamp: true,
    }),
    { stiffness: 400, damping: 30 },
  );

  useEffect(() => () => clearTimeout(linger.current), []);

  const scaleOf = (el, r) => (el.offsetWidth ? r.width / el.offsetWidth : 1);

  const place = (mode, clientX, clientY) => {
    const el = wrap.current;
    if (!el) return { left: 0, top: 0 };
    const r = el.getBoundingClientRect();
    
    // Calculate cursor position relative to the element
    const s = scaleOf(el, r);
    const relX = (clientX - r.left) / s;
    const relY = (clientY - r.top) / s;

    // Offset the card so it doesn't sit exactly under the cursor and block hover events
    return {
      left: relX + GAP,
      top: relY + GAP
    };
  };

  const show = (mode, clientX, clientY) => {
    const el = wrap.current;
    const { left, top } = place(mode, clientX, clientY);
    if (!el) return;
    
    clearTimeout(linger.current);
    
    if (!open) {
      targetX.jump(left);
      targetY.jump(top);
      x.jump(left);
      y.jump(top);
      tilt.jump(0);
    } else {
      targetX.set(left);
      targetY.set(top);
    }
    setOpen(mode);
  };

  const hide = () => {
    clearTimeout(linger.current);
    setOpen(null);
  };

  return (
    <span ref={wrap} className={`relative block w-full h-full cursor-pointer ${className}`} onClick={onClick}>
      <div
        onPointerEnter={(e) => {
          if (e.pointerType !== "touch") show("cursor", e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "touch" || !open) return;
          const { left, top } = place("cursor", e.clientX, e.clientY);
          targetX.set(left);
          targetY.set(top);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "touch") hide();
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") show("anchored", e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          if (e.pointerType !== "touch") return;
          clearTimeout(linger.current);
          linger.current = setTimeout(hide, TOUCH_LINGER);
        }}
        onPointerCancel={hide}
        className="w-full h-full block"
      >
        {children}
      </div>

      <AnimatePresence>
        {open && imageUrl ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-[100] block"
            style={{
              x,
              y,
              rotate: tilt,
              width: CARD_W,
              transformOrigin: "0% 0%",
            }}
          >
            <motion.span
              className="block overflow-hidden rounded-xl bg-bg-dark border border-border-dim p-1 shadow-glow"
              initial={{ opacity: 0, scale: 0.88, filter: "blur(4px)" }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transition: { duration: 0.18, ease: EASE_OUT },
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                filter: "blur(2px)",
                transition: { duration: 0.12, ease: EASE_OUT },
              }}
            >
              <span className="block h-[120px] w-full overflow-hidden rounded-lg bg-card-bg border-b border-border-dim/50">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </span>
              <span className="block px-2 pt-2 pb-1.5">
                <span className="block truncate text-[13px] font-bold text-text-main">
                  {title}
                </span>
                <span className="block truncate text-xs text-text-dim">{domain}</span>
              </span>
            </motion.span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
