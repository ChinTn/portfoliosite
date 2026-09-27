import React, { useEffect, useRef } from "react";

const HIDDEN_AT = {
  left: ["0%", "100%"],
  right: ["100%", "0%"],
};
const SHOWN = ["0%", "0%"];

function set(el, [l, r]) {
  el.style.setProperty("--ul-l", l);
  el.style.setProperty("--ul-r", r);
}

function draw(el, hidden, from) {
  if (hidden.current) {
    el.dataset.instant = "";
    set(el, HIDDEN_AT[from]);
    void el.offsetWidth;
    delete el.dataset.instant;
  }
  hidden.current = false;
  delete el.dataset.leaving;
  el.dataset.on = "";
  set(el, SHOWN);
}

function erase(el, toward) {
  el.dataset.leaving = "";
  delete el.dataset.on;
  set(el, HIDDEN_AT[toward]);
}

function sideOf(el, clientX) {
  const r = el.getBoundingClientRect();
  return clientX < r.left + r.width / 2 ? "left" : "right";
}

export function DirectionalLink({
  className = "",
  rest = false,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}) {
  const ref = useRef(null);
  const hidden = useRef(true);
  const hovered = useRef(false);

  // Replicate cn() logic
  const baseClasses = "relative inline-block rounded-[2px] leading-tight whitespace-nowrap text-highlight outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-highlight";
  const restClasses = rest ? "before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-[1px] before:bg-border-main" : "";
  const animationClasses = "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:bg-highlight after:[clip-path:inset(0_var(--ul-r,100%)_0_var(--ul-l,0%))] after:transition-[clip-path] after:duration-[240ms] after:ease-[cubic-bezier(0.23,1,0.32,1)] data-[leaving]:after:duration-[180ms] data-[instant]:after:transition-none motion-reduce:after:[clip-path:none] motion-reduce:after:opacity-0 motion-reduce:after:transition-[opacity] motion-reduce:hover:after:opacity-100 motion-reduce:focus-visible:after:opacity-100 motion-reduce:data-[on]:after:opacity-100";
  
  return (
    <a
      ref={ref}
      {...props}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (e.pointerType === "touch") return;
        hovered.current = true;
        draw(e.currentTarget, hidden, sideOf(e.currentTarget, e.clientX));
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        if (e.pointerType === "touch") return;
        hovered.current = false;
        if (e.currentTarget.matches(":focus-visible")) return;
        erase(e.currentTarget, sideOf(e.currentTarget, e.clientX));
      }}
      onFocus={(e) => {
        onFocus?.(e);
        if (e.currentTarget.matches(":focus-visible")) draw(e.currentTarget, hidden, "left");
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (!hovered.current) erase(e.currentTarget, "right");
      }}
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget || e.propertyName !== "clip-path") return;
        const l = e.currentTarget.style.getPropertyValue("--ul-l");
        const r = e.currentTarget.style.getPropertyValue("--ul-r");
        hidden.current = l === "100%" || r === "100%";
      }}
      className={`${baseClasses} ${restClasses} ${animationClasses} ${className}`}
    >
      {children}
    </a>
  );
}
