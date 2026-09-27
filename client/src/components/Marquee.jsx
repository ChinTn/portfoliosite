import React, { useEffect, useRef } from "react";

const STOP_MS = 300;
const RESUME_MS = 450;

export function Marquee({
  items,
  speed = 40,
  direction = "left",
  label,
  lens = true,
  className = "",
}) {
  const reduceMotion = false;
  const trackRef = useRef(null);
  const lensRef = useRef(null);
  const groupRef = useRef(null);
  const anims = useRef([]);
  const raf = useRef(0);
  const showLens = lens && !reduceMotion;

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group || reduceMotion) return;

    const run = (el) =>
      el.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
        {
          duration: (group.offsetWidth / speed) * 1000,
          iterations: Infinity,
          easing: "linear",
          direction: direction === "right" ? "reverse" : "normal",
        },
      );
    const all = [track, lensRef.current].filter((el) => el !== null).map(run);
    anims.current = all;

    const ro = new ResizeObserver(() => {
      const next = (group.offsetWidth / speed) * 1000;
      const [a] = all;
      const prev = Number(a.effect?.getTiming().duration) || next;
      if (Math.abs(next - prev) < 1) return;
      const at = (((Number(a.currentTime) || 0) % prev) / prev) * next;
      for (const b of all) {
        b.effect?.updateTiming({ duration: next });
        b.currentTime = at;
      }
    });
    ro.observe(group);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      all.forEach((a) => a.cancel());
      anims.current = [];
    };
  }, [reduceMotion, speed, direction, showLens]);

  const rampTo = (target) => {
    const all = anims.current;
    const a = all[0];
    if (!a) return;
    cancelAnimationFrame(raf.current);
    if (target > 0 && a.playState === "paused") all.forEach((b) => b.play());
    const from = a.playbackRate;
    const ms = (target === 0 ? STOP_MS : RESUME_MS) * Math.abs(target - from);
    const start = performance.now();
    const tick = (now) => {
      const t = ms > 0 ? Math.min(1, (now - start) / ms) : 1;
      const e =
        target === 0
          ? 1 - (1 - t) ** 3
          : t < 0.5
            ? 2 * t * t
            : 1 - (-2 * t + 2) ** 2 / 2;
      for (const b of all) b.playbackRate = from + (target - from) * e;
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else if (target === 0) all.forEach((b) => b.pause());
    };
    raf.current = requestAnimationFrame(tick);
  };

  const group = (hidden) => (
    <ul
      ref={hidden ? undefined : groupRef}
      role={hidden ? undefined : "list"}
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : label}
      className="flex shrink-0 items-center"
    >
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-center whitespace-nowrap px-2">
          <span className="px-4 py-2 bg-card-bg-light border border-border-main text-text-dim rounded-md text-sm font-medium hover:border-highlight hover:text-text-main transition-colors mx-1 pointer-events-auto">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") rampTo(0);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") rampTo(1);
      }}
      className={`relative overflow-hidden py-1 select-none [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${className}`}
    >
      <div
        ref={trackRef}
        className={`flex w-max ${showLens ? "opacity-30" : ""}`}
      >
        {group(false)}
        {!reduceMotion && group(true)}
      </div>
      {showLens && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 py-1 [mask-image:linear-gradient(to_right,transparent_28%,black_40%,black_60%,transparent_72%)]"
        >
          <div ref={lensRef} className="flex w-max">
            {group(true)}
            {group(true)}
          </div>
        </div>
      )}
    </div>
  );
}
