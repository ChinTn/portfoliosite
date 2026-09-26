import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const FLIP = { duration: 0.22, ease: [0.23, 1, 0.32, 1] };
const STAGGER = 0.018;
const WIDTH_MS = 320;

export function CopyEmail({
  email,
  copiedText = "Copied to clipboard",
  resetAfter = 1600,
  display,
  className = "",
}) {
  const reduceMotion = false;
  const [own, setStatus] = useState("idle");
  const status = display ?? own;
  const timer = useRef(undefined);
  const attempt = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (next) => {
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), resetAfter);
  };

  const copy = async () => {
    const id = ++attempt.current;
    show("copied");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
    } catch {
      if (id === attempt.current) show("failed");
    }
  };

  const shown =
    status === "copied" ? copiedText : status === "failed" ? "Couldn't copy" : email;
  const slots = Math.max(email.length, copiedText.length, 13);

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="group/copy relative inline-flex">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy email address ${email}`}
          className="relative flex h-10 touch-manipulation items-center rounded-md px-2 font-mono text-base text-text-dim outline-none transition-[scale,background-color] duration-150 ease-out select-none hover:bg-card-bg-light hover:text-text-main active:scale-[0.96]"
        >
          <span
            aria-hidden
            className="flex overflow-hidden transition-[width] ease-[cubic-bezier(0.77,0,0.175,1)]"
            style={{
              width: `${shown.length}ch`,
              transitionDuration: `${WIDTH_MS}ms`,
              perspective: 240,
            }}
          >
            {Array.from({ length: slots }, (_, i) => (
              <Letter
                key={i}
                char={shown[i] ?? " "}
                delay={i * STAGGER}
                reduceMotion={reduceMotion}
              />
            ))}
          </span>
        </button>

        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 translate-y-0.5 rounded-full bg-bg-nav border border-border-dim px-2 py-0.5 text-xs font-medium whitespace-nowrap text-text-dim opacity-0 transition-[opacity,translate] duration-100 ease-out [@media(hover:hover)]:group-hover/copy:translate-y-0 [@media(hover:hover)]:group-hover/copy:opacity-100 [@media(hover:hover)]:group-hover/copy:delay-300 [@media(hover:hover)]:group-hover/copy:duration-150 ${
            status !== "idle" ? "invisible" : ""
          }`}
        >
          Click to copy
        </span>
      </span>

      <a
        href={`mailto:${email}`}
        aria-label={`Email ${email}`}
        className="relative flex size-8 touch-manipulation items-center justify-center rounded-md text-text-dim outline-none transition-[scale,color,background-color] duration-150 ease-out after:absolute after:-inset-1.5 hover:bg-card-bg-light hover:text-text-main active:scale-[0.96]"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 11 11 5M6 5h5v5" />
        </svg>
      </a>

      <span className="sr-only" aria-live="polite">
        {own === "copied" ? "Copied to clipboard" : own === "failed" ? "Couldn't copy" : ""}
      </span>
    </span>
  );
}

function Letter({ char, delay, reduceMotion }) {
  const [faces, setFaces] = useState({ now: char, was: char });
  if (faces.now !== char) setFaces({ now: char, was: faces.now });

  const changed = faces.now !== faces.was;
  return (
    <span className="relative inline-block w-[1ch] shrink-0 whitespace-pre" style={{ transformStyle: "preserve-3d" }}>
      <motion.span
        key={`in-${faces.now}-${faces.was}`}
        className="block origin-[50%_50%_-0.5em]"
        style={{ backfaceVisibility: "hidden" }}
        initial={changed ? { rotateX: -90, opacity: 0 } : false}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ ...FLIP, delay }}
      >
        {faces.now}
      </motion.span>
      {changed ? (
        <motion.span
          key={`out-${faces.now}-${faces.was}`}
          aria-hidden
          className="absolute inset-0 block origin-[50%_50%_-0.5em]"
          style={{ backfaceVisibility: "hidden" }}
          initial={{ rotateX: 0, opacity: 1 }}
          animate={{ rotateX: 90, opacity: 0 }}
          transition={{ ...FLIP, delay }}
        >
          {faces.was}
        </motion.span>
      ) : null}
    </span>
  );
}
