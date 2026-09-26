import React, { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

const GAP = 8;
const MIN_BAND = 14;
const MIN_BAND_LABELLED = 24;
const INLINE_MIN = 120;
const MARK_PAD = 4;
const READ_LINE = 0.3;
const END_SLACK = 4;
const JUMP_OFFSET = 16;
const LEAD = { type: "spring", visualDuration: 0.24, bounce: 0 };
const TRAIL = { type: "spring", visualDuration: 0.42, bounce: 0 };

function metrics(target) {
  if (target.kind === "window") {
    return {
      scrollTop: window.scrollY,
      viewport: window.innerHeight,
      height: document.documentElement.scrollHeight,
      offsetOf: (el) => el.getBoundingClientRect().top + window.scrollY,
    };
  }
  const box = target.el;
  const top = box.getBoundingClientRect().top;
  return {
    scrollTop: box.scrollTop,
    viewport: box.clientHeight,
    height: box.scrollHeight,
    offsetOf: (el) => el.getBoundingClientRect().top - top + box.scrollTop,
  };
}

export function ScrollSpine({
  items,
  scrollRef,
  height = 320,
  label = "On this page",
  className = "",
}) {
  const reduceMotion = false;
  const [bands, setBands] = useState([]);
  const [current, setCurrent] = useState(0);
  const [preview, setPreview] = useState(null);
  const [inline, setInline] = useState(true);
  const markTop = useMotionValue(0);
  const markBottom = useMotionValue(0);
  const markHeight = useTransform([markTop, markBottom], ([t, b]) => Math.max(0, b - t));
  const nav = useRef(null);
  const notch = useRef(null);
  const fills = useRef([]);
  const offsets = useRef([]);
  const docEnd = useRef(0);
  const bandsRef = useRef([]);
  const currentRef = useRef(0);
  const placed = useRef(false);

  const target = useCallback(() => {
    if (!scrollRef) return { kind: "window" };
    return scrollRef.current ? { kind: "element", el: scrollRef.current } : null;
  }, [scrollRef]);

  useEffect(() => {
    const el = nav.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setInline(entry.contentRect.width >= INLINE_MIN),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t = target();
    if (!t) return;
    const minBand = inline ? MIN_BAND_LABELLED : MIN_BAND;
    const measure = () => {
      const m = metrics(t);
      const tops = items.map((item) => {
        const el = document.getElementById(item.id);
        return el ? m.offsetOf(el) : 0;
      });
      offsets.current = tops;
      docEnd.current = m.height;
      const lens = tops.map((top, i) => Math.max(1, (tops[i + 1] ?? m.height) - top));
      const total = lens.reduce((a, b) => a + b, 0);
      const free = height - GAP * (items.length - 1) - minBand * items.length;
      let y = 0;
      const next = lens.map((len) => {
        const band = { top: y, height: minBand + (free * len) / total };
        y += band.height + GAP;
        return band;
      });
      bandsRef.current = next;
      setBands(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t.kind === "window" ? document.body : (t.el.firstElementChild ?? t.el));
    return () => ro.disconnect();
  }, [items, height, target, inline]);

  useEffect(() => {
    const t = target();
    if (!t || bands.length === 0) return;
    const scroller = t.kind === "window" ? window : t.el;
    let frame = 0;
    const update = () => {
      frame = 0;
      const m = metrics(t);
      const tops = offsets.current;
      const atEnd = m.scrollTop >= m.height - m.viewport - END_SLACK;
      const line = m.scrollTop + m.viewport * READ_LINE;
      let i = 0;
      while (i < tops.length - 1 && tops[i + 1] <= line) i++;
      if (atEnd) i = tops.length - 1;
      const start = tops[i];
      const end = tops[i + 1] ?? docEnd.current;
      const within = atEnd ? 1 : Math.min(1, Math.max(0, (line - start) / (end - start)));
      const band = bandsRef.current[i];
      if (band && notch.current) {
        notch.current.style.transform = `translateY(${band.top + within * band.height}px)`;
      }
      fills.current.forEach((f, k) => {
        if (f) f.style.transform = `scaleY(${k < i ? 1 : k === i ? within : 0})`;
      });
      if (i !== currentRef.current) {
        currentRef.current = i;
        setCurrent(i);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [bands, target]);

  useEffect(() => {
    const band = bands[current];
    if (!band) return;
    const top = band.top - MARK_PAD;
    const bottom = band.top + band.height + MARK_PAD;
    if (!placed.current || reduceMotion) {
      placed.current = true;
      markTop.jump(top);
      markBottom.jump(bottom);
      return;
    }
    const down = top >= markTop.get();
    animate(markTop, top, down ? TRAIL : LEAD);
    animate(markBottom, bottom, down ? LEAD : TRAIL);
  }, [bands, current, reduceMotion, markTop, markBottom]);

  useEffect(
    () => () => {
      markTop.stop();
      markBottom.stop();
    },
    [markTop, markBottom],
  );

  const jump = (i) => {
    const t = target();
    if (!t) return;
    const top = Math.max(0, offsets.current[i] - JUMP_OFFSET);
    const behavior = reduceMotion ? "auto" : "smooth";
    if (t.kind === "window") window.scrollTo({ top, behavior });
    else t.el.scrollTo({ top, behavior });
  };

  return (
    <nav
      ref={nav}
      aria-label={label}
      className={`relative w-[180px] shrink-0 select-none ${className}`}
      style={{ height }}
    >
      <motion.div
        aria-hidden
        style={{ top: markTop, height: markHeight }}
        className={`absolute rounded-lg bg-text-dim/10 ${
          inline ? "-left-2 right-0" : "left-1/2 w-5 -translate-x-1/2"
        }`}
      />
      <ol className="absolute inset-0 m-0 p-0 list-none">
        {bands.map((band, i) => {
          const active = i === current;
          const shown = preview === i && !inline;
          if (!items[i]) return null;
          return (
            <li
              key={items[i].id}
              className="absolute right-0 left-0 m-0 p-0"
              style={{ top: band.top, height: band.height }}
            >
              <span
                aria-hidden
                className={`absolute inset-y-0 w-[3px] overflow-hidden rounded-full bg-border-main ${
                  inline ? "left-0" : "left-1/2 -translate-x-1/2"
                }`}
              >
                <span
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  style={{ transform: "scaleY(0)" }}
                  className="absolute inset-0 origin-top rounded-full bg-highlight"
                />
              </span>
              <button
                type="button"
                aria-current={active ? "location" : undefined}
                onClick={() => jump(i)}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") setPreview(i);
                }}
                onPointerLeave={() => setPreview((p) => (p === i ? null : p))}
                onFocus={(e) => {
                  if (e.currentTarget.matches(":focus-visible")) setPreview(i);
                }}
                onBlur={() => setPreview((p) => (p === i ? null : p))}
                className={`group/band absolute w-full h-full touch-manipulation rounded-md text-left outline-none transition-[scale] duration-150 ease-out active:scale-[0.96] ${
                  inline ? "inset-y-0 -left-2 right-0 pl-5" : "inset-0"
                }`}
              >
                {inline ? (
                  <span
                    className={`block truncate text-[13px] leading-4 transition-[color] duration-150 ease-out ${
                      active
                        ? "font-bold text-text-main"
                        : "text-text-dim group-hover/band:text-text-main"
                    }`}
                  >
                    {items[i].label}
                  </span>
                ) : (
                  <span className="sr-only">{items[i].label}</span>
                )}
              </button>
              {!inline && (
                <span
                  aria-hidden
                  className={`pointer-events-none absolute top-0 right-full z-10 mr-1 rounded-full bg-bg-dark px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-text-main transition-[opacity,translate,filter] ease-out ${
                    shown
                      ? "translate-x-0 opacity-100 blur-none duration-200"
                      : "translate-x-1.5 opacity-0 blur-[2px] duration-100"
                  }`}
                >
                  {items[i].label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div
        ref={notch}
        aria-hidden
        className={`pointer-events-none absolute top-0 -mt-[4.5px] size-[9px] rounded-full bg-highlight ring-[3px] ring-bg-dark ${
          inline ? "-left-[3px]" : "left-1/2 -ml-[4.5px]"
        } ${bands.length === 0 ? "opacity-0" : ""}`}
      />
    </nav>
  );
}
