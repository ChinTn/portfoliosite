import React, { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const OPEN_DELAY = 500;
const CLOSE_GRACE = 150;
const SKIP_DELAY_FOR = 300;
const CARD_WIDTH = 300;
const CARD_HEIGHT = 200;
const GAP = 8;
const EDGE = 12;
const EASE_OUT = [0.23, 1, 0.32, 1];

const CARD = {
  hidden: ({ instant, reduce }) => ({
    opacity: instant ? 1 : 0,
    scale: instant || reduce ? 1 : 0.96,
  }),
  shown: ({ instant }) => ({
    opacity: 1,
    scale: 1,
    transition: instant ? { duration: 0 } : { duration: 0.15, ease: EASE_OUT },
  }),
  exit: ({ instant, reduce }) => ({
    opacity: 0,
    scale: reduce ? 1 : 0.96,
    transition: { duration: instant ? 0 : 0.1, ease: EASE_OUT },
  }),
};

const TRAVEL = { duration: 260, easing: "cubic-bezier(0.32, 0.72, 0, 1)" };
const DEVELOP = { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" };

const GroupContext = createContext(null);

function measurePlace(el) {
  const rect = el.getBoundingClientRect();
  const below = window.innerHeight - rect.bottom;
  const side =
    below >= CARD_HEIGHT + GAP + EDGE || below >= rect.top ? "bottom" : "top";
  const width = Math.min(CARD_WIDTH, window.innerWidth - EDGE * 2);
  const centred = rect.left + rect.width / 2 - width / 2;
  const clamped = Math.min(
    Math.max(centred, EDGE),
    window.innerWidth - EDGE - width,
  );
  return {
    side,
    left: clamped - rect.left,
    originX: rect.left + rect.width / 2 - clamped,
  };
}

export function HoverCardGroup({ children }) {
  const [open, setOpen] = useState(null);
  const openRef = useRef(null);
  const openTimer = useRef(undefined);
  const closeTimer = useRef(undefined);
  const closedAt = useRef(-Infinity);
  const card = useRef(null);
  const lastRect = useRef(null);

  useEffect(() => () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  const cardRect = () =>
    card.current?.isConnected ? card.current.getBoundingClientRect() : undefined;

  const commit = (next) => {
    if (openRef.current && !next) {
      closedAt.current = performance.now();
      lastRect.current = cardRect() ?? null;
    }
    openRef.current = next;
    setOpen(next);
  };

  const group = {
    open,
    setCard: (el) => {
      card.current = el;
    },
    requestOpen: (id, measure, immediate) => {
      clearTimeout(closeTimer.current);
      const current = openRef.current;
      if (current?.id === id) return;
      clearTimeout(openTimer.current);
      const recent = performance.now() - closedAt.current < SKIP_DELAY_FOR;
      if (current) {
        commit({ id, place: measure(), instant: true, from: cardRect() });
      } else if (recent && lastRect.current) {
        commit({ id, place: measure(), instant: true, from: lastRect.current });
      } else if (immediate || recent) {
        commit({ id, place: measure(), instant: false });
      } else {
        openTimer.current = setTimeout(
          () => commit({ id, place: measure(), instant: false }),
          OPEN_DELAY,
        );
      }
    },
    requestClose: (id) => {
      clearTimeout(openTimer.current);
      if (openRef.current?.id !== id) return;
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => commit(null), CLOSE_GRACE);
    },
    closeNow: () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      if (openRef.current) commit(null);
    },
  };

  return <GroupContext.Provider value={group}>{children}</GroupContext.Provider>;
}

export function Mention({ profile }) {
  const group = useContext(GroupContext);
  if (!group) throw new Error("Mention must be inside a HoverCardGroup");
  const reduceMotion = false;
  const cardId = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const lastPointer = useRef("mouse");
  const [following, setFollowing] = useState(false);

  const state = group.open?.id === profile.id ? group.open : null;
  const isOpen = state !== null;
  const [lastPlace, setLastPlace] = useState(null);
  if (state && state.place !== lastPlace) setLastPlace(state.place);
  const place = state?.place ?? lastPlace;

  const measure = () => measurePlace(buttonRef.current);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const from = state?.from;

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!from || !el || !el.animate) return;
    const to = el.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const animations = [];
    if (!reduceMotion && (dx || dy)) {
      animations.push(
        el.animate({ translate: [`${dx}px ${dy}px`, "0 0"] }, TRAVEL),
      );
    }
    if (contentRef.current && contentRef.current.animate) {
      animations.push(
        contentRef.current.animate(
          reduceMotion
            ? { opacity: [0, 1] }
            : { opacity: [0, 1], filter: ["blur(4px)", "blur(0px)"] },
          DEVELOP,
        ),
      );
    }
    return () => animations.forEach((a) => a.cancel());
  }, [from, reduceMotion]);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) group.closeNow();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [isOpen, group]);

  const reduce = !!reduceMotion;
  const exitCustom = { instant: group.open !== null, reduce };
  const cardCustom = { instant: state?.instant ?? false, reduce };

  return (
    <span
      ref={rootRef}
      className="relative inline-block"
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") group.requestOpen(profile.id, measure);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") group.requestClose(profile.id);
      }}
      onFocus={(e) => {
        if (
          e.target === buttonRef.current &&
          e.target.matches(":focus-visible")
        )
          group.requestOpen(profile.id, measure, true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget))
          group.requestClose(profile.id);
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !isOpen) return;
        e.stopPropagation();
        group.closeNow();
        buttonRef.current?.focus();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? cardId : undefined}
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType;
        }}
        onClick={(e) => {
          const toggles = e.detail === 0 || lastPointer.current === "touch";
          if (isOpen && toggles) group.closeNow();
          else group.requestOpen(profile.id, measure, true);
        }}
        className="relative text-text-dim hover:text-highlight text-sm md:text-base font-bold transition-colors group py-2"
      >
        Credit
        <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-highlight transition-all duration-300 group-hover:w-full rounded-full"></span>
      </button>

      <AnimatePresence initial={false} custom={exitCustom}>
        {isOpen && place && (
          <motion.span
            key="card"
            ref={(el) => {
              cardRef.current = el;
              if (el) group.setCard(el);
            }}
            id={cardId}
            role="group"
            aria-label={`${profile.name}, ${profile.handle}`}
            custom={cardCustom}
            variants={CARD}
            initial="hidden"
            animate="shown"
            exit="exit"
            style={{
              left: place.left,
              transformOrigin: `${place.originX}px ${place.side === "bottom" ? "0%" : "100%"}`,
            }}
            className={cn(
              "absolute z-50 block w-[300px] max-w-[calc(100vw-24px)] rounded-[20px] bg-bg-card p-4 text-left text-[14px] leading-5 font-normal whitespace-normal text-text-main shadow-lg border border-border-dim",
              "before:absolute before:inset-x-0 before:h-3 before:content-['']",
              place.side === "bottom"
                ? "top-full mt-2 before:-top-3"
                : "bottom-full mb-2 before:-bottom-3"
            )}
          >
            <span ref={contentRef} className="block">
              <span className="flex items-start justify-between gap-3">
                <span className="block text-[15px] leading-relaxed text-text-main">
                  Many of the UI components are being used from <a href="https://lab.xevrion.dev/" target="_blank" rel="noreferrer" className="text-highlight font-bold hover:underline">lab.xevrion.dev</a> and the twitter account of that guy is <a href="https://x.com/xevrion_the1" target="_blank" rel="noreferrer" className="text-highlight font-bold hover:underline">@xevrion_the1</a>. Make sure you guys check him out !!
                </span>
              </span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function FollowButton({ following, onToggle, name }) {
  return (
    <button
      type="button"
      aria-pressed={following}
      aria-label={`Follow ${name}`}
      onClick={onToggle}
      className={cn(
        "grid h-8 rounded-full px-4 text-[13px] font-medium outline-none transition-[scale,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.96]",
        following
          ? "bg-bg-nav text-text-dim border border-border-dim"
          : "bg-highlight text-bg-main"
      )}
    >
      <span
        className={cn(
          "col-start-1 row-start-1 self-center transition-[opacity] duration-150",
          following ? "opacity-0" : "opacity-100"
        )}
      >
        Follow
      </span>
      <span
        aria-hidden
        className={cn(
          "col-start-1 row-start-1 self-center transition-[opacity] duration-150",
          !following ? "opacity-0" : "opacity-100"
        )}
      >
        Following
      </span>
    </button>
  );
}

const PEOPLE = {
  xevrion: {
    id: "xevrion",
    name: "Xevrion",
    handle: "@xevrion_the1",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Xevrion",
    bio: "Many of the UI components are being used from lab.xevrion.dev. Make sure you guys check him out !!",
    followers: 1200,
    following: 100,
  }
};

export default function CreditNavItem() {
  return (
    <HoverCardGroup>
      <Mention profile={PEOPLE.xevrion} />
    </HoverCardGroup>
  );
}
