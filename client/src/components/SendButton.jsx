import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

const FLIGHT = 0.45;
const FLIGHT_EASE = [0.45, -0.25, 0.8, 0.4];
const SENT_AT = 300;
const RESET_AFTER = 1600;
const SWAP = { type: "spring", duration: 0.3, bounce: 0 };

const P1 = { x: 36, y: 0 };
const P2 = { x: 84, y: -52 };
const along = (t) => ({
  x: 2 * (1 - t) * t * P1.x + t * t * P2.x,
  y: 2 * (1 - t) * t * P1.y + t * t * P2.y,
});

const heading = (t) =>
  (Math.atan2(
    2 * (1 - t) * P1.y + 2 * t * (P2.y - P1.y),
    2 * (1 - t) * P1.x + 2 * t * (P2.x - P1.x),
  ) *
    180) /
  Math.PI;

function Word({ visible, children }) {
  const base = "col-start-1 row-start-1 transition-[opacity,filter,translate] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const on = "translate-x-0 opacity-100 blur-[0px] duration-200";
  const off = "-translate-x-1 opacity-0 blur-[4px] duration-100";
  
  return (
    <span className={`${base} ${visible ? on : off}`}>
      {children}
    </span>
  );
}

export function SendButton({
  onSend,
  label = "Send",
  sentLabel = "Sent",
  variant = "solid",
  iconOnly = false,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const [status, setStatus] = useState("idle");
  const timers = useRef([]);
  const flight = useRef(undefined);

  const t = useMotionValue(0);
  const x = useTransform(t, (v) => along(v).x);
  const y = useTransform(t, (v) => along(v).y);
  const rotate = useTransform(t, heading);
  const scale = useTransform(t, [0, 1], [1, 0.75]);
  const opacity = useTransform(t, [0.55, 1], [1, 0]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      flight.current?.stop();
    },
    [],
  );

  const send = (e) => {
    if (status !== "idle" || disabled) return;
    onSend?.(e);
    setStatus("sending");
    
    flight.current = animate(t, 1, { duration: FLIGHT, ease: FLIGHT_EASE });
    
    timers.current = [
      setTimeout(() => setStatus("sent"), SENT_AT),
      setTimeout(() => {
        t.jump(0);
        setStatus("idle");
      }, RESET_AFTER),
    ];
  };

  const planeHome = status !== "sent";

  const baseClasses = "inline-flex h-9 touch-manipulation items-center justify-center gap-2 rounded-full text-[15px] font-medium outline-none select-none transition-[scale,background-color,opacity] duration-150 ease-out active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-highlight";
  const variantClasses = variant === "solid"
    ? "bg-highlight text-bg-main hover:bg-highlight/90"
    : "bg-bg-dark text-text-main shadow-lg hover:bg-bg-main border border-border-dim";
  const paddingClasses = iconOnly ? "w-7" : "pr-4 pl-3";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const cursorClasses = status !== "idle" ? "cursor-default" : "";

  return (
    <>
      <button
        type={type}
        aria-label={label}
        aria-disabled={status !== "idle" || disabled || undefined}
        onClick={send}
        className={`${baseClasses} ${variantClasses} ${paddingClasses} ${disabledClasses} ${cursorClasses} ${className}`}
        disabled={disabled}
        {...props}
      >
        <span aria-hidden="true" className={`grid ${iconOnly ? 'translate-x-px' : ''}`}>
          <motion.span
            className="col-start-1 row-start-1 flex"
            initial={false}
            animate={
              planeHome
                ? { scale: 1, opacity: 1, filter: "blur(0px)" }
                : { scale: 0.25, opacity: 0, filter: "blur(4px)" }
            }
            transition={
              planeHome
                ? SWAP
                : { duration: 0, delay: FLIGHT - SENT_AT / 1000 }
            }
          >
            <motion.svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ x, y, rotate, scale, opacity }}
            >
              <path d="M3.75 4.25 20.25 12 3.75 19.75 6.5 12Z" />
              <path d="M6.5 12h5.25" />
            </motion.svg>
          </motion.span>
          <motion.svg
            viewBox="0 0 24 24"
            className="col-start-1 row-start-1 size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={
              !planeHome
                ? { x: 0, opacity: 1, filter: "blur(0px)" }
                : { x: -8, opacity: 0, filter: "blur(4px)" }
            }
            transition={
              !planeHome ? SWAP : { duration: 0.12, ease: [0.23, 1, 0.32, 1] }
            }
          >
            <path d="m5 12.5 4.5 4.5L19 7" />
          </motion.svg>
        </span>

        {!iconOnly && (
          <span aria-hidden="true" className="grid">
            <Word visible={status === "idle"}>{label}</Word>
            <Word visible={status === "sent"}>{sentLabel}</Word>
          </span>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {status === "sent" ? sentLabel : ""}
      </span>
    </>
  );
}



